import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkouts } from '../../../context/WorkoutContext';
import { PieChart, Pie, Cell } from 'recharts';
import {
  BiDumbbell,
  BiCheck,
  BiFlag,
  BiTrendingUp,
  BiPlus,
} from 'react-icons/bi';
import { BsClock } from 'react-icons/bs';
import { CgCalendar, CgOptions } from 'react-icons/cg';
import { GiFlame } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

type Stat = {
  name: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  id: number;
  color: string;
};

const TodayData: React.FC = () => {
  const { workouts = [], setActiveWorkout } = useWorkouts();
  const navigate = useNavigate();
  const [activeStats, setActiveStats] = useState<{ id: number }[]>([]);
  const [statsBuffer, setStatsBuffer] = useState<Stat[]>([]);
  const [optionPanel, setOptionPanel] = useState(false);

  const iconSize = 24;

  const stats: Stat[] = [
    {
      name: 'Volume',
      icon: <BiDumbbell size={iconSize} />,
      value: '1,200',
      label: 'kg',
      id: 0,
      color: '#00C6BE',
    },
    {
      name: 'Calories',
      icon: <GiFlame size={iconSize} />,
      value: '3,200',
      label: 'kcal',
      id: 1,
      color: '#FF5F5F',
    },
    {
      name: 'Time',
      icon: <BsClock size={iconSize} />,
      value: '6',
      label: 'hours',
      id: 2,
      color: '#FFD166',
    },
    {
      name: 'Days Active',
      icon: <CgCalendar size={iconSize} />,
      value: '5/7',
      label: 'days',
      id: 3,
      color: '#4ECDC4',
    },
  ];

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

  // Load saved stats on component mount
  useEffect(() => {
    const savedStats = JSON.parse(
      localStorage.getItem('weekly-active-stats') || '[]'
    );
    setActiveStats(savedStats);

    // Populate statsBuffer with actual stat objects
    const initialBuffer = stats.filter((stat) =>
      savedStats.some((activeStat: { id: number }) => activeStat.id === stat.id)
    );
    setStatsBuffer(initialBuffer);

    // Show options panel if no stats are selected
    if (savedStats.length === 0) {
      // Don't auto-open the panel, just have a default state
      const defaultStats = [stats[0], stats[1]]; // Volume and Calories as default
      setStatsBuffer(defaultStats);
      setActiveStats(defaultStats.map((stat) => ({ id: stat.id })));
      localStorage.setItem(
        'weekly-active-stats',
        JSON.stringify(defaultStats.map((stat) => ({ id: stat.id })))
      );
    }
  }, []);

  const toggleStat = (stat: Stat) => {
    const isSelected = statsBuffer.some((item) => item.id === stat.id);

    if (isSelected) {
      setStatsBuffer(statsBuffer.filter((item) => item.id !== stat.id));
    } else {
      setStatsBuffer([...statsBuffer, stat]);
    }
  };

  const saveStats = () => {
    const statsToStore = statsBuffer.map(({ id }) => ({ id }));
    localStorage.setItem('weekly-active-stats', JSON.stringify(statsToStore));
    setActiveStats(statsToStore);
    setOptionPanel(false);
  };

  const filteredStats = stats.filter((stat) =>
    activeStats.some((activeStat) => activeStat.id === stat.id)
  );

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
      {/* Today's Workout Section */}
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
      </CardContent>

      <Divider />

      {/* Weekly Stats Section */}
      <CardHeader>
        <WeekProgress>Progresso settimanale</WeekProgress>
        <OptionButton
          onClick={() => setOptionPanel(!optionPanel)}
          as={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          $isActive={optionPanel}
        >
          {optionPanel ? <MdClose size={16} /> : <CgOptions size={16} />}
        </OptionButton>
      </CardHeader>

      <AnimatePresence>
        {optionPanel ? (
          <OptionPanel
            as={motion.div}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChoiceContainer>
              {stats.map((stat) => {
                const isSelected = statsBuffer.some(
                  (item) => item.id === stat.id
                );
                return (
                  <StatChoice
                    key={stat.id}
                    onClick={() => toggleStat(stat)}
                    $selected={isSelected}
                    $color={stat.color}
                    as={motion.div}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconWrapper
                      $selected={isSelected}
                      $color={stat.color}
                    >
                      {stat.icon}
                      {isSelected && (
                        <SelectionIndicator>
                          <BiCheck size={12} />
                        </SelectionIndicator>
                      )}
                    </IconWrapper>
                    <StatName>{stat.name}</StatName>
                  </StatChoice>
                );
              })}
            </ChoiceContainer>

            <ButtonContainer>
              <CancelButton
                onClick={() => setOptionPanel(false)}
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Annulla
              </CancelButton>
              <SaveButton
                onClick={saveStats}
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={statsBuffer.length === 0}
              >
                Salva
              </SaveButton>
            </ButtonContainer>
          </OptionPanel>
        ) : (
          <WeeklyStatsLayout>
            {/* Progress Pie Chart */}
            <ChartSection>
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
              <BasicStats>
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
              </BasicStats>
            </ChartSection>

            {/* Custom Weekly Stats */}
            <CustomStatsContainer
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredStats.length > 0 ? (
                filteredStats.map((stat) => (
                  <StatItem
                    key={stat.id}
                    as={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='custom-stat'
                  >
                    <StatIconContainer $color={stat.color}>
                      {stat.icon}
                    </StatIconContainer>
                    <StatContent>
                      <StatValue>{stat.value}</StatValue>
                      <StatLabel>{stat.label}</StatLabel>
                    </StatContent>
                  </StatItem>
                ))
              ) : (
                <EmptyState>
                  <EmptyText>Seleziona statistiche da visualizzare</EmptyText>
                  <EmptyAction onClick={() => setOptionPanel(true)}>
                    Seleziona
                  </EmptyAction>
                </EmptyState>
              )}
            </CustomStatsContainer>
          </WeeklyStatsLayout>
        )}
      </AnimatePresence>
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
  border: 1px solid ${({ theme }) => theme.colors.white10};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};
`;

const WeekProgress = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
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
  margin: 0;
`;

const WeeklyStatsLayout = styled.div`
  padding: 16px 0;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChartSection = styled.div`
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

const BasicStats = styled.div`
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

  &.custom-stat {
    /* padding: 12px; */
    background: ${({ theme }) => theme.colors.white05};
    border-radius: 12px;
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.white50};
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

// Weekly Stats Specific Styles
const OptionButton = styled(motion.button)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.neon : theme.colors.white10};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.dark : theme.colors.white70};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.neon : theme.colors.white20};
  }
`;

const OptionPanel = styled(motion.div)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
`;

const ChoiceContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
`;

const StatChoice = styled(motion.div)<{ $selected: boolean; $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border-radius: 12px;
  background: ${({ $selected, $color }) =>
    $selected ? `${$color}20` : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $selected, $color, theme }) =>
      $selected ? `${$color}30` : theme.colors.white05};
  }
`;

const IconWrapper = styled.div<{ $selected: boolean; $color: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $selected, $color, theme }) =>
    $selected ? `${$color}30` : theme.colors.white10};
  color: ${({ $selected, $color, theme }) =>
    $selected ? $color : theme.colors.white50};
`;

const SelectionIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatName = styled.div`
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
`;

const CancelButton = styled(Button)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.white20};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
  }
`;

const SaveButton = styled(Button)`
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CustomStatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
`;

const StatIconContainer = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${({ $color }) => `${$color}20`};
  color: ${({ $color }) => $color};
  margin-bottom: 8px;
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const EmptyText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white50};
`;

const EmptyAction = styled.button`
  background: ${({ theme }) => theme.colors.white10};
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.white};
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
  }
`;
