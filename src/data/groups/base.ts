import type { GroupDef } from './types';

/**
 * Base gratuite : exactement 200 mots (64 % de joueurs), toutes catégories représentées.
 * Une entrée est soit un nom identique dans les deux langues, soit [français, anglais].
 * Le jeu tire deux mots différents par groupe : les duos changent à chaque partie.
 *
 * Groupes de joueurs PETITS (4 à 6 noms) et SERRÉS : même poste, même époque, même profil.
 * Que des noms connus de tous. C'est ce qui rend l'imposteur difficile à démasquer
 * (décisions d'Arsène, 10/09/2026).
 */
export const BASE: GroupDef[] = [
  /* Joueurs (128) */
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
