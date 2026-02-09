export default function BlockActionModal({
  title,
  message,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-[#0b1220] to-[#060b14] p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xl">
            ⚠️
          </div>
          <h2 className="text-lg font-semibold text-white">
            {title}
          </h2>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          {message}
        </p>

        {/* Actions */}
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-blue-500/20 hover:bg-blue-500/30 transition text-blue-300 py-2.5 text-sm font-medium"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
