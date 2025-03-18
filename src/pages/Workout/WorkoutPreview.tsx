import React from 'react';
import styled from 'styled-components';
import { useWorkouts } from '../../context/WorkoutContext';
import { BiChevronRight, BiPlus, BiTrash } from 'react-icons/bi';
import Button from '../../components/Button';

interface WorkoutPreviewProps {
  todayWorkout: {
    name: string;
    sections: Array<{
      name: string;
      exercises: Array<{
        name: string;
      }>;
    }>;
  };
}

const WorkoutPreview: React.FC<WorkoutPreviewProps> = ({ todayWorkout }) => {
  return (
    <Container>
      {todayWorkout.sections.map((section) => (
        <div className='section-container'>
          <div className='section-name'>
            {section.name}
            <BiTrash color='red' />
          </div>
          <div className='exercise-container'>
            {section.exercises.map((exercise) => (
              <div className='exercise'>
                <div className='img'></div>
                <div className='ex-text'>
                  <div className='ex-name'>{exercise.name}</div>
                  <div className='ex-type'>
                    aggiungere tipo di esercizio da backend
                  </div>
                </div>
                <BiChevronRight
                  className='chevron'
                  size='30px'
                />
              </div>
            ))}
          </div>
          <div className='add-exercise-btn'>
            <BiPlus />
            aggiungi esercizio
          </div>
        </div>
      ))}
      <Button className='btn'>inizia workout</Button>
    </Container>
  );
};

export default WorkoutPreview;
const Container = styled.div`
  flex: 1;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 20px;
  .section-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    overflow: scroll;
    .add-exercise-btn {
      background-color: ${({ theme }) => theme.colors.white10};
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: center;

      margin: 0 auto;
      border-radius: 10px;
      padding: 5px 30px;
      text-transform: capitalize;
    }
    .section-name {
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.neon};
      font-weight: 700;
      font-size: 24px;
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      position: sticky;
      top: 0;
    }
    .exercise-container {
      display: flex;
      flex-direction: column;
      gap: 5px;
      .exercise {
        display: flex;
        align-items: center;
        gap: 10px;
        .img {
          height: 50px;
          background-color: #fff;
          aspect-ratio: 1;
          border-radius: 5px;
        }
        .ex-name {
          font-size: 18px;
        }
        .ex-type {
          font-size: 12px;
          color: ${({ theme }) => theme.colors.neon};
          text-transform: uppercase;
        }
        .chevron {
          color: ${({ theme }) => theme.colors.neon};
          margin-left: auto;
          margin-right: 20px;
        }
      }
    }
  }

  .btn {
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dark};
    font-weight: 700;
    font-size: 24px;
    padding: 10px;
    margin-top: auto;
    /* margin-bottom: 20px; */
  }
`;
