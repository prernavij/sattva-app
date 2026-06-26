// Food database — kcal, protein, carbs, fat per serving
// serving_desc = default serving description
export const FOODS = [
  // ── Eggs ──────────────────────────────────────────────────
  { id: 'egg', keywords: ['egg','eggs','boiled egg','hard boiled egg','soft boiled egg','poached egg'], name: 'Egg', kcal: 70, protein: 6, carbs: 0.5, fat: 5, serving_desc: '1 large' },
  { id: 'fried_egg', keywords: ['fried egg','sunny side egg'], name: 'Fried Egg', kcal: 90, protein: 6, carbs: 0.5, fat: 7, serving_desc: '1 large' },
  { id: 'scrambled_egg', keywords: ['scrambled egg','scrambled eggs'], name: 'Scrambled Eggs', kcal: 100, protein: 7, carbs: 1, fat: 7, serving_desc: '2 eggs' },
  { id: 'omelette', keywords: ['omelette','omelet','plain omelette'], name: 'Omelette', kcal: 150, protein: 10, carbs: 1, fat: 11, serving_desc: '2 eggs' },
  { id: 'egg_white', keywords: ['egg white','egg whites'], name: 'Egg White', kcal: 17, protein: 3.6, carbs: 0.2, fat: 0, serving_desc: '1 large' },

  // ── Dairy ─────────────────────────────────────────────────
  { id: 'milk', keywords: ['milk','glass of milk','doodh','whole milk'], name: 'Milk', kcal: 150, protein: 8, carbs: 12, fat: 8, serving_desc: '250ml' },
  { id: 'skim_milk', keywords: ['skim milk','skimmed milk','low fat milk'], name: 'Skimmed Milk', kcal: 90, protein: 9, carbs: 12, fat: 0.5, serving_desc: '250ml' },
  { id: 'yogurt', keywords: ['yogurt','curd','dahi','plain yogurt'], name: 'Yogurt', kcal: 100, protein: 10, carbs: 8, fat: 2, serving_desc: '150g' },
  { id: 'greek_yogurt', keywords: ['greek yogurt','greek curd'], name: 'Greek Yogurt', kcal: 130, protein: 17, carbs: 6, fat: 3.5, serving_desc: '150g' },
  { id: 'paneer', keywords: ['paneer','cottage cheese indian'], name: 'Paneer', kcal: 265, protein: 18, carbs: 2, fat: 21, serving_desc: '100g' },
  { id: 'cheese', keywords: ['cheese','cheddar','processed cheese'], name: 'Cheese', kcal: 110, protein: 7, carbs: 0.5, fat: 9, serving_desc: '30g slice' },
  { id: 'butter', keywords: ['butter','salted butter'], name: 'Butter', kcal: 102, protein: 0.1, carbs: 0, fat: 11.5, serving_desc: '1 tbsp (14g)' },
  { id: 'ghee', keywords: ['ghee','clarified butter'], name: 'Ghee', kcal: 112, protein: 0, carbs: 0, fat: 13, serving_desc: '1 tbsp' },
  { id: 'cream', keywords: ['cream','heavy cream','whipped cream'], name: 'Cream', kcal: 52, protein: 0.4, carbs: 0.4, fat: 5.5, serving_desc: '1 tbsp' },

  // ── Breads & Grains ───────────────────────────────────────
  { id: 'bread', keywords: ['bread','toast','white bread','slice of bread','bread slice'], name: 'Bread', kcal: 80, protein: 3, carbs: 15, fat: 1, serving_desc: '1 slice' },
  { id: 'whole_wheat_bread', keywords: ['whole wheat bread','brown bread','wholegrain bread','multigrain bread'], name: 'Whole Wheat Bread', kcal: 70, protein: 3.5, carbs: 13, fat: 1, serving_desc: '1 slice' },
  { id: 'oats', keywords: ['oats','oatmeal','porridge','rolled oats'], name: 'Oats', kcal: 300, protein: 10, carbs: 54, fat: 5, serving_desc: '1 bowl (80g dry)' },
  { id: 'rice', keywords: ['cooked rice','white rice','brown rice','steamed rice','plain rice','basmati rice'], name: 'Cooked Rice', kcal: 200, protein: 4, carbs: 45, fat: 0.4, serving_desc: '1 cup (186g)' },
  { id: 'puffed_rice', keywords: ['puffed rice','murmura','kurmura','murmure','bhel'], name: 'Puffed Rice', kcal: 60, protein: 1, carbs: 13, fat: 0.2, serving_desc: '1 cup (15g)' },
  { id: 'cornflakes', keywords: ['cornflakes','corn flakes','cereal'], name: 'Cornflakes', kcal: 110, protein: 2, carbs: 25, fat: 0.3, serving_desc: '30g' },
  { id: 'granola', keywords: ['granola','muesli'], name: 'Granola', kcal: 200, protein: 4, carbs: 34, fat: 6, serving_desc: '50g' },
  { id: 'pasta', keywords: ['pasta','spaghetti','penne','noodles','macaroni'], name: 'Pasta', kcal: 350, protein: 12, carbs: 65, fat: 2, serving_desc: '1 bowl cooked (200g)' },
  { id: 'roti', keywords: ['roti','chapati','chapatti','phulka'], name: 'Roti', kcal: 80, protein: 2.5, carbs: 15, fat: 1, serving_desc: '1 piece' },
  { id: 'paratha', keywords: ['paratha','parantha','plain paratha'], name: 'Paratha', kcal: 200, protein: 4, carbs: 28, fat: 8, serving_desc: '1 piece' },
  { id: 'aloo_paratha', keywords: ['aloo paratha','aloo parantha','potato paratha'], name: 'Aloo Paratha', kcal: 260, protein: 5, carbs: 38, fat: 9, serving_desc: '1 piece' },
  { id: 'puri', keywords: ['puri','poori'], name: 'Puri', kcal: 110, protein: 2, carbs: 14, fat: 5, serving_desc: '1 piece' },
  { id: 'naan', keywords: ['naan','butter naan','plain naan'], name: 'Naan', kcal: 260, protein: 8, carbs: 45, fat: 5, serving_desc: '1 piece' },
  { id: 'bagel', keywords: ['bagel'], name: 'Bagel', kcal: 245, protein: 10, carbs: 48, fat: 1.5, serving_desc: '1 medium' },
  { id: 'tortilla', keywords: ['tortilla','wrap','flour tortilla'], name: 'Tortilla', kcal: 130, protein: 3.5, carbs: 24, fat: 2.5, serving_desc: '1 medium' },

  // ── Spreads & Condiments ──────────────────────────────────
  { id: 'peanut_butter', keywords: ['peanut butter','peanut butter spread'], name: 'Peanut Butter', kcal: 94, protein: 4, carbs: 3, fat: 8, serving_desc: '1 tbsp (16g)' },
  { id: 'almond_butter', keywords: ['almond butter'], name: 'Almond Butter', kcal: 98, protein: 3.4, carbs: 3, fat: 9, serving_desc: '1 tbsp' },
  { id: 'jam', keywords: ['jam','jelly','fruit jam','strawberry jam'], name: 'Jam', kcal: 56, protein: 0.1, carbs: 14, fat: 0, serving_desc: '1 tbsp' },
  { id: 'honey', keywords: ['honey'], name: 'Honey', kcal: 64, protein: 0.1, carbs: 17, fat: 0, serving_desc: '1 tbsp' },
  { id: 'nutella', keywords: ['nutella','chocolate spread','hazelnut spread'], name: 'Nutella', kcal: 100, protein: 1.5, carbs: 11, fat: 6, serving_desc: '1 tbsp' },
  { id: 'hummus', keywords: ['hummus','houmous'], name: 'Hummus', kcal: 70, protein: 2.5, carbs: 6, fat: 4.5, serving_desc: '2 tbsp (30g)' },
  { id: 'mayo', keywords: ['mayo','mayonnaise'], name: 'Mayo', kcal: 94, protein: 0.1, carbs: 0.1, fat: 10, serving_desc: '1 tbsp' },
  { id: 'olive_oil', keywords: ['olive oil'], name: 'Olive Oil', kcal: 119, protein: 0, carbs: 0, fat: 13.5, serving_desc: '1 tbsp' },
  { id: 'coconut_oil', keywords: ['coconut oil'], name: 'Coconut Oil', kcal: 117, protein: 0, carbs: 0, fat: 14, serving_desc: '1 tbsp' },

  // ── Proteins ──────────────────────────────────────────────
  { id: 'chicken_breast', keywords: ['chicken breast','grilled chicken','boiled chicken','baked chicken'], name: 'Chicken Breast', kcal: 165, protein: 31, carbs: 0, fat: 3.6, serving_desc: '100g' },
  { id: 'chicken_thigh', keywords: ['chicken thigh'], name: 'Chicken Thigh', kcal: 209, protein: 26, carbs: 0, fat: 11, serving_desc: '100g' },
  { id: 'chicken_curry', keywords: ['chicken curry','murgh curry','butter chicken','chicken masala'], name: 'Chicken Curry', kcal: 280, protein: 22, carbs: 8, fat: 14, serving_desc: '1 bowl' },
  { id: 'chicken_biryani', keywords: ['chicken biryani','biryani'], name: 'Chicken Biryani', kcal: 480, protein: 22, carbs: 60, fat: 14, serving_desc: '1 plate' },
  { id: 'salmon', keywords: ['salmon','grilled salmon','baked salmon'], name: 'Salmon', kcal: 200, protein: 25, carbs: 0, fat: 11, serving_desc: '100g' },
  { id: 'tuna', keywords: ['tuna','canned tuna'], name: 'Tuna', kcal: 132, protein: 29, carbs: 0, fat: 1, serving_desc: '100g' },
  { id: 'fish', keywords: ['fish','grilled fish','fried fish','fish fry'], name: 'Fish (generic)', kcal: 150, protein: 22, carbs: 0, fat: 6, serving_desc: '100g' },
  { id: 'shrimp', keywords: ['shrimp','prawns','prawn'], name: 'Shrimp/Prawns', kcal: 99, protein: 24, carbs: 0, fat: 1, serving_desc: '100g' },
  { id: 'tofu', keywords: ['tofu','soya tofu'], name: 'Tofu', kcal: 80, protein: 8, carbs: 2, fat: 4, serving_desc: '100g' },
  { id: 'tempeh', keywords: ['tempeh'], name: 'Tempeh', kcal: 195, protein: 19, carbs: 9, fat: 11, serving_desc: '100g' },
  { id: 'protein_shake', keywords: ['protein shake','protein powder','whey','protein drink','whey shake'], name: 'Protein Shake', kcal: 150, protein: 25, carbs: 5, fat: 2, serving_desc: '1 scoop' },
  { id: 'protein_bar', keywords: ['protein bar','energy bar'], name: 'Protein Bar', kcal: 200, protein: 20, carbs: 22, fat: 6, serving_desc: '1 bar (60g)' },

  // ── Indian Dishes ─────────────────────────────────────────
  { id: 'dal_chawal', keywords: ['dal chawal','dal rice','daal chawal','daal rice'], name: 'Dal Chawal', kcal: 420, protein: 14, carbs: 78, fat: 5, serving_desc: '1 plate' },
  { id: 'dal_tadka', keywords: ['dal tadka','tarka dal','yellow dal'], name: 'Dal Tadka', kcal: 180, protein: 9, carbs: 28, fat: 5, serving_desc: '1 bowl' },
  { id: 'dal_makhani', keywords: ['dal makhani','makhani dal','black dal'], name: 'Dal Makhani', kcal: 380, protein: 14, carbs: 42, fat: 16, serving_desc: '1 bowl' },
  { id: 'rajma', keywords: ['rajma','kidney beans curry','rajma chawal'], name: 'Rajma', kcal: 380, protein: 18, carbs: 55, fat: 8, serving_desc: '1 bowl' },
  { id: 'chole', keywords: ['chole','chana masala','chickpea curry','chhole'], name: 'Chole', kcal: 350, protein: 16, carbs: 48, fat: 9, serving_desc: '1 bowl' },
  { id: 'paneer_curry', keywords: ['paneer curry','paneer masala','shahi paneer','paneer tikka masala'], name: 'Paneer Curry', kcal: 320, protein: 16, carbs: 10, fat: 22, serving_desc: '1 bowl' },
  { id: 'palak_paneer', keywords: ['palak paneer','spinach paneer'], name: 'Palak Paneer', kcal: 280, protein: 14, carbs: 10, fat: 19, serving_desc: '1 bowl' },
  { id: 'dosa', keywords: ['dosa','plain dosa'], name: 'Dosa', kcal: 200, protein: 4, carbs: 35, fat: 5, serving_desc: '1 piece' },
  { id: 'masala_dosa', keywords: ['masala dosa'], name: 'Masala Dosa', kcal: 320, protein: 7, carbs: 55, fat: 9, serving_desc: '1 piece' },
  { id: 'idli', keywords: ['idli','idly'], name: 'Idli', kcal: 60, protein: 2, carbs: 12, fat: 0.4, serving_desc: '1 piece' },
  { id: 'upma', keywords: ['upma'], name: 'Upma', kcal: 250, protein: 6, carbs: 38, fat: 8, serving_desc: '1 bowl' },
  { id: 'poha', keywords: ['poha','pohe','flattened rice'], name: 'Poha', kcal: 270, protein: 5, carbs: 50, fat: 6, serving_desc: '1 plate' },
  { id: 'khichdi', keywords: ['khichdi','khichri','kitchdi'], name: 'Khichdi', kcal: 350, protein: 12, carbs: 60, fat: 7, serving_desc: '1 bowl' },
  { id: 'uttapam', keywords: ['uttapam','uthappam'], name: 'Uttapam', kcal: 220, protein: 6, carbs: 36, fat: 6, serving_desc: '1 piece' },
  { id: 'sambar', keywords: ['sambhar','sambar'], name: 'Sambar', kcal: 120, protein: 5, carbs: 18, fat: 3, serving_desc: '1 bowl' },
  { id: 'curd_rice', keywords: ['curd rice','yogurt rice','thayir sadam','dahi rice'], name: 'Curd Rice', kcal: 280, protein: 8, carbs: 48, fat: 5, serving_desc: '1 bowl' },
  { id: 'pav_bhaji', keywords: ['pav bhaji','pavbhaji'], name: 'Pav Bhaji', kcal: 450, protein: 12, carbs: 62, fat: 16, serving_desc: '1 plate (2 pav)' },
  { id: 'samosa', keywords: ['samosa','samosas'], name: 'Samosa', kcal: 150, protein: 3, carbs: 18, fat: 7, serving_desc: '1 piece' },
  { id: 'vada', keywords: ['vada','medu vada','urad vada'], name: 'Vada', kcal: 100, protein: 3, carbs: 12, fat: 5, serving_desc: '1 piece' },
  { id: 'pakora', keywords: ['pakora','pakoda','fritter'], name: 'Pakora', kcal: 80, protein: 2, carbs: 10, fat: 4, serving_desc: '1 piece' },

  // ── Legumes & Pulses ──────────────────────────────────────
  { id: 'chickpeas', keywords: ['chickpeas','chana','boiled chickpeas','kabuli chana'], name: 'Chickpeas', kcal: 164, protein: 9, carbs: 27, fat: 2.6, serving_desc: '100g cooked' },
  { id: 'lentils', keywords: ['lentils','boiled lentils','masoor'], name: 'Lentils', kcal: 116, protein: 9, carbs: 20, fat: 0.4, serving_desc: '100g cooked' },
  { id: 'black_beans', keywords: ['black beans'], name: 'Black Beans', kcal: 130, protein: 8.9, carbs: 24, fat: 0.5, serving_desc: '100g cooked' },
  { id: 'kidney_beans', keywords: ['kidney beans','rajma beans'], name: 'Kidney Beans', kcal: 127, protein: 8.7, carbs: 23, fat: 0.5, serving_desc: '100g cooked' },
  { id: 'sprouts', keywords: ['sprouts','moong sprouts','bean sprouts','moong'], name: 'Sprouts', kcal: 90, protein: 8, carbs: 12, fat: 1, serving_desc: '1 cup (100g)' },
  { id: 'edamame', keywords: ['edamame','soy beans'], name: 'Edamame', kcal: 122, protein: 11, carbs: 9, fat: 5, serving_desc: '100g' },

  // ── Vegetables ────────────────────────────────────────────
  { id: 'spinach', keywords: ['spinach','palak'], name: 'Spinach', kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving_desc: '100g' },
  { id: 'broccoli', keywords: ['broccoli'], name: 'Broccoli', kcal: 34, protein: 2.8, carbs: 7, fat: 0.4, serving_desc: '100g' },
  { id: 'potato', keywords: ['potato','boiled potato','aloo'], name: 'Potato', kcal: 130, protein: 3, carbs: 30, fat: 0.1, serving_desc: '1 medium (150g)' },
  { id: 'sweet_potato', keywords: ['sweet potato','shakarkandi'], name: 'Sweet Potato', kcal: 112, protein: 2, carbs: 26, fat: 0.1, serving_desc: '1 medium (130g)' },
  { id: 'carrot', keywords: ['carrot','gajar'], name: 'Carrot', kcal: 41, protein: 1, carbs: 10, fat: 0.2, serving_desc: '1 medium (80g)' },
  { id: 'tomato', keywords: ['tomato','tamatar'], name: 'Tomato', kcal: 22, protein: 1, carbs: 5, fat: 0.2, serving_desc: '1 medium' },
  { id: 'cucumber', keywords: ['cucumber','kheera'], name: 'Cucumber', kcal: 16, protein: 0.7, carbs: 4, fat: 0.1, serving_desc: '100g' },

  // ── Fruits ────────────────────────────────────────────────
  { id: 'banana', keywords: ['banana','kela'], name: 'Banana', kcal: 90, protein: 1.1, carbs: 23, fat: 0.3, serving_desc: '1 medium' },
  { id: 'apple', keywords: ['apple','seb'], name: 'Apple', kcal: 80, protein: 0.4, carbs: 21, fat: 0.2, serving_desc: '1 medium' },
  { id: 'orange', keywords: ['orange','mosambi','santra'], name: 'Orange', kcal: 62, protein: 1.2, carbs: 15, fat: 0.2, serving_desc: '1 medium' },
  { id: 'mango', keywords: ['mango','aam'], name: 'Mango', kcal: 100, protein: 0.8, carbs: 25, fat: 0.4, serving_desc: '1 cup sliced' },
  { id: 'grapes', keywords: ['grapes','angoor'], name: 'Grapes', kcal: 104, protein: 1.1, carbs: 27, fat: 0.2, serving_desc: '1 cup (150g)' },
  { id: 'strawberry', keywords: ['strawberry','strawberries'], name: 'Strawberries', kcal: 49, protein: 1, carbs: 12, fat: 0.5, serving_desc: '1 cup (150g)' },
  { id: 'blueberry', keywords: ['blueberry','blueberries'], name: 'Blueberries', kcal: 84, protein: 1.1, carbs: 21, fat: 0.5, serving_desc: '1 cup (148g)' },
  { id: 'watermelon', keywords: ['watermelon','tarbuj'], name: 'Watermelon', kcal: 85, protein: 1.7, carbs: 21, fat: 0.4, serving_desc: '2 cups diced' },
  { id: 'papaya', keywords: ['papaya','papita'], name: 'Papaya', kcal: 55, protein: 0.6, carbs: 14, fat: 0.1, serving_desc: '1 cup' },

  // ── Nuts & Seeds ──────────────────────────────────────────
  { id: 'almonds', keywords: ['almonds','badam'], name: 'Almonds', kcal: 170, protein: 6, carbs: 6, fat: 15, serving_desc: '30g (~23 nuts)' },
  { id: 'cashews', keywords: ['cashews','kaju'], name: 'Cashews', kcal: 157, protein: 5, carbs: 9, fat: 12, serving_desc: '30g' },
  { id: 'walnuts', keywords: ['walnuts','akhrot'], name: 'Walnuts', kcal: 185, protein: 4.3, carbs: 4, fat: 18.5, serving_desc: '30g' },
  { id: 'peanuts', keywords: ['peanuts','groundnuts','moongphali'], name: 'Peanuts', kcal: 166, protein: 7.5, carbs: 6, fat: 14, serving_desc: '30g' },
  { id: 'mixed_nuts', keywords: ['mixed nuts','trail mix'], name: 'Mixed Nuts', kcal: 170, protein: 5, carbs: 7, fat: 15, serving_desc: '30g' },
  { id: 'chia_seeds', keywords: ['chia seeds','chia'], name: 'Chia Seeds', kcal: 58, protein: 2, carbs: 5, fat: 3.7, serving_desc: '1 tbsp (12g)' },
  { id: 'flax_seeds', keywords: ['flax seeds','flaxseed','alsi'], name: 'Flax Seeds', kcal: 55, protein: 1.9, carbs: 3, fat: 4.3, serving_desc: '1 tbsp' },

  // ── Beverages ─────────────────────────────────────────────
  { id: 'masala_chai', keywords: ['chai','masala chai','tea','milk tea','chai tea'], name: 'Masala Chai', kcal: 80, protein: 2, carbs: 12, fat: 2, serving_desc: '1 cup' },
  { id: 'black_tea', keywords: ['black tea','plain tea'], name: 'Black Tea', kcal: 5, protein: 0, carbs: 1, fat: 0, serving_desc: '1 cup' },
  { id: 'coffee', keywords: ['coffee','black coffee','americano'], name: 'Black Coffee', kcal: 5, protein: 0.3, carbs: 1, fat: 0, serving_desc: '1 cup' },
  { id: 'latte', keywords: ['latte','cappuccino','flat white','coffee with milk'], name: 'Latte', kcal: 120, protein: 6, carbs: 12, fat: 5, serving_desc: '1 cup (250ml)' },
  { id: 'coconut_water', keywords: ['coconut water','nariyal pani'], name: 'Coconut Water', kcal: 46, protein: 1.7, carbs: 9, fat: 0.5, serving_desc: '250ml' },
  { id: 'orange_juice', keywords: ['orange juice','fruit juice','mosambi juice'], name: 'Orange Juice', kcal: 110, protein: 1.7, carbs: 26, fat: 0.5, serving_desc: '250ml' },
  { id: 'protein_smoothie', keywords: ['smoothie','protein smoothie','fruit smoothie'], name: 'Smoothie', kcal: 250, protein: 15, carbs: 35, fat: 4, serving_desc: '1 glass (350ml)' },

  // ── Snacks & Others ───────────────────────────────────────
  { id: 'avocado', keywords: ['avocado'], name: 'Avocado', kcal: 160, protein: 2, carbs: 9, fat: 15, serving_desc: '1/2 medium' },
  { id: 'avocado_toast', keywords: ['avocado toast'], name: 'Avocado Toast', kcal: 240, protein: 5, carbs: 24, fat: 16, serving_desc: '1 slice' },
  { id: 'pizza', keywords: ['pizza','pizza slice'], name: 'Pizza', kcal: 280, protein: 12, carbs: 34, fat: 10, serving_desc: '1 slice' },
  { id: 'burger', keywords: ['burger','hamburger'], name: 'Burger', kcal: 450, protein: 20, carbs: 45, fat: 18, serving_desc: '1 burger' },
  { id: 'sandwich', keywords: ['sandwich','sub'], name: 'Sandwich', kcal: 320, protein: 14, carbs: 38, fat: 10, serving_desc: '1 sandwich' },
  { id: 'salad', keywords: ['salad','green salad','mixed salad'], name: 'Salad', kcal: 120, protein: 4, carbs: 14, fat: 5, serving_desc: '1 bowl' },
  { id: 'caesar_salad', keywords: ['caesar salad'], name: 'Caesar Salad', kcal: 200, protein: 6, carbs: 10, fat: 16, serving_desc: '1 bowl' },
  { id: 'soup', keywords: ['soup','tomato soup','veg soup','vegetable soup'], name: 'Soup', kcal: 100, protein: 4, carbs: 14, fat: 3, serving_desc: '1 bowl' },
  { id: 'chips', keywords: ['chips','crisps','potato chips','lays'], name: 'Chips', kcal: 150, protein: 2, carbs: 15, fat: 9, serving_desc: '1 small bag (28g)' },
  { id: 'biscuits', keywords: ['biscuits','cookies','digestive'], name: 'Biscuits', kcal: 70, protein: 1, carbs: 10, fat: 3, serving_desc: '2 biscuits' },
  { id: 'chocolate', keywords: ['chocolate','dark chocolate','milk chocolate'], name: 'Chocolate', kcal: 150, protein: 2, carbs: 17, fat: 9, serving_desc: '30g' },
  { id: 'ice_cream', keywords: ['ice cream','icecream','kulfi'], name: 'Ice Cream', kcal: 200, protein: 3, carbs: 24, fat: 10, serving_desc: '1 scoop (100g)' },
  { id: 'kheer', keywords: ['kheer','rice pudding','payasam'], name: 'Kheer', kcal: 220, protein: 5, carbs: 38, fat: 6, serving_desc: '1 bowl' },
  { id: 'gulab_jamun', keywords: ['gulab jamun','mithai','sweet','ladoo','barfi','halwa'], name: 'Indian Sweet', kcal: 200, protein: 3, carbs: 32, fat: 7, serving_desc: '1 piece' },
]

// ── Lookup ─────────────────────────────────────────────────────────────────
// Returns ALL matching food components found in the query text, summed.
// Handles compound queries like "toast with peanut butter" → bread + peanut butter
export function parseFood(text, qty = 1) {
  const lower = text.toLowerCase().trim()

  // Score each food: longest matching keyword wins per food
  const matched = []
  for (const food of FOODS) {
    let bestLen = 0
    for (const kw of food.keywords) {
      if (lower.includes(kw) && kw.length > bestLen) bestLen = kw.length
    }
    if (bestLen > 0) matched.push({ food, score: bestLen })
  }

  if (!matched.length) return null

  // For compound queries, keep top matches that don't overlap each other's keywords
  // Simple heuristic: keep all matches whose keywords are found in the text
  // Sort by score desc, dedupe by food id
  const seen = new Set()
  const components = matched
    .sort((a, b) => b.score - a.score)
    .filter(m => { if (seen.has(m.food.id)) return false; seen.add(m.food.id); return true })

  // Limit to top 3 components to avoid over-matching
  const top = components.slice(0, 3)

  const totalKcal = Math.round(top.reduce((s, m) => s + m.food.kcal * qty, 0))
  const totalProtein = Math.round(top.reduce((s, m) => s + m.food.protein * qty, 0) * 10) / 10
  const totalCarbs = Math.round(top.reduce((s, m) => s + m.food.carbs * qty, 0))
  const totalFat = Math.round(top.reduce((s, m) => s + m.food.fat * qty, 0))
  const name = top.map(m => m.food.name).join(' + ')

  return {
    name,
    kcal: totalKcal,
    protein: totalProtein,
    carbs: totalCarbs,
    fat: totalFat,
    items: top.map(m => m.food),
    source: 'db',
  }
}

export const QUICK_PICKS = [
  'dal chawal', '2 eggs', 'roti', 'oats', 'grilled chicken',
  'banana', 'protein shake', 'yogurt', 'avocado toast', 'idli',
]

export function guessMeal() {
  const h = new Date().getHours()
  if (h < 10) return 'breakfast'
  if (h < 14) return 'lunch'
  if (h < 18) return 'snack'
  return 'dinner'
}
