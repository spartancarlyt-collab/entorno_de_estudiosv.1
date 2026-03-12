import React, { useState } from 'react';
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
      <header className="app-header">
        <h1 className="app-title">Study Station</h1>
      </header>
      <main className="main-content">
        <PageComponent />
      </main>
      <nav className="mobile-menu">
        <div 
          className={`mobile-nav-item ${currentPage === 'notes' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('notes')}
        >
          <span>📝</span>
          <span>Notas</span>
        </div>
        <div 
          className={`mobile-nav-item ${currentPage === 'tasks' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('tasks')}
        >
          <span>✓</span>
          <span>Tareas</span>
        </div>
        <div 
          className={`mobile-nav-item ${currentPage === 'calendar' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('calendar')}
        >
          <span>📅</span>
          <span>Calendario</span>
        </div>
        <div 
          className={`mobile-nav-item ${currentPage === 'pomodoro' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('pomodoro')}
        >
          <span>🍅</span>
          <span>Pomodoro</span>
        </div>
      </nav>
    </>
  );
}

export default App;
