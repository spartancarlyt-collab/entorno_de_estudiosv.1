import React, { useState, useEffect } from 'react';
import Notes from './pages/Notes';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Pomodoro from './pages/Pomodoro';

const pages = {
  notes: Notes,
  tasks: Tasks,
  calendar: Calendar,
  pomodoro: Pomodoro
};

function App() {
  const [currentPage, setCurrentPage] = useState('notes');

  const PageComponent = pages[currentPage];

  return (
    <>
      <nav className="sidebar">
        <div className="logo">
          <h1>Study Station</h1>
        </div>
        <div className={`nav-item ${currentPage === 'notes' ? 'active' : ''}`} onClick={() => setCurrentPage('notes')}>
          <span className="nav-icon">📝</span>
          <span>Notas</span>
        </div>
        <div className={`nav-item ${currentPage === 'tasks' ? 'active' : ''}`} onClick={() => setCurrentPage('tasks')}>
          <span className="nav-icon">✓</span>
          <span>Tareas</span>
        </div>
        <div className={`nav-item ${currentPage === 'calendar' ? 'active' : ''}`} onClick={() => setCurrentPage('calendar')}>
          <span className="nav-icon">📅</span>
          <span>Calendario</span>
        </div>
        <div className={`nav-item ${currentPage === 'pomodoro' ? 'active' : ''}`} onClick={() => setCurrentPage('pomodoro')}>
          <span className="nav-icon">🍅</span>
          <span>Pomodoro</span>
        </div>
      </nav>
      <main className="main-content">
        <PageComponent />
      </main>
    </>
  );
}

export default App;
