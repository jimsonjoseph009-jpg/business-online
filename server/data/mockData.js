// Mock data storage for development
let mockProducts = [
  {
    id: 'prod_1',
    name: 'Professional Laptop',
    description: 'High-performance laptop for professionals with 16GB RAM and 512GB SSD',
    price: 1299.99,
    image: 'https://via.placeholder.com/400?text=Professional+Laptop',
    category: 'Electronics',
    stock: 45,
    sku: 'LAPTOP-001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod_2',
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling wireless headphones with 30-hour battery',
    price: 249.99,
    image: 'https://via.placeholder.com/400?text=Wireless+Headphones',
    category: 'Electronics',
    stock: 120,
    sku: 'HEAD-001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod_3',
    name: 'USB-C Hub',
    description: 'Multi-port USB-C hub with 7 ports including HDMI and card reader',
    price: 49.99,
    image: 'https://via.placeholder.com/400?text=USB-C+Hub',
    category: 'Accessories',
    stock: 200,
    sku: 'HUB-001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod_4',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with customizable switches',
    price: 129.99,
    image: 'https://via.placeholder.com/400?text=Mechanical+Keyboard',
    category: 'Peripherals',
    stock: 85,
    sku: 'KEY-001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod_5',
    name: '4K Webcam',
    description: '4K resolution webcam with auto-focus and built-in microphone',
    price: 199.99,
    image: 'https://via.placeholder.com/400?text=4K+Webcam',
    category: 'Electronics',
    stock: 60,
    sku: 'CAM-001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod_6',
    name: 'Monitor Stand',
    description: 'Adjustable monitor stand with storage compartment',
    price: 79.99,
    image: 'https://via.placeholder.com/400?text=Monitor+Stand',
    category: 'Accessories',
    stock: 150,
    sku: 'STAND-001',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let mockCustomers = [
  {
    id: 'cust_1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'New York',
    country: 'United States',
    zipCode: '10001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cust_2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 234-5678',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    country: 'United States',
    zipCode: '90001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cust_3',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 (555) 345-6789',
    address: '789 Pine Road',
    city: 'Chicago',
    country: 'United States',
    zipCode: '60601',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cust_4',
    name: 'Emily Williams',
    email: 'emily.williams@example.com',
    phone: '+1 (555) 456-7890',
    address: '321 Maple Lane',
    city: 'Houston',
    country: 'United States',
    zipCode: '77001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cust_5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    phone: '+1 (555) 567-8901',
    address: '654 Elm Street',
    city: 'Phoenix',
    country: 'United States',
    zipCode: '85001',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let mockOrders = [
  {
    id: 'ord_1',
    customerId: 'cust_1',
    items: [
      { productId: 'prod_1', productName: 'Professional Laptop', quantity: 1, price: 1299.99 },
      { productId: 'prod_2', productName: 'Wireless Headphones', quantity: 1, price: 249.99 }
    ],
    total: 1549.98,
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ord_2',
    customerId: 'cust_2',
    items: [
      { productId: 'prod_3', productName: 'USB-C Hub', quantity: 2, price: 49.99 },
      { productId: 'prod_4', productName: 'Mechanical Keyboard', quantity: 1, price: 129.99 }
    ],
    total: 229.97,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ord_3',
    customerId: 'cust_3',
    items: [
      { productId: 'prod_5', productName: '4K Webcam', quantity: 1, price: 199.99 },
      { productId: 'prod_6', productName: 'Monitor Stand', quantity: 1, price: 79.99 }
    ],
    total: 279.98,
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ord_4',
    customerId: 'cust_4',
    items: [
      { productId: 'prod_1', productName: 'Professional Laptop', quantity: 1, price: 1299.99 }
    ],
    total: 1299.99,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ord_5',
    customerId: 'cust_5',
    items: [
      { productId: 'prod_2', productName: 'Wireless Headphones', quantity: 2, price: 249.99 },
      { productId: 'prod_3', productName: 'USB-C Hub', quantity: 1, price: 49.99 }
    ],
    total: 549.97,
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  mockProducts,
  mockCustomers,
  mockOrders
};
