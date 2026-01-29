export default function VentaStatusBadge({ status }) {
  const map = {
    PENDING: "bg-yellow-500/15 border-yellow-400/20 text-yellow-200",
    PREPARING: "bg-blue-500/15 border-blue-400/20 text-blue-200",
    READY: "bg-purple-500/15 border-purple-400/20 text-purple-200",
    DELIVERED: "bg-green-500/15 border-green-400/20 text-green-200",
    CANCELLED: "bg-red-500/15 border-red-400/20 text-red-200",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full border ${
        map[status] || "bg-white/10 border-white/10"
      }`}
    >
      {status}
    </span>
  );
}
