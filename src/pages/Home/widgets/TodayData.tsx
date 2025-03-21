import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useWorkouts } from '../../../context/WorkoutContext';
import { PieChart, Pie, Cell } from 'recharts';
import {
  BiDumbbell,
  BiCheck,
  BiFlag,
  BiTrendingUp,
  BiPlus,
} from 'react-icons/bi';

import { useNavigate } from 'react-router-dom';

const TodayData: React.FC = () => {
  const { workouts = [], setActiveWorkout } = useWorkouts();
  const navigate = useNavigate();

  // Get today's workout
  const today = new Date();
  const todayWorkout = workouts?.find((workout) => {
    if (!workout.date) return false;
    const workoutDate = new Date(workout.date);
    return workoutDate.toDateString() === today.toDateString();
  });

  // Get current week range
  const currentMonday = new Date(today);
  currentMonday.setDate(
    today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
  );
  currentMonday.setHours(0, 0, 0, 0);

  const currentSunday = new Date(currentMonday);
  currentSunday.setDate(currentMonday.getDate() + 6);
  currentSunday.setHours(23, 59, 59, 999);

  // Filter workouts for current week
  const weeklyWorkouts = workouts?.filter((workout) => {
    if (!workout.date) return false;
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);
    return workoutDate >= currentMonday && workoutDate <= currentSunday;
  });

  const completedWorkouts =
    weeklyWorkouts?.filter((workout) => workout.completed).length || 0;
  const totalWorkouts = weeklyWorkouts?.length || 0;
  const completionPercentage =
    totalWorkouts > 0
      ? Math.round((completedWorkouts / totalWorkouts) * 100)
      : 0;

  const chartData = [
    { name: 'Completed', value: completedWorkouts },
    { name: 'Remaining', value: totalWorkouts - completedWorkouts },
  ];

  const theme = {
    colors: {
      neon: '#00ff00',
      white20: 'rgba(255, 255, 255, 0.2)',
    },
  };

  const COLORS = [theme.colors.neon, theme.colors.white20];

  const handleAddWorkout = () => {
    navigate('/add-workout');
  };

  const handleStartWorkout = () => {
    if (todayWorkout) {
      setActiveWorkout({
        ...todayWorkout,
        name: todayWorkout.name,
      });
      navigate('/workout-assistant');
    }
  };

  return (
    <Container
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader>
        {/* <TodayDate>
          <BiCalendarPlus size={18} />
          {format(today, 'EEEE, MMM d')}
        </TodayDate> */}
        <WeekProgress>Progresso settimanale</WeekProgress>
      </CardHeader>

      <CardContent>
        <WorkoutInfoSection>
          {todayWorkout ? (
            <>
              <WorkoutIcon>
                <BiDumbbell size={22} />
              </WorkoutIcon>

              <WorkoutInfo>
                <WorkoutTitle>{todayWorkout.name}</WorkoutTitle>
                <WorkoutStatus $completed={todayWorkout.completed || false}>
                  {todayWorkout.completed ? (
                    <>
                      <BiCheck size={16} />
                      Completi
                    </>
                  ) : (
                    <>
                      <BiFlag size={16} />
                      Programmati
                    </>
                  )}
                </WorkoutStatus>
              </WorkoutInfo>

              {!todayWorkout.completed && (
                <StartButton
                  onClick={handleStartWorkout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Inizia
                </StartButton>
              )}
            </>
          ) : (
            <>
              <EmptyWorkoutIcon>
                <BiDumbbell size={22} />
              </EmptyWorkoutIcon>

              <WorkoutInfo>
                <EmptyWorkoutTitle>Nessun allenamento</EmptyWorkoutTitle>
                <EmptyWorkoutSubtitle>
                  Aggiungi un allenamento per oggi
                </EmptyWorkoutSubtitle>
              </WorkoutInfo>

              <AddButton
                onClick={handleAddWorkout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BiPlus size='20px' />
              </AddButton>
            </>
          )}
        </WorkoutInfoSection>

        <Divider />

        <WeeklyProgressSection>
          <ChartContainer>
            {totalWorkouts > 0 ? (
              <PieChart
                width={80}
                height={80}
              >
                <Pie
                  data={chartData}
                  cx='50%'
                  cy='50%'
                  innerRadius={28}
                  outerRadius={36}
                  fill='#8884d8'
                  paddingAngle={2}
                  dataKey='value'
                  startAngle={90}
                  endAngle={-270}
                  stroke='none'
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <text
                  x='50%'
                  y='50%'
                  textAnchor='middle'
                  dominantBaseline='middle'
                  fontSize='14px'
                  fontWeight='600'
                  fill='#fff'
                >
                  {completionPercentage}%
                </text>
              </PieChart>
            ) : (
              <EmptyChart>
                <BiTrendingUp size={24} />
              </EmptyChart>
            )}
          </ChartContainer>
          <WeeklyStats>
            <StatItem>
              <StatLabel>Completi</StatLabel>
              <StatValue>{completedWorkouts}</StatValue>
            </StatItem>

            <StatItem>
              <StatLabel>Totali</StatLabel>
              <StatValue>{totalWorkouts}</StatValue>
            </StatItem>

            <StatItem>
              <StatLabel>Rimanenti</StatLabel>
              <StatValue>{totalWorkouts - completedWorkouts}</StatValue>
            </StatItem>
          </WeeklyStats>
        </WeeklyProgressSection>
      </CardContent>
    </Container>
  );
};

export default TodayData;

// Styled Components
const Container = styled(motion.div)`
  width: 100%;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.white05};
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.neon};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: ${({ theme }) => theme.colors.neon};
`;

// const TodayDate = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   font-size: 14px;
//   font-weight: 500;
//   color: ${({ theme }) => theme.colors.dark};
// `;

const WeekProgress = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
`;

const CardContent = styled.div`
  padding: 16px;
`;

const WorkoutInfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const WorkoutIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.neon}20;
  color: ${({ theme }) => theme.colors.neon};
`;

const EmptyWorkoutIcon = styled(WorkoutIcon)`
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white50};
`;

const WorkoutInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const WorkoutTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
`;

const EmptyWorkoutTitle = styled(WorkoutTitle)`
  color: ${({ theme }) => theme.colors.white70};
`;

const EmptyWorkoutSubtitle = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white50};
`;

const WorkoutStatus = styled.div<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ $completed, theme }) =>
    $completed ? theme.colors.neon : theme.colors.white50};
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const StartButton = styled(Button)`
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
`;

const AddButton = styled(Button)`
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.white10};
  margin: 16px 0;
`;

const WeeklyProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ChartContainer = styled.div`
  position: relative;
`;

const EmptyChart = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white30};
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 50%;
`;

const WeeklyStats = styled.div`
  flex: 1;
  display: flex;
  gap: 16px;
`;

const StatItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.white50};
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;
