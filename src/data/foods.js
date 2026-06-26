// Food database — 50+ items with kcal and protein per serving
// serving_desc = default serving description
export const FOODS = [
  // Indian staples
  { id: 'dal_chawal', keywords: ['dal chawal', 'dal rice', 'daal chawal'], name: 'Dal Chawal', kcal: 420, protein: 14, serving_desc: '1 plate' },
  { id: 'roti', keywords: ['roti', 'chapati', 'chapatti'], name: 'Roti', kcal: 80, protein: 2.5, serving_desc: '1 piece' },
  { id: 'paneer', keywords: ['paneer', 'cottage cheese indian'], name: 'Paneer (100g)', kcal: 265, protein: 18, serving_desc: '100g' },
  { id: 'paneer_curry', keywords: ['paneer curry', 'paneer masala', 'shahi paneer'], name: 'Paneer Curry', kcal: 320, protein: 16, serving_desc: '1 bowl' },
  { id: 'rajma', keywords: ['rajma', 'kidney beans', 'rajma chawal'], name: 'Rajma', kcal: 380, protein: 18, serving_desc: '1 bowl' },
  { id: 'biryani', keywords: ['biryani', 'biriyani', 'chicken biryani', 'veg biryani'], name: 'Biryani', kcal: 480, protein: 22, serving_desc: '1 plate' },
  { id: 'dosa', keywords: ['dosa', 'masala dosa', 'plain dosa'], name: 'Dosa', kcal: 200, protein: 4, serving_desc: '1 piece' },
  { id: 'idli', keywords: ['idli', 'idly'], name: 'Idli', kcal: 60, protein: 2, serving_desc: '1 piece' },
  { id: 'upma', keywords: ['upma'], name: 'Upma', kcal: 250, protein: 6, serving_desc: '1 bowl' },
  { id: 'poha', keywords: ['poha', 'pohe', 'flattened rice'], name: 'Poha', kcal: 270, protein: 5, serving_desc: '1 plate' },
  { id: 'khichdi', keywords: ['khichdi', 'khichri', 'kitchdi'], name: 'Khichdi', kcal: 350, protein: 12, serving_desc: '1 bowl' },
  { id: 'aloo_paratha', keywords: ['aloo paratha', 'aloo parantha', 'potato paratha'], name: 'Aloo Paratha', kcal: 260, protein: 5, serving_desc: '1 piece' },
  { id: 'chole', keywords: ['chole', 'chana masala', 'chickpea curry'], name: 'Chole', kcal: 350, protein: 16, serving_desc: '1 bowl' },
  { id: 'pav_bhaji', keywords: ['pav bhaji', 'pavbhaji'], name: 'Pav Bhaji', kcal: 450, protein: 12, serving_desc: '1 plate (2 pav)' },
  { id: 'samosa', keywords: ['samosa', 'samosas'], name: 'Samosa', kcal: 150, protein: 3, serving_desc: '1 piece' },
  { id: 'masala_chai', keywords: ['chai', 'masala chai', 'tea', 'milk tea'], name: 'Masala Chai', kcal: 80, protein: 2, serving_desc: '1 cup' },
  { id: 'curd_rice', keywords: ['curd rice', 'yogurt rice', 'thayir sadam'], name: 'Curd Rice', kcal: 280, protein: 8, serving_desc: '1 bowl' },
  { id: 'sambhar', keywords: ['sambhar', 'sambar'], name: 'Sambhar', kcal: 120, protein: 5, serving_desc: '1 bowl' },
  { id: 'uttapam', keywords: ['uttapam', 'uthappam'], name: 'Uttapam', kcal: 220, protein: 6, serving_desc: '1 piece' },
  { id: 'puri', keywords: ['puri', 'poori'], name: 'Puri', kcal: 110, protein: 2, serving_desc: '1 piece' },

  // International
  { id: 'eggs', keywords: ['egg', 'eggs', 'boiled egg', 'scrambled egg', 'fried egg'], name: 'Egg', kcal: 70, protein: 6, serving_desc: '1 large' },
  { id: 'oats', keywords: ['oats', 'oatmeal', 'porridge'], name: 'Oats', kcal: 300, protein: 10, serving_desc: '1 bowl (80g dry)' },
  { id: 'grilled_chicken', keywords: ['grilled chicken', 'chicken breast', 'chicken grill'], name: 'Grilled Chicken', kcal: 165, protein: 31, serving_desc: '100g' },
  { id: 'chicken_curry', keywords: ['chicken curry', 'murgh curry', 'butter chicken'], name: 'Chicken Curry', kcal: 280, protein: 22, serving_desc: '1 bowl' },
  { id: 'pasta', keywords: ['pasta', 'spaghetti', 'penne', 'noodles'], name: 'Pasta', kcal: 350, protein: 12, serving_desc: '1 bowl (cooked)' },
  { id: 'pizza', keywords: ['pizza', 'pizza slice'], name: 'Pizza', kcal: 280, protein: 12, serving_desc: '1 slice' },
  { id: 'burger', keywords: ['burger', 'hamburger', 'veggie burger'], name: 'Burger', kcal: 450, protein: 20, serving_desc: '1 burger' },
  { id: 'salmon', keywords: ['salmon', 'fish', 'grilled fish', 'baked salmon'], name: 'Salmon', kcal: 200, protein: 25, serving_desc: '100g' },
  { id: 'salad', keywords: ['salad', 'green salad', 'caesar salad'], name: 'Salad', kcal: 120, protein: 4, serving_desc: '1 bowl' },
  { id: 'protein_shake', keywords: ['protein shake', 'protein powder', 'whey', 'protein drink'], name: 'Protein Shake', kcal: 150, protein: 25, serving_desc: '1 scoop' },
  { id: 'yogurt', keywords: ['yogurt', 'curd', 'dahi', 'greek yogurt'], name: 'Yogurt', kcal: 100, protein: 10, serving_desc: '150g' },
  { id: 'banana', keywords: ['banana'], name: 'Banana', kcal: 90, protein: 1, serving_desc: '1 medium' },
  { id: 'apple', keywords: ['apple'], name: 'Apple', kcal: 80, protein: 0.4, serving_desc: '1 medium' },
  { id: 'orange', keywords: ['orange', 'mosambi'], name: 'Orange', kcal: 62, protein: 1.2, serving_desc: '1 medium' },
  { id: 'mango', keywords: ['mango', 'aam'], name: 'Mango', kcal: 100, protein: 0.8, serving_desc: '1 cup sliced' },
  { id: 'mixed_nuts', keywords: ['nuts', 'mixed nuts', 'almonds', 'cashews', 'walnuts'], name: 'Mixed Nuts', kcal: 170, protein: 5, serving_desc: '30g' },
  { id: 'bread', keywords: ['bread', 'toast', 'whole wheat bread'], name: 'Bread (slice)', kcal: 80, protein: 3, serving_desc: '1 slice' },
  { id: 'rice', keywords: ['cooked rice', 'white rice', 'brown rice', 'steamed rice', 'plain rice'], name: 'Cooked Rice', kcal: 200, protein: 4, serving_desc: '1 cup cooked' },
  { id: 'puffed_rice', keywords: ['puffed rice', 'murmura', 'kurmura', 'murmure', 'bhel'], name: 'Puffed Rice', kcal: 60, protein: 1, serving_desc: '1 cup (15g)' },
  { id: 'sandwich', keywords: ['sandwich', 'sub', 'wrap'], name: 'Sandwich', kcal: 320, protein: 14, serving_desc: '1 sandwich' },
  { id: 'coffee', keywords: ['coffee', 'latte', 'cappuccino', 'americano'], name: 'Coffee (with milk)', kcal: 60, protein: 2, serving_desc: '1 cup' },
  { id: 'milk', keywords: ['milk', 'glass of milk', 'doodh'], name: 'Milk', kcal: 150, protein: 8, serving_desc: '250ml' },
  { id: 'sweet', keywords: ['mithai', 'gulab jamun', 'barfi', 'halwa', 'sweet', 'ladoo'], name: 'Indian Sweet', kcal: 200, protein: 3, serving_desc: '1 piece' },
  { id: 'soup', keywords: ['soup', 'tomato soup', 'veg soup'], name: 'Soup', kcal: 100, protein: 4, serving_desc: '1 bowl' },
  { id: 'chocolate', keywords: ['chocolate', 'dark chocolate', 'milk chocolate'], name: 'Chocolate', kcal: 150, protein: 2, serving_desc: '30g' },
  { id: 'ice_cream', keywords: ['ice cream', 'icecream', 'kulfi'], name: 'Ice Cream', kcal: 200, protein: 3, serving_desc: '1 scoop' },
  { id: 'fruit_juice', keywords: ['juice', 'fruit juice', 'orange juice', 'apple juice'], name: 'Fruit Juice', kcal: 110, protein: 0.5, serving_desc: '250ml' },
  { id: 'tofu', keywords: ['tofu', 'soya'], name: 'Tofu', kcal: 80, protein: 8, serving_desc: '100g' },
  { id: 'dal_makhani', keywords: ['dal makhani', 'makhani dal'], name: 'Dal Makhani', kcal: 380, protein: 14, serving_desc: '1 bowl' },
  { id: 'dahi_rice', keywords: ['dahi rice', 'curd rice'], name: 'Dahi Rice', kcal: 280, protein: 8, serving_desc: '1 bowl' },
  { id: 'sprouts', keywords: ['sprouts', 'moong sprouts', 'bean sprouts'], name: 'Sprouts', kcal: 90, protein: 8, serving_desc: '1 cup' },
]

// Quantity multipliers for parsing
export const QTY_PATTERNS = [
  { pattern: /(\d+\.?\d*)\s*(plate|plates)/i, multi: (n) => n },
  { pattern: /(\d+\.?\d*)\s*(bowl|bowls)/i, multi: (n) => n },
  { pattern: /(\d+\.?\d*)\s*(cup|cups)/i, multi: (n) => n },
  { pattern: /(\d+\.?\d*)\s*(slice|slices|piece|pieces|pcs)/i, multi: (n) => n },
  { pattern: /(\d+\.?\d*)\s*(scoop|scoops)/i, multi: (n) => n },
  { pattern: /(\d+\.?\d*)\s*(g|gm|gram|grams)/i, multi: (n) => n / 100 },
  { pattern: /(\d+\.?\d*)\s*(kg)/i, multi: (n) => n * 10 },
  { pattern: /half/i, multi: () => 0.5 },
  { pattern: /large/i, multi: () => 1.5 },
  { pattern: /medium/i, multi: () => 1 },
  { pattern: /small/i, multi: () => 0.7 },
  { pattern: /^(\d+)\s/i, multi: (n) => n },
  { pattern: /\s(\d+)\s/i, multi: (n) => n },
]

export function parseFood(text) {
  const lower = text.toLowerCase().trim()

  // Find matching food (longest keyword match wins)
  let bestMatch = null
  let bestKeywordLen = 0

  for (const food of FOODS) {
    for (const kw of food.keywords) {
      if (lower.includes(kw) && kw.length > bestKeywordLen) {
        bestMatch = food
        bestKeywordLen = kw.length
      }
    }
  }

  if (!bestMatch) return null

  // Extract quantity
  let qty = 1
  for (const { pattern, multi } of QTY_PATTERNS) {
    const match = lower.match(pattern)
    if (match) {
      const n = parseFloat(match[1] || 1)
      qty = multi(n)
      break
    }
  }

  qty = Math.max(0.25, Math.min(qty, 20))

  return {
    food: bestMatch,
    qty,
    kcal: Math.round(bestMatch.kcal * qty),
    protein: Math.round(bestMatch.protein * qty * 10) / 10,
    description: `${qty !== 1 ? qty + '× ' : ''}${bestMatch.name}`,
  }
}

export const QUICK_PICKS = [
  'dal chawal', 'roti', '2 eggs', 'oats', 'grilled chicken', 'banana', 'protein shake', 'yogurt'
]

export function guessMeal() {
  const h = new Date().getHours()
  if (h < 10) return 'breakfast'
  if (h < 13) return 'breakfast'
  if (h < 15) return 'lunch'
  if (h < 18) return 'snack'
  return 'dinner'
}
