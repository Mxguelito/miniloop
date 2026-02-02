import { useAuth } from "../../context/AuthContext";

function Row({ dpto, concepto, monto, desde }) {
  return (
    <tr className="border-b border-white/10">
      <td className="py-2 px-3 text-white/80">{dpto}</td>
      <td className="py-2 px-3 text-white/70">{concepto}</td>
      <td className="py-2 px-3 text-red-300 font-semibold">{monto}</td>
      <td className="py-2 px-3 text-white/50">{desde}</td>
    </tr>
  );
}

export default function HomeDeudoresDetalle() {
  const { user } = useAuth();
  if (!user) return null;

  // 🔐 Solo ADMIN y TESORERO
  if (!["ADMIN", "TESORERO"].includes(user.role)) return null;

  // Mock (historial/mural interno)
  const deudores = [
    { dpto: "2A", concepto: "Expensas", monto: "$120.000", desde: "Ene 2026" },
    { dpto: "4B", concepto: "Multa (ruidos)", monto: "$25.000", desde: "Feb 2026" },
    { dpto: "1C", concepto: "Expensas", monto: "$80.000", desde: "Dic 2025" },
  ];

  return (
    <section className="rounded-xl bg-red-500/5 border border-red-400/20 p-5">
      <h3 className="text-white font-semibold mb-3">
        🚨 Deudores del consorcio
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/50 text-left">
              <th className="py-2 px-3">Depto</th>
              <th className="py-2 px-3">Concepto</th>
              <th className="py-2 px-3">Monto</th>
              <th className="py-2 px-3">Desde</th>
            </tr>
          </thead>
          <tbody>
            {deudores.map((d, i) => (
              <Row key={i} {...d} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
