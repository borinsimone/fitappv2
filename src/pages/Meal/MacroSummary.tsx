import styled from 'styled-components';
import MacroProgress from './MacroProgress';
import { Meal, MealItem } from '../../pages/Meal/MealPlanner';

interface MacroSummaryProps {
  meals: Meal['meals'];
  selectedMeal: Meal;
}

const MacroSummary: React.FC<MacroSummaryProps> = ({ meals, selectedMeal }) => {
  const calculateTotalMacros = () => {
    const allMeals = [
      ...meals.breakfast,
      ...meals.lunch,
      ...meals.dinner,
      ...meals.snacks,
    ];

    return allMeals.reduce(
      (acc, meal) => {
        if (meal.eaten) {
          acc.calories += meal.calories * meal.quantity;
          acc.protein += meal.protein * meal.quantity;
          acc.carbs += meal.carbs * meal.quantity;
          acc.fats += meal.fats * meal.quantity;
        }
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };
  const calculateTargetMacros = () => {
    // Example calculation based on 2500 kcal diet
    // Protein: 30% of total calories (1g = 4 kcal)
    // Carbs: 45% of total calories (1g = 4 kcal)
    // Fats: 25% of total calories (1g = 9 kcal)
    const baseCalories = Object.values(selectedMeal.meals).reduce(
      (mealTotal, mealItems) => {
        return (
          mealTotal +
          mealItems.reduce(
            (itemTotal, meal) => itemTotal + meal.calories * meal.quantity,
            0
          )
        );
      },
      0
    );

    return {
      calories: baseCalories,
      protein: Math.round((baseCalories * 0.3) / 4), // 30% of calories from protein
      carbs: Math.round((baseCalories * 0.45) / 4), // 45% of calories from carbs
      fats: Math.round((baseCalories * 0.25) / 9), // 25% of calories from fats
    };
  };
  const consumed = calculateTotalMacros();
  const targetMacros = calculateTargetMacros();

  const macros = [
    {
      name: 'calories',
      total: targetMacros.calories,
      consumed: consumed.calories,
      unit: 'kcal',
    },
    {
      name: 'protein',
      total: targetMacros.protein,
      consumed: consumed.protein,
      unit: 'g',
    },
    {
      name: 'carbs',
      total: targetMacros.carbs,
      consumed: consumed.carbs,
      unit: 'g',
    },
    {
      name: 'fats',
      total: targetMacros.fats,
      consumed: consumed.fats,
      unit: 'g',
    },
  ];

  return (
    <Container>
      {macros.map((macro) => (
        <MacroProgress
          key={macro.name}
          macro={macro}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export default MacroSummary;
