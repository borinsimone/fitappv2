import { useEffect, useState } from 'react';
import { useWorkouts } from '../../../context/WorkoutContext';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import styled from 'styled-components';
import ActiveExercise from './ActiveExercise';
interface CompletedSets {
  [key: string]: boolean[];
}
const WorkoutAssistant = () => {
  const { activeWorkout } = useWorkouts();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const currentSection = activeWorkout?.sections?.[currentSectionIndex];
  const currentExercise = currentSection?.exercises?.[currentExerciseIndex];
  const nextExercises =
    currentSection?.exercises.slice(currentExerciseIndex + 1) || [];
  const prevExercises =
    currentSection?.exercises.slice(0, currentExerciseIndex) || [];

  const handleNextSection = () => {
    if (currentSectionIndex < (activeWorkout?.sections?.length || 0) - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      setCurrentExerciseIndex(0);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
      setCurrentExerciseIndex(0);
    }
  };

  // Add this function to handle set completion

  return (
    <Container>
      <SectionInfo>
        SEZIONE {currentSectionIndex + 1}/{activeWorkout?.sections?.length || 0}
      </SectionInfo>
      <Header>
        <NavigationBar>
          <NavButton
            onClick={handlePrevSection}
            disabled={currentSectionIndex === 0}
          >
            <BiChevronLeft size='24px' />
          </NavButton>
          <SectionTitle>{currentSection?.name}</SectionTitle>

          <NavButton
            onClick={handleNextSection}
            disabled={
              currentSectionIndex === (activeWorkout?.sections?.length || 0) - 1
            }
          >
            <BiChevronRight size='24px' />
          </NavButton>
        </NavigationBar>
        <CloseButton>&times;</CloseButton>
      </Header>

      <ActiveExercise
        currentExercise={currentExercise}
        currentSectionIndex={currentSectionIndex}
        currentExerciseIndex={currentExerciseIndex}
      />
      <ExerciseSummary>
        {nextExercises.map((exercise, index) => (
          <ExerciseItem
            key={index}
            onClick={() =>
              setCurrentExerciseIndex(currentExerciseIndex + index + 1)
            }
          >
            <ExerciseIcon />
            <ExerciseDetails>
              <ExerciseName>{exercise.name}</ExerciseName>
              <ExerciseInfo>{exercise.exerciseSets.length} SERIE</ExerciseInfo>
              <ExerciseInfo>
                {exercise.timeBased
                  ? `${exercise.exerciseSets[0]?.time}"`
                  : `${exercise.exerciseSets[0]?.reps} REPS`}
              </ExerciseInfo>
            </ExerciseDetails>
          </ExerciseItem>
        ))}
        {prevExercises?.map((exercise, index) => (
          <ExerciseItem
            key={index}
            className='disabled'
          >
            <ExerciseIcon />
            <ExerciseDetails>
              <ExerciseName>{exercise.name}</ExerciseName>
              <ExerciseInfo>{exercise.exerciseSets.length} SERIE</ExerciseInfo>
              <ExerciseInfo>
                {exercise.timeBased
                  ? `${exercise.exerciseSets[0]?.time}"`
                  : `${exercise.exerciseSets[0]?.reps} REPS`}
              </ExerciseInfo>
            </ExerciseDetails>
          </ExerciseItem>
        ))}
      </ExerciseSummary>
    </Container>
  );
};

export default WorkoutAssistant;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.dark};
  height: 100vh;
  width: 100vw;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 100px;
  margin-bottom: 20px;
  padding: 5px 16px;
  background-color: ${({ theme }) => `${theme.colors.neon}10`};
`;

const CloseButton = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
`;

const SectionTitle = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.neon};
`;

const ExerciseSummary = styled.div`
  width: 100%;
  max-width: 400px;
  .disabled {
    all: unset;
    background-color: ${({ theme }) => `${theme.colors.white}30`};
    user-select: none;
    display: flex;
    align-items: center;

    border-radius: 12px;
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }
`;
const ExerciseItem = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.white10};
  border: 1px solid ${({ theme }) => theme.colors.neon};
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: ${({ theme }) => theme.colors.neon};
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ExerciseIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  margin-right: 10px;
`;

const ExerciseDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExerciseName = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white};
`;

const ExerciseInfo = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.white};
  opacity: 0.8;
`;
const NavigationBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavButton = styled.button<{ disabled?: boolean }>`
  all: unset;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.neon};
  background: ${({ theme }) => theme.colors.white10};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.white20};
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

const SectionInfo = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
`;
