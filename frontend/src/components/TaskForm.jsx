// src/components/TaskForm.jsx
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import "./Form.css";

export default function TaskForm({ users, onAdd, date }) {
  const [titol, setTitol] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

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
    if (!titol || selectedUsers.length === 0) return;
    onAdd({
      titol,
      descripcio,
      usuaris_id: selectedUsers,
      data_inici: date,
      data_fi: date,
      periodicitat: "puntual"
    });
    setTitol("");
    setDescripcio("");
    setSelectedUsers([]);
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Nova Tasca</h2>
      </div>

      <div className="form-group">
        <label>Títol</label>
        <input
          type="text"
          value={titol}
          onChange={e => setTitol(e.target.value)}
          placeholder="Títol"
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Descripció</label>
        <input
          type="text"
          value={descripcio}
          onChange={e => setDescripcio(e.target.value)}
          placeholder="Descripció"
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
        <button type="submit" className="btn-primary">Afegir tasca</button>
      </div>
    </form>
  );}