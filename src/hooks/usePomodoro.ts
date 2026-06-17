import { useState, useEffect } from 'react';
import { TimerMode, TimerStatus } from '../types';

// Definiamo i tempi in secondi per facilitare i calcoli
const FOCUS_TIMER = 25 * 60;
const SHORT_BREACK_TIME = 5 * 60;

export const usePomodoro = () => {
  const [timeleft, setTimeLeft] = useState(FOCUS_TIMER);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [mode, setMode] = useState<TimerMode>('focus')
}