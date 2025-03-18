import React, { useState } from 'react';
import styled from 'styled-components';

import { BiChevronRight, BiPlus, BiTrash } from 'react-icons/bi';
import Button from '../../components/Button';
import { CiCircleMinus } from 'react-icons/ci';
import { AnimatePresence, motion } from 'framer-motion';

interface WorkoutPreviewProps {
  todayWorkout: {
    name: string;
    sections: Array<{
      name: string;
      exercises: Array<{
        name: string;
        notes?: string;
        timeBased: boolean;
        exerciseSets: Array<{
          time: number;
          weight: number;
          reps: number;
          rest: number;
        }>;
      }>;
    }>;
  };
}

const WorkoutPreview: React.FC<WorkoutPreviewProps> = ({ todayWorkout }) => {
  const [workout, setWorkout] = useState(todayWorkout);

  const handleAddSet = (sectionIndex: number, exerciseIndex: number) => {
    const newWorkout = { ...workout };
    const exercise = newWorkout.sections[sectionIndex].exercises[exerciseIndex];

    // Get the last set or use default values if no sets exist
    const lastSet = exercise.exerciseSets[exercise.exerciseSets.length - 1];
    const newSet = exercise.timeBased
      ? {
          time: lastSet?.time || 30,
          rest: lastSet?.rest || 60,
        }
      : {
          reps: lastSet?.reps || 12,
          weight: lastSet?.weight || 0,
          rest: lastSet?.rest || 60,
        };

    exercise.exerciseSets.push(newSet);
    setWorkout(newWorkout);
  };

  return (
    <Container>
      {todayWorkout.sections.map((section, sectionIndex) => (
        <div className='section-container'>
          <div className='section-name'>{section.name}</div>
          <div className='exercise-container'>
            {section.exercises.map((exercise, exerciseIndex) => (
              <div
                className='ex-wrapper'
                key={exercise.name}
                onClick={() => {
                  console.log(exercise);
                }}
              >
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
                <div className='ex-details'>
                  <div className='ex-detail-content'>
                    <div className='ex-notes'>
                      {exercise.notes
                        ? exercise.notes
                        : 'Aggiungi delle note qui..'}
                    </div>
                    <div className='ex-sets-info'>
                      {exercise.timeBased && (
                        <table>
                          <thead>
                            <tr>
                              <th>Set</th>
                              <th>Time</th>
                              <th>Rest</th>
                            </tr>
                          </thead>
                          <tbody>
                            <AnimatePresence mode='wait'>
                              {exercise.exerciseSets.map((set, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <span
                                      contentEditable
                                      suppressContentEditableWarning
                                      onInput={(e) => {
                                        const target = e.currentTarget;
                                        target.textContent = (
                                          target.textContent ?? ''
                                        ).replace(/[^0-9]/g, '');
                                      }}
                                    >
                                      {set.time}
                                    </span>
                                    ''
                                  </td>
                                  <td>
                                    <span
                                      contentEditable
                                      suppressContentEditableWarning
                                      onInput={(e) => {
                                        const target = e.currentTarget;
                                        target.textContent = (
                                          target.textContent ?? ''
                                        ).replace(/[^0-9]/g, '');
                                      }}
                                    >
                                      {set.rest}
                                    </span>
                                    ''
                                  </td>
                                  <td
                                    onClick={() => {
                                      const newWorkout = { ...workout };
                                      newWorkout.sections[
                                        sectionIndex
                                      ].exercises[
                                        exerciseIndex
                                      ].exerciseSets.splice(index, 1);
                                      setWorkout(newWorkout);
                                    }}
                                  >
                                    <CiCircleMinus
                                      color='red'
                                      size='20px'
                                    />
                                  </td>
                                </tr>
                              ))}
                            </AnimatePresence>
                          </tbody>
                        </table>
                      )}
                      {!exercise.timeBased && (
                        <table>
                          <thead>
                            <tr>
                              <th>Set</th>
                              <th>Reps</th>
                              <th>Weight</th>
                              <th>Rest</th>
                            </tr>
                          </thead>
                          <tbody>
                            {exercise.exerciseSets.map((set, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <span
                                    contentEditable
                                    suppressContentEditableWarning={true}
                                    onInput={(e) => {
                                      const target = e.currentTarget;
                                      target.textContent = (
                                        target.textContent ?? ''
                                      ).replace(/[^0-9]/g, '');
                                    }}
                                  >
                                    {set.reps}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    onInput={(e) => {
                                      const target = e.currentTarget;
                                      target.textContent = (
                                        target.textContent ?? ''
                                      ).replace(/[^0-9]/g, '');
                                    }}
                                  >
                                    {set.weight}
                                  </span>
                                  kg
                                </td>
                                <td>
                                  <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    onInput={(e) => {
                                      const target = e.currentTarget;
                                      target.textContent = (
                                        target.textContent ?? ''
                                      ).replace(/[^0-9]/g, '');
                                    }}
                                  >
                                    {set.rest}
                                  </span>
                                  ''
                                </td>
                                <td
                                  onClick={() => {
                                    const newWorkout = { ...workout };
                                    newWorkout.sections[sectionIndex].exercises[
                                      exerciseIndex
                                    ].exerciseSets.splice(index, 1);
                                    setWorkout(newWorkout);
                                  }}
                                >
                                  <CiCircleMinus
                                    color='red'
                                    size='20px'
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                    <div className='add-delete'>
                      <div
                        className='add-exercise-btn'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddSet(sectionIndex, exerciseIndex);
                        }}
                      >
                        <BiPlus />
                        aggiungi set
                      </div>
                      <BiTrash color='red' />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button className='btn'>inizia workout</Button>
    </Container>
  );
};

export default WorkoutPreview;
const Container = styled.div`
  height: 60vh;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 20px;
  .section-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
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
      background-color: ${({ theme }) => theme.colors.dark};
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
      gap: 20px;
      .ex-wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
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
            transition: 200ms;
          }
        }
        &:hover {
          .ex-details {
            grid-template-rows: 1fr;
          }
          .chevron {
            transform: rotate(90deg);
          }
        }
        .ex-details {
          display: grid;
          grid-template-rows: 0fr; //frfrfrfrfrfr
          transition: 500ms;
          transition-delay: 200ms;
          .ex-detail-content {
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 10px;
            .ex-notes {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-size: 14px;
              opacity: 0.8;
            }
            .ex-sets-info {
              display: flex;
              flex-direction: column;
              gap: 10px;
              table {
                width: 100%;
                border-collapse: collapse;
                thead {
                  color: ${({ theme }) => `${theme.colors.white}80`};
                  text-transform: uppercase;
                  th {
                    font-size: 16px;
                    font-weight: 500;
                  }
                }
                tbody {
                  tr {
                    font-size: 12px;
                  }
                  td {
                    span {
                      padding: 0;

                      border: 1px solid transparent;
                      transition: 200ms;
                      &:focus {
                        all: unset;
                        border: 1px solid ${({ theme }) => theme.colors.neon};
                        padding: 1px 3px;
                      }
                    }
                  }
                }
                th,
                td {
                  padding: 5px;
                  text-align: center;
                }

                tr:nth-child(even) {
                  background-color: ${({ theme }) => theme.colors.white10};
                }
              }
            }
          }
        }
      }
    }
    .add-delete {
      display: flex;
      align-items: center;
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
    position: sticky;
    bottom: 0;
  }
`;
