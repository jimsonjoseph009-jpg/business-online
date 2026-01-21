import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { getIdToken } from 'firebase/auth';
import { uploadImage } from '../utils/imageUpload';
import ImageUpload from './ImageUpload';
import SearchFilterBar from './SearchFilterBar';
import Pagination from './Pagination';
import { applyFilters, sortItems } from '../utils/searchUtils';
import { getPaginatedItems } from '../utils/paginationUtils';
import { exportToCSV, prepareDataForExport } from '../utils/exportUtils';
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
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    applyAllFilters();
  }, [searchTerm, filters, sortField, sortDirection, allCustomers, currentPage]);

  const fetchCustomers = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);
      const response = await fetch('/api/customers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setAllCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyAllFilters = () => {
    let filtered = allCustomers;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchTerm))
      );
    }

    // Apply sort
    if (sortField) {
      filtered = sortItems(filtered, sortField, sortDirection);
    }

    // Apply pagination
    const paginated = getPaginatedItems(filtered, currentPage, pageSize);
    setCustomers(paginated.items);
    
    // Store pagination info
    window.paginationInfo = {
      totalItems: paginated.totalItems,
      totalPages: paginated.totalPages,
      currentPage: paginated.currentPage,
      pageSize: paginated.pageSize,
      hasNextPage: paginated.hasNextPage,
      hasPrevPage: paginated.hasPrevPage,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) return;

      setUploadingImage(true);
      let imageUrl = formData.imageUrl;

      // Upload image if a new file is selected
      if (selectedImageFile) {
        try {
          imageUrl = await uploadImage(selectedImageFile, 'customers', user.uid);
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image. Please try again.');
          setUploadingImage(false);
          return;
        }
      }

      const token = await getIdToken(user);
      const url = editingCustomer 
        ? `/api/customers/${editingCustomer.id}`
        : '/api/customers';
      
      const method = editingCustomer ? 'PUT' : 'POST';

      const customerData = {
        ...formData,
        imageUrl
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingCustomer(null);
        setFormData({ name: '', email: '', phone: '', address: '', imageUrl: '' });
        setSelectedImageFile(null);
        fetchCustomers();
      }
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
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchCustomers();
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleExport = () => {
    try {
      const exportData = prepareDataForExport(allCustomers, ['name', 'email', 'phone', 'address']);
      exportToCSV(exportData, ['name', 'email', 'phone', 'address'], 'customers.csv');
    } catch (error) {
      console.error('Error exporting customers:', error);
      alert('Failed to export customers');
    }
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  const paginationInfo = window.paginationInfo || { 
    totalItems: allCustomers.length, 
    totalPages: 1, 
    currentPage: 1, 
    pageSize: 10 
  };

  return (
    <div className="customers">
      <div className="page-header">
        <h1>Customers</h1>
        <button 
          className="add-button"
          onClick={() => {
            setEditingCustomer(null);
            setFormData({ name: '', email: '', phone: '', address: '', imageUrl: '' });
            setSelectedImageFile(null);
            setShowModal(true);
          }}
        >
          + Add Customer
        </button>
      </div>

      <SearchFilterBar
        onSearch={setSearchTerm}
        onFilter={setFilters}
        onSort={(field, direction) => {
          setSortField(field);
          setSortDirection(direction);
          setCurrentPage(1);
        }}
        showDateRange={false}
        showPriceRange={false}
        onExport={handleExport}
      />

      {customers.length === 0 ? (
        <div className="empty-state">
          <p>No customers found. {allCustomers.length === 0 ? 'Add your first customer to get started!' : 'Try adjusting your filters.'}</p>
        </div>
      ) : (
        <>
          <div className="customers-grid">
            {customers.map((customer) => (
              <div key={customer.id} className="customer-card">
                {customer.imageUrl && (
                  <div className="customer-image-wrapper">
                    <img src={customer.imageUrl} alt={customer.name} className="customer-image" />
                  </div>
                )}
                <div className="customer-info">
                  <h3>{customer.name}</h3>
                  <p><strong>Email:</strong> {customer.email}</p>
                  <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
                  <p><strong>Address:</strong> {customer.address || 'N/A'}</p>
                </div>
                <div className="card-actions">
                  <button onClick={() => handleEdit(customer)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(customer.id)} className="delete-button">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {paginationInfo.totalPages > 1 && (
            <Pagination
              currentPage={paginationInfo.currentPage}
              totalPages={paginationInfo.totalPages}
              totalItems={paginationInfo.totalItems}
              pageSize={paginationInfo.pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Profile Picture</label>
                <ImageUpload
                  currentImage={formData.imageUrl}
                  onImageChange={handleImageChange}
                  folder="customers"
                  userId={auth.currentUser?.uid}
                />
              </div>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="save-button" disabled={uploadingImage}>
                  {uploadingImage ? 'Saving...' : 'Save'}
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
