export default function MiUnidadInfo({ data }) {
  return (
    <div className="rounded-2xl bg-[#0b1220] border border-white/10 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">
        Información de la unidad
      </h2>

      <div className="space-y-3">
        <Item label="Propietario" value={data.nombre} />
        <Item label="Email" value={data.email} />
        <Item label="Teléfono" value={data.telefono} />
        <Item label="Piso" value={data.piso} />
        <Item label="Departamento" value={data.dpto} />
        <Item label="Unidad" value={data.unidad} />
      </div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
      <span className="text-xs uppercase tracking-widest text-cyan-300/70">
        {label}
      </span>
      <span className="text-sm font-medium text-white">
        {value ?? "—"}
      </span>
    </div>
  );
}
