import { useEffect, useState } from "react";
import { getDashboardTesorero } from "../../services/tesoreria.service";

export function useDashboardTesorero() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardTesorero()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
