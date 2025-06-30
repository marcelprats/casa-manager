import React, { useState } from "react";

export default function TaskForm({ onAdd, date }) {
  const [titol, setTitol] = useState("");
  const [descripcio, setDescripcio] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    onAdd({ titol, descripcio });
    setTitol("");
    setDescripcio("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
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
      <button type="submit">Afegir tasca</button>
    </form>
  );
}