import type { GroupDef } from './types';

/** Pack Pro — clubs, trophées, stades, compétitions, moments, memes, styles. */
export const PRO_MORE: GroupDef[] = [
  /* ------------------------------------------------------------------ */
  /* Clubs                                                                */
  /* ------------------------------------------------------------------ */
  { cat: 'club', words: ['Manchester United', 'Liverpool', 'Arsenal', 'Chelsea', 'Manchester City', 'Tottenham', 'Newcastle', 'Aston Villa'] },
  { cat: 'club', words: ['Real Madrid', ['FC Barcelone', 'FC Barcelona'], 'Atlético de Madrid', ['Séville FC', 'Sevilla FC'], ['Valence CF', 'Valencia CF'], 'Athletic Bilbao'] },
  { cat: 'club', words: ['Juventus', 'Inter Milan', 'AC Milan', ['Naples', 'Napoli'], 'AS Roma', 'Lazio'] },
  { cat: 'club', words: ['PSG', ['Olympique de Marseille', 'Marseille'], ['Olympique Lyonnais', 'Lyon'], 'AS Monaco', ['LOSC Lille', 'Lille'], 'RC Lens', 'OGC Nice', ['Stade Rennais', 'Rennes'], 'FC Nantes', ['AS Saint-Étienne', 'Saint-Étienne']] },
  { cat: 'club', words: ['Bayern Munich', 'Borussia Dortmund', 'Bayer Leverkusen', 'RB Leipzig', 'Schalke 04', ['Eintracht Francfort', 'Eintracht Frankfurt'], 'VfB Stuttgart'] },
  { cat: 'club', words: [['Girondins de Bordeaux', 'Bordeaux'], 'Montpellier', 'Toulouse', 'Strasbourg', 'Stade de Reims', ['Stade Brestois', 'Brest'], 'Le Havre', 'FC Metz', 'AJ Auxerre', 'Lorient'] },
  { cat: 'club', words: ['Al-Nassr', 'Al-Hilal', 'Al-Ittihad', 'Al-Ahli'] },

  /* ------------------------------------------------------------------ */
  /* Trophées                                                             */
  /* ------------------------------------------------------------------ */
  {
    cat: 'trophee',
    words: [
      "Ballon d'Or",
      'Golden Boy',
      ['Trophée Yachine', 'Yashin Trophy'],
      ['Trophée Puskás', 'Puskás Award'],
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Stades                                                               */
  /* ------------------------------------------------------------------ */
  { cat: 'stade', words: ['Old Trafford', 'Anfield', 'Wembley', 'Emirates Stadium', 'Etihad Stadium', 'Stamford Bridge'] },
  { cat: 'stade', words: ['Camp Nou', 'Santiago Bernabéu', 'Metropolitano', 'San Siro', 'Allianz Stadium (Juventus)'] },
  { cat: 'stade', words: ['Parc des Princes', 'Stade de France', 'Stade Vélodrome', 'Groupama Stadium', 'Stade Bollaert', 'Stade Geoffroy-Guichard'] },
  {
    cat: 'stade',
    words: [
      'Maracanã',
      'La Bombonera',
      ['Stade 974 de Doha, 1er stade démontable', 'Stadium 974 in Doha, the first dismantlable stadium'],
      'Allianz Arena',
      'Signal Iduna Park',
      'Estádio da Luz',
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Compétitions                                                         */
  /* ------------------------------------------------------------------ */
  {
    cat: 'competition',
    words: [
      ['Coupe du monde 1998', '1998 World Cup'],
      ['Coupe du monde 2002', '2002 World Cup'],
      ['Coupe du monde 2006', '2006 World Cup'],
      ['Coupe du monde 2010', '2010 World Cup'],
      ['Coupe du monde 2014', '2014 World Cup'],
      ['Coupe du monde 2018', '2018 World Cup'],
      ['Coupe du monde 2022', '2022 World Cup'],
      ['Coupe du monde 1986', '1986 World Cup'],
    ],
  },
  { cat: 'competition', words: ['Euro 2000', 'Euro 2016', 'Euro 2024', 'Euro 2004'] },

  /* ------------------------------------------------------------------ */
  /* Moments légendaires — regroupés par ressemblance                     */
  /* ------------------------------------------------------------------ */
  // Buts de la dernière seconde
  {
    cat: 'but',
    words: [
      ['Le but de Sergio Ramos à la 93e (Lisbonne 2014)', "Sergio Ramos's 93rd-minute goal (Lisbon 2014)"],
      ['Le but de Sergi Roberto à la 95e (Remontada 2017)', "Sergi Roberto's 95th-minute goal (Remontada 2017)"],
      ["Le but d'Agüero à la 94e (titre 2012)", "Agüero's 94th-minute goal (2012 title)"],
      ['La volée de Payet à la 89e (Euro 2016)', "Payet's 89th-minute volley (Euro 2016)"],
    ],
  },
  // Cartons et humiliations
  {
    cat: 'but',
    words: [
      ['La Remontada (Barça 6-1 PSG, 2017)', 'The Remontada (Barça 6-1 PSG, 2017)'],
      ['Le 4-0 de Liverpool contre le Barça (2019)', "Liverpool's 4-0 vs Barça (2019)"],
      ['Le 7-1 (Brésil – Allemagne 2014)', 'The 7-1 (Brazil v Germany 2014)'],
      ['Le 8-2 (Bayern – Barça 2020)', 'The 8-2 (Bayern v Barça 2020)'],
      ['Le 5-0 du PSG en finale (Munich 2025)', "PSG's 5-0 in the final (Munich 2025)"],
    ],
  },
  // Dynasties et records collectifs
  {
    cat: 'but',
    words: [
      ["Les Invincibles d'Arsenal (2004)", "Arsenal's Invincibles (2004)"],
      ['Les trois Ligues des champions de suite du Real (2016–2018)', "Real's three Champions Leagues in a row (2016–2018)"],
      ['Le sextuplé du Barça (2009)', "Barça's sextuple (2009)"],
      ['Le sextuplé du Bayern (2020)', "Bayern's sextuple (2020)"],
    ],
  },
  // Mains et tricheries
  {
    cat: 'but',
    words: [
      ['La main de Maradona (1986)', "Maradona's handball (1986)"],
      ['La main de Suárez (2010)', "Suárez's handball (2010)"],
      ['La main de Thierry Henry (2009)', "Thierry Henry's handball (2009)"],
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Memes                                                                */
  /* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */
  /* Styles de jeu                                                        */
  /* ------------------------------------------------------------------ */
  // Postes
  { cat: 'style', words: [['Libéro', 'Sweeper'], ['Stoppeur', 'Stopper'], ['Meneur de jeu', 'Playmaker'], ['Faux 9', 'False 9'], ['Piston', 'Wing-back'], ['Ailier', 'Winger']] },

  /* Anciens groupes gratuits (passés en Pro le 11/09/2026) */
  // Tactiques
  { cat: 'style', words: ['Tiki-taka', 'Catenaccio', ['Contre-attaque', 'Counter-attack']] },
];
