import axios from 'axios';

const API_URL = 'https://fit-app-backend-babz.onrender.com';
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Definizione dell'interfaccia Workout in linea con il modello del backend
interface Workout {
  _id: string;
  userId: string;
  name: string;
  date: string | Date;
  sections: {
    name: string;
    exercises: {
      name: string;
      notes?: string;
      timeBased: boolean;
      exerciseSets: {
        time?: number;
        weight?: number;
        reps?: number;
        rest?: number;
      }[];
    }[];
  }[];
  startTime?: string;
  endTime?: string;
  duration?: number;
  notes?: string;
  completed: boolean;
  feedback?: {
    feeling: number;
    notes?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Recupera tutti gli allenamenti dell'utente dal server
 * @param token - Token di autenticazione dell'utente
 * @returns Promise contenente l'array degli allenamenti o null in caso di errore
 */
export const getWorkouts = async (token: string): Promise<Workout[] | null> => {
  if (!token) {
    console.error('Token di autenticazione mancante');
    return null;
  }

  try {
    const response = await axios.get<Workout[]>(`${API_URL}/workouts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleError('getWorkouts', error);
    return null;
  }
};

/**
 * Recupera un singolo allenamento per ID
 * @param id - ID dell'allenamento da recuperare
 * @param token - Token di autenticazione dell'utente
 * @returns Promise contenente l'allenamento o null in caso di errore
 */
export const getWorkoutById = async (
  id: string,
  token: string
): Promise<Workout | null> => {
  if (!token) {
    console.error('Token di autenticazione mancante');
    return null;
  }

  try {
    const response = await axios.get<Workout>(`${API_URL}/workouts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleError('getWorkoutById', error, id);
    return null;
  }
};

/**
 * Crea un nuovo allenamento
 * @param workoutData - Dati dell'allenamento da creare
 * @param token - Token di autenticazione dell'utente
 * @returns Promise contenente l'allenamento creato o null in caso di errore
 */
export const addWorkouts = async (
  workoutData: Omit<Workout, '_id' | 'userId' | 'createdAt' | 'updatedAt'>,
  token: string
): Promise<Workout | null> => {
  if (!token) {
    console.error('Token di autenticazione mancante');
    return null;
  }

  try {
    const response = await axios.post<Workout>(
      `${API_URL}/workouts`,
      workoutData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    handleError('addWorkouts', error);
    return null;
  }
};

/**
 * Elimina un allenamento per ID
 * @param id - ID dell'allenamento da eliminare
 * @param token - Token di autenticazione dell'utente
 * @returns Promise contenente un valore booleano che indica il successo dell'operazione
 */
export const deleteWorkout = async (
  id: string,
  token: string
): Promise<boolean> => {
  if (!token) {
    console.error('Token di autenticazione mancante');
    return false;
  }

  try {
    await axios.delete(`${API_URL}/workouts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  } catch (error) {
    handleError('deleteWorkout', error, id);
    return false;
  }
};

/**
 * Aggiorna un allenamento esistente
 * @param id - ID dell'allenamento da aggiornare
 * @param updatedData - Dati aggiornati dell'allenamento
 * @param token - Token di autenticazione dell'utente
 * @returns Promise contenente l'allenamento aggiornato o null in caso di errore
 */
export const updateWorkout = async (
  id: string,
  updatedData: Partial<
    Omit<Workout, '_id' | 'userId' | 'createdAt' | 'updatedAt'>
  >,
  token: string
): Promise<Workout | null> => {
  if (!token) {
    console.error('Token di autenticazione mancante');
    return null;
  }

  try {
    const response = await axios.put<Workout>(
      `${API_URL}/workouts/${id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    handleError('updateWorkout', error, id);
    return null;
  }
};

/**
 * Calcola la durata di un allenamento
 * @param id - ID dell'allenamento
 * @param token - Token di autenticazione dell'utente
 * @returns Promise contenente l'allenamento aggiornato o null in caso di errore
 */
export const calculateWorkoutDuration = async (
  id: string,
  token: string
): Promise<{ workout: Workout; duration: number } | null> => {
  if (!token) {
    console.error('Token di autenticazione mancante');
    return null;
  }

  try {
    const response = await axios.post<{
      message: string;
      duration: number;
      workout: Workout;
    }>(
      `${API_URL}/workouts/${id}/calculate-duration`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      workout: response.data.workout,
      duration: response.data.duration,
    };
  } catch (error) {
    handleError('calculateWorkoutDuration', error, id);
    return null;
  }
};

/**
 * Gestisce gli errori in modo centralizzato
 * @param operation - Nome dell'operazione che ha generato l'errore
 * @param error - L'errore catturato
 * @param resourceId - ID opzionale della risorsa coinvolta
 */
const handleError = (
  operation: string,
  error: unknown,
  resourceId?: string
): void => {
  if (axios.isAxiosError(error)) {
    const resourceInfo = resourceId ? ` (ID: ${resourceId})` : '';

    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.error || 'Errore sconosciuto';

      if (status === 400) {
        console.error(
          `${operation}${resourceInfo}: Dati non validi - ${errorMessage}`
        );
      } else if (status === 401) {
        console.error(
          `${operation}${resourceInfo}: Non autorizzato - ${errorMessage}`
        );
      } else if (status === 403) {
        console.error(
          `${operation}${resourceInfo}: Accesso negato - ${errorMessage}`
        );
      } else if (status === 404) {
        console.error(
          `${operation}${resourceInfo}: Risorsa non trovata - ${errorMessage}`
        );
      } else {
        console.error(
          `${operation}${resourceInfo}: Errore (${status}) - ${errorMessage}`
        );
      }
    } else if (error.request) {
      console.error(
        `${operation}${resourceInfo}: Nessuna risposta dal server. Verifica la connessione.`
      );
    } else {
      console.error(
        `${operation}${resourceInfo}: Errore nella configurazione - ${error.message}`
      );
    }
  } else {
    console.error(`${operation}: Errore imprevisto`, error);
  }
};

/**
 * Funzione di diagnostica per testare endpoint API
 * @param endpoint - Endpoint relativo o URL completo da testare
 * @param token - Token di autenticazione dell'utente
 * @returns Promise con i dati ricevuti o null in caso di errore
 */
export const testEndpoint = async (
  endpoint: string,
  token: string
): Promise<unknown> => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  try {
    console.log(`Tentativo con URL: ${url}`);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`Risposta da ${url}:`, response.status);
    return response.data;
  } catch (error) {
    handleError('testEndpoint', error);
    return null;
  }
};

export type { Workout };
