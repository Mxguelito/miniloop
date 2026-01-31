import { useEffect, useState } from "react";
import { getMiPropietario } from "../../services/propietarioService";
import axiosInstance from "../../api/axiosInstance";

export function useMiPropietario() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getMiPropietario();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function editarTelefono() {
    if (!data) return;

    const nuevo = prompt("Ingresá tu teléfono:", data.telefono ?? "");
    if (nuevo === null) return;

    try {
      const res = await axiosInstance.patch("/propietarios/me", {
        telefono: nuevo,
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el teléfono");
    }
  }
  async function solicitarCambioUnidad() {
  if (!data) return;

  const piso = prompt("Ingresá tu piso:", data.piso ?? "");
  if (piso === null) return;

  const dpto = prompt("Ingresá tu departamento:", data.dpto ?? "");
  if (dpto === null) return;

  const unidad = prompt("Ingresá tu unidad (opcional):", data.unidad ?? "");
  if (unidad === null) return;

  try {
    const res = await axiosInstance.post("/propietarios/solicitud-unidad", {
      piso,
      dpto,
      unidad,
    });

    alert(res.data?.message || "Solicitud enviada");
  } catch (err) {
    console.error(err);
    alert(
      err?.response?.data?.message ||
        "No se pudo enviar la solicitud de unidad"
    );
  }
}


  return { data, loading, setData, editarTelefono, solicitarCambioUnidad };
}
