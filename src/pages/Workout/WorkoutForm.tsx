import React, { useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { BiPlus, BiTrash, BiSave } from "react-icons/bi";
import { useWorkouts } from "../../context/WorkoutContext";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import SuggestionsInput from "./SuggestionsInput";

interface ExerciseSet {
  weight?: number;
  reps?: number;
  time?: number;
  rest: number;
}

interface Exercise {
  id: string;
  name: string;
  timeBased: boolean;
  exerciseSets: ExerciseSet[];
  notes?: string;
}

interface WorkoutSection {
  id: string;
  name: string;
  exercises: Exercise[];
}

// Aggiorna l'interfaccia Workout per allinearla al modello del backend
interface Workout {
  id: string; // Questo verrà mappato a _id nel backend
  name: string;
  date?: string; // Data dell'allenamento (opzionale, defaults nel backend)
  sections: WorkoutSection[];
  startTime?: Date | null; // Ora di inizio (verrà impostata quando l'utente inizia)
  endTime?: Date | null; // Ora di fine (verrà impostata quando l'utente completa)
  duration?: number | null; // Durata in minuti (calcolata automaticamente)
  notes?: string; // Note generali dell'allenamento
  completed?: boolean; // Stato di completamento (default: false)
}

interface WorkoutFormProps {
  closeForm: (value: boolean) => void;
  selectedDate: Date;
}

const WorkoutForm = ({
  closeForm,
  selectedDate,
}: WorkoutFormProps) => {
  const navigate = useNavigate();
  const { addWorkout } = useWorkouts();
  const [workout, setWorkout] = useState<Workout>({
    id: uuidv4(),
    name: "",
    date: new Date().toISOString(), // Imposta la data corrente
    sections: [
      {
        id: uuidv4(),
        name: "",
        exercises: [],
      },
    ],
    startTime: null,
    endTime: null,
    duration: null,
    completed: false, // Inizialmente non completato
  });
  const [workoutNotes, setWorkoutNotes] =
    useState<string>("");
  const handleNotesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setWorkoutNotes(e.target.value);
    setWorkout((prev) => ({
      ...prev,
      notes: e.target.value,
    }));
  };
  const handleWorkoutNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWorkout((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleSectionChange = (
    sectionId: string,
    field: string,
    value: string | boolean
  ) => {
    setWorkout((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, [field]: value }
          : section
      ),
    }));
  };

  const addSection = () => {
    const newSection: WorkoutSection = {
      id: uuidv4(),
      name: ``,
      exercises: [],
    };

    setWorkout((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const removeSection = (sectionId: string) => {
    setWorkout((prev) => ({
      ...prev,
      sections: prev.sections.filter(
        (section) => section.id !== sectionId
      ),
    }));
  };

  const addExercise = (sectionId: string) => {
    const newExercise: Exercise = {
      id: uuidv4(),
      name: "",
      timeBased: false,
      exerciseSets: [
        {
          weight: 0,
          reps: 10,
          rest: 60,
        },
      ],
    };

    setWorkout((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              exercises: [
                ...section.exercises,
                newExercise,
              ],
            }
          : section
      ),
    }));
  };

  const removeExercise = (
    sectionId: string,
    exerciseId: string
  ) => {
    setWorkout((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              exercises: section.exercises.filter(
                (ex) => ex.id !== exerciseId
              ),
            }
          : section
      ),
    }));
  };

  const handleExerciseChange = (
    sectionId: string,
    exerciseId: string,
    field: string,
    value: string | boolean
  ) => {
    setWorkout((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              exercises: section.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, [field]: value }
                  : exercise
              ),
            }
          : section
      ),
    }));
  };

  const addSet = (
    sectionId: string,
    exerciseId: string
  ) => {
    setWorkout((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              exercises: section.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      exerciseSets: [
                        ...exercise.exerciseSets,
                        exercise.timeBased
                          ? { time: 30, rest: 60 }
                          : {
                              weight: 0,
                              reps: 10,
                              rest: 60,
                            },
                      ],
                    }
                  : exercise
              ),
            }
          : section
      ),
    }));
  };

  const removeSet = (
    sectionId: string,
    exerciseId: string,
    setIndex: number
  ) => {
    setWorkout((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              exercises: section.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      exerciseSets:
                        exercise.exerciseSets.filter(
                          (_, i) => i !== setIndex
                        ),
                    }
                  : exercise
              ),
            }
          : section
      ),
    }));
  };

  const handleSetChange = (
    sectionId: string,
    exerciseId: string,
    setIndex: number,
    field: string,
    value: number
  ) => {
    setWorkout((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              exercises: section.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      exerciseSets:
                        exercise.exerciseSets.map(
                          (set, i) =>
                            i === setIndex
                              ? { ...set, [field]: value }
                              : set
                        ),
                    }
                  : exercise
              ),
            }
          : section
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!workout.name.trim()) {
      alert("Please provide a workout name");
      return;
    }

    for (const section of workout.sections) {
      if (!section.name.trim()) {
        alert("All sections must have a name");
        return;
      }

      if (section.exercises.length === 0) {
        alert(
          `Section "${section.name}" needs at least one exercise`
        );
        return;
      }

      for (const exercise of section.exercises) {
        if (!exercise.name.trim()) {
          alert("All exercises must have a name");
          return;
        }

        if (exercise.exerciseSets.length === 0) {
          alert(
            `Exercise "${exercise.name}" needs at least one set`
          );
          return;
        }
      }
    }
    const workoutDate = selectedDate || new Date();

    const workoutToSave = {
      name: workout.name,
      date: workoutDate.toISOString(),
      sections: workout.sections.map((section) => ({
        name: section.name,
        exercises: section.exercises.map((exercise) => ({
          name: exercise.name,
          timeBased: exercise.timeBased,
          exerciseSets: exercise.exerciseSets.map(
            (set) => ({
              weight: exercise.timeBased
                ? undefined
                : set.weight || 0,
              reps: exercise.timeBased
                ? undefined
                : set.reps || 0,
              time: exercise.timeBased
                ? set.time || 0
                : undefined,
              rest: set.rest || 0,
            })
          ),
          notes: exercise.notes,
        })),
      })),
      notes: workout.notes,
      completed: false,
      userId: "", // Will be set by backend
    };

    console.log("workoutToSave", workoutToSave);
    addWorkout(workoutToSave);

    // Navigate back to the workout planner
    navigate("/workout-planner");
  };

  return (
    <FormContainer
      as={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="closeBtn"
        onClick={() => closeForm(false)}
      >
        <MdClose color="red" size="30px" />
      </button>
      <h1>Crea una nuova scheda</h1>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="workout-name">Workout Name</Label>
          <Input
            id="workout-name"
            type="text"
            value={workout.name}
            onChange={handleWorkoutNameChange}
            placeholder="e.g., Full Body Workout"
            required
          />
        </FormGroup>

        <SectionsList>
          <AnimatePresence>
            {workout.sections.map((section) => (
              <SectionCard
                key={section.id}
                as={motion.div}
                layout="position"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  height: "auto",
                }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ originY: 0, overflow: "hidden" }}
              >
                <SectionHeader>
                  {/* <input
                    className='input'
                    type='text'
                    value={section.name}
                    onChange={(e) =>
                      handleSectionNameChange(section.id, e.target.value)
                    }
                    placeholder='Section Name'
                    required
                  /> */}
                  <SuggestionsInput
                    value={section.name}
                    onChange={(value) =>
                      handleSectionChange(
                        section.id,
                        "name",
                        value
                      )
                    }
                    placeholder="Nome sezione"
                    type="section"
                  />
                  <IconButton
                    onClick={() =>
                      removeSection(section.id)
                    }
                  >
                    <BiTrash />
                  </IconButton>
                </SectionHeader>

                <ExercisesList>
                  {section.exercises.map((exercise) => (
                    <ExerciseCard key={exercise.id}>
                      <ExerciseHeader>
                        {/* <input
                          type='text'
                          value={exercise.name}
                          onChange={(e) =>
                            handleExerciseChange(
                              section.id,
                              exercise.id,
                              'name',
                              e.target.value
                            )
                          }
                          placeholder='Exercise Name'
                          required
                        /> */}
                        <SuggestionsInput
                          value={exercise.name}
                          onChange={(value) =>
                            handleExerciseChange(
                              section.id,
                              exercise.id,
                              "name",
                              value
                            )
                          }
                          placeholder="Nome esercizio"
                          type="exercise"
                          sectionName={section.name} // Passa il nome della sezione per filtrare gli esercizi
                        />
                        <div>
                          <label>
                            <input
                              type="checkbox"
                              checked={exercise.timeBased}
                              onChange={(e) =>
                                handleExerciseChange(
                                  section.id,
                                  exercise.id,
                                  "timeBased",
                                  e.target.checked
                                )
                              }
                            />
                            Time Based
                          </label>
                          <IconButton
                            onClick={() =>
                              removeExercise(
                                section.id,
                                exercise.id
                              )
                            }
                          >
                            <BiTrash />
                          </IconButton>
                        </div>
                      </ExerciseHeader>
                      <SetsTable>
                        <thead>
                          <tr>
                            <th>Set</th>
                            {exercise.timeBased ? (
                              <th>Time (s)</th>
                            ) : (
                              <>
                                <th>Weight (kg)</th>
                                <th>Reps</th>
                              </>
                            )}
                            <th>Rest (s)</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.exerciseSets.map(
                            (set, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                {exercise.timeBased ? (
                                  <td>
                                    <NumberInput
                                      type="number"
                                      min="0"
                                      value={set.time || 0}
                                      onChange={(e) =>
                                        handleSetChange(
                                          section.id,
                                          exercise.id,
                                          index,
                                          "time",
                                          parseInt(
                                            e.target.value
                                          )
                                        )
                                      }
                                      required
                                    />
                                  </td>
                                ) : (
                                  <>
                                    <td>
                                      <NumberInput
                                        type="number"
                                        min="0"
                                        value={
                                          set.weight || 0
                                        }
                                        onChange={(e) =>
                                          handleSetChange(
                                            section.id,
                                            exercise.id,
                                            index,
                                            "weight",
                                            parseInt(
                                              e.target.value
                                            )
                                          )
                                        }
                                        required
                                      />
                                    </td>
                                    <td>
                                      <NumberInput
                                        type="number"
                                        min="0"
                                        value={
                                          set.reps || 0
                                        }
                                        onChange={(e) =>
                                          handleSetChange(
                                            section.id,
                                            exercise.id,
                                            index,
                                            "reps",
                                            parseInt(
                                              e.target.value
                                            )
                                          )
                                        }
                                        required
                                      />
                                    </td>
                                  </>
                                )}
                                <td>
                                  <NumberInput
                                    type="number"
                                    min="0"
                                    value={set.rest}
                                    onChange={(e) =>
                                      handleSetChange(
                                        section.id,
                                        exercise.id,
                                        index,
                                        "rest",
                                        parseInt(
                                          e.target.value
                                        )
                                      )
                                    }
                                    required
                                  />
                                </td>
                                <td>
                                  <IconButton
                                    onClick={() =>
                                      removeSet(
                                        section.id,
                                        exercise.id,
                                        index
                                      )
                                    }
                                    disabled={
                                      exercise.exerciseSets
                                        .length <= 1
                                    }
                                  >
                                    <BiTrash />
                                  </IconButton>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </SetsTable>
                      <ActionButton
                        onClick={() =>
                          addSet(section.id, exercise.id)
                        }
                        type="button"
                      >
                        <BiPlus /> Add Set
                      </ActionButton>
                    </ExerciseCard>
                  ))}

                  <ActionButton
                    onClick={() => addExercise(section.id)}
                    type="button"
                  >
                    <BiPlus /> Add Exercise
                  </ActionButton>
                </ExercisesList>
              </SectionCard>
            ))}
          </AnimatePresence>

          <ActionButton onClick={addSection} type="button">
            <BiPlus /> Add Section
          </ActionButton>
        </SectionsList>
        <FormGroup>
          <Label htmlFor="workout-notes">
            Note (opzionali)
          </Label>
          <TextArea
            id="workout-notes"
            value={workoutNotes}
            onChange={handleNotesChange}
            placeholder="Inserisci note aggiuntive per questo allenamento..."
            rows={3}
          />
        </FormGroup>
        <SubmitButton type="submit">
          <BiSave /> Save Workout
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default WorkoutForm;

// Styled Components
const FormContainer = styled.div`
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.dark};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;

  .closeBtn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.white70};
    font-size: 24px;
    cursor: pointer;
  }
  form {
    width: 100%;
    max-height: 70vh;
    max-height: 70dvh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const Label = styled.label`
  display: block;

  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.white20};
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.neon};
  }
`;

const NumberInput = styled.input`
  width: 60px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.white20};
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.neon};
  }
`;

const SectionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 12px;
  padding: 10px;
  border-left: 4px solid ${({ theme }) => theme.colors.neon};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 100%;
  position: sticky;
  top: 0;
  background-color: #26272c;
  padding: 10px;
  z-index: 50;
  input {
    flex: 1;
    padding: 10px;
    border-radius: 6px;
    border: none;
    background: ${({ theme }) => theme.colors.white10};
    color: ${({ theme }) => theme.colors.white};
    font-size: 18px;
    font-weight: 500;

    border: 1px solid ${({ theme }) => theme.colors.neon};
    &:focus {
      outline: none;
    }
  }
`;

const ExercisesList = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ExerciseCard = styled.div`
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 8px;

  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  input[type="text"] {
    flex: 1;
    padding: 8px;
    border-radius: 4px;
    border: none;
    background: ${({ theme }) => theme.colors.white10};
    color: ${({ theme }) => theme.colors.white};

    &:focus {
      outline: none;
    }
  }

  div {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
  }
`;

const SetsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    text-align: center;
  }

  th {
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => `${theme.colors.white}70`};
  }

  tr {
    border-bottom: 1px solid
      ${({ theme }) => theme.colors.white10};

    td {
      button {
        margin: 0 auto;
      }
    }
  }
`;

const IconButton = styled.button<{ disabled?: boolean }>`
  all: unset;
  cursor: ${({ disabled }) =>
    disabled ? "not-allowed" : "pointer"};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.white10};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 2px dashed ${({ theme }) => theme.colors.white30};
  background: transparent;
  color: ${({ theme }) => theme.colors.white70};
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.neon};
    color: ${({ theme }) => theme.colors.neon};
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.white20};
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.neon};
  }
`;
