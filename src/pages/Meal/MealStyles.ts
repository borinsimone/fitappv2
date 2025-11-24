import styled from "styled-components";
import { motion } from "framer-motion";

// ------------ Componenti principali pagina ------------
export const PageContainer = styled.div`
  height: 100vh;
  height: 100dvh;
  width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  gap: 16px;
  padding-bottom: 10vh;
`;

export const MainContent = styled.div`
  width: 90%;
  flex: 1;
  overflow-y: auto;
  position: relative;
  padding-bottom: 20px;
  -webkit-overflow-scrolling: touch;
`;

// ------------ Componenti navigazione settimanale ------------
// (Removed as replaced by MealAgenda component)

// ------------ Componenti Daily Meals ------------
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const DateDisplay = styled.h2`
  font-size: 20px;
  font-weight: 600;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.neon};
`;

export const AddButton = styled.button`
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

// ------------ Componenti per sommario nutrizionale ------------
export const NutritionSummary = styled.div`
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
  border-left: 4px solid ${({ theme }) => theme.colors.neon};
`;

export const MacrosChart = styled.div`
  width: 140px;
  height: 140px;
  margin: 0 auto;
`;

export const NutritionTotals = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const TotalItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const TotalLabel = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
`;

export const TotalValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neon};
`;

export const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const NutritionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const NutritionLabel = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
`;

export const NutritionValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neon};
`;

// ------------ Componenti per lista dei pasti ------------
export const MealsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MealCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 12px;
  overflow: hidden;
  border-left: 4px solid ${({ theme }) => theme.colors.neon};
`;

export const MealHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.white10};
`;

export const MealTime = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 4px;
`;

export const MealName = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

export const MealCalories = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neon};
`;

export const MealContent = styled.div`
  padding: 16px;
`;

export const MacroDistribution = styled.div`
  margin-bottom: 16px;
`;

export const MacroBar = styled.div`
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  margin-bottom: 8px;
`;

export const ProteinSegment = styled.div<{ width: number }>`
  width: ${({ width }) => `${width}%`};
  height: 100%;
  background: #75c9b7;
`;

export const CarbsSegment = styled.div<{ width: number }>`
  width: ${({ width }) => `${width}%`};
  height: 100%;
  background: #abd699;
`;

export const FatSegment = styled.div<{ width: number }>`
  width: ${({ width }) => `${width}%`};
  height: 100%;
  background: #e8a99e;
`;

export const MacroValues = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`;

export const MacroValue = styled.div`
  opacity: 0.8;
`;

export const FoodItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

export const FoodItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 8px;
`;

export const FoodName = styled.div`
  font-size: 14px;
`;

export const FoodQuantity = styled.div`
  font-size: 12px;
  opacity: 0.8;
`;

export const MealNotes = styled.div`
  font-size: 13px;
  opacity: 0.8;
  font-style: italic;
  padding: 8px;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 8px;
  margin-top: 12px;
`;

export const MealActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid
    ${({ theme }) => theme.colors.white10};
`;

export const ActionButton = styled.button`
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 12px;
  margin-top: 20px;
`;

export const AddFirstMealButton = styled.button`
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 600;
  margin-top: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

// ------------ Componenti per il form di aggiunta pasti ------------
export const FormContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

export const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.neon};
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white70};
  font-size: 24px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
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

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 16px;
  color: ${({ theme }) => theme.colors.neon};
`;

export const SearchContainer = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 12px;
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

export const SearchButton = styled.button`
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  border: none;
  border-radius: 8px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const BarcodeButton = styled.button`
  background: ${({ theme }) => theme.colors.white20};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 8px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LoadingIndicator = styled.div`
  text-align: center;
  padding: 10px;
  color: ${({ theme }) => theme.colors.neon};
  font-style: italic;
`;

export const SearchResults = styled.div`
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 8px;
  margin-bottom: 24px;
  max-height: 300px;
  overflow-y: auto;
`;

export const SearchResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.white10};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.white10};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-right: 12px;
  background: ${({ theme }) => theme.colors.white05};
  border-radius: 4px;
`;

export const ProductInfo = styled.div`
  flex: 1;
`;

export const ProductName = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
`;

export const ProductBrand = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

export const AddIconButton = styled.button`
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.neon};
    color: ${({ theme }) => theme.colors.dark};
  }
`;

export const SelectedFoodsList = styled.div`
  margin-bottom: 24px;
`;

export const SelectedFoodItem = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
`;

export const FoodImageContainer = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 12px;
`;

export const FoodImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white05};
`;

export const FoodImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.white10};
  border-radius: 4px;
`;

export const FoodDetails = styled.div`
  flex: 1;
`;

export const FoodBrand = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 4px;
`;

export const FoodNutrients = styled.div`
  font-size: 12px;
  opacity: 0.8;
`;

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin: 0 12px;
`;

export const QuantityInput = styled.input`
  width: 60px;
  padding: 4px 8px;
  text-align: center;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.white20};
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.neon};
  }
`;

export const QuantityUnit = styled.span`
  font-size: 12px;
  margin-left: 4px;
  opacity: 0.8;
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white70};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.white10};
  }
`;

export const MacroChart = styled.div`
  margin: 16px 0;
`;

export const FormMacroBar = styled.div`
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  margin-bottom: 12px;
`;

export const ProteinBar = styled.div`
  background: #75c9b7;
  height: 100%;
`;

export const CarbsBar = styled.div`
  background: #abd699;
  height: 100%;
`;

export const FatBar = styled.div`
  background: #e8a99e;
  height: 100%;
`;

export const MacroLegend = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 12px;
`;

export const MacroLegendItem = styled.div<{
  color: string;
}>`
  display: flex;
  align-items: center;
  gap: 4px;

  &:before {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    background: ${({ color }) => color};
    border-radius: 50%;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.white20};
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.neon};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

export const CancelButton = styled.button`
  background: ${({ theme }) => theme.colors.white10};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.white20};
  }
`;

export const SaveButton = styled.button`
  background: ${({ theme }) => theme.colors.neon};
  color: ${({ theme }) => theme.colors.dark};
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
