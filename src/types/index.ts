// Le fasi della tecnica del Pomodoro
export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

// Lo stato di attività del timer
export type TimerStatus = 'idle' | 'running' | 'paused';

// Struttura dati per gestire l'animazione della ciotola
export interface RamenStep {
  threshold: number; // Percentuale di completamento da raggiungere (es. 25, 50, 75, 100)
  ingredientId: string; // Identificativo per attivare l'animazione CSS
}