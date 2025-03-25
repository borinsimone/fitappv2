import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  BiRestaurant,
  BiBowlRice,
  BiCalendarStar,
  BiBrain,
  BiRefresh,
} from 'react-icons/bi';

const ComingSoonOverlay: React.FC = () => {
  return (
    <OverlayContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ContentCard>
        <IconRow>
          <IconWrapper>
            <BiRestaurant size={32} />
          </IconWrapper>
          <IconWrapper>
            <BiBrain size={32} />
          </IconWrapper>
          <IconWrapper>
            <BiBowlRice size={32} />
          </IconWrapper>
        </IconRow>

        <Title>Meal Planner in Arrivo</Title>

        <Description>
          Stiamo sviluppando un sistema avanzato di pianificazione pasti con
          intelligenza artificiale per personalizzare al massimo la tua
          nutrizione.
        </Description>

        <FeaturesList>
          <FeatureItem>
            <FeatureDot />
            Pasti personalizzabili illimitati
          </FeatureItem>
          <FeatureItem>
            <FeatureDot />
            Tracciamento macronutrienti avanzato
          </FeatureItem>
          <FeatureItem>
            <FeatureDot />
            Database completo di alimenti
          </FeatureItem>
          <FeatureItem>
            <FeatureDot />
            Template e pianificazione settimanale
          </FeatureItem>
          <FeatureItem highlight>
            <FeatureDot glow />
            <span>
              Creazione piano alimentare con IA basato su obiettivo
              calorie/macro e regime alimentare (vegetariano, keto, ecc.)
            </span>
          </FeatureItem>
          <FeatureItem highlight>
            <FeatureDot glow />
            <span>
              IA che consiglia cosa preparare in base a cosa hai nel frigo e ai
              tuoi obiettivi nutrizionali rimanenti
            </span>
          </FeatureItem>
        </FeaturesList>

        <ComingSoonBadge>Disponibile a Breve</ComingSoonBadge>
      </ContentCard>
    </OverlayContainer>
  );
};

const OverlayContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.dark30};
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ContentCard = styled.div`
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 16px;
  padding: 36px;
  max-width: 550px;
  width: 100%;
  text-align: center;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid ${({ theme }) => theme.colors.white20};
`;

const IconRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neon}20;
  color: ${({ theme }) => theme.colors.neon};
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(45deg, #fff, ${({ theme }) => theme.colors.neon});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 24px;
  opacity: 0.9;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
  text-align: left;
`;

const FeatureItem = styled.li<{ highlight?: boolean }>`
  display: flex;
  align-items: flex-start;
  font-size: 15px;
  margin-bottom: 12px;
  color: ${({ theme, highlight }) =>
    highlight ? theme.colors.neon : theme.colors.white};
  ${({ highlight }) =>
    highlight &&
    `
    background: rgba(0, 255, 170, 0.05);
    padding: 10px;
    border-radius: 8px;
    margin-top: 16px;
  `}
`;

const FeatureDot = styled.span<{ glow?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neon};
  margin-right: 12px;
  margin-top: 6px;
  flex-shrink: 0;

  ${({ glow }) =>
    glow &&
    `
    box-shadow: 0 0 8px rgba(0, 255, 170, 0.8);
  `}
`;

const ComingSoonBadge = styled.div`
  background: ${({ theme }) => theme.colors.neon};
  color: black;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 8px;
  display: inline-block;
`;

export default ComingSoonOverlay;
