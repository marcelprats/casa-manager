import React, { useState } from "react";

export default function EditTaskForm({ task, onSave, onCancel }) {
  const [titol, setTitol] = useState(task.titol);
  const [descripcio, setDescripcio] = useState(task.descripcio);
  const [data_inici, setDataInici] = useState(task.data_inici);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ ...task, titol, descripcio, data_inici, data_fi: data_inici });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} style={{ marginBottom: 0 }}>
      <input
        value={titol}
        onChange={e => setTitol(e.target.value)}
        placeholder="Títol tasca"
        required
      />
      <input
        value={descripcio}
        onChange={e => setDescripcio(e.target.value)}
        placeholder="Descripció"
      />
      <input
        type="date"
        value={data_inici}
        onChange={e => setDataInici(e.target.value)}
        style={{ maxWidth: 140 }}
      />
      <button type="submit">Desa</button>
      <button type="button" onClick={onCancel} style={{ background: "#eee", color: "#333" }}>
        Cancel·la
      </button>
    </form>
  );
}