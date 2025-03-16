import React from 'react';
import styled from 'styled-components';
import { useWorkouts } from '../../../context/WorkoutContext';

import { BiCheck, BiCloset, BiCross, BiDumbbell } from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';

function WorkoutHistory() {
  const { workouts } = useWorkouts();

  return (
    <Container>
      {workouts?.map((workout) => (
        <div
          className='workout-container'
          key={workout._id}
        >
          <div className='icon'>
            <BiDumbbell
              color='#8248AC'
              size='20px'
            />
          </div>
          <div className='text'>
            <div className='name'>{workout.name}</div>
            <div className='notes'>{workout.notes}</div>
          </div>
          <div className='days-ago'>
            {Math.floor(
              (Date.now() -
                (workout.date
                  ? new Date(workout.date).getTime()
                  : Date.now())) /
                (1000 * 60 * 60 * 24)
            )}{' '}
            giorni fa
          </div>
          <div className='completed'>
            {workout.completed ? <BiCheck /> : <CgClose />}
          </div>
        </div>
      ))}
    </Container>
  );
}

export default WorkoutHistory;
const Container = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .workout-container {
    display: flex;
    gap: 10px;
    align-items: end;
    position: relative;
    border-radius: 10px;
    padding: 5px 20px;
    background-color: ${({ theme }) => theme.colors.white10};
    .icon {
      background-color: ${({ theme }) => theme.colors.white10};
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
      border-radius: 50%;
      margin: auto 0;
    }
    .text {
      display: flex;
      flex-direction: column;
      flex: 1;
      .name {
        font-size: 18px;
        font-weight: 700;
        width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .notes {
        font-size: 14px;
        font-weight: 300;
        width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .days-ago {
      margin-left: auto;
    }
    .completed {
      position: absolute;
      top: 10px;
      right: 20px;
    }
  }
`;
