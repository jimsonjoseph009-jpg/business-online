const { db, admin } = require('../config/firebase');

const orderService = {
  // Get all orders for user
  getAll: async (userId) => {
    try {
      const snapshot = await db.collection('orders')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw {
        status: 500,
        message: 'Failed to fetch orders',
        code: 'FETCH_ERROR',
        details: error.message
      };
    }
  },

  // Get single order
  getById: async (orderId, userId) => {
    try {
      const doc = await db.collection('orders').doc(orderId).get();
      
      if (!doc.exists) {
        throw {
          status: 404,
          message: 'Order not found',
          code: 'NOT_FOUND'
        };
      }

      const data = doc.data();
      if (data.userId !== userId) {
        throw {
          status: 403,
          message: 'Access denied',
          code: 'ACCESS_DENIED'
        };
      }

      return { id: doc.id, ...data };
    } catch (error) {
      if (error.status) throw error;
      throw {
        status: 500,
        message: 'Failed to fetch order',
        code: 'FETCH_ERROR',
        details: error.message
      };
    }
  },

  // Create order
  create: async (orderData, userId) => {
    try {
      const docRef = await db.collection('orders').add({
        ...orderData,
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw {
        status: 500,
        message: 'Failed to create order',
        code: 'CREATE_ERROR',
        details: error.message
      };
    }
  },

  // Update order
  update: async (orderId, orderData, userId) => {
    try {
      const doc = await db.collection('orders').doc(orderId).get();
      
      if (!doc.exists) {
        throw {
          status: 404,
          message: 'Order not found',
          code: 'NOT_FOUND'
        };
      }

      if (doc.data().userId !== userId) {
        throw {
          status: 403,
          message: 'Access denied',
          code: 'ACCESS_DENIED'
        };
      }

      await db.collection('orders').doc(orderId).update({
        ...orderData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const updated = await db.collection('orders').doc(orderId).get();
      return { id: updated.id, ...updated.data() };
    } catch (error) {
      if (error.status) throw error;
      throw {
        status: 500,
        message: 'Failed to update order',
        code: 'UPDATE_ERROR',
        details: error.message
      };
    }
  },

  // Delete order
  delete: async (orderId, userId) => {
    try {
      const doc = await db.collection('orders').doc(orderId).get();
      
      if (!doc.exists) {
        throw {
          status: 404,
          message: 'Order not found',
          code: 'NOT_FOUND'
        };
      }

      if (doc.data().userId !== userId) {
        throw {
          status: 403,
          message: 'Access denied',
          code: 'ACCESS_DENIED'
        };
      }

      await db.collection('orders').doc(orderId).delete();
      return { success: true };
    } catch (error) {
      if (error.status) throw error;
      throw {
        status: 500,
        message: 'Failed to delete order',
        code: 'DELETE_ERROR',
        details: error.message
      };
    }
  }
};

module.exports = orderService;
