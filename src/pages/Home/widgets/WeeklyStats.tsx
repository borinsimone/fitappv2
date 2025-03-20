import React, { useState, useEffect } from 'react';
import { BiDumbbell, BiCheck } from 'react-icons/bi';
import { BsClock } from 'react-icons/bs';
import { CgCalendar, CgOptions } from 'react-icons/cg';
import { GiFlame } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

type Stat = {
  name: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  id: number;
  color: string;
};

const WeeklyStats: React.FC = () => {
  const iconSize = 24;

  const stats: Stat[] = [
    {
      name: 'Volume',
      icon: <BiDumbbell size={iconSize} />,
      value: '1,200',
      label: 'kg',
      id: 0,
      color: '#00C6BE',
    },
    {
      name: 'Calories',
      icon: <GiFlame size={iconSize} />,
      value: '3,200',
      label: 'kcal',
      id: 1,
      color: '#FF5F5F',
    },
    {
      name: 'Time',
      icon: <BsClock size={iconSize} />,
      value: '6',
      label: 'hours',
      id: 2,
      color: '#FFD166',
    },
    {
      name: 'Days Active',
      icon: <CgCalendar size={iconSize} />,
      value: '5/7',
      label: 'days',
      id: 3,
      color: '#4ECDC4',
    },
  ];

  const [activeStats, setActiveStats] = useState<{ id: number }[]>([]);
  const [statsBuffer, setStatsBuffer] = useState<Stat[]>([]);
  const [optionPanel, setOptionPanel] = useState(false);

  // Load saved stats on component mount
  useEffect(() => {
    const savedStats = JSON.parse(
      localStorage.getItem('weekly-active-stats') || '[]'
    );
    setActiveStats(savedStats);

    // Populate statsBuffer with actual stat objects
    const initialBuffer = stats.filter((stat) =>
      savedStats.some((activeStat: { id: number }) => activeStat.id === stat.id)
    );
    setStatsBuffer(initialBuffer);

    // Show options panel if no stats are selected
    if (savedStats.length === 0) {
      setOptionPanel(true);
    }
  }, []);

  const toggleStat = (stat: Stat) => {
    const isSelected = statsBuffer.some((item) => item.id === stat.id);

    if (isSelected) {
      setStatsBuffer(statsBuffer.filter((item) => item.id !== stat.id));
    } else {
      setStatsBuffer([...statsBuffer, stat]);
    }
  };

  const saveStats = () => {
    const statsToStore = statsBuffer.map(({ id }) => ({ id }));
    localStorage.setItem('weekly-active-stats', JSON.stringify(statsToStore));
    setActiveStats(statsToStore);
    setOptionPanel(false);
  };

  const filteredStats = stats.filter((stat) =>
    activeStats.some((activeStat) => activeStat.id === stat.id)
  );

  return (
    <Container>
      <Header>
        <Title>Weekly Stats</Title>
        <OptionButton
          onClick={() => setOptionPanel(!optionPanel)}
          as={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          $isActive={optionPanel}
        >
          {optionPanel ? <MdClose size={20} /> : <CgOptions size={20} />}
        </OptionButton>
      </Header>

      <AnimatePresence>
        {optionPanel ? (
          <OptionPanel
            as={motion.div}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OptionLabel>Select stats to display</OptionLabel>

            <ChoiceContainer>
              {stats.map((stat) => {
                const isSelected = statsBuffer.some(
                  (item) => item.id === stat.id
                );
                return (
                  <StatChoice
                    key={stat.id}
                    onClick={() => toggleStat(stat)}
                    $selected={isSelected}
                    $color={stat.color}
                    as={motion.div}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconWrapper
                      $selected={isSelected}
                      $color={stat.color}
                    >
                      {stat.icon}
                      {isSelected && (
                        <SelectionIndicator>
                          <BiCheck size={12} />
                        </SelectionIndicator>
                      )}
                    </IconWrapper>
                    <StatName>{stat.name}</StatName>
                  </StatChoice>
                );
              })}
            </ChoiceContainer>

            <ButtonContainer>
              <CancelButton
                onClick={() => setOptionPanel(false)}
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </CancelButton>
              <SaveButton
                onClick={saveStats}
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={statsBuffer.length === 0}
              >
                Save
              </SaveButton>
            </ButtonContainer>
          </OptionPanel>
        ) : (
          <StatsContainer
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredStats.length > 0 ? (
              filteredStats.map((stat) => (
                <StatItem
                  key={stat.id}
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <StatIconContainer $color={stat.color}>
                    {stat.icon}
                  </StatIconContainer>
                  <StatContent>
                    <StatValue>{stat.value}</StatValue>
                    <StatLabel>{stat.label}</StatLabel>
                  </StatContent>
                </StatItem>
              ))
            ) : (
              <EmptyState>
                <EmptyIcon>
                  <BiDumbbell
                    size={28}
                    opacity={0.4}
                  />
                </EmptyIcon>
                <EmptyText>No stats selected</EmptyText>
                <EmptyAction onClick={() => setOptionPanel(true)}>
                  Select Stats
                </EmptyAction>
              </EmptyState>
            )}
          </StatsContainer>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default WeeklyStats;

// Styled Components
const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neon};
  margin: 0;
`;

const OptionButton = styled(motion.button)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.neon : theme.colors.white10};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.dark : theme.colors.white70};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.neon : theme.colors.white20};
  }
`;

const OptionPanel = styled(motion.div)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
`;

const OptionLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
`;

const ChoiceContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
`;

const StatChoice = styled(motion.div)<{ $selected: boolean; $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border-radius: 12px;
  background: ${({ $selected, $color }) =>
    $selected ? `${$color}20` : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $selected, $color, theme }) =>
      $selected ? `${$color}30` : theme.colors.white05};
  }
`;

const IconWrapper = styled.div<{ $selected: boolean; $color: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ $selected, $color, theme }) =>
    $selected ? `${$color}30` : theme.colors.white10};
  color: ${({ $selected, $color, theme }) =>
    $selected ? $color : theme.colors.white50};
`;

const SelectionIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatName = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
`;

const Button = styled(motion.button)`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CancelButton = styled(Button)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.white20};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
  }
`;

const SaveButton = styled(Button)`
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatsContainer = styled(motion.div)`
  display: flex;
  justify-content: space-evenly;
  padding: 24px 16px;
  gap: 16px;
  flex-wrap: wrap;
`;

const StatItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 70px;
`;

const StatIconContainer = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${({ $color }) => `${$color}20`};
  color: ${({ $color }) => $color};
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const StatValue = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white50};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  width: 100%;
`;

const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white05};
  margin-bottom: 16px;
`;

const EmptyText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.white50};
  margin-bottom: 12px;
`;

const EmptyAction = styled.button`
  background: ${({ theme }) => theme.colors.white10};
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
  }
`;
