import { useState, useEffect } from 'react';
import  type { TimerMode, TimerStatus } from '../types';

// Definiamo i tempi in secondi per facilitare i calcoli
const FOCUS_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;

export const usePomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [mode, setMode] = useState<TimerMode>('focus');

  useEffect(() => {
    let interval: number | undefined;

    // Se il timer è in esecuzione e c'è ancora tempo, decurta 1 secondo
    if (status === 'running' && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } 
    // Se il tempo scade, fermiamo il timer (qui poi gestiremo il passaggio focus -> pausa)
    else if (timeLeft === 0) {
      setStatus('idle');
      // TODO: Gestire il cambio di modalità e i suoni
    }

    // Cleanup: puliamo l'intervallo per evitare memory leaks
    return () => clearInterval(interval);
  }, [status, timeLeft]);

  // --- AZIONI DEL TIMER ---
  const startTimer = () => setStatus('running');
  const pauseTimer = () => setStatus('paused');
  
  const resetTimer = () => {
    setStatus('idle');
    setMode('focus');
    setTimeLeft(FOCUS_TIME);
  };

  // --- CALCOLI PER LA UI ---
  // Calcoliamo la percentuale (da 0 a 100) per capire quando far cadere gli ingredienti
  const totalTime = mode === 'focus' ? FOCUS_TIME : SHORT_BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Formattazione per mostrare i minuti (es. 25:00)
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const formattedTime = `${minutes}:${seconds}`;

  return {
    timeLeft,
    formattedTime,
    status,
    mode,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
  };
};