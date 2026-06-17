import { useState, useEffect } from 'react';
import type { TimerMode, TimerStatus } from '../types';

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
    // Se il tempo scade, gestiamo il cambio di ciclo
    else if (timeLeft === 0) {
      if (mode === 'focus') {
        // Finito il lavoro -> Passiamo alla pausa breve
        setMode('shortBreak');
        setTimeLeft(SHORT_BREAK_TIME);
        setStatus('idle'); // Ci fermiamo in attesa che l'utente avvii la pausa
      } else {
        // Finita la pausa -> Si torna al lavoro
        setMode('focus');
        setTimeLeft(FOCUS_TIME);
        setStatus('idle');
      }
    }

    // Cleanup: puliamo l'intervallo per evitare memory leaks
    return () => clearInterval(interval);
  }, [status, timeLeft, mode]); // Aggiunto 'mode' alle dipendenze per sicurezza

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

  // --- AGGIORNAMENTO TITOLO TAB BROWSER ---
  useEffect(() => {
    // Se il timer sta girando o è in pausa, mostriamo il tempo. Altrimenti il titolo standard.
    if (status !== 'idle') {
      document.title = `${formattedTime} - Ramen Pomodoro`;
    } else {
      document.title = 'Ramen Pomodoro 🍜';
    }
  }, [formattedTime, status]);

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