import React, { useState } from 'react';
import styled from 'styled-components';
import { useWorkouts } from '../../../context/WorkoutContext';

import { BiCheck, BiCloset, BiCross, BiDumbbell } from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';
import { AnimatePresence, motion } from 'framer-motion';

function WorkoutHistory() {
  const { workouts } = useWorkouts();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  React.useEffect(() => {
    if (selectedWorkout) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedWorkout]);
  interface DateCalculator {
    (date: string | Date | undefined): string;
  }

  const getDaysAgo: DateCalculator = (date) => {
    const workoutDate = date ? new Date(date).getTime() : Date.now();
    const diffInDays =
      Math.floor((Date.now() - workoutDate) / (1000 * 60 * 60 * 24)) + 1;

    return new Intl.RelativeTimeFormat('it', { numeric: 'auto' }).format(
      -diffInDays,
      'day'
    );
  };
  return (
    <Container>
      <AnimatePresence>
        {selectedWorkout && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className='workout-preview-dialog'
          >
            <div className='content'>
              <div className='header'>
                <div className='icon'>
                  <BiDumbbell
                    color='#8248AC'
                    size='24px'
                  />
                </div>
                <div className='title'>{selectedWorkout.name}</div>
                <div
                  className='close'
                  onClick={() => setSelectedWorkout(null)}
                >
                  <CgClose size='24px' />
                </div>
              </div>
              <div className='details'>
                <div className='date'>
                  {new Date(selectedWorkout.date).toLocaleDateString('it-IT', {
                    timeZone: 'UTC',
                  })}
                </div>
                <div className='status'>
                  {selectedWorkout.completed ? 'Completed' : 'Incomplete'}
                </div>
              </div>
              <div className='notes'>
                <h3>Notes:</h3>
                <p>{selectedWorkout.notes}</p>
              </div>
              <div className='exercises'></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {workouts?.map((workout) => (
        <div
          className='workout-container'
          key={workout._id}
          onClick={() => {
            console.log(workout);
            setSelectedWorkout(workout);
          }}
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
            <span>{getDaysAgo(workout.date)}</span>
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
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .workout-preview-dialog {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: ${({ theme }) => `${theme.colors.dark}70`};
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    height: 100vh;
    width: 100%;
    display: flex;

    justify-content: center;
    padding: 40px;
    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      .header {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        width: 100%;
        .icon {
          background-color: ${({ theme }) => theme.colors.white10};
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          aspect-ratio: 1;
          border-radius: 50%;
          position: absolute;
          left: 10px;
        }
        .title {
          background-color: unset;
          width: fit-content;
        }
        .close {
          position: absolute;
          top: 10px;
          right: 10px;
        }
      }
    }
  }
  .workout-container {
    width: 100%;
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
