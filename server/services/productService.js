const { db, admin } = require('../config/firebase');

const productService = {
  // Get all products for user
  getAll: async (userId) => {
    try {
      const snapshot = await db.collection('products')
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
        message: 'Failed to fetch products',
        code: 'FETCH_ERROR',
        details: error.message
      };
    }
  },

  // Get single product
  getById: async (productId, userId) => {
    try {
      const doc = await db.collection('products').doc(productId).get();
      
      if (!doc.exists) {
        throw {
          status: 404,
          message: 'Product not found',
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
        message: 'Failed to fetch product',
        code: 'FETCH_ERROR',
        details: error.message
      };
    }
  },

  // Create product
  create: async (productData, userId) => {
    try {
      const docRef = await db.collection('products').add({
        ...productData,
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw {
        status: 500,
        message: 'Failed to create product',
        code: 'CREATE_ERROR',
        details: error.message
      };
    }
  },

  // Update product
  update: async (productId, productData, userId) => {
    try {
      const doc = await db.collection('products').doc(productId).get();
      
      if (!doc.exists) {
        throw {
          status: 404,
          message: 'Product not found',
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

      await db.collection('products').doc(productId).update({
        ...productData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const updated = await db.collection('products').doc(productId).get();
      return { id: updated.id, ...updated.data() };
    } catch (error) {
      if (error.status) throw error;
      throw {
        status: 500,
        message: 'Failed to update product',
        code: 'UPDATE_ERROR',
        details: error.message
      };
    }
  },

  // Delete product
  delete: async (productId, userId) => {
    try {
      const doc = await db.collection('products').doc(productId).get();
      
      if (!doc.exists) {
        throw {
          status: 404,
          message: 'Product not found',
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

      await db.collection('products').doc(productId).delete();
      return { success: true };
    } catch (error) {
      if (error.status) throw error;
      throw {
        status: 500,
        message: 'Failed to delete product',
        code: 'DELETE_ERROR',
        details: error.message
      };
    }
  }
};

module.exports = productService;
