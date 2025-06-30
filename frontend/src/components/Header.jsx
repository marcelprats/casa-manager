import React from "react";
import { Link } from "react-router-dom";

export default function Header({ users = [], selectedUser, onSelectUser, onAddUser }) {
  return (
    <header>
      <nav>
        <div className="header-left">
          <span className="app-title">Casa Manager</span>
          <Link to="/calendar" className="header-link">Calendari</Link>
          <Link to="/pendents" className="header-link">Tasques pendents</Link>

        </div>
        <div className="user-select-area">
          {users.length === 0 ? (
            <button onClick={onAddUser}>Afegir usuari</button>
          ) : (
            <>
              <select
                value={selectedUser || ""}
                onChange={e => onSelectUser(e.target.value)}
                className="user-select"
              >
                {users.map(u => (
                  <option value={u.id} key={u.id}>{u.nom}</option>
                ))}
              </select>
              <button onClick={onAddUser} className="add-user-btn">Afegir usuari</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}