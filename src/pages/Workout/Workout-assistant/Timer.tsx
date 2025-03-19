import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { BiPlay, BiPause } from 'react-icons/bi';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { motion } from 'framer-motion';

interface ExerciseSet {
  weight?: number;
  reps?: number;
  time?: number;
  rest: number;
}

interface TimerProps {
  activeSet?: ExerciseSet;
  name?: string;
}

function Timer({ activeSet, name }: TimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Calculate values for the progress circles
  const workTime = activeSet?.time || 0;
  const restTime = activeSet?.rest || 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer finished
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const [worktimerOn, setWorktimerOn] = useState(false);
  const [restTimerOn, setRestTimerOn] = useState(false);
  const handleTimerCompleted = () => {
    setWorktimerOn(false);
  };
  const [workKey, setWorkKey] = useState(0);
  const [restKey, setRestKey] = useState(0);
  useEffect(() => {
    setWorkKey(Math.random());
    setRestKey(Math.random());
    setWorktimerOn(false);
    setRestTimerOn(false);
  }, [activeSet]);
  useEffect(() => {
    if (worktimerOn) {
      setRestTimerOn(false);
    } else if (restTimerOn) {
      setWorktimerOn(false);
    }
  }, [restTimerOn, worktimerOn]);

  if (!activeSet)
    return (
      <Container>
        <NoSet>Select a set</NoSet>
      </Container>
    );

  return (
    <Container>
      <CirclesContainer>
        <div className='workCircle'>
          <CountdownCircleTimer
            key={workKey}
            isPlaying={worktimerOn}
            duration={workTime}
            colors={'#FF5722'}
            trailColor='#FF572240'
            size={200}
            onComplete={() => handleTimerCompleted()}
          >
            {({ remainingTime }) => {
              const mins = Math.floor(remainingTime / 60);
              const secs = remainingTime % 60;
              return worktimerOn
                ? `${mins.toString().padStart(2, '0')}:${secs
                    .toString()
                    .padStart(2, '0')}`
                : '';
            }}
          </CountdownCircleTimer>
        </div>
        <div className='restCircle'>
          <CountdownCircleTimer
            key={restKey}
            isPlaying={restTimerOn}
            duration={restTime}
            colors={'#4CAF50'}
            trailColor='#FF572240'
            size={170}
            onComplete={() => handleTimerCompleted()}
          >
            {({ remainingTime }) => {
              const mins = Math.floor(remainingTime / 60);
              const secs = remainingTime % 60;
              return restTimerOn
                ? `${mins.toString().padStart(2, '0')}:${secs
                    .toString()
                    .padStart(2, '0')}`
                : '';
            }}
          </CountdownCircleTimer>
        </div>
      </CirclesContainer>
      <Controls>
        <Button onClick={() => setRestKey((prevKey) => prevKey + 1)}>
          Reset Timer
        </Button>

        <Button
          onClick={() => {
            setRestTimerOn(!restTimerOn);
            console.log(activeSet);
          }}
          $isRest
        >
          {restTimerOn ? 'Pause' : 'Start'} Rest
        </Button>
        {(activeSet?.time ?? 0) > 0 && (
          <Button
            onClick={() => {
              setWorktimerOn(!worktimerOn);
            }}
            $isWork
          >
            {worktimerOn ? 'Pause' : 'Start'} Work
          </Button>
        )}
      </Controls>
      <div className='name'>{name}</div>
    </Container>
  );
}

export default Timer;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-radius: 12px;

  width: 100%;
  .name {
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.neon};
    font-weight: 900;
    font-size: 24px;
  }
`;

// Add these styled components at the bottom of your file

const NoSet = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.white50};
  padding: 30px;
  text-align: center;
`;

const CirclesContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

  background-color: ${({ theme }) => `${theme.colors.white}40`};
  height: 200px;
  aspect-ratio: 1;
  border-radius: 50%;
  position: relative;
  .workCircle {
    position: absolute;
    div {
      font-size: 40px;
      color: ${({ theme }) => theme.colors.neon};
    }
  }
  .restCircle {
    position: absolute;
    div {
      font-size: 40px;
      color: ${({ theme }) => theme.colors.neon};
    }
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;

  width: 100%;
  justify-content: center;
`;
const Button = styled(motion.button)<{ $isWork?: boolean; $isRest?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  background: ${({ $isWork, $isRest, theme }) =>
    $isWork ? '#FF5722' : $isRest ? '#4CAF50' : theme.colors.white20};
  color: white;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;
