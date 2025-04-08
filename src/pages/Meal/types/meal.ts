// src/types/meal.ts
export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  quantity: number; // in grammi o unità
  calories: number; // per 100g o per unità
  protein: number; // in grammi
  carbs: number; // in grammi
  fat: number; // in grammi
  image?: string; // URL dell'immagine
  barcode?: string;
}

export interface Meal {
  id: string;
  userId: string;
  name: string; // es. "Colazione", "Pranzo", ecc.
  date: string; // ISO string
  time: string; // es. "08:30"
  foodItems: FoodItem[];
  notes?: string;
  tags?: string[];
}

// Calcoli helper
export const calculateMealTotals = (meal: Meal) => {
  return meal.foodItems.reduce(
    (totals, item) => {
      const multiplier = item.quantity / 100; // Conversione da 100g alla quantità effettiva
      return {
        calories: totals.calories + item.calories * multiplier,
        protein: totals.protein + item.protein * multiplier,
        carbs: totals.carbs + item.carbs * multiplier,
        fat: totals.fat + item.fat * multiplier,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};
