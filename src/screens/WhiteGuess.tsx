import { useEffect, useState } from 'react';
import { CardIcon } from '../components/Icons';
import { QuitGame } from '../components/QuitGame';
import { Avatar, Button, Screen } from '../components/ui';
import { useCreator } from '../creator/CreatorContext';
import { isGuessLikelyCorrect, playerById } from '../game/engine';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { notify } from '../native';
import { useNav } from '../nav';

/**
 * Le carton blanc éliminé propose un mot. Le mot des titulaires n'est jamais affiché ici
 * (la partie peut continuer) : l'app suggère un verdict, les titulaires tranchent.
 */
export function WhiteGuess() {
  const { game, resolveWhite } = useGame();
  const creator = useCreator();
  const nav = useNav();
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);

  const white = game && game.pendingWhiteId ? playerById(game, game.pendingWhiteId) : undefined;
  useEffect(() => {
    if (!creator.recording || !white) return;
    creator.setScene({ type: 'guess', name: white.name, label: T.whiteGuess.prompt(white.name) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [white?.id, creator.recording]);

  if (!game || !white) return null;
  const likely = submitted ? isGuessLikelyCorrect(submitted, game.civilWord) : false;

  const decide = (correct: boolean) => {
    const next = resolveWhite(submitted ?? '', correct);
    if (!next) return;
    if (creator.recording) {
      creator.popup({ kind: 'guess', name: white.name, correct, guess: submitted ?? '', label: correct ? T.creator.guessRight : T.creator.guessWrong });
    }
    void notify(correct ? 'success' : 'error');
    if (next.phase === 'over') nav.replace({ name: 'result' });
    else nav.replace({ name: 'discuss' });
  };

  return (
    <Screen
      title={T.whiteGuess.title}
      right={<QuitGame />}
      footer={
        submitted ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant={likely ? 'secondary' : 'primary'} onClick={() => decide(false)}>
              {T.whiteGuess.reject}
            </Button>
            <Button variant={likely ? 'primary' : 'secondary'} onClick={() => decide(true)}>
              {T.whiteGuess.accept}
            </Button>
          </div>
        ) : (
          <Button disabled={!guess.trim()} onClick={() => setSubmitted(guess.trim())}>
            {T.whiteGuess.submit}
          </Button>
        )
      }
    >
      <div className="pass-to" style={{ paddingTop: 16 }}>
        <Avatar name={white.name} color={white.color} size="lg" dead />
        <CardIcon size={40} style={{ color: 'var(--role-white)' }} />
        <div className="display h2" style={{ maxWidth: 320 }}>
          {T.whiteGuess.prompt(white.name)}
        </div>
      </div>

      {!submitted ? (
        <form
          style={{ marginTop: 24 }}
          onSubmit={(e) => {
            e.preventDefault();
            if (guess.trim()) setSubmitted(guess.trim());
          }}
        >
          <input
            className="input"
            value={guess}
            placeholder={T.whiteGuess.placeholder}
            maxLength={60}
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="done"
            aria-label={T.whiteGuess.placeholder}
            onChange={(e) => setGuess(e.target.value)}
          />
        </form>
      ) : (
        <div className={`card ${likely ? 'gold' : ''}`} style={{ marginTop: 24, textAlign: 'center' }}>
          <span className="eyebrow">{T.whiteGuess.answered}</span>
          <div className="display h2" style={{ margin: '10px 0' }}>
            « {submitted} »
          </div>
          <p className={likely ? 'gold' : 'muted'} style={{ marginBottom: 6 }}>
            {likely ? T.whiteGuess.likelyRight : T.whiteGuess.likelyWrong}
          </p>
          <p className="text-2" style={{ margin: 0 }}>
            {T.whiteGuess.ask}
          </p>
        </div>
      )}
    </Screen>
  );
}
