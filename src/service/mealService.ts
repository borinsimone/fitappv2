// src/services/mealService.ts
import { Meal } from "../pages/Meal/types/meal";

const MEALS_STORAGE_KEY = "fitapp_meals";

// Ottieni tutti i pasti
export const getMeals = (): Meal[] => {
  const mealsJson = localStorage.getItem(MEALS_STORAGE_KEY);
  return mealsJson ? JSON.parse(mealsJson) : [];
};

// Salva un nuovo pasto
export const saveMeal = (meal: Meal): void => {
  const meals = getMeals();
  meals.push(meal);
  localStorage.setItem(
    MEALS_STORAGE_KEY,
    JSON.stringify(meals)
  );
};

// Aggiorna un pasto esistente
export const updateMeal = (updatedMeal: Meal): void => {
  const meals = getMeals();
  const updatedMeals = meals.map((meal) =>
    meal.id === updatedMeal.id ? updatedMeal : meal
  );
  localStorage.setItem(
    MEALS_STORAGE_KEY,
    JSON.stringify(updatedMeals)
  );
};

// Elimina un pasto
export const deleteMeal = (mealId: string): void => {
  const meals = getMeals();
  const filteredMeals = meals.filter(
    (meal) => meal.id !== mealId
  );
  localStorage.setItem(
    MEALS_STORAGE_KEY,
    JSON.stringify(filteredMeals)
  );
};

// Ottieni pasti per data
export const getMealsByDate = (date: Date): Meal[] => {
  const meals = getMeals();
  const dateString = date.toISOString().split("T")[0];
  return meals.filter((meal) => meal.date === dateString);
};
