import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Upload an image file to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - Folder path in storage (e.g., 'customers', 'products')
 * @param {string} userId - User ID to organize files by user
 * @returns {Promise<string>} - Download URL of the uploaded image
 */
export const uploadImage = async (file, folder, userId) => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    // Create a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;

    // Create storage reference
    const storageRef = ref(storage, `${folder}/${userId}/${fileName}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload multiple images
 * @param {File[]} files - Array of image files
 * @param {string} folder - Folder path in storage
 * @param {string} userId - User ID
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadMultipleImages = async (files, folder, userId) => {
  try {
    const uploadPromises = Array.from(files).map(file => 
      uploadImage(file, folder, userId)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};
