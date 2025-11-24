import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  addWorkouts,
  deleteWorkout,
  getWorkouts,
  updateWorkout,
} from "../service/WorkoutService";
import { useGlobalContext } from "./GlobalContext";

// Interfacce allineate con il modello MongoDB
export interface WorkoutSet {
  reps?: number;
  weight?: number;
  rest: number;
  time?: number;
}

export interface Exercise {
  name: string;
  exerciseSets: WorkoutSet[];
  notes?: string;
  timeBased: boolean;
  gifUrl?: string;
  bodyPart?: string;
  equipment?: string;
}

export interface Section {
  name: string;
  exercises: Exercise[];
}

export interface WorkoutFeedback {
  feeling: number; // 1-5 scale
  energyLevel?: number; // 1-5 scale
  difficulty?: number; // 1-5 scale
  notes?: string;
  completedAt?: string; // Timestamp ISO
}

export interface Workout {
  _id: string;
  userId: string;
  name: string;
  sections: Section[];
  date: string;
  completed: boolean;
  feedback?: WorkoutFeedback;
  notes?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface WorkoutContextType {
  workouts: Workout[] | null;
  fetchWorkouts: () => Promise<void>;
  addWorkout: (
    workout: Omit<
      Workout,
      "_id" | "userId" | "createdAt" | "updatedAt"
    >
  ) => Promise<void>;
  removeWorkout: (id: string) => Promise<void>;
  editWorkout: (
    id: string,
    updatedData: Partial<
      Omit<
        Workout,
        "_id" | "userId" | "createdAt" | "updatedAt"
      >
    >
  ) => Promise<void>;
  loadWorkouts: () => Promise<void>;
  activeWorkout: Workout | null;
  setActiveWorkout: React.Dispatch<
    React.SetStateAction<Workout | null>
  >;
}

const WorkoutContext = createContext<
  WorkoutContextType | undefined
>(undefined);

export const WorkoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setIsLoading } = useGlobalContext();
  const [workouts, setWorkouts] = useState<
    Workout[] | null
  >(null);
  const [activeWorkout, setActiveWorkout] =
    useState<Workout | null>(
      localStorage.getItem("activeWorkout")
        ? JSON.parse(localStorage.getItem("activeWorkout")!)
        : null
    );

  const fetchWorkouts =
    useCallback(async (): Promise<void> => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const data = await getWorkouts(token);
      setWorkouts(data as Workout[]);
    }, []);

  const addWorkout = async (
    workout: Omit<
      Workout,
      "_id" | "userId" | "createdAt" | "updatedAt"
    >
  ): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const response = await addWorkouts(workout, token);
    if (response) {
      await fetchWorkouts(); // Ricarica i dati dopo l'aggiunta
    }
  };

  const removeWorkout = async (
    id: string
  ): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setIsLoading(true);
    await deleteWorkout(id, token);
    await fetchWorkouts(); // Ricarica i dati dopo la rimozione
    setIsLoading(false);
  };

  const editWorkout = async (
    id: string,
    updatedData: Partial<
      Omit<
        Workout,
        "_id" | "userId" | "createdAt" | "updatedAt"
      >
    >
  ): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await updateWorkout(id, updatedData, token);
    await fetchWorkouts(); // Ricarica i dati dopo la modifica
  };

  const loadWorkouts =
    useCallback(async (): Promise<void> => {
      console.log("Starting loadWorkouts...");
      setIsLoading(true);
      try {
        console.log("Fetching workouts...");
        await fetchWorkouts(); // Attende la fine della chiamata
        console.log("Workouts fetched successfully");
      } catch (error) {
        console.error("Error loading workouts:", error);
      } finally {
        console.log("Finishing loadWorkouts...");
        setIsLoading(false); // Assicura che venga eseguito sempre
      }
    }, [setIsLoading, fetchWorkouts]);

  // Carica i workout all'avvio
  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  // Persisti activeWorkout nel localStorage
  useEffect(() => {
    if (activeWorkout) {
      localStorage.setItem(
        "activeWorkout",
        JSON.stringify(activeWorkout)
      );
    } else {
      localStorage.removeItem("activeWorkout");
    }
  }, [activeWorkout]);

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        fetchWorkouts,
        addWorkout,
        removeWorkout,
        editWorkout,
        loadWorkouts,
        activeWorkout,
        setActiveWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (!context)
    throw new Error(
      "useWorkouts must be used within a WorkoutProvider"
    );
  return context;
};
