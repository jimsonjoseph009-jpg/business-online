const { db, admin } = require('../config/firebase');
const { mockCustomers } = require('../data/mockData');

const customerService = {
  // Get all customers for user
  getAll: async (userId) => {
    try {
      // Try Firestore first
      const snapshot = await db.collection('customers')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      // Fallback to mock data for development
      console.log('Firestore error, using mock data:', error.message);
      return mockCustomers;
    }
  },

  // Get single customer
  getById: async (customerId, userId) => {
    try {
      const doc = await db.collection('customers').doc(customerId).get();
      
      if (!doc.exists) {
        throw {
          status: 404,
          message: 'Customer not found',
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
        message: 'Failed to fetch customer',
        code: 'FETCH_ERROR',
        details: error.message
      };
    }
  },

  // Create customer
  create: async (customerData, userId) => {
    try {
      const docRef = await db.collection('customers').add({
        ...customerData,
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw {
        status: 500,
        message: 'Failed to create customer',
        code: 'CREATE_ERROR',
        details: error.message
      };
    }
  },

  // Update customer
  update: async (customerId, customerData, userId) => {
    try {
      const doc = await db.collection('customers').doc(customerId).get();
      
      if (!doc.exists) {
        throw {
          status: 404,
          message: 'Customer not found',
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

      await db.collection('customers').doc(customerId).update({
        ...customerData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const updated = await db.collection('customers').doc(customerId).get();
      return { id: updated.id, ...updated.data() };
    } catch (error) {
      if (error.status) throw error;
      throw {
        status: 500,
        message: 'Failed to update customer',
        code: 'UPDATE_ERROR',
        details: error.message
      };
    }
  },

  // Delete customer
  delete: async (customerId, userId) => {
    try {
      const doc = await db.collection('customers').doc(customerId).get();
      
      if (!doc.exists) {
        throw {
          status: 404,
          message: 'Customer not found',
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

      await db.collection('customers').doc(customerId).delete();
      return { success: true };
    } catch (error) {
      if (error.status) throw error;
      throw {
        status: 500,
        message: 'Failed to delete customer',
        code: 'DELETE_ERROR',
        details: error.message
      };
    }
  }
};

module.exports = customerService;
