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

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setList(getConsorcios());
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

  function submit() {
    if (editingId) {
      updateConsorcio(editingId, form);
    } else {
      createConsorcio(form);
    }
    refresh();
    closeForm();
  }

  function remove(id) {
    deleteConsorcio(id);
    refresh();
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
  };
}
