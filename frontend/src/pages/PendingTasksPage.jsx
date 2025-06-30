import React, { useEffect, useState } from "react";
import { fetchTasks } from "../api";
import "./PendingTasksPage.css";

export default function PendingTasksPage() {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks()
      .then(tasks => {
        // Ajusta segons el format real de la resposta!
        const tasques = Array.isArray(tasks) ? tasks : tasks.tasks || [];
        const pendents = tasques
          .filter(t => t.completada === false)
          .sort((a, b) =>
            a.data_limit && b.data_limit
              ? new Date(a.data_limit) - new Date(b.data_limit)
              : 0
          );
        setPendingTasks(pendents);
      })
      .catch(err => {
        setError("No s'han pogut carregar les tasques.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pending-tasks-container">
      <h1>Tasques pendents</h1>
      {loading ? (
        <p>Carregant...</p>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : pendingTasks.length === 0 ? (
        <div className="pending-empty">No tens cap tasca pendent! 🎉</div>
      ) : (
        <ul className="pending-tasks-list">
          {pendingTasks.map(t => (
            <li key={t.id} className="pending-task-item">
              <div className="pending-task-title">
                {t.nom}
                {t.data_limit && (
                  <span className="pending-task-date">
                    Fins: {t.data_limit}
                  </span>
                )}
              </div>
              <div className="pending-task-desc">{t.descripcio}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}