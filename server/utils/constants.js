export const CATEGORIES = [
  { value: 'dresses', label: 'Dresses' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'bags', label: 'Bags' },
  { value: 'home-decor', label: 'Home Decor' },
  { value: 'beauty', label: 'Beauty' },
];

export const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);

// Which categories complete an outfit built around a given category — powers MUSE Studio.
export const CATEGORY_PAIRINGS = {
  dresses: ['jewelry', 'shoes', 'bags'],
  shoes: ['dresses', 'bags', 'jewelry'],
  jewelry: ['dresses', 'bags', 'shoes'],
  bags: ['dresses', 'shoes', 'jewelry'],
  'home-decor': ['beauty'],
  beauty: ['home-decor', 'jewelry'],
};

export const SUB_ORDER_STATUSES = [
  'pending_payment',
  'placed',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
];
