// src/pages/Meal/DailyMeals.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Meal, calculateMealTotals } from "./types/meal";
import { PieChart } from "react-minimal-pie-chart";
import {
  Container,
  Header,
  DateDisplay,
  AddButton,
  NutritionSummary,
  MacrosChart,
  NutritionTotals,
  TotalItem,
  TotalLabel,
  TotalValue,
  MealsList,
  MealCard,
  MealHeader,
  MealTime,
  MealName,
  MealCalories,
  MealContent,
  MacroDistribution,
  MacroBar,
  ProteinSegment,
  CarbsSegment,
  FatSegment,
  MacroValues,
  MacroValue,
  FoodItemsList,
  FoodItem,
  FoodName,
  FoodQuantity,
  MealNotes,
  MealActions,
  ActionButton,
  EmptyState,
  AddFirstMealButton,
} from "./MealStyles";
interface DailyMealsProps {
  date: Date;
  meals: Meal[];
  onAddMeal: () => void;
  onEditMeal: (mealId: string) => void;
  onDeleteMeal: (mealId: string) => void;
}

const DailyMeals: React.FC<DailyMealsProps> = ({
  date,
  meals,
  onAddMeal,
  onEditMeal,
  onDeleteMeal,
}) => {
  // Calcola i totali giornalieri
  const dailyTotals = meals.reduce(
    (totals, meal) => {
      const mealTotals = calculateMealTotals(meal);
      return {
        calories: totals.calories + mealTotals.calories,
        protein: totals.protein + mealTotals.protein,
        carbs: totals.carbs + mealTotals.carbs,
        fat: totals.fat + mealTotals.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Dati per il grafico dei macros
  const macroData = [
    {
      title: "Proteine",
      value: dailyTotals.protein * 4,
      color: "#75c9b7",
    },
    {
      title: "Carboidrati",
      value: dailyTotals.carbs * 4,
      color: "#abd699",
    },
    {
      title: "Grassi",
      value: dailyTotals.fat * 9,
      color: "#e8a99e",
    },
  ];

  return (
    <Container>
      <Header>
        <DateDisplay>
          {date.toLocaleDateString("it-IT", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </DateDisplay>
        <AddButton onClick={onAddMeal}>
          + Aggiungi pasto
        </AddButton>
      </Header>

      <NutritionSummary>
        <MacrosChart>
          <PieChart
            data={macroData}
            lineWidth={40}
            paddingAngle={2}
            rounded
            label={({ dataEntry }) =>
              `${Math.round(dataEntry.percentage)}%`
            }
            labelStyle={{ fontSize: "5px", fill: "#fff" }}
          />
        </MacrosChart>

        <NutritionTotals>
          <TotalItem>
            <TotalLabel>Calorie</TotalLabel>
            <TotalValue>
              {Math.round(dailyTotals.calories)} kcal
            </TotalValue>
          </TotalItem>
          <TotalItem>
            <TotalLabel>Proteine</TotalLabel>
            <TotalValue>
              {Math.round(dailyTotals.protein)} g
            </TotalValue>
          </TotalItem>
          <TotalItem>
            <TotalLabel>Carboidrati</TotalLabel>
            <TotalValue>
              {Math.round(dailyTotals.carbs)} g
            </TotalValue>
          </TotalItem>
          <TotalItem>
            <TotalLabel>Grassi</TotalLabel>
            <TotalValue>
              {Math.round(dailyTotals.fat)} g
            </TotalValue>
          </TotalItem>
        </NutritionTotals>
      </NutritionSummary>

      <MealsList>
        <AnimatePresence>
          {meals.length > 0 ? (
            meals
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((meal) => {
                const mealTotals =
                  calculateMealTotals(meal);

                return (
                  <MealCard
                    key={meal.id}
                    as={motion.div}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <MealHeader>
                      <div>
                        <MealTime>{meal.time}</MealTime>
                        <MealName>{meal.name}</MealName>
                      </div>
                      <MealCalories>
                        {Math.round(mealTotals.calories)}{" "}
                        kcal
                      </MealCalories>
                    </MealHeader>

                    <MealContent>
                      <MacroDistribution>
                        <MacroBar>
                          <ProteinSegment
                            width={
                              ((mealTotals.protein * 4) /
                                mealTotals.calories) *
                              100
                            }
                          />
                          <CarbsSegment
                            width={
                              ((mealTotals.carbs * 4) /
                                mealTotals.calories) *
                              100
                            }
                          />
                          <FatSegment
                            width={
                              ((mealTotals.fat * 9) /
                                mealTotals.calories) *
                              100
                            }
                          />
                        </MacroBar>
                        <MacroValues>
                          <MacroValue>
                            P:{" "}
                            {Math.round(mealTotals.protein)}
                            g
                          </MacroValue>
                          <MacroValue>
                            C:{" "}
                            {Math.round(mealTotals.carbs)}g
                          </MacroValue>
                          <MacroValue>
                            G: {Math.round(mealTotals.fat)}g
                          </MacroValue>
                        </MacroValues>
                      </MacroDistribution>

                      <FoodItemsList>
                        {meal.foodItems.map((food) => (
                          <FoodItem key={food.id}>
                            <FoodName>{food.name}</FoodName>
                            <FoodQuantity>
                              {food.quantity}g
                            </FoodQuantity>
                          </FoodItem>
                        ))}
                      </FoodItemsList>

                      {meal.notes && (
                        <MealNotes>{meal.notes}</MealNotes>
                      )}
                    </MealContent>

                    <MealActions>
                      <ActionButton
                        onClick={() => onEditMeal(meal.id)}
                      >
                        Modifica
                      </ActionButton>
                      <ActionButton
                        onClick={() =>
                          onDeleteMeal(meal.id)
                        }
                      >
                        Elimina
                      </ActionButton>
                    </MealActions>
                  </MealCard>
                );
              })
          ) : (
            <EmptyState>
              Nessun pasto registrato per oggi.
              <br />
              <AddFirstMealButton onClick={onAddMeal}>
                Aggiungi il tuo primo pasto
              </AddFirstMealButton>
            </EmptyState>
          )}
        </AnimatePresence>
      </MealsList>
    </Container>
  );
};

export default DailyMeals;
