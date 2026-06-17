import { usePomodoro } from './hooks/usePomodoro';
import { RamenBowl } from './components/Visual/RamenBowl';
import './App.css'; 

function App() {
  // 1. Estraiamo tutto ciò che ci serve dal nostro Hook
  const { 
    formattedTime, 
    progress, 
    status, 
    mode,
    startTimer, 
    pauseTimer, 
    resetTimer 
  } = usePomodoro();

  return (
    <div className="app-container">
      <header>
        <h1>🍜 Ramen Pomodoro</h1>
        <p>Concentrati e riempi la ciotola</p>
      </header>
      
      {/* 2. Il display numerico del tempo */}
      <div className="timer-display">
        {formattedTime}
      </div>

      {/* 3. Il nostro componente visivo a cui passiamo la percentuale */}
      <RamenBowl progress={progress} />

      {/* 4. I pulsanti per controllare il timer */}
      <div className="controls">
        {status !== 'running' ? (
          <button className="btn btn-primary" onClick={startTimer}>
            {status === 'paused' 
              ? 'Riprendi' 
              : mode === 'focus' ? 'Inizia Focus' : 'Inizia Pausa'}
          </button>
        ) : (
          <button className="btn btn-warning" onClick={pauseTimer}>
            Sospendi
          </button>
        )}
        <button className="btn btn-danger" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
