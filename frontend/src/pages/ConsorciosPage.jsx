import AppLayout from "../components/layout/AppLayout";
import { useConsorcios } from "../hooks/useConsorcios";

import ConsorciosHeader from "../components/consorcios/ConsorciosHeader";
import ConsorciosTable from "../components/consorcios/ConsorciosTable";
import ConsorcioFormModal from "../components/consorcios/ConsorcioFormModal";

export default function ConsorciosPage() {
  const {
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
  } = useConsorcios();

  return (
    <AppLayout>
      <div className="p-6 text-white">
        <ConsorciosHeader onNew={openNew} />

        <ConsorciosTable
          list={list}
          onEdit={openEdit}
          onDelete={remove}
        />

        {showForm && (
          <ConsorcioFormModal
            form={form}
            setForm={setForm}
            editing={!!editingId}
            onClose={closeForm}
            onSubmit={submit}
          />
        )}
      </div>
    </AppLayout>
  );
}
