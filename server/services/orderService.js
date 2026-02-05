const pool = require('../db/mysql');

/**
 * Order service backed by MySQL
 * Uses orders + order_items tables as defined.
 */
const orderService = {
  // Get all orders for user (without items)
  getAll: async (userId) => {
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY placed_at DESC',
      [userId]
    );
    return rows;
  },

  // Get single order with items
  getById: async (orderId, userId) => {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (!orders.length) {
      throw {
        status: 404,
        message: 'Order not found',
        code: 'NOT_FOUND'
      };
    }

    const order = orders[0];

    const [items] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    return { ...order, items };
  },

  // Create order with items
  create: async (orderData, userId) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const {
        customerId,
        status = 'pending',
        subtotal = 0,
        discount_total = 0,
        tax_total = 0,
        shipping_total = 0,
        total = 0,
        currency = 'USD',
        payment_method,
        payment_reference,
        notes,
        billing_address,
        shipping_address,
        items = []
      } = orderData;

      // Insert into orders
      const [orderResult] = await connection.query(
        `INSERT INTO orders
         (user_id, customer_id, status, subtotal, discount_total, tax_total, 
          shipping_total, total, currency, payment_method, payment_reference, 
          notes, billing_address, shipping_address)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          customerId,
          status,
          subtotal,
          discount_total,
          tax_total,
          shipping_total,
          total,
          currency,
          payment_method || null,
          payment_reference || null,
          notes || null,
          billing_address || null,
          shipping_address || null
        ]
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of items) {
        const {
          productId,
          product_name,
          sku,
          quantity,
          unit_price,
          discount_amount = 0,
          tax_amount = 0,
          line_total
        } = item;

        await connection.query(
          `INSERT INTO order_items
           (order_id, product_id, product_name, sku, quantity, unit_price,
            discount_amount, tax_amount, line_total)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            productId,
            product_name,
            sku || null,
            quantity,
            unit_price,
            discount_amount,
            tax_amount,
            line_total
          ]
        );
      }

      await connection.commit();

      // Return full order with items
      const order = await orderService.getById(orderId, userId);
      return order;
    } catch (error) {
      await connection.rollback();
      throw {
        status: 500,
        message: 'Failed to create order',
        code: 'CREATE_ERROR',
        details: error.message
      };
    } finally {
      connection.release();
    }
  },

  // Update order header only (not items) for simplicity
  update: async (orderId, orderData, userId) => {
    const existing = await orderService.getById(orderId, userId); // throws 404 if not found

    const {
      status = existing.status,
      subtotal = existing.subtotal,
      discount_total = existing.discount_total,
      tax_total = existing.tax_total,
      shipping_total = existing.shipping_total,
      total = existing.total,
      currency = existing.currency,
      payment_method = existing.payment_method,
      payment_reference = existing.payment_reference,
      notes = existing.notes,
      billing_address = existing.billing_address,
      shipping_address = existing.shipping_address
    } = orderData;

    const [result] = await pool.query(
      `UPDATE orders
       SET status = ?, subtotal = ?, discount_total = ?, tax_total = ?, 
           shipping_total = ?, total = ?, currency = ?, payment_method = ?, 
           payment_reference = ?, notes = ?, billing_address = ?, shipping_address = ?
       WHERE id = ? AND user_id = ?`,
      [
        status,
        subtotal,
        discount_total,
        tax_total,
        shipping_total,
        total,
        currency,
        payment_method || null,
        payment_reference || null,
        notes || null,
        billing_address || null,
        shipping_address || null,
        orderId,
        userId
      ]
    );

    if (!result.affectedRows) {
      throw {
        status: 404,
        message: 'Order not found',
        code: 'NOT_FOUND'
      };
    }

    const updated = await orderService.getById(orderId, userId);
    return updated;
  },

  // Delete order + its items
  delete: async (orderId, userId) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Verify the order belongs to user
      const [orders] = await connection.query(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?',
        [orderId, userId]
      );

      if (!orders.length) {
        throw {
          status: 404,
          message: 'Order not found',
          code: 'NOT_FOUND'
        };
      }

      // Delete items first
      await connection.query(
        'DELETE FROM order_items WHERE order_id = ?',
        [orderId]
      );

      // Delete order
      await connection.query(
        'DELETE FROM orders WHERE id = ? AND user_id = ?',
        [orderId, userId]
      );

      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      if (error.status) throw error;
      throw {
        status: 500,
        message: 'Failed to delete order',
        code: 'DELETE_ERROR',
        details: error.message
      };
    } finally {
      connection.release();
    }
  }
};

module.exports = orderService;

