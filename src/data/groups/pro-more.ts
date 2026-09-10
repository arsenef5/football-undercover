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
  { cat: 'competition', words: ['Championship', 'Ligue 2', 'Serie B', 'Segunda División', '2. Bundesliga', 'Jupiler Pro League', 'Scottish Premiership', ['Championnat National', 'Championnat National']] },
  {
    cat: 'competition',
    words: [
      ['Championnat portugais', 'Portuguese league'],
      ['Championnat turc', 'Turkish league'],
      ['Championnat japonais', 'Japanese league'],
      ['Championnat mexicain', 'Mexican league'],
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
  /* Moments légendaires — regroupés par ressemblance                     */
  /* ------------------------------------------------------------------ */
  // Buts de la dernière seconde
  {
    cat: 'but',
    words: [
      ['Le but de Sergio Ramos à la 93e (Lisbonne 2014)', "Sergio Ramos's 93rd-minute goal (Lisbon 2014)"],
      ['Le but de Sergi Roberto à la 95e (Remontada 2017)', "Sergi Roberto's 95th-minute goal (Remontada 2017)"],
      ['Le but de Solskjær à la 93e (finale 1999)', "Solskjær's 93rd-minute goal (1999 final)"],
      ["Le but d'Agüero à la 94e (titre 2012)", "Agüero's 94th-minute goal (2012 title)"],
      ['La volée de Payet à la 89e (Euro 2016)', "Payet's 89th-minute volley (Euro 2016)"],
    ],
  },
  // Coups francs de légende
  {
    cat: 'but',
    words: [
      ['Le coup franc de Roberto Carlos (1997)', "Roberto Carlos's free kick (1997)"],
      ['Le coup franc de Beckham contre la Grèce (2001)', "Beckham's free kick vs Greece (2001)"],
      ['Le coup franc de Messi contre Liverpool (2019)', "Messi's free kick vs Liverpool (2019)"],
      ["Le coup franc de Ronaldinho contre l'Angleterre (2002)", "Ronaldinho's free kick vs England (2002)"],
      ['Le coup franc de Juninho contre Barcelone (2001)', "Juninho's free kick vs Barcelona (2001)"],
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
      ['Le 14-0 de la France contre Gibraltar (2023)', "France's 14-0 vs Gibraltar (2023)"],
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
  // Exploits individuels
  {
    cat: 'but',
    words: [
      ['Les 5 buts de Messi contre Leverkusen (2012)', "Messi's 5 goals vs Leverkusen (2012)"],
      ["Le triplé de Cristiano Ronaldo contre l'Atlético (2019)", "Cristiano Ronaldo's hat-trick vs Atlético (2019)"],
      ['Les 4 buts de Lewandowski contre le Real (2013)', "Lewandowski's 4 goals vs Real (2013)"],
      ['La tête plongeante de Van Persie (2014)', "Van Persie's flying header (2014)"],
      ['La volée de Pavard (2018)', "Pavard's volley (2018)"],
    ],
  },
  // Grandes finales
  {
    cat: 'but',
    words: [
      ["La parade d'Emiliano Martínez (finale 2022)", "Emiliano Martínez's save (2022 final)"],
      ['La finale de Paris (Real – Liverpool 2022)', 'The Paris final (Real v Liverpool 2022)'],
      ['La finale de Wembley (Chelsea 2012)', 'The Wembley final (Chelsea 2012)'],
      ['Le but en or de Trezeguet (Euro 2000)', "Trezeguet's golden goal (Euro 2000)"],
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
  // Moments cultes
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
  // Postes
  { cat: 'style', words: [['Libéro', 'Sweeper'], ['Stoppeur', 'Stopper'], ['Meneur de jeu', 'Playmaker'], ['Faux 9', 'False 9']] },
  // Gestes techniques (suite)
  { cat: 'style', words: [['Crochet', 'Cut inside'], ['Coup du foulard', 'Trivela'], ['Petit pont', 'Nutmeg'], ['Grand pont', 'Knock-and-run']] },
];
