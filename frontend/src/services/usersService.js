

//  Si NO hay usuarios en localStorage, creamos una base inicial:
const defaultUsers = [
  { id: 1, name: "Admin", email: "admin@test.com", role: "ADMIN" },
  { id: 2, name: "Tesorero", email: "tesorero@test.com", role: "TESORERO" },
  { id: 3, name: "Propietario", email: "prop@test.com", role: "PROPIETARIO" },
  { id: 4, name: "Inquilino", email: "inq@test.com", role: "INQUILINO" },
];

//  Inicializar localStorage una sola vez
if (!localStorage.getItem("miniloop_users")) {
  localStorage.setItem("miniloop_users", JSON.stringify(defaultUsers));
}

//  Helpers para leer/escribir
function getStoredUsers() {
  return JSON.parse(localStorage.getItem("miniloop_users"));
}

function saveStoredUsers(users) {
  localStorage.setItem("miniloop_users", JSON.stringify(users));
}

//  OBTENER TODOS
export function getUsers() {
  return getStoredUsers();
}

//  CREAR UNO NUEVO
export function createUser(newUser) {
  const users = getStoredUsers();

  const user = {
    id: Date.now(),
    ...newUser,
  };

  users.push(user);
  saveStoredUsers(users);

  return user;
}

// EDITAR
export function updateUser(id, updatedData) {
  let users = getStoredUsers();

  users = users.map((u) =>
    u.id === id ? { ...u, ...updatedData } : u
  );

  saveStoredUsers(users);
}

//  ELIMINAR
export function deleteUser(id) {
  let users = getStoredUsers();

  users = users.filter((u) => u.id !== id);

  saveStoredUsers(users);
}
