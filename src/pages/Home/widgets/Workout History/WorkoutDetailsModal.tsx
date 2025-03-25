import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  BiX,
  BiCalendar,
  BiTime,
  BiCheck,
  BiStopwatch,
  BiTrash,
  BiNote,
  BiChevronDown,
  BiPlay,
  BiStop,
  BiDumbbell,
  BiMessageDetail,
} from 'react-icons/bi';
import { Workout } from './types';

interface WorkoutDetailsModalProps {
  workout: Workout;
  onClose: () => void;
  onDelete: () => void;
  formatDuration: (minutes?: number) => string;
  renderFeedbackStars: (feeling?: 1 | 2 | 3 | 4 | 5) => React.ReactNode;
  expandedSections: Record<string, boolean>;
  toggleSection: (sectionId: string) => void;
}

export const WorkoutDetailsModal: React.FC<WorkoutDetailsModalProps> = ({
  workout,
  onClose,
  onDelete,
  formatDuration,
  renderFeedbackStars,
  expandedSections,
  toggleSection,
}) => {
  return (
    <Overlay
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContainer
        as={motion.div}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle>{workout.name}</ModalTitle>
          <CloseButton onClick={onClose}>
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
              {format(new Date(workout.date), 'd MMMM yyyy', {
                locale: it,
              })}
            </DetailValue>
          </DetailItem>

          <DetailItem>
            <DetailLabel>
              <BiTime size={16} />
              Orario
            </DetailLabel>
            <DetailValue>{format(new Date(workout.date), 'HH:mm')}</DetailValue>
          </DetailItem>

          {/* Sezione durata */}
          {workout.duration && (
            <DetailItem>
              <DetailLabel>
                <BiStopwatch size={16} />
                Durata
              </DetailLabel>
              <DetailValue>{formatDuration(workout.duration)}</DetailValue>
            </DetailItem>
          )}

          {/* Tempi di inizio e fine */}
          <TimeGroup>
            {workout.startTime && (
              <TimeItem>
                <TimeLabel>
                  <BiPlay size={14} />
                  Inizio
                </TimeLabel>
                <TimeValue>
                  {format(new Date(workout.startTime), 'HH:mm')}
                </TimeValue>
              </TimeItem>
            )}

            {workout.endTime && (
              <TimeItem>
                <TimeLabel>
                  <BiStop size={14} />
                  Fine
                </TimeLabel>
                <TimeValue>
                  {format(new Date(workout.endTime), 'HH:mm')}
                </TimeValue>
              </TimeItem>
            )}
          </TimeGroup>

          <DetailItem>
            <DetailLabel>
              <BiCheck size={16} />
              Status
            </DetailLabel>
            <StatusBadge $completed={workout.completed}>
              {workout.completed ? 'Completato' : 'Incompleto'}
            </StatusBadge>
          </DetailItem>

          {/* Feedback esteso */}
          {workout.feedback && (
            <FeedbackDetailSection>
              <FeedbackDetailHeader>
                <BiMessageDetail size={18} />
                Feedback Allenamento
              </FeedbackDetailHeader>

              <FeedbackDetailGrid>
                {workout.feedback.feeling && (
                  <FeedbackDetailItem>
                    <FeedbackDetailLabel>Sensazione</FeedbackDetailLabel>
                    {renderFeedbackStars(
                      workout.feedback.feeling as 1 | 2 | 3 | 4 | 5
                    )}
                  </FeedbackDetailItem>
                )}

                {workout.feedback.energyLevel && (
                  <FeedbackDetailItem>
                    <FeedbackDetailLabel>Livello Energia</FeedbackDetailLabel>
                    <EnergyMeter
                      value={workout.feedback.energyLevel as 1 | 2 | 3 | 4 | 5}
                    />
                  </FeedbackDetailItem>
                )}

                {workout.feedback.difficulty && (
                  <FeedbackDetailItem>
                    <FeedbackDetailLabel>Difficoltà</FeedbackDetailLabel>
                    <DifficultyMeter
                      value={workout.feedback.difficulty as 1 | 2 | 3 | 4 | 5}
                    />
                  </FeedbackDetailItem>
                )}
              </FeedbackDetailGrid>

              {workout.feedback.notes && (
                <FeedbackDetailNotes>
                  <BiNote size={16} /> Note feedback
                  <FeedbackDetailNotesContent>
                    {workout.feedback.notes}
                  </FeedbackDetailNotesContent>
                </FeedbackDetailNotes>
              )}
            </FeedbackDetailSection>
          )}

          {/* Sezioni ed esercizi */}
          <SectionsContainer>
            <SectionTitle>Esercizi</SectionTitle>

            {workout.sections.map((section, sectionIndex) => {
              const sectionId = `modal-section-${sectionIndex}`;
              const isExpanded = !!expandedSections[sectionId];

              return (
                <SectionCard key={sectionId}>
                  <SectionHeader onClick={() => toggleSection(sectionId)}>
                    <SectionName>{section.name}</SectionName>
                    <ExerciseCount>
                      {section.exercises.length} esercizi
                    </ExerciseCount>
                    <SectionToggle $isExpanded={isExpanded}>
                      <BiChevronDown size={20} />
                    </SectionToggle>
                  </SectionHeader>

                  <AnimatePresence>
                    {isExpanded && (
                      <SectionContent
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {section.exercises.map((exercise, exerciseIndex) => (
                          <ExerciseContainer
                            key={`modal-ex-${sectionIndex}-${exerciseIndex}`}
                          >
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
                                    <BiDumbbell size={14} />
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
                                    <SetCol>Reps</SetCol>
                                    <SetCol>Peso</SetCol>
                                    <SetCol>Riposo</SetCol>
                                  </>
                                )}
                              </SetsHeader>

                              {exercise.exerciseSets.map((set, index) => (
                                <SetRow key={`set-${index}`}>
                                  <SetCol>{index + 1}</SetCol>
                                  {exercise.timeBased ? (
                                    <>
                                      <SetCol>{set.time}s</SetCol>
                                      <SetCol>{set.rest}s</SetCol>
                                    </>
                                  ) : (
                                    <>
                                      <SetCol>{set.reps || '-'}</SetCol>
                                      <SetCol>
                                        {set.weight ? `${set.weight}kg` : '-'}
                                      </SetCol>
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
                          </ExerciseContainer>
                        ))}
                      </SectionContent>
                    )}
                  </AnimatePresence>
                </SectionCard>
              );
            })}
          </SectionsContainer>

          {/* Note generali */}
          {workout.notes && (
            <NotesSection>
              <NotesHeader>
                <BiNote size={16} />
                Note
              </NotesHeader>
              <NotesContent>{workout.notes}</NotesContent>
            </NotesSection>
          )}
        </ModalBody>

        <ModalFooter>
          <DeleteButton
            onClick={onDelete}
            as={motion.button}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <BiTrash size={18} />
            Elimina
          </DeleteButton>
          <CloseModalButton
            onClick={onClose}
            as={motion.button}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Chiudi
          </CloseModalButton>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};

// Componenti per visualizzare i meter
const EnergyMeter = ({ value }: { value: 1 | 2 | 3 | 4 | 5 }) => (
  <MeterContainer>
    {[1, 2, 3, 4, 5].map((i) => (
      <MeterBar
        key={i}
        $active={i <= value}
        $color='#FFD166'
      />
    ))}
  </MeterContainer>
);

const DifficultyMeter = ({ value }: { value: 1 | 2 | 3 | 4 | 5 }) => (
  <MeterContainer>
    {[1, 2, 3, 4, 5].map((i) => (
      <MeterBar
        key={i}
        $active={i <= value}
        $color='#FF5F5F'
      />
    ))}
  </MeterContainer>
);

// Styled Components
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
`;

const ModalContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.dark};
  border-radius: 16px;
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid ${({ theme }) => theme.colors.white10};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.dark};
  z-index: 10;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white70};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};

  &:last-of-type {
    border-bottom: none;
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
  color: ${({ theme }) => theme.colors.white};
`;

const TimeGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 12px;
  margin: 0 0 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};
`;

const TimeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const TimeLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white50};
`;

const TimeValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const StatusBadge = styled.div<{ $completed: boolean }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background: ${({ $completed, theme }) =>
    $completed ? `${theme.colors.neon}20` : `${theme.colors.white10}`};
  color: ${({ $completed, theme }) =>
    $completed ? theme.colors.neon : theme.colors.white50};
`;

const FeedbackDetailSection = styled.div`
  margin-top: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 12px;
`;

const FeedbackDetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.neon};
`;

const FeedbackDetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

const FeedbackDetailItem = styled.div`
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FeedbackDetailLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white70};
`;

const FeedbackDetailNotes = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.white10};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white70};
  display: flex;
  align-items: flex-start;
  gap: 6px;
  flex-direction: column;
`;

const FeedbackDetailNotesContent = styled.div`
  margin-top: 8px;
  padding: 10px;
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white};
  white-space: pre-wrap;
  width: 100%;
`;

const MeterContainer = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
  height: 16px;
`;

const MeterBar = styled.div<{ $active: boolean; $color: string }>`
  height: 100%;
  width: 8px;
  border-radius: 2px;
  background-color: ${({ $active, $color, theme }) =>
    $active ? $color : theme.colors.white10};
`;

const SectionsContainer = styled.div`
  margin-top: 8px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
  color: ${({ theme }) => theme.colors.white};
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
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
  font-size: 15px;
  font-weight: 600;
`;

const ExerciseCount = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white50};
  margin-right: auto;
  margin-left: 12px;
`;

const SectionToggle = styled.div<{ $isExpanded: boolean }>`
  transition: transform 0.3s ease;
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? '180deg' : '0deg')});
`;

const SectionContent = styled(motion.div)`
  padding: 16px;
`;

const ExerciseContainer = styled.div`
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

const NotesSection = styled.div`
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 10px;
  padding: 16px;
  margin-top: 8px;
`;

const NotesHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.white};
`;

const NotesContent = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.white70};
  white-space: pre-wrap;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.white10};
`;

const DeleteButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.error};

  &:hover {
    background: ${({ theme }) => theme.colors.error}20;
  }
`;

const CloseModalButton = styled(motion.button)`
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.neon};
  border: none;
  color: ${({ theme }) => theme.colors.dark};
`;

export default WorkoutDetailsModal;
