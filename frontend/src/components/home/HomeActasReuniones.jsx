import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

/* =======================
   CHIP DE FIRMA
======================= */
function FirmaChip({ nombre, firmo, isMe }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border
        ${
          firmo
            ? "bg-green-500/15 border-green-400/30 text-green-300"
            : "bg-yellow-500/15 border-yellow-400/30 text-yellow-300"
        }
        ${isMe ? "ring-1 ring-white/20" : ""}
      `}
    >
      {nombre}
      {firmo ? "✔️" : "⏳"}
    </span>
  );
}

/* =======================
   CARD DE ACTA (RESPONSIVE)
======================= */
function ActaCard({ acta, user, onFirmar }) {
  const firmaUsuario = acta.firmas.find(
    (f) => f.nombre === user?.unidad
  );

  const puedeFirmar =
    user?.role === "PROPIETARIO" && firmaUsuario && !firmaUsuario.firmo;

  return (
    <article className="rounded-2xl bg-gradient-to-b from-white/5 to-black/20 border border-white/10 p-4 sm:p-5 space-y-4">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <h4 className="text-white font-semibold text-base sm:text-lg">
          {acta.titulo}
        </h4>
        <span className="text-xs text-white/40">{acta.fecha}</span>
      </header>

      {/* Temas */}
      <ul className="list-disc list-inside text-sm text-white/75 space-y-1">
        {acta.temas.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>

      {/* Firmas */}
      <div className="pt-3 border-t border-white/10 space-y-2">
        <p className="text-xs text-white/50">Firmas registradas</p>

        <div className="flex flex-wrap gap-2">
          {acta.firmas.map((f, i) => (
            <FirmaChip
              key={i}
              nombre={f.nombre}
              firmo={f.firmo}
              isMe={f.nombre === user?.unidad}
            />
          ))}
        </div>

        {/* CTA Firmar */}
        {puedeFirmar && (
          <button
            onClick={onFirmar}
            className="w-full sm:w-auto mt-3 px-4 py-2 rounded-xl
              bg-green-500/20 border border-green-400/30
              text-sm font-medium text-white
              hover:bg-green-500/30 transition"
          >
            ✍️ Firmar acta
          </button>
        )}

        {user?.role === "PROPIETARIO" && firmaUsuario?.firmo && (
          <p className="text-xs text-green-400">
            ✔️ Ya firmaste esta acta
          </p>
        )}
      </div>
    </article>
  );
}

/* =======================
   COMPONENTE PRINCIPAL
======================= */
export default function HomeActasReuniones() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const [actas, setActas] = useState([
    {
      fecha: "10 Feb 2026",
      titulo: "Reunión ordinaria mensual",
      temas: [
        "Estado de expensas y deudores",
        "Mantenimiento del ascensor",
      ],
      firmas: [
        { nombre: "Depto 1A", firmo: true },
        { nombre: "Depto 2B", firmo: false },
        { nombre: "Depto 3C", firmo: false },
      ],
    },
    {
      fecha: "15 Ene 2026",
      titulo: "Reunión extraordinaria",
      temas: ["Rotura de bomba de agua"],
      firmas: [
        { nombre: "Depto 1A", firmo: true },
        { nombre: "Depto 2B", firmo: false },
      ],
    },
  ]);

  /* ===== Modal crear acta ===== */
  const [titulo, setTitulo] = useState("");
  const [tema, setTema] = useState("");
  const [temas, setTemas] = useState([]);

  function agregarTema() {
    if (!tema.trim()) return;
    setTemas([...temas, tema]);
    setTema("");
  }

  function crearActa() {
    if (!titulo || temas.length === 0) return;

    const nuevaActa = {
      fecha: new Date().toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      titulo,
      temas,
      firmas: [
        { nombre: "Depto 1A", firmo: false },
        { nombre: "Depto 2B", firmo: false },
        { nombre: "Depto 3C", firmo: false },
      ],
    };

    setActas([nuevaActa, ...actas]);
    setTitulo("");
    setTemas([]);
    setOpen(false);
  }

  function firmarActa(index) {
    const nuevas = [...actas];
    nuevas[index].firmas = nuevas[index].firmas.map((f) =>
      f.nombre === user.unidad ? { ...f, firmo: true } : f
    );
    setActas(nuevas);
  }

  return (
    <section className="mt-10 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
       <div className="mb-6">
  <div className="flex items-center gap-3">
    <span className="text-xl">📋</span>
    <h3 className="text-xl font-semibold text-white">
      Historial de reuniones
    </h3>
  </div>

  <p className="mt-1 ml-8 text-sm text-white/50 max-w-xl">
    Registro oficial de decisiones, temas tratados y conformidad de los propietarios.
  </p>
</div>


        {["ADMIN", "TESORERO"].includes(user.role) && (
          <button
            onClick={() => setOpen(true)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl
              bg-blue-500/20 border border-blue-400/30
              text-sm hover:bg-blue-500/30 transition"
          >
            + Nueva acta
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {actas.map((acta, i) => (
          <ActaCard
            key={i}
            acta={acta}
            user={user}
            onFirmar={() => firmarActa(i)}
          />
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center">
          <div className="w-full sm:max-w-md bg-[#0b1220] border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 space-y-4">
            <h4 className="text-white font-semibold">Nueva acta</h4>

            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título de la reunión"
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm text-white"
            />

            <div className="flex gap-2">
              <input
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Agregar tema"
                className="flex-1 rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm text-white"
              />
              <button
                onClick={agregarTema}
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-sm"
              >
                +
              </button>
            </div>

            <ul className="list-disc list-inside text-sm text-white/70">
              {temas.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="text-white/60 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={crearActa}
                className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-sm"
              >
                Crear acta
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
