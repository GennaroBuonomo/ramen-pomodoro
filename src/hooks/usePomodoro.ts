import { useState, useEffect } from 'react';
import { TimerMode, TimerStatus } from '../types';

// Definiamo i tempi in secondi per facilitare i calcoli
const FOCUS_TIMER = 25 * 60;
const SHORT_BREACK_TIME = 5 * 60;

export const usePomodoro = () => {
  const [timeleft, setTimeLeft] = useState(FOCUS_TIMER);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [mode, setMode] = useState<TimerMode>('focus');

  useEffect(() => {
    let intervall: number | undefined;

    // Se il timer è in esecuzione e c'è ancora tempo, decurta 1 secondo
    if (status === 'running' && timeLeft > 0) {
      intervall = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000);
    }
    // Se il tempo scade, fermiamo il timer (qui poi gestiremo il passaggio focus -> pausa)
    else if (timeLeft === 0) {
      setStatus('idle');
      // TODO: Gestire il cambio di modalità e i suoni
    }

    // Cleanup: puliamo l'intervallo per evitare memory leaks
    return () => clearInterval(intervall);
  }, [status, timerLeft]);
  
}