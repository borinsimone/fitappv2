import styled from "styled-components";
import { useWorkouts } from "../../context/WorkoutContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BiChevronLeft,
  BiRepeat,
  BiDumbbell,
} from "react-icons/bi";

interface Workout {
  name: string;
  date: string;
  completed: boolean;
  feedback: {
    feeling: number | null;
    notes: string;
  };
  title: string;
  load: number;
  reps: number;
  notes: string;
  startTime: Date | null;
  endTime: Date | null;
  duration: number | null;
}

interface RepeatWorkoutProps {
  workouts: Workout[];
  setRepeatWorkout: (value: boolean) => void;
  setAddWorkoutDialog: (value: boolean) => void;
}

function RepeatWorkout({
  workouts,
  setAddWorkoutDialog,
  setRepeatWorkout,
  selectedDate,
}: RepeatWorkoutProps) {
  const { addWorkout } = useWorkouts();
  const [selectedWorkout, setSelectedWorkout] = useState<
    string | null
  >(null);

  // Get unique workout names
  const uniqueWorkouts = [
    ...new Set(workouts?.map((workout) => workout.name)),
  ];

  const handleAddWorkout = (workout: Workout) => {
    // Usa la data selezionata invece di creare una nuova data
    const targetDate = selectedDate || new Date();

    // Resetta l'ora mantenendo la data selezionata
    const newDate = new Date(targetDate);
    newDate.setHours(0, 0, 0, 0);

    // Crea una nuova copia del workout omettendo l'ID
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _workoutId, ...workoutWithoutId } =
      workout;

    // Crea un nuovo workout con i valori corretti secondo lo schema MongoDB
    const newWorkout = {
      ...workoutWithoutId,
      date: newDate.toISOString(),
      completed: false,
      // Struttura corretta del feedback secondo lo schema
      feedback: {
        feeling: 3, // Usa un valore numerico di default (1-5) invece di undefined
        energyLevel: 3, // Aggiungi questo campo richiesto
        difficulty: 3, // Aggiungi questo campo richiesto
        notes: "",
      },
      // Usa undefined invece di null per questi campi
      startTime: undefined,
      endTime: undefined,
      duration: undefined,
      notes: workout.notes || "",
    };

    // Rimuovi campi obsoleti che potrebbero esistere nel vecchio workout
    // ma non sono parte del modello attuale
    if ("title" in newWorkout) delete newWorkout.title;
    if ("load" in newWorkout) delete newWorkout.load;
    if ("reps" in newWorkout) delete newWorkout.reps;

    console.log("Nuovo workout da aggiungere:", newWorkout);

    // Invia il workout aggiornato
    addWorkout(newWorkout);
    setAddWorkoutDialog(false);
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Overlay onClick={() => setRepeatWorkout(false)} />

      <Panel
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <Header>
          <BackButton
            onClick={() => setRepeatWorkout(false)}
          >
            <BiChevronLeft size={24} />
          </BackButton>
          <Title>Ripeti un Allenamento</Title>
        </Header>

        <Description>
          Seleziona un allenamento precedente da aggiungere
          al calendario
        </Description>

        <WorkoutList>
          <AnimatePresence>
            {uniqueWorkouts.map((name) => (
              <WorkoutCard
                key={name}
                onClick={() => setSelectedWorkout(name)}
                selected={selectedWorkout === name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <WorkoutIcon>
                  <BiDumbbell size={24} />
                </WorkoutIcon>

                <WorkoutInfo>
                  <WorkoutName>{name}</WorkoutName>
                  <WorkoutDetails>
                    {
                      workouts.filter(
                        (w) => w.name === name
                      ).length
                    }{" "}
                    sessioni precedenti
                  </WorkoutDetails>
                </WorkoutInfo>

                {selectedWorkout === name && (
                  <SelectButton
                    onClick={(e) => {
                      e.stopPropagation();
                      const workout = workouts?.find(
                        (w) => w.name === name
                      );
                      if (workout)
                        handleAddWorkout(workout);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BiRepeat size={18} /> Ripeti
                  </SelectButton>
                )}
              </WorkoutCard>
            ))}
          </AnimatePresence>
        </WorkoutList>
      </Panel>
    </Container>
  );
}

export default RepeatWorkout;

const Container = styled(motion.div)`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
`;

const Panel = styled(motion.div)`
  position: relative;
  background: ${({ theme }) => theme.colors.dark};
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.white10};
`;

const BackButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.neon};
`;

const Description = styled.p`
  padding: 0 20px;
  margin: 12px 0;
  font-size: 14px;
  color: ${({ theme }) => `${theme.colors.white}70`};
`;

const WorkoutList = styled.div`
  overflow-y: auto;
  padding: 10px 20px 20px;
  flex: 1;
`;

const WorkoutCard = styled(motion.div)<{
  selected: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  background: ${({ selected, theme }) =>
    selected
      ? `${theme.colors.neon}10`
      : theme.colors.white10};
  border: 1px solid
    ${({ selected, theme }) =>
      selected ? theme.colors.neon : "transparent"};

  transition: all 0.2s ease;
`;

const WorkoutIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.neon};
  margin-right: 16px;
  flex-shrink: 0;
`;

const WorkoutInfo = styled.div`
  flex: 1;
`;

const WorkoutName = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const WorkoutDetails = styled.div`
  font-size: 13px;
  color: ${({ theme }) => `${theme.colors.white}70`};
`;

const SelectButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
`;
