// src/pages/Meal/AddMealForm.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BiSearch,
  BiPlus,
  BiBarcode,
  BiTrash,
} from "react-icons/bi";
// import {
//   searchFoodProducts,
//   getProductByBarcode,
// } from '../../services/foodApiService';
import {
  getProductByBarcode,
  searchFoodProducts,
} from "../../service/foodApiService";
import { FoodItem, Meal } from "./types/meal";

import {
  AddButton,
  BarcodeButton,
  ButtonGroup,
  CancelButton,
  CarbsBar,
  CloseButton,
  FatBar,
  FoodBrand,
  FoodDetails,
  FoodImage,
  FoodImageContainer,
  FoodImagePlaceholder,
  FoodName,
  FoodNutrients,
  FormContainer,
  FormGroup,
  FormHeader,
  Input,
  LoadingIndicator,
  FormMacroBar,
  MacroChart,
  MacroLegend,
  MacroLegendItem,
  NutritionGrid,
  NutritionItem,
  NutritionLabel,
  NutritionSummary,
  NutritionValue,
  ProductBrand,
  ProductImage,
  ProductInfo,
  ProductName,
  ProteinBar,
  QuantityControl,
  QuantityInput,
  QuantityUnit,
  RemoveButton,
  SaveButton,
  SearchButton,
  SearchContainer,
  SearchInput,
  SearchResultItem,
  SearchResults,
  SectionTitle,
  SelectedFoodItem,
  SelectedFoodsList,
  TextArea,
  Label,
} from "./MealStyles";
// import { searchFoodProducts } from '../../service/foodApiService';

const AddMealForm: React.FC<{
  onSave: (meal: Meal) => void;
  onCancel: () => void;
  date: Date;
  editingMeal?: Meal;
}> = ({ onSave, onCancel, date, editingMeal }) => {
  const [mealName, setMealName] = useState(
    editingMeal?.name || ""
  );
  const [mealTime, setMealTime] = useState(
    editingMeal?.time || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{
      product_name: string;
      brands?: string;
      nutriments?: {
        energy_value?: number;
        proteins?: number;
        carbohydrates?: number;
        fat?: number;
      };
      image_url?: string;
      image_small_url?: string;
      code?: string;
    }>
  >([]);
  const [selectedFoods, setSelectedFoods] = useState<
    FoodItem[]
  >(editingMeal?.foodItems || []);
  const [notes, setNotes] = useState(
    editingMeal?.notes || ""
  );
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await searchFoodProducts(searchQuery);
      setSearchResults(results.products || []);
    } catch (error) {
      console.error("Search error:", error);
      // Mostra messaggio di errore
    } finally {
      setLoading(false);
    }
  };

  const handleScanBarcode = async () => {
    // Qui andrebbe implementata la scansione del codice a barre
    // Per ora simuliamo l'inserimento manuale
    const barcode = prompt("Inserisci il codice a barre:");
    if (!barcode) return;

    setLoading(true);
    try {
      const result = await getProductByBarcode(barcode);
      if (result.status === 1) {
        const product = result.product;
        addFoodItem({
          id: Date.now().toString(),
          name: product.product_name,
          brand: product.brands,
          quantity: 100, // Default a 100g
          calories: product.nutriments.energy_value || 0,
          protein: product.nutriments.proteins || 0,
          carbs: product.nutriments.carbohydrates || 0,
          fat: product.nutriments.fat || 0,
          image: product.image_url,
          barcode: barcode,
        });
        setSearchQuery("");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Barcode scan error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFoodItem = (food: FoodItem) => {
    setSelectedFoods((prev) => [...prev, food]);
  };

  const removeFoodItem = (id: string) => {
    setSelectedFoods((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const updateFoodQuantity = (
    id: string,
    quantity: number
  ) => {
    setSelectedFoods((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mealName || selectedFoods.length === 0) {
      alert(
        "Inserisci il nome del pasto e almeno un alimento"
      );
      return;
    }

    const newMeal: Meal = {
      id: Date.now().toString(),
      userId: "current-user-id", // Da sostituire con l'ID utente reale
      name: mealName,
      date: date.toISOString().split("T")[0],
      time: mealTime || "12:00",
      foodItems: selectedFoods,
      notes: notes,
    };

    onSave(newMeal);
  };

  const handleSelectSearchResult = (
    product: typeof searchResults[0]
  ) => {
    const foodItem: FoodItem = {
      id: Date.now().toString(),
      name: product.product_name || "Prodotto senza nome",
      brand: product.brands,
      quantity: 100, // Default a 100g
      calories: product.nutriments?.energy_value || 0,
      protein: product.nutriments?.proteins || 0,
      carbs: product.nutriments?.carbohydrates || 0,
      fat: product.nutriments?.fat || 0,
      image: product.image_small_url,
      barcode: product.code,
    };

    addFoodItem(foodItem);
    setSearchResults([]);
    setSearchQuery("");
  };

  // Calcola i totali del pasto
  const totals = selectedFoods.reduce(
    (sum, item) => {
      const factor = item.quantity / 100;
      return {
        calories: sum.calories + item.calories * factor,
        protein: sum.protein + item.protein * factor,
        carbs: sum.carbs + item.carbs * factor,
        fat: sum.fat + item.fat * factor,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <FormContainer
      as={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <FormHeader>
        <h2>Aggiungi pasto</h2>
        <CloseButton onClick={onCancel}>×</CloseButton>
      </FormHeader>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="meal-name">Nome pasto</Label>
          <Input
            id="meal-name"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            placeholder="Es. Colazione, Pranzo, Spuntino..."
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="meal-time">Orario</Label>
          <Input
            id="meal-time"
            type="time"
            value={mealTime}
            onChange={(e) => setMealTime(e.target.value)}
          />
        </FormGroup>

        <SectionTitle>Aggiungi alimenti</SectionTitle>

        <SearchContainer onSubmit={handleSearch}>
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca alimenti..."
          />
          <SearchButton type="submit" disabled={loading}>
            <BiSearch size={20} />
          </SearchButton>
          <BarcodeButton
            type="button"
            onClick={handleScanBarcode}
            disabled={loading}
          >
            <BiBarcode size={20} />
          </BarcodeButton>
        </SearchContainer>

        {loading && (
          <LoadingIndicator>
            Caricamento...
          </LoadingIndicator>
        )}

        {searchResults.length > 0 && (
          <SearchResults>
            {searchResults.map((product) => (
              <SearchResultItem
                key={product.code}
                onClick={() =>
                  handleSelectSearchResult(product)
                }
              >
                {product.image_small_url && (
                  <ProductImage
                    src={product.image_small_url}
                    alt={product.product_name}
                  />
                )}
                <ProductInfo>
                  <ProductName>
                    {product.product_name ||
                      "Prodotto senza nome"}
                  </ProductName>
                  {product.brands && (
                    <ProductBrand>
                      {product.brands}
                    </ProductBrand>
                  )}
                </ProductInfo>
                <AddButton>
                  <BiPlus size={18} />
                </AddButton>
              </SearchResultItem>
            ))}
          </SearchResults>
        )}

        {selectedFoods.length > 0 && (
          <SelectedFoodsList>
            <SectionTitle>
              Alimenti selezionati
            </SectionTitle>
            {selectedFoods.map((food) => (
              <SelectedFoodItem key={food.id}>
                <FoodImageContainer>
                  {food.image ? (
                    <FoodImage
                      src={food.image}
                      alt={food.name}
                    />
                  ) : (
                    <FoodImagePlaceholder />
                  )}
                </FoodImageContainer>
                <FoodDetails>
                  <FoodName>{food.name}</FoodName>
                  <FoodBrand>{food.brand}</FoodBrand>
                  <FoodNutrients>
                    {food.calories}kcal | P: {food.protein}g
                    | C: {food.carbs}g | G: {food.fat}g
                  </FoodNutrients>
                </FoodDetails>
                <QuantityControl>
                  <QuantityInput
                    type="number"
                    min="1"
                    value={food.quantity}
                    onChange={(e) =>
                      updateFoodQuantity(
                        food.id,
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <QuantityUnit>g</QuantityUnit>
                </QuantityControl>
                <RemoveButton
                  onClick={() => removeFoodItem(food.id)}
                >
                  <BiTrash size={18} />
                </RemoveButton>
              </SelectedFoodItem>
            ))}
          </SelectedFoodsList>
        )}

        {selectedFoods.length > 0 && (
          <NutritionSummary>
            <SectionTitle>
              Riepilogo nutrizionale
            </SectionTitle>
            <NutritionGrid>
              <NutritionItem>
                <NutritionLabel>Calorie</NutritionLabel>
                <NutritionValue>
                  {Math.round(totals.calories)} kcal
                </NutritionValue>
              </NutritionItem>
              <NutritionItem>
                <NutritionLabel>Proteine</NutritionLabel>
                <NutritionValue>
                  {Math.round(totals.protein)} g
                </NutritionValue>
              </NutritionItem>
              <NutritionItem>
                <NutritionLabel>Carboidrati</NutritionLabel>
                <NutritionValue>
                  {Math.round(totals.carbs)} g
                </NutritionValue>
              </NutritionItem>
              <NutritionItem>
                <NutritionLabel>Grassi</NutritionLabel>
                <NutritionValue>
                  {Math.round(totals.fat)} g
                </NutritionValue>
              </NutritionItem>
            </NutritionGrid>

            <MacroChart>
              <FormMacroBar>
                <ProteinBar
                  style={{
                    width: `${
                      totals.calories > 0
                        ? ((totals.protein * 4) /
                            totals.calories) *
                          100
                        : 0
                    }%`,
                  }}
                />
                <CarbsBar
                  style={{
                    width: `${
                      totals.calories > 0
                        ? ((totals.carbs * 4) /
                            totals.calories) *
                          100
                        : 0
                    }%`,
                  }}
                />
                <FatBar
                  style={{
                    width: `${
                      totals.calories > 0
                        ? ((totals.fat * 9) /
                            totals.calories) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </FormMacroBar>
              <MacroLegend>
                <MacroLegendItem color="#75c9b7">
                  Proteine{" "}
                  {Math.round(
                    totals.calories > 0
                      ? ((totals.protein * 4) /
                          totals.calories) *
                          100
                      : 0
                  )}
                  %
                </MacroLegendItem>
                <MacroLegendItem color="#abd699">
                  Carboidrati{" "}
                  {Math.round(
                    totals.calories > 0
                      ? ((totals.carbs * 4) /
                          totals.calories) *
                          100
                      : 0
                  )}
                  %
                </MacroLegendItem>
                <MacroLegendItem color="#e8a99e">
                  Grassi{" "}
                  {Math.round(
                    totals.calories > 0
                      ? ((totals.fat * 9) /
                          totals.calories) *
                          100
                      : 0
                  )}
                  %
                </MacroLegendItem>
              </MacroLegend>
            </MacroChart>
          </NutritionSummary>
        )}

        <FormGroup>
          <Label htmlFor="meal-notes">
            Note (opzionale)
          </Label>
          <TextArea
            id="meal-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Aggiungi note sul pasto..."
            rows={3}
          />
        </FormGroup>

        <ButtonGroup>
          <CancelButton type="button" onClick={onCancel}>
            Annulla
          </CancelButton>
          <SaveButton type="submit">Salva pasto</SaveButton>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default AddMealForm;
