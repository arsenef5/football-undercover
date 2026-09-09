import type { GroupDef } from './types';

/**
 * Base gratuite : exactement 200 mots (62 % de joueurs), toutes catégories représentées.
 * Une entrée est soit un nom identique dans les deux langues, soit [français, anglais].
 * Le jeu tire deux mots différents par groupe : les duos changent à chaque partie.
 */
export const BASE: GroupDef[] = [
  /* Joueurs (124) */
  { cat: 'joueur', words: ['Pelé', 'Garrincha', 'Zico', 'Sócrates', 'Romário', 'Rivaldo', 'Ronaldo (R9)', 'Ronaldinho', 'Kaká', 'Cafu', 'Roberto Carlos', 'Adriano'] },
  { cat: 'joueur', words: ['Maradona', 'Messi', 'Batistuta', 'Crespo', 'Riquelme', 'Aimar', 'Verón', 'Zanetti', 'Kempes', 'Tévez'] },
  { cat: 'joueur', words: ['Zidane', 'Deschamps', 'Lilian Thuram', 'Desailly', 'Laurent Blanc', 'Lizarazu', 'Barthez', 'Djorkaeff', 'Dugarry', 'Henry', 'Trezeguet', 'Vieira', 'Petit', 'Pirès'] },
  { cat: 'joueur', words: ['Mbappé', 'Griezmann', 'Giroud', 'Pogba', 'Kanté', 'Varane', 'Lloris', 'Pavard', 'Lucas Hernández', 'Umtiti', 'Matuidi', 'Dembélé', 'Rabiot', 'Tchouaméni', 'Koundé', 'Theo Hernández'] },
  { cat: 'joueur', words: ['Xavi', 'Iniesta', 'Puyol', 'Casillas', 'Raúl', 'Torres', 'David Villa', 'Xabi Alonso', 'Busquets', 'Piqué', 'Sergio Ramos', 'Fàbregas'] },
  { cat: 'joueur', words: ['Beckham', 'Gerrard', 'Lampard', 'Scholes', 'Rooney', 'Owen', 'Shearer', 'Lineker', 'Gascoigne', 'Terry', 'Ferdinand', 'Ashley Cole'] },
  { cat: 'joueur', words: ['Kane', 'Bellingham', 'Saka', 'Foden', 'Declan Rice', 'Cole Palmer', 'Rashford', 'Sterling', 'Grealish', 'Alexander-Arnold', 'Stones', 'Pickford'] },
  { cat: 'joueur', words: ['Beckenbauer', 'Matthäus', 'Klinsmann', 'Kahn', 'Ballack', 'Schweinsteiger', 'Lahm', 'Klose', 'Podolski', 'Thomas Müller', 'Özil', 'Kroos'] },
  { cat: 'joueur', words: ['Baggio', 'Del Piero', 'Totti', 'Maldini', 'Nesta', 'Cannavaro', 'Buffon', 'Pirlo', 'Gattuso', 'De Rossi', 'Inzaghi', 'Vieri'] },
  { cat: 'joueur', words: ['Eusébio', 'Figo', 'Rui Costa', 'Deco', 'Cristiano Ronaldo', 'Pepe', 'Nani', 'Bernardo Silva', 'Bruno Fernandes', 'João Félix', 'Rafael Leão', 'Vitinha'] },

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
  {
    cat: 'but',
    words: [
      ['La Main de Dieu (Maradona 1986)', 'The Hand of God (Maradona 1986)'],
      ['Le but du siècle (Maradona 1986)', 'The Goal of the Century (Maradona 1986)'],
      ['Le coup de boule de Zidane (finale 2006)', "Zidane's headbutt (2006 final)"],
      ['Le doublé de Zidane en finale (1998)', "Zidane's brace in the final (1998)"],
      ['Le triplé de Mbappé en finale (2022)', "Mbappé's hat-trick in the final (2022)"],
      ["Le but d'Iniesta en finale de Coupe du monde (2010)", "Iniesta's World Cup final goal (2010)"],
      ['Le retourné de Cristiano Ronaldo (Turin 2018)', "Cristiano Ronaldo's bicycle kick (Turin 2018)"],
      ['Les 5 buts de Lewandowski en 9 minutes (2015)', "Lewandowski's 5 goals in 9 minutes (2015)"],
      ["Le triplé de Lucas Moura contre l'Ajax (2019)", "Lucas Moura's hat-trick vs Ajax (2019)"],
      ["Le 8e Ballon d'Or de Messi (2023)", "Messi's 8th Ballon d'Or (2023)"],
    ],
  },

  /* Memes (10) */
  {
    cat: 'meme',
    words: [
      'Siuuu',
      'Pessi',
      'Penaldo',
      ['Neymar qui roule (2018)', 'Neymar rolling (2018)'],
      ['Kepa qui refuse de sortir', 'Kepa refusing to be subbed'],
      ['Balotelli « Why always me ? »', 'Balotelli "Why always me?"'],
      ['« Qué mirás, bobo ? » (Messi)', '"Qué mirás, bobo?" (Messi)'],
      ["La Coupe du monde d'Adil Rami (2018)", "Adil Rami's World Cup (2018)"],
      ["Les blessures d'Abou Diaby", "Abou Diaby's injuries"],
      ["L'aventure de Ben Arfa au PSG", "Ben Arfa's PSG adventure"],
    ],
  },

  /* Styles de jeu (10) */
  {
    cat: 'style',
    words: [
      'Tiki-taka',
      'Gegenpressing',
      'Catenaccio',
      ['Football total', 'Total Football'],
      ['Contre-attaque', 'Counter-attack'],
      ['Garer le bus', 'Parking the bus'],
      ['Petit pont', 'Nutmeg'],
      'Panenka',
      ['Faux 9', 'False 9'],
      ['Bloc bas', 'Low block'],
    ],
  },
];

/** Ancienne base élargie : tout ce qui n'est pas dans les 200 gratuits rejoint le pack Pro. */
export const BASE_EXTRA: GroupDef[] = [
  { cat: 'joueur', words: ['Neymar', 'Vinícius Jr', 'Rodrygo', 'Raphinha', 'Endrick', 'Antony', 'Casemiro', 'Marquinhos', 'Alisson', 'Ederson'] },
  { cat: 'joueur', words: ['Lautaro Martínez', 'Julián Álvarez', 'Di María', 'Enzo Fernández', 'Mac Allister', 'Dybala', 'Dibu Martínez', 'Otamendi', 'Garnacho', 'Paredes'] },
  { cat: 'joueur', words: ['Camavinga', 'Kolo Muani', 'Marcus Thuram', 'Olise', 'Barcola', 'Désiré Doué', 'Saliba', 'Upamecano', 'Maignan', 'Zaïre-Emery'] },
  { cat: 'joueur', words: ['Lamine Yamal', 'Pedri', 'Gavi', 'Rodri', 'Morata', 'Dani Olmo', 'Nico Williams', 'Carvajal', 'Cubarsí', 'Unai Simón'] },
  { cat: 'joueur', words: ['Musiala', 'Wirtz', 'Havertz', 'Kimmich', 'Sané', 'Gnabry', 'Rüdiger', 'Neuer'] },
  { cat: 'joueur', words: ['Donnarumma', 'Barella', 'Bastoni', 'Chiesa', 'Tonali', 'Dimarco', 'Retegui', 'Calafiori'] },
  { cat: 'joueur', words: ['Cruyff', 'Van Basten', 'Gullit', 'Rijkaard', 'Bergkamp', 'Van Nistelrooy', 'Van Persie', 'Robben', 'Sneijder', 'Van der Sar', 'Van Dijk', 'Frenkie de Jong'] },
  { cat: 'joueur', words: ['Hazard', 'De Bruyne', 'Lukaku', 'Courtois', 'Kompany', 'Vertonghen', 'Witsel', 'Doku'] },
  { cat: 'joueur', words: ['Weah', 'Drogba', "Eto'o", 'Yaya Touré', 'Okocha', 'Kanu', 'Mané', 'Salah', 'Mahrez', 'Hakimi', 'Osimhen', 'Aubameyang'] },
  { cat: 'joueur', words: ['Buffon', 'Casillas', 'Kahn', 'Schmeichel', 'Van der Sar', 'Neuer', 'Courtois', 'Ter Stegen', 'Oblak', 'Donnarumma'] },
  { cat: 'joueur', words: ['Shevchenko', 'Modrić', 'Lewandowski', 'Haaland', 'Ibrahimović', 'Nedvěd', 'Ødegaard', 'Kvaratskhelia'] },
  { cat: 'joueur', words: ['Suárez', 'Cavani', 'Forlán', 'Valverde', 'Falcao', 'James Rodríguez', 'Alexis Sánchez', 'Luis Díaz'] },
  { cat: 'joueur', words: ['Agüero', 'Kane', 'Salah', 'Haaland', 'Son Heung-min', 'Vardy', 'Sterling', 'Rashford', 'Firmino', 'Lukaku'] },
  { cat: 'joueur', words: ['Son Heung-min', 'Park Ji-sung', 'Nakata', 'Kagawa', 'Mitoma', 'Kubo'] },
  { cat: 'joueur', words: ['Desailly', 'Lilian Thuram', 'Laurent Blanc', 'Lizarazu', 'Gallas', 'Abidal', 'Sagna', 'Evra', 'Varane', 'Umtiti', 'Pavard', 'Upamecano', 'Koundé', 'Saliba', 'Lucas Hernández', 'Theo Hernández', 'Kimpembe'] },
  { cat: 'joueur', words: ['Papin', 'Cantona', 'Henry', 'Trezeguet', 'Anelka', 'Djibril Cissé', 'Benzema', 'Giroud', 'Mbappé', 'Griezmann', 'Dembélé', 'Kolo Muani', 'Marcus Thuram', 'Barcola'] },
  { cat: 'joueur', words: ['Platini', 'Giresse', 'Tigana', 'Deschamps', 'Vieira', 'Petit', 'Makélélé', 'Zidane', 'Pirès', 'Malouda', 'Ribéry', 'Nasri', 'Pogba', 'Kanté', 'Matuidi', 'Rabiot', 'Tchouaméni', 'Camavinga', 'Zaïre-Emery'] },
  { cat: 'joueur', words: ['Bats', 'Lama', 'Barthez', 'Coupet', 'Landreau', 'Lloris', 'Mandanda', 'Maignan', 'Areola', 'Samba'] },

  { cat: 'club', words: ['Manchester United', 'Liverpool', 'Arsenal', 'Chelsea', 'Manchester City', 'Tottenham', 'Newcastle', 'Aston Villa'] },
  { cat: 'club', words: ['Real Madrid', ['FC Barcelone', 'FC Barcelona'], 'Atlético de Madrid', ['Séville FC', 'Sevilla FC'], ['Valence CF', 'Valencia CF'], 'Athletic Bilbao'] },
  { cat: 'club', words: ['Juventus', 'Inter Milan', 'AC Milan', ['Naples', 'Napoli'], 'AS Roma', 'Lazio'] },
  { cat: 'club', words: ['PSG', ['Olympique de Marseille', 'Marseille'], ['Olympique Lyonnais', 'Lyon'], 'AS Monaco', ['LOSC Lille', 'Lille'], 'RC Lens', 'OGC Nice', ['Stade Rennais', 'Rennes'], 'FC Nantes', ['AS Saint-Étienne', 'Saint-Étienne']] },

  {
    cat: 'trophee',
    words: [
      "Ballon d'Or",
      'The Best FIFA',
      ["Soulier d'Or", 'Golden Boot'],
      ["Gant d'Or", 'Golden Glove'],
      ['Trophée Kopa', 'Kopa Trophy'],
      'Golden Boy',
      ['Trophée Yachine', 'Yashin Trophy'],
      ['Trophée Puskás', 'Puskás Award'],
    ],
  },
  { cat: 'trophee', words: ['Coupe de France', 'FA Cup', 'Copa del Rey', 'Coppa Italia', 'DFB-Pokal', 'Community Shield'] },

  { cat: 'stade', words: ['Old Trafford', 'Anfield', 'Wembley', 'Emirates Stadium', 'Etihad Stadium', 'Stamford Bridge'] },
  { cat: 'stade', words: ['Camp Nou', 'Santiago Bernabéu', 'Metropolitano', 'San Siro', 'Allianz Stadium (Juventus)', 'San Mamés'] },
  { cat: 'stade', words: ['Parc des Princes', 'Stade de France', 'Stade Vélodrome', 'Groupama Stadium', 'Stade Bollaert', 'Stade Geoffroy-Guichard'] },
  {
    cat: 'stade',
    words: [
      'Maracanã',
      'La Bombonera',
      ['Stade 974 de Doha, 1er stade démontable', 'Stadium 974 in Doha, the first dismantlable stadium'],
      ['Stade de Lusail (finale 2022)', 'Lusail Stadium (2022 final)'],
      'Allianz Arena',
      'Signal Iduna Park',
      'Estádio da Luz',
    ],
  },

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

  {
    cat: 'but',
    words: [
      ['Le but de Götze en finale (2014)', "Götze's goal in the final (2014)"],
      ['Le but en or de Trezeguet (Euro 2000)', "Trezeguet's golden goal (Euro 2000)"],
      ['Le but de Sergio Ramos à la 93e (Lisbonne 2014)', "Sergio Ramos's 93rd-minute goal (Lisbon 2014)"],
      ["Le retourné de Zlatan contre l'Angleterre (2012)", "Zlatan's bicycle kick vs England (2012)"],
      ['Le scorpion de Giroud (2017)', "Giroud's scorpion kick (2017)"],
      ['Le scorpion de Higuita (1995)', "Higuita's scorpion kick (1995)"],
      ['La volée de Van Basten (Euro 1988)', "Van Basten's volley (Euro 1988)"],
      ['La volée de Zidane (Glasgow 2002)', "Zidane's volley (Glasgow 2002)"],
    ],
  },
  {
    cat: 'but',
    words: [
      ['Les 5 buts de Messi contre Leverkusen (2012)', "Messi's 5 goals vs Leverkusen (2012)"],
      ["Le triplé de Cristiano Ronaldo contre l'Atlético (2019)", "Cristiano Ronaldo's hat-trick vs Atlético (2019)"],
      ['La Remontada (Barça 6-1 PSG, 2017)', 'The Remontada (Barça 6-1 PSG, 2017)'],
      ['Le 4-0 de Liverpool contre le Barça (2019)', "Liverpool's 4-0 vs Barça (2019)"],
      ['Le 7-1 (Brésil – Allemagne 2014)', 'The 7-1 (Brazil v Germany 2014)'],
      ['Le 8-2 (Bayern – Barça 2020)', 'The 8-2 (Bayern v Barça 2020)'],
      ['Le coup franc de Roberto Carlos (1997)', "Roberto Carlos's free kick (1997)"],
      ['Le coup franc de Beckham contre la Grèce (2001)', "Beckham's free kick vs Greece (2001)"],
      ['Le coup franc de Messi contre Liverpool (2019)', "Messi's free kick vs Liverpool (2019)"],
    ],
  },
  {
    cat: 'but',
    words: [
      ['La morsure de Suárez (2014)', "Suárez's bite (2014)"],
      ['Le penalty de Brahim Díaz arrêté (finale CAN 2025)', "Brahim Díaz's saved penalty (AFCON 2025 final)"],
      ['La sortie du terrain du Sénégal (finale CAN 2025)', 'Senegal walking off the pitch (AFCON 2025 final)'],
      ['La main de Suárez (2010)', "Suárez's handball (2010)"],
      ['La main de Thierry Henry (2009)', "Thierry Henry's handball (2009)"],
    ],
  },

  {
    cat: 'meme',
    words: [
      ['Le dab de Pogba', "Pogba's dab"],
      ['La danse Fortnite de Griezmann', "Griezmann's Fortnite dance"],
      ['Le berceau de Bebeto (1994)', "Bebeto's baby-cradle celebration (1994)"],
      ['La danse de Roger Milla au poteau de corner', "Roger Milla's corner-flag dance"],
      ['Le « chut » de Mourinho au Camp Nou', "Mourinho's shush at Camp Nou"],
      ['Ronaldo qui écarte les bouteilles de Coca (Euro 2020)', 'Ronaldo moving the Coca-Cola bottles (Euro 2020)'],
    ],
  },
  {
    cat: 'meme',
    words: [
      ['« The Special One » (Mourinho)', '"The Special One" (Mourinho)'],
      ['« Je repars comme une légende » (Zlatan)', '"I came like a king, left like a legend" (Zlatan)'],
      ['« La routourne va tourner » (Ribéry)', 'Ribéry\'s "routourne" line'],
      ["L'astrologie de Domenech", "Domenech's astrology"],
      ['Les mouettes de Cantona', "Cantona's seagulls speech"],
      ['Rivaldo qui simule (2002)', "Rivaldo's dive (2002)"],
      'Ankara Messi',
      ['Les chaussettes de Grealish', "Grealish's socks"],
    ],
  },

  {
    cat: 'style',
    words: [
      ['Jeu de position', 'Positional play'],
      'Kick and rush',
      ['Pressing haut', 'High press'],
      ['Grand pont', 'Knock-and-run'],
      'Roulette',
      'Elastico',
      ['Coup du sombrero', 'Rainbow flick'],
      ['Râteau', 'Drag-back'],
      ['Talonnade', 'Backheel'],
    ],
  },
  {
    cat: 'style',
    words: [
      ['Avant-centre pivot', 'Target man'],
      ['Piston', 'Wing-back'],
      ['Ailier inversé', 'Inverted winger'],
      'Box-to-box',
      ['Sentinelle', 'Holding midfielder'],
    ],
  },
];
