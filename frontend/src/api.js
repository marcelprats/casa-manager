// TASKS
export async function fetchTasks() {
  const res = await fetch("http://localhost:8000/tasks/");
  if (!res.ok) throw new Error("No es poden obtenir les tasques");
  return res.json();
}

export async function fetchTask(id) {
  const res = await fetch(`http://localhost:8000/tasks/${id}`);
  if (!res.ok) throw new Error("No s'ha pogut carregar la tasca");
  return await res.json();
}

export async function addTask(task) {
  // Si no especifiques 'feta', la backend la posarà a false per defecte!
  const res = await fetch("http://localhost:8000/tasks/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error("No s'ha pogut crear la tasca");
  return res.json();
}

export async function updateTask(id, updates) {
  // 'updates' pot ser { feta: true }, { titol: "...", ... }
  const res = await fetch(`http://localhost:8000/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error("No s'ha pogut actualitzar la tasca");
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`http://localhost:8000/tasks/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("No s'ha pogut eliminar la tasca");
  return res.json();
}

// USERS
export async function fetchUsers() {
  const res = await fetch("http://localhost:8000/users/");
  if (!res.ok) throw new Error("No es poden obtenir usuaris");
  return res.json();
}

export async function addUser(user) {
  const res = await fetch("http://localhost:8000/users/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error("No s'ha pogut crear l'usuari");
  return res.json();
}

export async function updateUser(id, updates) {
  const res = await fetch(`http://localhost:8000/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error("No s'ha pogut actualitzar l'usuari");
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`http://localhost:8000/users/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("No s'ha pogut eliminar l'usuari");
  return res.json();
}