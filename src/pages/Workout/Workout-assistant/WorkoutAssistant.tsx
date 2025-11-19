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

const WorkoutAssistant = () => {
  const { activeWorkout, setActiveWorkout } = useWorkouts();
  const [currentSectionIndex, setCurrentSectionIndex] =
    useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] =
    useState(0);
  const [feedbackFormOpen, setFeedbackFormOpen] =
    useState(false);

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
      {/* <button
        onClick={async () => {
          console.log(activeWorkout);
        }}
      >
        {new Date(activeWorkout?.startTime ?? '').toLocaleTimeString()}
        <WorkoutDuration start={activeWorkout?.startTime} />
      </button> */}

      <Header onClick={() => console.log(activeWorkout)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#fff",
          }}
        >
          <span>
            Start:{" "}
            {new Date(
              activeWorkout?.startTime ?? ""
            ).toLocaleTimeString()}
          </span>
          <WorkoutDuration
            start={activeWorkout?.startTime}
          />
        </div>
      </Header>
      {/* <SectionInfo>
        SEZIONE {currentSectionIndex + 1}/{activeWorkout?.sections?.length || 0}
      </SectionInfo> */}
      <Header>
        <NavigationBar>
          <NavButton
            onClick={handlePrevSection}
            disabled={currentSectionIndex === 0}
          >
            <BiChevronLeft size="24px" />
          </NavButton>
          <SectionTitle>
            {currentSection?.name}
          </SectionTitle>

          <NavButton
            onClick={handleNextSection}
            disabled={
              currentSectionIndex ===
              (activeWorkout?.sections?.length || 0) - 1
            }
          >
            <BiChevronRight size="24px" />
          </NavButton>
        </NavigationBar>
        <CloseButton
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to leave?"
              )
            ) {
              localStorage.removeItem("activeWorkout");
              setActiveWorkout(null);
            }
          }}
        >
          <MdClose size="30px" color="red" />
        </CloseButton>
      </Header>
      <ActiveExercise
        currentExercise={currentExercise}
        setCurrentExercise={setCurrentExercise}
        currentSectionIndex={currentSectionIndex}
        currentExerciseIndex={currentExerciseIndex}
      />
      <ExerciseSummary
        nextExercises={nextExercises}
        prevExercises={prevExercises}
        currentExerciseIndex={currentExerciseIndex}
        setCurrentExerciseIndex={setCurrentExerciseIndex}
        setCurrentExercise={setCurrentExercise}
      />
      <EndButton
        onClick={() => {
          endWorkout();
        }}
      >
        Fine Allenamento
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
  gap: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.dark};
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 100px;

  padding: 5px 16px;
  background-color: ${({ theme }) =>
    `${theme.colors.neon}10`};
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

const NavigationBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavButton = styled.button<{ disabled?: boolean }>`
  all: unset;
  cursor: ${({ disabled }) =>
    disabled ? "not-allowed" : "pointer"};
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

const EndButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: 12px 24px;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;
