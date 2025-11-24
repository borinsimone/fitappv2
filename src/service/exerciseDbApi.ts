// Service to interact with ExerciseDB API (RapidAPI)
// Documentation: https://rapidapi.com/justin-wf/api/exercisedb

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;
const BASE_URL = "https://exercisedb.p.rapidapi.com";

export interface ExerciseDBItem {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
}

const getOptions = () => ({
  method: "GET",
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": API_HOST,
  },
});

export const fetchExercises = async (
  limit = 50
): Promise<ExerciseDBItem[]> => {
  try {
    if (!API_KEY) {
      console.warn(
        "ExerciseDB API Key is missing in .env file."
      );
      return [];
    }

    // Fetch exercises. Note: The API defaults to a lot of data, so limit is important if supported,
    // but ExerciseDB standard endpoint returns all or paginated.
    // We use the standard endpoint and slice locally if needed, or use limit param if API supports it.
    const response = await fetch(
      `${BASE_URL}/exercises?limit=${limit}`,
      getOptions()
    );

    if (!response.ok) {
      throw new Error(
        `API call failed: ${response.status}`
      );
    }

    const data = await response.json();

    // Se l'API non supporta il parametro limit direttamente, tagliamo l'array qui
    return Array.isArray(data) ? data.slice(0, limit) : [];
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return []; // Ritorna un array vuoto in caso di errore
  }
};

export const fetchExercisesByBodyPart = async (
  bodyPart: string
): Promise<ExerciseDBItem[]> => {
  try {
    if (!API_KEY) return [];

    const response = await fetch(
      `${BASE_URL}/exercises/bodyPart/${bodyPart}?limit=50`,
      getOptions()
    );

    if (!response.ok) {
      throw new Error(
        `API call failed: ${response.status}`
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(
      "Error fetching exercises by body part:",
      error
    );
    return [];
  }
};
