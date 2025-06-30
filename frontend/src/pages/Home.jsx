import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="main-container" style={{ textAlign: "center" }}>
      <h1>Benvingut a Casa Manager</h1>
      <p>Gestiona les teves tasques familiars fàcilment!</p>
      <Link to="/calendar">
        <button>Ves al calendari</button>
      </Link>
    </div>
  );
}