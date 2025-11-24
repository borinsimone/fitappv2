// src/pages/Meal/MealPlannerPage.tsx
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { isSameDay } from "date-fns";
import DailyMeals from "./DailyMeals";
import AddMealForm from "./AddMealForm";
import { Meal } from "./types/meal";
import { PageContainer, MainContent } from "./MealStyles";
import MealAgenda from "./components/agenda/MealAgenda";

const MealPlannerPage: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMealId, setEditingMealId] = useState<
    string | null
  >(null);

  // Filtra i pasti per la data selezionata
  const mealsForSelectedDate = meals.filter((meal) =>
    isSameDay(new Date(meal.date), selectedDate)
  );

  // Aggiungi un nuovo pasto
  const handleSaveMeal = (meal: Meal) => {
    if (editingMealId) {
      // Aggiornamento del pasto esistente
      setMeals((prev) =>
        prev.map((m) => (m.id === editingMealId ? meal : m))
      );
      setEditingMealId(null);
    } else {
      // Aggiunta di un nuovo pasto
      setMeals((prev) => [...prev, meal]);
    }
    setShowAddForm(false);
  };

  // Modifica di un pasto esistente
  const handleEditMeal = (mealId: string) => {
    setEditingMealId(mealId);
    setShowAddForm(true);
  };

  // Eliminazione di un pasto
  const handleDeleteMeal = (mealId: string) => {
    if (
      window.confirm(
        "Sei sicuro di voler eliminare questo pasto?"
      )
    ) {
      setMeals((prev) =>
        prev.filter((meal) => meal.id !== mealId)
      );
    }
  };

  // Ottieni il pasto in fase di modifica
  const mealToEdit = editingMealId
    ? meals.find((meal) => meal.id === editingMealId)
    : null;

  return (
    <PageContainer>
      <MealAgenda
        onSelectDay={setSelectedDate}
        selectedDate={selectedDate}
        meals={meals}
      />

      <MainContent>
        <AnimatePresence mode="wait">
          {showAddForm ? (
            <AddMealForm
              onSave={handleSaveMeal}
              onCancel={() => {
                setShowAddForm(false);
                setEditingMealId(null);
              }}
              date={selectedDate}
              editingMeal={mealToEdit as Meal | undefined}
            />
          ) : (
            <DailyMeals
              date={selectedDate}
              meals={mealsForSelectedDate}
              onAddMeal={() => setShowAddForm(true)}
              onEditMeal={handleEditMeal}
              onDeleteMeal={handleDeleteMeal}
            />
          )}
        </AnimatePresence>
      </MainContent>
    </PageContainer>
  );
};

export default MealPlannerPage;
