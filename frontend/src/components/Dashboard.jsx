import React from "react";

export default function Dashboard({ tasks }) {
  const pending = tasks.filter(t => !t.completed).length;
  const total = tasks.length;
  return (
    <div className="dashboard">
      <h2>Resum de tasques</h2>
      <p>Total tasques: <b>{total}</b></p>
      <p>Pendents: <b>{pending}</b></p>
    </div>
  );
}