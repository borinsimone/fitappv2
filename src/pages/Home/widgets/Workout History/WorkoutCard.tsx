import React from 'react';
import styled from 'styled-components';
import { Workout } from './types';
import {
  BiChevronRight,
  BiCheck,
  BiTime,
  BiX,
  BiDumbbell,
  BiTrash,
  BiRepeat,
  BiListUl,
  BiTime as BiTimeIcon,
  BiPlay,
  BiStop,
  BiSmile,
  BiBattery,
} from 'react-icons/bi';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionsList } from './SectionList';

interface WorkoutCardProps {
  workout: Workout;
  expanded: boolean;
  toggleExpanded: () => void;
  expandedSections: Record<string, boolean>;
  toggleSection: (sectionId: string) => void;
  showDetails: () => void;
  deleteWorkout: () => void;
  renderFeedbackStars: (feeling?: 1 | 2 | 3 | 4 | 5) => React.ReactNode;
  formatDuration: (minutes?: number) => string;
  getTotalExercises: (workout: Workout) => number;
  getTotalSets: (workout: Workout) => number;
}

export const WorkoutCardComponent: React.FC<WorkoutCardProps> = ({
  workout,
  expanded,
  toggleExpanded,
  expandedSections,
  toggleSection,
  showDetails,
  deleteWorkout,
  renderFeedbackStars,
  formatDuration,
  getTotalExercises,
  getTotalSets,
}) => {
  return (
    <WorkoutCard
      $isExpanded={expanded}
      onClick={toggleExpanded}
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
        <ExpandButton $isExpanded={expanded}>
          <BiChevronRight size={22} />
        </ExpandButton>
      </WorkoutMain>

      <AnimatePresence>
        {expanded && (
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
                <SummaryValue>{workout.sections.length}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <BiDumbbell size={16} />
                <SummaryLabel>Esercizi:</SummaryLabel>
                <SummaryValue>{getTotalExercises(workout)}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <BiRepeat size={16} />
                <SummaryLabel>Set Totali:</SummaryLabel>
                <SummaryValue>{getTotalSets(workout)}</SummaryValue>
              </SummaryItem>
            </WorkoutSummary>

            {workout.duration && (
              <TimeSection>
                <TimeItem>
                  <BiTimeIcon size={16} />
                  <TimeLabel>Durata</TimeLabel>
                  <TimeValue>{formatDuration(workout.duration)}</TimeValue>
                </TimeItem>
                {workout.startTime && (
                  <TimeItem>
                    <BiPlay size={16} />
                    <TimeLabel>Inizio</TimeLabel>
                    <TimeValue>
                      {format(new Date(workout.startTime), 'HH:mm')}
                    </TimeValue>
                  </TimeItem>
                )}
                {workout.endTime && (
                  <TimeItem>
                    <BiStop size={16} />
                    <TimeLabel>Fine</TimeLabel>
                    <TimeValue>
                      {format(new Date(workout.endTime), 'HH:mm')}
                    </TimeValue>
                  </TimeItem>
                )}
              </TimeSection>
            )}

            {workout.feedback && (
              <FeedbackSection>
                <SectionLabel>Feedback</SectionLabel>

                <FeedbackGrid>
                  {workout.feedback.feeling && (
                    <FeedbackItem>
                      <FeedbackIcon>
                        <BiSmile size={18} />
                      </FeedbackIcon>
                      <FeedbackLabel>Sensazione</FeedbackLabel>
                      {renderFeedbackStars(workout.feedback.feeling)}
                    </FeedbackItem>
                  )}

                  {workout.feedback.energyLevel && (
                    <FeedbackItem>
                      <FeedbackIcon>
                        <BiBattery size={18} />
                      </FeedbackIcon>
                      <FeedbackLabel>Energia</FeedbackLabel>
                      <FeedbackValue>
                        {workout.feedback.energyLevel}/5
                      </FeedbackValue>
                    </FeedbackItem>
                  )}

                  {workout.feedback.difficulty && (
                    <FeedbackItem>
                      <FeedbackIcon>
                        <BiDumbbell size={18} />
                      </FeedbackIcon>
                      <FeedbackLabel>Difficoltà</FeedbackLabel>
                      <FeedbackValue>
                        {workout.feedback.difficulty}/5
                      </FeedbackValue>
                    </FeedbackItem>
                  )}
                </FeedbackGrid>

                {workout.feedback.notes && (
                  <FeedbackNotes>{workout.feedback.notes}</FeedbackNotes>
                )}
              </FeedbackSection>
            )}

            {/* Sezione degli esercizi */}
            {/* <SectionsList
              sections={workout.sections}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            /> */}

            <ActionButtons>
              <ViewButton
                onClick={(e) => {
                  e.stopPropagation();
                  showDetails();
                }}
              >
                Dettagli
              </ViewButton>

              <DeleteButton
                onClick={(e) => {
                  e.stopPropagation();
                  deleteWorkout();
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
  );
};

// Styled Components
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

const TimeSection = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 16px;
`;

const TimeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const TimeLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.white50};
`;

const TimeValue = styled.span`
  font-size: 14px;
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

const FeedbackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

const FeedbackItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 8px;
  padding: 10px;
`;

const FeedbackIcon = styled.div`
  color: ${({ theme }) => theme.colors.neon};
`;

const FeedbackLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.white50};
`;

const FeedbackValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const FeedbackNotes = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.white};
  margin: 8px 0 0;
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
