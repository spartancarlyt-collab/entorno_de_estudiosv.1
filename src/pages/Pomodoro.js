import React, { useState, useEffect, useRef } from 'react';

function Pomodoro() {
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState({ work: 0, break: 0 });
  const [longBreak, setLongBreak] = useState(false);
  const intervalRef = useRef(null);

  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;
  const LONG_BREAK_TIME = 15 * 60;

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    try {
      const savedSessions = localStorage.getItem('pomodoroSessions');
      if (savedSessions) setSessions(JSON.parse(savedSessions));
    } catch (e) {
      console.log('Sessions loaded from memory');
    }
  };

  const saveSessions = (newSessions) => {
    setSessions(newSessions);
    try {
      localStorage.setItem('pomodoroSessions', JSON.stringify(newSessions));
    } catch (e) {
      console.log('Saving to memory');
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === 'work') {
      const newSessions = { ...sessions, work: sessions.work + 1 };
      saveSessions(newSessions);
      
      if (sessions.work > 0 && sessions.work % 4 === 0) {
        setLongBreak(true);
        setMode('break');
        setTimeLeft(LONG_BREAK_TIME);
      } else {
        setMode('break');
        setTimeLeft(BREAK_TIME);
      }
    } else {
      setMode('work');
      setTimeLeft(WORK_TIME);
      setLongBreak(false);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? WORK_TIME : (longBreak ? LONG_BREAK_TIME : BREAK_TIME));
  };

  const setModeAndReset = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setLongBreak(false);
    if (newMode === 'work') {
      setTimeLeft(WORK_TIME);
    } else {
      setTimeLeft(BREAK_TIME);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeLabel = () => {
    if (mode === 'work') return 'Tiempo de trabajo';
    return longBreak ? 'Descanso largo' : 'Descanso corto';
  };

  const getProgress = () => {
    const totalTime = mode === 'work' ? WORK_TIME : (longBreak ? LONG_BREAK_TIME : BREAK_TIME);
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div>
      <h1 className="page-title">Pomodoro</h1>

      <div className="card">
        <div className="pomodoro-container">
          <div className="session-info">
            {getModeLabel()} • Sesión {sessions.work + 1}
          </div>

          <div className={`timer-display ${mode === 'break' ? 'break' : ''} ${!isRunning && timeLeft !== (mode === 'work' ? WORK_TIME : (longBreak ? LONG_BREAK_TIME : BREAK_TIME)) ? 'pause' : ''}`}>
            {formatTime(timeLeft)}
          </div>

          <div style={{ 
            width: '300px', 
            height: '6px', 
            background: 'var(--bg-tertiary)', 
            borderRadius: '3px',
            margin: '0 auto',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${getProgress()}%`, 
              height: '100%', 
              background: mode === 'work' ? 'var(--accent)' : 'var(--success)',
              transition: 'width 1s linear'
            }} />
          </div>

          <div className="timer-controls">
            <button className="btn btn-primary" onClick={toggleTimer} style={{ minWidth: '120px' }}>
              {isRunning ? 'Pausar' : 'Iniciar'}
            </button>
            <button className="btn btn-secondary" onClick={resetTimer}>
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '20px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Modo</h3>
          <div className="flex">
            <button 
              className={`btn ${mode === 'work' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setModeAndReset('work')}
            >
              Trabajo
            </button>
            <button 
              className={`btn ${mode === 'break' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setModeAndReset('break')}
            >
              Descanso
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Estadísticas</h3>
          <div className="grid-2">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent)' }}>
                {sessions.work}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Pomodoros</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--success)' }}>
                {sessions.break}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Descansos</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '12px' }}>Técnica Pomodoro</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          La Técnica Pomodoro es un método de gestión del tiempo que usa un temporizador para dividir el trabajo en intervalos de 25 minutos (pomodoros), separados por descansos de 5 minutos. Después de 4 pomodoros, toma un descanso más largo de 15-30 minutos.
        </p>
      </div>
    </div>
  );
}

export default Pomodoro;
