export default function MiUnidadLayout({ children }) {
  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#0b1020]
        via-[#0f172a]
        to-[#020617]
        px-4 py-6 md:px-10 md:py-10
      "
    >
      <div
        className="
          mx-auto max-w-6xl space-y-8
        "
      >
        {children}
      </div>
    </div>
  );
}
