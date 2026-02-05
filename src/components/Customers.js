import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { customersService } from '../services/firestoreService';
import { storageService } from '../services/storageService';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    imageUrl: ''
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    // Simple filter for search
    if (searchTerm) {
      const filtered = allCustomers.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchTerm))
      );
      setCustomers(filtered);
    } else {
      setCustomers(allCustomers);
    }
  }, [searchTerm, allCustomers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customersService.getAllCustomers();
      setAllCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill in required fields');
      return;
    }

    try {
      setUploadingImage(true);
      let imageUrl = formData.imageUrl;

      // Upload image if a new file is selected
      if (selectedImageFile) {
        try {
          imageUrl = await storageService.uploadCustomerAvatar(
            selectedImageFile,
            editingCustomer?.id || Date.now().toString()
          );
        } catch (error) {
          console.error('Error uploading image:', error);
          // Continue without image
        }
      }

      const customerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        imageUrl: imageUrl || ''
      };

      if (editingCustomer) {
        await customersService.updateCustomer(editingCustomer.id, customerData);
      } else {
        await customersService.addCustomer(customerData);
      }

      setShowModal(false);
      setEditingCustomer(null);
      setFormData({ name: '', email: '', phone: '', address: '', imageUrl: '' });
      setSelectedImageFile(null);
      await fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      imageUrl: customer.imageUrl || ''
    });
    setSelectedImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (file) => {
    setSelectedImageFile(file);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customersService.deleteCustomer(id);
      await fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Failed to delete customer');
    }
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div className="customers">
      <div className="page-header">
        <h1>👥 Customers</h1>
        <p>Manage and track your customers</p>
        <button 
          className="add-button"
          onClick={() => {
            setEditingCustomer(null);
            setFormData({ name: '', email: '', phone: '', address: '', imageUrl: '' });
            setSelectedImageFile(null);
            setShowModal(true);
          }}
        >
          ➕ Add Customer
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {customers.length === 0 ? (
        <div className="empty-state">
          <p>No customers found. {allCustomers.length === 0 ? 'Add your first customer to get started!' : 'Try adjusting your search.'}</p>
        </div>
      ) : (
        <div className="customers-grid">
          {customers.map((customer) => (
            <div key={customer.id} className="customer-card">
              {customer.imageUrl && (
                <img src={customer.imageUrl} alt={customer.name} className="customer-image" />
              )}
              <div className="customer-info">
                <h3>{customer.name}</h3>
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
                <p><strong>Address:</strong> {customer.address || 'N/A'}</p>
              </div>
              <div className="card-actions">
                <button onClick={() => handleEdit(customer)} className="edit-button">
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(customer.id)} className="delete-button">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" className="image-preview" style={{ maxWidth: '100px', marginTop: '10px' }} />
                )}
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="save-button" disabled={uploadingImage}>
                  {uploadingImage ? 'Saving...' : editingCustomer ? 'Update' : 'Add'} Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
