import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      
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
          <div className="absolute left-0 top-0 h-full w-72 bg-[#1e293b] border-r border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-blue-400 tracking-wide">
                Miniloop
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
              >
                ✖
              </button>
            </div>

            {/* Reutilizamos Sidebar pero en modo mobile */}
            <Sidebar mobile onNavigate={() => setOpen(false)} />
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
