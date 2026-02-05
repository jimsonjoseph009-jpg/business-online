/**
 * Firebase Storage Service
 * Handles image and file uploads to Firebase Storage
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from '../config/firebase';

export const storageService = {
  // Upload product image
  async uploadProductImage(file, productId) {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `products/${productId}/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw error;
    }
  },

  // Upload review image
  async uploadReviewImage(file, reviewId) {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `reviews/${reviewId}/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading review image:', error);
      throw error;
    }
  },

  // Upload customer avatar
  async uploadCustomerAvatar(file, customerId) {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `customers/${customerId}/avatar/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading customer avatar:', error);
      throw error;
    }
  },

  // Upload invoice PDF
  async uploadInvoice(file, invoiceId) {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `invoices/${invoiceId}/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading invoice:', error);
      throw error;
    }
  },

  // Delete file from storage
  async deleteFile(filePath) {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // Delete product all images
  async deleteProductImages(productId) {
    try {
      const folderRef = ref(storage, `products/${productId}`);
      const fileList = await listAll(folderRef);
      
      const deletePromises = fileList.items.map(itemRef => deleteObject(itemRef));
      await Promise.all(deletePromises);
      
      return true;
    } catch (error) {
      console.error('Error deleting product images:', error);
      throw error;
    }
  },

  // Generic file upload
  async uploadFile(file, folder) {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      return {
        url: downloadURL,
        path: `${folder}/${fileName}`,
        name: file.name,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
};

export default storageService;
