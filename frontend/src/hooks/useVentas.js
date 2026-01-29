import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const STATUS = [
  "PENDING",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED",
];

export function useVentas() {
  const [orders, setOrders] = useState([]);
  const [detail, setDetail] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    userId: "",
    from: "",
    to: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  async function loadOrders() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.userId) params.set("user_id", filters.userId);
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);

      const res = await axiosInstance.get(
        `/kiosco/orders?${params.toString()}`
      );
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(id) {
    try {
      setLoadingDetail(true);
      setSelectedId(id);
      const res = await axiosInstance.get(`/kiosco/orders/${id}`);
      setDetail(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetail(false);
    }
  }

  async function changeStatus(status) {
    if (!selectedId) return;
    try {
      await axiosInstance.patch(`/kiosco/orders/${selectedId}/status`, {
        status,
      });
      await loadDetail(selectedId);
      await loadOrders();
    } catch (e) {
      console.error(e);
    }
  }

  const totalVendido = useMemo(
    () => orders.reduce((acc, o) => acc + Number(o.total || 0), 0),
    [orders]
  );

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    detail,
    selectedId,
    filters,
    setFilters,
    loading,
    loadingDetail,
    totalVendido,
    loadOrders,
    loadDetail,
    changeStatus,
  };
}
