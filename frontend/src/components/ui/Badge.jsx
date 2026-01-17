export default function Badge({ children, color = "blue" }) {
  const colors = {
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    green: "bg-green-500/20 text-green-300 border-green-500/30",
    red: "bg-red-500/20 text-red-300 border-red-500/30",
    yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    gray: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full border text-sm font-semibold tracking-wide
                  backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.05)]
                  ${colors[color]}`}
    >
      {children}
    </span>
  );
}
