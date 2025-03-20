import styled from 'styled-components';
import { useGlobalContext } from '../../context/GlobalContext';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import TopBar from './TopBar';
import { AnimatePresence, motion } from 'framer-motion';
import Widget from './Widget';

import { LuBadge } from 'react-icons/lu';
import { useWorkouts } from '../../context/WorkoutContext';
import TodayData from './widgets/TodayData';
import WeeklyStats from './widgets/WeeklyStats';
import WorkoutHistory from './widgets/WorkoutHistory';
import Achievements from './widgets/Achievements';

function Home() {
  const { loadWorkouts } = useWorkouts();
  const { setUser } = useGlobalContext();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
      setUser(decoded);
    }
  }, []);
  // console.log(workouts);
  useEffect(() => {
    loadWorkouts();
  }, []);
  return (
    <Container
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        <TopBar />
      </AnimatePresence>

      <div className='widgetContainer'>
        <Widget index={0}>
          <TodayData />
        </Widget>
        <Widget index={1}>
          <Achievements />
        </Widget>
        <Widget index={2}>
          <WeeklyStats />
        </Widget>
        <Widget index={3}>
          <WorkoutHistory />
        </Widget>
      </div>
    </Container>
  );
}

export default Home;
const Container = styled.div`
  height: 100vh;
  height: 100dvh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10vh;
  padding: 20px;
  gap: 20px;
  padding-bottom: 10vh;
  overflow: hidden;
  .logoutBtn {
    position: absolute;
    right: 0;
    top: 0;
  }
  .widgetContainer {
    width: 100%;
    flex: 1;
    /* background-color: #ffffff10; */
    position: relative;
    overflow: scroll;
  }
`;
