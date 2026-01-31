import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function EvolucionSaldoChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div
      className="
        relative
        mb-12
        rounded-3xl
        p-6 sm:p-8
        bg-gradient-to-br
        from-[#07131c]
        via-[#0b1f2d]
        to-[#07131c]
        border border-cyan-500/20
        shadow-[0_0_60px_rgba(0,180,255,0.25)]
        overflow-hidden
      "
    >
      {/* Glow decorativo */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Evolución del saldo
          </h2>
          <p className="text-sm text-cyan-200/80 mt-1">
            Comportamiento financiero mes a mes
          </p>
        </div>

        {/* Chart */}
        <div className="h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="saldoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0066ff" stopOpacity={0.3} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />

              <XAxis
                dataKey="mes"
                stroke="rgba(255,255,255,0.4)"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                stroke="rgba(255,255,255,0.4)"
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                formatter={(value) => [
                  `$ ${Number(value).toLocaleString("es-AR")}`,
                  "Saldo",
                ]}
                contentStyle={{
                  background: "rgba(10,20,30,0.95)",
                  border: "1px solid rgba(0,180,255,0.4)",
                  borderRadius: "14px",
                  color: "#fff",
                  boxShadow: "0 0 25px rgba(0,180,255,0.45)",
                }}
                labelStyle={{ color: "#67e8f9" }}
              />

              <Line
                type="monotone"
                dataKey="saldo"
                stroke="url(#saldoGradient)"
                strokeWidth={3}
                dot={({ cx, cy, payload }) => {
                  const color =
                    payload.tendencia === "sube" ? "#00ff9d" : "#ff0055";
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill={color}
                      stroke="white"
                      strokeWidth={1}
                    />
                  );
                }}
                activeDot={({ cx, cy, payload }) => {
                  const color =
                    payload.tendencia === "sube" ? "#00ff9d" : "#ff0055";
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={7}
                      fill={color}
                      stroke="white"
                      strokeWidth={2}
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Leyenda */}
        <div className="flex justify-center gap-6 mt-5 text-xs text-cyan-200/70">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#00ff9d]" />
            <span>Mes en alza</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff0055]" />
            <span>Mes en baja</span>
          </div>
        </div>
      </div>
    </div>
  );
}
