/**
 * SERVEUR DE SALONS — point d'entrée.
 *
 * Trois routes seulement :
 *   POST /api/rooms        → tire un code libre et ouvre le salon
 *   GET  /api/rooms/:code  → ce code correspond-il à un salon ouvert ?
 *   GET  /ws?code=XXXX     → la connexion permanente du téléphone au salon
 *
 * Aucune base de données, aucun compte : un salon vit dans son objet et disparaît tout seul.
 */
import { CODE_ALPHABET, CODE_LENGTH, isRoomCode } from '../../src/online/protocol';

export { Room } from './room';

export interface Env {
  ROOMS: DurableObjectNamespace;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', ...CORS } });
}

/** Codes qu'on ne veut jamais afficher (grossièretés ou ambiguïtés) — à étoffer avant ouverture. */
const BANNED = new Set(['CULS', 'PUTE', 'FUCK', 'SHIT', 'CONS', 'SEXE', 'NAZI', 'VIOL', 'ARSE', 'CUNT']);

function randomCode(): string {
  let out = '';
  const bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < CODE_LENGTH; i++) out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return out;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

    if (url.pathname === '/api/rooms' && req.method === 'POST') {
      for (let i = 0; i < 12; i++) {
        const code = randomCode();
        if (BANNED.has(code)) continue;
        const stub = env.ROOMS.get(env.ROOMS.idFromName(code));
        const res = await stub.fetch(`https://room/claim?code=${code}`);
        const { ok } = (await res.json()) as { ok: boolean };
        if (ok) return json({ code });
      }
      return json({ error: 'aucun code libre, réessaie' }, 503);
    }

    const m = url.pathname.match(/^\/api\/rooms\/([A-Za-z]{4})$/);
    if (m && req.method === 'GET') {
      const code = m[1].toUpperCase();
      if (!isRoomCode(code)) return json({ exists: false });
      const stub = env.ROOMS.get(env.ROOMS.idFromName(code));
      return json(await (await stub.fetch(`https://room/exists?code=${code}`)).json());
    }

    if (url.pathname === '/ws') {
      const code = (url.searchParams.get('code') || '').toUpperCase();
      if (!isRoomCode(code)) return new Response('code invalide', { status: 400, headers: CORS });
      const stub = env.ROOMS.get(env.ROOMS.idFromName(code));
      return stub.fetch(`https://room/ws?code=${code}`, req);
    }

    return new Response('Football Undercover — serveur de salons', { headers: CORS });
  },
};
