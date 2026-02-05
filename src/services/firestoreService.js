/**
 * Firestore Database Service
 * Handles all database operations for customers, orders, products, and more
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ============ CUSTOMERS ============
export const customersService = {
  // Add new customer
  async addCustomer(customerData) {
    try {
      const docRef = await addDoc(collection(db, 'customers'), {
        ...customerData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { id: docRef.id, ...customerData };
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  },

  // Get all customers
  async getAllCustomers() {
    try {
      const q = query(
        collection(db, 'customers'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get customer by ID
  async getCustomer(customerId) {
    try {
      const docSnap = await getDoc(doc(db, 'customers', customerId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  // Update customer
  async updateCustomer(customerId, customerData) {
    try {
      await updateDoc(doc(db, 'customers', customerId), {
        ...customerData,
        updatedAt: Timestamp.now()
      });
      return { id: customerId, ...customerData };
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete customer
  async deleteCustomer(customerId) {
    try {
      await deleteDoc(doc(db, 'customers', customerId));
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Search customers by email or name
  async searchCustomers(searchTerm) {
    try {
      const q = query(
        collection(db, 'customers'),
        where('email', '>=', searchTerm),
        where('email', '<=', searchTerm + '\uf8ff')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error searching customers:', error);
      return [];
    }
  }
};

// ============ ORDERS ============
export const ordersService = {
  // Add new order
  async addOrder(orderData) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { id: docRef.id, ...orderData };
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  // Get all orders
  async getAllOrders() {
    try {
      const q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order by ID
  async getOrder(orderId) {
    try {
      const docSnap = await getDoc(doc(db, 'orders', orderId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Get orders by customer ID
  async getOrdersByCustomer(customerId) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }
  },

  // Update order
  async updateOrder(orderId, orderData) {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        ...orderData,
        updatedAt: Timestamp.now()
      });
      return { id: orderId, ...orderData };
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  // Delete order
  async deleteOrder(orderId) {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Get orders by status
  async getOrdersByStatus(status) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return [];
    }
  }
};

// ============ PRODUCTS ============
export const productsService = {
  // Add new product
  async addProduct(productData) {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { id: docRef.id, ...productData };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Get all products
  async getAllProducts() {
    try {
      const q = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  async getProduct(productId) {
    try {
      const docSnap = await getDoc(doc(db, 'products', productId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(productId, productData) {
    try {
      await updateDoc(doc(db, 'products', productId), {
        ...productData,
        updatedAt: Timestamp.now()
      });
      return { id: productId, ...productData };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(productId) {
    try {
      await deleteDoc(doc(db, 'products', productId));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Update product stock
  async updateStock(productId, quantity) {
    try {
      await updateDoc(doc(db, 'products', productId), {
        stock: quantity,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }
};

// ============ INVOICES ============
export const invoicesService = {
  // Add new invoice
  async addInvoice(invoiceData) {
    try {
      const docRef = await addDoc(collection(db, 'invoices'), {
        ...invoiceData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { id: docRef.id, ...invoiceData };
    } catch (error) {
      console.error('Error adding invoice:', error);
      throw error;
    }
  },

  // Get all invoices
  async getAllInvoices() {
    try {
      const q = query(
        collection(db, 'invoices'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  // Get invoice by ID
  async getInvoice(invoiceId) {
    try {
      const docSnap = await getDoc(doc(db, 'invoices', invoiceId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  // Update invoice
  async updateInvoice(invoiceId, invoiceData) {
    try {
      await updateDoc(doc(db, 'invoices', invoiceId), {
        ...invoiceData,
        updatedAt: Timestamp.now()
      });
      return { id: invoiceId, ...invoiceData };
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  // Delete invoice
  async deleteInvoice(invoiceId) {
    try {
      await deleteDoc(doc(db, 'invoices', invoiceId));
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
};

// ============ REVIEWS ============
export const reviewsService = {
  // Add new review
  async addReview(reviewData) {
    try {
      const docRef = await addDoc(collection(db, 'reviews'), {
        ...reviewData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { id: docRef.id, ...reviewData };
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  // Get reviews by product
  async getProductReviews(productId) {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('productId', '==', productId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      return [];
    }
  },

  // Update review (mark helpful, verify purchase, etc.)
  async updateReview(reviewId, reviewData) {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        ...reviewData,
        updatedAt: Timestamp.now()
      });
      return { id: reviewId, ...reviewData };
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  // Delete review
  async deleteReview(reviewId) {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
};

export default {
  customersService,
  ordersService,
  productsService,
  invoicesService,
  reviewsService
};
