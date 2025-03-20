import React, { useState } from 'react';
import styled from 'styled-components';
import doggoimg from '../../assets/sad-doggo.png';
import Button from '../../components/Button';
import { MdClose } from 'react-icons/md';
import { BiRepeat, BiPlus } from 'react-icons/bi';

import { useWorkouts } from '../../context/WorkoutContext';
import { AnimatePresence, motion } from 'framer-motion';
import WorkoutForm from './WorkoutForm';
import RepeatWorkout from './RepeatWorkout';
function NoWorkoutPage() {
  const { workouts, addWorkout } = useWorkouts();
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

  const [formOpen, setFormOpen] = useState(false);
  return (
    <Container
      as={motion.div}
      key='no-workout'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className='text'>non hai ancora un allenamento programmato..</div>
      <img
        src={doggoimg}
        alt=''
      />
      <Button
        className='add'
        onClick={() => setAddWorkoutDialog(true)}
      >
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
              <MdClose
                color='red'
                size='30px'
              />
            </div>
            <AnimatePresence>
              {!repeatWorkout && (
                <ChoicesContainer
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ChoiceTitle>Seleziona un opzione</ChoiceTitle>

                  <ChoiceButton
                    onClick={() => setRepeatWorkout(true)}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ChoiceIcon>
                      <BiRepeat size={24} />
                    </ChoiceIcon>
                    <ChoiceInfo>
                      <ChoiceName>Aggiungi da Esistenti</ChoiceName>
                      <ChoiceDescription>
                        Usa un allenamento che hai già creato
                      </ChoiceDescription>
                    </ChoiceInfo>
                  </ChoiceButton>

                  <ChoiceButton
                    onClick={() => setFormOpen(true)}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ChoiceIcon>
                      <BiPlus size={24} />
                    </ChoiceIcon>
                    <ChoiceInfo>
                      <ChoiceName>Aggiungi Nuovo</ChoiceName>
                      <ChoiceDescription>
                        Crea un allenamento personalizzato
                      </ChoiceDescription>
                    </ChoiceInfo>
                  </ChoiceButton>
                </ChoicesContainer>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {repeatWorkout && (
                <RepeatWorkout
                  workouts={workouts ?? []}
                  setRepeatWorkout={setRepeatWorkout}
                  setAddWorkoutDialog={setAddWorkoutDialog}
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {formOpen && <WorkoutForm closeForm={() => setFormOpen(false)} />}
            </AnimatePresence>
          </AddDialog>
        )}
      </AnimatePresence>
    </Container>
  );
}

export default NoWorkoutPage;
const Container = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  .text {
    font-size: 30px;
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
    position: sticky;
    bottom: 0;
  }
`;
const AddDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  background-color: ${({ theme }) => `${theme.colors.dark}10`};
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  height: 100%;
  width: 100vw;
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

// Add these styled components
const ChoicesContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 400px;
  gap: 16px;
`;

const ChoiceTitle = styled.h2`
  color: ${({ theme }) => theme.colors.neon};
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
`;

const ChoiceButton = styled(motion.button)`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white10};
  border: 2px solid ${({ theme }) => theme.colors.white20};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.neon};
    background-color: ${({ theme }) => `${theme.colors.neon}10`};
  }
`;

const ChoiceIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  margin-right: 16px;
  flex-shrink: 0;
`;

const ChoiceInfo = styled.div`
  flex: 1;
`;

const ChoiceName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const ChoiceDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white70};
`;
