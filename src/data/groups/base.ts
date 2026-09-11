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
  // Les gros de Premier League
  { cat: 'club', words: ['Manchester City', 'Arsenal', 'Liverpool', 'Chelsea', 'Manchester United', 'Tottenham'] },
  // Les gros de Ligue 1
  { cat: 'club', words: ['PSG', ['Olympique de Marseille', 'Marseille'], ['Olympique Lyonnais', 'Lyon'], 'AS Monaco', ['LOSC Lille', 'Lille'], 'RC Lens'] },

  /* Trophées */
  // Trophées de sélection
  { cat: 'trophee', words: [['Coupe du monde', 'World Cup'], ['Euro', 'Euros'], 'Copa América', ["Coupe d'Afrique des nations", 'AFCON'], ['Ligue des nations', 'Nations League']] },
  // Trophées individuels
  {
    cat: 'trophee',
    words: ["Ballon d'Or", 'The Best FIFA', ["Soulier d'or", 'Golden Shoe'], ['Trophée Kopa', 'Kopa Trophy'], ['Trophée Yachine', 'Yashin Trophy'], 'Golden Boy', ['Trophée Puskás', 'Puskás Award']],
  },

  /* Stades */
  // Stades anglais
  { cat: 'stade', words: ['Old Trafford', 'Anfield', 'Etihad Stadium', 'Emirates Stadium', 'Stamford Bridge', 'Tottenham Hotspur Stadium'] },
  // Stades français
  { cat: 'stade', words: ['Parc des Princes', 'Stade de France', 'Stade Vélodrome', 'Groupama Stadium', 'Stade Bollaert-Delelis', 'Stade Louis-II', 'Stade Geoffroy-Guichard'] },

  /* Compétitions */
  // Les cinq grands championnats
  { cat: 'competition', words: ['Premier League', ['Liga', 'La Liga'], 'Serie A', 'Bundesliga', 'Ligue 1'] },
  // Les nouveaux formats
  { cat: 'competition', words: [['Coupe du monde des clubs', 'Club World Cup'], 'Kings League', 'Baller League', ['Ligue des nations', 'Nations League'], ['Ligue Europa Conférence', 'Conference League']] },

  /* Moments légendaires */
  // Finales de Coupe du monde
  {
    cat: 'but',
    words: [
      ['Le coup de boule de Zidane (finale 2006)', "Zidane's headbutt (2006 final)"],
      ['La panenka de Zidane (finale 2006)', "Zidane's Panenka (2006 final)"],
      ['Le doublé de Zidane en finale (1998)', "Zidane's brace in the final (1998)"],
      ['Le triplé de Mbappé en finale (2022)', "Mbappé's hat-trick in the final (2022)"],
      ["Le but d'Iniesta en finale de Coupe du monde (2010)", "Iniesta's World Cup final goal (2010)"],
      ['Le but de Götze en finale (2014)', "Götze's goal in the final (2014)"],
    ],
  },
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
  // Buts de la dernière seconde
  {
    cat: 'but',
    words: [
      ['Le but de Sergio Ramos à la 93e (Lisbonne 2014)', "Sergio Ramos's 93rd-minute goal (Lisbon 2014)"],
      ["Le but d'Agüero à la 94e (titre 2012)", "Agüero's 94th-minute goal (2012 title)"],
      ['Le doublé de Rodrygo dans le temps additionnel (2022)', "Rodrygo's stoppage-time brace (2022)"],
      ["Le triplé de Lucas Moura contre l'Ajax (2019)", "Lucas Moura's hat-trick vs Ajax (2019)"],
      ['Le but de Sergi Roberto à la 95e (Remontada 2017)', "Sergi Roberto's 95th-minute goal (Remontada 2017)"],
      ['La volée de Payet à la 89e (Euro 2016)', "Payet's 89th-minute volley (Euro 2016)"],
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
  // Les flops à 100 millions
  {
    cat: 'meme',
    words: [
      ['Coutinho à Barcelone', 'Coutinho at Barcelona'],
      ['Antony à Manchester United', 'Antony at Manchester United'],
      ["João Félix à l'Atlético", 'João Félix at Atlético'],
      ['Lukaku à Chelsea', 'Lukaku at Chelsea'],
      ['Mudryk à Chelsea', 'Mudryk at Chelsea'],
      ['Neymar à Al-Hilal', 'Neymar at Al-Hilal'],
    ],
  },

  /* Lexique */
  // Dribbles
  { cat: 'style', words: [['Petit pont', 'Nutmeg'], ['Grand pont', 'Knock-and-run'], 'Roulette', ['Virgule', 'Elastico'], ['Sombrero', 'Sombrero flick'], ['Crochet', 'Chop'], ['Passement de jambes', 'Step-over']] },
  // Frappes
  { cat: 'style', words: [['Lucarne', 'Top corner'], ['Coup du foulard', 'Trivela'], ['Retourné', 'Bicycle kick'], ['Reprise de volée', 'Volley'], 'Panenka', ['Frappe enroulée', 'Curler']] },
  // Les mots du mercato
  {
    cat: 'style',
    words: ['Mercato', ['Clause libératoire', 'Release clause'], ["Prêt avec option d'achat", 'Loan with option to buy'], ['Bon de sortie', 'Permission to leave'], ['Indemnité de transfert', 'Transfer fee'], 'Agent'],
  },

  /* Entraîneurs */
  // Les tacticiens du moment
  { cat: 'entraineur', words: ['Guardiola', 'Klopp', 'Ancelotti', 'Luis Enrique', 'Xabi Alonso', 'Hansi Flick'] },
  // Les entraîneurs du PSG
  { cat: 'entraineur', words: ['Laurent Blanc', 'Unai Emery', 'Tuchel', 'Pochettino', 'Galtier', 'Luis Enrique'] },
  // Les légendes du banc
  { cat: 'entraineur', words: ['Sir Alex Ferguson', 'Arsène Wenger', 'Mourinho', 'Guy Roux', 'Simeone', 'Zidane'] },
];
