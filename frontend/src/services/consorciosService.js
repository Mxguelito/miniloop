// Base inicial si no existe nada:
const defaultConsorcios = [
  { id: 1, nombre: "Las Rosas", direccion: "Av. Siempreviva 123", unidades: 24 },
  { id: 2, nombre: "Torre Azul", direccion: "Calle Libertad 456", unidades: 18 },
];

if (!localStorage.getItem("miniloop_consorcios")) {
  localStorage.setItem("miniloop_consorcios", JSON.stringify(defaultConsorcios));
}

// Helpers
function getStored() {
  return JSON.parse(localStorage.getItem("miniloop_consorcios"));
}

function saveStored(data) {
  localStorage.setItem("miniloop_consorcios", JSON.stringify(data));
}

//  Obtener todos
export function getConsorcios() {
  return getStored();
}

//  Crear
export function createConsorcio(newData) {
  const list = getStored();
  const newItem = { id: Date.now(), ...newData };
  list.push(newItem);
  saveStored(list);
  return newItem;
}

// Editar
export function updateConsorcio(id, data) {
  let list = getStored();
  list = list.map((c) => (c.id === id ? { ...c, ...data } : c));
  saveStored(list);
}

// Eliminar
export function deleteConsorcio(id) {
  let list = getStored();
  list = list.filter((c) => c.id !== id);
  saveStored(list);
}
