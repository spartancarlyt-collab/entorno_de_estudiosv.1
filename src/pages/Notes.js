import React, { useState, useEffect } from 'react';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    try {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch (e) {
      console.log('Notes loaded from memory');
    }
  };

  const saveNotes = (newNotes) => {
    setNotes(newNotes);
    try {
      localStorage.setItem('notes', JSON.stringify(newNotes));
    } catch (e) {
      console.log('Saving to memory');
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    const newNote = {
      id: editingNote ? editingNote.id : Date.now(),
      title,
      content,
      updatedAt: new Date().toISOString()
    };

    let newNotes;
    if (editingNote) {
      newNotes = notes.map(n => n.id === editingNote.id ? newNote : n);
    } else {
      newNotes = [newNote, ...notes];
    }

    saveNotes(newNotes);
    closeModal();
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(n => n.id !== id);
    saveNotes(newNotes);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex-between">
        <h1 className="page-title">Notas</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nueva Nota
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <p>No hay notas aún. Crea tu primera nota!</p>
        </div>
      ) : (
        <div className="grid-3">
          {notes.map(note => (
            <div key={note.id} className="note-card" onClick={() => openEdit(note)}>
              <div className="note-title">{note.title}</div>
              <div className="note-preview">{note.content || 'Sin contenido'}</div>
              <div className="note-date">{formatDate(note.updatedAt)}</div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingNote ? 'Editar Nota' : 'Nueva Nota'}</h2>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <input
              className="input"
              placeholder="Título de la nota"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              className="input"
              placeholder="Contenido de la nota..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={8}
            />
            <div className="flex">
              <button className="btn btn-primary" onClick={handleSave}>
                {editingNote ? 'Guardar' : 'Crear'}
              </button>
              {editingNote && (
                <button className="btn btn-danger" onClick={() => { deleteNote(editingNote.id); closeModal(); }}>
                  Eliminar
                </button>
              )}
              <button className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
