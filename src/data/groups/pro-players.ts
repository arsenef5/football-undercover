import type { GroupDef } from './types';

/**
 * Pack Pro — joueurs. Groupes PETITS (4 à 6 noms) et SERRÉS : même poste, même époque, même
 * profil ou même club, pour que les deux mots tirés se ressemblent et que l'imposteur passe
 * inaperçu. Que des noms connus ; les anciens seulement s'ils sont des icônes.
 * Noms identiques dans les deux langues. Un joueur peut apparaître dans plusieurs groupes.
 */
export const PRO_PLAYERS: GroupDef[] = [
  /* ------------------------------------------------------------------ */
  /* Angleterre                                                           */
  /* ------------------------------------------------------------------ */
  // Attaquants anglais des années 2010
  { cat: 'joueur', words: ['Sturridge', 'Welbeck', 'Sterling', 'Rashford', 'Vardy'] },
  // Attaquants anglais des années 2020
  { cat: 'joueur', words: ['Kane', 'Watkins', 'Cole Palmer', 'Saka', 'Gordon'] },
  // Milieux anglais des années 2000
  { cat: 'joueur', words: ['Gerrard', 'Lampard', 'Scholes', 'Beckham', 'Carrick'] },
  // Milieux anglais des années 2010
  { cat: 'joueur', words: ['Wilshere', 'Henderson', 'Dele Alli', 'Milner', 'Lingard'] },
  // Milieux anglais des années 2020
  { cat: 'joueur', words: ['Bellingham', 'Declan Rice', 'Foden', 'Kobbie Mainoo', 'Wharton'] },
  // Défenseurs anglais des années 2000
  { cat: 'joueur', words: ['Terry', 'Ferdinand', 'Ashley Cole', 'Gary Neville', 'Sol Campbell'] },
  // Défenseurs anglais des années 2010–2020
  { cat: 'joueur', words: ['Walker', 'Stones', 'Maguire', 'Alexander-Arnold', 'Trippier', 'Guéhi'] },
  // Gardiens anglais
  { cat: 'joueur', words: ['Seaman', 'Joe Hart', 'Pickford', 'Ramsdale'] },

  /* ------------------------------------------------------------------ */
  /* France                                                               */
  /* ------------------------------------------------------------------ */
  // Bleus 98, l'attaque et le milieu
  { cat: 'joueur', words: ['Zidane', 'Henry', 'Trezeguet', 'Vieira', 'Pirès', 'Deschamps'] },
  // Bleus 98, la défense
  { cat: 'joueur', words: ['Desailly', 'Laurent Blanc', 'Barthez', 'Karembeu', 'Wiltord'] },
  // Attaquants français des années 2000
  { cat: 'joueur', words: ['Henry', 'Trezeguet', 'Anelka', 'Djibril Cissé', 'Saha', 'Govou'] },
  // Attaquants français des années 2010
  { cat: 'joueur', words: ['Benzema', 'Giroud', 'Gignac', 'Lacazette', 'Ben Yedder', 'Griezmann'] },
  // Ailiers français des années 2020
  { cat: 'joueur', words: ['Dembélé', 'Coman', 'Barcola', 'Désiré Doué', 'Olise', 'Nkunku'] },
  // Attaquants français des années 2020
  { cat: 'joueur', words: ['Mbappé', 'Kolo Muani', 'Marcus Thuram', 'Gonçalo Ramos', 'Mikautadze'] },
  // Milieux français des années 2000
  { cat: 'joueur', words: ['Vieira', 'Makélélé', 'Malouda', 'Ribéry', 'Nasri', 'Gourcuff'] },
  // Milieux français des années 2010
  { cat: 'joueur', words: ['Pogba', 'Kanté', 'Matuidi', 'Cabaye', 'Sissoko', 'Rabiot'] },
  // Milieux français des années 2020
  { cat: 'joueur', words: ['Tchouaméni', 'Camavinga', 'Zaïre-Emery', 'Rabiot', 'Koné', 'Fofana'] },
  // Défenseurs français des années 2010
  { cat: 'joueur', words: ['Varane', 'Koscielny', 'Umtiti', 'Sakho', 'Laporte', 'Kimpembe'] },
  // Défenseurs français des années 2020
  { cat: 'joueur', words: ['Saliba', 'Koundé', 'Upamecano', 'Konaté', 'Pavard', 'Lucas Hernández'] },
  // Latéraux français
  { cat: 'joueur', words: ['Evra', 'Sagna', 'Abidal', 'Theo Hernández', 'Clauss', 'Digne'] },
  // Gardiens français
  { cat: 'joueur', words: ['Barthez', 'Coupet', 'Lloris', 'Mandanda', 'Maignan', 'Areola'] },

  /* ------------------------------------------------------------------ */
  /* Espagne                                                              */
  /* ------------------------------------------------------------------ */
  // Milieux espagnols de 2010
  { cat: 'joueur', words: ['Xavi', 'Iniesta', 'Busquets', 'Xabi Alonso', 'Fàbregas', 'David Silva'] },
  // Attaquants espagnols des années 2000–2010
  { cat: 'joueur', words: ['Raúl', 'David Villa', 'Fernando Torres', 'Pedro', 'Llorente'] },
  // Défenseurs espagnols
  { cat: 'joueur', words: ['Sergio Ramos', 'Piqué', 'Puyol', 'Jordi Alba', 'Azpilicueta'] },
  // Jeunes Espagnols des années 2020
  { cat: 'joueur', words: ['Lamine Yamal', 'Pedri', 'Gavi', 'Cubarsí', 'Nico Williams', 'Zubimendi'] },
  // Espagnols confirmés des années 2020
  { cat: 'joueur', words: ['Rodri', 'Dani Olmo', 'Oyarzabal', 'Cucurella', 'Fabián Ruiz', 'Mikel Merino'] },
  // Gardiens espagnols
  { cat: 'joueur', words: ['Casillas', 'De Gea', 'Raya', 'Unai Simón', 'Kepa'] },

  /* ------------------------------------------------------------------ */
  /* Allemagne                                                            */
  /* ------------------------------------------------------------------ */
  // Milieux allemands des années 2010
  { cat: 'joueur', words: ['Schweinsteiger', 'Kroos', 'Özil', 'Khedira', 'Gündoğan'] },
  // Attaquants allemands des années 2010
  { cat: 'joueur', words: ['Thomas Müller', 'Reus', 'Götze', 'Werner', 'Sané'] },
  // Défenseurs allemands des années 2010
  { cat: 'joueur', words: ['Lahm', 'Hummels', 'Boateng', 'Rüdiger', 'Süle'] },
  // Jeunes Allemands des années 2020
  { cat: 'joueur', words: ['Musiala', 'Wirtz', 'Havertz', 'Adeyemi', 'Woltemade'] },
  // Icônes allemandes
  { cat: 'joueur', words: ['Beckenbauer', 'Gerd Müller', 'Ballack', 'Kahn', 'Neuer'] },

  /* ------------------------------------------------------------------ */
  /* Italie                                                               */
  /* ------------------------------------------------------------------ */
  // Attaquants italiens des années 2000
  { cat: 'joueur', words: ['Totti', 'Del Piero', 'Luca Toni', 'Cassano', 'Gilardino'] },
  // Attaquants italiens des années 2010–2020
  { cat: 'joueur', words: ['Balotelli', 'Immobile', 'Insigne', 'Chiesa', 'Kean'] },
  // Milieux italiens des années 2010–2020
  { cat: 'joueur', words: ['Verratti', 'Jorginho', 'Barella', 'Tonali', 'Locatelli'] },
  // Défenseurs italiens des années 2000
  { cat: 'joueur', words: ['Maldini', 'Cannavaro', 'Materazzi', 'Zambrotta', 'Grosso'] },
  // Défenseurs italiens des années 2010–2020
  { cat: 'joueur', words: ['Chiellini', 'Bonucci', 'Bastoni', 'Di Lorenzo', 'Acerbi'] },
  // Gardiens italiens
  { cat: 'joueur', words: ['Buffon', 'Donnarumma', 'Sirigu', 'Meret'] },

  /* ------------------------------------------------------------------ */
  /* Brésil et Argentine                                                  */
  /* ------------------------------------------------------------------ */
  // Attaquants brésiliens des années 2000
  { cat: 'joueur', words: ['Ronaldo (R9)', 'Ronaldinho', 'Adriano', 'Robinho', 'Kaká'] },
  // Brésiliens des années 2010
  { cat: 'joueur', words: ['Neymar', 'Coutinho', 'Firmino', 'Gabriel Jesus', 'Richarlison'] },
  // Brésiliens des années 2020
  { cat: 'joueur', words: ['Vinícius Jr', 'Rodrygo', 'Raphinha', 'Endrick', 'Estêvão'] },
  // Latéraux brésiliens
  { cat: 'joueur', words: ['Cafu', 'Roberto Carlos', 'Dani Alves', 'Marcelo', 'Maicon'] },
  // Défenseurs centraux brésiliens
  { cat: 'joueur', words: ['Thiago Silva', 'Marquinhos', 'Militão', 'Lúcio', 'David Luiz', 'Bremer'] },
  // Milieux brésiliens
  { cat: 'joueur', words: ['Casemiro', 'Fabinho', 'Paquetá', 'Bruno Guimarães', 'Gilberto Silva'] },
  // Gardiens brésiliens
  { cat: 'joueur', words: ['Alisson', 'Ederson', 'Julio César', 'Dida'] },
  // Attaquants argentins des années 2000–2010
  { cat: 'joueur', words: ['Messi', 'Agüero', 'Tévez', 'Higuaín', 'Di María', 'Batistuta'] },
  // Attaquants argentins des années 2020
  { cat: 'joueur', words: ['Lautaro Martínez', 'Julián Álvarez', 'Dybala', 'Garnacho', 'Mastantuono'] },
  // Milieux argentins
  { cat: 'joueur', words: ['Mascherano', 'Riquelme', 'De Paul', 'Mac Allister', 'Banega'] },
  // Défenseurs argentins
  { cat: 'joueur', words: ['Zanetti', 'Cristian Romero', 'Ayala', 'Heinze', 'Lisandro Martínez'] },

  /* ------------------------------------------------------------------ */
  /* Portugal, Pays-Bas, Belgique, Croatie                                 */
  /* ------------------------------------------------------------------ */
  // Ailiers portugais
  { cat: 'joueur', words: ['Cristiano Ronaldo', 'Figo', 'Nani', 'Quaresma', 'Rafael Leão'] },
  // Milieux portugais
  { cat: 'joueur', words: ['Rui Costa', 'Deco', 'Bernardo Silva', 'Bruno Fernandes', 'Vitinha', 'João Neves'] },
  // Défenseurs portugais
  { cat: 'joueur', words: ['Pepe', 'Rúben Dias', 'Nuno Mendes', 'Cancelo', 'Fonte'] },
  // Attaquants néerlandais des années 1990–2000
  { cat: 'joueur', words: ['Van Basten', 'Bergkamp', 'Van Nistelrooy', 'Kluivert', 'Overmars'] },
  // Néerlandais des années 2010–2020
  { cat: 'joueur', words: ['Robben', 'Van Persie', 'Sneijder', 'Depay', 'Gakpo'] },
  // Défenseurs néerlandais
  { cat: 'joueur', words: ['Van Dijk', 'De Ligt', 'Stam', 'Dumfries', 'Aké'] },
  // Belges, la génération dorée en attaque
  { cat: 'joueur', words: ['Hazard', 'De Bruyne', 'Lukaku', 'Mertens', 'Carrasco', 'Doku'] },
  // Belges, la génération dorée en défense
  { cat: 'joueur', words: ['Kompany', 'Vertonghen', 'Alderweireld', 'Witsel', 'Fellaini'] },
  // Milieux croates
  { cat: 'joueur', words: ['Modrić', 'Rakitić', 'Kovačić', 'Brozović'] },
  // Attaquants croates
  { cat: 'joueur', words: ['Perišić', 'Mandžukić', 'Kramarić', 'Šuker', 'Rebić'] },

  /* ------------------------------------------------------------------ */
  /* Afrique, Asie, Amériques, Scandinavie, Est                            */
  /* ------------------------------------------------------------------ */
  // Attaquants africains des années 2000
  { cat: 'joueur', words: ['Drogba', "Eto'o", 'Adebayor', 'Kanouté', 'El Hadji Diouf'] },
  // Ailiers africains des années 2010–2020
  { cat: 'joueur', words: ['Salah', 'Mané', 'Mahrez', 'Aubameyang', 'Ziyech', 'Lookman'] },
  // Milieux africains
  { cat: 'joueur', words: ['Yaya Touré', 'Essien', 'Okocha', 'Partey', 'Amrabat', 'Onana'] },
  // Défenseurs africains
  { cat: 'joueur', words: ['Koulibaly', 'Hakimi', 'Kolo Touré', 'Aguerd', 'Mazraoui'] },
  // Gardiens africains
  { cat: 'joueur', words: ['Bounou', 'André Onana', 'Édouard Mendy', 'Kameni'] },
  // Maroc, demi-finaliste 2022
  { cat: 'joueur', words: ['Hakimi', 'Ziyech', 'Amrabat', 'En-Nesyri', 'Boufal', 'Aguerd'] },
  // Côte d'Ivoire des années 2000–2010
  { cat: 'joueur', words: ['Drogba', 'Yaya Touré', 'Kolo Touré', 'Kalou', 'Gervinho', 'Zokora'] },
  // Nigeria
  { cat: 'joueur', words: ['Okocha', 'Kanu', 'Mikel', 'Osimhen', 'Lookman', 'Iwobi'] },
  // Cameroun et Sénégal
  { cat: 'joueur', words: ["Eto'o", 'Anguissa', 'Aboubakar', 'Mané', 'Koulibaly', 'Ismaïla Sarr'] },
  // Asiatiques des années 2000–2010
  { cat: 'joueur', words: ['Son Heung-min', 'Park Ji-sung', 'Kagawa', 'Nakata'] },
  // Asiatiques des années 2020
  { cat: 'joueur', words: ['Mitoma', 'Kubo', 'Lee Kang-in', 'Minamino', 'Doan'] },
  // Uruguayens
  { cat: 'joueur', words: ['Suárez', 'Cavani', 'Forlán', 'Valverde', 'Darwin Núñez'] },
  // Colombiens
  { cat: 'joueur', words: ['Falcao', 'James Rodríguez', 'Cuadrado', 'Luis Díaz', 'Bacca'] },
  // Chiliens
  { cat: 'joueur', words: ['Alexis Sánchez', 'Vidal', 'Medel', 'Eduardo Vargas'] },
  // Nord-Américains
  { cat: 'joueur', words: ['Chicharito', 'Pulisic', 'Hirving Lozano', 'Santiago Giménez', 'McKennie', 'Timothy Weah'] },
  // Scandinaves stars
  { cat: 'joueur', words: ['Ibrahimović', 'Haaland', 'Ødegaard', 'Eriksen', 'Isak', 'Gyökeres'] },
  // Scandinaves, la suite
  { cat: 'joueur', words: ['Højlund', 'Kulusevski', 'Elanga', 'Larsson', 'Schmeichel'] },
  // Europe de l'Est, années 2000
  { cat: 'joueur', words: ['Shevchenko', 'Nedvěd', 'Hagi', 'Stoichkov', 'Rosický'] },
  // Europe de l'Est, années 2010–2020
  { cat: 'joueur', words: ['Lewandowski', 'Mudryk', 'Zinchenko', 'Szczęsny', 'Milik', 'Zieliński'] },
  // Balkans
  { cat: 'joueur', words: ['Džeko', 'Pjanić', 'Mitrović', 'Vlahović', 'Milinković-Savić', 'Tadić'] },
  // Turcs
  { cat: 'joueur', words: ['Çalhanoğlu', 'Arda Turan', 'Arda Güler', 'Kenan Yıldız', 'Hakan Şükür'] },

  /* ------------------------------------------------------------------ */
  /* Clubs anglais                                                        */
  /* ------------------------------------------------------------------ */
  // Man United de Ferguson, l'attaque
  { cat: 'joueur', words: ['Rooney', 'Cristiano Ronaldo', 'Giggs', 'Tévez', 'Van Nistelrooy', 'Solskjær'] },
  // Man United de Ferguson, le milieu et la défense
  { cat: 'joueur', words: ['Scholes', 'Roy Keane', 'Carrick', 'Ferdinand', 'Vidić', 'Evra'] },
  // Attaquants de Man United, années 2010–2020
  { cat: 'joueur', words: ['Rashford', 'Martial', 'Højlund', 'Garnacho', 'Sancho', 'Lukaku'] },
  // Milieux de Man United, années 2010–2020
  { cat: 'joueur', words: ['Pogba', 'Bruno Fernandes', 'Kobbie Mainoo', 'Casemiro', 'Fred', 'Mata'] },
  // Arsenal de Wenger, l'attaque des années 2000
  { cat: 'joueur', words: ['Henry', 'Bergkamp', 'Pirès', 'Ljungberg', 'Wiltord', 'Reyes'] },
  // Arsenal de Wenger, le milieu
  { cat: 'joueur', words: ['Vieira', 'Gilberto Silva', 'Fàbregas', 'Nasri', 'Wilshere', 'Cazorla'] },
  // Arsenal des années 2010
  { cat: 'joueur', words: ['Van Persie', 'Walcott', 'Özil', 'Alexis Sánchez', 'Giroud', 'Aubameyang'] },
  // Arsenal d'Arteta
  { cat: 'joueur', words: ['Saka', 'Ødegaard', 'Declan Rice', 'Saliba', 'Gabriel', 'Martinelli', 'Gyökeres'] },
  // Chelsea d'Abramovich, l'attaque
  { cat: 'joueur', words: ['Drogba', 'Lampard', 'Robben', 'Anelka', 'Malouda', 'Joe Cole'] },
  // Chelsea d'Abramovich, la défense et le milieu
  { cat: 'joueur', words: ['Terry', 'Essien', 'Ashley Cole', 'Makélélé', 'Ballack', 'Ivanović'] },
  // Chelsea des années 2010
  { cat: 'joueur', words: ['Hazard', 'Willian', 'Diego Costa', 'Kanté', 'Azpilicueta', 'Oscar'] },
  // Chelsea des années 2020
  { cat: 'joueur', words: ['Cole Palmer', 'Caicedo', 'Nicolas Jackson', 'Madueke', 'Reece James', 'Cucurella'] },
  // Liverpool des années 2000
  { cat: 'joueur', words: ['Gerrard', 'Fernando Torres', 'Carragher', 'Xabi Alonso', 'Mascherano', 'Kuyt'] },
  // Liverpool de Klopp, l'attaque
  { cat: 'joueur', words: ['Salah', 'Mané', 'Firmino', 'Luis Díaz', 'Diogo Jota', 'Darwin Núñez'] },
  // Liverpool de Klopp, la défense
  { cat: 'joueur', words: ['Van Dijk', 'Alexander-Arnold', 'Robertson', 'Matip', 'Konaté', 'Joe Gomez'] },
  // Liverpool de Klopp, le milieu
  { cat: 'joueur', words: ['Henderson', 'Fabinho', 'Wijnaldum', 'Milner', 'Mac Allister', 'Szoboszlai'] },
  // Man City de Guardiola, l'attaque
  { cat: 'joueur', words: ['Agüero', 'Sterling', 'Haaland', 'Foden', 'Mahrez', 'Grealish'] },
  // Man City de Guardiola, le milieu
  { cat: 'joueur', words: ['De Bruyne', 'David Silva', 'Bernardo Silva', 'Rodri', 'Gündoğan', 'Kovačić'] },
  // Man City de Guardiola, la défense
  { cat: 'joueur', words: ['Walker', 'Stones', 'Rúben Dias', 'Laporte', 'Cancelo', 'Gvardiol'] },
  // Man City des années 2010
  { cat: 'joueur', words: ['Agüero', 'Yaya Touré', 'Kompany', 'David Silva', 'Tévez', 'Balotelli', 'Zabaleta'] },
  // Tottenham, l'attaque
  { cat: 'joueur', words: ['Kane', 'Son Heung-min', 'Bale', 'Berbatov', 'Dele Alli', 'Lucas Moura'] },
  // Tottenham, le milieu
  { cat: 'joueur', words: ['Modrić', 'Eriksen', 'Sissoko', 'Bentancur', 'Maddison', 'Kulusevski'] },
  // Leicester champion 2016
  { cat: 'joueur', words: ['Vardy', 'Mahrez', 'Kanté', 'Drinkwater', 'Okazaki', 'Morgan'] },
  // Newcastle des années 2020
  { cat: 'joueur', words: ['Isak', 'Gordon', 'Bruno Guimarães', 'Tonali', 'Trippier', 'Botman'] },

  /* ------------------------------------------------------------------ */
  /* Clubs espagnols                                                      */
  /* ------------------------------------------------------------------ */
  // Real Madrid des Galactiques
  { cat: 'joueur', words: ['Zidane', 'Figo', 'Ronaldo (R9)', 'Beckham', 'Raúl', 'Roberto Carlos', 'Guti'] },
  // Real Madrid des années 2010, l'attaque
  { cat: 'joueur', words: ['Cristiano Ronaldo', 'Bale', 'Benzema', 'Higuaín', 'Di María', 'James Rodríguez'] },
  // Real Madrid des années 2010, le milieu et la défense
  { cat: 'joueur', words: ['Modrić', 'Kroos', 'Casemiro', 'Isco', 'Sergio Ramos', 'Pepe', 'Marcelo'] },
  // Real Madrid des années 2020, l'attaque
  { cat: 'joueur', words: ['Vinícius Jr', 'Rodrygo', 'Mbappé', 'Bellingham', 'Endrick', 'Arda Güler'] },
  // Real Madrid des années 2020, le milieu et la défense
  { cat: 'joueur', words: ['Valverde', 'Camavinga', 'Tchouaméni', 'Rüdiger', 'Militão', 'Alaba'] },
  // Barça de Rijkaard
  { cat: 'joueur', words: ['Ronaldinho', "Eto'o", 'Deco', 'Giuly', 'Larsson', 'Rafael Márquez'] },
  // Barça de Guardiola, l'attaque et le milieu
  { cat: 'joueur', words: ['Messi', 'Xavi', 'Iniesta', 'Busquets', 'David Villa', 'Pedro'] },
  // Barça de Guardiola, la défense
  { cat: 'joueur', words: ['Puyol', 'Piqué', 'Dani Alves', 'Abidal', 'Jordi Alba'] },
  // Barça de la MSN
  { cat: 'joueur', words: ['Messi', 'Suárez', 'Neymar', 'Rakitić', 'Jordi Alba', 'Umtiti'] },
  // Barça de Flick
  { cat: 'joueur', words: ['Lamine Yamal', 'Raphinha', 'Lewandowski', 'Pedri', 'Gavi', 'Cubarsí', 'Koundé'] },
  // Atlético de Simeone, l'attaque
  { cat: 'joueur', words: ['Griezmann', 'Diego Costa', 'Falcao', 'Fernando Torres', 'Julián Álvarez', 'Correa'] },
  // Atlético de Simeone, le milieu et la défense
  { cat: 'joueur', words: ['Koke', 'Gabi', 'Saúl', 'Godín', 'Giménez', 'Marcos Llorente'] },
  // Séville et Valence
  { cat: 'joueur', words: ['Kanouté', 'Jesús Navas', 'Banega', 'David Villa', 'David Silva', 'Mata'] },

  /* ------------------------------------------------------------------ */
  /* Clubs italiens                                                       */
  /* ------------------------------------------------------------------ */
  // Juventus des années 2010, l'attaque
  { cat: 'joueur', words: ['Tévez', 'Dybala', 'Higuaín', 'Cristiano Ronaldo', 'Mandžukić', 'Morata'] },
  // Juventus des années 2010, le milieu et la défense
  { cat: 'joueur', words: ['Pirlo', 'Pogba', 'Vidal', 'Marchisio', 'Chiellini', 'Bonucci'] },
  // Juventus des années 2000
  { cat: 'joueur', words: ['Del Piero', 'Trezeguet', 'Nedvěd', 'Zidane', 'Buffon', 'Camoranesi'] },
  // Milan des années 2000
  { cat: 'joueur', words: ['Kaká', 'Shevchenko', 'Pirlo', 'Gattuso', 'Seedorf', 'Ambrosini'] },
  // Milan des années 2020
  { cat: 'joueur', words: ['Rafael Leão', 'Theo Hernández', 'Tonali', 'Giroud', 'Pulisic', 'Reijnders'] },
  // Inter du triplé 2010
  { cat: 'joueur', words: ['Sneijder', "Eto'o", 'Milito', 'Zanetti', 'Cambiasso', 'Maicon'] },
  // Inter des années 2020
  { cat: 'joueur', words: ['Lautaro Martínez', 'Barella', 'Bastoni', 'Dimarco', 'Çalhanoğlu', 'Marcus Thuram', 'Dumfries'] },
  // Naples des années 2010
  { cat: 'joueur', words: ['Cavani', 'Higuaín', 'Hamšík', 'Insigne', 'Mertens', 'Koulibaly'] },
  // Naples des années 2020
  { cat: 'joueur', words: ['Osimhen', 'Kvaratskhelia', 'Anguissa', 'Di Lorenzo', 'McTominay', 'Lukaku'] },
  // Roma
  { cat: 'joueur', words: ['Totti', 'Dybala', 'Pellegrini', 'Džeko', 'Nainggolan', 'Salah'] },

  /* ------------------------------------------------------------------ */
  /* Clubs allemands                                                      */
  /* ------------------------------------------------------------------ */
  // Bayern des années 2010, l'attaque
  { cat: 'joueur', words: ['Robben', 'Ribéry', 'Lewandowski', 'Thomas Müller', 'Coman', 'Sané'] },
  // Bayern des années 2010, le milieu et la défense
  { cat: 'joueur', words: ['Lahm', 'Schweinsteiger', 'Kimmich', 'Alaba', 'Boateng', 'Hummels'] },
  // Bayern des années 2020
  { cat: 'joueur', words: ['Kane', 'Musiala', 'Olise', 'Kimmich', 'Davies', 'Upamecano', 'Goretzka'] },
  // Attaque de Dortmund, années 2010
  { cat: 'joueur', words: ['Lewandowski', 'Reus', 'Götze', 'Aubameyang', 'Dembélé', 'Sancho'] },
  // Dortmund des années 2020
  { cat: 'joueur', words: ['Haaland', 'Bellingham', 'Adeyemi', 'Brandt', 'Guirassy', 'Schlotterbeck'] },
  // Leverkusen de Xabi Alonso
  { cat: 'joueur', words: ['Wirtz', 'Grimaldo', 'Frimpong', 'Xhaka', 'Boniface', 'Schick', 'Tah'] },

  /* ------------------------------------------------------------------ */
  /* Clubs français                                                       */
  /* ------------------------------------------------------------------ */
  // PSG des années 90 et 2000
  { cat: 'joueur', words: ['Weah', 'Ginola', 'Pauleta', 'Ronaldinho', 'Okocha', 'Anelka', 'Rothen'] },
  // PSG des années 2010, l'attaque
  { cat: 'joueur', words: ['Ibrahimović', 'Cavani', 'Di María', 'Lavezzi', 'Lucas Moura', 'Pastore'] },
  // PSG des années 2010, le milieu et la défense
  { cat: 'joueur', words: ['Verratti', 'Thiago Motta', 'Thiago Silva', 'Marquinhos', 'Maxwell', 'Matuidi'] },
  // PSG de Neymar, Mbappé et Messi
  { cat: 'joueur', words: ['Neymar', 'Mbappé', 'Messi', 'Di María', 'Icardi', 'Hakimi'] },
  // PSG champion d'Europe 2025, l'attaque
  { cat: 'joueur', words: ['Dembélé', 'Désiré Doué', 'Kvaratskhelia', 'Barcola', 'Gonçalo Ramos', 'Kolo Muani'] },
  // PSG champion d'Europe 2025, le milieu et la défense
  { cat: 'joueur', words: ['Vitinha', 'João Neves', 'Zaïre-Emery', 'Hakimi', 'Nuno Mendes', 'Marquinhos', 'Pacho'] },
  // OM champion d'Europe 1993
  { cat: 'joueur', words: ['Papin', 'Deschamps', 'Desailly', 'Barthez', 'Völler'] },
  // OM des années 2000
  { cat: 'joueur', words: ['Drogba', 'Ribéry', 'Nasri', 'Niang', 'Djibril Cissé', 'Ben Arfa'] },
  // OM des années 2010–2020
  { cat: 'joueur', words: ['Payet', 'Thauvin', 'Gignac', 'Valbuena', 'Benedetto', 'Alexis Sánchez', 'Aubameyang', 'Greenwood'] },
  // OL septuple champion
  { cat: 'joueur', words: ['Juninho', 'Govou', 'Malouda', 'Essien', 'Benzema', 'Wiltord'] },
  // OL des années 2010–2020
  { cat: 'joueur', words: ['Lacazette', 'Fekir', 'Gourcuff', 'Ben Arfa', 'Depay', 'Aouar', 'Rayan Cherki', 'Mikautadze'] },
  // Monaco 2017
  { cat: 'joueur', words: ['Mbappé', 'Falcao', 'Bernardo Silva', 'Fabinho', 'Lemar', 'Bakayoko'] },
  // Lille
  { cat: 'joueur', words: ['Hazard', 'Nicolas Pépé', 'Osimhen', 'Jonathan David', 'Ikoné', 'Bamba'] },
  // Autres clubs de Ligue 1
  { cat: 'joueur', words: ['Golovin', 'Ben Yedder', 'Seko Fofana', 'Openda', 'Wahi', 'Bourigeaud'] },

  /* ------------------------------------------------------------------ */
  /* Par profil, toutes nationalités                                      */
  /* ------------------------------------------------------------------ */
  // Grands numéros 9 des années 2020
  { cat: 'joueur', words: ['Haaland', 'Kane', 'Lewandowski', 'Osimhen', 'Vlahović'] },
  // Grands numéros 9 des années 2020, la suite
  { cat: 'joueur', words: ['Isak', 'Gyökeres', 'Šeško', 'Darwin Núñez', 'Kolo Muani', 'Openda'] },
  // Grands numéros 9 des années 2010
  { cat: 'joueur', words: ['Ibrahimović', 'Lukaku', 'Giroud', 'Džeko', 'Diego Costa', 'Benteke'] },
  // Grands numéros 9 des années 2000
  { cat: 'joueur', words: ['Van Nistelrooy', 'Drogba', 'Luca Toni', 'Trezeguet', 'Adebayor'] },
  // Renards des surfaces
  { cat: 'joueur', words: ['Raúl', 'Solskjær', 'Chicharito', 'Thomas Müller', 'Vardy', 'Defoe'] },
  // Ailiers de vitesse des années 2010
  { cat: 'joueur', words: ['Bale', 'Walcott', 'Aubameyang', 'Sané', 'Sterling', 'Adama Traoré'] },
  // Dribbleurs des années 2010
  { cat: 'joueur', words: ['Neymar', 'Hazard', 'Robben', 'Ribéry', 'Douglas Costa', 'Coutinho'] },
  // Dribbleurs des années 2020
  { cat: 'joueur', words: ['Vinícius Jr', 'Kvaratskhelia', 'Désiré Doué', 'Lamine Yamal', 'Rafael Leão', 'Doku'] },
  // Meneurs des années 2000
  { cat: 'joueur', words: ['Zidane', 'Kaká', 'Riquelme', 'Rui Costa', 'Deco', 'Totti'] },
  // Meneurs des années 2010
  { cat: 'joueur', words: ['Özil', 'David Silva', 'Sneijder', 'Isco', 'James Rodríguez', 'Payet'] },
  // Créateurs des années 2020
  { cat: 'joueur', words: ['De Bruyne', 'Ødegaard', 'Bruno Fernandes', 'Cole Palmer', 'Dani Olmo'] },
  // Milieux offensifs des années 2020
  { cat: 'joueur', words: ['Bellingham', 'Wirtz', 'Musiala', 'Pedri', 'Xavi Simons'] },
  // Sentinelles des années 2000
  { cat: 'joueur', words: ['Makélélé', 'Gattuso', 'Mascherano', 'Essien', 'Gilberto Silva', 'Cambiasso'] },
  // Sentinelles des années 2010
  { cat: 'joueur', words: ['Busquets', 'Kanté', 'Casemiro', 'Fernandinho', 'Fabinho', 'Matić'] },
  // Sentinelles des années 2020
  { cat: 'joueur', words: ['Rodri', 'Declan Rice', 'Tchouaméni', 'Zubimendi', 'Caicedo', 'Kimmich'] },
  // Box-to-box des années 2000
  { cat: 'joueur', words: ['Gerrard', 'Lampard', 'Vieira', 'Roy Keane', 'Ballack', 'Yaya Touré'] },
  // Box-to-box des années 2010
  { cat: 'joueur', words: ['Pogba', 'Vidal', 'Matuidi', 'Wijnaldum', 'Fellaini', 'Nainggolan'] },
  // Défenseurs centraux des années 2000
  { cat: 'joueur', words: ['Cannavaro', 'Puyol', 'Terry', 'Ferdinand', 'Vidić', 'Lúcio'] },
  // Défenseurs centraux des années 2010
  { cat: 'joueur', words: ['Sergio Ramos', 'Piqué', 'Chiellini', 'Bonucci', 'Kompany', 'Thiago Silva'] },
  // Défenseurs centraux des années 2010, la suite
  { cat: 'joueur', words: ['Hummels', 'Boateng', 'Godín', 'Varane', 'Koscielny', 'Umtiti'] },
  // Défenseurs centraux des années 2020
  { cat: 'joueur', words: ['Van Dijk', 'Rüdiger', 'Saliba', 'Rúben Dias', 'Bastoni', 'Gvardiol'] },
  // Défenseurs centraux des années 2020, la suite
  { cat: 'joueur', words: ['Koundé', 'Upamecano', 'Marquinhos', 'Cubarsí', 'Konaté', 'Cristian Romero'] },
  // Latéraux des années 2000
  { cat: 'joueur', words: ['Cafu', 'Roberto Carlos', 'Zambrotta', 'Lahm', 'Zanetti', 'Maicon'] },
  // Latéraux des années 2010
  { cat: 'joueur', words: ['Dani Alves', 'Marcelo', 'Alaba', 'Jordi Alba', 'Walker', 'Azpilicueta'] },
  // Latéraux des années 2020
  { cat: 'joueur', words: ['Alexander-Arnold', 'Robertson', 'Hakimi', 'Theo Hernández', 'Nuno Mendes', 'Cancelo'] },
  // Latéraux des années 2020, la suite
  { cat: 'joueur', words: ['Dimarco', 'Frimpong', 'Grimaldo', 'Dumfries', 'Davies', 'Reece James'] },
  // Gardiens des années 2000
  { cat: 'joueur', words: ['Čech', 'Van der Sar', 'Julio César', 'Dida', 'Lehmann', 'Reina'] },
  // Gardiens des années 2010
  { cat: 'joueur', words: ['Neuer', 'De Gea', 'Courtois', 'Oblak', 'Ter Stegen', 'Lloris'] },
  // Gardiens des années 2010, la suite
  { cat: 'joueur', words: ['Alisson', 'Ederson', 'Handanović', 'Szczęsny', 'Navas', 'Mandanda'] },
  // Gardiens des années 2020
  { cat: 'joueur', words: ['Donnarumma', 'Maignan', 'Sommer', 'Diogo Costa', 'Raya', 'Emiliano Martínez'] },
  // Gardiens des années 2020, la suite
  { cat: 'joueur', words: ['Chevalier', 'Kobel', 'Vicario', 'Trubin', 'Lunin'] },
  // Jeunes cracks 2025, l'attaque
  { cat: 'joueur', words: ['Lamine Yamal', 'Estêvão', 'Endrick', 'Désiré Doué', 'Kenan Yıldız', 'Rayan Cherki'] },
  // Jeunes cracks 2025, le milieu
  { cat: 'joueur', words: ['Zaïre-Emery', 'Kobbie Mainoo', 'Arda Güler', 'Xavi Simons', 'Nico Paz', 'Mastantuono'] },
  // Jeunes cracks 2025, la défense
  { cat: 'joueur', words: ['Cubarsí', 'Lewis-Skelly', 'Pacho', 'Huijsen', 'Bastoni'] },
  // Ballons d'Or des années 2000
  { cat: 'joueur', words: ['Ronaldinho', 'Kaká', 'Cannavaro', 'Shevchenko', 'Nedvěd', 'Owen'] },
  // Ballons d'Or des années 1990–2000
  { cat: 'joueur', words: ['Zidane', 'Figo', 'Rivaldo', 'Ronaldo (R9)', 'Weah', 'Van Basten'] },
  // Ballons d'Or des années 2010–2020
  { cat: 'joueur', words: ['Messi', 'Cristiano Ronaldo', 'Modrić', 'Benzema', 'Rodri', 'Dembélé'] },
  // Fortes têtes
  { cat: 'joueur', words: ['Cantona', 'Ibrahimović', 'Suárez', 'Diego Costa', 'Pepe'] },
  // Fortes têtes, la suite
  { cat: 'joueur', words: ['Balotelli', 'Cassano', 'Ben Arfa', 'Nasri', 'Adebayor'] },
  // Promesses non tenues
  { cat: 'joueur', words: ['Ben Arfa', 'Bojan', 'Pato', 'Robinho', 'Gourcuff', 'Freddy Adu'] },
  // Promesses non tenues, la suite
  { cat: 'joueur', words: ['Renato Sanches', 'Martial', 'Coutinho', 'Dele Alli', 'Götze', 'Sancho'] },
  // Joueurs devenus entraîneurs, les Français
  { cat: 'joueur', words: ['Zidane', 'Deschamps', 'Henry', 'Vieira', 'Laurent Blanc', 'Thiago Motta'] },
  // Joueurs devenus entraîneurs, les Espagnols et Italiens
  { cat: 'joueur', words: ['Guardiola', 'Xabi Alonso', 'Xavi', 'Arteta', 'Pirlo', 'Gattuso'] },
  // Joueurs devenus entraîneurs, les Anglais
  { cat: 'joueur', words: ['Lampard', 'Gerrard', 'Rooney', 'Solskjær', 'Carrick'] },
  // Gauchers célèbres
  { cat: 'joueur', words: ['Messi', 'Maradona', 'Di María', 'Robben', 'Salah', 'Griezmann'] },
  // Gauchers célèbres, la suite
  { cat: 'joueur', words: ['Roberto Carlos', 'Marcelo', 'Ødegaard', 'Foden', 'Mahrez', 'Bale'] },
  // Spécialistes du coup franc des années 2000
  { cat: 'joueur', words: ['Beckham', 'Roberto Carlos', 'Juninho', 'Ronaldinho', 'Pirlo'] },
  // Spécialistes du coup franc des années 2010–2020
  { cat: 'joueur', words: ['Messi', 'Cristiano Ronaldo', 'Payet', 'Çalhanoğlu', 'Eriksen'] },
  // Capitaines emblématiques
  { cat: 'joueur', words: ['Zanetti', 'Gerrard', 'Terry', 'Puyol', 'Maldini', 'Kompany'] },
  // Capitaines emblématiques, la suite
  { cat: 'joueur', words: ['Lahm', 'Sergio Ramos', 'Lloris', 'Thiago Silva', 'Casillas', 'Buffon'] },
  // Partis en Arabie saoudite
  { cat: 'joueur', words: ['Cristiano Ronaldo', 'Benzema', 'Neymar', 'Mané', 'Kanté', 'Mahrez'] },
  // Partis en Arabie saoudite, la suite
  { cat: 'joueur', words: ['Koulibaly', 'Firmino', 'Mitrović', 'Milinković-Savić', 'Rúben Neves', 'João Félix'] },
  // Partis en MLS
  { cat: 'joueur', words: ['Messi', 'Busquets', 'Jordi Alba', 'Suárez', 'Beckham', 'Ibrahimović'] },
  // Buteurs de Ligue 1 des années 2000
  { cat: 'joueur', words: ['Pauleta', 'Djibril Cissé', 'Niang', 'Benzema', 'Drogba', 'Saha'] },
  // Buteurs de Ligue 1 des années 2010
  { cat: 'joueur', words: ['Ibrahimović', 'Cavani', 'Lacazette', 'Gignac', 'Falcao', 'Ben Yedder'] },
  // Buteurs de Ligue 1 des années 2020
  { cat: 'joueur', words: ['Mbappé', 'Dembélé', 'Jonathan David', 'Lacazette', 'Mikautadze', 'Openda'] },
  // Buteurs de Premier League des années 2000
  { cat: 'joueur', words: ['Henry', 'Van Nistelrooy', 'Owen', 'Rooney', 'Drogba', 'Fernando Torres'] },
  // Buteurs de Premier League des années 2010
  { cat: 'joueur', words: ['Agüero', 'Kane', 'Vardy', 'Suárez', 'Van Persie', 'Lukaku'] },
  // Buteurs de Premier League des années 2020
  { cat: 'joueur', words: ['Haaland', 'Salah', 'Isak', 'Watkins', 'Cole Palmer', 'Son Heung-min'] },
  // Buteurs de Liga des années 2000
  { cat: 'joueur', words: ['Raúl', "Eto'o", 'Ronaldo (R9)', 'David Villa', 'Forlán', 'Fernando Torres'] },
  // Buteurs de Liga des années 2010
  { cat: 'joueur', words: ['Messi', 'Cristiano Ronaldo', 'Suárez', 'Benzema', 'Griezmann', 'Neymar'] },
  // Buteurs de Serie A des années 2010
  { cat: 'joueur', words: ['Higuaín', 'Icardi', 'Immobile', 'Dybala', 'Cristiano Ronaldo', 'Džeko'] },
  // Attaquants de Serie A des années 2020
  { cat: 'joueur', words: ['Lautaro Martínez', 'Osimhen', 'Vlahović', 'Rafael Leão', 'Kvaratskhelia', 'Marcus Thuram'] },
  // Buteurs de Bundesliga
  { cat: 'joueur', words: ['Lewandowski', 'Aubameyang', 'Haaland', 'Thomas Müller', 'Kane', 'Reus'] },
  // Icônes du football
  { cat: 'joueur', words: ['Pelé', 'Maradona', 'Cruyff', 'Beckenbauer', 'Platini', 'Eusébio'] },
];
