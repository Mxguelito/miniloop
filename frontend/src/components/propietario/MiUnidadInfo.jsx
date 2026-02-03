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
        <StatBoxBeige label="Propietario" value={data.nombre} />
        <StatBoxBeige label="Email" value={data.email} />
        <StatBoxBeige label="Teléfono" value={data.telefono} />
        <StatBoxBeige label="Piso" value={data.piso} />
        <StatBoxBeige label="Departamento" value={data.dpto} />
        <StatBoxBeige label="Unidad" value={data.unidad} />
      </div>
    </div>
  );
}
