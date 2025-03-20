// filepath: /Users/simoneborin/Project/fitappv2/src/pages/Home/widgets/WorkoutHistory.tsx
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
  BiStar,
  BiChevronDown,
  BiRepeat,
  BiListUl,
} from 'react-icons/bi';
import { AnimatePresence, motion } from 'framer-motion';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { testEndpoint } from '../../../service/WorkoutService';

// Types based on the Mongoose schema
interface WorkoutSet {
  reps?: number;
  weight?: number;
  rest: number;
  time?: number;
}

interface Exercise {
  name: string;
  exerciseSets: WorkoutSet[];
  notes?: string;
  timeBased: boolean;
}

interface Section {
  name: string;
  exercises: Exercise[];
}

interface WorkoutFeedback {
  feeling?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

interface Workout {
  _id: string;
  userId: string;
  name: string;
  sections: Section[];
  date: string;
  completed: boolean;
  feedback?: WorkoutFeedback;
  notes?: string;
}

function WorkoutHistory() {
  const { workouts, removeWorkout } = useWorkouts();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  // const API_URL = 'https://fit-app-backend-babz.onrender.com';
  // const token = localStorage.getItem('token');
  // // Usalo così
  // const testUrls = async (token: string) => {
  //   await testEndpoint(`${API_URL}/workouts`, token);
  //   await testEndpoint(`${API_URL}/api/workouts`, token);
  //   // Aggiungi altri percorsi che vuoi testare
  // };
  // testUrls(token);
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
        return format(date, 'd MMMM yyyy', { locale: it });
      }
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getTotalSets = (workout: Workout) => {
    return workout.sections.reduce((total, section) => {
      return (
        total +
        section.exercises.reduce((exerciseTotal, exercise) => {
          return exerciseTotal + exercise.exerciseSets.length;
        }, 0)
      );
    }, 0);
  };

  const getTotalExercises = (workout: Workout) => {
    return workout.sections.reduce((total, section) => {
      return total + section.exercises.length;
    }, 0);
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

  const renderFeedbackStars = (feeling?: 1 | 2 | 3 | 4 | 5) => {
    if (!feeling) return null;

    return (
      <FeelingStars>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            $active={star <= feeling}
          >
            <BiStar size={16} />
          </Star>
        ))}
      </FeelingStars>
    );
  };

  return (
    <Container>
      <HistoryHeader>
        <HistoryTitle>Storico Allenamenti</HistoryTitle>
      </HistoryHeader>

      {!workouts || workouts.length === 0 ? (
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
                              {format(new Date(workout.date), 'HH:mm')}
                            </WorkoutTime>
                            <StatusIndicator $completed={workout.completed}>
                              {workout.completed ? (
                                <>
                                  <BiCheck size={14} />
                                  Completato
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
                            <WorkoutSummary>
                              <SummaryItem>
                                <BiListUl size={16} />
                                <SummaryLabel>Sezioni:</SummaryLabel>
                                <SummaryValue>
                                  {workout.sections.length}
                                </SummaryValue>
                              </SummaryItem>
                              <SummaryItem>
                                <BiDumbbell size={16} />
                                <SummaryLabel>Esercizi:</SummaryLabel>
                                <SummaryValue>
                                  {getTotalExercises(workout)}
                                </SummaryValue>
                              </SummaryItem>
                              <SummaryItem>
                                <BiRepeat size={16} />
                                <SummaryLabel>Set Totali:</SummaryLabel>
                                <SummaryValue>
                                  {getTotalSets(workout)}
                                </SummaryValue>
                              </SummaryItem>
                            </WorkoutSummary>

                            {workout.feedback && workout.feedback.feeling && (
                              <FeedbackSection>
                                <SectionLabel>Feedback</SectionLabel>
                                {renderFeedbackStars(workout.feedback.feeling)}
                                {workout.feedback.notes && (
                                  <FeedbackNotes>
                                    {workout.feedback.notes}
                                  </FeedbackNotes>
                                )}
                              </FeedbackSection>
                            )}

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
                                      'Sei sicuro di voler rimuovere questo allenamento?'
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
                <ModalTitle
                  onClick={() => {
                    console.log(selectedWorkout);
                  }}
                >
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
                    {format(new Date(selectedWorkout.date), 'd MMMM yyyy', {
                      locale: it,
                    })}
                  </DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>
                    <BiTime size={16} />
                    Orario
                  </DetailLabel>
                  <DetailValue>
                    {format(new Date(selectedWorkout.date), 'HH:mm')}
                  </DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>
                    <BiCheck size={16} />
                    Status
                  </DetailLabel>
                  <StatusBadge $completed={selectedWorkout.completed}>
                    {selectedWorkout.completed ? 'Completato' : 'Incompleto'}
                  </StatusBadge>
                </DetailItem>

                {selectedWorkout.feedback &&
                  selectedWorkout.feedback.feeling && (
                    <DetailItem>
                      <DetailLabel>
                        <BiStar size={16} />
                        Valutazione
                      </DetailLabel>
                      {renderFeedbackStars(selectedWorkout.feedback.feeling)}
                    </DetailItem>
                  )}

                {selectedWorkout.notes && (
                  <NotesContainer>
                    <NotesHeader>
                      <BiNote size={18} />
                      Note Generali
                    </NotesHeader>
                    <NotesText>{selectedWorkout.notes}</NotesText>
                  </NotesContainer>
                )}

                {/* Workout Sections */}
                <SectionsContainer>
                  <SectionsTitle>Dettagli Allenamento</SectionsTitle>

                  {selectedWorkout.sections.map((section, sIndex) => (
                    <SectionCard key={sIndex}>
                      <SectionHeader
                        onClick={() =>
                          toggleSection(`${selectedWorkout._id}-${sIndex}`)
                        }
                      >
                        <SectionName>{section.name}</SectionName>
                        <SectionToggle
                          $isExpanded={
                            !!expandedSections[
                              `${selectedWorkout._id}-${sIndex}`
                            ]
                          }
                        >
                          <BiChevronDown size={20} />
                        </SectionToggle>
                      </SectionHeader>

                      <AnimatePresence>
                        {expandedSections[
                          `${selectedWorkout._id}-${sIndex}`
                        ] && (
                          <SectionContent
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {section.exercises.map((exercise, eIndex) => (
                              <ExerciseItem key={eIndex}>
                                <ExerciseHeader>
                                  <ExerciseName>{exercise.name}</ExerciseName>
                                  <ExerciseType>
                                    {exercise.timeBased ? (
                                      <>
                                        <BiTime size={14} />
                                        Basato sul tempo
                                      </>
                                    ) : (
                                      <>
                                        <BiRepeat size={14} />
                                        Basato su ripetizioni
                                      </>
                                    )}
                                  </ExerciseType>
                                </ExerciseHeader>

                                <SetsTable>
                                  <SetsHeader>
                                    <SetCol>Set</SetCol>
                                    {exercise.timeBased ? (
                                      <>
                                        <SetCol>Tempo</SetCol>
                                        <SetCol>Riposo</SetCol>
                                      </>
                                    ) : (
                                      <>
                                        <SetCol>Peso</SetCol>
                                        <SetCol>Reps</SetCol>
                                        <SetCol>Riposo</SetCol>
                                      </>
                                    )}
                                  </SetsHeader>

                                  {exercise.exerciseSets.map((set, sIndex) => (
                                    <SetRow key={sIndex}>
                                      <SetCol>{sIndex + 1}</SetCol>
                                      {exercise.timeBased ? (
                                        <>
                                          <SetCol>{set.time}s</SetCol>
                                          <SetCol>{set.rest}s</SetCol>
                                        </>
                                      ) : (
                                        <>
                                          <SetCol>{set.weight} kg</SetCol>
                                          <SetCol>{set.reps} rep</SetCol>
                                          <SetCol>{set.rest}s</SetCol>
                                        </>
                                      )}
                                    </SetRow>
                                  ))}
                                </SetsTable>

                                {exercise.notes && (
                                  <ExerciseNotes>
                                    <BiNote size={14} /> {exercise.notes}
                                  </ExerciseNotes>
                                )}
                              </ExerciseItem>
                            ))}
                          </SectionContent>
                        )}
                      </AnimatePresence>
                    </SectionCard>
                  ))}
                </SectionsContainer>
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

const WorkoutSummary = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 16px;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white70};
`;

const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.white50};
`;

const SummaryValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const FeedbackSection = styled.div`
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 10px;
  padding: 12px;
`;

const SectionLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.white70};
`;

const FeelingStars = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 8px;
`;

const Star = styled.div<{ $active: boolean }>`
  color: ${({ $active, theme }) =>
    $active ? theme.colors.neon : theme.colors.white20};
`;

const FeedbackNotes = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.white};
  margin: 8px 0 0;
  white-space: pre-wrap;
`;

const NotesSection = styled.div`
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 10px;
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

// New Styled Components for Sections and Exercises
const SectionsContainer = styled.div`
  margin-top: 24px;
`;

const SectionsTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.neon};
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};
`;

const SectionName = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const SectionToggle = styled.div<{ $isExpanded: boolean }>`
  transition: transform 0.3s ease;
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? '180deg' : '0deg')});
`;

const SectionContent = styled(motion.div)`
  padding: 16px;
`;

const ExerciseItem = styled.div`
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ExerciseHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

const ExerciseName = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const ExerciseType = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white50};
`;

const SetsTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  background: ${({ theme }) => theme.colors.white05};
`;

const SetsHeader = styled.div`
  display: flex;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.white10};
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};
`;

const SetRow = styled.div`
  display: flex;
  padding: 10px 12px;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.white05};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.white05};
  }
`;

const SetCol = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  text-align: center;

  &:first-child {
    justify-content: center;
    max-width: 40px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.white70};
  }
`;

const ExerciseNotes = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  background: ${({ theme }) => theme.colors.white05};
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.white70};
  white-space: pre-wrap;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.white10};
`;

const DeleteWorkoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.error};
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;

const CloseModalButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

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
  text-align: center;
  color: ${({ theme }) => theme.colors.white50};
`;

const EmptyText = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin: 16px 0 8px;
`;

const EmptySubtext = styled.div`
  font-size: 14px;
  opacity: 0.7;
`;
