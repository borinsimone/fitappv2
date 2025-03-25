import React from 'react';
import styled from 'styled-components';
import { BiNote, BiTime } from 'react-icons/bi';
import { Exercise } from './types';

interface ExerciseItemProps {
  exercise: Exercise;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
  return (
    <ExerciseContainer>
      <ExerciseHeader>
        <ExerciseName>{exercise.name}</ExerciseName>
        <ExerciseType>
          {exercise.timeBased ? (
            <>
              <BiTime size={14} />
              Basato sul tempo
            </>
          ) : (
            'Basato su ripetizioni'
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
                <SetCol>{set.weight ? `${set.weight}kg` : '-'}</SetCol>
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
  );
};

// Styled Components
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
