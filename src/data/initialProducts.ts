import { Product, StoreSettings, FinancialRecord } from '../types';

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'MOXIE',
  tagline: 'Actitud y Estilo',
  heroBannerImage: '/src/assets/images/moxie_streetwear_hero_1793892889970.jpg',
  whatsappNumber: '584244578410',
  instagramUrl: 'https://instagram.com/moxievibe',
  tiktokUrl: 'https://tiktok.com/@moxievibee',
  exchangeRateBs: 58.50, // 1 USD = 58.50 Bs (configurable en panel)
  categories: ['Ropa', 'Accesorios'],
  deliveryZones: [
    { id: 'zone-1', name: 'Valencia Norte (Prebo, La Viña, El Parral, Las Chimeneas)', costUSD: 3 },
    { id: 'zone-2', name: 'Valencia Centro / San Blas / Candelaria', costUSD: 2.5 },
    { id: 'zone-3', name: 'Naguanagua (La Granja, Mañongo, Tazajal)', costUSD: 3.5 },
    { id: 'zone-4', name: 'San Diego (El Morro, Valle Verde)', costUSD: 4 },
  ],
  adminPassword: 'mooxiiee19*',
  announcement: '',
  showAnnouncement: false,
};

export const INITIAL_FINANCIAL_RECORDS: FinancialRecord[] = [
  {
    id: 'fin-1',
    type: 'ingreso',
    description: 'Venta 2x Heavyweight Boxy Hoodie',
    amountUSD: 96,
    category: 'Ventas de Ropa',
    date: '04 Nov 2026',
  },
  {
    id: 'fin-2',
    type: 'gasto',
    description: 'Compra de tela French Terry 460 GSM',
    amountUSD: 140,
    category: 'Materia Prima',
    date: '03 Nov 2026',
  },
  {
    id: 'fin-3',
    type: 'ingreso',
    description: 'Venta 1x Oversized Tee + 1x Cap Arch',
    amountUSD: 50,
    category: 'Ventas de Ropa',
    date: '03 Nov 2026',
  },
  {
    id: 'fin-4',
    type: 'gasto',
    description: 'Bolsas mate personalizadas y etiquetas tejidas',
    amountUSD: 35,
    category: 'Empaque & Branding',
    date: '01 Nov 2026',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'moxie-hoodie-01',
    name: 'MOXIE Heavyweight Boxy Hoodie',
    category: 'Ropa',
    priceUSD: 48,
    originalPriceUSD: 55,
    stockUnits: 22,
    images: [
      '/src/assets/images/moxie_hoodie_green_1793892890875.jpg',
      '/src/assets/images/moxie_streetwear_hero_1793892889970.jpg',
    ],
    description: 'Sudadera con capucha corte boxy streetwear de alto gramaje. Tejido pesado de tacto robusto, hombros caídos y capucha anatómica doble sin cordones para una silueta limpia y moderna.',
    technicalSpecs: [
      'Algodón pesado 100% French Terry 460 GSM',
      'Corte boxy relajado con caída estructurada',
      'Bolsillo frontal tipo canguro reforzado con presillas',
      'Puños y pretina en rib 2x2 de alta elasticidad y memoria',
      'Teñido reactivo en verde bosque profundo #003314 y negro mate',
      'Etiqueta tejida en dobladillo inferior'
    ],
    sizeGuide: [
      { size: 'S', chestCm: 58, lengthCm: 68, sleeveCm: 59 },
      { size: 'M', chestCm: 61, lengthCm: 71, sleeveCm: 61 },
      { size: 'L', chestCm: 64, lengthCm: 74, sleeveCm: 63 },
      { size: 'XL', chestCm: 67, lengthCm: 77, sleeveCm: 65 },
    ],
    inStock: true,
    featured: true,
    badge: 'DROP 01',
    variants: [
      {
        name: 'Talla',
        options: ['S', 'M', 'L', 'XL'],
      },
      {
        name: 'Color',
        options: ['Verde Moxie (#003314)', 'Negro Ébano'],
      },
    ],
  },
  {
    id: 'moxie-tee-01',
    name: 'MOXIE Oversized Heavy Cotton Tee',
    category: 'Ropa',
    priceUSD: 28,
    originalPriceUSD: 32,
    stockUnits: 35,
    images: [
      '/src/assets/images/moxie_tshirt_black_1793892891603.jpg',
      '/src/assets/images/moxie_streetwear_hero_1793892889970.jpg',
    ],
    description: 'Camiseta esencial de silueta oversize con cuello cerrado de 3 cm acanalado y mangas amplias. Confeccionada en algodón peinado de alto calibre que mantiene su forma lavado tras lavado.',
    technicalSpecs: [
      '100% Algodón peinado de 240 GSM de máxima suavidad y cuerpo',
      'Cuello acanalado cerrado resistente a la deformación',
      'Corte oversize con caída fluida en hombros',
      'Costura doble reforzada en hombros y sisas',
      'Estampado en serigrafía de alta densidad al tacto cero'
    ],
    sizeGuide: [
      { size: 'S', chestCm: 56, lengthCm: 71, sleeveCm: 23 },
      { size: 'M', chestCm: 59, lengthCm: 74, sleeveCm: 24 },
      { size: 'L', chestCm: 62, lengthCm: 77, sleeveCm: 25 },
      { size: 'XL', chestCm: 65, lengthCm: 80, sleeveCm: 26 },
    ],
    inStock: true,
    featured: true,
    badge: 'MÁS VENDIDO',
    variants: [
      {
        name: 'Talla',
        options: ['S', 'M', 'L', 'XL'],
      },
      {
        name: 'Color',
        options: ['Negro Intenso', 'Blanco Óptico', 'Verde Moxie'],
      },
    ],
  },
  {
    id: 'moxie-track-jacket-01',
    name: 'MOXIE Sportswear Nylon Track Jacket',
    category: 'Ropa',
    priceUSD: 55,
    stockUnits: 14,
    images: [
      '/src/assets/images/moxie_streetwear_hero_1793892889970.jpg',
      '/src/assets/images/moxie_hoodie_green_1793892890875.jpg',
    ],
    description: 'Chaqueta deportiva técnica con forro transpirable de malla y cremallera frontal completa. Tratamiento repelente al agua y detalles en bloque de color verde oscuro y negro.',
    technicalSpecs: [
      'Nylon técnico impermeable con acabado mate ripstop',
      'Forro interior de micromalla técnica transpirable',
      'Cremallera bidireccional YKK con tirador personalizado',
      'Bolsillos laterales con cremalleras ocultas',
      'Ajustadores elásticos en bajo y cuello alto protector'
    ],
    sizeGuide: [
      { size: 'S', chestCm: 59, lengthCm: 69, sleeveCm: 62 },
      { size: 'M', chestCm: 62, lengthCm: 72, sleeveCm: 64 },
      { size: 'L', chestCm: 65, lengthCm: 75, sleeveCm: 66 },
      { size: 'XL', chestCm: 68, lengthCm: 78, sleeveCm: 68 },
    ],
    inStock: true,
    featured: false,
    badge: 'SPORT COLLECTION',
    variants: [
      {
        name: 'Talla',
        options: ['S', 'M', 'L', 'XL'],
      },
      {
        name: 'Color',
        options: ['Bloque Verde & Negro', 'Total Black'],
      },
    ],
  },
  {
    id: 'moxie-cap-01',
    name: 'MOXIE 6-Panel Dad Cap "Arch"',
    category: 'Accesorios',
    priceUSD: 22,
    stockUnits: 28,
    images: [
      '/src/assets/images/moxie_cap_accessory_1793892891425.jpg',
    ],
    description: 'Gorra clásica desestructurada de 6 paneles en sarga de algodón lavado. Corona de perfil bajo con visera precurvada y bordado tipográfico de alta precisión.',
    technicalSpecs: [
      '100% Sarga de algodón peinado con lavado suave',
      'Cierre trasero metálico con correa ajustable de tela',
      'Ojales bordados para máxima ventilación',
      'Bordado frontal en relieve de alta definición',
      'Talla única adaptable (54 cm a 61 cm)'
    ],
    inStock: true,
    featured: true,
    badge: 'ACCESORIO',
    variants: [
      {
        name: 'Color',
        options: ['Verde Bosque (#003314)', 'Negro Lavado', 'Blanco Crudo'],
      },
    ],
  },
  {
    id: 'moxie-socks-01',
    name: 'MOXIE Ribbed Crew Socks (Pack x2)',
    category: 'Accesorios',
    priceUSD: 14,
    stockUnits: 40,
    images: [
      '/src/assets/images/moxie_cap_accessory_1793892891425.jpg',
    ],
    description: 'Pack de dos pares de calcetines deportivos acanalados de caña media con acolchado en planta y talón para amortiguación diaria.',
    technicalSpecs: [
      '80% Algodón, 17% Poliéster, 3% Elastano',
      'Soporte elástico en arco plantar',
      'Logotipo jacquard MOXIE en laterales',
      'Puntera sin costuras irritantes',
      'Pack incluye 1 par Negro y 1 par Verde Moxie'
    ],
    inStock: true,
    featured: false,
    variants: [
      {
        name: 'Talla',
        options: ['Única (38 - 44)'],
      },
    ],
  },
  {
    id: 'moxie-cargo-01',
    name: 'MOXIE Relaxed Technical Cargo Pants',
    category: 'Ropa',
    priceUSD: 52,
    stockUnits: 0,
    images: [
      '/src/assets/images/moxie_streetwear_hero_1793892889970.jpg',
    ],
    description: 'Pantalón cargo de corte recto y relajado con 6 bolsillos multifuncionales. Tejido duradero de mezcla de algodón y elastano que ofrece confort tanto en la calle como en entrenamientos.',
    technicalSpecs: [
      'Sarga técnica de algodón elástico 280 GSM',
      'Bolsillos tipo fuelle con solapa y velcro',
      'Cintura elástica con cordón de ajuste interior',
      'Tancas ajustables en los tobillos para estilo jogger o recto'
    ],
    sizeGuide: [
      { size: 'S', chestCm: 76, lengthCm: 101, waistCm: 76 },
      { size: 'M', chestCm: 81, lengthCm: 103, waistCm: 81 },
      { size: 'L', chestCm: 86, lengthCm: 105, waistCm: 86 },
      { size: 'XL', chestCm: 91, lengthCm: 107, waistCm: 91 },
    ],
    inStock: false,
    featured: false,
    badge: 'AGOTADO',
    variants: [
      {
        name: 'Talla',
        options: ['S (30)', 'M (32)', 'L (34)', 'XL (36)'],
      },
      {
        name: 'Color',
        options: ['Negro Asfalto', 'Verde Militar'],
      },
    ],
  },
];
