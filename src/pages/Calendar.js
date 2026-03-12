import React, { useState, useEffect } from 'react';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('09:00');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    try {
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) setEvents(JSON.parse(savedEvents));
    } catch (e) {
      console.log('Events loaded from memory');
    }
  };

  const saveEvents = (newEvents) => {
    setEvents(newEvents);
    try {
      localStorage.setItem('events', JSON.stringify(newEvents));
    } catch (e) {
      console.log('Saving to memory');
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDay; i++) {
      const prevDate = new Date(year, month, -startingDay + i + 1);
      days.push({ date: prevDate, isOtherMonth: true });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isOtherMonth: false });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isOtherMonth: true });
    }

    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const getEventsForDate = (date) => {
    return events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    }).sort((a, b) => a.time.localeCompare(b.time));
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const addEvent = () => {
    if (!eventTitle.trim()) return;

    const newEvent = {
      id: Date.now(),
      title: eventTitle,
      time: eventTime,
      date: formatDateKey(selectedDate)
    };

    saveEvents([...events, newEvent]);
    setEventTitle('');
    setEventTime('09:00');
    setShowModal(false);
  };

  const deleteEvent = (id) => {
    const newEvents = events.filter(e => e.id !== id);
    saveEvents(newEvents);
  };

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const days = getDaysInMonth(currentDate);
  const selectedEvents = getEventsForDate(selectedDate);

  return (
    <div>
      <h1 className="page-title">Calendario</h1>

      <div className="grid-2">
        <div className="card">
          <div className="calendar-header">
            <button className="btn btn-secondary" onClick={prevMonth}>&lt;</button>
            <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <button className="btn btn-secondary" onClick={nextMonth}>&gt;</button>
          </div>

          <div className="grid-4">
            {dayNames.map(day => (
              <div key={day} style={{ textAlign: 'center', padding: '8px', color: 'var(--text-secondary)' }}>
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${isToday(day.date) ? 'today' : ''} ${isSelected(day.date) ? 'selected' : ''} ${day.isOtherMonth ? 'other-month' : ''}`}
                onClick={() => setSelectedDate(day.date)}
              >
                {day.date.getDate()}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex-between">
            <h2>{selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Evento</button>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px' }}>
              <p>No hay eventos para este día</p>
            </div>
          ) : (
            selectedEvents.map(event => (
              <div key={event.id} className="event-item flex-between">
                <div>
                  <strong>{event.time}</strong> - {event.title}
                </div>
                <button 
                  className="btn btn-danger" 
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                  onClick={() => deleteEvent(event.id)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Nuevo Evento</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <input
              className="input"
              placeholder="Título del evento"
              value={eventTitle}
              onChange={e => setEventTitle(e.target.value)}
            />
            <input
              className="input"
              type="time"
              value={eventTime}
              onChange={e => setEventTime(e.target.value)}
            />
            <div className="flex">
              <button className="btn btn-primary" onClick={addEvent}>Crear</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
