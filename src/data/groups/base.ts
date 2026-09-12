import type { GroupDef } from './types';

/**
 * Base gratuite : les groupes les plus iconiques, toutes catégories représentées (2 à 3 par catégorie hors joueurs)
 * (décision d'Arsène, 11/09/2026 : « genre 20 groupes gratuits et le reste tout payant »).
 * Une entrée est soit un nom identique dans les deux langues, soit [français, anglais].
 * Le jeu tire deux mots différents par groupe : les duos changent à chaque partie.
 *
 * Groupes de joueurs PETITS (4 à 6 noms) et SERRÉS : même poste, même époque, même profil.
 * Que des noms connus de tous. C'est ce qui rend l'imposteur difficile à démasquer
 * (décisions d'Arsène, 10/09/2026).
 */
export const BASE: GroupDef[] = [
  /* Joueurs */
  // Grands finisseurs des années 2020
  { cat: 'joueur', words: ['Kane', 'Lukaku', 'Lewandowski', 'Haaland', 'Osimhen'] },

  // Dribbleurs du PSG, du Barça et du Real d'aujourd'hui
  { cat: 'joueur', words: ['Neymar', 'Lamine Yamal', 'Désiré Doué', 'Vinícius Jr'] },
  // Milieux techniques, toutes époques
  { cat: 'joueur', words: ['Vitinha', 'Modrić', 'Iniesta', 'Bruno Fernandes', 'Verratti'] },
  // Champions du monde 2018
  { cat: 'joueur', words: ['Pogba', 'Griezmann', 'Kanté', 'Matuidi'] },
  // Ailiers de Ligue des champions
  { cat: 'joueur', words: ['Bale', 'Robben', 'Di María', 'Hazard', 'Vinícius Jr', 'Mbappé'] },
  // Patrons de défense
  { cat: 'joueur', words: ['Marquinhos', 'Van Dijk', 'Sergio Ramos', 'Thiago Silva'] },
  // Les trois Ronaldo
  { cat: 'joueur', words: ['Cristiano Ronaldo', 'Ronaldo (R9)', 'Ronaldinho'] },
  // Les plus grands de l'histoire
  { cat: 'joueur', words: ['Ronaldo (R9)', 'Pelé', 'Maradona', 'Messi', 'Cristiano Ronaldo', 'Zidane', 'Mbappé'] },
  // Milieux de très haut niveau : sentinelles et relayeurs
  { cat: 'joueur', words: ['Busquets', 'Casemiro', 'Thiago Motta', 'Xavi', 'Kroos', 'Iniesta', 'Rodri'] },
  // Génération 87 française
  { cat: 'joueur', words: ['Ben Arfa', 'Nasri', 'Ménez', 'Benzema', 'Gourcuff'] },
  // Les grands buteurs des années 2010–2020
  { cat: 'joueur', words: ['Suárez', 'Falcao', 'Cavani', 'Ibrahimović', 'Lewandowski'] },
  // Attaquants français ultra-rapides
  { cat: 'joueur', words: ['Mbappé', 'Henry', 'Martial', 'Anelka'] },
  // Gardiens
  { cat: 'joueur', words: ['Maignan', 'Areola', 'Lloris', 'Donnarumma', 'Buffon'] },

  /* Clubs : petits groupes d'un même championnat */
  // Les gros de Ligue 1
  { cat: 'club', words: ['PSG', ['Olympique de Marseille', 'Marseille'], ['Olympique Lyonnais', 'Lyon'], 'AS Monaco', ['LOSC Lille', 'Lille'], 'RC Lens'] },

  /* Trophées */
  // Trophées de sélection
  { cat: 'trophee', words: [['Coupe du monde', 'World Cup'], ['Euro', 'Euros'], 'Copa América', ["Coupe d'Afrique des nations", 'AFCON'], ['Ligue des nations', 'Nations League']] },

  /* Stades */
  // Stades anglais
  { cat: 'stade', words: ['Old Trafford', 'Anfield', 'Etihad Stadium', 'Emirates Stadium', 'Stamford Bridge', 'Tottenham Hotspur Stadium'] },

  /* Compétitions */
  // Les cinq grands championnats
  { cat: 'competition', words: ['Premier League', ['Liga', 'La Liga'], 'Serie A', 'Bundesliga', 'Ligue 1'] },

  /* Moments légendaires */
  // Les remontadas
  {
    cat: 'but',
    words: [
      ['La Remontada (Barça 6-1 PSG, 2017)', 'The Remontada (Barça 6-1 PSG, 2017)'],
      ['Le 4-0 de Liverpool contre le Barça (2019)', "Liverpool's 4-0 vs Barça (2019)"],
      ['Le retour du Real contre City (2022)', "Real's comeback against City (2022)"],
      ['Le 3-0 de la Roma contre le Barça (2018)', "Roma's 3-0 against Barça (2018)"],
      ["Le retour de l'Ajax à Madrid (2019)", "Ajax's comeback in Madrid (2019)"],
    ],
  },

  /* Memes */
  // Célébrations cultes
  {
    cat: 'meme',
    words: [
      ['Le « Siuuu » de Cristiano Ronaldo', 'Cristiano Ronaldo\'s "Siuuu"'],
      ['Le dab de Pogba', "Pogba's dab"],
      ['Le « Take the L » de Griezmann', 'Griezmann\'s "Take the L"'],
      ['Le « ice in the veins » de Cole Palmer', 'Cole Palmer\'s "ice in the veins"'],
      ['Les bras croisés de Mbappé', "Mbappé's crossed arms"],
      ['La danse de Vinícius', "Vinícius's dance"],
    ],
  },

  /* Lexique */
  // Frappes
  { cat: 'style', words: [['Lucarne', 'Top corner'], ['Coup du foulard', 'Trivela'], ['Retourné', 'Bicycle kick'], ['Reprise de volée', 'Volley'], 'Panenka', ['Frappe enroulée', 'Curler']] },

  /* Entraîneurs */
  // Les tacticiens du moment
  { cat: 'entraineur', words: ['Guardiola', 'Klopp', 'Ancelotti', 'Luis Enrique', 'Xabi Alonso', 'Hansi Flick'] },
];
