import type { GroupDef } from './types';

/** Pack Pro — clubs, trophées, stades, compétitions, moments, memes, styles. */
export const PRO_MORE: GroupDef[] = [
  /* ------------------------------------------------------------------ */
  /* Clubs                                                                */
  /* ------------------------------------------------------------------ */
  { cat: 'club', words: ['Everton', 'Leeds United', 'West Ham', 'Leicester City', 'Nottingham Forest', 'Brighton', 'Crystal Palace', 'Wolverhampton', 'Fulham', 'Southampton'] },
  { cat: 'club', words: ['Real Sociedad', ['Betis Séville', 'Real Betis'], 'Villarreal', 'Celta Vigo', 'Espanyol', 'Getafe', 'Osasuna', ['Deportivo La Corogne', 'Deportivo La Coruña']] },
  { cat: 'club', words: ['Atalanta', 'Fiorentina', 'Torino', ['Bologne', 'Bologna'], ['Parme', 'Parma'], 'Sampdoria', 'Udinese', 'Genoa'] },
  { cat: 'club', words: ['Bayern Munich', 'Borussia Dortmund', 'Bayer Leverkusen', 'RB Leipzig', 'Schalke 04', ['Eintracht Francfort', 'Eintracht Frankfurt'], 'VfB Stuttgart', 'Borussia Mönchengladbach'] },
  { cat: 'club', words: [['Girondins de Bordeaux', 'Bordeaux'], 'Montpellier', 'Toulouse', 'Strasbourg', 'Stade de Reims', ['Stade Brestois', 'Brest'], 'Le Havre', 'FC Metz', 'AJ Auxerre', 'Lorient'] },
  { cat: 'club', words: ['Benfica', 'FC Porto', 'Sporting', 'Ajax', 'PSV', 'Feyenoord', 'Anderlecht', ['Club Bruges', 'Club Brugge']] },
  { cat: 'club', words: ['Boca Juniors', 'River Plate', 'Flamengo', 'Santos', 'Al-Nassr', 'Al-Hilal', 'Inter Miami', 'LA Galaxy'] },
  { cat: 'club', words: ['Palmeiras', 'Corinthians', 'São Paulo', 'Grêmio', 'Internacional', 'Fluminense', 'Botafogo', 'Cruzeiro'] },
  { cat: 'club', words: ['Racing Club', 'Independiente', 'San Lorenzo', 'Estudiantes', 'Vélez Sarsfield', 'Rosario Central'] },
  { cat: 'club', words: ['Galatasaray', 'Fenerbahçe', 'Beşiktaş', 'Olympiakos', 'Panathinaïkos', 'Étoile Rouge de Belgrade', 'Dinamo Zagreb', 'Shakhtar Donetsk'] },
  { cat: 'club', words: ['Celtic', 'Rangers', 'Al-Ittihad', 'Al-Ahli', 'LAFC', 'Seattle Sounders', 'Club América', 'Chivas'] },

  /* ------------------------------------------------------------------ */
  /* Trophées                                                             */
  /* ------------------------------------------------------------------ */
  {
    cat: 'trophee',
    words: [
      ["Ballon d'Or féminin", "Women's Ballon d'Or"],
      ['Trophée UNFP du meilleur joueur', 'UNFP Player of the Year'],
      ["Joueur de l'année PFA", 'PFA Player of the Year'],
      ["Ballon d'Or africain", 'African Player of the Year'],
      ["Onze d'Or", 'Onze d\'Or'],
      ['Trophée Gerd Müller', 'Gerd Müller Trophy'],
      'Golden Foot',
      ['Trophée Marta', 'Marta Award'],
    ],
  },
  {
    cat: 'trophee',
    words: [
      'Coupe de la Ligue',
      ['Trophée des Champions', 'Trophée des Champions'],
      ["Supercoupe d'Espagne", 'Spanish Super Cup'],
      ["Supercoupe d'Italie", 'Italian Super Cup'],
      'Carabao Cup',
      ['Taça de Portugal', 'Taça de Portugal'],
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Stades                                                               */
  /* ------------------------------------------------------------------ */
  { cat: 'stade', words: ["St James' Park", 'Villa Park', 'Goodison Park', 'Tottenham Hotspur Stadium', 'Elland Road', 'London Stadium'] },
  {
    cat: 'stade',
    words: [
      'Estadio Monumental',
      'Estadio Centenario',
      ['Stade de Lusail', 'Lusail Stadium'],
      'Soccer City',
      ['Stade Olympique de Rome', 'Stadio Olimpico'],
      ['Stade Olympique de Berlin', 'Olympiastadion Berlin'],
      'Estádio do Dragão',
      'Johan Cruyff Arena',
      'Hampden Park',
      'Aviva Stadium',
      ['Stade Roi-Baudouin', 'King Baudouin Stadium'],
      ['Stade Olympique de Kiev', 'Olimpiyskiy Stadium'],
    ],
  },
  { cat: 'stade', words: ['Allianz Riviera', 'Stade Louis-II', 'Stade Pierre-Mauroy', 'Matmut Atlantique', 'Stade de la Beaujoire', 'Stade de la Meinau'] },
  { cat: 'stade', words: ['Mestalla', 'Ramón Sánchez-Pizjuán', ['Anoeta', 'Reale Arena'], 'Veltins-Arena', 'Red Bull Arena', 'Volksparkstadion'] },

  /* ------------------------------------------------------------------ */
  /* Compétitions                                                         */
  /* ------------------------------------------------------------------ */
  { cat: 'competition', words: ['Championship', 'Ligue 2', 'Serie B', 'Segunda División', '2. Bundesliga', 'Jupiler Pro League', 'Scottish Premiership', ['Championnat National', 'Championnat National']] },
  {
    cat: 'competition',
    words: [
      ['Championnat coréen', 'Korean league'],
      ['Championnat australien', 'Australian league'],
      ['Championnat chinois', 'Chinese league'],
      ['Championnat égyptien', 'Egyptian league'],
      ['Championnat belge', 'Belgian league'],
      ['Championnat écossais', 'Scottish league'],
      ['Championnat russe', 'Russian league'],
      ['Championnat grec', 'Greek league'],
    ],
  },
  {
    cat: 'competition',
    words: [
      ['Coupe du monde 1990', '1990 World Cup'],
      ['Coupe du monde 1994', '1994 World Cup'],
      ['Coupe du monde 1982', '1982 World Cup'],
      ['Coupe du monde 1978', '1978 World Cup'],
      ['Coupe du monde 1974', '1974 World Cup'],
      ['Coupe du monde 1970', '1970 World Cup'],
    ],
  },
  { cat: 'competition', words: ['Euro 1984', 'Euro 1992', 'Euro 1996', 'Euro 2008', 'Euro 2012', 'Euro 2020'] },

  /* ------------------------------------------------------------------ */
  /* Moments légendaires                                                  */
  /* ------------------------------------------------------------------ */
  {
    cat: 'but',
    words: [
      ['Le miracle d\'Istanbul (Milan – Liverpool 2005)', 'The Miracle of Istanbul (Milan v Liverpool 2005)'],
      ['La finale du Camp Nou (Man Utd – Bayern 1999)', 'The Camp Nou final (Man Utd v Bayern 1999)'],
      ['La Décima du Real à Lisbonne (2014)', "Real's Décima in Lisbon (2014)"],
      ['La finale de Madrid (Liverpool – Tottenham 2019)', 'The Madrid final (Liverpool v Tottenham 2019)'],
      ['La finale Bayern – PSG à huis clos (2020)', 'The behind-closed-doors Bayern v PSG final (2020)'],
      ['La finale de Paris (Real – Liverpool 2022)', 'The Paris final (Real v Liverpool 2022)'],
      ['Le 5-0 du PSG en finale (Munich 2025)', "PSG's 5-0 in the final (Munich 2025)"],
      ['La finale de Wembley (Chelsea 2012)', 'The Wembley final (Chelsea 2012)'],
    ],
  },
  {
    cat: 'but',
    words: [
      ['Le lob de Messi contre le Betis (2019)', "Messi's chip vs Betis (2019)"],
      ['Le slalom de Messi contre Getafe (2007)', "Messi's solo run vs Getafe (2007)"],
      ['La papinade', 'The "Papinade" volley'],
      ['La talonnade de Madjer (1987)', "Madjer's backheel (1987)"],
      ['La volée de Payet (Euro 2016)', "Payet's volley (Euro 2016)"],
      ['La volée de Pavard (2018)', "Pavard's volley (2018)"],
      ['La tête plongeante de Van Persie (2014)', "Van Persie's flying header (2014)"],
      ['Le but de Sergi Roberto (Remontada 2017)', "Sergi Roberto's goal (Remontada 2017)"],
    ],
  },
  {
    cat: 'but',
    words: [
      ["Le triplé de Cristiano Ronaldo contre l'Espagne (2018)", "Cristiano Ronaldo's hat-trick vs Spain (2018)"],
      ['Les 91 buts de Messi en 2012', "Messi's 91 goals in 2012"],
      ['Le titre de Leicester (2016)', "Leicester's title (2016)"],
      ["Les Invincibles d'Arsenal (2004)", "Arsenal's Invincibles (2004)"],
      ['Le 14-0 de la France contre Gibraltar (2023)', "France's 14-0 vs Gibraltar (2023)"],
      ['Les trois Ligues des champions de suite du Real (2016–2018)', "Real's three Champions Leagues in a row (2016–2018)"],
      ['Le sextuplé du Barça (2009)', "Barça's sextuple (2009)"],
      ['Le sextuplé du Bayern (2020)', "Bayern's sextuple (2020)"],
    ],
  },
  {
    cat: 'but',
    words: [
      ['Le penalty raté de Baggio (finale 1994)', "Baggio's missed penalty (1994 final)"],
      ['La grève de Knysna (2010)', 'The Knysna strike (2010)'],
      ['Le tacle de De Jong sur Xabi Alonso (finale 2010)', "De Jong's kung-fu kick on Xabi Alonso (2010 final)"],
      ['Le tacle de Ramos sur Salah (finale 2018)', "Ramos's tackle on Salah (2018 final)"],
      ['Le penalty de Zidane sur la barre (finale 2006)', "Zidane's Panenka off the bar (2006 final)"],
      ['Le carton rouge de Beckham (1998)', "Beckham's red card (1998)"],
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Memes                                                                */
  /* ------------------------------------------------------------------ */
  {
    cat: 'meme',
    words: [
      ['Le « Calma » de Vinícius', "Vinícius's \"Calma\""],
      ["Le masque d'Aubameyang", "Aubameyang's mask"],
      ['La danse du robot de Crouch', "Crouch's robot dance"],
      ['Le cœur de Bale', "Bale's heart celebration"],
      ['La célébration téléphone de Griezmann', "Griezmann's phone-call celebration"],
      ['La statue de Ronaldo à Madère', "The Ronaldo statue in Madeira"],
    ],
  },
  {
    cat: 'meme',
    words: [
      ['« Football, bloody hell » (Ferguson)', '"Football, bloody hell" (Ferguson)'],
      ["« Et à la fin, c'est l'Allemagne qui gagne » (Lineker)", '"And in the end the Germans win" (Lineker)'],
      ['« Ils ont remplacé la Tour Eiffel par une statue de moi » (Zlatan)', '"They replaced the Eiffel Tower with a statue of me" (Zlatan)'],
      ['« Respect, respect, respect » (Mourinho, 2018)', '"Respect, respect, respect" (Mourinho, 2018)'],
      ['« Agüerooooo ! » (Martin Tyler)', '"Agüerooooo!" (Martin Tyler)'],
      ['« Et 1, et 2, et 3-0 »', '"Et 1, et 2, et 3-0" (France 1998 chant)'],
      ['« Ramenez la coupe à la maison »', '"Ramenez la coupe à la maison" (Vegedream)'],
    ],
  },
  {
    cat: 'meme',
    words: [
      ['La glacière de Bielsa', "Bielsa's cooler box"],
      ['Le sprint de Mourinho à Old Trafford (2004)', "Mourinho's sprint at Old Trafford (2004)"],
      ['La pub Joga Bonito', 'The Joga Bonito ad'],
      ['Le crossbar de Ronaldinho', "Ronaldinho's crossbar video"],
      ['Le chewing-gum de Ferguson', "Ferguson's chewing gum"],
      ['Le penalty à deux de Messi et Suárez (2016)', "Messi and Suárez's two-man penalty (2016)"],
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Styles de jeu                                                        */
  /* ------------------------------------------------------------------ */
  { cat: 'style', words: [['Libéro', 'Sweeper'], ['Stoppeur', 'Stopper'], ['Meneur de jeu', 'Playmaker'], ['Numéro 10', 'Number 10'], ['Régista', 'Regista'], ['Trequartista', 'Trequartista']] },
  { cat: 'style', words: [['Passement de jambes', 'Step-over'], ['Crochet', 'Cut inside'], ['Aile de pigeon', 'Flick'], 'Rabona', ['Retourné acrobatique', 'Bicycle kick'], ['Coup du foulard', 'Trivela']] },
];
