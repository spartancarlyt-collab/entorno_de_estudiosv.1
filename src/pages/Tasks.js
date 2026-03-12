import React, { useState, useEffect } from 'react';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } catch (e) {
      console.log('Tasks loaded from memory');
    }
  };

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    try {
      localStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (e) {
      console.log('Saving to memory');
    }
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString()
    };

    saveTasks([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    const newTasks = tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTasks(newTasks);
  };

  const deleteTask = (id) => {
    const newTasks = tasks.filter(t => t.id !== id);
    saveTasks(newTasks);
  };

  const clearCompleted = () => {
    const newTasks = tasks.filter(t => !t.completed);
    saveTasks(newTasks);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div>
      <div className="flex-between">
        <h1 className="page-title">Tareas</h1>
      </div>

      <div className="card">
        <div className="flex">
          <input
            className="input"
            placeholder="Nueva tarea..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && addTask()}
            style={{ marginBottom: 0 }}
          />
          <button className="btn btn-primary" onClick={addTask}>Agregar</button>
        </div>
      </div>

      <div className="flex-between" style={{ margin: '16px 0' }}>
        <div className="flex">
          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            Todas ({tasks.length})
          </button>
          <button 
            className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('active')}
          >
            Pendientes ({activeCount})
          </button>
          <button 
            className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('completed')}
          >
            Completadas ({completedCount})
          </button>
        </div>
        {completedCount > 0 && (
          <button className="btn btn-danger" onClick={clearCompleted}>
            Limpiar completadas
          </button>
        )}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>No hay tareas {filter === 'active' ? 'pendientes' : filter === 'completed' ? 'completadas' : ''}</p>
        </div>
      ) : (
        filteredTasks.map(task => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              className="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span className="task-text">{task.text}</span>
            <button 
              className="btn btn-danger" 
              style={{ marginLeft: 'auto', padding: '6px 12px' }}
              onClick={() => deleteTask(task.id)}
            >
              Eliminar
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Tasks;
