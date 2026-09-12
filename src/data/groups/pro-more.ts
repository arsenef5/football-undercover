import type { GroupDef } from './types';

/**
 * Pack Pro — tout sauf les joueurs : clubs, trophées, stades, compétitions, moments, memes,
 * lexique, entraîneurs. Même règle que pour les joueurs : des groupes PETITS et SERRÉS, des mots
 * qu'on décrirait avec les mêmes phrases (décision d'Arsène, 11/09/2026). Le tirage « hors
 * joueurs » se fait parmi les duos : une catégorie sort en proportion de sa richesse.
 */
export const PRO_MORE: GroupDef[] = [
  /* ------------------------------------------------------------------ */
  /* Clubs                                                                */
  /* ------------------------------------------------------------------ */
  // Liga
  { cat: 'club', words: ['Real Madrid', ['FC Barcelone', 'FC Barcelona'], 'Atlético de Madrid', 'Athletic Bilbao', ['Séville FC', 'Sevilla FC']] },
  // Serie A
  { cat: 'club', words: ['Inter Milan', 'AC Milan', 'Juventus', ['Naples', 'Napoli'], 'AS Roma', 'Atalanta'] },
  // Bundesliga
  { cat: 'club', words: ['Bayern Munich', 'Borussia Dortmund', 'Bayer Leverkusen', 'RB Leipzig', ['Eintracht Francfort', 'Eintracht Frankfurt']] },
  // Les clubs d'Arabie saoudite
  { cat: 'club', words: ['Al-Hilal', 'Al-Nassr', 'Al-Ittihad', 'Al-Ahli'] },
  // Les usines à talents
  { cat: 'club', words: ['Ajax', 'Benfica', 'Sporting', 'FC Porto', ['Salzbourg', 'Salzburg']] },
  // Ligue 1, les outsiders
  { cat: 'club', words: ['OGC Nice', ['Stade Rennais', 'Rennes'], 'Strasbourg', ['Stade Brestois', 'Brest'], 'Toulouse', ['AS Saint-Étienne', 'Saint-Étienne']] },
  // Premier League, les outsiders
  { cat: 'club', words: ['Newcastle', 'Aston Villa', 'West Ham', 'Brighton', 'Everton', 'Nottingham Forest'] },

  /* ------------------------------------------------------------------ */
  /* Trophées                                                             */
  /* ------------------------------------------------------------------ */
  // Coupes d'Europe
  {
    cat: 'trophee',
    words: [
      ['Ligue des champions', 'Champions League'],
      ['Ligue Europa', 'Europa League'],
      ['Ligue Europa Conférence', 'Conference League'],
      ["Supercoupe d'Europe", 'UEFA Super Cup'],
      ['Coupe du monde des clubs', 'Club World Cup'],
    ],
  },
  // Trophées anglais
  { cat: 'trophee', words: ['Premier League', 'FA Cup', 'Carabao Cup', 'Community Shield'] },
  // Trophées français
  {
    cat: 'trophee',
    words: [
      ['Championnat de France', 'French championship'],
      ['Coupe de France', 'French Cup'],
      ['Trophée des champions', 'Champions Trophy'],
      ['Coupe Gambardella', 'Gambardella Cup'],
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Stades                                                               */
  /* ------------------------------------------------------------------ */
  // Stades espagnols
  { cat: 'stade', words: ['Santiago Bernabéu', 'Camp Nou', 'Metropolitano'] },
  // Stades d'Europe
  { cat: 'stade', words: ['Allianz Arena', 'San Siro', 'Signal Iduna Park', 'Johan Cruyff Arena', 'Estádio da Luz'] },
  // Stades de finales de Coupe du monde
  { cat: 'stade', words: ['Maracanã', 'Wembley', ['Stade de Lusail', 'Lusail Stadium']] },

  /* ------------------------------------------------------------------ */
  /* Compétitions                                                         */
  /* ------------------------------------------------------------------ */
  // Éditions de la Coupe du monde
  {
    cat: 'competition',
    words: [
      ['Coupe du monde 1998', '1998 World Cup'],
      ['Coupe du monde 2006', '2006 World Cup'],
      ['Coupe du monde 2010', '2010 World Cup'],
      ['Coupe du monde 2014', '2014 World Cup'],
      ['Coupe du monde 2018', '2018 World Cup'],
      ['Coupe du monde 2022', '2022 World Cup'],
    ],
  },
  // Éditions de l'Euro
  { cat: 'competition', words: ['Euro 2000', 'Euro 2004', 'Euro 2016', ['Euro 2020 (joué en 2021)', 'Euro 2020 (played in 2021)'], 'Euro 2024'] },
  // Championnats de l'autre bout du monde
  {
    cat: 'competition',
    words: ['Saudi Pro League', 'MLS', 'Liga MX', ['Championnat brésilien', 'Brazilian league'], ['Championnat argentin', 'Argentine league'], 'J-League'],
  },
  // Championnats européens de second rang
  {
    cat: 'competition',
    words: ['Eredivisie', 'Liga Portugal', ['Pro League belge', 'Belgian Pro League'], 'Süper Lig', ['Championnat écossais', 'Scottish Premiership']],
  },

  /* ------------------------------------------------------------------ */
  /* Moments légendaires                                                  */
  /* ------------------------------------------------------------------ */
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
  // Les grandes soirées du PSG
  {
    cat: 'but',
    words: [
      ['La Remontada subie à Barcelone (2017)', 'The Remontada suffered in Barcelona (2017)'],
      ['Le doublé de Mbappé au Camp Nou (2021)', "Mbappé's brace at Camp Nou (2021)"],
      ['La finale 2020 perdue contre le Bayern', 'The 2020 final lost to Bayern'],
      ["Le sacre 5-0 contre l'Inter (2025)", 'The 5-0 title win against Inter (2025)'],
    ],
  },
  // Buts acrobatiques
  {
    cat: 'but',
    words: [
      ['Le retourné de Cristiano Ronaldo (Turin 2018)', "Cristiano Ronaldo's bicycle kick (Turin 2018)"],
      ["Le retourné de Zlatan contre l'Angleterre (2012)", "Zlatan's bicycle kick against England (2012)"],
      ['Le retourné de Garnacho à Everton (2023)', "Garnacho's bicycle kick at Everton (2023)"],
      ['Le retourné de Bale en finale (2018)', "Bale's bicycle kick in the final (2018)"],
    ],
  },
  // Les ratés cultes
  {
    cat: 'but',
    words: [
      ['Le penalty de Zaza (Euro 2016)', "Zaza's penalty (Euro 2016)"],
      ['Les ratés de Lukaku contre la Croatie (2022)', "Lukaku's misses against Croatia (2022)"],
      ["Le raté d'Higuaín en finale (2014)", "Higuaín's miss in the final (2014)"],
      ['Le penalty de Messi contre la Pologne (2022)', "Messi's penalty against Poland (2022)"],
      ['Le tir au but de Mbappé contre la Suisse (Euro 2021)', "Mbappé's shoot-out miss against Switzerland (Euro 2021)"],
    ],
  },
  // Exploits en un match
  {
    cat: 'but',
    words: [
      ['Les 5 buts de Lewandowski en 9 minutes (2015)', "Lewandowski's 5 goals in 9 minutes (2015)"],
      ['Les 5 buts de Messi contre Leverkusen (2012)', "Messi's 5 goals against Leverkusen (2012)"],
      ['Les 5 buts de Haaland contre Leipzig (2023)', "Haaland's 5 goals against Leipzig (2023)"],
      ["Le triplé de Lucas Moura contre l'Ajax (2019)", "Lucas Moura's hat-trick vs Ajax (2019)"],
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Memes                                                                */
  /* ------------------------------------------------------------------ */
  // Les carrières mèmes
  {
    cat: 'meme',
    words: [
      ["La Coupe du monde d'Adil Rami (2018)", "Adil Rami's World Cup (2018)"],
      ["Les blessures d'Abou Diaby", "Abou Diaby's injuries"],
      ["L'aventure de Ben Arfa au PSG", "Ben Arfa's PSG adventure"],
      ["L'aventure de Messi au PSG", "Messi's PSG adventure"],
    ],
  },
  // Moments viraux
  {
    cat: 'meme',
    words: [
      ['Les bouteilles de Coca de Ronaldo (Euro 2021)', "Ronaldo's Coca-Cola bottles (Euro 2021)"],
      ['Messi et Ronaldo aux échecs (Louis Vuitton)', 'Messi and Ronaldo playing chess (Louis Vuitton)'],
      ['« Ankara Messi »', '"Ankara Messi"'],
      ['Le baiser de Rubiales (2023)', "Rubiales's kiss (2023)"],
      ['Les roulades de Neymar (2018)', "Neymar's rolls (2018)"],
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Lexique                                                              */
  /* ------------------------------------------------------------------ */
  // Le jargon des commentateurs
  {
    cat: 'style',
    words: [['Frappe de mule', 'Thunderbolt'], ['Caviar', 'Perfect pass'], ['Casser les reins', 'Break ankles'], ['Ballon piqué', 'Chip'], ['Chevauchée', 'Solo run'], ['But de raccroc', 'Scrappy goal']],
  },
  // Compter les buts
  {
    cat: 'style',
    words: [['Doublé', 'Brace'], ['Triplé', 'Hat-trick'], ['Poker', 'Four goals'], ['Manita', '5-0 win'], 'Clean sheet', ['But contre son camp', 'Own goal']],
  },
  // Les mots de la tribune
  { cat: 'style', words: ['Kop', 'Ultras', 'Tifo', 'Capo', ['Fumigène', 'Flare'], ['Virage', 'Curva']] },
  // Passes
  {
    cat: 'style',
    words: [['Talonnade', 'Backheel'], ['Louche', 'Lofted pass'], ['Une-deux', 'One-two'], ['Passe en profondeur', 'Through ball'], ['Extérieur du pied', 'Outside of the boot'], ['Centre en retrait', 'Cut-back']],
  },
  // Les coups de pied arrêtés
  {
    cat: 'style',
    words: ['Corner', ['Coup franc direct', 'Direct free kick'], ['Coup franc indirect', 'Indirect free kick'], 'Penalty', ['Touche', 'Throw-in'], ['Six mètres', 'Goal kick']],
  },
  // Les fautes
  {
    cat: 'style',
    words: [['Tacle par derrière', 'Tackle from behind'], ['Croc-en-jambe', 'Trip'], ['Main', 'Handball'], ['Simulation', 'Dive'], 'Obstruction', ['Semelle', 'Studs-up challenge']],
  },
  // L'arbitrage et la VAR
  {
    cat: 'style',
    words: [['Hors-jeu semi-automatique', 'Semi-automated offside'], ['Carton rouge direct', 'Straight red card'], ['Second jaune', 'Second yellow'], ['Avantage', 'Advantage'], 'VAR', ['Quatrième arbitre', 'Fourth official']],
  },
  // Les phases d'un match
  {
    cat: 'style',
    words: [["Coup d'envoi", 'Kick-off'], ['Mi-temps', 'Half-time'], ['Temps additionnel', 'Stoppage time'], ['Prolongation', 'Extra time'], ['Tirs au but', 'Penalty shoot-out'], ['Coup de sifflet final', 'Final whistle']],
  },
  // Postes classiques
  {
    cat: 'style',
    words: [['Libéro', 'Sweeper'], ['Stoppeur', 'Stopper'], ['Meneur de jeu', 'Playmaker'], ['Ailier', 'Winger'], ['Avant-centre', 'Centre-forward'], ['Latéral', 'Full-back']],
  },
  // Rôles modernes
  {
    cat: 'style',
    words: [['Sentinelle', 'Holding midfielder'], 'Box-to-box', ['Faux 9', 'False 9'], ['Piston', 'Wing-back'], ['Latéral rentrant', 'Inverted full-back'], ['Ailier inversé', 'Inverted winger']],
  },
  // Philosophies
  {
    cat: 'style',
    words: ['Tiki-taka', 'Gegenpressing', ['Contre-attaque', 'Counter-attack'], ['Jeu de possession', 'Possession play'], 'Catenaccio', 'Joga Bonito', ['Football total', 'Total Football']],
  },
  // Le staff
  {
    cat: 'style',
    words: [['Entraîneur', 'Head coach'], ['Adjoint', 'Assistant coach'], ['Préparateur physique', 'Fitness coach'], ['Analyste vidéo', 'Video analyst'], ['Directeur sportif', 'Sporting director'], ['Recruteur', 'Scout']],
  },
  // Les surnoms
  { cat: 'style', words: ['La Pulga', 'CR7', 'Kyks', 'Ibra', 'Zizou', ['Le Roi', 'The King']] },

  /* ------------------------------------------------------------------ */
  /* Entraîneurs                                                          */
  /* ------------------------------------------------------------------ */
  // Les sélectionneurs
  { cat: 'entraineur', words: ['Deschamps', 'Scaloni', 'Southgate', 'Nagelsmann', 'Tuchel', 'Spalletti'] },
  // La nouvelle génération
  { cat: 'entraineur', words: ['Arteta', 'Xabi Alonso', 'Kompany', 'Ruben Amorim', 'Nagelsmann', 'Enzo Maresca'] },
  // Premier League aujourd'hui
  { cat: 'entraineur', words: ['Arteta', 'Arne Slot', 'Enzo Maresca', 'Ruben Amorim', 'Unai Emery', 'Eddie Howe'] },
  // L'école italienne
  { cat: 'entraineur', words: ['Conte', 'Simone Inzaghi', 'Allegri', 'Thiago Motta', 'Spalletti', 'Davide Ancelotti'] },
  // Ligue 1 aujourd'hui
  { cat: 'entraineur', words: ['Habib Beye', 'Will Still', 'Pierre Sage', 'Franck Haise', 'Paulo Fonseca', 'De Zerbi'] },
  // Ligue 1 old school
  { cat: 'entraineur', words: ['Bruno Genesio', 'Antoine Kombouaré', 'Christian Gourcuff', 'Claude Puel', 'Frédéric Antonetti', 'Guy Roux'] },
  // Le banc brésilien
  { cat: 'entraineur', words: ['Filipe Luís', 'Davide Ancelotti', 'Abel Ferreira', 'Tite', 'Dorival Júnior'] },

  /* ------------------------------------------------------------------ */
  /* Anciens groupes gratuits (gratuit ramené à ~230 combinaisons le 12/09/2026) */
  /* ------------------------------------------------------------------ */
  // Les gros de Premier League
  { cat: 'club', words: ['Manchester City', 'Arsenal', 'Liverpool', 'Chelsea', 'Manchester United', 'Tottenham'] },
  // Trophées individuels
  {
    cat: 'trophee',
    words: ["Ballon d'Or", 'The Best FIFA', ["Soulier d'or", 'Golden Shoe'], ['Trophée Kopa', 'Kopa Trophy'], ['Trophée Yachine', 'Yashin Trophy'], 'Golden Boy', ['Trophée Puskás', 'Puskás Award']],
  },
  // Stades français
  { cat: 'stade', words: ['Parc des Princes', 'Stade de France', 'Stade Vélodrome', 'Groupama Stadium', 'Stade Bollaert-Delelis', 'Stade Louis-II', 'Stade Geoffroy-Guichard'] },
  // Les nouveaux formats
  { cat: 'competition', words: [['Coupe du monde des clubs', 'Club World Cup'], 'Kings League', 'Baller League', ['Ligue des nations', 'Nations League'], ['Ligue Europa Conférence', 'Conference League']] },
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
  // Dribbles
  { cat: 'style', words: [['Petit pont', 'Nutmeg'], ['Grand pont', 'Knock-and-run'], 'Roulette', ['Virgule', 'Elastico'], ['Sombrero', 'Sombrero flick'], ['Crochet', 'Chop'], ['Passement de jambes', 'Step-over']] },
  // Les mots du mercato
  {
    cat: 'style',
    words: ['Mercato', ['Clause libératoire', 'Release clause'], ["Prêt avec option d'achat", 'Loan with option to buy'], ['Bon de sortie', 'Permission to leave'], ['Indemnité de transfert', 'Transfer fee'], 'Agent'],
  },
  // Les entraîneurs du PSG
  { cat: 'entraineur', words: ['Laurent Blanc', 'Unai Emery', 'Tuchel', 'Pochettino', 'Galtier', 'Luis Enrique'] },
  // Les légendes du banc
  { cat: 'entraineur', words: ['Sir Alex Ferguson', 'Arsène Wenger', 'Mourinho', 'Guy Roux', 'Simeone', 'Zidane'] },
];
