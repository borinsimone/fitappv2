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
}

export interface Section {
  name: string;
  exercises: Exercise[];
}

export interface WorkoutFeedback {
  feeling?: 1 | 2 | 3 | 4 | 5;
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  completedAt?: string;
}

export interface Workout {
  _id: string;
  userId: string;
  name: string;
  sections: Section[];
  date: string;
  completed: boolean;
  startTime?: string;
  endTime?: string;
  duration?: number;
  feedback?: WorkoutFeedback;
  notes?: string;
}
