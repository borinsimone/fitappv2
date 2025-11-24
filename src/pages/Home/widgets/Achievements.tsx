import { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  LuFlame,
  LuDumbbell,
  LuTimer,
  LuTrophy,
  LuCalendarCheck2,
} from "react-icons/lu";

// Mock achievement data - replace with your real data
const achievementData = [
  {
    id: "streak",
    name: "Consistency Streak",
    details: "5/7 days",
    icon: LuFlame,
    color: "#FF6B6B",
    progress: 0.71,
  },
  {
    id: "muscle",
    name: "Strength Master",
    details: "15/20 workouts",
    icon: LuDumbbell,
    color: "#4ECDC4",
    progress: 0.75,
  },
  {
    id: "time",
    name: "Time Champion",
    details: "180/300 minutes",
    icon: LuTimer,
    color: "#FFD166",
    progress: 0.6,
  },
  {
    id: "goal",
    name: "Goal Crusher",
    details: "3/5 goals",
    icon: LuTrophy,
    color: "#6A0572",
    progress: 0.6,
  },
  {
    id: "complete",
    name: "Workout Finisher",
    details: "8/10 completed",
    icon: LuCalendarCheck2,
    color: "#00C6BE",
    progress: 0.8,
  },
];

function Achievements() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } =
      scrollRef.current;
    setShowLeftFade(scrollLeft > 10);
    setShowRightFade(
      scrollLeft < scrollWidth - clientWidth - 10
    );
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      return () =>
        ref.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <Container>
      <HeaderSection>
        <Title>Achievements</Title>
        <ViewAllButton>View All</ViewAllButton>
      </HeaderSection>

      <ScrollContainer ref={scrollRef}>
        {showLeftFade && <FadeGradient $position="left" />}

        <AchievementsRow>
          {achievementData.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <AchievementCard
                key={achievement.id}
                as={motion.div}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              >
                <ProgressRing
                  $progress={achievement.progress}
                  color={achievement.color}
                >
                  <IconContainer
                    $bgColor={achievement.color}
                  >
                    <Icon size={24} />
                  </IconContainer>
                </ProgressRing>

                <AchievementInfo>
                  <AchievementName>
                    {achievement.name}
                  </AchievementName>
                  <AchievementDetails>
                    {achievement.details}
                  </AchievementDetails>
                </AchievementInfo>
              </AchievementCard>
            );
          })}
        </AchievementsRow>

        {showRightFade && (
          <FadeGradient $position="right" />
        )}
      </ScrollContainer>
    </Container>
  );
}

export default Achievements;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px 0;
  gap: 16px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neon};
  margin: 0;
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white70};
  font-size: 14px;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.neon};
  }
`;

const ScrollContainer = styled.div`
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
`;

const AchievementsRow = styled.div`
  display: flex;
  gap: 16px;
  padding: 8px 16px;
`;

const FadeGradient = styled.div<{
  $position: "left" | "right";
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  z-index: 2;
  pointer-events: none;

  ${({ $position, theme }) =>
    $position === "left"
      ? `
    left: 0;
    background: linear-gradient(90deg, ${theme.colors.dark}, transparent);
  `
      : `
    right: 0;
    background: linear-gradient(270deg, ${theme.colors.dark}, transparent);
  `}
`;

const AchievementCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 150px;
  max-width: 150px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 16px;
  gap: 12px;
  transition: all 0.3s ease;
`;

interface ProgressRingProps {
  $progress: number;
  color: string;
}

const ProgressRing = styled.div<ProgressRingProps>`
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(
      ${({ color }) => color}
        ${({ $progress }) => $progress * 100}%,
      ${({ theme }) => theme.colors.white10}
        ${({ $progress }) => $progress * 100}%
    );
    mask: radial-gradient(
      farthest-side,
      transparent 60%,
      #000 61%
    );
  }
`;

const IconContainer = styled.div<{ $bgColor: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ $bgColor }) => `${$bgColor}30`};
  color: ${({ $bgColor }) => $bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AchievementInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  width: 100%;
`;

const AchievementName = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
`;

const AchievementDetails = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white50};
  margin: 0;
`;
