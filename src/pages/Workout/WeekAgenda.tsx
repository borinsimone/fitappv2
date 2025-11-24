import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  format,
  addWeeks,
  startOfWeek,
  addDays,
  isSameDay,
  isSameWeek,
} from "date-fns";
import { it } from "date-fns/locale";
import {
  BiChevronLeft,
  BiChevronRight,
  BiCalendar,
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
  const [direction, setDirection] = useState<number>(0);

  const weekDays = [...Array(7)].map((_, i) => {
    const start = startOfWeek(currentWeek, {
      weekStartsOn: 1,
    });
    return addDays(start, i);
  });

  const handlePrevWeek = () => {
    setDirection(-1);
    setCurrentWeek((prev) => addWeeks(prev, -1));
  };

  const handleNextWeek = () => {
    setDirection(1);
    setCurrentWeek((prev) => addWeeks(prev, 1));
  };

  const handleGoToToday = () => {
    const today = new Date();
    if (
      isSameWeek(currentWeek, today, { weekStartsOn: 1 })
    ) {
      onSelectDay(today);
      return;
    }

    setDirection(today > currentWeek ? 1 : -1);
    setCurrentWeek(today);
    onSelectDay(today);
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
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <Container
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Header>
        <MonthDisplay>
          {format(currentWeek, "MMMM yyyy", { locale: it })}
        </MonthDisplay>

        <Controls>
          <IconButton
            onClick={handleGoToToday}
            title="Oggi"
          >
            <BiCalendar size="20px" />
            <TodayText>Oggi</TodayText>
          </IconButton>
          <NavButtons>
            <IconButton onClick={handlePrevWeek}>
              <BiChevronLeft size="24px" />
            </IconButton>
            <IconButton onClick={handleNextWeek}>
              <BiChevronRight size="24px" />
            </IconButton>
          </NavButtons>
        </Controls>
      </Header>

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
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <WeekGrid>
            {weekDays.map((day) => {
              const isSelected =
                selectedDate &&
                isSameDay(day, selectedDate);
              const isTodayDate = isSameDay(
                day,
                new Date()
              );
              const hasWorkout = hasWorkoutOnDay(day);

              return (
                <DayCard
                  key={day.toString()}
                  $isSelected={!!isSelected}
                  $isToday={isTodayDate}
                  onClick={() => onSelectDay(day)}
                  whileTap={{ scale: 0.95 }}
                >
                  <DayName>
                    {format(day, "EEE", { locale: it })}
                  </DayName>
                  <DayNumber
                    $isSelected={!!isSelected}
                    $isToday={isTodayDate}
                  >
                    {format(day, "d")}
                    {hasWorkout && <WorkoutDot />}
                  </DayNumber>
                </DayCard>
              );
            })}
          </WeekGrid>
        </WeekWrapper>
      </AnimatePresence>
    </Container>
  );
};

export default WeekAgenda;

const Container = styled.div`
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 16px;
  width: 95%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.white10};
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MonthDisplay = styled.div`
  font-size: 18px;
  font-weight: 600;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.white};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 8px;
  padding: 2px;
`;

const IconButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px;
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.white70};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const TodayText = styled.span`
  font-size: 13px;
  font-weight: 500;
  display: none;
  @media (min-width: 350px) {
    display: inline;
  }
`;

const WeekWrapper = styled(motion.div)`
  width: 100%;
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

const DayCard = styled(motion.div)<{
  $isSelected: boolean;
  $isToday: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 4px;
  border-radius: 12px;
  cursor: pointer;
  background: ${({ $isSelected, theme }) =>
    $isSelected ? `${theme.colors.neon}15` : "transparent"};
  border: 1px solid
    ${({ $isSelected, $isToday, theme }) =>
      $isSelected
        ? theme.colors.neon
        : $isToday
        ? theme.colors.white20
        : "transparent"};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $isSelected, theme }) =>
      $isSelected
        ? `${theme.colors.neon}20`
        : theme.colors.white05};
  }
`;

const DayName = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white50};
`;

const DayNumber = styled.div<{
  $isSelected: boolean;
  $isToday: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;

  background: ${({ $isToday, theme }) =>
    $isToday ? theme.colors.white : "transparent"};
  color: ${({ $isToday, $isSelected, theme }) =>
    $isToday
      ? theme.colors.dark
      : $isSelected
      ? theme.colors.neon
      : theme.colors.white};
`;

const WorkoutDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.neon};
  position: absolute;
  bottom: -4px;
  box-shadow: 0 0 4px ${({ theme }) => theme.colors.neon};
`;
