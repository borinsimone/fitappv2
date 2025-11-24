import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  BiSearch,
  BiFilter,
  BiX,
  BiLoaderAlt,
} from "react-icons/bi";
import {
  fetchExercises,
  fetchExercisesByBodyPart,
  ExerciseDBItem,
} from "../../service/exerciseDbApi";

interface ExerciseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: ExerciseDBItem) => void;
}

const BODY_PARTS = [
  "all",
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist",
];

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [exercises, setExercises] = useState<
    ExerciseDBItem[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] =
    useState("all");

  useEffect(() => {
    if (isOpen) {
      loadExercises();
    }
  }, [isOpen, selectedBodyPart]);

  const loadExercises = async () => {
    setLoading(true);
    try {
      let data;
      if (selectedBodyPart === "all") {
        data = await fetchExercises(100); // Limit to 100 for performance
      } else {
        data = await fetchExercisesByBodyPart(
          selectedBodyPart
        );
      }
      if (data.length > 0) {
        console.log("First exercise data:", data[0]);
      }
      setExercises(data);
    } catch (error) {
      console.error("Failed to load exercises", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Container
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
            }}
          >
            <Header>
              <Title>Select Exercise</Title>
              <CloseButton onClick={onClose}>
                <BiX size={24} />
              </CloseButton>
            </Header>

            <SearchBar>
              <BiSearch size={20} color="#ffffff70" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </SearchBar>

            <FilterContainer>
              {BODY_PARTS.map((part) => (
                <FilterChip
                  key={part}
                  $active={selectedBodyPart === part}
                  onClick={() => setSelectedBodyPart(part)}
                >
                  {part}
                </FilterChip>
              ))}
            </FilterContainer>

            <ExerciseGrid>
              {loading ? (
                <LoaderContainer>
                  <BiLoaderAlt size={40} className="spin" />
                </LoaderContainer>
              ) : (
                filteredExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    onClick={() => onSelect(exercise)}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ImageContainer>
                      <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/150?text=No+Image";
                          e.currentTarget.onerror = null;
                        }}
                      />
                    </ImageContainer>
                    <ExerciseInfo>
                      <ExerciseName>
                        {exercise.name}
                      </ExerciseName>
                      <ExerciseMeta>
                        <span>{exercise.bodyPart}</span>
                        <span>•</span>
                        <span>{exercise.equipment}</span>
                      </ExerciseMeta>
                    </ExerciseInfo>
                  </ExerciseCard>
                ))
              )}
              {!loading &&
                filteredExercises.length === 0 && (
                  <EmptyState>
                    No exercises found
                  </EmptyState>
                )}
            </ExerciseGrid>
          </Container>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ExerciseSelector;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const Container = styled(motion.div)`
  background: ${({ theme }) => theme.colors.dark};
  width: 100%;
  max-width: 600px;
  height: 90vh;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
`;

const Header = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.white10};
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white70};
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const SearchBar = styled.div`
  margin: 16px 20px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;

  input {
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.white};
    font-size: 16px;
    width: 100%;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.white50};
    }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 20px 16px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterChip = styled.button<{ $active: boolean }>`
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.neon : theme.colors.white20};
  background: ${({ theme, $active }) =>
    $active ? `${theme.colors.neon}20` : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.neon : theme.colors.white70};
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.neon};
    color: ${({ theme }) => theme.colors.neon};
  }
`;

const ExerciseGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(150px, 1fr)
  );
  gap: 16px;
`;

const ExerciseCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid transparent;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.neon};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ExerciseInfo = styled.div`
  padding: 12px;
`;

const ExerciseName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 4px;
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ExerciseMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.white50};
  display: flex;
  gap: 6px;
  text-transform: capitalize;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.colors.neon};

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.white50};
`;
