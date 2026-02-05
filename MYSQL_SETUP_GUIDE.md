## MySQL Connection Setup Guide

Your project is now configured to connect to MySQL. Here's what you need to do:

### Step 1: Create a MySQL Database

```sql
CREATE DATABASE business_online;
USE business_online;

-- Example tables
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  total DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

### Step 2: Update Environment Variables

Edit `server/.env` with your MySQL credentials:

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=business_online
```

### Step 3: Start Your Server

```bash
npm run server
```

### Step 4: Use in Your Routes

The MySQL connection pool is available in `/server/db/mysql.js`. Import and use it:

```javascript
const pool = require('../db/mysql');

// Example query
const [rows] = await pool.query('SELECT * FROM products');
```

### Already Configured Files:
- ✅ `/server/db/mysql.js` - Connection pool setup
- ✅ `/server/.env` - Environment variables
- ✅ `/server/.env.example` - Example configuration
- ✅ `/server/config/env.js` - Config loader

### Next Steps:
1. Install MySQL if not already installed
2. Create the database and tables (see SQL above)
3. Update your `.env` with correct credentials
4. Create service files to handle queries
5. Update routes to use the MySQL connection

### Example Service File:

Create `/server/services/productService.js`:

```javascript
const pool = require('../db/mysql');

class ProductService {
  async getAllProducts() {
    try {
      const [rows] = await pool.query('SELECT * FROM products');
      return rows;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async getProductById(id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  }

  async createProduct(name, description, price) {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
      [name, description, price]
    );
    return result;
  }
}

module.exports = new ProductService();
```

### Troubleshooting:

**Connection refused**: Make sure MySQL is running
```bash
# Start MySQL (Linux/Mac)
sudo service mysql start

# Or use MySQL command line
mysql -u root -p
```

**Permission denied**: Check your MySQL username/password in `.env`

**Database not found**: Run the CREATE DATABASE statement above

**Port already in use**: Change `MYSQL_PORT` in `.env`
