import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import TaskForm from "../components/TaskForm";
import EditTaskForm from "../components/EditTaskForm";
import CalendarBar from "../components/Calendar";
import { fetchTasks, addTask, updateTask, deleteTask } from "../api"; // <-- aquí deleteTask

function getDaysInMonth(year, month) {
  return Array.from(
    { length: new Date(year, month + 1, 0).getDate() },
    (_, i) => i + 1
  );
}

export default function CalendarPage() {
  const today = new Date();
  const [tasks, setTasks] = useState([]);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
    setSelectedDay(1);
  };

  const days = getDaysInMonth(year, month);

  const daysWithTasks = new Set(
    tasks
        .filter(t => {
        // Ajusta el camp segons la teva api, aquí uso 'data_inici'
        const d = new Date(t.data_inici);
        return d.getFullYear() === year && d.getMonth() === month;
        })
        .map(t => new Date(t.data_inici).getDate())
  );

  const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;

  const todaysTasks = tasks.filter(t => t.data_inici === dateString);

  // Add, edit, done functions igual que abans
  const handleAdd = async (task) => {
    await addTask({
      ...task,
      data_inici: dateString,
      data_fi: dateString,
      periodicitat: "puntual",
      usuari_id: 1
    });
    setTasks(await fetchTasks());
  };

  const handleEdit = (task) => setEditingTask(task);

  const handleDelete = async (task) => {
    await deleteTask(task.id);
    setTasks(await fetchTasks());
  };

  const handleEditSave = async (edited) => {
    await updateTask(edited.id, edited);
    setEditingTask(null);
    setTasks(await fetchTasks());
  };

  return (
    <div className="main-container">
      <Dashboard tasks={todaysTasks} />
      <h1>Calendari</h1>
      <CalendarBar
        year={year}
        month={month}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        days={days}
        onSelectDay={setSelectedDay}
        selectedDay={selectedDay}
        daysWithTasks={daysWithTasks}
      />
      <TaskForm onAdd={handleAdd} date={dateString} />
      <ul className="task-list">
        {todaysTasks.map(t =>
          <li key={t.id} style={{ textDecoration: t.feta ? "line-through" : "" }}>
            {editingTask?.id === t.id ? (
              <EditTaskForm
                task={editingTask}
                onSave={handleEditSave}
                onCancel={() => setEditingTask(null)}
              />
            ) : (
              <>
                <span><b>{t.titol}</b> — {t.descripcio}</span>
                <span style={{ fontSize: "0.9em", color: "#888" }}>{t.data_inici}</span>
                <span className="actions">
                  {!t.feta && (
                    <>
                      <button onClick={() => handleEdit(t)}>Edita</button>
                    </>
                  )}
                  <button onClick={() => handleDelete(t)} title="Elimina">Feta</button>
                </span>
              </>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}