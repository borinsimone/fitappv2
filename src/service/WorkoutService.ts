import axios from 'axios';

const API_URL = 'https://fit-app-backend-babz.onrender.com';
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

interface Workout {
  _id?: string;
  title: string;
  load: number;
  reps: number;
  date?: Date;
  user_id?: string;
  notes: string;
}

export const getWorkouts = async (token: string): Promise<Workout[] | null> => {
  try {
    console.log('Fetching workouts with token:', token); // Debug log

    const response = await axios.get<Workout[]>(`${API_URL}/workouts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Response data:', response.data); // Debug log
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return null;
  }
};

interface WorkoutResponse {
  _id: string;
  title: string;
  load: number;
  reps: number;
  date: Date;
  user_id: string;

  completed?: boolean;
  notes: string;
}

interface WorkoutData {
  title: string;
  load: number;
  reps: number;
}

export const addWorkouts = async (
  workoutData: WorkoutData
): Promise<{ data: WorkoutResponse } | null> => {
  try {
    console.log('Preparing to send workout data:', workoutData); // Debug log

    const token = localStorage.getItem('token'); // Get the token from local storage

    const response = await axios.post<WorkoutResponse>(
      `${API_URL}/workouts`,
      workoutData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Response data:', response.data); // Debug log

    return response;
  } catch (error) {
    console.error('Error adding workout:', error);
    return null;
  }
};

interface DeleteWorkoutResponse {
  status: number;
  ok: boolean;
}

export const deleteWorkout = async (
  id: string,
  token: string
): Promise<DeleteWorkoutResponse> => {
  try {
    console.log('Preparing to delete workout with id:', id); // Debug log

    const response = await fetch(`${API_URL}/workouts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Response status:', response.status); // Debug log

    if (!response.ok) {
      throw new Error('Failed to delete workout');
    } else {
      console.log('Workout deleted successfully');
    }
    return response;
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};
interface UpdateWorkoutData {
  title?: string;
  load?: number;
  reps?: number;
}

export const updateWorkout = async (
  id: string,
  token: string,
  updatedData: UpdateWorkoutData
): Promise<WorkoutResponse> => {
  try {
    const response = await axios.put<WorkoutResponse>(
      `${API_URL}/workouts/${id}`,
      updatedData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Workout updated successfully:', response.data); // Debug log

    return response.data;
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};
