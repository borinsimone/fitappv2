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
  completedSets: Record<string, boolean[]>;
  handleSetComplete: (index: number) => void;
}
function ActiveExercise({
  currentExercise,
  setCurrentExercise,
  currentSectionIndex,
  currentExerciseIndex,
  completedSets,
  handleSetComplete,
}: ActiveExerciseProps) {
  const { activeWorkout } = useWorkouts();

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
  gap: 24px;
  width: 100%;
  padding-bottom: 20px;
`;
