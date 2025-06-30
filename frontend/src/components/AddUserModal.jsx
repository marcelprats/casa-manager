import React, { useState, useRef } from "react";

export default function AddUserModal({ onAdd, onClose }) {
  const [nom, setNom] = useState("");
  const [dataNaixement, setDataNaixement] = useState("");
  const [error, setError] = useState("");
  const dateInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nom.trim()) {
      setError("El nom és obligatori.");
      return;
    }
    if (!dataNaixement) {
      setError("La data de naixement és obligatòria.");
      return;
    }
    setError("");
    onAdd({ nom: nom.trim(), data_naixement: dataNaixement });
    setNom("");
    setDataNaixement("");
  };

  // Quan es fa focus, intenta obrir el popup del navegador (si suportat)
  const handleDateFocus = () => {
    if (dateInputRef.current && dateInputRef.current.showPicker) {
      dateInputRef.current.showPicker();
    }
  };

  return (
    <div 
      className="modal-bg"
      style={{
        position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.3)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
      }}
      onClick={onClose}
    >
      <div
        className="modal"
        style={{
          background: "#fff",
          padding: "2em",
          borderRadius: "12px",
          minWidth: 300,
          boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
          position: "relative"
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{marginTop:0}}>Afegir usuari</h2>
        <form onSubmit={handleSubmit}>
          <label style={{display:"block", marginBottom:8}}>
            Nom:
            <input
              value={nom}
              onChange={e => setNom(e.target.value)}
              placeholder="Nom d'usuari"
              required
              autoFocus
              style={{display:"block", width:"100%", marginTop:4, marginBottom:16}}
            />
          </label>
          <label style={{display:"block", marginBottom:8}}>
            Data de naixement:
            <input
              type="date"
              value={dataNaixement}
              onChange={e => setDataNaixement(e.target.value)}
              required
              ref={dateInputRef}
              onFocus={handleDateFocus}
              style={{display:"block", width:"100%", marginTop:4, marginBottom:16, cursor:"pointer"}}
            />
          </label>
          {error && <div style={{color:"red", marginBottom:12}}>{error}</div>}
          <div className="modal-actions" style={{display:"flex", gap:12, justifyContent:"flex-end"}}>
            <button type="submit" style={{padding:"0.6em 1.5em"}}>Crear</button>
            <button type="button" onClick={onClose} style={{padding:"0.6em 1.5em"}}>Cancel·lar</button>
          </div>
        </form>
      </div>
    </div>
  );
}