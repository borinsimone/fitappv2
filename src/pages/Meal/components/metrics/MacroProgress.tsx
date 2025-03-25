import styled from 'styled-components';

interface MacroProgressProps {
  macro: {
    name: string;
    total: number;
    consumed: number;
    unit: string;
  };
}

const MacroProgress: React.FC<MacroProgressProps> = ({ macro }) => {
  const remaining = macro.total - macro.consumed;
  const percentage = Math.min(100, (macro.consumed / macro.total) * 100) || 0;

  return (
    <Container>
      <Header>
        <TitleSection>
          <MacroName>{macro.name}</MacroName>
          <ConsumedValue>
            {macro.consumed.toLocaleString()} {macro.unit}
          </ConsumedValue>
        </TitleSection>
        <RemainingSection>
          <RemainingLabel>
            {remaining > 0
              ? `${remaining.toLocaleString()} ${macro.unit} remaining`
              : 'Daily target reached!'}
          </RemainingLabel>
          <TotalValue>
            of {macro.total.toLocaleString()} {macro.unit}
          </TotalValue>
        </RemainingSection>
      </Header>

      <ProgressBarContainer>
        <ProgressBar>
          <Progress width={percentage} />
        </ProgressBar>
        <PercentageValue>{Math.round(percentage)}%</PercentageValue>
      </ProgressBarContainer>
    </Container>
  );
};

const Container = styled.div`
  background: ${({ theme }) => theme.colors.white10};
  padding: 18px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MacroName = styled.div`
  font-weight: 600;
  font-size: 14px;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.white70};
`;

const ConsumedValue = styled.div`
  font-weight: 700;
  font-size: 24px;
`;

const RemainingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: right;
`;

const RemainingLabel = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neon};
`;

const TotalValue = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white50};
`;

const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled.div<{ width: number }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background: ${({ theme }) => theme.colors.neon};
  transition: width 0.3s ease;
  border-radius: 4px;
`;

const PercentageValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
`;

export default MacroProgress;
