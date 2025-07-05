import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import "./Form.css";

export default function EditTaskForm({ users, task, onSave, onCancel }) {
  const [titol, setTitol] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (!task) return;
    setTitol(task.titol);
    setDescripcio(task.descripcio);
    setSelectedUsers(task.usuaris_id || []);
  }, [task]);

  const availableUsers = users.filter(u => !selectedUsers.includes(u.id));

  const handleAddUser = e => {
    const id = Number(e.target.value);
    if (id && !selectedUsers.includes(id)) {
      setSelectedUsers([...selectedUsers, id]);
    }
    e.target.value = "";
  };

  const handleRemoveUser = id => {
    setSelectedUsers(selectedUsers.filter(u => u !== id));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      ...task,
      titol,
      descripcio,
      usuaris_id: selectedUsers
    });
  };

  if (!task) return null;

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Edita Tasca</h2>
        <button type="button" className="btn-close" onClick={onCancel} title="Tancar">✕</button>
      </div>

      <div className="form-group">
        <label>Títol</label>
        <input
          type="text"
          value={titol}
          onChange={e => setTitol(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Descripció</label>
        <textarea
          value={descripcio}
          onChange={e => setDescripcio(e.target.value)}
          rows={3}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label><FaUser /> Usuaris assignats</label>
        <ul className="user-assign-list">
          {selectedUsers.length > 0
            ? selectedUsers.map(id => {
                const u = users.find(x => x.id === id);
                return (
                  <li key={id} className="user-chip">
                    {u?.nom}
                    <button
                      type="button"
                      className="user-remove-btn"
                      onClick={() => handleRemoveUser(id)}
                      title="Elimina"
                    >
                      ✕
                    </button>
                  </li>
                );
              })
            : <li className="user-chip empty">Cap usuari assignat</li>
          }
        </ul>
      </div>

      {availableUsers.length > 0 && (
        <div className="form-group">
          <label>Afegir usuari</label>
          <select onChange={handleAddUser} defaultValue="" className="form-input">
            <option value="" disabled>Selecciona...</option>
            {availableUsers.map(u => (
              <option key={u.id} value={u.id}>{u.nom}</option>
            ))}
          </select>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn-primary">Desar</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel·la</button>
      </div>
    </form>);
}
