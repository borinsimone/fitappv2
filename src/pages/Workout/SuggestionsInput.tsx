import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import exercisesData from './exercises.json';

interface SuggestionsInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type: 'section' | 'exercise';
  sectionName?: string; // Per filtrare gli esercizi in base alla sezione
}

const SuggestionsInput: React.FC<SuggestionsInputProps> = ({
  value,
  onChange,
  placeholder = 'Inserisci nome',
  type,
  sectionName = '',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Carica le opzioni disponibili in base al tipo (sezione o esercizio)
  useEffect(() => {
    if (type === 'section') {
      // Per le sezioni, suggerisci le categorie di esercizi
      const categories = exercisesData.map((cat) => cat.category);
      setSuggestions(categories);
    } else if (type === 'exercise' && sectionName) {
      // Per gli esercizi, filtra in base al nome della sezione
      // Se il nome della sezione corrisponde a una categoria, usa gli esercizi di quella categoria
      const category = exercisesData.find(
        (cat) => cat.category.toLowerCase() === sectionName.toLowerCase()
      );

      if (category) {
        setSuggestions(category.exercises);
      } else {
        // Se non c'è una corrispondenza esatta, usa tutti gli esercizi
        const allExercises = exercisesData.flatMap((cat) => cat.exercises);
        setSuggestions(allExercises);
      }
    }
  }, [type, sectionName]);

  // Filtra i suggerimenti in base all'input dell'utente
  const getFilteredSuggestions = () => {
    if (inputValue.trim() === '') {
      return suggestions.slice(0, 6); // Mostra i primi 6 come suggerimenti iniziali
    }

    return suggestions
      .filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, 8); // Limita a 8 risultati
  };

  // Gestione del click fuori dal dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Salva il valore personalizzato nel localStorage
  const saveCustomValue = () => {
    if (!inputValue || suggestions.includes(inputValue)) return;

    // Ottieni i valori personalizzati esistenti o inizializza un nuovo array
    const storageKey =
      type === 'section' ? 'customSections' : 'customExercises';
    const existingValues = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // Aggiungi il nuovo valore se non esiste già
    if (!existingValues.includes(inputValue)) {
      const updatedValues = [...existingValues, inputValue];
      localStorage.setItem(storageKey, JSON.stringify(updatedValues));

      // Aggiungi anche ai suggerimenti attuali
      setSuggestions((prev) => [...prev, inputValue]);
    }
  };

  const handleBlur = () => {
    onChange(inputValue);

    // Se è un valore personalizzato, salvalo
    saveCustomValue();

    // Chiudi il dropdown con un piccolo ritardo
    setTimeout(() => setIsOpen(false), 200);
  };

  const filteredSuggestions = getFilteredSuggestions();

  return (
    <Container>
      <InputWrapper>
        <Input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
        />
      </InputWrapper>

      {isOpen && filteredSuggestions.length > 0 && (
        <Dropdown ref={dropdownRef}>
          {filteredSuggestions.map((suggestion, index) => (
            <DropdownItem
              key={index}
              onClick={() => handleSuggestionSelect(suggestion)}
              onMouseDown={(e) => e.preventDefault()} // Previene il blur dell'input
            >
              {suggestion}
            </DropdownItem>
          ))}

          {/* Opzione per salvare un valore personalizzato */}
          {inputValue && !suggestions.includes(inputValue) && (
            <SaveCustomItem
              onClick={() => saveCustomValue()}
              onMouseDown={(e) => e.preventDefault()}
            >
              Salva "{inputValue}" per uso futuro
            </SaveCustomItem>
          )}
        </Dropdown>
      )}
    </Container>
  );
};

// Styled components...
const Container = styled.div`
  position: relative;
  width: 100%;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.white20};
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.neon};
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.dark};
  border: 1px solid ${({ theme }) => theme.colors.white20};
  border-radius: 8px;
  margin-top: 4px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const DropdownItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
  }
`;

const SaveCustomItem = styled(DropdownItem)`
  border-top: 1px solid ${({ theme }) => theme.colors.white20};
  color: ${({ theme }) => theme.colors.neon};
  font-size: 13px;
`;

export default SuggestionsInput;
