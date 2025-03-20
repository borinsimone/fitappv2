import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWorkouts } from '../../../context/WorkoutContext';
import {
  BiDumbbell,
  BiCalendar,
  BiTrash,
  BiCheck,
  BiX,
  BiChevronRight,
  BiNote,
  BiTime,
} from 'react-icons/bi';
import { AnimatePresence, motion } from 'framer-motion';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';

interface Workout {
  _id: string;
  name: string;
  date: string;
  notes?: string;
  completed: boolean;
}

function WorkoutHistory() {
  const { workouts, removeWorkout } = useWorkouts();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  useEffect(() => {
    if (selectedWorkout) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedWorkout]);

  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isToday(date)) {
      return 'Oggi';
    } else if (isYesterday(date)) {
      return 'Ieri';
    } else {
      const daysAgo = differenceInDays(new Date(), date);
      if (daysAgo < 7) {
        return `${daysAgo} giorni fa`;
      } else {
        return format(date, 'd MMMM yyyy');
      }
    }
  };

  // Group workouts by date
  const groupedWorkouts = workouts?.reduce(
    (groups: Record<string, Workout[]>, workout) => {
      const dateKey = new Date(workout.date).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(workout);
      return groups;
    },
    {}
  );

  return (
    <Container>
      <HistoryHeader>
        <HistoryTitle>Storico Allenamenti</HistoryTitle>
      </HistoryHeader>

      {workouts?.length === 0 ? (
        <EmptyState>
          <BiDumbbell
            size={40}
            opacity={0.3}
          />
          <EmptyText>Ancora nessun allenamento</EmptyText>
          <EmptySubtext>
            I tuoi allenamenti saranno memorizzati qui
          </EmptySubtext>
        </EmptyState>
      ) : (
        <WorkoutsList>
          {groupedWorkouts &&
            Object.entries(groupedWorkouts)
              .sort(
                ([dateA], [dateB]) =>
                  new Date(dateB).getTime() - new Date(dateA).getTime()
              )
              .map(([dateKey, dateWorkouts]) => (
                <DateGroup key={dateKey}>
                  <DateHeader>
                    <BiCalendar />
                    <DateText>{formatRelativeDate(dateKey)}</DateText>
                  </DateHeader>

                  {dateWorkouts.map((workout) => (
                    <WorkoutCard
                      key={workout._id}
                      $isExpanded={expandedWorkout === workout._id}
                      onClick={() =>
                        setExpandedWorkout(
                          expandedWorkout === workout._id ? null : workout._id
                        )
                      }
                    >
                      <WorkoutMain>
                        <WorkoutIconContainer $completed={workout.completed}>
                          <BiDumbbell size={22} />
                        </WorkoutIconContainer>

                        <WorkoutInfo>
                          <WorkoutName>{workout.name}</WorkoutName>
                          <WorkoutMeta>
                            <WorkoutTime>
                              <BiTime size={14} />
                              {format(new Date(workout.date), 'h:mm a')}
                            </WorkoutTime>
                            <StatusIndicator $completed={workout.completed}>
                              {workout.completed ? (
                                <>
                                  <BiCheck size={14} />
                                  Completo
                                </>
                              ) : (
                                <>
                                  <BiX size={14} />
                                  Incompleto
                                </>
                              )}
                            </StatusIndicator>
                          </WorkoutMeta>
                        </WorkoutInfo>

                        <ExpandButton
                          $isExpanded={expandedWorkout === workout._id}
                        >
                          <BiChevronRight size={22} />
                        </ExpandButton>
                      </WorkoutMain>

                      <AnimatePresence>
                        {expandedWorkout === workout._id && (
                          <WorkoutDetails
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {workout.notes && (
                              <NotesSection>
                                <NotesHeader>
                                  <BiNote size={16} />
                                  Note
                                </NotesHeader>
                                <NotesContent>{workout.notes}</NotesContent>
                              </NotesSection>
                            )}

                            <ActionButtons>
                              <ViewButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedWorkout(workout);
                                }}
                              >
                                Dettagli
                              </ViewButton>

                              <DeleteButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (
                                    window.confirm(
                                      'Are you sure you want to remove this workout?'
                                    )
                                  ) {
                                    removeWorkout(workout._id);
                                    setExpandedWorkout(null);
                                  }
                                }}
                              >
                                <BiTrash size={16} />
                                Elimina
                              </DeleteButton>
                            </ActionButtons>
                          </WorkoutDetails>
                        )}
                      </AnimatePresence>
                    </WorkoutCard>
                  ))}
                </DateGroup>
              ))}
        </WorkoutsList>
      )}

      <AnimatePresence>
        {selectedWorkout && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedWorkout(null)}
          >
            <ModalContent
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  <ModalIcon>
                    <BiDumbbell size={24} />
                  </ModalIcon>
                  {selectedWorkout.name}
                </ModalTitle>
                <CloseButton onClick={() => setSelectedWorkout(null)}>
                  <BiX size={24} />
                </CloseButton>
              </ModalHeader>

              <ModalBody>
                <DetailItem>
                  <DetailLabel>
                    <BiCalendar size={16} />
                    Data
                  </DetailLabel>
                  <DetailValue>
                    {format(new Date(selectedWorkout.date), 'd MMMM yyyy')}
                  </DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>
                    <BiTime size={16} />
                    Orario
                  </DetailLabel>
                  <DetailValue>
                    {format(new Date(selectedWorkout.date), 'h:mm a')}
                  </DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>
                    <BiCheck size={16} />
                    Status
                  </DetailLabel>
                  <StatusBadge $completed={selectedWorkout.completed}>
                    {selectedWorkout.completed ? 'Completed' : 'Incomplete'}
                  </StatusBadge>
                </DetailItem>

                {selectedWorkout.notes && (
                  <NotesContainer>
                    <NotesHeader>
                      <BiNote size={18} />
                      Note
                    </NotesHeader>
                    <NotesText>{selectedWorkout.notes}</NotesText>
                  </NotesContainer>
                )}
              </ModalBody>

              <ModalFooter>
                <DeleteWorkoutButton
                  onClick={() => {
                    if (
                      window.confirm(
                        'Sei sicuro di voler rimuovere questo allenamento?'
                      )
                    ) {
                      removeWorkout(selectedWorkout._id);
                      setSelectedWorkout(null);
                    }
                  }}
                >
                  <BiTrash size={18} />
                  Elimina Allenamento
                </DeleteWorkoutButton>

                <CloseModalButton onClick={() => setSelectedWorkout(null)}>
                  Chiudi
                </CloseModalButton>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
}

export default WorkoutHistory;

// Styled Components
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.white05};
  overflow: hidden;
`;

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};
`;

const HistoryTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.neon};
`;

const WorkoutsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const DateGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const DateHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.white05};
  color: ${({ theme }) => theme.colors.white70};
  font-size: 14px;
  font-weight: 500;
`;

const DateText = styled.span`
  font-size: 14px;
`;

const WorkoutCard = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};
  background: ${({ $isExpanded, theme }) =>
    $isExpanded ? theme.colors.white10 : 'transparent'};
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.white05};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const WorkoutMain = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  position: relative;
`;

const WorkoutIconContainer = styled.div<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  margin-right: 14px;
  background: ${({ $completed, theme }) =>
    $completed ? `${theme.colors.neon}20` : theme.colors.white10};
  color: ${({ $completed, theme }) =>
    $completed ? theme.colors.neon : theme.colors.white70};
`;

const WorkoutInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const WorkoutName = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WorkoutMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white50};
  gap: 12px;
`;

const WorkoutTime = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatusIndicator = styled.div<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: ${({ $completed, theme }) =>
    $completed ? theme.colors.neon : theme.colors.white50};
`;

const ExpandButton = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? '90deg' : '0deg')});
  color: ${({ theme }) => theme.colors.white50};
`;

const WorkoutDetails = styled(motion.div)`
  padding: 0 16px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.white10};
  margin-top: -1px;
`;

const NotesSection = styled.div`
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 8px;
  padding: 12px;
`;

const NotesHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white70};
  margin-bottom: 8px;
`;

const NotesContent = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.white};
  margin: 0;
  white-space: pre-wrap;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ViewButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.error};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
`;

const ModalContent = styled(motion.div)`
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.dark};
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};
`;

const ModalTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const ModalIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.neon}20;
  color: ${({ theme }) => theme.colors.neon};
`;

const CloseButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.white70};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  flex: 1;
  overflow-y: auto;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};

  &:first-child {
    padding-top: 0;
  }
`;

const DetailLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.white70};
`;

const DetailValue = styled.div`
  font-size: 15px;
  font-weight: 500;
`;

const StatusBadge = styled.div<{ $completed: boolean }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: ${({ $completed, theme }) =>
    $completed ? `${theme.colors.neon}20` : `${theme.colors.error}20`};
  color: ${({ $completed, theme }) =>
    $completed ? theme.colors.neon : theme.colors.error};
`;

const NotesContainer = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 12px;
`;

const NotesText = styled.p`
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.white10};
`;

const DeleteWorkoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 10px;
  background: transparent;
  color: ${({ theme }) => theme.colors.error};
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;

const CloseModalButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.white50};
`;

const EmptyText = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin: 16px 0 8px;
`;

const EmptySubtext = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white30};
  text-align: center;
`;
