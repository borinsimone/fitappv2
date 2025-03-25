import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { BiCalendarPlus, BiPlus } from 'react-icons/bi';

interface NoMealPlanProps {
  selectedDate: Date;
  onCreateMeal?: () => void;
}

const NoMealPlan: React.FC<NoMealPlanProps> = ({
  selectedDate,
  onCreateMeal,
}) => {
  return (
    <Container>
      <IconContainer>
        <BiCalendarPlus size={60} />
      </IconContainer>

      <Title>Nessun piano alimentare</Title>

      <Message>
        Non hai ancora pianificato pasti per
        <HighlightDate>
          {format(selectedDate, 'EEEE d MMMM', { locale: it })}
        </HighlightDate>
      </Message>

      <CreateButton onClick={onCreateMeal}>
        <BiPlus size={20} />
        Crea piano alimentare
      </CreateButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 12px;
  text-align: center;
  margin: 20px 0;
`;

const IconContainer = styled.div`
  color: ${({ theme }) => theme.colors.neon};
  margin-bottom: 20px;
  opacity: 0.7;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const Message = styled.p`
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 24px;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HighlightDate = styled.span`
  color: ${({ theme }) => theme.colors.neon};
  font-weight: 600;
  font-size: 18px;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.neon};
  color: black;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

export default NoMealPlan;
