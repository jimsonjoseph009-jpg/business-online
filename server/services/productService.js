const pool = require('../db/mysql');

/**
 * Product service backed by MySQL
 * Matches the products table structure we defined.
 */
const productService = {
  // Get all products for user
  getAll: async (userId) => {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  // Get single product
  getById: async (productId, userId) => {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ? AND user_id = ?',
      [productId, userId]
    );

    if (!rows.length) {
      throw {
        status: 404,
        message: 'Product not found',
        code: 'NOT_FOUND'
      };
    }

    return rows[0];
  },

  // Create product
  create: async (productData, userId) => {
    const {
      name,
      sku,
      description,
      price,
      cost,
      stock,
      stock_threshold,
      category,
      imageUrl,
      is_active
    } = productData;

    const [result] = await pool.query(
      `INSERT INTO products 
       (user_id, name, sku, description, price, cost, stock, stock_threshold, category, image_url, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name,
        sku || null,
        description || null,
        price != null ? price : 0,
        cost != null ? cost : null,
        stock != null ? stock : 0,
        stock_threshold != null ? stock_threshold : 0,
        category || null,
        imageUrl || null,
        is_active != null ? is_active : 1
      ]
    );

    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );
    return rows[0];
  },

  // Update product
  update: async (productId, productData, userId) => {
    const existing = await productService.getById(productId, userId); // throws 404 if not found

    const {
      name = existing.name,
      sku = existing.sku,
      description = existing.description,
      price = existing.price,
      cost = existing.cost,
      stock = existing.stock,
      stock_threshold = existing.stock_threshold,
      category = existing.category,
      imageUrl = existing.image_url,
      is_active = existing.is_active
    } = productData;

    const [result] = await pool.query(
      `UPDATE products
       SET name = ?, sku = ?, description = ?, price = ?, cost = ?, stock = ?, 
           stock_threshold = ?, category = ?, image_url = ?, is_active = ?
       WHERE id = ? AND user_id = ?`,
      [
        name,
        sku || null,
        description || null,
        price,
        cost,
        stock,
        stock_threshold,
        category || null,
        imageUrl || null,
        is_active,
        productId,
        userId
      ]
    );

    if (!result.affectedRows) {
      throw {
        status: 404,
        message: 'Product not found',
        code: 'NOT_FOUND'
      };
    }

    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );
    return rows[0];
  },

  // Delete product
  delete: async (productId, userId) => {
    const [result] = await pool.query(
      'DELETE FROM products WHERE id = ? AND user_id = ?',
      [productId, userId]
    );

    if (!result.affectedRows) {
      throw {
        status: 404,
        message: 'Product not found',
        code: 'NOT_FOUND'
      };
    }

    return { success: true };
  }
};

module.exports = productService;

