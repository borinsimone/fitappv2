import { useEffect, useState } from "react";
import { useWorkouts } from "../../../context/WorkoutContext";
import {
  BiChevronLeft,
  BiChevronRight,
} from "react-icons/bi";
import styled from "styled-components";
import ActiveExercise from "./ActiveExercise";
import ExerciseSummary from "./ExerciseSummary";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import FeedBackForm from "./FeedBackForm";
import WorkoutDuration from "./WorkoutDuration";
import {
  Exercise,
  Section as WorkoutSection,
} from "../../../context/WorkoutContext";

const WorkoutAssistant = () => {
  const { activeWorkout, setActiveWorkout } = useWorkouts();
  const [currentSectionIndex, setCurrentSectionIndex] =
    useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] =
    useState(0);
  const [feedbackFormOpen, setFeedbackFormOpen] =
    useState(false);

  interface CompletedSets {
    [key: string]: boolean[];
  }

  const [completedSets, setCompletedSets] =
    useState<CompletedSets>(() => {
      const saved = localStorage.getItem("completedSets");
      return saved ? JSON.parse(saved) : {};
    });

  useEffect(() => {
    localStorage.setItem(
      "completedSets",
      JSON.stringify(completedSets)
    );
  }, [completedSets]);

  useEffect(() => {
    if (activeWorkout?.sections) {
      const isAlreadyInitialized =
        Object.keys(completedSets).length > 0;

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

  const currentSection =
    activeWorkout?.sections?.[currentSectionIndex];
  const [currentExercise, setCurrentExercise] = useState(
    currentSection?.exercises?.[currentExerciseIndex]
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!activeWorkout) {
      navigate("/workout-planner");
    }
  }, [activeWorkout, navigate]);

  useEffect(() => {
    if (activeWorkout && !activeWorkout.startTime) {
      const updatedWorkout = {
        ...activeWorkout,
        startTime: new Date().toISOString(),
      };
      setActiveWorkout(updatedWorkout);
      localStorage.setItem(
        "activeWorkout",
        JSON.stringify(updatedWorkout)
      );
    }
  }, [activeWorkout, setActiveWorkout]);

  const nextExercises =
    currentSection?.exercises.slice(
      currentExerciseIndex + 1
    ) || [];
  const prevExercises =
    currentSection?.exercises.slice(
      0,
      currentExerciseIndex
    ) || [];

  const handleNextSection = () => {
    if (
      currentSectionIndex <
      (activeWorkout?.sections?.length || 0) - 1
    ) {
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

  // Modifica questo useEffect che causa il ciclo infinito
  useEffect(() => {
    // Aggiungi una condizione per evitare aggiornamenti inutili
    if (
      activeWorkout &&
      currentExercise &&
      JSON.stringify(
        activeWorkout.sections[currentSectionIndex]
          .exercises[currentExerciseIndex]
      ) !== JSON.stringify(currentExercise)
    ) {
      console.log(
        "Updating activeWorkout with currentExercise changes"
      );
      const updatedWorkout = { ...activeWorkout };
      updatedWorkout.sections[
        currentSectionIndex
      ].exercises[currentExerciseIndex] = currentExercise;
      setActiveWorkout(updatedWorkout);
      localStorage.setItem(
        "activeWorkout",
        JSON.stringify(updatedWorkout)
      );
    }
  }, [
    currentExercise,
    activeWorkout,
    currentExerciseIndex,
    currentSectionIndex,
    setActiveWorkout,
  ]);
  const endWorkout = () => {
    console.log(activeWorkout);
    setFeedbackFormOpen(true);
    // if (window.confirm('Are you sure you want to end this workout?')) {
    //   localStorage.removeItem('activeWorkout');
    //   setActiveWorkout(null);
    //   navigate('/workout-planner');
    // }
  };

  return (
    <Container>
      <Header>
        <TimerBadge>
          <span>Time:</span>
          <WorkoutDuration
            start={activeWorkout?.startTime}
          />
        </TimerBadge>

        <CloseButton
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to leave?"
              )
            ) {
              localStorage.removeItem("activeWorkout");
              localStorage.removeItem("completedSets");
              setActiveWorkout(null);
            }
          }}
        >
          <MdClose size="20px" />
        </CloseButton>
      </Header>

      <NavigationBar>
        <NavButton
          onClick={handlePrevSection}
          disabled={currentSectionIndex === 0}
        >
          <BiChevronLeft size="28px" />
        </NavButton>
        <SectionTitle>{currentSection?.name}</SectionTitle>

        <NavButton
          onClick={handleNextSection}
          disabled={
            currentSectionIndex ===
            (activeWorkout?.sections?.length || 0) - 1
          }
        >
          <BiChevronRight size="28px" />
        </NavButton>
      </NavigationBar>

      <ActiveExercise
        currentExercise={currentExercise}
        setCurrentExercise={setCurrentExercise}
        currentSectionIndex={currentSectionIndex}
        currentExerciseIndex={currentExerciseIndex}
        completedSets={completedSets}
        handleSetComplete={handleSetComplete}
      />
      <ExerciseSummary
        nextExercises={nextExercises}
        prevExercises={prevExercises}
        currentExerciseIndex={currentExerciseIndex}
        setCurrentExerciseIndex={setCurrentExerciseIndex}
        setCurrentExercise={setCurrentExercise}
        completedSets={completedSets}
        currentSectionIndex={currentSectionIndex}
      />
      <EndButton
        onClick={() => {
          endWorkout();
        }}
      >
        Finish Workout
      </EndButton>
      <FeedBackForm
        isOpen={feedbackFormOpen}
        onClose={() => setFeedbackFormOpen(false)}
      />
    </Container>
  );
};

export default WorkoutAssistant;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  padding-bottom: 100px; /* Space for fixed bottom button */
  background: ${({ theme }) => theme.colors.dark};
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 8px;
  margin-bottom: 8px;
`;

const TimerBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const CloseButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white05};
  color: ${({ theme }) => theme.colors.white50};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neon};
  text-align: center;
  flex: 1;
`;

const NavigationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 16px;
  margin-bottom: 8px;
`;

const NavButton = styled.button<{ disabled?: boolean }>`
  all: unset;
  cursor: ${({ disabled }) =>
    disabled ? "not-allowed" : "pointer"};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
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

const EndButton = styled.button`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 400px;
  padding: 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  font-size: 16px;
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 100;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  backdrop-filter: blur(10px);

  &:active {
    transform: translateX(-50%) scale(0.98);
  }
`;
