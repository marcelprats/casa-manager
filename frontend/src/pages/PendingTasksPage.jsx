import React, { useEffect, useState } from "react";
import { fetchTasks } from "../api";
import "./PendingTasksPage.css";

function groupTasksByMonthAndDay(tasks) {
  const grouped = {};
  tasks.forEach(task => {
    const d = task.data_fi ? new Date(task.data_fi) : null;
    if (!d) return;
    const monthKey = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
    const dayKey = d.toISOString().split("T")[0];
    if (!grouped[monthKey]) grouped[monthKey] = {};
    if (!grouped[monthKey][dayKey]) grouped[monthKey][dayKey] = [];
    grouped[monthKey][dayKey].push(task);
  });
  return grouped;
}

function formatMonth(monthKey) {
  const [year, month] = monthKey.split("-");
  return new Date(`${year}-${month}-01`).toLocaleDateString("ca-ES", {
    month: "long",
    year: "numeric",
  }).toUpperCase();
}

function formatDay(dateStr) {
  if (!dateStr) return { day: "", short: "", month: "" };
  const date = new Date(dateStr);
  return {
    day: date.getDate(),
    short: date.toLocaleDateString("ca-ES", { weekday: "short" }),
    month: date.toLocaleDateString("ca-ES", { month: "short", year: "numeric" }),
  };
}

export default function PendingTasksCalendarList() {
  const [groupedTasks, setGroupedTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks()
      .then(tasks => {
        const tasques = Array.isArray(tasks) ? tasks : tasks.tasks || [];
        const pendents = tasques
          .filter(t => t.feta === false)
          .sort((a, b) =>
            a.data_fi && b.data_fi
              ? new Date(a.data_fi) - new Date(b.data_fi)
              : 0
          );
        setGroupedTasks(groupTasksByMonthAndDay(pendents));
      })
      .catch(() => setError("No s'han pogut carregar les tasques."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pending-tasks-container"><p>Carregant...</p></div>;
  if (error) return <div className="pending-tasks-container"><div style={{ color: "red" }}>{error}</div></div>;

  const sortedMonths = Object.keys(groupedTasks).sort();

  return (
    <div className="pending-tasks-calendar-container no-bg">
      {sortedMonths.length === 0 ? (
        <div className="pending-empty">No tens cap tasca pendent! 🎉</div>
      ) : (
        <div className="calendar-list">
          {sortedMonths.map(monthKey => (
            <div key={monthKey}>
              <div className="calendar-header">{formatMonth(monthKey)}</div>
              {Object.keys(groupedTasks[monthKey]).sort().map(dayKey => {
                const { day, short } = formatDay(dayKey);
                return (
                  <div key={dayKey} className="calendar-day-row">
                    <div className="calendar-day-info">
                      <div className="calendar-day-number">{day}</div>
                      <div className="calendar-day-short">{short}</div>
                    </div>
                    <div className="calendar-tasks-list">
                      {groupedTasks[monthKey][dayKey].map(t => (
                        <div key={t.id} className="calendar-task-card">
                          <div className="calendar-task-title">{t.titol}</div>
                          {t.data_fi && (
                            <span className="calendar-task-time">
                              {t.data_fi.length > 10
                                ? new Date(t.data_fi).toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" })
                                : ""}
                            </span>
                          )}
                          <div className="calendar-task-desc">{t.descripcio}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}