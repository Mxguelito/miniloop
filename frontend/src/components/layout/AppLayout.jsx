import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex overflow-x-hidden bg-gradient-to-br from-[#0b1220] to-[#0f172a] text-slate-100">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Sidebar Mobile (Drawer futurista) */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay con blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div
            className="
              absolute left-0 top-0 h-full w-72
              bg-gradient-to-br from-[#0b1220]/95 to-[#020617]/95
              backdrop-blur-xl
              border-r border-cyan-500/20
              shadow-[0_0_40px_rgba(0,180,255,0.25)]
              flex flex-col
              animate-slide-in
            "
          >
            {/* Header mobile futurista */}
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <div>
                <p className="text-xs uppercase tracking-widest text-cyan-400/70">
                  Control Panel
                </p>
                <h2 className="text-xl font-extrabold text-cyan-400 tracking-tight">
                  Miniloop
                </h2>
              </div>

              {/* Botón cerrar futurista */}
              <button
                onClick={() => setOpen(false)}
                className="
                  w-9 h-9 rounded-full
                  bg-white/10 hover:bg-rose-500/20
                  text-white
                  flex items-center justify-center
                  transition active:scale-95
                "
              >
                ✕
              </button>
            </div>

            {/* Sidebar scrollable */}
            <div className="flex-1 overflow-y-auto px-2 py-4">
              <Sidebar mobile onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col relative z-0 min-w-0">

        <Topbar onOpenMenu={() => setOpen(true)} />
       <main className="flex-1 min-h-0 p-4 md:p-8 overflow-y-auto overflow-x-hidden">

          {children}
        </main>
      </div>

      {/* Animación */}
      <style>
        {`
          @keyframes slide-in {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .animate-slide-in {
            animation: slide-in 0.35s ease-out;
          }
        `}
      </style>
    </div>
  );
}
