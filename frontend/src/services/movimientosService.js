

// Inicialización si no existe
if (!localStorage.getItem("miniloop_movimientos")) {
  localStorage.setItem("miniloop_movimientos", JSON.stringify([]));
}

function getStoredMovimientos() {
  return JSON.parse(localStorage.getItem("miniloop_movimientos"));
}

function saveStoredMovimientos(movs) {
  localStorage.setItem("miniloop_movimientos", JSON.stringify(movs));
}

// Obtener todos los movimientos
export function getMovimientos() {
  return getStoredMovimientos();
}

// Obtener movimientos por consorcio
export function getMovimientosByConsorcio(consorcioId) {
  return getStoredMovimientos().filter(
    (m) => m.consorcioId === consorcioId
  );
}

// Crear movimiento (Ingreso o Gasto)
export function createMovimiento(data) {
  const movs = getStoredMovimientos();

  const nuevo = {
    id: Date.now(),
    fecha: new Date().toISOString(),
    ...data
  };

  movs.push(nuevo);
  saveStoredMovimientos(movs);

  return nuevo;
}

//  Eliminar movimiento
export function deleteMovimiento(id) {
  let movs = getStoredMovimientos();
  movs = movs.filter((m) => m.id !== id);
  saveStoredMovimientos(movs);
}
