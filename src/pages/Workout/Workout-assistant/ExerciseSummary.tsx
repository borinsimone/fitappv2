import styled from "styled-components";
import { motion } from "framer-motion";
import {
  BiDumbbell,
  BiTime,
  BiCheck,
  BiListOl,
} from "react-icons/bi";
import { Exercise } from "../../../context/WorkoutContext";

interface ExerciseSummaryProps {
  nextExercises: Exercise[];
  prevExercises: Exercise[];
  currentExerciseIndex: number;
  setCurrentExerciseIndex: (index: number) => void;
  setCurrentExercise: (exercise: Exercise) => void;
}

function ExerciseSummary({
  nextExercises,
  prevExercises,
  currentExerciseIndex,
  setCurrentExerciseIndex,
  setCurrentExercise,
}: ExerciseSummaryProps) {
  return (
    <Container>
      {nextExercises?.length > 0 && (
        <SectionTitle>Coming Up Next</SectionTitle>
      )}

      <ExerciseList>
        {nextExercises.map((exercise, index) => (
          <UpcomingExerciseItem
            key={`next-${index}`}
            as={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setCurrentExercise(exercise);
              setCurrentExerciseIndex(
                currentExerciseIndex + index + 1
              );
            }}
            $isNext={index === 0}
          >
            <ExerciseNumber>
              {index === 0 ? (
                <NextLabel>NEXT</NextLabel>
              ) : (
                <NumberLabel>{index + 1}</NumberLabel>
              )}
            </ExerciseNumber>

            <ExerciseContent>
              <ExerciseName>{exercise.name}</ExerciseName>

              <ExerciseMetrics>
                <MetricItem>
                  <BiListOl size={14} />
                  <span>
                    {exercise.exerciseSets.length} sets
                  </span>
                </MetricItem>

                <MetricItem>
                  {exercise.timeBased ? (
                    <>
                      <BiTime size={14} />
                      <span>
                        {exercise.exerciseSets[0]?.time}"
                        each
                      </span>
                    </>
                  ) : (
                    <>
                      <BiDumbbell size={14} />
                      <span>
                        {exercise.exerciseSets[0]?.reps}{" "}
                        reps
                      </span>
                    </>
                  )}
                </MetricItem>
              </ExerciseMetrics>
            </ExerciseContent>
          </UpcomingExerciseItem>
        ))}
      </ExerciseList>

      {nextExercises.length === 0 &&
        prevExercises.length === 0 && (
          <EmptyState>
            <BiDumbbell size={32} opacity={0.5} />
            <EmptyTitle>No exercises to display</EmptyTitle>
          </EmptyState>
        )}
      {prevExercises?.length > 0 && (
        <SectionTitle>Completed Exercises</SectionTitle>
      )}
      <ExerciseList>
        {prevExercises?.map((exercise, index) => (
          <CompletedExerciseItem
            key={`prev-${index}`}
            as={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
            }}
          >
            <ExerciseStatus>
              <StatusIcon>
                <BiCheck size={18} />
              </StatusIcon>
            </ExerciseStatus>

            <ExerciseContent>
              <ExerciseName>{exercise.name}</ExerciseName>

              <ExerciseMetrics>
                <MetricItem>
                  <BiListOl size={14} />
                  <span>
                    {exercise.exerciseSets.length} sets
                  </span>
                </MetricItem>

                <MetricItem>
                  {exercise.timeBased ? (
                    <>
                      <BiTime size={14} />
                      <span>
                        {exercise.exerciseSets[0]?.time}"
                        each
                      </span>
                    </>
                  ) : (
                    <>
                      <BiDumbbell size={14} />
                      <span>
                        {exercise.exerciseSets[0]?.reps}{" "}
                        reps
                      </span>
                    </>
                  )}
                </MetricItem>
              </ExerciseMetrics>
            </ExerciseContent>
          </CompletedExerciseItem>
        ))}
      </ExerciseList>
    </Container>
  );
}

export default ExerciseSummary;

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white70};
  margin: 16px 0 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BaseExerciseItem = styled(motion.div)`
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 12px 16px;
  position: relative;
  overflow: hidden;
`;

const UpcomingExerciseItem = styled(BaseExerciseItem)<{
  $isNext: boolean;
}>`
  background: ${({ theme, $isNext }) =>
    $isNext
      ? `linear-gradient(90deg, ${theme.colors.neon}10, ${theme.colors.white}10)`
      : theme.colors.white10};
  border: 1px solid
    ${({ theme, $isNext }) =>
      $isNext ? theme.colors.neon : "transparent"};
  box-shadow: ${({ $isNext }) =>
    $isNext ? "0 4px 12px rgba(0, 198, 190, 0.1)" : "none"};
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: ${({ theme }) => theme.colors.neon};
    opacity: ${({ $isNext }) => ($isNext ? 1 : 0)};
    transition: opacity 0.2s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const CompletedExerciseItem = styled(BaseExerciseItem)`
  background: ${({ theme }) => theme.colors.white05};
  opacity: 0.8;
`;

const ExerciseContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ExerciseName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const ExerciseMetrics = styled.div`
  display: flex;
  gap: 12px;
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white70};

  svg {
    color: ${({ theme }) => theme.colors.white50};
  }
`;

const ExerciseNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  margin-right: 12px;
`;

const NumberLabel = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
`;

const NextLabel = styled.div`
  padding: 5px 10px;
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
`;

const ExerciseStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  margin-right: 12px;
`;

const StatusIcon = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.success}30;
  color: ${({ theme }) => theme.colors.success};
  border-radius: 50%;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 12px;
  color: ${({ theme }) => theme.colors.white50};
`;

const EmptyTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
`;
