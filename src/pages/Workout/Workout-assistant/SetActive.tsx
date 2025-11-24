import React, { useState, useRef, useEffect } from "react";
import {
  BiCheck,
  BiMinus,
  BiPlay,
  BiTimer,
  BiEditAlt,
  BiSave,
  BiTrash,
  BiX,
  BiDumbbell,
  BiReset,
} from "react-icons/bi";
import styled from "styled-components";
import {
  motion,
  AnimatePresence,
  PanInfo,
} from "framer-motion";
import {
  Exercise,
  WorkoutSet as ExerciseSet,
} from "../../../context/WorkoutContext";

interface SetActiveProps {
  currentExercise: Exercise | null;
  currentSectionIndex: number;
  currentExerciseIndex: number;
  activeSet: ExerciseSet | null;
  handleSetClick: (set: ExerciseSet) => void;
  handleSetComplete: (index: number) => void;
  completedSets: Record<string, boolean[]>;
  updateExercise?: (exercise: Exercise) => void;
}

function SetActive({
  currentExercise,
  currentSectionIndex,
  currentExerciseIndex,
  activeSet,
  handleSetClick,
  handleSetComplete,
  completedSets,
  updateExercise,
}: SetActiveProps) {
  const [editingSetIndex, setEditingSetIndex] = useState<
    number | null
  >(null);
  const [editValues, setEditValues] =
    useState<ExerciseSet | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<
    number | null
  >(null);
  const [confirmDelete, setConfirmDelete] =
    useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset editing state when exercise changes
  useEffect(() => {
    setEditingSetIndex(null);
    setEditValues(null);
    setDeleteIndex(null);
    setConfirmDelete(false);
  }, [
    currentExercise,
    currentSectionIndex,
    currentExerciseIndex,
  ]);

  if (!currentExercise) {
    return <EmptyState>No exercise selected</EmptyState>;
  }

  const setKey = `${currentSectionIndex}-${currentExerciseIndex}`;
  const isTimeBased = currentExercise.timeBased;

  const handleEditClick = (
    e: React.MouseEvent,
    set: ExerciseSet,
    index: number
  ) => {
    e.stopPropagation();
    setEditingSetIndex(index);
    setEditValues({ ...set });
  };

  const handleEditCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSetIndex(null);
    setEditValues(null);
  };

  const handleValueChange = (
    field: keyof ExerciseSet,
    value: string
  ) => {
    if (!editValues) return;

    // Convert to number and validate
    const numValue =
      value === "" ? undefined : Number(value);

    setEditValues({
      ...editValues,
      [field]: numValue,
    });
  };

  const handleSaveEdit = (
    e: React.MouseEvent,
    index: number
  ) => {
    e.stopPropagation();

    if (!currentExercise || !editValues) return;

    // Update the exercise set
    const updatedExerciseSets = [
      ...currentExercise.exerciseSets,
    ];
    updatedExerciseSets[index] = editValues;

    const updatedExercise = {
      ...currentExercise,
      exerciseSets: updatedExerciseSets,
    };

    // Call the update function if provided
    updateExercise?.(updatedExercise);

    // Reset editing state
    setEditingSetIndex(null);
    setEditValues(null);
  };

  const handleDragEnd = (info: PanInfo, index: number) => {
    const threshold = -80; // px to trigger delete action

    if (info.offset.x < threshold) {
      setDeleteIndex(index);
      setConfirmDelete(true);
    }
  };

  const handleDeleteSet = () => {
    if (deleteIndex === null || !currentExercise) return;

    // Create a copy of sets without the deleted one
    const updatedExerciseSets = [
      ...currentExercise.exerciseSets,
    ];
    updatedExerciseSets.splice(deleteIndex, 1);

    const updatedExercise = {
      ...currentExercise,
      exerciseSets: updatedExerciseSets,
    };

    // Call the update function if provided
    updateExercise?.(updatedExercise);

    // Reset state
    setDeleteIndex(null);
    setConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setDeleteIndex(null);
    setConfirmDelete(false);
  };

  return (
    <Container>
      <SetsList>
        <AnimatePresence>
          {currentExercise.exerciseSets.map(
            (set, index) => {
              const isCompleted =
                completedSets[setKey]?.[index];
              const isActive = activeSet === set;
              const isEditing = editingSetIndex === index;

              return (
                <motion.div key={index} layout>
                  <SetCard
                    as={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                    }}
                    drag={!isEditing ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, info) =>
                      handleDragEnd(info, index)
                    }
                    $isActive={isActive}
                    $isCompleted={isCompleted}
                    $isEditing={isEditing}
                    onClick={() => {
                      if (!isEditing) {
                        handleSetClick(set);
                      }
                    }}
                  >
                    <SetNumberBadge
                      $isActive={isActive}
                      $isCompleted={isCompleted}
                    >
                      {index + 1}
                    </SetNumberBadge>

                    <SetContent>
                      {isEditing ? (
                        <EditContainer>
                          {isTimeBased ? (
                            <EditGroup>
                              <EditField>
                                <Label>Time (s)</Label>
                                <LargeInput
                                  type="number"
                                  value={
                                    editValues?.time ?? ""
                                  }
                                  onChange={(e) =>
                                    handleValueChange(
                                      "time",
                                      e.target.value
                                    )
                                  }
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                />
                              </EditField>
                              <EditField>
                                <Label>Rest (s)</Label>
                                <LargeInput
                                  type="number"
                                  value={
                                    editValues?.rest ?? ""
                                  }
                                  onChange={(e) =>
                                    handleValueChange(
                                      "rest",
                                      e.target.value
                                    )
                                  }
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                />
                              </EditField>
                            </EditGroup>
                          ) : (
                            <EditGroup>
                              <EditField>
                                <Label>Weight (kg)</Label>
                                <LargeInput
                                  type="number"
                                  value={
                                    editValues?.weight ?? ""
                                  }
                                  onChange={(e) =>
                                    handleValueChange(
                                      "weight",
                                      e.target.value
                                    )
                                  }
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                />
                              </EditField>
                              <EditField>
                                <Label>Reps</Label>
                                <LargeInput
                                  type="number"
                                  value={
                                    editValues?.reps ?? ""
                                  }
                                  onChange={(e) =>
                                    handleValueChange(
                                      "reps",
                                      e.target.value
                                    )
                                  }
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                />
                              </EditField>
                              <EditField>
                                <Label>Rest (s)</Label>
                                <LargeInput
                                  type="number"
                                  value={
                                    editValues?.rest ?? ""
                                  }
                                  onChange={(e) =>
                                    handleValueChange(
                                      "rest",
                                      e.target.value
                                    )
                                  }
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                />
                              </EditField>
                            </EditGroup>
                          )}
                          <EditActions>
                            <ActionButton
                              $variant="cancel"
                              onClick={handleEditCancel}
                            >
                              <BiX size={24} />
                            </ActionButton>
                            <ActionButton
                              $variant="save"
                              onClick={(e) =>
                                handleSaveEdit(e, index)
                              }
                            >
                              <BiCheck size={24} />
                            </ActionButton>
                          </EditActions>
                        </EditContainer>
                      ) : (
                        <DisplayContainer>
                          <MetricsGroup>
                            {isTimeBased ? (
                              <>
                                <Metric>
                                  <MetricValue>
                                    {set.time}"
                                  </MetricValue>
                                  <MetricLabel>
                                    TIME
                                  </MetricLabel>
                                </Metric>
                                <Metric>
                                  <MetricValue>
                                    {set.rest}"
                                  </MetricValue>
                                  <MetricLabel>
                                    REST
                                  </MetricLabel>
                                </Metric>
                              </>
                            ) : (
                              <>
                                <Metric>
                                  <MetricValue>
                                    {set.weight}
                                    <small>kg</small>
                                  </MetricValue>
                                  <MetricLabel>
                                    WEIGHT
                                  </MetricLabel>
                                </Metric>
                                <Metric>
                                  <MetricValue>
                                    {set.reps}
                                  </MetricValue>
                                  <MetricLabel>
                                    REPS
                                  </MetricLabel>
                                </Metric>
                                <Metric>
                                  <MetricValue>
                                    {set.rest}"
                                  </MetricValue>
                                  <MetricLabel>
                                    REST
                                  </MetricLabel>
                                </Metric>
                              </>
                            )}
                          </MetricsGroup>
                        </DisplayContainer>
                      )}
                    </SetContent>

                    {!isEditing && (
                      <ActionsColumn>
                        <EditButton
                          onClick={(e) =>
                            handleEditClick(e, set, index)
                          }
                        >
                          <BiEditAlt size={20} />
                        </EditButton>
                        <CompleteButton
                          $isCompleted={isCompleted}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetComplete(index);
                          }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {isCompleted ? (
                            <BiCheck size={28} />
                          ) : (
                            <div />
                          )}
                        </CompleteButton>
                      </ActionsColumn>
                    )}
                  </SetCard>

                  {/* Delete confirmation overlay */}
                  <AnimatePresence>
                    {confirmDelete &&
                      deleteIndex === index && (
                        <DeleteConfirm
                          as={motion.div}
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <DeleteMessage>
                            Delete this set?
                          </DeleteMessage>
                          <DeleteButtonGroup>
                            <DeleteCancelButton
                              onClick={handleCancelDelete}
                            >
                              Cancel
                            </DeleteCancelButton>
                            <DeleteConfirmButton
                              onClick={handleDeleteSet}
                            >
                              Delete
                            </DeleteConfirmButton>
                          </DeleteButtonGroup>
                        </DeleteConfirm>
                      )}
                  </AnimatePresence>
                </motion.div>
              );
            }
          )}
        </AnimatePresence>
      </SetsList>
    </Container>
  );
}

export default SetActive;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: ${({ theme }) => theme.colors.white50};
`;

const SetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SetCard = styled(motion.div)<{
  $isActive: boolean;
  $isCompleted: boolean;
  $isEditing: boolean;
}>`
  display: flex;
  align-items: stretch;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.colors.neon : "transparent"};
  transition: all 0.2s ease;

  ${({ $isCompleted, theme }) =>
    $isCompleted &&
    `
    background: ${theme.colors.success}20;
    border-color: ${theme.colors.success};
  `}
`;

const SetNumberBadge = styled.div<{
  $isActive: boolean;
  $isCompleted: boolean;
}>`
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  background: ${({ $isActive, $isCompleted, theme }) => {
    if ($isActive) return theme.colors.neon;
    if ($isCompleted) return theme.colors.success;
    return theme.colors.white10;
  }};
  color: ${({ $isActive, $isCompleted, theme }) => {
    if ($isActive || $isCompleted) return theme.colors.dark;
    return theme.colors.white;
  }};
`;

const SetContent = styled.div`
  flex: 1;
  padding: 12px;
  display: flex;
  align-items: center;
`;

const DisplayContainer = styled.div`
  width: 100%;
`;

const MetricsGroup = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;

const Metric = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const MetricValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: baseline;
  gap: 2px;

  small {
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.white50};
  }
`;

const MetricLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white50};
  letter-spacing: 0.5px;
`;

const ActionsColumn = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid
    ${({ theme }) => theme.colors.white10};
`;

const EditButton = styled.button`
  flex: 1;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.white30};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.white05};
  }
`;

const CompleteButton = styled(motion.button)<{
  $isCompleted: boolean;
}>`
  flex: 1;
  border: none;
  background: ${({ $isCompleted, theme }) =>
    $isCompleted
      ? theme.colors.success
      : theme.colors.white10};
  color: ${({ theme }) => theme.colors.dark};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $isCompleted, theme }) =>
      $isCompleted
        ? theme.colors.success
        : theme.colors.white20};
  }
`;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const EditGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const EditField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.white50};
`;

const LargeInput = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.white10};
  border: 1px solid ${({ theme }) => theme.colors.white20};
  border-radius: 8px;
  padding: 8px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.neon};
    background: ${({ theme }) => theme.colors.white20};
  }
`;

const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ActionButton = styled.button<{
  $variant: "save" | "cancel";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  ${({ $variant, theme }) =>
    $variant === "save"
      ? `
    background: ${theme.colors.neon};
    color: ${theme.colors.dark};
  `
      : `
    background: ${theme.colors.white10};
    color: ${theme.colors.white};
  `}
`;

const DeleteConfirm = styled.div`
  background: ${({ theme }) => theme.colors.error}20;
  border-radius: 0 0 16px 16px;
  margin-top: -10px;
  padding: 20px 16px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteMessage = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-weight: 500;
  font-size: 14px;
`;

const DeleteButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const DeleteCancelButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.white20};
  color: ${({ theme }) => theme.colors.white};
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
`;

const DeleteConfirmButton = styled.button`
  background: ${({ theme }) => theme.colors.error};
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
`;
