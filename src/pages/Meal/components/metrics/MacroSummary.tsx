import React from 'react';
import styled from 'styled-components';
import MacroProgress from './MacroProgress';
import { Meal } from '../../MealPlanner';

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

  // Calories info
  const caloriesInfo = {
    name: 'calories',
    total: targetMacros.calories,
    consumed: consumed.calories,
    unit: 'kcal',
  };

  // Macro info
  const macros = [
    {
      name: 'protein',
      total: targetMacros.protein,
      consumed: consumed.protein,
      unit: 'g',
      color: '#28C76F', // green
    },
    {
      name: 'carbs',
      total: targetMacros.carbs,
      consumed: consumed.carbs,
      unit: 'g',
      color: '#00CFE8', // blue
    },
    {
      name: 'fats',
      total: targetMacros.fats,
      consumed: consumed.fats,
      unit: 'g',
      color: '#FF9F43', // orange
    },
  ];

  return (
    <Container>
      <CaloriesSection>
        <MacroProgress
          key={caloriesInfo.name}
          macro={caloriesInfo}
        />
      </CaloriesSection>

      <MacrosSection>
        {macros.map((macro) => (
          <CircularMacroProgress
            key={macro.name}
            macro={macro}
          />
        ))}
      </MacrosSection>
    </Container>
  );
};

const CircularMacroProgress: React.FC<{
  macro: {
    name: string;
    total: number;
    consumed: number;
    unit: string;
    color: string;
  };
}> = ({ macro }) => {
  const percentage =
    Math.min(100, Math.round((macro.consumed / macro.total) * 100)) || 0;
  const remaining = macro.total - macro.consumed;
  const circumference = 2 * Math.PI * 45; // circle radius is 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <CircleContainer>
      <CircleHeader>
        <MacroName>{macro.name}</MacroName>
        <MacroValue>
          {macro.consumed}
          {macro.unit}
        </MacroValue>
      </CircleHeader>

      <CircleWrapper>
        <svg
          width='100'
          height='100'
          viewBox='0 0 100 100'
        >
          <circle
            cx='50'
            cy='50'
            r='45'
            fill='none'
            stroke={`${macro.color}20`}
            strokeWidth='8'
          />
          <AnimatedCircle
            cx='50'
            cy='50'
            r='45'
            fill='none'
            stroke={macro.color}
            strokeWidth='8'
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap='round'
            transform='rotate(-90 50 50)'
          />
        </svg>
        <PercentageText>{percentage}%</PercentageText>
      </CircleWrapper>

      <RemainingText>
        {remaining > 0 ? `${remaining}${macro.unit} left` : 'Target reached!'}
      </RemainingText>
    </CircleContainer>
  );
};
const AnimatedCircle = styled.circle`
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
`;

const CaloriesSection = styled.div`
  width: 100%;
`;

const MacrosSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
  }
`;

const CircleContainer = styled.div`
  flex: 1;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
`;

const CircleHeader = styled.div`
  margin-bottom: 12px;
  width: 100%;
`;

const MacroName = styled.div`
  text-transform: capitalize;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
`;

const MacroValue = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const CircleWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PercentageText = styled.div`
  position: absolute;
  font-size: 16px;
  font-weight: 700;
`;

const RemainingText = styled.div`
  margin-top: 12px;
  font-size: 13px;
  opacity: 0.7;
`;

export default MacroSummary;
