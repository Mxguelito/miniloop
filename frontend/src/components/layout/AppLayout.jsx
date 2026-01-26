import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0b1220] to-[#0f172a] text-slate-100">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Sidebar Mobile (Drawer) */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          {/* drawer */}
          <div className="absolute left-0 top-0 min-h-screen w-72 bg-[#111827] shadow-2xl shadow-black/40 flex flex-col">
            {/* Header mobile */}
            <div className="p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-blue-400 tracking-tight">
                Miniloop
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
              >
                ✖
              </button>
            </div>

            {/* Sidebar scrollable */}
            <div className="flex-1 overflow-y-auto">
              <Sidebar mobile onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Contenedor de la página */}
      <div className="flex-1 flex flex-col">
        <Topbar onOpenMenu={() => setOpen(true)} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
