import { useEffect, useState } from "react";
import { getLiquidacionesPropietario } from "../../services/propietarioService";

export function useMisLiquidaciones() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getLiquidacionesPropietario();
        setItems(res || []);
      } catch (err) {
        console.error("Error cargando liquidaciones del propietario:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return {
    items,
    loading,
    hasData: items.length > 0,
  };
}
