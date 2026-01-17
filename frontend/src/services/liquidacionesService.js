

const API = "http://localhost:3000/api/liquidaciones";

// Obtener todas
export async function getLiquidaciones() {
  const res = await fetch(API);
  return res.json();
}

// Obtener una liquidación por ID
export async function getLiquidacion(id) {
  const res = await fetch(`${API}/${id}`);
  return res.json();
}

// Crear liquidación
export async function createLiquidacion(data) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Actualizar liquidación (propietarios, movimientos, totales)
export async function updateLiquidacion(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Eliminar
export async function deleteLiquidacion(id) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

// Formateo AR$
export function formatMoney(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(value || 0);
}

// Liquidaciones del PROPIETARIO
export async function getLiquidacionesPropietario() {
  const res = await fetch("http://localhost:3000/api/propietario/liquidaciones");
  if (!res.ok) throw new Error("Error cargando liquidaciones del propietario");
  return res.json();
}

export async function getLiquidacionPropietario(id) {
  const res = await fetch(`http://localhost:3000/api/propietario/liquidaciones/${id}`);
  if (!res.ok) throw new Error("Error cargando liquidación del propietario");
  return res.json();
}
export async function updateLiquidacionFull(id, payload) {
  const res = await axiosInstance.put(`/liquidaciones/${id}/full-update`, payload);
  return res.data;
}


// Obtener ranking AUTOMÁTICO de deudores

export async function getDeudores() {
  // Trae TODAS las liquidaciones con propietarios y totales
  const liquidaciones = await getLiquidaciones();

  const deudores = [];

  liquidaciones.forEach((liq) => {
    if (!liq.propietarios) return;

    liq.propietarios.forEach((p) => {
      const deuda = Number(p.expensaAdeudada || 0);

      if (deuda > 0) {
        const encontrado = deudores.find((d) => d.nombre === p.nombre);

        if (encontrado) {
          encontrado.monto += deuda;
        } else {
          deudores.push({
            nombre: p.nombre,
            piso: p.piso || "-",
            departamento: p.departamento || p.dpto || "-",
            monto: deuda,
          });
        }
      }
    });
  });

  // Ordenar de mayor a menor
  deudores.sort((a, b) => b.monto - a.monto);

  return deudores;
}

