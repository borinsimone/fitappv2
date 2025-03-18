import { JSX, useState } from 'react';
import { BiDumbbell } from 'react-icons/bi';
import { BsClock } from 'react-icons/bs';
import { CgCalendar, CgOptions } from 'react-icons/cg';
import { GiFlame } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';

import styled from 'styled-components';

const WeeklyStats = () => {
  const iconSize = '30px';
  type Stat = {
    name: string;
    icon: JSX.Element;
    value: string;
    label: string;
    id: number;
  };

  const stats: Stat[] = [
    {
      name: 'kg-volume',
      icon: <BiDumbbell size={iconSize} />,
      value: '1200',
      label: 'kg',
      id: 0,
    },
    {
      name: 'calories-burned',
      icon: <GiFlame size={iconSize} />,
      value: '3200',
      label: 'kcal',
      id: 1,
    },
    {
      name: 'clock',
      icon: <BsClock size={iconSize} />,
      value: '6',
      label: 'ore',
      id: 2,
    },
    {
      name: 'days',
      icon: <CgCalendar size={iconSize} />,
      value: '5/7',
      label: 'giorni',
      id: 3,
    },
  ];
  const [activeStats, setActiveStats] = useState(
    JSON.parse(localStorage.getItem('weekly-active-stats') || '[]')
  );
  const [statsBuffer, setStatsBuffer] = useState<Stat[]>(activeStats || []);

  const [optionPanel, setOptionPanel] = useState(false);
  return (
    <Container>
      <div
        className='option-icon'
        onClick={() => setOptionPanel(!optionPanel)}
      >
        {optionPanel ? <MdClose /> : <CgOptions />}
      </div>
      {(optionPanel || activeStats.length === 0) && (
        <div className='option-panel'>
          <div className='label'>Che traguardi vuoi mostrare?</div>
          <div className='chice-container'>
            {stats.map((stat) => (
              <StatChoice
                selected={statsBuffer.some(
                  (activeStat: Stat) => activeStat.id === stat.id
                )}
                key={stat.id}
                onClick={() => {
                  const isStatAlreadyAdded: boolean = statsBuffer.some(
                    (bufferedStat: Stat) => bufferedStat.id === stat.id
                  );
                  if (isStatAlreadyAdded) {
                    setStatsBuffer(
                      statsBuffer.filter((item: Stat) => item.id !== stat.id)
                    );
                  } else {
                    setStatsBuffer([...statsBuffer, stat]);
                  }
                }}
              >
                <div className='icon'>{stat.icon}</div>
                <div className='name'>{stat.name}</div>
              </StatChoice>
            ))}
          </div>
          {/* {statsBuffer.map((k) => (
            <div>{k.name}</div>
          ))} */}
          <button
            onClick={() => {
              const statsToStore = statsBuffer.map(({ id }) => ({
                id,
              }));
              localStorage.setItem(
                'weekly-active-stats',
                JSON.stringify(statsToStore)
              );
              setActiveStats(statsToStore);
              setOptionPanel(false);
            }}
          >
            ok
          </button>
        </div>
      )}
      {!optionPanel &&
        stats
          .filter((stat: Stat) =>
            activeStats.some(
              (activeStat: { id: number }) => activeStat.id === stat.id
            )
          )
          .map((stat: Stat) => (
            <div
              className='stat-container'
              key={stat.id}
            >
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
  /* display: flex;
  align-items: center;
  justify-content: space-around;
  */
  position: relative;
  display: flex;
  justify-content: space-evenly;
  transition: 300ms;
  overflow: hidden;
  .option-icon {
    position: absolute;
    top: 5px;
    right: 5px;
  }
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
  .option-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .label {
      font-size: 16px;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.white};
    }

    .chice-container {
      display: flex;
      justify-content: space-evenly;
      flex-wrap: wrap;
      gap: 12px;
    }

    button {
      align-self: flex-end;
      padding: 8px 24px;
      border-radius: 6px;
      background: ${({ theme }) => theme.colors.neon};
      color: ${({ theme }) => theme.colors.background};
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s ease-in-out;

      &:hover {
        opacity: 0.9;
      }
    }
  }
`;
interface StatChoiceProps {
  selected?: boolean;
}

const StatChoice = styled.div<StatChoiceProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ theme, selected }) =>
    selected ? `${theme.colors.neon}40` : 'transparent'};
  padding: 10px;
  transition: all 0.4s ease-in-out;
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.white10};
    padding: 8px;
    border-radius: 50%;
    opacity: ${({ selected }) => (selected ? 1 : 0.6)};
    transition: opacity 0.2s ease-in-out;
  }

  .name {
    font-size: 14px;
    font-weight: ${({ selected }) => (selected ? '600' : '400')};
    color: ${({ theme, selected }) =>
      selected ? theme.colors.neon : theme.colors.white};
    text-transform: capitalize;
  }
`;
