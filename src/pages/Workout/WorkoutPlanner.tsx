import styled from 'styled-components';
import NoWorkoutPage from './NoWorkoutPage';
import WeekAgenda from './WeekAgenda';
import WorkoutPreview from './WorkoutPreview';
import { useWorkouts } from '../../context/WorkoutContext';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

function WorkoutPlanner() {
  const { workouts } = useWorkouts();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);

  const selectedWorkout = workouts?.find((workout) => {
    if (!workout.date || !selectedDate) return false;
    const workoutDate = new Date(workout.date);
    return workoutDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <Container>
      <WeekAgenda
        onSelectDay={setSelectedDate}
        selectedDate={selectedDate}
      />
      <div className='main-container'>
        <div className='header'>
          <div className='workout-title'>
            {selectedWorkout ? selectedWorkout.name : '-'}
          </div>
          <div className='date'>
            {selectedDate?.toLocaleDateString('it-IT', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </div>
        </div>

        <AnimatePresence mode='wait'>
          {selectedWorkout ? (
            <WorkoutPreview workout={selectedWorkout} />
          ) : (
            <NoWorkoutPage />
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}

export default WorkoutPlanner;
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
  /* overflow: hidden; */
  .main-container {
    width: 90%;
    flex: 1;
    overflow-y: scroll;
    position: relative;
  }
  .header {
    display: flex;
    flex-direction: column;
    width: 100%;
    .workout-title {
      text-transform: capitalize;
      font-size: 32px;
    }
    .date {
      text-transform: capitalize;
      color: ${({ theme }) => theme.colors.neon};
      font-size: 32px;
      font-weight: 300;
    }
  }
`;
