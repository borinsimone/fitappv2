import React from 'react';
import { BiDumbbell } from 'react-icons/bi';
import { BsClock } from 'react-icons/bs';
import { CgCalendar, CgLock } from 'react-icons/cg';
import { GiFlame } from 'react-icons/gi';
import { TfiAgenda } from 'react-icons/tfi';
import styled from 'styled-components';

const WeeklyStats = () => {
  let iconSize = '30px';
  let stats = [
    {
      name: 'kg-volume',
      icon: <BiDumbbell size={iconSize} />,
      value: '1200',
      label: 'kg',
    },
    {
      name: 'calories-burned',
      icon: <GiFlame size={iconSize} />,
      value: '3200',
      label: 'kcal',
    },
    {
      name: 'clock',
      icon: <BsClock size={iconSize} />,
      value: '6',
      label: 'ore',
    },
    {
      name: 'days',
      icon: <CgCalendar size={iconSize} />,
      value: '5/7',
      label: 'giorni',
    },
  ];
  return (
    <Container>
      {stats.map((stat) => (
        <div className='stat-container'>
          <div className='icon'>{stat.icon}</div>
          <div className='text'>
            <div className='value'>{stat.value}</div>
            <div className='label'>{stat.label}</div>
          </div>
        </div>
      ))}
    </Container>
  );
};

export default WeeklyStats;
const Container = styled.div`
  width: 100%;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.neon};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .stat-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    .icon {
      background-color: ${({ theme }) => theme.colors.white10};
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border-radius: 50%;
    }
    .text {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .value {
      font-family: Roboto Mono;
      font-size: 18px;
      font-weight: bold;
      line-height: 1em;
    }
    .label {
      font-weight: 300;
      line-height: 1em;
    }
  }
`;
