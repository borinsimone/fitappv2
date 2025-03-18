import { useState } from 'react';
import styled from 'styled-components';
import { useWorkouts } from '../../context/WorkoutContext';

import NoWorkoutPage from './NoWorkoutPage';
import WorkoutPreview from './WorkoutPreview';
function WorkoutPlanner() {
  const { workouts } = useWorkouts();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  const todayWorkout = workouts?.find((workout) => {
    if (!workout.date) return false;
    const workoutDate = new Date(workout.date);
    const today = new Date();
    return workoutDate.toDateString() === today.toDateString();
  });

  return (
    <Container>
      <Agenda>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {[...Array(7)].map((_, index) => {
            const date = new Date();
            date.setDate(today.getDate() - today.getDay() + index + 1);
            const dayNames = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div>{date.getDate()}</div>
                <div>{dayNames[index]}</div>
              </div>
            );
          })}
        </div>
      </Agenda>
      <div className='main-container'>
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
      </div>
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
  gap: 10px;
  padding-bottom: 10vh;
  overflow: hidden;
  .main-container {
    width: 100%;
    flex: 1;
    overflow: scroll;
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
const Agenda = styled.div`
  width: 100%;
  padding: 10px 20px;
  text-align: center;
`;
