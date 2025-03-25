import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { BiDumbbell, BiCalendar, BiStar } from 'react-icons/bi';
import { AnimatePresence } from 'framer-motion';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { WorkoutCardComponent } from './WorkoutCard';
import { WorkoutDetailsModal } from './WorkoutDetailsModal';
import { useWorkouts } from '../../../../context/WorkoutContext';

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
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  completedAt?: string;
}

interface Workout {
  _id: string;
  userId: string;
  name: string;
  sections: Section[];
  date: string;
  completed: boolean;
  startTime?: string;
  endTime?: string;
  duration?: number;
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

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/D';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} min`;
    return `${hours}h ${mins}m`;
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
                    <WorkoutCardComponent
                      key={workout._id}
                      workout={workout}
                      expanded={expandedWorkout === workout._id}
                      toggleExpanded={() =>
                        setExpandedWorkout(
                          expandedWorkout === workout._id ? null : workout._id
                        )
                      }
                      expandedSections={expandedSections}
                      toggleSection={toggleSection}
                      showDetails={() => setSelectedWorkout(workout)}
                      deleteWorkout={() => {
                        if (
                          window.confirm(
                            'Sei sicuro di voler rimuovere questo allenamento?'
                          )
                        ) {
                          removeWorkout(workout._id);
                          setExpandedWorkout(null);
                        }
                      }}
                      renderFeedbackStars={renderFeedbackStars}
                      formatDuration={formatDuration}
                      getTotalExercises={getTotalExercises}
                      getTotalSets={getTotalSets}
                    />
                  ))}
                </DateGroup>
              ))}
        </WorkoutsList>
      )}

      <AnimatePresence>
        {selectedWorkout && (
          <WorkoutDetailsModal
            workout={selectedWorkout}
            onClose={() => setSelectedWorkout(null)}
            onDelete={() => {
              if (
                window.confirm(
                  'Sei sicuro di voler rimuovere questo allenamento?'
                )
              ) {
                removeWorkout(selectedWorkout._id);
                setSelectedWorkout(null);
              }
            }}
            formatDuration={formatDuration}
            renderFeedbackStars={renderFeedbackStars}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
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

const FeelingStars = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 8px;
`;

const Star = styled.div<{ $active: boolean }>`
  color: ${({ $active, theme }) =>
    $active ? theme.colors.neon : theme.colors.white20};
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
