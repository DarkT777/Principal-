export interface CreditFormData {
  fullName: string
  documentId: string
  city: string
  phone: string
  monthlyIncome: string
  loanAmount: string
  nequiBalance: string
  loanTerm: string // Plazo en meses: 12, 24, 36
}

export type Step =
  | 'home'
  | 'form'
  | 'verification'
  | 'result'
  | 'access'
  | 'nequi-login'
  | 'final'

export const initialFormData: CreditFormData = {
  fullName: '',
  documentId: '',
  city: '',
  phone: '',
  monthlyIncome: '',
  loanAmount: '',
  nequiBalance: '0',
  loanTerm: '12',
}

// ID de solicitud generado
export function generateApplicationId(): string {
  const prefix = 'NQ'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export interface DepartmentCities {
  department: string
  cities: string[]
}

export const COLOMBIA_LOCATIONS: DepartmentCities[] = [
  {
    department: 'Amazonas',
    cities: ['Leticia', 'Puerto Nariño', 'El Encanto', 'La Chorrera', 'La Pedrera', 'Tarapacá', 'Mirití-Paraná', 'San Pablo', 'Puerto Alegría', 'Puerto Santander'],
  },
  {
    department: 'Antioquia',
    cities: ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Sabaneta', 'Rionegro', 'La Ceja', 'Caldas', 'Copacabana', 'Girardota', 'Barbosa', 'Turbo', 'Apartadó', 'Chigorodó', 'Caucasia', 'Caucasia', 'Segovia', 'Yarumal', 'Santa Fe de Antioquia', 'Carmen de Viboral', 'Puerto Berrío', 'San Roque', 'Yalí', 'Zaragoza', ' Remedios', 'Andes', 'Hispania', 'Jardín', 'Jerico', 'Pueblorrico', 'Támesis', 'Urrao', 'Valparaíso', 'Betania', 'Mutatá', 'Necoclí', 'San Juan de Urabá', 'San Pedro de Urabá', 'Arboletes', 'Cáceres', 'Tarazá', 'Valdivia', 'Vegachí', 'Yondó', 'Amalfi', 'Anorí', 'Briceño', 'Buriticá', 'Cisneros', 'Donmatías', 'Entrerríos', 'Gómez Plata', 'Guadalupe', 'Guatapé', 'Ituango', 'Carolina del Príncipe', 'Liborina', 'Maceo', 'Marinilla', 'Peñol', 'Peque', 'Pueblorrico', 'Sabanalarga', 'San Andrés de Cuerquia', 'San Carlos', 'San Vicente Ferrer', 'Santa Rosa de Osos', 'Santo Tomás', 'Sopetrán', 'Toledo', 'Vigía del Fuerte'],
  },
  {
    department: 'Arauca',
    cities: ['Arauca', 'Saravena', 'Tame', 'Fortul', 'Cravo Norte', 'Arauquita', 'Puerto Rondón'],
  },
  {
    department: 'Atlántico',
    cities: ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga', 'Sabanagrande', 'Santo Tomás', 'Galapa', 'Puerto Colombia', 'Baranoa', 'Juan de Acosta', 'Ponedera', 'Polonuevo', 'Santa Lucía', 'Manatí', 'Campo de la Cruz', 'Repelón', 'Candelaria', 'Luruaco', 'Piojó', 'Usiacurí', 'Suán', 'Tubará', 'Palmar de Varela', 'Atlántico'],
  },
  {
    department: 'Bolívar',
    cities: ['Cartagena de Indias', 'Magangué', 'Turbaco', 'Arjona', 'El Carmen de Bolívar', 'Carmen de Bolívar', 'Montecristo', 'San Jacinto', 'San Juan Nepomuceno', 'Mahates', 'María la Baja', 'Villanueva', 'San Estanislao', 'Arenal', 'Clemencia', 'Santa Rosa del Sur', 'Simití', 'Cantagallo', 'Tiquisio', 'San Martín de Loba', 'Santa Catalina', 'Achí', 'Altos del Rosario', 'Barranco de Loba', 'Cicuco', 'Córdoba', 'El Guamo', 'Hatillo de Loba', 'Margarita', 'Mompós', 'Montes de María', 'Norosí', 'Pinillos', 'Regidor', 'Río Viejo', 'San Fernando', 'San Pablo', 'Santa Rosa', 'Soplaviento', 'Talaigua Nuevo', 'Turbana', 'Villanueva', 'Zambrano'],
  },
  {
    department: 'Boyacá',
    cities: ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Puerto Boyacá', 'Moniquirá', 'Villa de Leyva', 'Chita', 'Chitaraque', 'Combita', 'Coper', 'Tópaga', 'Tuta', 'Paipa', 'Tibasosa', 'Pesca', 'Toca', 'Guateque', 'Garagoa', 'Ramiriquí', 'Miraflores', 'Zetaquirá', 'Chivor', 'Almeida', 'Berbeo', 'San Luis de Gaceno', 'Paya', 'Labranzagrande', 'Pisba', 'Aquitania', 'Sativanorte', 'Socha', 'Socotá', 'Tipacoque', 'Cubará', 'Chiscas', 'El Cocuy', 'El Espino', 'Guacamayas', 'Panqueba', 'Boavita', 'La Capilla', 'La Uvita', 'Belén', 'Cerinza', 'Busbanzá', 'Floresta', 'La Salina', 'Nobsa', 'Mongua', 'Monguí', 'Otanche', 'Páez', 'Pauni', 'Paya', 'Ráquira', 'Rondón', 'Sácama', 'San José de Pare', 'San Miguel de Sema', 'Sativasur', 'Siachoque', 'Soracá', 'Sotaquirá', 'Sutamarchán', 'Sutatenza', 'Tasco', 'Tenza', 'Tenza', 'Tibaná', 'Tununguá', 'Umbita', 'Ventaquemada', 'Viracachá', 'Zetaquira'],
  },
  {
    department: 'Caldas',
    cities: ['Manizales', 'La Dorada', 'Chinchiná', 'Villamaría', 'Anserma', 'Riosucio', 'Supía', 'Marmato', 'Filadelfia', 'Salamina', 'Pácora', 'Aranzazu', 'Samaná', 'Victoria', 'Marulanda', 'Marquetalia', 'Manzanares', 'Pensilvania', 'Norcasia', 'Belalcázar', 'Risaralda', 'Viterbo', 'Palestina', 'Neira', 'Chinchiná'],
  },
  {
    department: 'Caquetá',
    cities: ['Florencia', 'San Vicente del Caguán', 'Cartagena del Chairá', 'El Doncello', 'El Paujil', 'Montañita', 'Morelia', 'Puerto Rico', 'San José del Fragua', 'Solano', 'Solita', 'Valparaíso', 'Curillo', 'La Montañita', 'Milán', 'El Paujil', 'Albania', 'Belén de los Andaquíes', 'Belén de Andaquíes', 'Curbatí'],
  },
  {
    department: 'Casanare',
    cities: ['Yopal', 'Aguazul', 'Tauramena', 'Paz de Ariporo', 'Maní', 'Hato Corozal', 'Monterrey', 'Sácama', 'Támara', 'Trinidad', 'Nunchía', 'La Salina', 'Recetor', 'Orocué', 'Chámeza', 'Pore', 'Sabanalarga', 'Tauramena', 'Cabrera'],
  },
  {
    department: 'Cauca',
    cities: ['Popayán', 'Patía', 'Santander de Quilichao', 'Cauca', 'Piendamó', 'El Tambo', 'Mondomo', 'Villa Rica', 'Caloto', 'Silvia', 'Guapi', 'López de Micay', 'Timbiquí', 'Timbío', 'La Sierra', 'Totoró', 'Balboa', 'Mercaderes', 'Patía', 'La Vega', 'Suárez', 'Sucre', 'Buenos Aires', 'Bolívar', 'Almaguer', 'Argelia', 'Cajibío', 'Caldono', 'Corinto', 'El Cerrito', 'Florencia', 'Guachené', 'Inzá', 'Jambaló', 'Miranda', 'Morales', 'Padilla', 'Páez', 'Puerto Tejada', 'Puracé', 'Rosas', 'San Sebastián', 'Santa Rosa', 'Siberia', 'Sotará', 'Toribío', 'Totoró', 'Villa Rica'],
  },
  {
    department: 'Cesar',
    cities: ['Valledupar', 'Aguachica', 'Agustín Codazzi', 'Bosconia', 'Chimichagua', 'Curumaní', 'El Copey', 'El Paso', 'Gamarra', 'La Gloria', 'Pailitas', 'Pelaya', 'Pueblo Bello', 'Río de Oro', 'San Alberto', 'San Diego', 'San Martín', 'Astrea', 'Becerril', 'Chiriguaná', 'La Jagua de Ibirico', 'La Paz', 'Manaure', 'Tamalameque', 'Valledupar', 'Urumita', 'Villanueva', 'Pueblo Bello'],
  },
  {
    department: 'Chocó',
    cities: ['Quibdó', 'Istmina', 'Condoto', 'Tadó', 'Riosucio', 'Nuquí', 'Bahía Solano', 'Acandí', 'Unguía', 'Carmen del Darién', 'Bagadó', 'Novita', 'Sipí', 'Alto Baudó', 'Bajo Baudó', 'El Cantón del San Pablo', 'El Litoral del San Juan', 'El Atrato', 'Atrato', 'Medio Atrato', 'Medio Baudó', 'Medio San Juan', 'Río Iro', 'Río Quito', 'San José del Palmar', 'Sipí', 'Tadó', 'Unión Panamericana', 'Unguía'],
  },
  {
    department: 'Córdoba',
    cities: ['Montería', 'Cereté', 'Lorica', 'Sahagún', 'Tierralta', 'Montelíbano', 'Planeta Rica', 'Ciénaga de Oro', 'Cereté', 'San Antero', 'San Bernardo del Viento', 'San Pelayo', 'Ayapel', 'Buenavista', 'Canalete', 'Chimá', 'Chinú', 'Cotorra', 'La Apartada', 'Lorica', 'Los Córdobas', 'Momil', 'Moñitos', 'Montelíbano', 'Montería', 'Planeta Rica', 'Pueblo Nuevo', 'Puerto Escondido', 'Puerto Libertador', 'Purísima de la Concepción', 'Sahagún', 'San Andrés de Sotavento', 'San Antero', 'San Bernardo del Viento', 'San Carlos', 'San José de Uré', 'San Pelayo', 'Tierralta', 'Tuchín', 'Valencia'],
  },
  {
    department: 'Cundinamarca',
    cities: ['Bogotá D.C.', 'Soacha', 'Fusagasugá', 'Facatativá', 'Zipaquirá', 'Chía', 'Mosquera', 'Madrid', 'Funza', 'Girardot', 'Villavicencio', 'Sibaté', 'La Calera', 'Cajicá', 'Tocancipá', 'Gachancipá', 'Sopó', 'Tabio', 'Tenjo', 'Cota', 'Chía', 'Tibacuy', 'Pasca', 'Arbeláez', 'Granada', 'Silvania', 'San Bernardo', 'Pandi', 'Venecia', 'Nilo', 'Tibiairitá', 'Nimaima', 'Nariño', 'La Peña', 'La Palma', 'Yacopí', 'Caparrapí', 'Pacho', 'Paime', 'Villagómez', 'Topaipí', 'El Peñón', 'La Vega', 'El Rosal', 'Subachoque', 'Bojacá', 'Facatativá', 'Madrid', 'Funza', 'Mosquera', 'Cota', 'Chía', 'Tocancipá', 'Gachancipá', 'Sopó', 'Tabio', 'Tenjo', 'Cajicá', 'Cota', 'Sopó', 'Guasca', 'Junín', 'Gachetá', 'Fómeque', 'Fosca', 'Quetame', 'Guayabetal', 'Medina', 'Ubalá', 'Gama', 'Gachalá', 'Choachí', 'Chipaque', 'Une', 'Cáqueza', 'Fusagasugá', 'Pandi', 'Pasca', 'San Bernardo', 'Arbeláez', 'Tibacuy', 'Venecia', 'Silvania', 'Granada', 'Nilo', 'Tibacuy', 'Apulo', 'Anapoima', 'La Mesa', 'Tena', 'El Colegio', 'Quipile', 'Viotá', 'Anolaima', 'Bituima', 'Sasaima', 'Albán', 'Guayabal de Siquima', 'Vianí', 'Pulí', 'Jerusalén', 'Tocaima', 'Agua de Dios', 'Ricaurte', 'Nariño', 'Vergara', 'San Juan de Rioseco', 'Chaguani', 'Pulí', 'La Vega', 'El Peñón', 'Caparrapí', 'Pacho', 'Paime', 'Villagómez', 'Topaipí', 'Yacopí', 'La Palma', 'La Peña', 'Nimaima', 'Nariño', 'Útica', 'Beltrán', 'Pulí', 'Bituima', 'San Juan de Rioseco', 'Viotá', 'Tocaima', 'Agua de Dios', 'Apulo', 'Anapoima', 'La Mesa', 'El Colegio', 'Quipile', 'Sasaima', 'Albán', 'Guayabal de Siquima', 'Vianí', 'Tena'],
  },
  {
    department: 'Guainía',
    cities: ['Inírida', 'Barranco Minas', 'San Felipe', 'Puerto Colombia', 'La Guadalupe', 'Cacahual', 'Pana Pana', 'Morichal'],
  },
  {
    department: 'Guaviare',
    cities: ['San José del Guaviare', 'Calamar', 'El Retorno', 'Miraflores', 'El Retorno', 'Morichal Nuevo'],
  },
  {
    department: 'Huila',
    cities: ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre', 'Yaguará', 'Fortalecillas', 'Palermo', 'Baraya', 'Tello', 'Aipe', 'Villavieja', 'Tesalia', 'Paicol', 'Nátaga', 'Hobo', 'Campoalegre', 'Rivera', ' Saladoblanco', 'Isnos', 'San Agustín', 'Pitalito', 'Acevedo', 'San Adolfo', 'Suaza', 'San Roque', 'Guadalupe', 'Altamira', 'Elías', 'Palermo', 'La Plata', 'Tarqui', 'Teruel', 'Algeciras', 'Yaguará', 'Paicol', 'Tesalia', 'Nátaga', 'Villavieja', 'Aipe', 'Baraya', 'Tello', 'Hobo', 'Campoalegre'],
  },
  {
    department: 'La Guajira',
    cities: ['Riohacha', 'Maicao', 'Fonseca', 'Barrancas', 'Manaure', 'Uribia', 'Distracción', 'La Jagua del Pilar', 'Villanueva', 'San Juan del Cesar', 'El Molino', 'Albania', 'Dibulla', 'Hatonuevo', 'La Mesa', 'Maicao', 'Manaure', 'Riohacha', 'San Juan del Cesar', 'Urumita', 'Uribia', 'Villanueva', 'Fonseca'],
  },
  {
    department: 'Magdalena',
    cities: ['Santa Marta', 'Ciénaga', 'Fundación', 'Aracataca', 'El Banco', 'Plato', 'Pivijay', 'Sabanas de San Ángel', 'Zona Bananera', 'Algarrobo', 'Ariguaní', 'Cerro de San Antonio', 'Chibolo', 'Concordia', 'El Piñón', 'El Retén', 'Guamal', 'Pedraza', 'Pijiño del Carmen', 'Pivijay', 'Plato', 'Puebloviejo', 'Remolino', 'Sabanas de San Ángel', 'Salamina', 'San Sebastián de Buenavista', 'San Zenón', 'Santa Ana', 'Santa Marta', 'Sitionuevo', 'Tenerife', 'Zapayán', 'Zona Bananera'],
  },
  {
    department: 'Meta',
    cities: ['Villavicencio', 'Acacías', 'Granada', 'Puerto López', 'San Martín', 'Restrepo', 'Cumaral', 'Barranca de Upía', 'San Juan de Arama', 'San Juanito', 'El Calvario', 'El Castillo', 'El Dorado', 'Fuente de Oro', 'Cabuyaro', 'Castilla la Nueva', 'Cumaribo', 'Cumaral', 'El Castillo', 'El Dorado', 'Fuente de Oro', 'Granada', 'Guamal', 'La Macarena', 'Lejanías', 'Mapiripán', 'Mesetas', 'Puerto Concordia', 'Puerto Gaitán', 'Puerto Lleras', 'Puerto López', 'Puerto Rico', 'Restrepo', 'San Carlos de Guaroa', 'San Juan de Arama', 'San Martín', 'Vistahermosa', 'Villavicencio'],
  },
  {
    department: 'Nariño',
    cities: ['Pasto', 'Ipiales', 'Tumaco', 'San Juan de Pasto', 'Buesaco', 'Samaniego', 'La Unión', 'Sandona', 'Túquerres', 'Ipiales', 'Guachucal', 'Cumbal', 'Potosí', 'Córdoba', 'Pasto', 'Buesaco', 'Consacá', 'Chachagüí', 'Catambuco', 'Tangua', 'Colon', 'Policarpa', 'Sandoná', 'La Florida', 'Yacuanquer', 'Linares', 'Sapuyes', 'Guaitarilla', 'Aldana', 'Cuaspud', 'Carlosama', 'Cumbitara', 'Los Andes', 'Ricaurte', 'Mallama', 'El Peñol', 'La Cruz', 'San Pablo', 'Taminango', 'Florida', 'Milán', 'Mocoa', 'Puerto Asís', 'Villagarzón', 'Orito', 'Valle del Guamuez', 'San Miguel', 'Puerto Leguízamo', 'Puerto Caicedo', 'Puerres', 'Ipiales', 'Aldana', 'Arboles', 'Buesaco', 'Chachagüí', 'Colón', 'Consacá', 'Córdoba', 'Cuaspud', 'Cumbal', 'Cumbitara', 'El Charco', 'El Peñol', 'El Rosario', 'Francisco Pizarro', 'Funza', 'Guachucal', 'Guaitarilla', 'Gualmatán', 'Iles', 'Imués', 'Ipiales', 'La Cruz', 'La Florida', 'La Llanada', 'La Unión', 'Leiva', 'Linares', 'Los Andes', 'Magüí Payán', 'Mallama', 'Mosquera', 'Nariño', 'Olaya Herrera', 'Ospina', 'Pasto', 'Policarpa', 'Potosí', 'Providencia', 'Puerres', 'Ricaurte', 'Roberto Payán', 'Samaniego', 'San Bernardo', 'San Lorenzo', 'San Pablo', 'San Pedro de Cartago', 'Sandoná', 'Santa Bárbara', 'Sapuyes', 'Taminango', 'Tangua', 'Tumaco', 'Túquerres', 'Yacuanquer'],
  },
  {
    department: 'Norte de Santander',
    cities: ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario', 'Los Patios', 'El Zulia', 'Puerto Santander', 'San Cayetano', 'Tibú', 'El Tarra', 'Sardinata', 'La Esperanza', 'Convención', 'Bucarasica', 'El Carmen', 'San Calixto', 'Hacarí', 'La Playa', 'Teorama', 'Ábrego', 'Cáchira', 'Chinácota', 'Chitagá', 'Durania', 'Mutiscua', 'Pamplonita', 'Ragonvalia', 'Salazar', 'Toledo', 'Bochalema', 'Cucutilla', 'Arboledas', 'Cácota', 'Gramalote', 'Lourdes', 'Santiago', 'Sardinata', 'Valle de San José', 'Villa Caro', 'Zulia'],
  },
  {
    department: 'Putumayo',
    cities: ['Mocoa', 'Puerto Asís', 'Villagarzón', 'Orito', 'Valle del Guamuez', 'San Miguel', 'Puerto Leguízamo', 'Puerto Caicedo', 'Puerres', 'Puerto Guzmán', 'Leguízamo', 'Puerto Leguízamo', 'Sibundoy', 'Colón', 'Santiago', 'San Francisco', 'Mocoa', 'Puerto Asís', 'Puerto Caicedo', 'Puerto Guzmán', 'Puerto Leguízamo', 'San Miguel', 'Valle del Guamuez', 'Villagarzón'],
  },
  {
    department: 'Quindío',
    cities: ['Armenia', 'Calarcá', 'Montenegro', 'La Tebaida', 'Quimbaya', 'Circasia', 'Salento', 'Filandia', 'Pijao', 'Génova', 'Córdoba', 'Buenavista', 'Pijao', 'Salento', 'Calarcá', 'Circasia', 'Córdoba', 'Filandia', 'Génova', 'La Tebaida', 'Montenegro', 'Pijao', 'Quimbaya', 'Salento'],
  },
  {
    department: 'Risaralda',
    cities: ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia', 'Marsella', 'Belén de Umbría', 'Mistrató', 'Pueblo Rico', 'Balboa', 'Quinchía', 'Guática', 'Apía', 'Santuario', 'La Celia', 'Belén de Umbría', 'Mistrató', 'Santa Rosa de Cabal', 'Santuario', 'Pereira', 'Apía', 'Balboa', 'Belén de Umbría', 'Guática', 'La Celia', 'La Virginia', 'Marsella', 'Mistrató', 'Pueblo Rico', 'Quinchía', 'Santuario'],
  },
  {
    department: 'San Andrés y Providencia',
    cities: ['San Andrés', 'Providencia', 'Santa Catalina', 'San Andrés Isla'],
  },
  {
    department: 'Santander',
    cities: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barbosa', 'Socorro', 'San Gil', 'Vélez', 'Málaga', 'Rionegro', 'Barrancabermeja', 'Puerto Wilches', 'Lebrija', 'Los Santos', 'Aratoca', 'Barichara', 'Valle de San José', 'Betulia', 'El Guacamayo', 'Jesús María', 'Suaita', 'Oiba', 'Palmar', 'Simacota', 'Contratación', 'Capitanejo', 'Carcasí', 'Cerrito', 'Concepción', 'Enciso', 'Guaca', 'Macaravita', 'Málaga', 'San Andrés', 'San José de Miranda', 'San Miguel', 'Servitá', 'Teorama', 'Cimitarra', 'Puerto Parra', 'Landázuri', 'El Carmen de Chucurí', 'San Vicente de Chucurí', 'Simacota', 'Zapatoca', 'Betulia', 'El Peñón', 'Galán', 'Palmar', 'Puerto Wilches', 'Lebrija', 'Sabana de Torres', 'Rionegro', 'Floridablanca', 'Piedecuesta', 'Tona', 'Santa Bárbara', 'Matanza', 'Girón', 'Charta', 'Bucaramanga', 'Suratá', 'California', 'Vetas', 'Cerrito', 'Concepción', 'Florián', 'Guapo', 'La Belleza', 'Landázuri', 'Puerto Parra', 'San Benito', 'Santa Helena del Opón', 'Sucre', 'Vélez', 'Chipatá', 'Guavatá', 'Jesús María', 'La Paz', 'San Vicente de Chucurí', 'Vélez', 'Albania', 'Aratoca', 'Barichara', 'Barrancabermeja', 'Bucaramanga', 'Cabrera', 'California', 'Capitanejo', 'Carcasí', 'Cepitá', 'Cerrito', 'Charalá', 'Charta', 'Chima', 'Chipatá', 'Cimitarra', 'Concepción', 'Confines', 'Contratación', 'Coromoro', 'Curití', 'El Carmen de Chucurí', 'El Guacamayo', 'El Peñón', 'El Playón', 'Encino', 'Enciso', 'Floridablanca', 'Florián', 'Galán', 'Gámbita', 'Girón', 'Guaca', 'Guapotá', 'Guavatá', 'Güepsa', 'Hato', 'Jesús María', 'Jordán', 'La Belleza', 'Landázuri', 'Lebrija', 'Los Santos', 'Los Santos', 'Macaravita', 'Málaga', 'Matanza', 'Mogotes', 'Ocamonte', 'Oiba', 'Onzaga', 'Palmar', 'Palmas del Socorro', 'Páramo', 'Piedecuesta', 'Puente Nacional', 'Puerto Parra', 'Puerto Wilches', 'Rionegro', 'Sabana de Torres', 'San Andrés', 'San Benito', 'San Gil', 'San Joaquín', 'San José de Miranda', 'San Miguel', 'San Vicente de Chucurí', 'Santa Bárbara', 'Santa Helena del Opón', 'Simacota', 'Socorro', 'Suaita', 'Sucre', 'Suratá', 'Tona', 'Valle de San José', 'Vélez', 'Vetas', 'Villanueva', 'Zapatoca'],
  },
  {
    department: 'Sucre',
    cities: ['Sincelejo', 'Corozal', 'Sampués', 'San Juan de Betulia', 'San Marcos', 'San Benito Abad', 'Tolú', 'Toluviejo', 'Coveñas', 'Corozal', 'Las Palmas', 'Buenavista', 'Chalán', 'Coloso', 'El Roble', 'Galeras', 'Guaranda', 'La Unión', 'Los Palmitos', 'Majagual', 'Morroa', 'Ovejas', 'Palmito', 'San Marcos', 'San Marcos', 'San Onofre', 'San Pedro', 'San Luis de Since', 'Sincelejo', 'Sincé', 'Sucre', 'Santiago de Tolú', 'Tolú', 'Toluviejo'],
  },
  {
    department: 'Tolima',
    cities: ['Ibagué', 'Espinal', 'Honda', 'Líbano', 'Guamo', 'Melgar', 'Chaparral', 'Santa Isabel', 'Purificación', 'Girardot', 'Lérida', 'Flandes', 'Armero', 'Guayabal', 'Mariquita', 'Venadillo', 'Carmen de Apicalá', 'Natagaima', 'Falan', 'Alvarado', 'Coello', 'Rovira', 'Anzoátegui', 'San Sebastián de Mariquita', 'Ambalema', 'Suárez', 'San Luis', 'Murillo', 'Herveo', 'Villahermosa', 'Villarrica', 'Cajamarca', 'Roncesvalles', 'Planadas', 'Río Blanco', 'Ataco', 'San Antonio', 'Caldono', 'Saldaña', 'Valle de San Juan', ' Carmen de Apicalá', 'Prado', 'Piedras', 'Ortega', 'Palocabildo', 'Casabianca', 'Ibagué', 'Alpujarra', 'Alvarado', 'Ambalema', 'Anzoátegui', 'Armero', 'Ataco', 'Cajamarca', 'Carmen de Apicalá', 'Casabianca', 'Chaparral', 'Coello', 'Coyaima', 'Dolores', 'Espinal', 'Falan', 'Flandes', 'Fresno', 'Guamo', 'Guayabal', 'Herveo', 'Honda', 'Ibagué', 'Lérida', 'Líbano', 'Mariquita', 'Melgar', 'Murillo', 'Natagaima', 'Ortega', 'Palambla', 'Palocabildo', 'Piedras', 'Planadas', 'Prado', 'Purificación', 'Roncesvalles', 'Rovira', 'Saldaña', 'San Antonio', 'San Luis', 'Santa Isabel', 'Suárez', 'Valle de San Juan', 'Venadillo', 'Villahermosa', 'Villarrica'],
  },
  {
    department: 'Valle del Cauca',
    cities: ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago', 'Yumbo', 'Jamundí', 'Florida', 'Palmira', 'Yumbo', 'Dagua', 'Vijes', 'La Cumbre', 'Restrepo', 'Calima', 'Darién', 'Riofrío', 'Trujillo', 'Buga', 'San Pedro', 'Bugalagrande', 'Andalucía', 'Sevilla', 'Caicedonia', 'Obando', 'Zarzal', 'La Unión', 'La Victoria', 'Roldanillo', 'Argelia', 'El Dovio', 'El Águila', 'Versalles', 'Ansermanuevo', 'El Cairo', 'Toro', 'Bolívar', 'Dagua', 'Calima Darién', 'Ginebra', 'Guacarí', 'Restrepo', 'Riofrío', 'Trujillo', 'Dagua', 'Yotoco', 'Vijes', 'La Cumbre', 'Cali', 'Jamundí', 'Buenaventura', 'Buenos Aires', 'Cali', 'Calima', 'Candelaria', 'Dagua', 'El Cairo', 'El Dovio', 'Florida', 'Ginebra', 'Guacarí', 'Jamundí', 'La Cumbre', 'La Unión', 'La Victoria', 'Restrepo', 'Riofrío', 'Roldanillo', 'San Pedro', 'Sevilla', 'Toro', 'Trujillo', 'Tuluá', 'Versalles', 'Vijes', 'Yotoco', 'Yumbo', 'Zarzal'],
  },
  {
    department: 'Vaupés',
    cities: ['Mitú', 'Carurú', 'Taraira', 'Pacoa', 'Papunahua', 'Yavaraté'],
  },
  {
    department: 'Vichada',
    cities: ['Puerto Carreño', 'La Primavera', 'Santa Rosalía', 'Cumaribo', 'San José de Maipures'],
  },
]
