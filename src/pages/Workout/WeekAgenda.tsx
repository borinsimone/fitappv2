import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  format,
  addWeeks,
  startOfWeek,
  addDays,
  isSameDay,
} from "date-fns";
import { it } from "date-fns/locale";
import {
  BiChevronLeft,
  BiChevronRight,
} from "react-icons/bi";
import { useWorkouts } from "../../context/WorkoutContext";
import { motion, AnimatePresence } from "framer-motion";

interface WeekAgendaProps {
  onSelectDay: (date: Date) => void;
  selectedDate?: Date;
}

const WeekAgenda: React.FC<WeekAgendaProps> = ({
  onSelectDay,
  selectedDate,
}) => {
  const { workouts } = useWorkouts();
  const [currentWeek, setCurrentWeek] = useState(
    new Date()
  );
  const [touchStart, setTouchStart] = useState<
    number | null
  >(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(
    null
  );
  const [direction, setDirection] = useState<
    "left" | "right" | null
  >(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset animation state when direction changes
  useEffect(() => {
    if (direction) {
      const timer = setTimeout(() => {
        setDirection(null);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [direction]);

  const weekDays = [...Array(7)].map((_, i) => {
    const start = startOfWeek(currentWeek, {
      weekStartsOn: 1,
    });
    return addDays(start, i);
  });

  const handlePrevWeek = () => {
    if (isAnimating) return;
    setDirection("right");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentWeek(addWeeks(currentWeek, -1));
    }, 150);
  };

  const handleNextWeek = () => {
    if (isAnimating) return;
    setDirection("left");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentWeek(addWeeks(currentWeek, 1));
    }, 150);
  };

  const hasWorkoutOnDay = (date: Date) => {
    return workouts?.some((workout) => {
      if (!workout.date) return false;
      const workoutDate = new Date(workout.date);
      return isSameDay(workoutDate, date);
    });
  };

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextWeek();
    }
    if (isRightSwipe) {
      handlePrevWeek();
    }

    // Reset touch values
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Calculate animation variants
  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? -300 : 300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <Container
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <header>
        <button onClick={handlePrevWeek}>
          <BiChevronLeft size="24px" />
        </button>
        <span className="month">
          {format(currentWeek, "MMMM yyyy", { locale: it })}
        </span>
        <button onClick={handleNextWeek}>
          <BiChevronRight size="24px" />
        </button>
      </header>
      <AnimatePresence
        initial={false}
        custom={direction}
        mode="wait"
      >
        <WeekWrapper
          key={currentWeek.toISOString()}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: "tween",
            duration: 0.3,
          }}
        >
          <div className="week">
            {weekDays.map((day) => (
              <div
                key={day.toString()}
                className="day"
                data-selected={
                  selectedDate &&
                  isSameDay(day, selectedDate)
                }
                onClick={() => onSelectDay(day)}
              >
                <div className="weekday">
                  {format(day, "EEE", { locale: it })}
                </div>
                <div className="date">
                  {format(day, "d")}
                  {hasWorkoutOnDay(day) && (
                    <span className="workout-indicator" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </WeekWrapper>
      </AnimatePresence>
    </Container>
  );
};

export default WeekAgenda;

const Container = styled.div`
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 12px;
  width: 90%;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.neon};
  overflow: hidden;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    z-index: 2;
    position: relative;

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
`;

const WeekWrapper = styled(motion.div)`
  width: 100%;

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
      transition: all 0.2s ease;

      &:hover {
        background: ${({ theme }) => theme.colors.white10};
      }

      &[data-selected="true"] {
        background: ${({ theme }) =>
          `${theme.colors.neon}10`};
        color: ${({ theme }) => theme.colors.neon};
        border: 2px solid
          ${({ theme }) => theme.colors.neon};
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
        gap: 4px;

        .workout-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: ${({ theme }) =>
            theme.colors.white};
          position: absolute;
          bottom: -6px;
        }
      }
    }
  }
`;
