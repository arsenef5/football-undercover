import type { GroupDef } from './types';

/**
 * Base gratuite : une vingtaine de groupes seulement, les plus iconiques, toutes catégories représentées
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

  /* Clubs */
  {
    cat: 'club',
    words: ['PSG', ['Olympique de Marseille', 'Marseille'], ['Olympique Lyonnais', 'Lyon'], 'Real Madrid', ['FC Barcelone', 'FC Barcelona'], 'Manchester United', 'Liverpool', 'Bayern Munich', 'Juventus', 'AC Milan', 'Inter Milan', 'Manchester City', 'Arsenal', 'Chelsea'],
  },

  /* Trophées */
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

  /* Stades */
  { cat: 'stade', words: ['Parc des Princes', 'Stade de France', 'Stade Vélodrome', 'Camp Nou', 'Santiago Bernabéu', 'Old Trafford', 'Anfield', 'Wembley', 'San Siro', 'Allianz Arena'] },

  /* Compétitions — tous pays mélangés */
  {
    cat: 'competition',
    words: [
      'Premier League',
      ['Liga', 'La Liga'],
      'Serie A',
      'Bundesliga',
      'Ligue 1',
      'Eredivisie',
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
      ["Le triplé de Lucas Moura contre l'Ajax (2019)", "Lucas Moura's hat-trick vs Ajax (2019)"],
      ['Les 5 buts de Lewandowski en 9 minutes (2015)', "Lewandowski's 5 goals in 9 minutes (2015)"],
      ['Le retourné de Cristiano Ronaldo (Turin 2018)', "Cristiano Ronaldo's bicycle kick (Turin 2018)"],
    ],
  },
  // Exploits individuels

  /* Memes */
  // Célébrations cultes
  {
    cat: 'meme',
    words: [
      ['Le dab de Pogba', "Pogba's dab"],
      ['La danse Fortnite de Griezmann', "Griezmann's Fortnite dance"],
      ['La célébration de Marcelo et CR7', 'Marcelo and CR7 celebration'],
      ['Le « ice in the veins » de Cole Palmer', 'Cole Palmer\'s "ice in the veins"'],
    ],
  },

  /* Styles de jeu (8) */
  // Gestes techniques
  { cat: 'style', words: [['Petit pont', 'Nutmeg'], 'Roulette', ['Virgule', 'Elastico'], ['Talonnade', 'Backheel'], ['Passement de jambes', 'Step-over']] },
];
