import { useEffect, useState } from "react";
import {
  getConsorcios,
  createConsorcio,
  updateConsorcio,
  deleteConsorcio,
} from "../services/consorciosService";

export function useConsorcios() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    unidades: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const data = await getConsorcios();
      setList(data);
    } catch (err) {
      console.error("Error al cargar consorcios", err);
    }
  }

  function openNew() {
    setForm({ nombre: "", direccion: "", unidades: "" });
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(consorcio) {
    setForm({
      nombre: consorcio.nombre,
      direccion: consorcio.direccion,
      unidades: consorcio.unidades,
    });
    setEditingId(consorcio.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  async function submit() {
    try {
      if (editingId) {
        await updateConsorcio(editingId, form);
      } else {
        await createConsorcio(form);
      }
      await refresh();
      closeForm();
    } catch (err) {
      console.error("Error al guardar consorcio", err);
    }
  }

  async function remove(id) {
  try {
    await api.delete(`/consorcios/${id}`);
    fetchConsorcios();
  } catch (err) {
    if (err.response?.status === 409) {
      setBlockedMessage(
        "Este consorcio no puede eliminarse porque tiene usuarios asignados. Quitá primero los usuarios o transferilos a otro consorcio."
      );
    } else {
      setBlockedMessage(
        "Ocurrió un error al intentar eliminar el consorcio."
      );
    }
  }
}


  return {
    list,
    form,
    setForm,
    showForm,
    editingId,
    openNew,
    openEdit,
    closeForm,
    submit,
    remove,
    blockedMessage,
    setBlockedMessage,
  };
}
