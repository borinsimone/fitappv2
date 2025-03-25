import { useState } from 'react';
import styled from 'styled-components';
import { format, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';

import MealAgenda from './components/agenda/MealAgenda';
import MacroSummary from './components/metrics/MacroSummary';
import Meals from './components/meals/Meals';
import NoMealPlan from './components/empty-states/NoMealPlan';
import ComingSoonOverlay from './ComingSoonOverlay';

export interface Meal {
  id: string;
  date: string;
  meals: {
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
    snacks: MealItem[];
  };
}

export interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity: number;
  eaten: boolean;
}

function MealPlanner() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dummyMeals, setDummyMeals] = useState([
    {
      id: '1',
      date: '2025-03-19',
      meals: {
        breakfast: [
          {
            name: 'Oatmeal with Berries',
            calories: 350,
            protein: 12,
            carbs: 56,
            fats: 8,
            quantity: 1,
            eaten: false,
          },
        ],
        lunch: [
          {
            name: 'Chicken Salad',
            calories: 450,
            protein: 35,
            carbs: 25,
            fats: 22,
            quantity: 1,
            eaten: false,
          },
        ],
        dinner: [
          {
            name: 'Salmon with Vegetables',
            calories: 550,
            protein: 42,
            carbs: 30,
            fats: 28,
            quantity: 1,
            eaten: false,
          },
        ],
        snacks: [
          {
            name: 'Protein Bar',
            calories: 200,
            protein: 15,
            carbs: 20,
            fats: 8,
            quantity: 1,
            eaten: false,
          },
        ],
      },
    },
    {
      id: '2',
      date: '2025-03-20',
      meals: {
        breakfast: [
          {
            name: 'Greek Yogurt with Honey',
            calories: 300,
            protein: 20,
            carbs: 35,
            fats: 10,
            quantity: 1,
            eaten: false,
          },
        ],
        lunch: [
          {
            name: 'Turkey Sandwich',
            calories: 400,
            protein: 30,
            carbs: 45,
            fats: 15,
            quantity: 1,
            eaten: false,
          },
        ],
        dinner: [
          {
            name: 'Grilled Chicken with Rice',
            calories: 500,
            protein: 40,
            carbs: 50,
            fats: 20,
            quantity: 1,
            eaten: false,
          },
        ],
        snacks: [
          {
            name: 'Apple with Almond Butter',
            calories: 180,
            protein: 5,
            carbs: 25,
            fats: 10,
            quantity: 1,
            eaten: false,
          },
        ],
      },
    },
  ]);
  const selectedMeal = dummyMeals.find((meal) =>
    isSameDay(new Date(meal.date), selectedDate)
  );

  return (
    <Container>
      <Content>
        <MealAgenda
          onSelectDay={setSelectedDate}
          selectedDate={selectedDate}
          meals={dummyMeals}
        />
        <MainContent>
          <Header>
            <h1>{format(selectedDate, 'EEEE d MMMM', { locale: it })}</h1>
          </Header>

          {selectedMeal ? (
            <>
              <MacroSummary
                meals={selectedMeal.meals}
                selectedMeal={selectedMeal}
              />
              <Meals
                selectedMeal={selectedMeal}
                startHour={6}
                onMealUpdate={(type, items) => {
                  setDummyMeals((prevMeals) =>
                    prevMeals.map((meal) =>
                      meal.id === selectedMeal.id
                        ? { ...meal, meals: { ...meal.meals, [type]: items } }
                        : meal
                    )
                  );
                }}
              />
            </>
          ) : (
            <NoMealPlan
              selectedDate={selectedDate}
              onCreateMeal={() => {
                // Funzione per creare un nuovo piano pasti
                const newMeal = {
                  id: Date.now().toString(),
                  date: selectedDate.toISOString().split('T')[0],
                  meals: {
                    breakfast: [],
                    lunch: [],
                    dinner: [],
                    snacks: [],
                  },
                };
                setDummyMeals([...dummyMeals, newMeal]);
              }}
            />
          )}
        </MainContent>
      </Content>
      <ComingSoonOverlay />
    </Container>
  );
}

export default MealPlanner;
const Content = styled.div`
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Container = styled.div`
  height: 100vh;
  height: 100dvh;
  width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;
  padding-bottom: 10vh;
  overflow: hidden;
`;

const MainContent = styled.div`
  width: 90%;
  flex: 1;
  overflow-y: scroll;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    font-size: 24px;
    text-transform: capitalize;
  }
`;

const MealItem = styled.div`
  padding: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white10};

  .name {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .macros {
    display: flex;
    gap: 12px;
    font-size: 12px;
    opacity: 0.8;
  }
`;
