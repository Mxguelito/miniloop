import { formatARS } from "../../utils/formatARS";
import { imgSrc } from "../../utils/imgSrc";

export default function ProductCard({ product, qtyInCart, onAdd }) {
  const stock = product.stock ?? 0;
  const outOfStock = stock <= 0;
  const reachedStock = qtyInCart >= stock;
  const disabled = outOfStock || reachedStock;

  return (
    <div
      className="
        bg-white
        border border-gray-200
        rounded-2xl
        p-4
        flex flex-col
        shadow-sm
        hover:shadow-md
        transition
      "
    >
      {/* IMAGE */}
      {product.image_url ? (
        <img
          src={imgSrc(product.image_url)}
          alt={product.name}
          className="w-full h-36 object-cover rounded-xl mb-3"
        />
      ) : (
        <div className="w-full h-36 rounded-xl mb-3 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          Sin imagen
        </div>
      )}

      {/* INFO */}
      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-900">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-4">
        <p className="text-lg font-bold text-gray-900 mb-2">
          {formatARS(product.price)}
        </p>

        <button
          onClick={() => onAdd(product.id)}
          disabled={disabled}
          className={[
            "w-full py-2 rounded-xl font-medium transition",
            disabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700",
          ].join(" ")}
          type="button"
        >
          {outOfStock
            ? "Sin stock"
            : reachedStock
            ? "Máx. alcanzado"
            : "Agregar al carrito"}
        </button>

        {qtyInCart > 0 && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            En carrito: <span className="font-semibold">{qtyInCart}</span>
          </p>
        )}
      </div>
    </div>
  );
}
