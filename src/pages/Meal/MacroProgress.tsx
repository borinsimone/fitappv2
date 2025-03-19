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
  const percentage = (macro.consumed / macro.total) * 100;

  return (
    <Container>
      <Header>
        <span className='name'>{macro.name}</span>
        <span className='remaining'>
          {remaining}
          {macro.unit} left
        </span>
      </Header>
      <ProgressBar>
        <Progress width={percentage} />
      </ProgressBar>
      <Values>
        <span>
          {macro.consumed}
          {macro.unit}
        </span>
        <span>
          of {macro.total}
          {macro.unit}
        </span>
      </Values>
    </Container>
  );
};

const Container = styled.div`
  background: ${({ theme }) => theme.colors.white10};
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .name {
    font-weight: 600;
    text-transform: capitalize;
  }

  .remaining {
    font-size: 14px;
    opacity: 0.8;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 3px;
  overflow: hidden;
`;

const Progress = styled.div<{ width: number }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background: ${({ theme }) => theme.colors.neon};
  transition: width 0.3s ease;
`;

const Values = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  opacity: 0.8;
`;

export default MacroProgress;
