import styled from 'styled-components';
import { Meal } from './MealPlanner';
import type { MealItem } from './MealPlanner';
import { format } from 'date-fns';

import { useState } from 'react';

interface MealsProps {
  selectedMeal: Meal;
  startHour?: number; // Optional prop to set start hour (default: 6am)
  onMealUpdate: (type: string, items: MealItem[]) => void;
}

interface TimeSlotMeal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  items: MealItem[];
}

const Meals: React.FC<MealsProps> = ({
  selectedMeal,
  startHour = 6,
  onMealUpdate,
}) => {
  const getTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      const hour = (i + startHour) % 24;
      slots.push(hour);
    }
    return slots;
  };

  // Map meals to their default time slots
  const mealTimeMap = {
    breakfast: 7,
    lunch: 13,
    dinner: 19,
    snacks: 16,
  };

  const getMealForHour = (hour: number): TimeSlotMeal | null => {
    for (const [type, timeSlot] of Object.entries(mealTimeMap)) {
      if (timeSlot === hour) {
        return {
          type: type as keyof typeof mealTimeMap,
          items: selectedMeal.meals[type as keyof typeof mealTimeMap],
        };
      }
    }
    return null;
  };

  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <Container>
      {getTimeSlots().map((hour) => (
        <TimeSlot key={hour}>
          <Time>{format(new Date().setHours(hour, 0), 'HH:mm')}</Time>
          <Content>
            <div className='line'></div>
            {getMealForHour(hour) && (
              <MealContent>
                <MealType>{getMealForHour(hour)?.type}</MealType>
                <Items>
                  {getMealForHour(hour)?.items.map((item, index) => (
                    <MealItem
                      key={index}
                      eaten={item.eaten}
                    >
                      <input
                        type='checkbox'
                        checked={item.eaten}
                        onChange={() => {
                          const updatedItems = getMealForHour(hour)?.items.map(
                            (i, idx) =>
                              idx === index ? { ...i, eaten: !i.eaten } : i
                          );
                          if (updatedItems && getMealForHour(hour)?.type) {
                            onMealUpdate(
                              getMealForHour(hour)!.type,
                              updatedItems
                            );
                          }
                        }}
                      />
                      <span className='name'>{item.name}</span>

                      <span className='calories'>{item.calories}kcal</span>
                      <div>
                        <button onClick={() => setExpanded(!expanded)}>
                          {expanded ? '▼' : '▶'}
                        </button>
                        {expanded && (
                          <div
                            style={{
                              fontSize: '12px',
                              marginTop: '4px',
                              opacity: 0.8,
                            }}
                          >
                            <div>Protein: {item.protein}g</div>
                            <div>Carbs: {item.carbs}g</div>
                            <div>Fat: {item.fats}g</div>
                          </div>
                        )}
                      </div>
                    </MealItem>
                  ))}
                </Items>
              </MealContent>
            )}
          </Content>
        </TimeSlot>
      ))}
    </Container>
  );
};

export default Meals;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  border-radius: 12px;
  overflow: hidden;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.white10};
  border: 1px solid ${({ theme }) => theme.colors.neon};
`;

const TimeSlot = styled.div`
  display: flex;

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
  }
`;

const Time = styled.div`
  /* padding: 12px; */
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neon};
  text-transform: uppercase;
  display: flex;
  align-items: flex-start;
`;

const Content = styled.div`
  flex: 1;
  padding: 8px;
  /* border-left: 1px solid ${({ theme }) => theme.colors.white10}; */

  .line {
    height: 2px;
    background-color: ${({ theme }) => theme.colors.white10};
    margin-bottom: 5px;
  }
`;

const MealContent = styled.div`
  background: ${({ theme }) => `${theme.colors.neon}30`};
  border-radius: 8px;
  padding: 12px;
`;

const MealType = styled.div`
  text-transform: capitalize;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.white};
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MealItem = styled.div<{ eaten: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: ${({ eaten }) => (eaten ? 1 : 0.5)};

  .name {
    font-size: 14px;
  }

  .calories {
    font-size: 12px;
    opacity: 0.8;
  }
`;
