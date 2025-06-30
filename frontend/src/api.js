export async function fetchTasks() {
  const res = await fetch("http://localhost:8000/tasks/");
  return res.json();
}

export async function addTask(task) {
  const res = await fetch("http://localhost:8000/tasks/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function updateTask(id, task) {
  const res = await fetch(`http://localhost:8000/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`http://localhost:8000/tasks/${id}`, {
    method: "DELETE"
  });
  return res.json();
}


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