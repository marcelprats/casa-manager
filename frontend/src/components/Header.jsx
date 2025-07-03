import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Hamburger({ open, onClick }) {
  return (
    <button
      className={`hamburger-btn${open ? " open" : ""}`}
      aria-label={open ? "Tancar menú" : "Obrir menú"}
      aria-expanded={open}
      onClick={onClick}
      type="button"
    >
      <span className="hamburger-box">
        <span className="hamburger-inner">
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </span>
      </span>
    </button>
  );
}

export default function Header({ users = [], selectedUser, onSelectUser, onAddUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();

  // Tanca el menú si canvies de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Tanca només si cliques fora del header
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (
        headerRef.current &&
        !headerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  function handleUserSelect(e) {
    const val = e.target.value;
    if (val === "__add__") onAddUser();
    else onSelectUser(val);
  }

  return (
    <header ref={headerRef}>
      <nav className="header-nav">
        <Link to="/" className="app-title" onClick={() => setMenuOpen(false)}>
          Casa Manager
        </Link>
        <Hamburger open={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
        <div className={`header-menu${menuOpen ? " open" : ""}`}>
          <Link
            to="/calendar"
            className={`header-link${location.pathname === "/calendar" ? " active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Calendari
          </Link>
          <Link
            to="/pendents"
            className={`header-link${location.pathname === "/pendents" ? " active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Tasques pendents
          </Link>
          {users.length === 0 ? (
            <button
              onClick={onAddUser}
              className="add-user-btn"
              type="button"
              style={{ marginTop: 12 }}
            >
              Afegir usuari
            </button>
          ) : (
            <div className="user-select-area">
              <select
                value={selectedUser || ""}
                onChange={handleUserSelect}
                className="user-select"
              >
                {users.map(u => (
                  <option value={u.id} key={u.id}>{u.nom}</option>
                ))}
                <option value="__add__" style={{ color: "#42b983", fontWeight: 600 }}>
                  ➕ Afegir usuari...
                </option>
              </select>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}