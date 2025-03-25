import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BiStopwatch } from 'react-icons/bi';

// Modifica la definizione del tipo per accettare sia Date che string
function WorkoutDuration({ start }: { start: Date | string | null }) {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    // Se non c'è una data di inizio, non fare nulla
    if (!start) {
      return;
    }

    // Converti la stringa ISO in un oggetto Date se necessario
    const startDate = typeof start === 'string' ? new Date(start) : start;

    // Calcola il tempo trascorso iniziale (per gestire ricariche pagina)
    const initialElapsed = Math.floor(
      (Date.now() - startDate.getTime()) / 1000
    );
    setElapsed(initialElapsed > 0 ? initialElapsed : 0);

    // Imposta un intervallo per aggiornare il tempo trascorso ogni secondo
    const intervalId = setInterval(() => {
      const newElapsed = Math.floor((Date.now() - startDate.getTime()) / 1000);
      setElapsed(newElapsed > 0 ? newElapsed : 0);
    }, 1000);

    // Pulizia dell'intervallo quando il componente viene smontato
    return () => clearInterval(intervalId);
  }, [start]);

  // Il resto del componente rimane invariato
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = secs.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  if (!start) {
    return <Container>--:--:--</Container>;
  }

  return (
    <Container>
      <IconWrapper>
        <BiStopwatch size={18} />
      </IconWrapper>
      <TimeDisplay>{formatTime(elapsed)}</TimeDisplay>
    </Container>
  );
}

// Stili invariati
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.white10};
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.white};
  gap: 8px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.neon};
`;

const TimeDisplay = styled.div`
  font-variant-numeric: tabular-nums;
`;

export default WorkoutDuration;
