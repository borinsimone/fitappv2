import React, { useEffect, useState } from 'react';
import { BiCheckCircle, BiMinusCircle } from 'react-icons/bi';
import styled from 'styled-components';
import { useWorkouts } from '../../../context/WorkoutContext';
import Timer from './Timer';

interface WorkoutSection {
  exercises: Exercise[];
}

interface Exercise {
  name: string;
  timeBased: boolean;
  exerciseSets: Array<{
    weight?: number;
    reps?: number;
    time?: number;
    rest: number;
  }>;
}

interface ActiveExerciseProps {
  currentExercise:
    | {
        name: string;
        timeBased: boolean;
        exerciseSets: Array<{
          weight?: number;
          reps?: number;
          time?: number;
          rest: number;
        }>;
      }
    | undefined;
  currentSectionIndex: number;
  currentExerciseIndex: number;
}
function ActiveExercise({
  currentExercise,
  currentSectionIndex,
  currentExerciseIndex,
}: ActiveExerciseProps) {
  const { activeWorkout } = useWorkouts();

  interface CompletedSets {
    [key: string]: boolean[];
  }

  const handleSetComplete = (setIndex: number) => {
    const key = `${currentSectionIndex}-${currentExerciseIndex}`;

    setCompletedSets((prev: CompletedSets) => ({
      ...prev,
      [key]: prev[key].map((completed: boolean, index: number) =>
        index === setIndex ? !completed : completed
      ),
    }));
  };
  const [completedSets, setCompletedSets] = useState<CompletedSets>({});

  // Add this useEffect to initialize completedSets
  useEffect(() => {
    if (activeWorkout?.sections) {
      const initialCompletedSets: CompletedSets = {};
      activeWorkout.sections.forEach(
        (section: WorkoutSection, sectionIndex: number) => {
          section.exercises.forEach(
            (exercise: Exercise, exerciseIndex: number) => {
              const key: string = `${sectionIndex}-${exerciseIndex}`;
              initialCompletedSets[key] = new Array<boolean>(
                exercise.exerciseSets.length
              ).fill(false);
            }
          );
        }
      );
      setCompletedSets(initialCompletedSets);
    }
  }, [activeWorkout]);
  // Update the state definition with proper type
  const [activeSet, setActiveSet] = useState<number | ExerciseSet | undefined>(
    currentExercise?.exerciseSets[0]
  );

  interface ExerciseSet {
    weight?: number;
    reps?: number;
    time?: number;
    rest: number;
  }

  const handleSetClick = (set: ExerciseSet | number): void => {
    setActiveSet(set);
  };
  return (
    <Container>
      <Timer
        activeSet={activeSet}
        name={currentExercise?.name}
      />
      <SetTable>
        <thead>
          {currentExercise?.timeBased ? (
            <tr>
              <th>Set</th>
              <th>Time</th>
              <th>Rest</th>
              <th></th>
              <th>Completed</th>
            </tr>
          ) : (
            <tr>
              <th>Set</th>
              <th>Weight</th>
              <th>Reps</th>
              <th>Rest</th>
              <th></th>
              <th>Completed</th>
            </tr>
          )}
        </thead>
        <tbody>
          {currentExercise?.timeBased
            ? currentExercise?.exerciseSets.map((set, index) => (
                <tr
                  key={index}
                  data-active={activeSet === set}
                >
                  <td>{index + 1}</td>
                  <td>{set.time}"</td>
                  <td>{set.rest}"</td>
                  <td onClick={() => handleSetClick(set)}>
                    {activeSet === set ? 'attivo' : 'scegli'}
                  </td>
                  <td>
                    <CompletionButton
                      onClick={() => handleSetComplete(index)}
                      completed={
                        completedSets[
                          `${currentSectionIndex}-${currentExerciseIndex}`
                        ]?.[index]
                      }
                    >
                      {completedSets[
                        `${currentSectionIndex}-${currentExerciseIndex}`
                      ]?.[index] ? (
                        <BiCheckCircle />
                      ) : (
                        <BiMinusCircle />
                      )}
                    </CompletionButton>
                  </td>
                </tr>
              ))
            : currentExercise?.exerciseSets.map((set, index) => (
                <tr
                  key={index}
                  data-active={activeSet === set}
                >
                  <td>{index + 1}</td>
                  <td>{set.weight}kg</td>
                  <td>{set.reps}</td>
                  <td>{set.rest}"</td>
                  <td onClick={() => handleSetClick(set)}>
                    {activeSet === set ? 'attivo' : 'scegli'}
                  </td>
                  <td>
                    <CompletionButton
                      onClick={() => handleSetComplete(index)}
                      completed={
                        completedSets[
                          `${currentSectionIndex}-${currentExerciseIndex}`
                        ]?.[index]
                      }
                    >
                      {completedSets[
                        `${currentSectionIndex}-${currentExerciseIndex}`
                      ]?.[index] ? (
                        <BiCheckCircle />
                      ) : (
                        <BiMinusCircle />
                      )}
                    </CompletionButton>
                  </td>
                </tr>
              ))}
        </tbody>
      </SetTable>
    </Container>
  );
}

export default ActiveExercise;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white10};
  width: 100%;

  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.neon};
`;
const ExerciseTitle = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  margin-bottom: 20px;
`;

const SetTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 8px;
    text-align: center;
    color: ${({ theme }) => theme.colors.white};
    button {
      margin: 0 auto;
    }
  }
  th {
    font-size: 14px;
    opacity: 0.8;
  }
  td {
    font-size: 14px;
  }
  tr {
    cursor: pointer;
    transition: all 0.2s ease;

    &[data-active='true'] {
      background: ${({ theme }) => `${theme.colors.neon}20`};
      border-left: 4px solid ${({ theme }) => theme.colors.neon};
    }
  }
`;
const CompletionButton = styled.button<{ completed: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  color: ${({ completed, theme }) =>
    completed ? theme.colors.success : theme.colors.error};

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;
