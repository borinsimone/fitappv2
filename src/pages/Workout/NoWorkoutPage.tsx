import React, { useState } from 'react';
import styled from 'styled-components';
import doggoimg from '../../assets/sad-doggo.png';
import Button from '../../components/Button';
import { MdClose } from 'react-icons/md';
import { addWorkouts } from '../../service/WorkoutService';
import { useWorkouts } from '../../context/WorkoutContext';
import { AnimatePresence, motion } from 'framer-motion';
function NoWorkoutPage() {
  const { workouts, loadWorkouts } = useWorkouts();
  const [addWorkoutDialog, setAddWorkoutDialog] = useState(false);
  const [repeatWorkout, setRepeatWorkout] = useState(false);
  interface Workout {
    date: string;
    name: string;
    completed: boolean;
    feedback: {
      feeling: number | null;
      notes: string;
    };
  }
  const today = new Date();

  const handleAddWorkout = async (workout: Workout) => {
    const newDate = new Date(today);
    newDate.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    newDate.toISOString();
    // console.log(newDate, workout.date);

    const newWorkout = { ...workout };
    newWorkout.date = newDate.toISOString();
    newWorkout.completed = false;
    newWorkout.feedback.feeling = null;
    newWorkout.feedback.notes = '';
    console.log(newWorkout);
    const response = await addWorkouts(newWorkout);

    // await refreshWorkouts();
    console.log(response);
    if (response?.status === 200) {
      alert('Workout aggiunto');
      setRepeatWorkout(false);
      loadWorkouts();
    }
  };
  return (
    <Container>
      <div className='text'>non hai ancora un allenamento programmato..</div>
      <img
        src={doggoimg}
        alt=''
      />
      <Button
        className='add'
        onClick={() => setAddWorkoutDialog(true)}
      >
        {' '}
        crea workout
      </Button>
      <AnimatePresence>
        {addWorkoutDialog && (
          <AddDialog
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className='close'
              onClick={() => setAddWorkoutDialog(false)}
            >
              <MdClose color='red' />
            </div>
            {!repeatWorkout && (
              <>
                <button
                  className='choice'
                  onClick={() => setRepeatWorkout(true)}
                >
                  aggiungi da esitenti
                </button>
                <button className='choice'>aggiungi nuovo</button>
              </>
            )}
            {repeatWorkout && (
              <div className='repeat'>
                <button
                  onClick={() => {
                    setRepeatWorkout(false);
                  }}
                >
                  back
                </button>
                {[...new Set(workouts?.map((workout) => workout.name))].map(
                  (name) => (
                    <div
                      key={name}
                      onClick={() => {
                        const workout = workouts?.find((w) => w.name === name);
                        if (workout) handleAddWorkout(workout);
                      }}
                    >
                      {name}
                    </div>
                  )
                )}
              </div>
            )}
          </AddDialog>
        )}
      </AnimatePresence>
    </Container>
  );
}

export default NoWorkoutPage;
const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .text {
    font-size: 40px;
    text-align: center;
    text-transform: uppercase;
    font-weight: 700;
    opacity: 0.5;
    margin-top: auto;
  }
  img {
    margin-bottom: auto;
  }
  .add {
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dark};
    font-weight: 700;
    font-size: 24px;
    padding: 10px;
    margin-top: auto;
    margin-bottom: 20px;
  }
`;
const AddDialog = styled.div`
  position: fixed;
  top: 0;
  z-index: 99999;
  background-color: ${({ theme }) => `${theme.colors.dark}10`};
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  .close {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .choice {
    background-color: ${({ theme }) => theme.colors.dark};
    border: 2px solid ${({ theme }) => theme.colors.neon};
    width: 90%;
    border-radius: 10px;
    padding: 20px;
    text-transform: capitalize;
    font-weight: 700;
  }
`;
