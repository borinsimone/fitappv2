import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useWorkouts } from "../../../context/WorkoutContext";
import Timer from "./Timer";
import SetActive from "./SetActive";

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

type CurrentExerciseType =
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

interface ActiveExerciseProps {
  currentExercise: CurrentExerciseType;
  setCurrentExercise: React.Dispatch<
    React.SetStateAction<CurrentExerciseType>
  >;
  currentSectionIndex: number;
  currentExerciseIndex: number;
}
function ActiveExercise({
  currentExercise,
  setCurrentExercise,
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
      [key]: prev[key].map(
        (completed: boolean, index: number) =>
          index === setIndex ? !completed : completed
      ),
    }));
  };
  const [completedSets, setCompletedSets] =
    useState<CompletedSets>({});

  // Add this useEffect to initialize completedSets
  // Modifica l'initializzazione di completedSets per evitare aggiornamenti continui
  useEffect(() => {
    if (activeWorkout?.sections) {
      // Controlla se completedSets è già stato inizializzato
      const isAlreadyInitialized =
        Object.keys(completedSets).length > 0;

      // Se è già inizializzato, non fare nulla
      if (isAlreadyInitialized) return;

      console.log("Initializing completedSets");
      const initialCompletedSets: CompletedSets = {};
      activeWorkout.sections.forEach(
        (section: WorkoutSection, sectionIndex: number) => {
          section.exercises.forEach(
            (exercise: Exercise, exerciseIndex: number) => {
              const key: string = `${sectionIndex}-${exerciseIndex}`;
              initialCompletedSets[key] =
                new Array<boolean>(
                  exercise.exerciseSets.length
                ).fill(false);
            }
          );
        }
      );
      setCompletedSets(initialCompletedSets);
    }
  }, [activeWorkout, completedSets]);
  // Update the state definition with proper type
  const [activeSet, setActiveSet] = useState<
    number | ExerciseSet | undefined
  >(currentExercise?.exerciseSets[0]);

  interface ExerciseSet {
    weight?: number;
    reps?: number;
    time?: number;
    rest: number;
  }

  const handleSetClick = (
    set: ExerciseSet | number
  ): void => {
    setActiveSet(set);
  };
  useEffect(() => {
    if (currentExercise?.exerciseSets) {
      setActiveSet(currentExercise.exerciseSets[0]);
    }
  }, [currentExercise]);
  return (
    <Container>
      <Timer
        activeSet={activeSet}
        name={currentExercise?.name}
      />
      <SetActive
        currentExercise={currentExercise}
        updateExercise={setCurrentExercise}
        activeSet={activeSet}
        handleSetClick={handleSetClick}
        handleSetComplete={handleSetComplete}
        completedSets={completedSets}
        currentSectionIndex={currentSectionIndex}
      />
    </Container>
  );
}

export default ActiveExercise;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  background-color: ${({ theme }) => theme.colors.white10};
  width: 100%;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.neon};
  padding: 20px;
`;
