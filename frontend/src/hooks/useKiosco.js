import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export function useKiosco() {
  const [activeCategory, setActiveCategory] = useState("snacks");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({});
  const [openCart, setOpenCart] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [orderModal, setOrderModal] = useState(null);

  async function loadProducts() {
    try {
      setLoadingProducts(true);
      const params = new URLSearchParams();
      if (activeCategory) params.set("category", activeCategory);
      if (query) params.set("q", query);

      const res = await axiosInstance.get(
        `/kiosco/products?${params.toString()}`,
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [activeCategory, query]);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = products.find((p) => p.id === Number(id));
        if (!product) return null;
        return { ...product, qty, subtotal: product.price * qty };
      })
      .filter(Boolean);
  }, [cart, products]);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, it) => acc + it.qty, 0),
    [cartItems],
  );

  const total = useMemo(
    () => cartItems.reduce((acc, it) => acc + it.subtotal, 0),
    [cartItems],
  );

  function stockDisponible(productId) {
    const p = products.find((x) => x.id === Number(productId));
    return p?.stock ?? 0;
  }

  function qtyEnCarrito(productId) {
    return cart[productId] || 0;
  }

  function addToCart(productId) {
    const stock = stockDisponible(productId);
    const enCarrito = qtyEnCarrito(productId);
    if (enCarrito >= stock) return;

    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  }

  function addComboToCart(productIds) {
  setCart((prev) => {
    const next = { ...prev };

    productIds.forEach((id) => {
      next[id] = (next[id] || 0) + 1;
    });

    return next;
  });
}


  function decFromCart(productId) {
    setCart((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: current - 1 };
    });
  }

  function clearCart() {
    setCart({});
  }

  async function confirmOrder() {
    try {
      const items = Object.entries(cart).map(([id, qty]) => ({
        product_id: Number(id),
        qty: Number(qty),
      }));

      if (items.length === 0) return;

      const res = await axiosInstance.post("/kiosco/orders", {
        notes: "Pedido desde kiosco",
        items,
      });

      clearCart();
      setOpenCart(false);

      setOrderModal({
        orderId: res.data.order.id,
        itemsCount: cartCount,
        total,
        eta: "15–25 min",
        place: "Hall principal / Portería",
      });

      await loadProducts();
    } catch (err) {
      alert(err?.response?.data?.message || "Error confirmando pedido");
    }
  }

  return {
    activeCategory,
    setActiveCategory,
    query,
    setQuery,
    cart,
    openCart,
    setOpenCart,
    products,
    loadingProducts,
    orderModal,
    setOrderModal,
    cartItems,
    cartCount,
    total,
    addToCart,
    addComboToCart,
    decFromCart,
    clearCart,
    confirmOrder,
  };
}
