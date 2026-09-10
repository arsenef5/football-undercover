import type { GroupDef } from './types';

/**
 * Base gratuite : exactement 200 mots (64 % de joueurs), toutes catégories représentées.
 * Une entrée est soit un nom identique dans les deux langues, soit [français, anglais].
 * Le jeu tire deux mots différents par groupe : les duos changent à chaque partie.
 *
 * Les groupes de joueurs sont faits par SIMILITUDE DE JEU (poste, style, époque), pas par pays :
 * c'est ce qui rend l'imposteur difficile à démasquer (décision d'Arsène, 10/09/2026).
 */
export const BASE: GroupDef[] = [
  /* Joueurs (128) */
  // Petits milieux techniques
  { cat: 'joueur', words: ['Iniesta', 'Xavi', 'Pirlo', 'Verratti', 'Pedri', 'Thiago Alcântara', 'Modrić', 'David Silva', 'Bernardo Silva', 'Riquelme'] },
  // Grands attaquants finisseurs
  { cat: 'joueur', words: ['Kane', 'Lukaku', 'Lewandowski', 'Haaland', 'Ibrahimović', 'Giroud', 'Drogba', 'Osimhen', 'Van Nistelrooy'] },
  // Ailiers rapides de Premier League
  { cat: 'joueur', words: ['Henry', 'Walcott', 'Aubameyang', 'Sterling', 'Salah', 'Mané', 'Son Heung-min', 'Rashford', 'Sané', 'Saka'] },
  // Dribbleurs flamboyants
  { cat: 'joueur', words: ['Neymar', 'Ronaldinho', 'Vinícius Jr', 'Hazard', 'Robben', 'Ribéry', 'Garrincha', 'Okocha', 'Dembélé', 'Kvaratskhelia'] },
  // Meneurs de jeu, numéros 10
  { cat: 'joueur', words: ['Zidane', 'Platini', 'Totti', 'Del Piero', 'Kaká', 'Rui Costa', 'Özil', 'Bergkamp', 'De Bruyne', 'Griezmann'] },
  // Milieux récupérateurs et box-to-box
  { cat: 'joueur', words: ['Kanté', 'Makélélé', 'Vieira', 'Roy Keane', 'Gerrard', 'Lampard', 'Yaya Touré', 'Pogba', 'Rodri', 'Casemiro'] },
  // Défenseurs centraux légendaires
  { cat: 'joueur', words: ['Maldini', 'Cannavaro', 'Puyol', 'Sergio Ramos', 'Piqué', 'Desailly', 'Van Dijk', 'Varane', 'Chiellini', 'Terry'] },
  // Latéraux offensifs
  { cat: 'joueur', words: ['Roberto Carlos', 'Cafu', 'Dani Alves', 'Marcelo', 'Alexander-Arnold', 'Robertson', 'Hakimi', 'Theo Hernández', 'Lahm', 'Ashley Cole'] },
  // Gardiens légendaires
  { cat: 'joueur', words: ['Buffon', 'Casillas', 'Neuer', 'Courtois', 'Oblak', 'Ter Stegen', 'Donnarumma', 'Lloris', 'Barthez', 'Emiliano Martínez'] },
  // Ballons d'Or
  { cat: 'joueur', words: ['Messi', 'Cristiano Ronaldo', 'Ronaldo (R9)', 'Rivaldo', 'Benzema', 'Shevchenko', 'Figo', 'Nedvěd', 'Owen'] },
  // Attaquants vifs et techniques
  { cat: 'joueur', words: ['Agüero', 'Tévez', 'Suárez', 'Dybala', 'Lautaro Martínez', 'Julián Álvarez', 'Insigne', 'David Villa', 'Fernando Torres', 'Raúl'] },
  // Jeunes cracks des années 2020
  { cat: 'joueur', words: ['Lamine Yamal', 'Bellingham', 'Musiala', 'Gavi', 'Wirtz', 'Zaïre-Emery', 'Désiré Doué', 'Endrick', 'Kenan Yıldız', 'Cubarsí'] },
  // Bleus d'aujourd'hui
  { cat: 'joueur', words: ['Mbappé', 'Tchouaméni', 'Camavinga', 'Saliba', 'Koundé', 'Maignan', 'Rabiot', 'Kolo Muani', 'Marcus Thuram', 'Olise'] },

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
