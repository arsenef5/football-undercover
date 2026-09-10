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
  // Milieux anglais des années 2000
  { cat: 'joueur', words: ['Gerrard', 'Lampard', 'Scholes', 'Beckham'] },

  /* ------------------------------------------------------------------ */
  /* France                                                               */
  /* ------------------------------------------------------------------ */
  // Bleus 98, l'attaque et le milieu
  { cat: 'joueur', words: ['Zidane', 'Henry', 'Trezeguet'] },
  // Attaquants français des années 2000
  { cat: 'joueur', words: ['Anelka', 'Djibril Cissé', 'Saha', 'Govou'] },
  // Attaquants français des années 2010
  { cat: 'joueur', words: ['Gignac', 'Lacazette', 'Ben Yedder', 'Griezmann', 'Hoarau'] },
  // Ailiers français des années 2020
  { cat: 'joueur', words: ['Dembélé', 'Coman', 'Barcola', 'Désiré Doué', 'Olise', 'Nkunku', 'Mbappé'] },
  // Milieux français des années 2010
  { cat: 'joueur', words: ['Pogba', 'Kanté', 'Matuidi', 'Rabiot'] },
  // Milieux français des années 2020
  { cat: 'joueur', words: ['Tchouaméni', 'Camavinga', 'Zaïre-Emery', 'Rabiot', 'Koné', 'Fofana'] },
  // Défenseurs français des années 2010
  { cat: 'joueur', words: ['Varane', 'Koscielny', 'Umtiti', 'Sakho', 'Laporte', 'Kimpembe'] },
  // Défenseurs français des années 2020
  { cat: 'joueur', words: ['Saliba', 'Koundé', 'Upamecano', 'Konaté'] },
  // Latéraux français
  { cat: 'joueur', words: ['Evra', 'Sagna', 'Abidal', 'Theo Hernández', 'Clauss', 'Digne'] },
  // Gardiens français
  { cat: 'joueur', words: ['Barthez', 'Coupet', 'Lloris', 'Mandanda', 'Maignan', 'Areola'] },

  /* ------------------------------------------------------------------ */
  /* Espagne                                                              */
  /* ------------------------------------------------------------------ */
  // Milieux espagnols de 2010
  { cat: 'joueur', words: ['Xavi', 'Iniesta', 'Busquets', 'Xabi Alonso', 'Fàbregas'] },
  // Défenseurs espagnols
  { cat: 'joueur', words: ['Sergio Ramos', 'Piqué', 'Puyol', 'Jordi Alba', 'Dani Alves'] },
  // Espagnols confirmés des années 2020
  { cat: 'joueur', words: ['Rodri', 'Dani Olmo', 'Oyarzabal', 'Fabián Ruiz', 'Mikel Merino'] },
  // Gardiens espagnols
  { cat: 'joueur', words: ['Casillas', 'De Gea', 'Raya', 'Unai Simón', 'Kepa'] },

  /* ------------------------------------------------------------------ */
  /* Allemagne                                                            */
  /* ------------------------------------------------------------------ */
  // Milieux allemands des années 2010
  { cat: 'joueur', words: ['Schweinsteiger', 'Kroos', 'Özil', 'Khedira', 'Gündoğan'] },
  // Attaquants allemands des années 2010
  { cat: 'joueur', words: ['Thomas Müller', 'Reus', 'Götze', 'Sané'] },
  // Jeunes Allemands des années 2020
  { cat: 'joueur', words: ['Musiala', 'Wirtz', 'Havertz'] },
  // Icônes allemandes
  { cat: 'joueur', words: ['Beckenbauer', 'Gerd Müller', 'Ballack', 'Kahn', 'Neuer'] },

  /* ------------------------------------------------------------------ */
  /* Italie                                                               */
  /* ------------------------------------------------------------------ */
  // Défenseurs italiens des années 2000
  { cat: 'joueur', words: ['Maldini', 'Cannavaro', 'Materazzi', 'Zambrotta', 'Bonucci', 'Chiellini'] },
  // Gardiens italiens
  { cat: 'joueur', words: ['Buffon', 'Donnarumma', 'Sirigu', 'Navas', 'Maignan'] },

  /* ------------------------------------------------------------------ */
  /* Brésil et Argentine                                                  */
  /* ------------------------------------------------------------------ */
  // Brésiliens des années 2010
  { cat: 'joueur', words: ['Neymar', 'Coutinho', 'Robinho', 'Raphinha'] },
  // Latéraux brésiliens
  { cat: 'joueur', words: ['Cafu', 'Roberto Carlos', 'Dani Alves', 'Marcelo', 'Maicon'] },
  // Attaquants argentins des années 2000–2010
  { cat: 'joueur', words: ['Agüero', 'Tévez', 'Higuaín', 'Di María'] },

  /* ------------------------------------------------------------------ */
  /* Portugal, Pays-Bas, Belgique, Croatie                                 */
  /* ------------------------------------------------------------------ */
  // Ailiers portugais
  { cat: 'joueur', words: ['Figo', 'Nani', 'Quaresma', 'Rafael Leão'] },
  // Milieux portugais
  { cat: 'joueur', words: ['Deco', 'Bernardo Silva', 'Bruno Fernandes', 'Vitinha', 'João Neves'] },
  // Attaquants néerlandais des années 1990–2000
  { cat: 'joueur', words: ['Van Basten', 'Bergkamp', 'Van Nistelrooy', 'Kluivert'] },
  // Néerlandais des années 2010–2020
  { cat: 'joueur', words: ['Robben', 'Van Persie', 'Sneijder'] },

  /* ------------------------------------------------------------------ */
  /* Afrique, Asie, Amériques, Scandinavie, Est                            */
  /* ------------------------------------------------------------------ */
  // Ailiers africains des années 2010–2020
  { cat: 'joueur', words: ['Salah', 'Mané', 'Mahrez', 'Aubameyang', 'Drogba', "Eto'o"] },
  // Scandinaves stars
  { cat: 'joueur', words: ['Ibrahimović', 'Haaland', 'Gyökeres', 'Lewandowski'] },

  /* ------------------------------------------------------------------ */
  /* Clubs anglais                                                        */
  /* ------------------------------------------------------------------ */
  // Man United de Ferguson, l'attaque
  { cat: 'joueur', words: ['Rooney', 'Cristiano Ronaldo', 'Giggs', 'Tévez', 'Van Nistelrooy'] },
  // Arsenal de Wenger, l'attaque des années 2000
  { cat: 'joueur', words: ['Henry', 'Bergkamp', 'Pirès', 'Wiltord'] },
  // Arsenal de Wenger, le milieu
  { cat: 'joueur', words: ['Fàbregas', 'Nasri', 'Wilshere', 'Cazorla'] },
  // Chelsea des années 2010
  { cat: 'joueur', words: ['Hazard', 'Willian', 'Cole Palmer'] },

  /* ------------------------------------------------------------------ */
  /* Clubs espagnols                                                      */
  /* ------------------------------------------------------------------ */
  // Real Madrid des années 2010, l'attaque
  { cat: 'joueur', words: ['Bale', 'Benzema', 'Higuaín', 'Di María', 'James Rodríguez'] },
  // Real Madrid des années 2010, le milieu et la défense
  { cat: 'joueur', words: ['Modrić', 'Kroos', 'Casemiro', 'Isco'] },
  // Real Madrid des années 2020, l'attaque
  { cat: 'joueur', words: ['Vinícius Jr', 'Rodrygo', 'Endrick'] },
  // Barça de Rijkaard
  { cat: 'joueur', words: ['Ronaldinho', "Eto'o", 'Deco', 'Giuly'] },
  // Barça de Guardiola, la défense
  { cat: 'joueur', words: ['Puyol', 'Piqué', 'Dani Alves', 'Abidal', 'Jordi Alba'] },

  /* ------------------------------------------------------------------ */
  /* Clubs italiens                                                       */
  /* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */
  /* Clubs allemands                                                      */
  /* ------------------------------------------------------------------ */
  // Bayern des années 2010, l'attaque
  { cat: 'joueur', words: ['Robben', 'Ribéry', 'Lewandowski', 'Thomas Müller', 'Coman', 'Sané'] },
  // Bayern des années 2010, le milieu et la défense
  { cat: 'joueur', words: ['Lahm', 'Schweinsteiger', 'Kimmich', 'Goretzka'] },

  /* ------------------------------------------------------------------ */
  /* Clubs français                                                       */
  /* ------------------------------------------------------------------ */
  // PSG des années 2010, l'attaque
  { cat: 'joueur', words: ['Di María', 'Lavezzi', 'Lucas Moura', 'Pastore', 'Doué'] },
  // OM des années 2010–2020
  { cat: 'joueur', words: ['Payet', 'Thauvin', 'Valbuena', 'Greenwood', 'Gignac'] },

  /* ------------------------------------------------------------------ */
  /* Par profil, toutes nationalités                                      */
  /* ------------------------------------------------------------------ */
  // Défenseurs centraux des années 2010
  { cat: 'joueur', words: ['Sergio Ramos', 'Piqué', 'Chiellini', 'Bonucci', 'Kompany', 'Thiago Silva'] },
  // Défenseurs centraux des années 2020
  { cat: 'joueur', words: ['Van Dijk', 'Rüdiger', 'Saliba', 'Rúben Dias'] },
  // Latéraux des années 2010
  { cat: 'joueur', words: ['Dani Alves', 'Marcelo', 'Alaba', 'Jordi Alba', 'Walker'] },
  // Gardiens des années 2010
  { cat: 'joueur', words: ['De Gea', 'Oblak', 'Ter Stegen', 'Lloris', 'Alisson', 'Navas'] },
  // Joueurs devenus entraîneurs, les Espagnols et Italiens
  { cat: 'joueur', words: ['Guardiola', 'Xabi Alonso', 'Xavi', 'Arteta', 'Pirlo'] },
  // Buteurs de Liga des années 2010
  { cat: 'joueur', words: ['Suárez', 'Benzema', 'Griezmann', 'Higuaín'] },
  // Buteurs de Bundesliga
  { cat: 'joueur', words: ['Lewandowski', 'Aubameyang', 'Haaland', 'Thomas Müller', 'Kane'] },

  /* ------------------------------------------------------------------ */
  /* Groupes d'Arsène (10/09/2026), suite                                */
  /* ------------------------------------------------------------------ */
  // Latéraux de légende
  { cat: 'joueur', words: ['Dani Alves', 'Carvajal', 'Marcelo', 'Roberto Carlos', 'Abidal'] },
  // Ailiers qui repiquent dans l'axe
  { cat: 'joueur', words: ['Ribéry', 'Robben', 'Coutinho', 'Luis Díaz', 'Olise'] },
  // Défenseurs centraux français
  { cat: 'joueur', words: ['Varane', 'Saliba', 'Konaté', 'Zouma'] },
  // Milieux français des années 2010
  { cat: 'joueur', words: ['Kanté', 'Matuidi', 'Rabiot', 'Pogba'] },
  // Attaquants français de la nouvelle vague
  { cat: 'joueur', words: ['Ekitiké', 'Barcola', 'Désiré Doué', 'Coman', 'Rayan Cherki', 'Mbappé'] },
  // Milieux français passés par Monaco
  { cat: 'joueur', words: ['Camavinga', 'Lemar', 'Kondogbia', 'Tchouaméni', 'Rabiot'] },

  /* Anciens groupes gratuits (passés en Pro le 11/09/2026) */
  // Petits milieux techniques des années 2010
  { cat: 'joueur', words: ['Iniesta', 'Xavi', 'Verratti', 'Thiago Alcântara', 'David Silva', 'Modrić'] },
  // Milieux techniques des années 2020
  { cat: 'joueur', words: ['Pedri', 'Gavi', 'Bernardo Silva', 'Vitinha', 'João Neves'] },
  // Ailiers rapides de Premier League, années 2010
  { cat: 'joueur', words: ['Henry', 'Walcott', 'Aubameyang', 'Sterling', 'Sané'] },
  // Ailiers de Premier League, années 2020
  { cat: 'joueur', words: ['Salah', 'Saka', 'Son Heung-min', 'Rashford', 'Mané', 'Hazard'] },
  // Dribbleurs des années 2010
  { cat: 'joueur', words: ['Neymar', 'Hazard', 'Robben', 'Ribéry', 'Dembélé', 'Mbappé'] },
  // Dribbleurs des années 2020
  { cat: 'joueur', words: ['Vinícius Jr', 'Kvaratskhelia', 'Lamine Yamal', 'Désiré Doué', 'Rafael Leão', 'Mbappé'] },
  // Dribbleurs de légende
  { cat: 'joueur', words: ['Ronaldinho', 'Okocha', 'Robinho', 'Quaresma', 'Nani', 'Cristiano Ronaldo'] },
  // Créateurs des années 2010–2020
  { cat: 'joueur', words: ['De Bruyne', 'Özil', 'Griezmann', 'Ødegaard', 'Bruno Fernandes'] },
  // Récupérateurs des années 2000
  { cat: 'joueur', words: ['Makélélé', 'Vieira', 'Gattuso', 'Essien'] },
  // Sentinelles des années 2010–2020
  { cat: 'joueur', words: ['Kanté', 'Rodri', 'Casemiro', 'Busquets', 'Tchouaméni'] },
  // Box-to-box
  { cat: 'joueur', words: ['Gerrard', 'Lampard', 'Yaya Touré', 'Pogba', 'Rodri'] },
  // Défenseurs centraux des années 2000
  { cat: 'joueur', words: ['Maldini', 'Cannavaro', 'Puyol', 'Desailly', 'Terry', 'Piqué'] },
  // Défenseurs centraux des années 2010–2020
  { cat: 'joueur', words: ['Sergio Ramos', 'Piqué', 'Van Dijk', 'Varane', 'Chiellini'] },
  // Latéraux des années 2000
  { cat: 'joueur', words: ['Roberto Carlos', 'Cafu', 'Lahm', 'Ashley Cole', 'Evra'] },
  // Latéraux des années 2010–2020
  { cat: 'joueur', words: ['Dani Alves', 'Marcelo', 'Hakimi', 'Nuno Mendes'] },
  // Gardiens de légende
  { cat: 'joueur', words: ['Buffon', 'Casillas', 'Kahn', 'Barthez', 'Čech'] },
  // Gardiens d'aujourd'hui
  { cat: 'joueur', words: ['Neuer', 'Courtois', 'Oblak', 'Ter Stegen', 'Donnarumma'] },
  // Ballons d'Or des années 2000
  { cat: 'joueur', words: ['Ronaldo (R9)', 'Rivaldo', 'Figo', 'Shevchenko', 'Nedvěd', 'Owen'] },
  // Attaquants vifs des années 2010
  { cat: 'joueur', words: ['Agüero', 'Tévez', 'Suárez', 'Dybala'] },
  // Icônes absolues
  { cat: 'joueur', words: ['Pelé', 'Maradona', 'Cruyff', 'Platini'] },
  // Les magiciens
  { cat: 'joueur', words: ['Ronaldinho', 'Neymar', 'Lamine Yamal', 'Messi'] },
  // Jeunes stars techniques
  { cat: 'joueur', words: ['Pedri', 'Vitinha', 'Lamine Yamal', 'Désiré Doué'] },
  // Le trio du Barça
  { cat: 'joueur', words: ['Iniesta', 'Xavi', 'Busquets'] },
  // Les deux Argentins
  { cat: 'joueur', words: ['Messi', 'Maradona'] },
];
