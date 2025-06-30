import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AddUserModal from "./components/AddUserModal";
import Home from "./pages/Home";
import CalendarPage from "./pages/CalendarPage";
import PendingTasksPage from "./pages/PendingTasksPage";
import { fetchUsers, addUser } from "./api";

export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  // Carrega usuaris al muntar
  useEffect(() => {
    fetchUsers().then(us => {
      setUsers(us);
      if (us.length && !selectedUser) setSelectedUser(us[0].id);
    });
    // eslint-disable-next-line
  }, []);

  // Handler per afegir usuari
  const handleAddUser = async (user) => {
    const nouUsuari = await addUser(user);
    const usuaris = await fetchUsers();
    setUsers(usuaris);
    setSelectedUser(nouUsuari.id);
    setShowAddUser(false);
  };

  return (
    <BrowserRouter>
      <Header
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        onAddUser={() => setShowAddUser(true)}
      />
      {showAddUser && (
        <AddUserModal
          onAdd={handleAddUser}
          onClose={() => setShowAddUser(false)}
        />
      )}

      <main style={{ flex: 1, width: "100%" }}>
        {users.length === 0 ? (
          <div style={{
            margin: "70px auto 0",
            maxWidth: 380,
            textAlign: "center",
            fontSize: "1.3em",
            color: "#888"
          }}>
            <p>Benvingut! Per començar, afegeix un usuari.</p>
            <button
              style={{
                margin: "24px auto 0",
                fontSize: "1.1em",
                padding: "0.6em 1.5em"
              }}
              onClick={() => setShowAddUser(true)}
            >
              Afegir usuari
            </button>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home selectedUser={selectedUser} />} />
            <Route
              path="/calendar"
              element={<CalendarPage selectedUser={selectedUser} />}/>

            <Route path="/pendents" element={<PendingTasksPage />} />

          </Routes>
        )}
      </main>
    </BrowserRouter>
  );
}