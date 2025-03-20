import React, { useState } from 'react';
import styled from 'styled-components';
import {
  BiChevronDown,
  BiPlus,
  BiTrash,
  BiDumbbell,
  BiPlay,
  BiTime,
  BiEdit,
  BiPencil,
} from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkouts } from '../../context/WorkoutContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

interface WorkoutPreviewProps {
  workout: {
    _id: string;
    name: string;
    sections?: {
      name: string;
      exercises: {
        name: string;
        notes?: string;
        timeBased: boolean;
        exerciseSets: {
          time: number;
          weight: number;
          reps: number;
          rest: number;
        }[];
      }[];
    }[];
  };
}

const WorkoutPreview: React.FC<WorkoutPreviewProps> = ({ workout }) => {
  const { removeWorkout, setActiveWorkout } = useWorkouts();
  const [selectedWorkout, setSelectedWorkout] = useState(workout);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleExerciseClick = (exerciseName: string) => {
    setExpandedExercise(
      expandedExercise === exerciseName ? null : exerciseName
    );
  };

  const handleAddSet = (sectionIndex: number, exerciseIndex: number) => {
    const newWorkout = { ...workout };
    if (!newWorkout.sections) return;

    const exercise = newWorkout.sections[sectionIndex].exercises[exerciseIndex];
    const lastSet = exercise.exerciseSets[exercise.exerciseSets.length - 1];

    const newSet = exercise.timeBased
      ? {
          time: lastSet?.time || 30,
          weight: 0,
          reps: 0,
          rest: lastSet?.rest || 60,
        }
      : {
          time: 0,
          reps: lastSet?.reps || 12,
          weight: lastSet?.weight || 0,
          rest: lastSet?.rest || 60,
        };

    exercise.exerciseSets.push(newSet);
    setSelectedWorkout(newWorkout);
  };

  const handleRemoveSet = (
    sectionIndex: number,
    exerciseIndex: number,
    setIndex: number
  ) => {
    const newWorkout = { ...workout };
    if (!newWorkout.sections) return;

    newWorkout.sections[sectionIndex].exercises[
      exerciseIndex
    ].exerciseSets.splice(setIndex, 1);
    setSelectedWorkout(newWorkout);
  };

  const handleDeleteWorkout = () => {
    try {
      removeWorkout(selectedWorkout._id);
    } catch (error) {
      console.error('Error removing workout:', error);
    }
  };

  const startWorkout = () => {
    setActiveWorkout({
      ...workout,
      title: workout.name,
      load: 0,
      reps: 0,
      notes: '',
    });
    navigate('/workout-assistant');
  };

  return (
    <Container
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Header>
        <WorkoutTitle>{selectedWorkout.name}</WorkoutTitle>
        <DeleteButton onClick={handleDeleteWorkout}>
          <BiTrash />
        </DeleteButton>
      </Header>

      <WorkoutContent>
        {selectedWorkout.sections?.map((section, sectionIndex) => (
          <SectionCard key={`section-${sectionIndex}`}>
            <SectionHeader>
              <SectionTitle>{section.name}</SectionTitle>
            </SectionHeader>

            <ExerciseList>
              {section.exercises.map((exercise, exerciseIndex) => (
                <ExerciseCard key={`exercise-${exerciseIndex}`}>
                  <ExerciseHeader
                    onClick={() => handleExerciseClick(exercise.name)}
                    whileHover={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <ExerciseIcon>
                      {exercise.timeBased ? (
                        <BiTime size={20} />
                      ) : (
                        <BiDumbbell size={20} />
                      )}
                    </ExerciseIcon>

                    <ExerciseInfo>
                      <ExerciseName>{exercise.name}</ExerciseName>
                      <ExerciseMeta>
                        {exercise.exerciseSets.length} sets •
                        {exercise.timeBased
                          ? ` ${exercise.exerciseSets[0]?.time || 0}s`
                          : ` ${exercise.exerciseSets[0]?.reps || 0} reps`}
                      </ExerciseMeta>
                    </ExerciseInfo>

                    <ExpandButton
                      isExpanded={expandedExercise === exercise.name}
                    >
                      <BiChevronDown size={24} />
                    </ExpandButton>
                  </ExerciseHeader>

                  <AnimatePresence>
                    {expandedExercise === exercise.name && (
                      <ExerciseDetails
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {exercise.notes && (
                          <ExerciseNotes>
                            <NotesTitle>
                              <BiPencil size={16} />
                              Notes
                            </NotesTitle>
                            <NotesContent>{exercise.notes}</NotesContent>
                          </ExerciseNotes>
                        )}

                        <SetsTableWrapper>
                          {exercise.timeBased ? (
                            <SetsTable>
                              <thead>
                                <tr>
                                  <th>Set</th>
                                  <th>Time (s)</th>
                                  <th>Rest (s)</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {exercise.exerciseSets.map((set, index) => (
                                  <tr key={`set-${index}`}>
                                    <td>{index + 1}</td>
                                    <td>
                                      <EditableValue
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={(e) => {
                                          const target = e.currentTarget;
                                          target.textContent = (
                                            target.textContent ?? ''
                                          ).replace(/[^0-9]/g, '');
                                        }}
                                      >
                                        {set.time}
                                      </EditableValue>
                                    </td>
                                    <td>
                                      <EditableValue
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={(e) => {
                                          const target = e.currentTarget;
                                          target.textContent = (
                                            target.textContent ?? ''
                                          ).replace(/[^0-9]/g, '');
                                        }}
                                      >
                                        {set.rest}
                                      </EditableValue>
                                    </td>
                                    <td>
                                      <RemoveSetButton
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveSet(
                                            sectionIndex,
                                            exerciseIndex,
                                            index
                                          );
                                        }}
                                        disabled={
                                          exercise.exerciseSets.length <= 1
                                        }
                                      >
                                        <BiTrash size={16} />
                                      </RemoveSetButton>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </SetsTable>
                          ) : (
                            <SetsTable>
                              <thead>
                                <tr>
                                  <th>Set</th>
                                  <th>Reps</th>
                                  <th>Weight (kg)</th>
                                  <th>Rest (s)</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {exercise.exerciseSets.map((set, index) => (
                                  <tr key={`set-${index}`}>
                                    <td>{index + 1}</td>
                                    <td>
                                      <EditableValue
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={(e) => {
                                          const target = e.currentTarget;
                                          target.textContent = (
                                            target.textContent ?? ''
                                          ).replace(/[^0-9]/g, '');
                                        }}
                                      >
                                        {set.reps}
                                      </EditableValue>
                                    </td>
                                    <td>
                                      <EditableValue
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={(e) => {
                                          const target = e.currentTarget;
                                          target.textContent = (
                                            target.textContent ?? ''
                                          ).replace(/[^0-9]/g, '');
                                        }}
                                      >
                                        {set.weight}
                                      </EditableValue>
                                    </td>
                                    <td>
                                      <EditableValue
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={(e) => {
                                          const target = e.currentTarget;
                                          target.textContent = (
                                            target.textContent ?? ''
                                          ).replace(/[^0-9]/g, '');
                                        }}
                                      >
                                        {set.rest}
                                      </EditableValue>
                                    </td>
                                    <td>
                                      <RemoveSetButton
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveSet(
                                            sectionIndex,
                                            exerciseIndex,
                                            index
                                          );
                                        }}
                                        disabled={
                                          exercise.exerciseSets.length <= 1
                                        }
                                      >
                                        <BiTrash size={16} />
                                      </RemoveSetButton>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </SetsTable>
                          )}
                        </SetsTableWrapper>

                        <ActionBar>
                          <AddSetButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddSet(sectionIndex, exerciseIndex);
                            }}
                          >
                            <BiPlus size={16} />
                            Add Set
                          </AddSetButton>

                          <EditExerciseButton>
                            <BiEdit size={16} />
                            Edit
                          </EditExerciseButton>
                        </ActionBar>
                      </ExerciseDetails>
                    )}
                  </AnimatePresence>
                </ExerciseCard>
              ))}
            </ExerciseList>
          </SectionCard>
        ))}
      </WorkoutContent>

      <Button
        onClick={startWorkout}
        // whileHover={{ scale: 1.02 }}
        // whileTap={{ scale: 0.98 }}
      >
        <BiPlay size={24} />
        Inizia Allenamento
      </Button>
    </Container>
  );
};

export default WorkoutPreview;

// Styled Components
const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 0 24px;
  /* overflow: hidden; */
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};
  margin-bottom: 24px;
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.dark};
  z-index: 10;
`;

const WorkoutTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neon};
  margin: 0;
`;

const DeleteButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.error};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;

const WorkoutContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  padding: 0 0 80px;
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 16px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: ${({ theme }) => theme.colors.white10};
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};
  position: sticky;
  top: 0;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neon};
  margin: 0;
  text-transform: uppercase;
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExerciseCard = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};

  &:last-child {
    border-bottom: none;
  }
`;

const ExerciseHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

const ExerciseIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.neon};
  margin-right: 16px;
  flex-shrink: 0;
`;

const ExerciseInfo = styled.div`
  flex: 1;
`;

const ExerciseName = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const ExerciseMeta = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white50};
`;

const ExpandButton = styled.div<{ isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  transform: rotate(${({ isExpanded }) => (isExpanded ? '180deg' : '0deg')});
  color: ${({ theme }) => theme.colors.white50};
`;

const ExerciseDetails = styled(motion.div)`
  padding: 0 16px 16px;
  overflow: hidden;
`;

const ExerciseNotes = styled.div`
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 8px;
  padding: 12px;
`;

const NotesTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white70};
  margin-bottom: 8px;
`;

const NotesContent = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.white};
  white-space: pre-wrap;
`;

const SetsTableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: 16px;
`;

const SetsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th {
    text-align: left;
    padding: 12px 8px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.white70};
    text-transform: uppercase;
    font-size: 12px;
  }

  td {
    padding: 10px 8px;
    text-align: left;
  }

  tbody tr {
    border-top: 1px solid ${({ theme }) => theme.colors.white10};

    &:hover {
      background: ${({ theme }) => theme.colors.white05};
    }
  }
`;

const EditableValue = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 30px;
  display: inline-block;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.neon};
    background: ${({ theme }) => theme.colors.white10};
  }
`;

const RemoveSetButton = styled.button<{ disabled: boolean }>`
  all: unset;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.error};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;

const ActionBar = styled.div`
  display: flex;
  gap: 12px;
`;

const AddSetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
  }
`;

const EditExerciseButton = styled(AddSetButton)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.white20};

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
  }
`;

const StartWorkoutButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: calc(100% - 32px);
  /* margin: 0 16px; */
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  border: none;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  position: fixed;
  bottom: 80px;
  max-width: 768px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 100;
`;
