import { createContext, useContext, useEffect, useState } from 'react';
import {
  addWorkouts,
  deleteWorkout,
  getWorkouts,
  updateWorkout,
} from '../service/WorkoutService';
import { useGlobalContext } from './GlobalContext';

interface Workout {
  _id: string;
  title: string;
  load: number;
  reps: number;
  date?: Date;
  name: string;
  completed?: boolean;
  notes: string;
}

interface WorkoutContextType {
  workouts: Workout[] | null;
  fetchWorkouts: () => void;
  addWorkout: (workout: Omit<Workout, '_id'>) => Promise<void>;
  removeWorkout: (id: string) => Promise<void>;
  editWorkout: (id: string, updatedData: Partial<Workout>) => Promise<void>;
  loadWorkouts: () => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setIsLoading } = useGlobalContext();
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);

  const fetchWorkouts = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const data = await getWorkouts(token);
    setWorkouts(data as Workout[]);
  };

  const addWorkout = async (workout: Omit<Workout, '_id'>) => {
    const response = await addWorkouts(workout);
    if (response) {
      fetchWorkouts(); // Ricarica i dati dopo l'aggiunta
    }
  };

  const removeWorkout = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    await deleteWorkout(id, token);
    fetchWorkouts(); // Ricarica i dati dopo la rimozione
  };

  const editWorkout = async (id: string, updatedData: Partial<Workout>) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    await updateWorkout(id, token, updatedData);
    fetchWorkouts(); // Ricarica i dati dopo la modifica
  };

  const loadWorkouts = async () => {
    setIsLoading(true);
    try {
      await fetchWorkouts(); // Attende la fine della chiamata
    } finally {
      setIsLoading(false); // Assicura che venga eseguito sempre
    }
  };
  useEffect(() => {
    loadWorkouts();
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        fetchWorkouts,
        addWorkout,
        removeWorkout,
        editWorkout,
        loadWorkouts,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (!context)
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  return context;
};
