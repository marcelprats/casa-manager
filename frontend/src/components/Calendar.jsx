import React from "react";

export default function CalendarBar({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  days,
  onSelectDay,
  selectedDay,
  daysWithTasks = new Set(), // NOVA PROP!
}) {
  const monthName = new Date(year, month).toLocaleString("ca", { month: "long" });
  return (
    <div>
      <div className="calendar-nav">
        <button onClick={onPrevMonth}>{"<"}</button>
        <span style={{ margin: "0 10px" }}>
          {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}
        </span>
        <button onClick={onNextMonth}>{">"}</button>
      </div>
      <div className="calendar-bar">
        {days.map(day => (
          <button
            key={day}
            className={[
              day === selectedDay ? "selected" : "",
              daysWithTasks.has(day) ? "has-task" : ""
            ].join(" ")}
            onClick={() => onSelectDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}