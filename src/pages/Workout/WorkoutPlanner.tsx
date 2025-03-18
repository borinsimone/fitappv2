import React, { useState } from 'react';
import styled from 'styled-components';
import { useWorkouts } from '../../context/WorkoutContext';

import NoWorkoutPage from './NoWorkoutPage';
import WorkoutPreview from './WorkoutPreview';
function WorkoutPlanner() {
  const { workouts, loadWorkouts } = useWorkouts();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const todayWorkout = workouts?.find((workout) => {
    if (!workout.date) return false;
    const workoutDate = new Date(workout.date);
    const today = new Date();
    return workoutDate.toDateString() === today.toDateString();
  });

  return (
    <Container>
      <Agenda>agenda qui</Agenda>

      <div className='header'>
        <div className='workout-title'>
          {todayWorkout ? todayWorkout.name : '-'}
        </div>
        <div className='date'>
          {selectedDate.toLocaleDateString('it-IT', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </div>
      </div>
      {todayWorkout && <WorkoutPreview todayWorkout={todayWorkout} />}
      {!todayWorkout && <NoWorkoutPage />}
    </Container>
  );
}

export default WorkoutPlanner;
const Container = styled.div`
  height: 100vh;
  height: 100dvh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10vh;
  padding: 20px;
  gap: 20px;
  padding-bottom: 10vh;
  overflow: hidden;
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
const Agenda = styled.div`
  background-color: #ffffff10;
  width: 100%;
  padding: 20px;
  text-align: center;
`;
