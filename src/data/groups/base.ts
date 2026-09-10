import type { GroupDef } from './types';

/**
 * Base gratuite : exactement 275 mots (74 % de joueurs), toutes catégories représentées.
 * Une entrée est soit un nom identique dans les deux langues, soit [français, anglais].
 * Le jeu tire deux mots différents par groupe : les duos changent à chaque partie.
 *
 * Groupes de joueurs PETITS (4 à 6 noms) et SERRÉS : même poste, même époque, même profil.
 * Que des noms connus de tous. C'est ce qui rend l'imposteur difficile à démasquer
 * (décisions d'Arsène, 10/09/2026).
 */
export const BASE: GroupDef[] = [
  /* Joueurs (203) */
  // Petits milieux techniques des années 2010
  { cat: 'joueur', words: ['Iniesta', 'Xavi', 'Verratti', 'Thiago Alcântara', 'David Silva', 'Modrić'] },
  // Milieux techniques des années 2020
  { cat: 'joueur', words: ['Pedri', 'Gavi', 'Bernardo Silva', 'Vitinha', 'João Neves'] },
  // Grands finisseurs des années 2020
  { cat: 'joueur', words: ['Kane', 'Lukaku', 'Lewandowski', 'Haaland', 'Osimhen'] },
  // Ailiers rapides de Premier League, années 2010
  { cat: 'joueur', words: ['Henry', 'Walcott', 'Aubameyang', 'Sterling', 'Sané'] },
  // Ailiers de Premier League, années 2020
  { cat: 'joueur', words: ['Salah', 'Saka', 'Son Heung-min', 'Rashford', 'Mané'] },
  // Dribbleurs des années 2010
  { cat: 'joueur', words: ['Neymar', 'Hazard', 'Robben', 'Ribéry', 'Dembélé'] },
  // Dribbleurs des années 2020
  { cat: 'joueur', words: ['Vinícius Jr', 'Kvaratskhelia', 'Lamine Yamal', 'Désiré Doué', 'Rafael Leão'] },
  // Dribbleurs de légende
  { cat: 'joueur', words: ['Ronaldinho', 'Garrincha', 'Okocha', 'Robinho', 'Quaresma'] },
  // Meneurs de jeu des années 2000
  { cat: 'joueur', words: ['Zidane', 'Kaká', 'Totti', 'Del Piero', 'Rui Costa', 'Riquelme'] },
  // Créateurs des années 2010–2020
  { cat: 'joueur', words: ['De Bruyne', 'Özil', 'Griezmann', 'Ødegaard', 'Bruno Fernandes'] },
  // Récupérateurs des années 2000
  { cat: 'joueur', words: ['Makélélé', 'Vieira', 'Roy Keane', 'Gattuso', 'Essien'] },
  // Sentinelles des années 2010–2020
  { cat: 'joueur', words: ['Kanté', 'Rodri', 'Casemiro', 'Busquets', 'Tchouaméni'] },
  // Box-to-box
  { cat: 'joueur', words: ['Gerrard', 'Lampard', 'Yaya Touré', 'Pogba', 'Bellingham'] },
  // Défenseurs centraux des années 2000
  { cat: 'joueur', words: ['Maldini', 'Cannavaro', 'Puyol', 'Desailly', 'Terry'] },
  // Défenseurs centraux des années 2010–2020
  { cat: 'joueur', words: ['Sergio Ramos', 'Piqué', 'Van Dijk', 'Varane', 'Chiellini'] },
  // Latéraux des années 2000
  { cat: 'joueur', words: ['Roberto Carlos', 'Cafu', 'Lahm', 'Ashley Cole', 'Evra'] },
  // Latéraux des années 2010–2020
  { cat: 'joueur', words: ['Dani Alves', 'Marcelo', 'Alexander-Arnold', 'Robertson', 'Hakimi'] },
  // Gardiens de légende
  { cat: 'joueur', words: ['Buffon', 'Casillas', 'Kahn', 'Barthez', 'Čech'] },
  // Gardiens d'aujourd'hui
  { cat: 'joueur', words: ['Neuer', 'Courtois', 'Oblak', 'Ter Stegen', 'Donnarumma'] },
  // Ballons d'Or des années 2000
  { cat: 'joueur', words: ['Ronaldo (R9)', 'Rivaldo', 'Figo', 'Shevchenko', 'Nedvěd', 'Owen'] },
  // Ballons d'Or des années 2010–2020
  { cat: 'joueur', words: ['Messi', 'Cristiano Ronaldo', 'Benzema', 'Rodri', 'Dembélé'] },
  // Attaquants vifs des années 2010
  { cat: 'joueur', words: ['Agüero', 'Tévez', 'Suárez', 'Dybala', 'Fernando Torres'] },
  // Attaquants des années 2020
  { cat: 'joueur', words: ['Lautaro Martínez', 'Julián Álvarez', 'Mbappé', 'Kolo Muani', 'Marcus Thuram'] },
  // Jeunes cracks des années 2020
  { cat: 'joueur', words: ['Musiala', 'Wirtz', 'Zaïre-Emery', 'Endrick', 'Kenan Yıldız'] },
  // Icônes absolues
  { cat: 'joueur', words: ['Pelé', 'Maradona', 'Cruyff', 'Platini', 'Beckenbauer'] },

  /* Groupes d'Arsène (10/09/2026) : ses duos favoris, en accès libre (75 mots) */
  // Dribbleurs du PSG, du Barça et du Real d'aujourd'hui
  { cat: 'joueur', words: ['Neymar', 'Lamine Yamal', 'Désiré Doué', 'Vinícius Jr'] },
  // Milieux techniques, toutes époques
  { cat: 'joueur', words: ['Vitinha', 'Modrić', 'Iniesta', 'Bruno Fernandes', 'Verratti'] },
  // Champions du monde 2018
  { cat: 'joueur', words: ['Pogba', 'Griezmann', 'Kanté'] },
  // Les magiciens
  { cat: 'joueur', words: ['Ronaldinho', 'Neymar', 'Lamine Yamal'] },
  // Ailiers de Ligue des champions
  { cat: 'joueur', words: ['Bale', 'Robben', 'Di María', 'Hazard', 'Vinícius Jr'] },
  // Patrons de défense
  { cat: 'joueur', words: ['Marquinhos', 'Van Dijk', 'Sergio Ramos', 'Thiago Silva'] },
  // Les trois Ronaldo
  { cat: 'joueur', words: ['Cristiano Ronaldo', 'Ronaldo (R9)', 'Ronaldinho'] },
  // Les plus grands de l'histoire
  { cat: 'joueur', words: ['Ronaldo (R9)', 'Pelé', 'Maradona', 'Messi', 'Cristiano Ronaldo', 'Zidane'] },
  // Milieux de très haut niveau : sentinelles et relayeurs
  { cat: 'joueur', words: ['Busquets', 'Casemiro', 'Thiago Motta', 'Xavi', 'Kroos', 'Iniesta', 'Rodri'] },
  // Jeunes stars techniques
  { cat: 'joueur', words: ['Pedri', 'Vitinha', 'Lamine Yamal', 'Désiré Doué'] },
  // Génération 87 française
  { cat: 'joueur', words: ['Ben Arfa', 'Nasri', 'Ménez', 'Benzema', 'Gourcuff'] },
  // Les grands buteurs des années 2010–2020
  { cat: 'joueur', words: ['Suárez', 'Falcao', 'Cavani', 'Ibrahimović', 'Lewandowski', 'Messi', 'Mbappé'] },
  // Le trio du Barça
  { cat: 'joueur', words: ['Iniesta', 'Xavi', 'Busquets'] },
  // Les deux Argentins
  { cat: 'joueur', words: ['Messi', 'Maradona'] },
  // Attaquants français ultra-rapides
  { cat: 'joueur', words: ['Mbappé', 'Henry', 'Martial'] },
  // Les deux Brésiliens
  { cat: 'joueur', words: ['Neymar', 'Ronaldinho'] },
  // Attaquants français passés par l'Angleterre
  { cat: 'joueur', words: ['Martial', 'Henry', 'Anelka', 'Saint-Maximin'] },
  // Gardiens
  { cat: 'joueur', words: ['Maignan', 'Areola', 'Lloris', 'Donnarumma', 'Buffon'] },

  /* Clubs (14) */
  {
    cat: 'club',
    words: ['PSG', ['Olympique de Marseille', 'Marseille'], ['Olympique Lyonnais', 'Lyon'], 'Real Madrid', ['FC Barcelone', 'FC Barcelona'], 'Manchester United', 'Liverpool', 'Bayern Munich', 'Juventus', 'AC Milan', 'Inter Milan', 'Manchester City', 'Arsenal', 'Chelsea'],
  },

  /* Trophées (12) */
  {
    cat: 'trophee',
    words: [
      ['Coupe du monde', 'World Cup'],
      ['Euro', 'Euros'],
      'Copa América',
      ["Coupe d'Afrique des nations", 'AFCON'],
      ['Ligue des champions', 'Champions League'],
      ['Ligue Europa', 'Europa League'],
      ['Ligue Europa Conférence', 'Conference League'],
      ['Coupe du monde des clubs', 'Club World Cup'],
      ['Ligue des nations', 'Nations League'],
      ["Supercoupe d'Europe", 'UEFA Super Cup'],
      ['Coupe Intercontinentale', 'Intercontinental Cup'],
      ['Jeux olympiques', 'Olympic Games'],
    ],
  },

  /* Stades (10) */
  { cat: 'stade', words: ['Parc des Princes', 'Stade de France', 'Stade Vélodrome', 'Camp Nou', 'Santiago Bernabéu', 'Old Trafford', 'Anfield', 'Wembley', 'San Siro', 'Allianz Arena'] },

  /* Compétitions (10) — tous pays mélangés */
  {
    cat: 'competition',
    words: [
      'Premier League',
      ['Liga', 'La Liga'],
      'Serie A',
      'Bundesliga',
      'Ligue 1',
      ['Championnat néerlandais (Eredivisie)', 'Dutch league (Eredivisie)'],
      ['Championnat brésilien', 'Brazilian league'],
      ['Championnat argentin', 'Argentine league'],
      ['Championnat américain (MLS)', 'American league (MLS)'],
      ['Championnat saoudien', 'Saudi league'],
    ],
  },

  /* Moments légendaires (10) */
  // Moments de finales
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
  // Exploits individuels
  {
    cat: 'but',
    words: [
      ['Le retourné de Cristiano Ronaldo (Turin 2018)', "Cristiano Ronaldo's bicycle kick (Turin 2018)"],
      ['Les 5 buts de Lewandowski en 9 minutes (2015)', "Lewandowski's 5 goals in 9 minutes (2015)"],
      ["Le triplé de Lucas Moura contre l'Ajax (2019)", "Lucas Moura's hat-trick vs Ajax (2019)"],
      ["Le 8e Ballon d'Or de Messi (2023)", "Messi's 8th Ballon d'Or (2023)"],
    ],
  },

  /* Memes (8) */
  // Célébrations cultes
  {
    cat: 'meme',
    words: [
      'Siuuu',
      ['Le dab de Pogba', "Pogba's dab"],
      ['La danse Fortnite de Griezmann', "Griezmann's Fortnite dance"],
      ['La célébration de Marcelo et CR7', 'Marcelo and CR7 celebration'],
      ['Le « ice in the veins » de Cole Palmer', 'Cole Palmer\'s "ice in the veins"'],
    ],
  },
  // Sagas à la française
  {
    cat: 'meme',
    words: [
      ["La Coupe du monde d'Adil Rami (2018)", "Adil Rami's World Cup (2018)"],
      ["Les blessures d'Abou Diaby", "Abou Diaby's injuries"],
      ["L'aventure de Ben Arfa au PSG", "Ben Arfa's PSG adventure"],
    ],
  },

  /* Styles de jeu (8) */
  // Tactiques
  { cat: 'style', words: ['Tiki-taka', 'Catenaccio', ['Contre-attaque', 'Counter-attack']] },
  // Gestes techniques
  { cat: 'style', words: [['Petit pont', 'Nutmeg'], 'Roulette', ['Virgule', 'Elastico'], ['Talonnade', 'Backheel'], ['Passement de jambes', 'Step-over']] },
];
