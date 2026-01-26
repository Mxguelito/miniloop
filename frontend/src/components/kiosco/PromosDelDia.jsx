import { kioscoPromos } from "../../data/kioscoPromos";
import { formatARS } from "../../utils/formatARS";

export default function PromosDelDia() {
  return (
    <section className="relative rounded-3xl bg-white p-6 md:p-8 shadow-lg space-y-6">
  {/* HEADER */}
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
        🔥 Promos del día
      </h2>
      <p className="text-sm text-gray-500">
        Ofertas destacadas del kiosco
      </p>
    </div>

    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
      -10% / -15%
    </span>
  </div>

  {/* PROMOS */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {kioscoPromos.map((promo) => (
      <div
        key={promo.id}
        className="
          rounded-2xl
          border border-gray-200
          p-5
          flex justify-between items-center
          hover:shadow-md
          transition
        "
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">
              {promo.title}
            </h3>
            {promo.badge && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {promo.badge}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500">
            {promo.description}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xl font-extrabold text-gray-900">
            {formatARS(promo.price)}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>

  );
}
