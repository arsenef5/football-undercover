import type { GroupDef } from './types';

/**
 * Pack Pro — joueurs. Chaque groupe rassemble des joueurs qui SE RESSEMBLENT (poste, style,
 * club, époque, trajectoire) : les deux mots tirés sont proches et l'imposteur passe inaperçu.
 * Noms identiques dans les deux langues. Un joueur peut apparaître dans plusieurs groupes.
 */
export const PRO_PLAYERS: GroupDef[] = [
  /* ------------------------------------------------------------------ */
  /* Par poste et style, aujourd'hui                                      */
  /* ------------------------------------------------------------------ */
  // Ailiers gauches actuels
  { cat: 'joueur', words: ['Vinícius Jr', 'Rafael Leão', 'Kvaratskhelia', 'Nico Williams', 'Doku', 'Luis Díaz', 'Barcola', 'Grealish', 'Mitoma', 'Sané'] },
  // Ailiers droits actuels
  { cat: 'joueur', words: ['Salah', 'Saka', 'Lamine Yamal', 'Dembélé', 'Olise', 'Mahrez', 'Kubo', 'Rodrygo', 'Lookman', 'Chiesa'] },
  // Grands numéros 9 d'aujourd'hui
  { cat: 'joueur', words: ['Haaland', 'Kane', 'Lewandowski', 'Osimhen', 'Vlahović', 'Isak', 'Gyökeres', 'Darwin Núñez', 'Kolo Muani', 'Gonçalo Ramos', 'Šeško', 'Openda'] },
  // Attaquants vifs d'aujourd'hui
  { cat: 'joueur', words: ['Lautaro Martínez', 'Julián Álvarez', 'Griezmann', 'Rashford', 'Dybala', 'Depay', 'Jonathan David', 'Lacazette', 'Ben Yedder', 'Iñaki Williams', 'Raphinha'] },
  // Milieux créateurs d'aujourd'hui
  { cat: 'joueur', words: ['De Bruyne', 'Ødegaard', 'Bruno Fernandes', 'Bellingham', 'Pedri', 'Wirtz', 'Musiala', 'Dani Olmo', 'Kroos', 'Modrić', 'Bernardo Silva', 'Cole Palmer'] },
  // Sentinelles et relayeurs d'aujourd'hui
  { cat: 'joueur', words: ['Rodri', 'Casemiro', 'Tchouaméni', 'Declan Rice', 'Zubimendi', 'Kimmich', 'Vitinha', 'Camavinga', 'Mac Allister', 'Barella', 'Tonali', 'Caicedo'] },
  // Défenseurs centraux d'aujourd'hui
  { cat: 'joueur', words: ['Van Dijk', 'Rüdiger', 'Saliba', 'Koundé', 'Upamecano', 'Marquinhos', 'Bastoni', 'Gvardiol', 'Konaté', 'Cubarsí', 'Cristian Romero', 'Militão'] },
  // Latéraux d'aujourd'hui
  { cat: 'joueur', words: ['Alexander-Arnold', 'Hakimi', 'Theo Hernández', 'Robertson', 'Cancelo', 'Nuno Mendes', 'Dimarco', 'Dumfries', 'Walker', 'Grimaldo', 'Frimpong'] },
  // Gardiens d'aujourd'hui
  { cat: 'joueur', words: ['Courtois', 'Alisson', 'Ederson', 'Donnarumma', 'Ter Stegen', 'Oblak', 'Maignan', 'Sommer', 'Diogo Costa', 'Raya', 'Emiliano Martínez', 'Chevalier'] },

  /* ------------------------------------------------------------------ */
  /* Par poste et style, toutes époques                                   */
  /* ------------------------------------------------------------------ */
  // Gardiens légendaires
  { cat: 'joueur', words: ['Buffon', 'Casillas', 'Kahn', 'Schmeichel', 'Van der Sar', 'Čech', 'Zoff', 'Yashin', 'Barthez', 'Lloris', 'Julio César', 'Dida'] },
  // Dribbleurs de légende
  { cat: 'joueur', words: ['Garrincha', 'George Best', 'Ronaldinho', 'Denílson', 'Okocha', 'Quaresma', 'Robinho', 'Ben Arfa', 'Nani', 'Douglas Costa', 'Ribéry', 'Robben'] },
  // Milieux techniques (suite)
  { cat: 'joueur', words: ['Scholes', 'Seedorf', 'Deco', 'Fàbregas', 'Isco', 'Nasri', 'Cazorla', 'Mata', 'Sneijder', 'Rakitić', 'Koke', 'Thiago Motta', 'Guti', 'Gourcuff'] },
  // Meneurs de jeu classiques
  { cat: 'joueur', words: ['Baggio', 'Laudrup', 'Hagi', 'Valderrama', 'Pastore', 'Nedvěd', 'Ballack', 'Hamšík', 'Zola', 'Cantona', 'Payet', 'Riquelme'] },
  // Grands avant-centres des années 2000
  { cat: 'joueur', words: ['Shevchenko', 'Trezeguet', 'Luca Toni', 'Adebayor', 'Džeko', 'Mandžukić', 'Cavani', 'Diego Costa', 'Falcao', 'Higuaín', 'Pauleta', 'Bierhoff'] },
  // Renards des surfaces
  { cat: 'joueur', words: ['Raúl', 'Solskjær', 'Chicharito', 'Gerd Müller', 'Thomas Müller', 'Vardy', 'Defoe', 'Djibril Cissé', 'Immobile', "Eto'o", 'Milito'] },
  // Attaquants complets des années 2000
  { cat: 'joueur', words: ['Henry', 'Ronaldo (R9)', "Eto'o", 'Drogba', 'Adriano', 'Fernando Torres', 'David Villa', 'Rooney', 'Tévez', 'Ibrahimović', 'Benzema', 'Agüero'] },
  // Latéraux de légende
  { cat: 'joueur', words: ['Cafu', 'Roberto Carlos', 'Maicon', 'Dani Alves', 'Marcelo', 'Zambrotta', 'Lahm', 'Evra', 'Sagna', 'Abidal', 'Ashley Cole', 'Gary Neville', 'Zanetti'] },
  // Défenseurs durs à cuire
  { cat: 'joueur', words: ['Pepe', 'Chiellini', 'Vidić', 'Terry', 'Materazzi', 'Puyol', 'Koulibaly', 'Godín', 'Kompany', 'Hummels', 'Boateng', 'Thiago Silva', 'Lúcio'] },
  // Milieux guerriers
  { cat: 'joueur', words: ['Gattuso', 'Davids', 'Essien', 'Matuidi', 'Vidal', 'Fellaini', 'Nigel de Jong', 'Van Bommel', 'Lassana Diarra', 'Sissoko', 'Schweinsteiger', 'Roy Keane'] },
  // Passeurs longs et sentinelles
  { cat: 'joueur', words: ['Xabi Alonso', 'Busquets', 'Jorginho', 'Carrick', 'Fabinho', 'Thiago Motta', 'Pirlo', 'Kroos', 'Rodri', 'Zubimendi', 'Makélélé'] },
  // Ailiers de vitesse (suite)
  { cat: 'joueur', words: ['Walcott', 'Bale', 'Overmars', 'Adama Traoré', 'Coman', 'Gervinho', 'Nicolas Pépé', 'Iñaki Williams', 'Aubameyang', 'Mbappé', 'Leroy Sané'] },
  // Gauchers célèbres
  { cat: 'joueur', words: ['Messi', 'Maradona', 'Di María', 'Robben', 'Salah', 'Griezmann', 'Rivaldo', 'Roberto Carlos', 'Marcelo', 'Ødegaard', 'Foden', 'Mahrez', 'Bale', 'Recoba'] },
  // Spécialistes du coup franc
  { cat: 'joueur', words: ['Juninho', 'Beckham', 'Roberto Carlos', 'Pirlo', 'Messi', 'Ronaldinho', 'Zico', 'Platini', 'Del Piero', 'Cristiano Ronaldo', 'Payet', 'Ward-Prowse', 'Çalhanoğlu', 'Eriksen'] },
  // Capitaines emblématiques
  { cat: 'joueur', words: ['Zanetti', 'Gerrard', 'Terry', 'Puyol', 'Maldini', 'Deschamps', 'Lahm', 'Casillas', 'Buffon', 'Kompany', 'Totti', 'Sergio Ramos', 'Lloris', 'Thiago Silva'] },
  // Bad boys et fortes têtes
  { cat: 'joueur', words: ['Cantona', 'Balotelli', 'Cassano', 'Suárez', 'Ben Arfa', 'Nasri', 'Adebayor', 'Ibrahimović', 'Di Canio', 'Joey Barton', 'Diego Costa', 'Pepe', 'Materazzi'] },
  // Promesses non tenues
  { cat: 'joueur', words: ['Ben Arfa', 'Freddy Adu', 'Bojan', 'Pato', 'Robinho', 'Adriano', 'Balotelli', 'Gourcuff', 'Renato Sanches', 'Martial', 'Coutinho', 'Dele Alli', 'Götze', 'Hulk'] },
  // Joueurs devenus entraîneurs
  { cat: 'joueur', words: ['Guardiola', 'Zidane', 'Deschamps', 'Ancelotti', 'Xabi Alonso', 'Simeone', 'Arteta', 'Xavi', 'Pirlo', 'Gattuso', 'Henry', 'Thiago Motta', 'Vieira', 'Lampard', 'Gerrard', 'Rooney'] },
  // Jeunes cracks (suite)
  { cat: 'joueur', words: ['Estêvão', 'Mastantuono', 'Arda Güler', 'Xavi Simons', 'Rayan Cherki', 'Kobbie Mainoo', 'Garnacho', 'Lewis-Skelly', 'Nico Paz', 'Kenan Yıldız', 'Endrick', 'Cubarsí'] },
  // Partis en Arabie saoudite ou aux États-Unis
  { cat: 'joueur', words: ['Cristiano Ronaldo', 'Benzema', 'Neymar', 'Mané', 'Kanté', 'Mahrez', 'Koulibaly', 'Rúben Neves', 'Milinković-Savić', 'Messi', 'Busquets', 'Jordi Alba', 'Suárez', 'Beckham', 'Kaká'] },
  // Ballons d'Or
  { cat: 'joueur', words: ['Messi', 'Cristiano Ronaldo', 'Modrić', 'Benzema', 'Rodri', 'Kaká', 'Cannavaro', 'Ronaldinho', 'Shevchenko', 'Nedvěd', 'Owen', 'Figo', 'Rivaldo', 'Dembélé'] },

  /* ------------------------------------------------------------------ */
  /* Grands buteurs, par championnat                                      */
  /* ------------------------------------------------------------------ */
  // Grands buteurs de Ligue 1
  { cat: 'joueur', words: ['Papin', 'Cavani', 'Ibrahimović', 'Mbappé', 'Benzema', 'Lacazette', 'Gignac', 'Ben Yedder', 'Pauleta', 'Falcao', 'Balotelli', 'Osimhen', 'Jonathan David', 'Dembélé'] },
  // Grands buteurs de Premier League
  { cat: 'joueur', words: ['Henry', 'Kane', 'Rooney', 'Agüero', 'Lampard', 'Salah', 'Vardy', 'Van Persie', 'Drogba', 'Owen', 'Lukaku', 'Haaland', 'Aubameyang', 'Suárez', 'Son Heung-min'] },
  // Grands buteurs de Liga
  { cat: 'joueur', words: ['Messi', 'Cristiano Ronaldo', 'Raúl', 'Benzema', 'Suárez', 'Griezmann', "Eto'o", 'David Villa', 'Fernando Torres', 'Ronaldo (R9)', 'Rivaldo', 'Hugo Sánchez', 'Di Stéfano', 'Lewandowski'] },
  // Grands buteurs de Serie A
  { cat: 'joueur', words: ['Totti', 'Del Piero', 'Batistuta', 'Ibrahimović', 'Shevchenko', 'Trezeguet', 'Immobile', 'Higuaín', 'Icardi', 'Cristiano Ronaldo', 'Lautaro Martínez', 'Osimhen', 'Vlahović'] },
  // Grands buteurs de Bundesliga
  { cat: 'joueur', words: ['Gerd Müller', 'Lewandowski', 'Aubameyang', 'Pizarro', 'Haaland', 'Thomas Müller', 'Robben', 'Reus', 'Kane', 'Rummenigge', 'Luca Toni', 'Musiala'] },

  /* ------------------------------------------------------------------ */
  /* Légendes de clubs                                                    */
  /* ------------------------------------------------------------------ */
  // Real Madrid
  { cat: 'joueur', words: ['Di Stéfano', 'Puskás', 'Raúl', 'Zidane', 'Figo', 'Roberto Carlos', 'Casillas', 'Sergio Ramos', 'Benzema', 'Modrić', 'Kroos', 'Marcelo', 'Cristiano Ronaldo', 'Bale'] },
  // FC Barcelone
  { cat: 'joueur', words: ['Cruyff', 'Stoichkov', 'Laudrup', 'Rivaldo', 'Ronaldinho', 'Xavi', 'Iniesta', 'Messi', 'Puyol', 'Piqué', 'Busquets', "Eto'o", 'Neymar', 'Suárez', 'Dani Alves'] },
  // Manchester United
  { cat: 'joueur', words: ['Cantona', 'Giggs', 'Scholes', 'Beckham', 'Roy Keane', 'Rooney', 'Cristiano Ronaldo', 'Van Nistelrooy', 'Ferdinand', 'Vidić', 'Schmeichel', 'Gary Neville', 'Solskjær'] },
  // Liverpool
  { cat: 'joueur', words: ['Dalglish', 'Gerrard', 'Carragher', 'Fernando Torres', 'Suárez', 'Salah', 'Mané', 'Firmino', 'Van Dijk', 'Alisson', 'Owen', 'Fowler', 'Alexander-Arnold', 'Robertson'] },
  // Arsenal
  { cat: 'joueur', words: ['Henry', 'Bergkamp', 'Vieira', 'Pirès', 'Ian Wright', 'Tony Adams', 'Seaman', 'Fàbregas', 'Van Persie', 'Özil', 'Saka', 'Ødegaard', 'Ljungberg', 'Alexis Sánchez'] },
  // Chelsea
  { cat: 'joueur', words: ['Drogba', 'Lampard', 'Terry', 'Čech', 'Hazard', 'Essien', 'Zola', 'Kanté', 'Ashley Cole', 'Joe Cole', 'Diego Costa', 'Cole Palmer', 'Ballack', 'Mount'] },
  // Manchester City
  { cat: 'joueur', words: ['Agüero', 'David Silva', 'Kompany', 'Yaya Touré', 'De Bruyne', 'Sterling', 'Foden', 'Rodri', 'Haaland', 'Ederson', 'Zabaleta', 'Joe Hart', 'Gündoğan', 'Bernardo Silva'] },
  // Tottenham
  { cat: 'joueur', words: ['Kane', 'Son Heung-min', 'Bale', 'Modrić', 'Eriksen', 'Lloris', 'Dele Alli', 'Berbatov', 'Lucas Moura', 'Ledley King', 'Cristian Romero'] },
  // Bayern Munich
  { cat: 'joueur', words: ['Beckenbauer', 'Gerd Müller', 'Rummenigge', 'Kahn', 'Ballack', 'Schweinsteiger', 'Lahm', 'Ribéry', 'Robben', 'Lewandowski', 'Thomas Müller', 'Neuer', 'Kimmich', 'Musiala'] },
  // Borussia Dortmund
  { cat: 'joueur', words: ['Sammer', 'Reus', 'Götze', 'Lewandowski', 'Aubameyang', 'Dembélé', 'Sancho', 'Haaland', 'Bellingham', 'Hummels', 'Weidenfeller', 'Kagawa', 'Guerreiro'] },
  // Juventus
  { cat: 'joueur', words: ['Platini', 'Zidane', 'Del Piero', 'Nedvěd', 'Trezeguet', 'Buffon', 'Pirlo', 'Pogba', 'Dybala', 'Chiellini', 'Bonucci', 'Vlahović', 'Tévez', 'Cristiano Ronaldo'] },
  // AC Milan
  { cat: 'joueur', words: ['Baresi', 'Maldini', 'Van Basten', 'Gullit', 'Shevchenko', 'Kaká', 'Pirlo', 'Gattuso', 'Seedorf', 'Ibrahimović', 'Rafael Leão', 'Maignan', 'Theo Hernández', 'Weah'] },
  // Inter Milan
  { cat: 'joueur', words: ['Zanetti', 'Ronaldo (R9)', 'Adriano', 'Ibrahimović', "Eto'o", 'Sneijder', 'Milito', 'Cambiasso', 'Julio César', 'Icardi', 'Lautaro Martínez', 'Barella', 'Bastoni', 'Lukaku'] },
  // PSG
  { cat: 'joueur', words: ['Raí', 'Weah', 'Pauleta', 'Ronaldinho', 'Ibrahimović', 'Cavani', 'Thiago Silva', 'Verratti', 'Di María', 'Pastore', 'Thiago Motta', 'Neymar', 'Mbappé', 'Marquinhos', 'Hakimi', 'Dembélé'] },
  // Olympique de Marseille
  { cat: 'joueur', words: ['Papin', 'Boli', 'Waddle', 'Drogba', 'Ribéry', 'Nasri', 'Payet', 'Thauvin', 'Mandanda', 'Valbuena', 'Gignac', 'Barthez', 'Desailly', 'Deschamps'] },
  // Olympique Lyonnais
  { cat: 'joueur', words: ['Juninho', 'Govou', 'Benzema', 'Lacazette', 'Fekir', 'Gourcuff', 'Malouda', 'Essien', 'Coupet', 'Cris', 'Lisandro López', 'Ben Arfa', 'Rayan Cherki', 'Tolisso'] },
  // Monaco, Lille et les autres clubs de Ligue 1
  { cat: 'joueur', words: ['Henry', 'Trezeguet', 'Giuly', 'Falcao', 'Mbappé', 'Bernardo Silva', 'Fabinho', 'Lemar', 'Ben Yedder', 'Golovin', 'Hazard', 'Nicolas Pépé', 'Osimhen', 'Jonathan David', 'Seko Fofana', 'Openda'] },
  // Naples
  { cat: 'joueur', words: ['Maradona', 'Careca', 'Zola', 'Cavani', 'Lavezzi', 'Hamšík', 'Higuaín', 'Insigne', 'Mertens', 'Koulibaly', 'Osimhen', 'Kvaratskhelia', 'Lobotka'] },
  // Atlético de Madrid
  { cat: 'joueur', words: ['Fernando Torres', 'Griezmann', 'Koke', 'Oblak', 'Godín', 'Simeone', 'Falcao', 'Agüero', 'Forlán', 'Diego Costa', 'Marcos Llorente', 'Kiko'] },
  // Ajax
  { cat: 'joueur', words: ['Cruyff', 'Neeskens', 'Bergkamp', 'Litmanen', 'Kluivert', 'Davids', 'Seedorf', 'Ibrahimović', 'Suárez', 'De Ligt', 'Van der Sar', 'Ziyech', 'Tadić'] },
  // Benfica, Porto et Sporting
  { cat: 'joueur', words: ['Eusébio', 'Rui Costa', 'Nuno Gomes', 'Di María', 'David Luiz', 'João Félix', 'Deco', 'Falcao', 'Hulk', 'James Rodríguez', 'Casillas', 'Figo', 'Cristiano Ronaldo', 'Nani', 'Quaresma', 'Gyökeres', 'Bruno Fernandes'] },
  // Boca, River, Flamengo, Santos
  { cat: 'joueur', words: ['Maradona', 'Riquelme', 'Palermo', 'Tévez', 'Batistuta', 'Francescoli', 'Ortega', 'Julián Álvarez', 'Zico', 'Ronaldinho', 'Gabigol', 'Pelé', 'Neymar', 'Robinho', 'Endrick'] },

  /* ------------------------------------------------------------------ */
  /* Générations et sélections                                            */
  /* ------------------------------------------------------------------ */
  // Bleus champions du monde 1998
  { cat: 'joueur', words: ['Zidane', 'Deschamps', 'Desailly', 'Laurent Blanc', 'Barthez', 'Henry', 'Trezeguet', 'Vieira', 'Pirès', 'Karembeu', 'Wiltord'] },
  // Bleus champions du monde 2018
  { cat: 'joueur', words: ['Mbappé', 'Griezmann', 'Pogba', 'Kanté', 'Varane', 'Lloris', 'Umtiti', 'Pavard', 'Giroud', 'Matuidi', 'Lucas Hernández', 'Dembélé', 'Fekir', 'Thauvin'] },
  // Bleus des années 2022–2026
  { cat: 'joueur', words: ['Mbappé', 'Griezmann', 'Tchouaméni', 'Camavinga', 'Rabiot', 'Kolo Muani', 'Theo Hernández', 'Saliba', 'Koundé', 'Upamecano', 'Maignan', 'Zaïre-Emery', 'Coman', 'Marcus Thuram', 'Olise', 'Barcola', 'Désiré Doué'] },
  // Espagne 2008–2012
  { cat: 'joueur', words: ['Casillas', 'Sergio Ramos', 'Piqué', 'Puyol', 'Xavi', 'Iniesta', 'Xabi Alonso', 'Busquets', 'David Villa', 'Fernando Torres', 'Fàbregas', 'David Silva', 'Pedro'] },
  // Allemagne 2014
  { cat: 'joueur', words: ['Neuer', 'Lahm', 'Hummels', 'Boateng', 'Schweinsteiger', 'Khedira', 'Kroos', 'Özil', 'Thomas Müller', 'Götze', 'Schürrle'] },
  // Argentine championne du monde 2022
  { cat: 'joueur', words: ['Emiliano Martínez', 'Molina', 'Cristian Romero', 'De Paul', 'Mac Allister', 'Di María', 'Messi', 'Julián Álvarez', 'Lautaro Martínez', 'Montiel', 'Acuña'] },
  // Brésil 2002
  { cat: 'joueur', words: ['Marcos', 'Cafu', 'Roberto Carlos', 'Lúcio', 'Gilberto Silva', 'Kléberson', 'Rivaldo', 'Ronaldinho', 'Ronaldo (R9)', 'Kaká', 'Denílson', 'Edmílson'] },
  // Brésil d'aujourd'hui
  { cat: 'joueur', words: ['Neymar', 'Vinícius Jr', 'Rodrygo', 'Raphinha', 'Endrick', 'Casemiro', 'Marquinhos', 'Militão', 'Bremer', 'Estêvão', 'Martinelli', 'Richarlison', 'Paquetá'] },
  // Angleterre d'aujourd'hui
  { cat: 'joueur', words: ['Kane', 'Bellingham', 'Saka', 'Foden', 'Declan Rice', 'Cole Palmer', 'Rashford', 'Sterling', 'Grealish', 'Alexander-Arnold', 'Walker', 'Maguire', 'Kobbie Mainoo', 'Watkins'] },
  // Angleterre, la génération dorée des années 2000
  { cat: 'joueur', words: ['Beckham', 'Gerrard', 'Lampard', 'Scholes', 'Rooney', 'Owen', 'Terry', 'Ferdinand', 'Ashley Cole', 'Gary Neville', 'Sol Campbell', 'Joe Cole', 'Crouch', 'Defoe'] },
  // Italie championne du monde 2006
  { cat: 'joueur', words: ['Buffon', 'Cannavaro', 'Materazzi', 'Zambrotta', 'Grosso', 'Pirlo', 'Gattuso', 'Camoranesi', 'Totti', 'Luca Toni', 'Del Piero', 'Gilardino'] },
  // Pays-Bas, les légendes
  { cat: 'joueur', words: ['Cruyff', 'Van Basten', 'Gullit', 'Bergkamp', 'Van Nistelrooy', 'Van Persie', 'Robben', 'Sneijder', 'Kluivert', 'Davids', 'Seedorf', 'Overmars', 'Stam', 'Koeman'] },
  // Portugal, les légendes
  { cat: 'joueur', words: ['Eusébio', 'Figo', 'Rui Costa', 'Deco', 'Cristiano Ronaldo', 'Pepe', 'Nani', 'Quaresma', 'Bernardo Silva', 'Bruno Fernandes', 'João Félix', 'Rafael Leão', 'Vitinha', 'Rúben Dias', 'Nuno Mendes'] },
  // Belgique, la génération dorée
  { cat: 'joueur', words: ['Hazard', 'De Bruyne', 'Lukaku', 'Courtois', 'Kompany', 'Vertonghen', 'Alderweireld', 'Witsel', 'Fellaini', 'Mertens', 'Carrasco', 'Tielemans', 'Doku', 'Trossard'] },
  // Croatie
  { cat: 'joueur', words: ['Modrić', 'Rakitić', 'Perišić', 'Mandžukić', 'Kovačić', 'Brozović', 'Gvardiol', 'Kramarić', 'Lovren', 'Šuker', 'Boban', 'Prosinečki'] },
  // Afrique, les légendes
  { cat: 'joueur', words: ['Weah', 'Drogba', "Eto'o", 'Yaya Touré', 'Okocha', 'Kanu', 'Roger Milla', 'Abédi Pelé', 'Madjer', 'Essien', 'Adebayor', 'Asamoah Gyan', 'El Hadji Diouf', 'Kanouté'] },
  // Afrique, les stars d'aujourd'hui
  { cat: 'joueur', words: ['Salah', 'Mané', 'Mahrez', 'Hakimi', 'Osimhen', 'Aubameyang', 'Koulibaly', 'Bounou', 'Ziyech', 'Lookman', 'Kudus', 'Brahim Díaz', 'En-Nesyri', 'Amrabat'] },
  // Maroc, demi-finaliste 2022
  { cat: 'joueur', words: ['Bounou', 'Hakimi', 'Saïss', 'Aguerd', 'Mazraoui', 'Amrabat', 'Ounahi', 'Ziyech', 'Boufal', 'En-Nesyri'] },
  // Asie
  { cat: 'joueur', words: ['Son Heung-min', 'Park Ji-sung', 'Nakata', 'Kagawa', 'Mitoma', 'Kubo', 'Minamino', 'Endo', 'Lee Kang-in', 'Nakamura', 'Doan'] },
  // Amérique du Sud (hors Brésil et Argentine)
  { cat: 'joueur', words: ['Suárez', 'Cavani', 'Forlán', 'Valverde', 'Falcao', 'James Rodríguez', 'Alexis Sánchez', 'Vidal', 'Luis Díaz', 'Zamorano', 'Valderrama', 'Darwin Núñez', 'Enner Valencia', 'Cubillas'] },
  // Scandinavie et Europe du Nord
  { cat: 'joueur', words: ['Ibrahimović', 'Haaland', 'Ødegaard', 'Eriksen', 'Laudrup', 'Schmeichel', 'Larsson', 'Isak', 'Gyökeres', 'Højlund', 'Kulusevski', 'Forsberg', 'Elanga'] },
  // Europe de l'Est
  { cat: 'joueur', words: ['Shevchenko', 'Nedvěd', 'Hagi', 'Stoichkov', 'Mudryk', 'Zinchenko', 'Lewandowski', 'Szczęsny', 'Berbatov', 'Yashin', 'Rosický', 'Arshavin'] },
  // Balkans et Turquie
  { cat: 'joueur', words: ['Milinković-Savić', 'Mitrović', 'Vlahović', 'Džeko', 'Pjanić', 'Çalhanoğlu', 'Arda Turan', 'Hakan Şükür', 'Arda Güler', 'Kenan Yıldız', 'Kolarov', 'Tadić'] },
];
