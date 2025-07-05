// src/pages/CalendarPage.jsx
import React, { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import CalendarBar from "../components/Calendar";
import Modal from "../components/Modal";
import TaskForm from "../components/TaskForm";
import EditTaskForm from "../components/EditTaskForm";
import TaskDetail from "../components/TaskDetail";
import { fetchTasks, fetchTask, addTask, updateTask, deleteTask } from "../api";
import "./CalendarPage.css";

// Genera una llista de dies del mes
function getDaysInMonth(year, month) {
  return Array.from(
    { length: new Date(year, month + 1, 0).getDate() },
    (_, i) => i + 1
  );
}

export default function CalendarPage({ selectedUser, users }) {
  const today = new Date();
  const [tasks, setTasks] = useState([]);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [editingTask, setEditingTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState(null);

  useEffect(() => {
    (async () => setTasks(await fetchTasks()))();
  }, [year, month]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else {
      setMonth(m => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else {
      setMonth(m => m + 1);
    }
    setSelectedDay(1);
  };

  const days = getDaysInMonth(year, month);
  const daysWithTasks = new Set(
    tasks
      .filter(t => {
        const d = new Date(t.data_inici);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .map(t => new Date(t.data_inici).getDate())
  );

  const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    selectedDay
  ).padStart(2, "0")}`;
  const todaysTasks = tasks.filter(t => t.data_inici === dateString);

  const handleAdd = async data => {
    await addTask({
      ...data,
      data_inici: dateString,
      data_fi: dateString,
      periodicitat: "puntual",
      usuari_id: selectedUser
    });
    setTasks(await fetchTasks());
    setShowCreate(false);
  };

  const handleSave = async updated => {
    await updateTask(updated.id, updated);
    setEditingTask(null);
    setTasks(await fetchTasks());
  };

  const handleDone = async task => {
    await deleteTask(task.id);
    setTasks(await fetchTasks());
  };

  return (
    <div className="main-container">
      {/* Resum */}
      <section className="dashboard-wrap">
        <Dashboard tasks={todaysTasks} />
      </section>

      {/* Títol */}
      <header className="header-bar">
        <h1>Calendari</h1>
      </header>

      {/* Calendari */}
      <section className="calendar-wrapper">
        <CalendarBar
          year={year}
          month={month}
          days={days}
          daysWithTasks={daysWithTasks}
          selectedDay={selectedDay}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectDay={setSelectedDay}
        />
        <div className="calendar-footer">
          <button
            className="new-task-btn"
            onClick={() => setShowCreate(true)}
          >
            + Nova Tasca
          </button>
        </div>
      </section>

      {/* Modal Crear */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <TaskForm
            users={users}
            date={dateString}
            onAdd={handleAdd}
          />
        </Modal>
      )}

      {/* Tasques */}
      <section className="tasks-section">
        <h2>
          Tasques del dia {selectedDay}/{month + 1}/{year}
        </h2>
        <ul className="task-list">
          {todaysTasks.length ? (
            todaysTasks.map(task => (
              <li
                key={task.id}
                className={`task-item ${task.feta ? "done" : ""}`}
                onClick={() => setDetailTaskId(task.id)}
              >
                <div className="task-content">
                  <p className="task-title">{task.titol}</p>
                  <p className="task-date">{task.data_inici}</p>
                </div>
                <div className="actions">
                  {!task.feta && (
                    <button
                      className="btn-secondary"
                      onClick={e => { e.stopPropagation(); setEditingTask(task); }}
                    >
                      Edita
                    </button>
                  )}
                  <button
                    className="btn-secondary"
                    onClick={e => { e.stopPropagation(); handleDone(task); }}
                  >
                    Feta
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="empty">Cap tasca per aquest dia</li>
          )}
        </ul>
      </section>

      {/* Modal Editar */}
      {editingTask && (
        <Modal onClose={() => setEditingTask(null)}>
          <EditTaskForm
            users={users}
            task={editingTask}
            onSave={handleSave}
            onCancel={() => setEditingTask(null)}
          />
        </Modal>
      )}

      {/* Modal Detall */}
      {detailTaskId && (
        <Modal onClose={() => setDetailTaskId(null)}>
          <TaskDetail
            taskId={detailTaskId}
            onClose={() => setDetailTaskId(null)}
            fetchTask={fetchTask}
            users={users}
          />
        </Modal>
      )}
    </div>
  );
}
