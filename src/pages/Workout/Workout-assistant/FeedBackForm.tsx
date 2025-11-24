import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdClose,
  MdSentimentDissatisfied,
  MdSentimentNeutral,
  MdSentimentSatisfied,
  MdSentimentVeryDissatisfied,
  MdSentimentVerySatisfied,
} from "react-icons/md";
import { BiBody, BiDumbbell, BiNote } from "react-icons/bi";
import { useWorkouts } from "../../../context/WorkoutContext";
import { useNavigate } from "react-router-dom";

interface FeedBackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

function FeedBackForm({
  isOpen,
  onClose,
}: FeedBackFormProps) {
  const { activeWorkout, setActiveWorkout, editWorkout } =
    useWorkouts();
  const navigate = useNavigate();

  const [feeling, setFeeling] = useState<number>(3); // 1-5 scale
  const [energyLevel, setEnergyLevel] = useState<number>(3); // 1-5 scale
  const [difficulty, setDifficulty] = useState<number>(3); // 1-5 scale
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (
      !activeWorkout ||
      !activeWorkout._id ||
      isSubmitting
    )
      return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token mancante");
      }

      console.log(
        "Preparazione dati per il completamento del workout"
      );
      const endTime = new Date().toISOString();

      // Calcola la durata in minuti
      let duration = 0;
      if (activeWorkout.startTime) {
        const startTimeMs = new Date(
          activeWorkout.startTime
        ).getTime();
        const endTimeMs = new Date(endTime).getTime();
        duration = Math.round(
          (endTimeMs - startTimeMs) / (1000 * 60)
        );
      }

      // Verifica che i valori siano effettivamente numeri e nell'intervallo corretto
      const feelingValue = Math.min(
        Math.max(Number(feeling), 1),
        5
      );
      const energyLevelValue = Math.min(
        Math.max(Number(energyLevel), 1),
        5
      );
      const difficultyValue = Math.min(
        Math.max(Number(difficulty), 1),
        5
      );

      // IMPORTANTE: Mantieni l'intero activeWorkout e aggiungi/aggiorna solo
      // i campi necessari per il completamento
      const updates = {
        completed: true,
        endTime: endTime,
        duration: duration,
        feedback: {
          ...activeWorkout.feedback, // Mantieni eventuali dati di feedback esistenti
          feeling: feelingValue,
          energyLevel: energyLevelValue,
          difficulty: difficultyValue,
          notes: notes || "",
          completedAt: endTime,
        },
      };

      console.log(
        "Dati completi per il salvataggio:",
        updates
      );

      // Invia l'intero workout aggiornato al server
      await editWorkout(activeWorkout._id, updates);

      console.log("Workout completato con successo");

      // Clean up
      localStorage.removeItem("activeWorkout");
      setActiveWorkout(null);

      // Navigate back to workout planner
      navigate("/workout-planner");
    } catch (error) {
      console.error(
        "Errore durante il salvataggio del workout:",
        error
      );

      if (error instanceof Error) {
        alert(`Errore: ${error.message}`);
      } else {
        alert(
          "Si è verificato un errore durante il salvataggio del workout."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mapping feeling to emoji and text
  const feelingEmojis = [
    {
      icon: <MdSentimentVeryDissatisfied size={28} />,
      text: "Pessimo",
    },
    {
      icon: <MdSentimentDissatisfied size={28} />,
      text: "Scarso",
    },
    {
      icon: <MdSentimentNeutral size={28} />,
      text: "Normale",
    },
    {
      icon: <MdSentimentSatisfied size={28} />,
      text: "Buono",
    },
    {
      icon: <MdSentimentVerySatisfied size={28} />,
      text: "Ottimo",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <FormContainer
            as={motion.div}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <Header>
              <Title>Completa Allenamento</Title>
              <CloseButton onClick={onClose}>
                <MdClose size={24} />
              </CloseButton>
            </Header>

            <FormSection>
              <SectionTitle>
                <MdSentimentSatisfied size={22} />
                <span>Come ti sei sentito?</span>
              </SectionTitle>
              <Rating>
                {feelingEmojis.map((item, index) => (
                  <RatingOption
                    key={index}
                    selected={feeling === index + 1}
                    onClick={() => setFeeling(index + 1)}
                    as={motion.div}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.icon}
                    <RatingText>{item.text}</RatingText>
                  </RatingOption>
                ))}
              </Rating>
            </FormSection>

            <FormSection>
              <SectionTitle>
                <BiBody size={22} />
                <span>Livello di energia</span>
              </SectionTitle>
              <Slider>
                <SliderInput
                  type="range"
                  min="1"
                  max="5"
                  value={energyLevel}
                  onChange={(e) =>
                    setEnergyLevel(parseInt(e.target.value))
                  }
                />
                <SliderLabels>
                  <SliderLabel>Basso</SliderLabel>
                  <SliderLabel>Alto</SliderLabel>
                </SliderLabels>
              </Slider>
            </FormSection>

            <FormSection>
              <SectionTitle>
                <BiDumbbell size={22} />
                <span>Difficoltà percepita</span>
              </SectionTitle>
              <Slider>
                <SliderInput
                  type="range"
                  min="1"
                  max="5"
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(parseInt(e.target.value))
                  }
                />
                <SliderLabels>
                  <SliderLabel>Facile</SliderLabel>
                  <SliderLabel>Difficile</SliderLabel>
                </SliderLabels>
              </Slider>
            </FormSection>

            <FormSection>
              <SectionTitle>
                <BiNote size={22} />
                <span>Note</span>
              </SectionTitle>
              <TextArea
                placeholder="Aggiungi note sull'allenamento (opzionale)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormSection>

            <ButtonGroup>
              <CancelButton
                onClick={onClose}
                as={motion.button}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Annulla
              </CancelButton>
              <SubmitButton
                onClick={handleSubmit}
                as={motion.button}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Completa Allenamento
              </SubmitButton>
            </ButtonGroup>
          </FormContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

export default FeedBackForm;

// Styled components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
`;

const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.dark};
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid ${({ theme }) => theme.colors.white10};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.white10};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white70};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
  }
`;

const FormSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.white10};
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};

  svg {
    color: ${({ theme }) => theme.colors.neon};
  }
`;

const Rating = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

const RatingOption = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  transition: all 0.2s;
  background: ${({ selected, theme }) =>
    selected ? `${theme.colors.neon}15` : "transparent"};
  border: 1px solid
    ${({ selected, theme }) =>
      selected ? theme.colors.neon : "transparent"};
  color: ${({ selected, theme }) =>
    selected ? theme.colors.neon : theme.colors.white70};

  &:hover {
    background: ${({ theme }) => theme.colors.white05};
  }
`;

const RatingText = styled.span`
  font-size: 12px;
  text-align: center;
`;

const Slider = styled.div`
  width: 100%;
  padding: 0 8px;
`;

const SliderInput = styled.input`
  width: 100%;
  margin-bottom: 8px;
  -webkit-appearance: none;
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white10};
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.neon};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.neon};
    cursor: pointer;
    border: none;
  }
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SliderLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.white50};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white05};
  border: 1px solid ${({ theme }) => theme.colors.white10};
  padding: 12px;
  color: ${({ theme }) => theme.colors.dark};
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.neon};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.white30};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
`;

const CancelButton = styled(Button)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.white20};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
  }
`;

const SubmitButton = styled(Button)`
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};

  &:hover {
    opacity: 0.9;
  }
`;
