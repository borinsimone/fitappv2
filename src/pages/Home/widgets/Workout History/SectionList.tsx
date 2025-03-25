import React from 'react';
import styled from 'styled-components';
import { BiChevronDown } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';

import { Section } from './types';
import { ExerciseItem } from './ExerciseItem';

interface SectionsListProps {
  sections: Section[];
  expandedSections: Record<string, boolean>;
  toggleSection: (sectionId: string) => void;
}

export const SectionsList: React.FC<SectionsListProps> = ({
  sections,
  expandedSections,
  toggleSection,
}) => {
  return (
    <SectionsContainer>
      {sections.map((section, sectionIndex) => {
        const sectionId = `section-${sectionIndex}`;
        const isExpanded = !!expandedSections[sectionId];

        return (
          <SectionCard key={sectionId}>
            <SectionHeader onClick={() => toggleSection(sectionId)}>
              <SectionName>{section.name}</SectionName>
              <SectionToggle $isExpanded={isExpanded}>
                <BiChevronDown size={20} />
              </SectionToggle>
            </SectionHeader>

            <AnimatePresence>
              {isExpanded && (
                <SectionContent
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {section.exercises.map((exercise, exerciseIndex) => (
                    <ExerciseItem
                      key={`ex-${sectionIndex}-${exerciseIndex}`}
                      exercise={exercise}
                    />
                  ))}
                </SectionContent>
              )}
            </AnimatePresence>
          </SectionCard>
        );
      })}
    </SectionsContainer>
  );
};

// Styled Components
const SectionsContainer = styled.div`
  margin-bottom: 16px;
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white10};
`;

const SectionName = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const SectionToggle = styled.div<{ $isExpanded: boolean }>`
  transition: transform 0.3s ease;
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? '180deg' : '0deg')});
`;

const SectionContent = styled(motion.div)`
  padding: 16px;
`;
