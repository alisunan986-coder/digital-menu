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
  established: 2016,
  address: 'Bole Medhanialem, Church Road, Addis Ababa, Ethiopia',
  phone: '+251 911 24 86 42',
  hours: [
    { days: 'Monday – Friday', time: '6:30 AM – 10:00 PM' },
    { days: 'Saturday', time: '7:00 AM – 11:00 PM' },
    { days: 'Sunday', time: '8:00 AM – 9:00 PM' },
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
    id: 'firfir',
    name: 'Firfir',
    description: 'Injera pieces tossed in a rich berbere butter sauce — choose lamb or lentil.',
    price: 310,
    category: 'Breakfast',
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'genfo',
    name: 'Genfo',
    description: 'Thick barley porridge with a well of spiced butter and berbere, finished with honey.',
    price: 190,
    category: 'Breakfast',
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ful-medames',
    name: 'Ful Medames',
    description:
      'Slow-simmered fava beans dressed with olive oil, lemon, tomato and a whisper of chilli.',
    price: 250,
    category: 'Breakfast',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegetarian',
  },
  {
    id: 'lamb-soup',
    name: 'Lamb Soup',
    description: 'Slow-cooked lamb broth with fresh rosemary and herbs, served with warm bread.',
    price: 340,
    category: 'Breakfast',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  },

  /* ── Lunch ─────────────────────────────────────────────── */
  {
    id: 'doro-wot',
    name: 'Doro Wot',
    description: 'Chicken leg slow-braised for hours in berbere sauce, with egg, ayib and injera.',
    price: 680,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    tag: "Chef's Special",
  },
  {
    id: 'beef-tibs',
    name: 'Beef Tibs',
    description: 'Tender beef cubes seared with rosemary, jalapeño and caramelised onions.',
    price: 590,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    tag: 'Spicy',
  },
  {
    id: 'kitfo',
    name: 'Kitfo',
    description: 'Minced beef warmed in spiced mitmita butter — served leb leb or fully cooked.',
    price: 750,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80',
    tag: "Chef's Special",
  },
  {
    id: 'misir-wot',
    name: 'Misir Wot',
    description: 'Red lentils simmered in a fragrant berbere onion stew, served with injera.',
    price: 330,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1587502537745-84b86da1204f?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
  {
    id: 'shiro-tegamino',
    name: 'Shiro Tegamino',
    description: 'Silky chickpea stew bubbling in a clay pot, straight from the oven.',
    price: 310,
    category: 'Lunch',
    image:
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegan',
  },
  {
    id: 'beyaynetu',
    name: 'Beyaynetu',
    description:
      'A fasting platter of four vegetarian stews, salads and injera — entirely plant-based.',
    price: 470,
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
