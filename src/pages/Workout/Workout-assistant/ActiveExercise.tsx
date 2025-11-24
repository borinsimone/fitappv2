import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  useWorkouts,
  Exercise,
  WorkoutSet as ExerciseSet,
  Section as WorkoutSection,
} from "../../../context/WorkoutContext";
import Timer from "./Timer";
import SetActive from "./SetActive";

type CurrentExerciseType = Exercise | undefined;

interface ActiveExerciseProps {
  currentExercise: CurrentExerciseType;
  setCurrentExercise: React.Dispatch<
    React.SetStateAction<Exercise | undefined>
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
    ExerciseSet | undefined
  >(currentExercise?.exerciseSets[0]);

  const handleSetClick = (set: ExerciseSet): void => {
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
        currentExercise={currentExercise || null}
        updateExercise={(exercise) =>
          setCurrentExercise(exercise)
        }
        activeSet={activeSet || null}
        handleSetClick={handleSetClick}
        handleSetComplete={handleSetComplete}
        completedSets={completedSets}
        currentSectionIndex={currentSectionIndex}
        currentExerciseIndex={currentExerciseIndex}
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
