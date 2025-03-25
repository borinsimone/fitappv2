import React, { useState } from 'react';
import styled from 'styled-components';
import doggoimg from '../../assets/sad-doggo.png';
import { MdClose, MdOutlineAutoAwesome } from 'react-icons/md';
import { BiRepeat, BiPlus, BiDumbbell } from 'react-icons/bi';
import { FiArrowLeft } from 'react-icons/fi';
import { useWorkouts } from '../../context/WorkoutContext';
import { AnimatePresence, motion } from 'framer-motion';
import WorkoutForm from './WorkoutForm';
import RepeatWorkout from './RepeatWorkout';
import { TiMessageTyping } from 'react-icons/ti';

function NoWorkoutPage({ selectedDate }: { selectedDate?: Date }) {
  const { workouts, addWorkout } = useWorkouts();
  const [addWorkoutDialog, setAddWorkoutDialog] = useState(false);
  const [repeatWorkout, setRepeatWorkout] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const openDialog = () => {
    setAddWorkoutDialog(true);
    setRepeatWorkout(false);
    setFormOpen(false);
  };

  const closeDialog = () => {
    setAddWorkoutDialog(false);
    setTimeout(() => {
      setRepeatWorkout(false);
      setFormOpen(false);
    }, 300);
  };

  return (
    <PageContainer
      as={motion.div}
      key='no-workout-page'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <EmptyStateContainer
        as={motion.div}
        key='empty-state'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <IllustrationWrapper>
          <motion.img
            src={doggoimg}
            alt='No workout scheduled'
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{
              scale: [0.8, 0.85, 0.8],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </IllustrationWrapper>

        <EmptyStateContent>
          <EmptyStateTitle>Nessun allenamento programmato</EmptyStateTitle>
          <EmptyStateDescription>
            Crea il tuo primo allenamento o scegli tra quelli già creati per
            iniziare a tracciare i tuoi progressi
          </EmptyStateDescription>
        </EmptyStateContent>

        <CreateWorkoutButton
          onClick={openDialog}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <BiDumbbell size={20} />
          <span>Crea Allenamento</span>
        </CreateWorkoutButton>
      </EmptyStateContainer>

      <AnimatePresence>
        {addWorkoutDialog && (
          <ModalOverlay
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDialog}
          >
            <ModalContent
              as={motion.div}
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                {repeatWorkout || formOpen ? (
                  <BackButton
                    onClick={() => {
                      setRepeatWorkout(false);
                      setFormOpen(false);
                    }}
                  >
                    <FiArrowLeft size={20} />
                  </BackButton>
                ) : (
                  <div /> // Placeholder for flex spacing
                )}

                <ModalTitle>
                  {formOpen
                    ? 'Nuovo Allenamento'
                    : repeatWorkout
                    ? 'Seleziona Allenamento'
                    : 'Aggiungi Allenamento'}
                </ModalTitle>

                <CloseButton onClick={closeDialog}>
                  <MdClose size={20} />
                </CloseButton>
              </ModalHeader>

              <AnimatePresence mode='wait'>
                {!repeatWorkout && !formOpen && (
                  <OptionsContainer
                    as={motion.div}
                    key='options'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <OptionCard
                      onClick={() => {
                        console.log('Adding test workout...');
                        const workoutCompletato = {
                          name: 'Allenamento Full Body',
                          date: new Date(
                            '2025-03-24T10:00:00.000Z'
                          ).toISOString(),

                          sections: [
                            {
                              name: 'Riscaldamento',
                              exercises: [
                                {
                                  name: 'Corsa sul posto',
                                  notes:
                                    'Leggera, per aumentare la frequenza cardiaca',
                                  timeBased: true,
                                  exerciseSets: [
                                    {
                                      time: 300,
                                      rest: 60,
                                    },
                                  ],
                                },
                                {
                                  name: 'Stretching dinamico',
                                  timeBased: true,
                                  exerciseSets: [
                                    {
                                      time: 180,
                                      rest: 30,
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: 'Parte principale',
                              exercises: [
                                {
                                  name: 'Squat',
                                  notes: 'Mantieni la schiena dritta',
                                  timeBased: false,
                                  exerciseSets: [
                                    {
                                      weight: 60,
                                      reps: 12,
                                      rest: 90,
                                    },
                                    {
                                      weight: 70,
                                      reps: 10,
                                      rest: 90,
                                    },
                                    {
                                      weight: 75,
                                      reps: 8,
                                      rest: 120,
                                    },
                                  ],
                                },
                                {
                                  name: 'Panca piana',
                                  notes: 'Presa media',
                                  timeBased: false,
                                  exerciseSets: [
                                    {
                                      weight: 50,
                                      reps: 12,
                                      rest: 90,
                                    },
                                    {
                                      weight: 60,
                                      reps: 10,
                                      rest: 90,
                                    },
                                    {
                                      weight: 65,
                                      reps: 8,
                                      rest: 120,
                                    },
                                  ],
                                },
                                {
                                  name: 'Stacchi da terra',
                                  timeBased: false,
                                  exerciseSets: [
                                    {
                                      weight: 80,
                                      reps: 10,
                                      rest: 120,
                                    },
                                    {
                                      weight: 90,
                                      reps: 8,
                                      rest: 120,
                                    },
                                    {
                                      weight: 100,
                                      reps: 6,
                                      rest: 150,
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: 'Defaticamento',
                              exercises: [
                                {
                                  name: 'Stretching statico',
                                  timeBased: true,
                                  exerciseSets: [
                                    {
                                      time: 300,
                                      rest: 0,
                                    },
                                  ],
                                },
                              ],
                            },
                          ],

                          startTime: new Date(
                            '2025-03-24T10:00:00.000Z'
                          ).toISOString(),
                          endTime: new Date(
                            '2025-03-24T11:15:00.000Z'
                          ).toISOString(),
                          duration: 75,

                          notes:
                            'Allenamento completato con buona intensità. Da aumentare i carichi la prossima volta.',

                          completed: false,

                          feedback: {
                            feeling: 4,
                            energyLevel: 4,
                            difficulty: 3,
                            notes:
                              'Mi sono sentito in forma. Squat particolarmente efficaci oggi.',
                            completedAt: new Date(
                              '2025-03-24T11:20:00.000Z'
                            ).toISOString(),
                          },

                          createdAt: new Date(
                            '2025-03-24T09:45:00.000Z'
                          ).toISOString(),
                          updatedAt: new Date(
                            '2025-03-24T11:20:00.000Z'
                          ).toISOString(),
                        };

                        try {
                          console.log('Workout data:', workoutCompletato);
                          addWorkout(workoutCompletato);
                          console.log('Workout added successfully');
                          closeDialog();
                        } catch (error) {
                          console.error('Error adding workout:', error);
                        }
                      }}
                      whileHover={{
                        y: -4,
                        boxShadow: '0 10px 25px rgba(0, 198, 190, 0.2)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <OptionIconWrapper accent='primary'>
                        <TiMessageTyping size={24} />
                      </OptionIconWrapper>
                      <OptionContent>
                        <OptionTitle>Test Workout </OptionTitle>
                        <OptionDescription>
                          Add a test full body workout
                        </OptionDescription>
                      </OptionContent>
                    </OptionCard>
                    <OptionCard
                      onClick={() => setFormOpen(true)}
                      whileHover={{
                        y: -4,
                        boxShadow: '0 10px 25px rgba(0, 198, 190, 0.2)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <OptionIconWrapper accent='primary'>
                        <BiPlus size={24} />
                      </OptionIconWrapper>
                      <OptionContent>
                        <OptionTitle>Crea nuovo</OptionTitle>
                        <OptionDescription>
                          Crea un nuovo allenamento personalizzato
                        </OptionDescription>
                      </OptionContent>
                    </OptionCard>

                    <OptionCard
                      onClick={() => setRepeatWorkout(true)}
                      whileHover={{
                        y: -4,
                        boxShadow: '0 10px 25px rgba(0, 198, 190, 0.2)',
                      }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!workouts || workouts.length === 0}
                    >
                      <OptionIconWrapper accent='secondary'>
                        <BiRepeat size={24} />
                      </OptionIconWrapper>
                      <OptionContent>
                        <OptionTitle>Usa esistente</OptionTitle>
                        <OptionDescription>
                          {workouts && workouts.length > 0
                            ? `Scegli tra ${workouts.length} allenamenti esistenti`
                            : 'Non hai ancora allenamenti salvati'}
                        </OptionDescription>
                      </OptionContent>
                    </OptionCard>

                    <OptionCard
                      whileHover={{
                        y: -4,
                        boxShadow: '0 10px 25px rgba(0, 198, 190, 0.2)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <OptionIconWrapper accent='tertiary'>
                        <MdOutlineAutoAwesome size={24} />
                      </OptionIconWrapper>
                      <OptionContent>
                        <OptionTitle>Suggerisci allenamento</OptionTitle>
                        <OptionDescription>
                          Fatti suggerire un allenamento in base ai tuoi
                          obiettivi
                        </OptionDescription>
                        <ComingSoonBadge>Presto disponibile</ComingSoonBadge>
                      </OptionContent>
                    </OptionCard>
                  </OptionsContainer>
                )}

                {repeatWorkout && (
                  <motion.div
                    key='repeat'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ width: '100%' }}
                  >
                    <RepeatWorkout
                      workouts={workouts ?? []}
                      setRepeatWorkout={setRepeatWorkout}
                      setAddWorkoutDialog={setAddWorkoutDialog}
                      selectedDate={selectedDate} // Passa la data selezionata
                    />
                  </motion.div>
                )}

                {formOpen && (
                  <motion.div
                    key='form'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ width: '100%' }}
                  >
                    <WorkoutForm
                      closeForm={() => setFormOpen(false)}
                      selectedDate={selectedDate} // Passa la data selezionata
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}

export default NoWorkoutPage;

// Styled Components
const PageContainer = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const EmptyStateContainer = styled.div`
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
`;

const IllustrationWrapper = styled.div`
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;

  img {
    width: 100%;
    height: auto;
  }
`;

const EmptyStateContent = styled.div`
  margin-bottom: 32px;
`;

const EmptyStateTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.white};
`;

const EmptyStateDescription = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.white70};
  max-width: 350px;
  margin: 0 auto;
`;

const CreateWorkoutButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  padding: 16px 32px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 198, 190, 0.3);
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  background: ${({ theme }) => theme.colors.dark};
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  overflow-y: auto;
`;

const OptionCard = styled(motion.div)<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 16px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme, disabled }) =>
      disabled ? theme.colors.white05 : theme.colors.white10};
  }
`;

const OptionIconWrapper = styled.div<{
  accent: 'primary' | 'secondary' | 'tertiary';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  margin-right: 16px;
  flex-shrink: 0;

  background: ${({ theme, accent }) =>
    accent === 'primary'
      ? `${theme.colors.neon}20`
      : accent === 'secondary'
      ? `${theme.colors.white20}`
      : `${theme.colors.white10}`};

  color: ${({ theme, accent }) =>
    accent === 'primary'
      ? theme.colors.neon
      : accent === 'secondary'
      ? theme.colors.white
      : theme.colors.white70};
`;

const OptionContent = styled.div`
  flex: 1;
  position: relative;
`;

const OptionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: ${({ theme }) => theme.colors.white};
`;

const OptionDescription = styled.p`
  font-size: 14px;
  margin: 0;
  color: ${({ theme }) => theme.colors.white70};
  line-height: 1.4;
`;

const ComingSoonBadge = styled.div`
  display: inline-block;
  margin-top: 8px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white70};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;
