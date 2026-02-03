import StatBoxFuturistic from "../ui/StatBoxBeige";
import StatBoxBeige from "../ui/StatBoxBeige";

export default function MiUnidadInfo({ data }) {
  return (
    <div
      className="
        rounded-3xl
        bg-white/5
        backdrop-blur-xl
        border
        border-white/10
        p-6
        shadow-[0_0_60px_rgba(56,189,248,0.12)]
      "
    >
      <h2 className="text-lg font-semibold text-white mb-6">
        Información de la unidad
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatBoxFuturistic label="Propietario" value={data.nombre} />
        <StatBoxFuturistic label="Email" value={data.email} />
        <StatBoxFuturistic label="Teléfono" value={data.telefono} />
        <StatBoxFuturistic label="Piso" value={data.piso} />
        <StatBoxFuturistic label="Departamento" value={data.dpto} />
        <StatBoxFuturistic label="Unidad" value={data.unidad} />
      </div>
    </div>
  );
}
