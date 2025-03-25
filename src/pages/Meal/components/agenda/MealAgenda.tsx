import React, { useState } from 'react';
import styled from 'styled-components';
import { format, addWeeks, startOfWeek, addDays, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { BiBowlRice } from 'react-icons/bi';

interface MealAgendaProps {
  onSelectDay: (date: Date) => void;
  selectedDate?: Date;
  meals: Array<{ date: string }>;
}

const MealAgenda: React.FC<MealAgendaProps> = ({
  onSelectDay,
  selectedDate,
  meals,
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekDays = [...Array(7)].map((_, i) => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return addDays(start, i);
  });

  const handlePrevWeek = () => setCurrentWeek(addWeeks(currentWeek, -1));
  const handleNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));

  const hasMealOnDay = (date: Date) => {
    return meals.some((meal) => {
      const mealDate = new Date(meal.date);
      return isSameDay(mealDate, date);
    });
  };

  return (
    <Container>
      <header>
        <button onClick={handlePrevWeek}>
          <BiChevronLeft size='24px' />
        </button>
        <span className='month'>
          {format(currentWeek, 'MMMM yyyy', { locale: it })}
        </span>
        <button onClick={handleNextWeek}>
          <BiChevronRight size='24px' />
        </button>
      </header>
      <div className='week'>
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className='day'
            data-selected={selectedDate && isSameDay(day, selectedDate)}
            onClick={() => onSelectDay(day)}
          >
            <div className='weekday'>{format(day, 'EEE', { locale: it })}</div>
            <div className='date'>
              {format(day, 'd')}
              {hasMealOnDay(day) && (
                <div className='meal-indicator'>
                  <BiBowlRice size='12px' />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default MealAgenda;

const Container = styled.div`
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 12px;
  width: 90%;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.neon};

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    button {
      all: unset;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      color: ${({ theme }) => theme.colors.neon};

      &:hover {
        background: ${({ theme }) => theme.colors.white10};
      }
    }

    .month {
      font-size: 18px;
      font-weight: 500;
      text-transform: capitalize;
    }
  }

  .week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;

    .day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      padding-bottom: 20px;
      transition: all 0.2s ease;

      &:hover {
        background: ${({ theme }) => theme.colors.white10};
      }

      &[data-selected='true'] {
        background: ${({ theme }) => `${theme.colors.neon}10`};
        color: ${({ theme }) => theme.colors.neon};
        border: 2px solid ${({ theme }) => theme.colors.neon};
      }

      .weekday {
        font-size: 12px;
        text-transform: uppercase;
        opacity: 0.8;
      }

      .date {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 500;

        .meal-indicator {
          position: absolute;
          bottom: -20px;
          color: ${({ theme }) => theme.colors.neon};
          animation: pulse 2s infinite;
        }
      }
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.8;
    }
  }
`;
