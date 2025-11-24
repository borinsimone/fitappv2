import React, { useState, useRef, useEffect } from "react";
import {
  BiCheckCircle,
  BiMinusCircle,
  BiPlay,
  BiTimer,
  BiEdit,
  BiSave,
  BiTrash,
  BiX,
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

    // Focus the first input after state update
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 50);
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

  // Handle key press for inputs
  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveEdit(
        e as unknown as React.MouseEvent,
        index
      );
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleEditCancel(e as unknown as React.MouseEvent);
    } else if (e.key === "Tab") {
      // Focus will naturally move to next input
      if (
        e.shiftKey &&
        document.activeElement === inputRefs.current[0]
      ) {
        e.preventDefault();
        handleEditCancel(e as unknown as React.MouseEvent);
      }
    }
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
      <TableHeader>
        <SetColumn>Set</SetColumn>
        {isTimeBased ? (
          <>
            <Column>Time</Column>
            <Column>Rest</Column>
            <TimerColumn>Timer</TimerColumn>
          </>
        ) : (
          <>
            <Column>Weight</Column>
            <Column>Reps</Column>
            <Column>Rest</Column>
            <TimerColumn>Timer</TimerColumn>
          </>
        )}
        <StatusColumn>Status</StatusColumn>
      </TableHeader>

      <SetsList>
        <AnimatePresence>
          {currentExercise.exerciseSets.map(
            (set, index) => (
              <motion.div key={index}>
                <SetRow
                  as={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                  }}
                  drag={
                    editingSetIndex !== index ? "x" : false
                  }
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={(_, info) =>
                    handleDragEnd(info, index)
                  }
                  $isActive={activeSet === set}
                  $isCompleted={
                    completedSets[setKey]?.[index]
                  }
                  $isEditing={editingSetIndex === index}
                  onClick={() => {
                    // if (editingSetIndex !== index) {
                    //   handleSetClick(set);
                    // }
                  }}
                >
                  {/* Swipe hint indicator */}
                  {/* <SwipeHintContainer>
                  <SwipeHint>
                    <BiTrash size={18} />
                    Swipe to delete
                  </SwipeHint>
                </SwipeHintContainer> */}

                  <SetNumberCell>
                    <SetNumber
                      $isActive={activeSet === set}
                    >
                      {index + 1}
                    </SetNumber>
                  </SetNumberCell>

                  {editingSetIndex === index ? (
                    // Editing mode
                    isTimeBased ? (
                      <>
                        <Cell>
                          <EditInput
                            ref={(el) => {
                              inputRefs.current[0] = el;
                            }}
                            type="number"
                            min="0"
                            value={
                              editValues?.time === undefined
                                ? ""
                                : editValues.time
                            }
                            onChange={(e) =>
                              handleValueChange(
                                "time",
                                e.target.value
                              )
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, index)
                            }
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          />
                          <InputLabel>sec</InputLabel>
                        </Cell>
                        <Cell>
                          <EditInput
                            ref={(el) => {
                              inputRefs.current[1] = el;
                            }}
                            type="number"
                            min="0"
                            value={
                              editValues?.rest === undefined
                                ? ""
                                : editValues.rest
                            }
                            onChange={(e) =>
                              handleValueChange(
                                "rest",
                                e.target.value
                              )
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, index)
                            }
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          />
                          <InputLabel>sec</InputLabel>
                        </Cell>
                      </>
                    ) : (
                      <>
                        <Cell>
                          <EditInput
                            ref={(el) => {
                              inputRefs.current[0] = el;
                            }}
                            type="number"
                            min="0"
                            step="0.5"
                            value={
                              editValues?.weight ===
                              undefined
                                ? ""
                                : editValues.weight
                            }
                            onChange={(e) =>
                              handleValueChange(
                                "weight",
                                e.target.value
                              )
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, index)
                            }
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          />
                          <InputLabel>kg</InputLabel>
                        </Cell>
                        <Cell>
                          <EditInput
                            ref={(el) => {
                              inputRefs.current[1] = el;
                            }}
                            type="number"
                            min="0"
                            value={
                              editValues?.reps === undefined
                                ? ""
                                : editValues.reps
                            }
                            onChange={(e) =>
                              handleValueChange(
                                "reps",
                                e.target.value
                              )
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, index)
                            }
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          />
                          <InputLabel>rep</InputLabel>
                        </Cell>
                        <Cell>
                          <EditInput
                            ref={(el) => {
                              inputRefs.current[2] = el;
                            }}
                            type="number"
                            min="0"
                            value={
                              editValues?.rest === undefined
                                ? ""
                                : editValues.rest
                            }
                            onChange={(e) =>
                              handleValueChange(
                                "rest",
                                e.target.value
                              )
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, index)
                            }
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          />
                          <InputLabel>sec</InputLabel>
                        </Cell>
                      </>
                    )
                  ) : // Display mode
                  isTimeBased ? (
                    <>
                      <Cell>
                        <CellValue>
                          <BiTimer size={16} />
                          {set.time}"
                        </CellValue>
                      </Cell>
                      <Cell>
                        <CellValue>{set.rest}"</CellValue>
                      </Cell>
                    </>
                  ) : (
                    <>
                      <Cell>
                        <CellValue>
                          {set.weight} kg
                        </CellValue>
                      </Cell>
                      <Cell>
                        <CellValue>
                          {set.reps} rep
                        </CellValue>
                      </Cell>
                      <Cell>
                        <CellValue>{set.rest}"</CellValue>
                      </Cell>
                    </>
                  )}

                  <TimerCell>
                    {editingSetIndex === index ? (
                      <ActionButtonGroup>
                        <ActionButton
                          $variant="save"
                          onClick={(e) =>
                            handleSaveEdit(e, index)
                          }
                          as={motion.button}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <BiSave size={16} />
                        </ActionButton>

                        <ActionButton
                          $variant="cancel"
                          onClick={handleEditCancel}
                          as={motion.button}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <BiMinusCircle size={16} />
                        </ActionButton>
                      </ActionButtonGroup>
                    ) : activeSet === set ? (
                      <ActiveBadge>
                        <BiPlay size={14} />
                        Active
                      </ActiveBadge>
                    ) : (
                      <ActionButtonGroup>
                        <SelectButton
                          as={motion.button}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleSetClick(set)
                          }
                        >
                          Select
                        </SelectButton>

                        <EditButton
                          onClick={(e) =>
                            handleEditClick(e, set, index)
                          }
                          as={motion.button}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <BiEdit size={16} />
                        </EditButton>
                      </ActionButtonGroup>
                    )}
                  </TimerCell>

                  <StatusCell>
                    <CompletionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (editingSetIndex !== index) {
                          handleSetComplete(index);
                        }
                      }}
                      $completed={
                        completedSets[setKey]?.[index]
                      }
                      disabled={editingSetIndex === index}
                      as={motion.button}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {completedSets[setKey]?.[index] ? (
                        <BiCheckCircle size={24} />
                      ) : (
                        <BiMinusCircle size={24} />
                      )}
                    </CompletionButton>
                  </StatusCell>
                </SetRow>

                {/* Delete confirmation overlay */}
                <AnimatePresence>
                  {confirmDelete && deleteIndex === index && (
                    <DeleteConfirm
                      as={motion.div}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DeleteMessage>
                        Delete this set?
                      </DeleteMessage>
                      <DeleteButtonGroup>
                        <DeleteCancelButton
                          onClick={handleCancelDelete}
                          as={motion.button}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <BiX size={16} />
                          Cancel
                        </DeleteCancelButton>
                        <DeleteConfirmButton
                          onClick={handleDeleteSet}
                          as={motion.button}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <BiTrash size={16} />
                          Delete
                        </DeleteConfirmButton>
                      </DeleteButtonGroup>
                    </DeleteConfirm>
                  )}
                </AnimatePresence>
              </motion.div>
            )
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
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.white05};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 100%;
  color: ${({ theme }) => theme.colors.white50};
  font-size: 16px;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 0;
  background: ${({ theme }) => theme.colors.white10};
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.white10};
  z-index: 2;
`;

const Column = styled.div`
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white70};
  text-align: center;
`;

const SetColumn = styled(Column)`
  flex: 0 0 60px;
`;

const TimerColumn = styled(Column)`
  flex: 1.5;
`;

const StatusColumn = styled(Column)`
  flex: 0 0 70px;
`;

const SetsList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const SetRow = styled(motion.div)<{
  $isActive: boolean;
  $isCompleted: boolean;
  $isEditing?: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 12px 0px;
  cursor: ${({ $isEditing }) =>
    $isEditing ? "default" : "pointer"};
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  position: relative;
  background-color: ${({ theme }) => theme.colors.white05};
  z-index: 1;

  ${({ $isActive, $isCompleted, $isEditing, theme }) => {
    if ($isEditing) {
      return `
        background: ${theme.colors.white10};
        border-left-color: ${theme.colors.neon};
      `;
    }
    if ($isActive) {
      return `
        background: ${theme.colors.neon}10;
        border-left-color: ${theme.colors.neon};
      `;
    }
    if ($isCompleted) {
      return `
        background: ${theme.colors.success}10;
        border-left-color: transparent;
      `;
    }
    return "";
  }}

  &:not(:last-child) {
    border-bottom: 1px solid
      ${({ theme }) => theme.colors.white05};
  }

  &:hover {
    background: ${({ $isActive, $isEditing, theme }) => {
      if ($isEditing) return theme.colors.white10;
      return $isActive
        ? `${theme.colors.neon}15`
        : theme.colors.white10;
    }};
  }
`;

const Cell = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SetNumberCell = styled(Cell)`
  flex: 0 0 60px;
`;

const SetNumber = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.neon : theme.colors.white10};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.dark : theme.colors.white};
`;

const CellValue = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
`;

const TimerCell = styled(Cell)`
  flex: 1.5;
  justify-content: center;
`;

const StatusCell = styled(Cell)`
  flex: 0 0 70px;
`;

const ActiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
`;

const ActionButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SelectButton = styled(motion.button)`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
  }
`;

const EditButton = styled(motion.button)`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  font-size: 13px;
  background: ${({ theme }) => theme.colors.white05};
  color: ${({ theme }) => theme.colors.white50};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ActionButton = styled(motion.button)<{
  $variant: "save" | "cancel";
}>`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $variant, theme }) =>
    $variant === "save"
      ? `
        background: ${theme.colors.neon}20;
        color: ${theme.colors.neon};
        &:hover {
          background: ${theme.colors.neon}40;
        }
      `
      : `
        background: ${theme.colors.error}20;
        color: ${theme.colors.error};
        &:hover {
          background: ${theme.colors.error}40;
        }
      `}
`;

const CompletionButton = styled(motion.button)<{
  $completed: boolean;
  disabled?: boolean;
}>`
  all: unset;
  cursor: ${({ disabled }) =>
    disabled ? "not-allowed" : "pointer"};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  color: ${({ $completed, theme }) =>
    $completed
      ? theme.colors.success
      : theme.colors.white30};
`;

const EditInput = styled.input`
  width: 45px;
  height: 30px;
  padding: 0 6px;
  border: none;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.white20};
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  font-weight: 500;
  text-align: center;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.neon};
    background: ${({ theme }) => theme.colors.white30};
  }

  /* Hide arrow buttons on number inputs */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const InputLabel = styled.span`
  margin-left: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white50};
`;

const DeleteConfirm = styled(motion.div)`
  position: relative;
  margin-top: -1px;
  margin-bottom: 8px;
  background: ${({ theme }) => theme.colors.error}15;
  padding: 12px 16px;
  border-left: 3px solid
    ${({ theme }) => theme.colors.error};
  border-radius: 0 0 12px 12px;
  z-index: 0;
`;

const DeleteMessage = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.error};
`;

const DeleteButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const DeleteCancelButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
  }
`;

const DeleteConfirmButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.error}80;
  }
`;
