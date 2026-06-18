import { useState, useEffect } from 'react';
import type { TimerMode, TimerStatus } from '../types';

const SHORT_BREAK_TIME = 5 * 60; 

// --- MAGIA AUDIO JAVASCRIPT ---
let audioCtx: AudioContext | null = null;
const unlockAudio = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
};

const playDing = () => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 1);
};
// -----------------------------

export const usePomodoro = () => {
  const [focusDuration, setFocusDuration] = useState(25 * 60); 
  const [completedBowls, setCompletedBowls] = useState(0);

  const [timeLeft, setTimeLeft] = useState(focusDuration);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [mode, setMode] = useState<TimerMode>('focus');

  // Caricamento dati salvati all'avvio
  useEffect(() => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('ramenStats');
    if (savedData) {
      const { date, count } = JSON.parse(savedData);
      if (date === today) {
        setCompletedBowls(count);
      }
    }
  }, []);

  // IL MOTORE PRINCIPALE (Aggiornato e corretto)
  useEffect(() => {
    let interval: number | undefined;

    if (status === 'running' && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } 
    // Assicuriamoci di scattare solo se siamo in modalità "running"
    else if (timeLeft === 0 && status === 'running') {
      
      // Avvolgiamo le modifiche di stato in un setTimeout per evitare i cascading renders
      setTimeout(() => {
        playDing();

        if (mode === 'focus') {
          // Uso dell'aggiornamento funzionale (prevCount) per evitare dipendenze errate
          setCompletedBowls((prevCount) => {
            const newCount = prevCount + 1;
            localStorage.setItem('ramenStats', JSON.stringify({ 
              date: new Date().toDateString(), 
              count: newCount 
            }));
            return newCount;
          });

          setMode('shortBreak');
          setTimeLeft(SHORT_BREAK_TIME);
          setStatus('idle');
        } else {
          setMode('focus');
          setTimeLeft(focusDuration);
          setStatus('idle');
        }
      }, 0); 
    }

    return () => clearInterval(interval);
  }, [status, timeLeft, mode, focusDuration]);

  // --- AZIONI DEL TIMER ---
  const startTimer = () => {
    unlockAudio();
    setStatus('running');
  };
  
  const pauseTimer = () => setStatus('paused');
  
  const resetTimer = () => {
    setStatus('idle');
    setMode('focus');
    setTimeLeft(focusDuration);
  };

  const changeDuration = (minutes: number) => {
    const newSeconds = minutes * 60;
    setFocusDuration(newSeconds);
    setTimeLeft(newSeconds);
    setStatus('idle');
    setMode('focus');
  };

  // --- CALCOLI PER LA UI ---
  const totalTime = mode === 'focus' ? focusDuration : SHORT_BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const formattedTime = `${minutes}:${seconds}`;

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
    completedBowls,
    startTimer,
    pauseTimer,
    resetTimer,
    changeDuration,
  };
};