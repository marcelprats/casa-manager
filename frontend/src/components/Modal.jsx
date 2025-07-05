import React from "react";
import "./Form.css"; 

export default function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
