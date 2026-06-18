import { usePomodoro } from './hooks/usePomodoro';
import { RamenBowl } from './components/Visual/RamenBowl';
import './App.css'; 

function App() {
  const { 
    formattedTime, 
    progress, 
    status, 
    mode,
    completedBowls,
    changeDuration,
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

      {/* NUOVO: Statistiche del giorno */}
      <div className="stats-badge">
        Ramen serviti oggi: <strong>{completedBowls}</strong>
      </div>
      
      <div className="timer-display">
        {formattedTime}
      </div>

      {/* Selettori del tempo (visibili solo quando il timer è fermo in modalità focus) */}
      {status === 'idle' && mode === 'focus' && (
        <div className="duration-selector">

          {/* PULSANTE DI TEST (0.05 minuti = 3 secondi) */}
          <button className="btn-time" onClick={() => changeDuration(0.20)}>Test (12s)</button>

          <button className="btn-time" onClick={() => changeDuration(15)}>15 min</button>
          <button className="btn-time" onClick={() => changeDuration(25)}>25 min</button>
          <button className="btn-time" onClick={() => changeDuration(45)}>45 min</button>
        </div>
      )}

      <RamenBowl progress={progress} />

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