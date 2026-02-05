const pool = require('../db/mysql');

/**
 * Database Service
 * Handles all MySQL database operations
 */
class DatabaseService {
  /**
   * Execute a query
   * @param {string} sql - SQL query string
   * @param {array} values - Query parameters
   * @returns {Promise} Query result
   */
  async query(sql, values = []) {
    try {
      const [rows] = await pool.query(sql, values);
      return rows;
    } catch (error) {
      console.error('Database Query Error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Get single row
   */
  async getOne(sql, values = []) {
    const results = await this.query(sql, values);
    return results[0] || null;
  }

  /**
   * Get all rows
   */
  async getAll(sql, values = []) {
    return await this.query(sql, values);
  }

  /**
   * Insert a record
   */
  async insert(table, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`;
    const [result] = await pool.query(sql, values);
    return result;
  }

  /**
   * Update a record
   */
  async update(table, data, where) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const conditions = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    const whereValues = Object.values(where);

    const sql = `UPDATE ${table} SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE ${conditions}`;
    const [result] = await pool.query(sql, [...values, ...whereValues]);
    return result;
  }

  /**
   * Delete a record
   */
  async delete(table, where) {
    const conditions = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    const whereValues = Object.values(where);

    const sql = `DELETE FROM ${table} WHERE ${conditions}`;
    const [result] = await pool.query(sql, whereValues);
    return result;
  }

  /**
   * Test database connection
   */
  async testConnection() {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query('SELECT 1');
      connection.release();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error.message);
      return false;
    }
  }
}

module.exports = new DatabaseService();
