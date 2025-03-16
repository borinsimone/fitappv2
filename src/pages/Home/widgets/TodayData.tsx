import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useWorkouts } from '../../../context/WorkoutContext';
import { PieChart, Pie, Cell } from 'recharts';
import { MdAdd } from 'react-icons/md';

const TodayData: React.FC = () => {
  const { workouts = [] } = useWorkouts();
  const todayWorkout = workouts?.find((workout) => {
    if (!workout.date) return false;
    const workoutDate = new Date(workout.date);
    const today = new Date();
    return workoutDate.toDateString() === today.toDateString();
  });

  console.log("Today's workout:", todayWorkout);

  const today = new Date();

  // Get current week range
  const currentMonday = new Date(today);
  currentMonday.setDate(
    today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
  );
  currentMonday.setHours(0, 0, 0, 0);

  const currentSunday = new Date(currentMonday);
  currentSunday.setDate(currentMonday.getDate() + 6);
  currentSunday.setHours(23, 59, 59, 999);
  const weeklyWorkouts = workouts?.filter((workout) => {
    if (!workout.date) return false;
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);
    return workoutDate >= currentMonday && workoutDate <= currentSunday;
  });

  const completedWorkouts =
    weeklyWorkouts?.filter((workout) => workout.completed).length || 0;
  const totalWorkouts = weeklyWorkouts?.length || 0;

  const data = [
    { name: 'Completati', value: completedWorkouts },
    { name: 'Rimanenti', value: totalWorkouts - completedWorkouts },
  ];
  const COLORS = ['#00C6BE', '#00C6BE30'];

  return (
    <Container onClick={() => console.log(weeklyWorkouts)}>
      {totalWorkouts > 0 && (
        <ChartContainer
          onClick={() => {
            alert(
              `Forza, ti mancano solo ${
                totalWorkouts - completedWorkouts
              } allenamenti!`
            );
          }}
        >
          <PieChart
            width={60}
            height={60}
          >
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              innerRadius={22}
              outerRadius={28}
              fill='#8884d8'
              paddingAngle={0}
              dataKey='value'
              startAngle={90}
              endAngle={-270}
              stroke='none'
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {/* Aggiungiamo il testo al centro del grafico */}
            <text
              x='50%'
              y='50%'
              textAnchor='middle'
              dominantBaseline='middle'
              fontSize='14px'
              fill='#fff'
            >
              {`${completedWorkouts}/${totalWorkouts}`}
            </text>
          </PieChart>
        </ChartContainer>
      )}

      <div className='workoutName'>
        {todayWorkout
          ? todayWorkout.name
          : 'Nessun allenamento programmato per oggi'}
      </div>
      {!todayWorkout && (
        <div
          className='addWorkout'
          onClick={() => {
            alert('apri form per aggiungere allenamento in data di oggi');
          }}
        >
          <MdAdd size={30} />
        </div>
      )}
    </Container>
  );
};

const Container = styled(motion.div)`
  width: 100%;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.neon};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  div {
    display: flex;
    align-items: center;
  }
`;
const ChartContainer = styled.div``;

export default TodayData;
