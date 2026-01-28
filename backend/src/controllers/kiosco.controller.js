import { pool } from "../config/db.js";

function requireAdmin(req, res) {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ message: "Solo ADMIN" });
    return false;
  }
  return true;
}

// GET /api/kiosco/products?category=snacks&q=alf
export async function getProducts(req, res) {
  try {
    const { category, q } = req.query;

    // Admin puede ver todo (activos + inactivos), otros solo activos
    const isAdmin = req.user?.role === "ADMIN";

    const params = [];
    let sql = `
      SELECT id, name, description, price, category, stock, image_url, is_active
      FROM kiosco_products
      WHERE 1=1
    `;

    if (!isAdmin) {
      sql += ` AND is_active = true AND stock > 0 `;
    }

    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length} `;
    }

    if (q) {
      params.push(`%${q}%`);
      sql += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length}) `;
    }

    sql += ` ORDER BY created_at DESC `;

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener productos" });
  }
}

export async function adminCreateProduct(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    const { name, description, price, category, stock, image_url } = req.body;

    const result = await pool.query(
      `
      INSERT INTO kiosco_products (name, description, price, category, stock, image_url)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [name, description || "", price, category, stock ?? 0, image_url || ""]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear producto" });
  }
}

export async function adminUpdateProduct(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    const { id } = req.params;
    const { name, description, price, category, image_url } = req.body;

    const result = await pool.query(
      `
      UPDATE kiosco_products
      SET name=$1, description=$2, price=$3, category=$4, image_url=$5, updated_at=NOW()
      WHERE id=$6
      RETURNING *
      `,
      [name, description || "", price, category, image_url || "", id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
}

export async function adminUpdateStock(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    const { id } = req.params;
    const { stock } = req.body;

    const result = await pool.query(
      `
      UPDATE kiosco_products
      SET stock=$1, updated_at=NOW()
      WHERE id=$2
      RETURNING *
      `,
      [stock, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar stock" });
  }
}

export async function adminToggleActive(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE kiosco_products
      SET is_active = NOT is_active, updated_at=NOW()
      WHERE id=$1
      RETURNING *
      `,
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al activar/desactivar" });
  }
}

// POST /api/kiosco/orders
export async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const { items, notes } = req.body; // items: [{ product_id, qty }]

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items requeridos" });
    }

    // validar qty
    for (const it of items) {
      if (!it.product_id || !Number.isInteger(it.qty) || it.qty <= 0) {
        return res.status(400).json({ message: "Item inválido" });
      }
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const ids = items.map((i) => i.product_id);

      // Traer productos + bloquear filas (evita 2 compras simultáneas rompiendo stock)
      const { rows: products } = await client.query(
        `
        SELECT id, name, price, stock, is_active
        FROM kiosco_products
        WHERE id = ANY($1)
        FOR UPDATE
        `,
        [ids]
      );

      if (products.length !== ids.length) {
        throw { status: 400, message: "Algún producto no existe" };
      }

      const map = new Map(products.map((p) => [p.id, p]));
      let total = 0;

      const orderItems = items.map((it) => {
        const p = map.get(it.product_id);

        if (!p.is_active) throw { status: 400, message: `Producto inactivo: ${p.name}` };
        if (p.stock < it.qty) throw { status: 400, message: `Sin stock: ${p.name}` };

        const price = Number(p.price);
        const subtotal = price * it.qty;
        total += subtotal;

        return {
          product_id: p.id,
          qty: it.qty,
          price,
          subtotal,
          name: p.name,
        };
      });

      // 1) crear order
      const orderRes = await client.query(
        `
        INSERT INTO kiosco_orders (user_id, status, total, notes)
        VALUES ($1, 'PENDING', $2, $3)
        RETURNING id, user_id, status, total, notes, created_at
        `,
        [userId, total, notes || null]
      );

      const order = orderRes.rows[0];

      // 2) insertar items + descontar stock
      for (const it of orderItems) {
        await client.query(
          `
          INSERT INTO kiosco_order_items (order_id, product_id, qty, price, subtotal)
          VALUES ($1, $2, $3, $4, $5)
          `,
          [order.id, it.product_id, it.qty, it.price, it.subtotal]
        );

        await client.query(
          `
          UPDATE kiosco_products
          SET stock = stock - $1, updated_at = NOW()
          WHERE id = $2
          `,
          [it.qty, it.product_id]
        );
      }

      await client.query("COMMIT");

      return res.status(201).json({
        order,
        items: orderItems,
      });
    } catch (e) {
      await client.query("ROLLBACK");
      return res.status(e.status || 500).json({
        message: e.message || "Error creando pedido",
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error interno" });
  }
}

export async function adminGetOrders(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    const { status, user_id, from, to } = req.query;

    const params = [];
    let sql = `
  SELECT 
    o.id, o.user_id, o.status, o.total, o.notes, o.created_at,
    COALESCE(SUM(i.qty), 0) AS items_count
  FROM kiosco_orders o
  LEFT JOIN kiosco_order_items i ON i.order_id = o.id
  WHERE 1=1
`;


    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length} `;
    }

    if (user_id) {
      params.push(Number(user_id));
      sql += ` AND user_id = $${params.length} `;
    }

    // from/to: '2026-01-01'
    if (from) {
      params.push(from);
      sql += ` AND created_at >= $${params.length} `;
    }
    if (to) {
      params.push(to);
      sql += ` AND created_at <= $${params.length} `;
    }

    sql += ` GROUP BY o.id ORDER BY o.created_at DESC `;


    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
}

export async function adminGetOrderById(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    const { id } = req.params;

    const orderRes = await pool.query(
      `SELECT id, user_id, status, total, notes, created_at
       FROM kiosco_orders
       WHERE id = $1`,
      [id]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const itemsRes = await pool.query(
  `
  SELECT i.id, i.product_id, p.name as product_name, i.qty, i.price, i.subtotal
  FROM kiosco_order_items i
  JOIN kiosco_products p ON p.id = i.product_id
  WHERE i.order_id = $1
  ORDER BY i.id ASC
  `,
  [id]
);


    res.json({
      order: orderRes.rows[0],
      items: itemsRes.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener detalle" });
  }
}


const ALLOWED_STATUS = ["PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED"];

export async function adminUpdateOrderStatus(req, res) {
  if (!requireAdmin(req, res)) return;

  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    await client.query("BEGIN");

    // 1) Traer pedido actual
    const orderRes = await client.query(
      `SELECT id, status FROM kiosco_orders WHERE id = $1 FOR UPDATE`,
      [id]
    );

    if (orderRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

   const currentStatus = orderRes.rows[0].status;

// ❌ Si ya está CANCELLED o DELIVERED, no se puede cambiar más
if (currentStatus === "CANCELLED" || currentStatus === "DELIVERED") {
  await client.query("ROLLBACK");
  return res.status(400).json({
    message: `Pedido cerrado (${currentStatus}): no se puede modificar`,
  });
}



    // 2) Si lo pasan a CANCELLED y antes NO era CANCELLED => devolver stock
    if (status === "CANCELLED" && currentStatus !== "CANCELLED") {
      const itemsRes = await client.query(
        `
        SELECT product_id, qty
        FROM kiosco_order_items
        WHERE order_id = $1
        `,
        [id]
      );

      for (const it of itemsRes.rows) {
        await client.query(
          `
          UPDATE kiosco_products
          SET stock = stock + $1, updated_at = NOW()
          WHERE id = $2
          `,
          [it.qty, it.product_id]
        );
      }
    }

    // 3) Actualizar estado del pedido
    const updateRes = await client.query(
      `
      UPDATE kiosco_orders
      SET status = $1
      WHERE id = $2
      RETURNING id, user_id, status, total, notes, created_at
      `,
      [status, id]
    );

    await client.query("COMMIT");
    res.json(updateRes.rows[0]);

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Error al actualizar estado" });
  } finally {
    client.release();
  }
}

export async function adminDeleteProduct(req, res) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Solo ADMIN" });
  }

  try {
    const { id } = req.params;

    await pool.query(
      `DELETE FROM kiosco_products WHERE id = $1`,
      [id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
}
