/**
 * Taem Kitchen — digital menu data
 * All prices are in Ethiopian Birr (ETB).
 */

export type Category =
  | 'All'
  | 'Breakfast'
  | 'Lunch'
  | 'Snacks'
  | 'Juices'
  | 'Hot Drinks'
  | 'Drinks'

export const CATEGORIES: Category[] = [
  'All',
  'Breakfast',
  'Lunch',
  'Snacks',
  'Juices',
  'Hot Drinks',
  'Drinks',
]

export interface MenuItem {
  id: string
  name: string
  description: string
  /** Price in Ethiopian Birr (ETB) */
  price: number
  category: Exclude<Category, 'All'>
  image: string
  tag?: string
}

export const RESTAURANT = {
  name: 'Taem Kitchen',
  tagline: 'Taste Worth Waiting For',
  subTagline: 'Patience Meets Perfection',
  currency: 'ETB',
  established: 2019,
  address: 'Kebele 14 ke noc wede Akotet bemiwesdew menged 100m geba belo, Bahir Dar, Ethiopia',
  phone: '+251 909090909',
  hours: [
    { days: 'Monday – Friday', time: '2:00 AM – 3:00 PM' },
    { days: 'Saturday', time: '2:30 AM – 3:00 PM' },
    { days: 'Sunday', time: '8:00 AM – 4:00 PM' },
  ],
  copyright: `© ${new Date().getFullYear()} Taem Kitchen. All rights reserved.`,
} as const

export const MENU_ITEMS: MenuItem[] = [
  /* ── Breakfast ─────────────────────────────────────────── */
  {
    id: 'chechebsa',
    name: 'Chechebsa (Kita Fitfit)',
    description:
      'Kita flatbread torn and pan-fried in spiced niter kibbere, with honey and yoghurt on the side.',
    price: 260,
    category: 'Breakfast',
    image:
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
    tag: 'Traditional',
  },
 {
    id: 'injera-firfir',
    name: 'Injera Firfir',
    description:
      'Torn injera pieces tossed in a savory berbere sauce with onions, tomatoes, and spiced butter.',
    price: 220,
    category: 'Breakfast',
    image:
      'https://images.unsplash.com/photo-1588675646184-f5b0b0b0b2de?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegetarian',
  },
  {
    id: 'fetira',
    name: 'Fetira',
    description: 'Thick barley porridge with a well of spiced butter and berbere, finished with honey.',
    price: 190,
    category: 'Breakfast',
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
  },
  {
  id: 'enkulal firfir',
  name: 'Enkulal Firfir',
  description:
    'Ethiopian scrambled eggs sauteed with red onions, tomatoes, green chilies, and rich spiced butter.',
  price: 250,
  category: 'Breakfast',
  image:
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  tag: 'Vegetarian',
},
  {
    id: 'ful',
    name: 'Ful',
    description: 'Slow-cooked lamb broth with fresh rosemary and herbs, served with warm bread.',
    price: 340,
    category: 'Breakfast',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  },

  /* ── Lunch ─────────────────────────────────────────────── */
  {
    id: 'mulu doro-grilled',
    name: 'Mulu Doro-Grilled',
    description: 'Chicken leg slow-braised for hours in berbere sauce, with egg, ayib and injera.',
    price: 3000,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    tag: "Chef's Special",
  },
  {
    id: 'mulu doro roasted',
    name: 'Mulu Doro Roasted',
    description: 'Tender beef cubes seared with rosemary, jalapeño and caramelised onions.',
    price: 3000,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    tag: 'Spicy',
  },
  {
    id: 'mulu doro',
    name: 'Mulu Doro',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 3000,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
    {
    id: 'gimash doro',
    name: 'Gimash Doro',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 1500,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
    {
    id: 'special shawerma',
    name: 'Special Shawerma',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 1300,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
   {
    id: 'normal shawerma',
    name: 'Normal Shawerma',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 1300,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
   {
    id: 'mulu asa be ruz',
    name: 'Mulu Asa Be Ruz',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 2500,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
   {
    id: 'doro kotelate be ruz',
    name: 'Doro Kotelate Be Ruz',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 2500,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
    {
    id: 'doro kotelate be kita',
    name: 'Doro Kotelate Be Kita',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 1300,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
    {
    id: 'chicken rapp',
    name: 'Chiken Rapp',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 500,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
    {
    id: 'tsam special burger',
    name: 'Tsam Special Burger',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 600,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
  {
    id: 'tsam special pizza',
    name: 'Tsam Special Pizza',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 600,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
  {
    id: 'dirdir burger',
    name: 'Dirdir Burger',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 1000,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
  {
    id: 'club sanduchi',
    name: 'Club Sanduchi',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 600,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
  
  
  
  
  {
    id: 'doro wet ',
    name: 'Doro Wot',
    description: 'Minced beef warmed in spiced mitmita butter — served leb leb or fully cooked.',
    price: 850,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80',
    tag: "Chef's Special",
  },
  {
    id: 'taem nigus',
    name: 'Tsam Nigus',
    description: 'Red lentils simmered in a fragrant berbere onion stew, served with injera.',
    price: 4000,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1587502537745-84b86da1204f?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
  {
    id: 'yebeg tibs',
    name: 'Yebeg Tibs',
    description: 'Silky chickpea stew bubbling in a clay pot, straight from the oven.',
    price: 600,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
  {
    id: 'tibs special',
    name: 'Tibs Special',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 1300,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },

  {
    id: 'special gomen be sega',
    name: 'Special Gomen Be Sega',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 1000,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },

  {
    id: 'normal kobo ',
    name: 'Normal Kobo',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 2000,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },

  {
    id: 'ye sega masero',
    name: 'Ye Sega Masero',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 2500,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
  {
    id: 'ye beg dulet',
    name: 'Ye Beg Dulet',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 500,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
  {
    id: 'special chikna',
    name: 'Special Chikna',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 1500,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
  {
    id: 'special kobo',
    name: 'Special Kobo',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 4000,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },

{
    id: 'tsam hageregnia',
    name: 'Tsam Hageregnia',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 4000,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
  {
    id: 'zizlzil tibs grilled',
    name: 'Zizlzil Tibs Grilled',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 2000,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
  {
    id: 'fanta fanto',
    name: 'Fanta Fanto',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 4000,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },

  /* ── Snacks ────────────────────────────────────────────── */
  {
    id: 'lamb-sambusa',
    name: 'Lamb Sambusa (3 pcs)',
    description: 'Crisp pastry parcels filled with spiced minced lamb, served with awaze dip.',
    price: 190,
    category: 'Snacks',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    tag: 'Spicy',
  },

  {
    id: 'kifli',
    name: 'Kifli',
    description: 'Flaky crescent rolls filled with mild cheese and nigella seed.',
    price: 130,
    category: 'Snacks',
    image:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegetarian',
  },
  {
    id: 'chicken-wings',
    name: 'Honey-Awaze Wings',
    description: 'Oven-roasted wings glazed in honey and awaze, with a cooling garlic dip.',
    price: 360,
    category: 'Snacks',
    image:
      'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=800&q=80',
    tag: 'Bestseller',
  },
  {
    id: 'french-fries',
    name: 'French Fries & Awaze',
    description: 'Golden skin-on fries with sea salt and our house-made awaze chilli sauce.',
    price: 160,
    category: 'Snacks',
    image:
      'https://images.unsplash.com/photo-1579208030886-b937da0925dc?auto=format&fit=crop&w=800&q=80',
  },

  /* ── Juices ────────────────────────────────────────────── */
  {
    id: 'mango-juice',
    name: 'Mango Juice',
    description: 'Fresh-blended mango with a squeeze of lime, poured over ice.',
    price: 190,
    category: 'Juices',
    image:
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
    tag: 'Bestseller',
  },
  {
    id: 'avocado-smoothie',
    name: 'Avocado Smoothie',
    description: 'Creamy avocado blended with milk, honey and a pinch of cardamom.',
    price: 230,
    category: 'Juices',
    image:
      'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'papaya-sunrise',
    name: 'Papaya Sunrise',
    description: 'Ripe papaya and orange with a zing of ginger — bright and revitalising.',
    price: 210,
    category: 'Juices',
    image:
      'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80',
    tag: 'Fresh',
  },
  {
    id: 'mixed-fruit-punch',
    name: 'Mixed Fruit Punch',
    description: 'Seasonal fruits blended with lime and a handful of fresh mint.',
    price: 240,
    category: 'Juices',
    image:
      'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'carrot-ginger',
    name: 'Carrot & Ginger',
    description: 'Cold-pressed carrot with zesty ginger and a touch of honey.',
    price: 180,
    category: 'Juices',
    image:
      'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    tag: 'Fresh Pressed',
  },
  {
    id: 'ergo be wancha',
    name: 'Ergo Be Wancha ',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 200,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },

  /* ── Hot Drinks ────────────────────────────────────────── */
  {
    id: 'coffee-ceremony',
    name: 'Traditional Coffee Ceremony',
    description: 'Beans roasted at your table and brewed in a jebena — three fragrant rounds.',
    price: 280,
    category: 'Hot Drinks',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    tag: 'Experience',
  },
  {
    id: 'macchiato',
    name: 'Ethiopian Macchiato',
    description: 'A double espresso marked with silky steamed milk.',
    price: 95,
    category: 'Hot Drinks',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'spiced-tea',
    name: 'Spiced Tea (Chai)',
    description: 'Black tea simmered with cardamom, cinnamon and fresh milk.',
    price: 75,
    category: 'Hot Drinks',
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'hot-chocolate',
    name: 'Hot Chocolate',
    description: 'Dark cocoa folded into steamed milk, dusted with cinnamon.',
    price: 120,
    category: 'Hot Drinks',
    image:
      'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80',
  },

  /* ── Drinks ────────────────────────────────────────────── */
  {
    id: 'ambo-water',
    name: 'Ambo Mineral Water',
    description: 'Naturally sparkling mineral water from the highland springs of Ambo.',
    price: 65,
    category: 'Drinks',
    image:
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    description: 'The classic 330 ml glass bottle, served ice-cold.',
    price: 70,
    category: 'Drinks',
    image:
      'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fresh-lemonade',
    name: 'Fresh Lemonade',
    description: 'Hand-squeezed lemons, mint and sparkling water over crushed ice.',
    price: 140,
    category: 'Drinks',
    image:
      'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=800&q=80',
    tag: 'House Made',
  },
  {
    id: 'bissap-hibiscus',
    name: 'Bissap Hibiscus',
    description: 'House-made hibiscus infusion with pineapple and a sprig of mint.',
    price: 130,
    category: 'Drinks',
    image:
      'https://images.unsplash.com/photo-1560508180-03f285f67ded?auto=format&fit=crop&w=800&q=80',
    tag: 'House Made',
  },
  {
    id: 'stella-lager',
    name: 'Stella Lager',
    description: "Ethiopia's crisp golden lager, served ice-cold from the bottle.",
    price: 200,
    category: 'Drinks',
    image:
      'https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&w=800&q=80',
  },
]
