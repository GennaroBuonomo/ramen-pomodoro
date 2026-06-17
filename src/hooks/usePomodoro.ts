import { useState, useEffect } from 'react';
import type { TimerMode, TimerStatus } from '../types';

const FOCUS_TIME = 3; // <-- 3 secondi per test
const SHORT_BREAK_TIME = 5 * 60;

// --- MAGIA AUDIO JAVASCRIPT ---
// Niente più file MP3 o link esterni. Generiamo il suono direttamente nel browser!
let audioCtx: AudioContext | null = null;

// Funzione per aggirare il blocco del browser inizializzando l'audio al click
const unlockAudio = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

// Funzione che "suona" un rintocco morbido
const playDing = () => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = 'sine'; // Crea un'onda sonora morbida (tipo campana)
  osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Nota "La"

  // Effetto "Fade Out": il volume parte a 0.5 e sfuma a 0 in 1 secondo
  gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 1);
};
// -----------------------------

export const usePomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [mode, setMode] = useState<TimerMode>('focus');

  useEffect(() => {
    let interval: number | undefined;

    if (status === 'running' && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } 
    else if (timeLeft === 0) {
      // 1. Facciamo suonare il nostro campanello digitale!
      playDing();

      if (mode === 'focus') {
        setMode('shortBreak');
        setTimeLeft(SHORT_BREAK_TIME);
        setStatus('idle');
      } else {
        setMode('focus');
        setTimeLeft(FOCUS_TIME);
        setStatus('idle');
      }
    }

    return () => clearInterval(interval);
  }, [status, timeLeft, mode]);

  // --- AZIONI DEL TIMER ---
  const startTimer = () => {
    // 2. Sblocchiamo il motore audio nel momento in cui l'utente clicca "Inizia"
    unlockAudio();
    setStatus('running');
  };
  
  const pauseTimer = () => setStatus('paused');
  
  const resetTimer = () => {
    setStatus('idle');
    setMode('focus');
    setTimeLeft(FOCUS_TIME);
  };

  const totalTime = mode === 'focus' ? FOCUS_TIME : SHORT_BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const formattedTime = `${minutes}:${seconds}`;

  // --- AGGIORNAMENTO TITOLO TAB BROWSER ---
  useEffect(() => {
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