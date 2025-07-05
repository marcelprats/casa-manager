// src/components/TaskDetail.jsx
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUser
} from "react-icons/fa";
import "./TaskDetail.css";

export default function TaskDetail({ taskId, onClose, fetchTask, users }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!taskId) return;
    setLoading(true);
    setError("");
    fetchTask(taskId)
      .then(data => setTask(data))
      .catch(() => setError("No s'ha pogut carregar la tasca."))
      .finally(() => setLoading(false));
  }, [taskId, fetchTask]);

  if (!taskId) return null;

  const handleOverlayClick = () => onClose();
  const stopPropagation = e => e.stopPropagation();

  if (loading) return (
    <div className="task-detail-modal" onClick={handleOverlayClick}>
      <div className="task-detail-card loading" onClick={stopPropagation}>
        <div className="spinner" />
        <span>Carregant...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="task-detail-modal" onClick={handleOverlayClick}>
      <div className="task-detail-card error" onClick={stopPropagation}>
        <FaTimesCircle size={48} color="#e74c3c"/>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!task) return null;

  const getUserName = id => users?.find(u => u.id === id)?.nom || id;

  return (
    <div className="task-detail-modal" onClick={handleOverlayClick}>
      <div className="task-detail-card" onClick={stopPropagation}>
        <header className="task-detail-header">
          <h2>{task.titol}</h2>
          <div className="header-actions">
            <span className={`badge ${task.feta ? "done" : "pending"}`}>
              {task.feta
                ? <><FaCheckCircle /> Feta</>
                : <><FaClock /> Pendent</>
              }
            </span>
            {!task.feta && (
              <button
                className="task-detail-close-btn"
                onClick={e => { e.stopPropagation(); onClose(); }}
                aria-label="Tancar"
              >
                <FaTimesCircle />
              </button>
            )}
          </div>
        </header>

        <section className="task-detail-meta">
          <div>
            <FaCalendarAlt /> <b>Inici:</b>{" "}
            {task.data_inici
              ? new Date(task.data_inici).toLocaleDateString("ca-ES")
              : "-"}
          </div>
          <div>
            <FaCalendarAlt /> <b>Fi:</b>{" "}
            {task.data_fi
              ? new Date(task.data_fi).toLocaleDateString("ca-ES")
              : "-"}
          </div>
          <div>
            <FaSyncAlt /> <b>Periodicitat:</b>{" "}
            {task.periodicitat || "-"}
          </div>
        </section>

        <section className="task-detail-desc">
          {task.descripcio || <em>No hi ha descripció.</em>}
        </section>

        <section className="task-detail-users">
          <h3><FaUser /> Usuaris assignats</h3>
          <ul>
            {task.usuaris_id?.length
              ? task.usuaris_id.map(id => (
                  <li key={id} className="user-chip">
                    {getUserName(id)}
                  </li>
                ))
              : <li className="user-chip empty">Cap</li>
            }
          </ul>
        </section>
      </div>
    </div>
  );
}
