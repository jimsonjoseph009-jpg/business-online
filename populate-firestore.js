#!/usr/bin/env node

/**
 * Direct Firestore Population Script
 * Populates Firestore with sample data directly
 */

const { db, admin } = require('./server/config/firebase');

const userId = 'dev-user'; // Development user ID

// Sample products
const sampleProducts = [
  {
    name: 'Professional Laptop',
    description: 'High-performance laptop for professionals with 16GB RAM and 512GB SSD',
    price: 1299.99,
    image: 'https://via.placeholder.com/400?text=Professional+Laptop',
    category: 'Electronics',
    stock: 45,
    sku: 'LAPTOP-001'
  },
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling wireless headphones with 30-hour battery',
    price: 249.99,
    image: 'https://via.placeholder.com/400?text=Wireless+Headphones',
    category: 'Electronics',
    stock: 120,
    sku: 'HEAD-001'
  },
  {
    name: 'USB-C Hub',
    description: 'Multi-port USB-C hub with 7 ports including HDMI and card reader',
    price: 49.99,
    image: 'https://via.placeholder.com/400?text=USB-C+Hub',
    category: 'Accessories',
    stock: 200,
    sku: 'HUB-001'
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with customizable switches',
    price: 129.99,
    image: 'https://via.placeholder.com/400?text=Mechanical+Keyboard',
    category: 'Peripherals',
    stock: 85,
    sku: 'KEY-001'
  },
  {
    name: '4K Webcam',
    description: '4K resolution webcam with auto-focus and built-in microphone',
    price: 199.99,
    image: 'https://via.placeholder.com/400?text=4K+Webcam',
    category: 'Electronics',
    stock: 60,
    sku: 'CAM-001'
  },
  {
    name: 'Monitor Stand',
    description: 'Adjustable monitor stand with storage compartment',
    price: 79.99,
    image: 'https://via.placeholder.com/400?text=Monitor+Stand',
    category: 'Accessories',
    stock: 150,
    sku: 'STAND-001'
  }
];

// Sample customers
const sampleCustomers = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'New York',
    country: 'United States',
    zipCode: '10001'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 234-5678',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    country: 'United States',
    zipCode: '90001'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 (555) 345-6789',
    address: '789 Pine Road',
    city: 'Chicago',
    country: 'United States',
    zipCode: '60601'
  },
  {
    name: 'Emily Williams',
    email: 'emily.williams@example.com',
    phone: '+1 (555) 456-7890',
    address: '321 Maple Lane',
    city: 'Houston',
    country: 'United States',
    zipCode: '77001'
  },
  {
    name: 'David Brown',
    email: 'david.brown@example.com',
    phone: '+1 (555) 567-8901',
    address: '654 Elm Street',
    city: 'Phoenix',
    country: 'United States',
    zipCode: '85001'
  }
];

async function populateDatabase() {
  console.log('🚀 Starting direct Firestore population...\n');

  try {
    // Add products
    console.log('📦 Adding sample products to Firestore...');
    const productIds = [];
    for (const product of sampleProducts) {
      const docRef = await db.collection('products').add({
        ...product,
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      productIds.push(docRef.id);
      console.log(`   ✅ Added: ${product.name}`);
    }
    console.log();

    // Add customers
    console.log('👥 Adding sample customers to Firestore...');
    const customerIds = [];
    for (const customer of sampleCustomers) {
      const docRef = await db.collection('customers').add({
        ...customer,
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      customerIds.push(docRef.id);
      console.log(`   ✅ Added: ${customer.name}`);
    }
    console.log();

    // Create orders
    console.log('📋 Creating sample orders...');
    const orderStatuses = ['pending', 'completed', 'cancelled'];
    
    for (let i = 0; i < 5; i++) {
      const customerId = customerIds[i % customerIds.length];
      const items = [];
      let total = 0;

      // Add 1-2 items to each order
      const numItems = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < numItems; j++) {
        const productIndex = (i * 2 + j) % productIds.length;
        const product = sampleProducts[productIndex];
        const quantity = Math.floor(Math.random() * 3) + 1;
        items.push({
          productId: productIds[productIndex],
          productName: product.name,
          quantity,
          price: product.price
        });
        total += product.price * quantity;
      }

      const docRef = await db.collection('orders').add({
        customerId,
        items,
        total: parseFloat(total.toFixed(2)),
        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`   ✅ Created order ${docRef.id} for customer ${customerIds[i % customerIds.length]}`);
    }
    console.log();

    console.log('✨ Sample data population complete!\n');
    console.log('📊 Summary:');
    console.log(`   - ${productIds.length} products added`);
    console.log(`   - ${customerIds.length} customers added`);
    console.log(`   - 5 sample orders created\n`);
    console.log('🎉 Go to http://localhost:3000/admin to view all data!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

populateDatabase();
