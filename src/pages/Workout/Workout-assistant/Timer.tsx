import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  BiPlay,
  BiPause,
  BiReset,
  BiTime,
  BiDumbbell,
  BiHourglass,
} from "react-icons/bi";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { motion, AnimatePresence } from "framer-motion";

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
  const [workTimerOn, setWorkTimerOn] = useState(false);
  const [restTimerOn, setRestTimerOn] = useState(false);
  const [workKey, setWorkKey] = useState(0);
  const [restKey, setRestKey] = useState(0);
  const [timerCompleted, setTimerCompleted] =
    useState(false);

  // Preparation timer state
  const [isPreparing, setIsPreparing] = useState(false);
  const [prepKey, setPrepKey] = useState(0);
  const [hasStartedWork, setHasStartedWork] =
    useState(false);
  const PREP_TIME = 5;
  const lastPlayedRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioContext =
        window.AudioContext ||
        (window as any).webkitAudioContext;
      if (AudioContext) {
        audioContextRef.current = new AudioContext();
      }
    }
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
  };

  // Get values from active set
  const workTime = activeSet?.time || 0;
  const restTime = activeSet?.rest || 0;
  const isTimeBased = workTime > 0;

  // Reset timers when active set changes
  useEffect(() => {
    setWorkKey((prev) => prev + 1);
    setRestKey((prev) => prev + 1);
    setWorkTimerOn(false);
    setRestTimerOn(false);
    setTimerCompleted(false);
    setIsPreparing(false);
    setHasStartedWork(false);
    lastPlayedRef.current = null;
  }, [activeSet]);
  useEffect(() => {
    if (timerCompleted || workTimerOn) {
      const timeout = setTimeout(() => {
        setTimerCompleted(false);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [timerCompleted, workTimerOn]);
  // Ensure only one timer runs at a time
  useEffect(() => {
    if (workTimerOn) {
      setRestTimerOn(false);
    }
  }, [workTimerOn]);

  useEffect(() => {
    if (restTimerOn) {
      setWorkTimerOn(false);
    }
  }, [restTimerOn]);

  const playSound = (
    type: "work" | "rest" | "tick" | "go"
  ) => {
    try {
      // Ensure context exists
      if (!audioContextRef.current) {
        const AudioContext =
          window.AudioContext ||
          (window as any).webkitAudioContext;
        if (AudioContext) {
          audioContextRef.current = new AudioContext();
        }
      }

      const ctx = audioContextRef.current;
      if (!ctx) return;

      // Resume if suspended (though should be handled by initAudio)
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      const createOscillator = (
        type: OscillatorType,
        freq: number,
        startTime: number,
        duration: number,
        gainValue: number = 0.1
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(
          gainValue,
          startTime + 0.02
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          startTime + duration
        );

        osc.start(startTime);
        osc.stop(startTime + duration);
        return { osc, gain };
      };

      if (type === "work") {
        // Victory fanfare (C Major Arpeggio: C5, E5, G5, C6) - More expressive
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          createOscillator(
            "triangle",
            freq,
            now + i * 0.1,
            0.4,
            0.1
          );
        });
        // Add a bass note
        createOscillator("sine", 261.63, now, 0.6, 0.15);
      } else if (type === "rest") {
        // Relaxing descending chime
        createOscillator("sine", 880, now, 0.6, 0.05);
        createOscillator(
          "sine",
          659.25,
          now + 0.2,
          0.8,
          0.05
        );
      } else if (type === "tick") {
        // Short woodblock-like tick
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(
          400,
          now + 0.08
        );

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          now + 0.08
        );

        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "go") {
        // High energy "GO" sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "square";
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.linearRampToValueAtTime(
          1760,
          now + 0.1
        ); // A6

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          now + 0.4
        );

        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handleTimerComplete = (type: "work" | "rest") => {
    setTimerCompleted(true);
    setWorkTimerOn(false);
    setRestTimerOn(false);

    playSound(type);

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const handlePrepComplete = () => {
    setIsPreparing(false);
    setWorkTimerOn(true);
    setHasStartedWork(true);

    playSound("go");

    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  const resetTimers = () => {
    setWorkKey((prev) => prev + 1);
    setRestKey((prev) => prev + 1);
    setWorkTimerOn(false);
    setRestTimerOn(false);
    setTimerCompleted(false);
    setIsPreparing(false);
    setHasStartedWork(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!activeSet) {
    return (
      <Container>
        <EmptyState>
          <BiTime size={40} opacity={0.5} />
          <EmptyTitle>No Set Selected</EmptyTitle>
          <EmptyDescription>
            Select a set to start timing your workout
          </EmptyDescription>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <ExerciseName
        as={motion.div}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {name}
      </ExerciseName>

      <TimerContainer
        as={motion.div}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <AnimatePresence>
          {timerCompleted && (
            <CompletedOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CompletedMessage
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >
                <BiDumbbell size={30} />
                Completed!
              </CompletedMessage>
            </CompletedOverlay>
          )}
        </AnimatePresence>

        {isTimeBased && (
          <>
            {isPreparing ? (
              <WorkTimer $active={true}>
                <CountdownCircleTimer
                  key={`prep-${prepKey}`}
                  isPlaying={isPreparing}
                  duration={PREP_TIME}
                  colors={["#F7B801", "#F7B801"]}
                  colorsTime={[PREP_TIME, 0]}
                  trailColor="rgba(255, 255, 255, 0.1)"
                  size={240}
                  strokeWidth={18}
                  onComplete={handlePrepComplete}
                  onUpdate={(remainingTime) => {
                    const seconds =
                      Math.ceil(remainingTime);
                    if (
                      seconds <= 3 &&
                      seconds > 0 &&
                      lastPlayedRef.current !== seconds
                    ) {
                      playSound("tick");
                      lastPlayedRef.current = seconds;
                    }
                  }}
                >
                  {({ remainingTime }) => (
                    <TimerDisplay>
                      <TimerValue
                        style={{ color: "#F7B801" }}
                      >
                        {remainingTime}
                      </TimerValue>
                      <TimerLabel>GET READY</TimerLabel>
                    </TimerDisplay>
                  )}
                </CountdownCircleTimer>
              </WorkTimer>
            ) : (
              <WorkTimer $active={workTimerOn}>
                <CountdownCircleTimer
                  key={workKey}
                  isPlaying={workTimerOn}
                  duration={workTime}
                  colors={[
                    "#00C6BE",
                    "#00C6BE",
                    "#F7B801",
                    "#F7B801",
                    "#FF5722",
                  ]}
                  colorsTime={[
                    workTime,
                    workTime * 0.66,
                    workTime * 0.33,
                    0,
                  ]}
                  trailColor="rgba(255, 255, 255, 0.1)"
                  size={240}
                  strokeWidth={18}
                  onComplete={() =>
                    handleTimerComplete("work")
                  }
                >
                  {({ remainingTime, color }) => (
                    <TimerDisplay>
                      {workTimerOn ? (
                        <>
                          <TimerValue style={{ color }}>
                            {formatTime(remainingTime)}
                          </TimerValue>
                          <TimerLabel>WORK</TimerLabel>
                        </>
                      ) : (
                        <>
                          {/* <TimerValue>{formatTime(workTime)}</TimerValue>
                      <TimerLabel>WORK TIME</TimerLabel> */}
                        </>
                      )}
                    </TimerDisplay>
                  )}
                </CountdownCircleTimer>
              </WorkTimer>
            )}
          </>
        )}

        <RestTimer
          $active={restTimerOn}
          $isMainTimer={!isTimeBased}
        >
          <CountdownCircleTimer
            key={restKey}
            isPlaying={restTimerOn}
            duration={restTime}
            colors={[
              "#4CAF50",
              "#4CAF50",
              "#F7B801",
              "#FF5722",
            ]}
            colorsTime={[
              restTime,
              restTime * 0.66,
              restTime * 0.33,
              0,
            ]}
            trailColor="rgba(255, 255, 255, 0.1)"
            size={!isTimeBased ? 240 : 180}
            strokeWidth={!isTimeBased ? 18 : 16}
            onComplete={() => handleTimerComplete("rest")}
          >
            {({ remainingTime, color }) => (
              <TimerDisplay>
                <AnimatePresence>
                  {restTimerOn ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TimerValue style={{ color }}>
                        {formatTime(remainingTime)}
                      </TimerValue>
                      <TimerLabel>REST</TimerLabel>
                    </motion.div>
                  ) : (
                    <>
                      {/* <TimerValue>{formatTime(restTime)}</TimerValue>
                    <TimerLabel>REST TIME</TimerLabel> */}
                    </>
                  )}
                </AnimatePresence>
              </TimerDisplay>
            )}
          </CountdownCircleTimer>
        </RestTimer>
      </TimerContainer>

      <ControlsContainer>
        {isTimeBased && (
          <TimerButton
            $variant="work"
            $active={workTimerOn || isPreparing}
            onClick={() => {
              initAudio();
              if (workTimerOn) {
                setWorkTimerOn(false);
              } else if (isPreparing) {
                setIsPreparing(false);
              } else {
                if (!hasStartedWork) {
                  setIsPreparing(true);
                  setPrepKey((prev) => prev + 1);
                } else {
                  setWorkTimerOn(true);
                }
              }
            }}
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {workTimerOn || isPreparing ? (
              <BiPause size={22} />
            ) : (
              <BiPlay size={22} />
            )}
            {workTimerOn || isPreparing ? "Pause" : "Start"}
          </TimerButton>
        )}

        <TimerButton
          $variant="rest"
          $active={restTimerOn}
          onClick={() => setRestTimerOn(!restTimerOn)}
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          $isFullWidth={!isTimeBased}
        >
          {restTimerOn ? (
            <BiPause size={22} />
          ) : (
            <BiHourglass size={22} />
          )}
          {restTimerOn ? "Pause" : "Start"} Rest
        </TimerButton>

        <TimerButton
          $variant="reset"
          onClick={resetTimers}
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BiReset size={22} />
        </TimerButton>
      </ControlsContainer>
    </Container>
  );
}

export default Timer;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* padding: 20px; */
  gap: 15px;
  position: relative;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 24px;
  gap: 16px;
  color: ${({ theme }) => theme.colors.white50};
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.white70};
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  margin: 0;
  max-width: 240px;
`;

const ExerciseName = styled(motion.h2)`
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neon};
  margin: 0;
  text-align: center;
`;

const TimerContainer = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1;
`;

const CompletedOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CompletedMessage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.neon};
  font-size: 24px;
  font-weight: 700;
`;

const WorkTimer = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: ${({ $active }) => ($active ? 1 : 0.9)};
  transform: ${({ $active }) =>
    $active ? "scale(1)" : "scale(0.97)"};
`;

const RestTimer = styled.div<{
  $active: boolean;
  $isMainTimer?: boolean;
}>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  ${({ $active, $isMainTimer }) => {
    if ($isMainTimer) {
      // If this is the main timer (no work timer exists)
      return `
        opacity: ${$active ? 1 : 0.9};
        transform: ${$active ? "scale(1)" : "scale(0.97)"};
      `;
    } else {
      // Secondary timer that appears behind work timer
      return `
        opacity: ${$active ? 1 : 0.7};
        transform: ${$active ? "scale(1)" : "scale(0.85)"};
      `;
    }
  }}
`;

const TimerDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const TimerValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  font-family: "Roboto Mono", monospace;
  color: ${({ theme }) => theme.colors.white};
`;

const TimerLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.7;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;

  width: 100%;
  max-width: 400px;
  position: relative;
`;

const TimerButton = styled(motion.button)<{
  $variant: "work" | "rest" | "reset";
  $active?: boolean;
  $isFullWidth?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $variant, $active, $isFullWidth, theme }) => {
    let styles = "";

    switch ($variant) {
      case "work":
        styles = `
          background: ${
            $active ? "#00C6BE" : "rgba(0, 198, 190, 0.2)"
          };
          color: ${$active ? "#1A1D22" : "#00C6BE"};
          flex: 1;
          border: 1px solid #00C6BE;
        `;
        break;
      case "rest":
        styles = `
          background: ${
            $active ? "#4CAF50" : "rgba(76, 175, 80, 0.2)"
          };
          color: ${$active ? "#1A1D22" : "#4CAF50"};
          flex: ${$isFullWidth ? "1 1 100%" : "1"};
          border:1px solid #4CAF50;

        `;
        break;
      case "reset":
        styles = `
          background: ${theme.colors.white10};
          color: ${theme.colors.white};
          width: 48px;
          padding: 0;
          flex: 0 0 48px;
        `;
        break;
    }

    return styles;
  }}
`;

const TimerInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%;
  max-width: 400px;

  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white05};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const InfoLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white50};
`;

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;
