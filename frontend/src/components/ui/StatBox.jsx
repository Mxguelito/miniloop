export default function StatBox({ label, value, color = "blue" }) {
  const bgColors = {
    blue: "bg-blue-900/40 border-blue-500/30",
    green: "bg-green-900/40 border-green-500/30",
    red: "bg-red-900/40 border-red-500/30",
    yellow: "bg-yellow-900/40 border-yellow-500/30",
  };

  return (
    <div
      className={`p-6 rounded-xl border ${bgColors[color]} shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
    >
      <p className="text-sm opacity-75">{label}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
