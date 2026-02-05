import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import { auth } from '../config/firebase';
import { getIdToken } from 'firebase/auth';
import { uploadImage } from '../utils/imageUpload';
import ImageUpload from './ImageUpload';
import SearchFilterBar from './SearchFilterBar';
import Pagination from './Pagination';
import { sortItems } from '../utils/searchUtils';
import { getPaginatedItems } from '../utils/paginationUtils';
import { exportToCSV, prepareDataForExport } from '../utils/exportUtils';
import './Products.css';

const Products = () => {
  const { t, currency } = useLocalization();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
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
    fetchProducts();
  }, []);

  useEffect(() => {
    applyAllFilters();
  }, [searchTerm, filters, sortField, sortDirection, allProducts, currentPage]);

  const fetchProducts = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyAllFilters = () => {
    let filtered = allProducts;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sort
    if (sortField) {
      filtered = sortItems(filtered, sortField, sortDirection);
    }

    // Apply pagination
    const paginated = getPaginatedItems(filtered, currentPage, pageSize);
    setProducts(paginated.items);
    
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

      const token = await getIdToken(user);
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' });
        setSelectedImageFile(null);
        fetchProducts();
      } else {
        alert('Failed to save product. Please try again.');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      category: product.category || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchProducts();
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleExport = () => {
    try {
      const exportData = prepareDataForExport(allProducts, ['name', 'category', 'price', 'stock']);
      exportToCSV(exportData, ['name', 'category', 'price', 'stock'], 'products.csv');
    } catch (error) {
      console.error('Error exporting products:', error);
      alert('Failed to export products');
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  const paginationInfo = window.paginationInfo || { 
    totalItems: allProducts.length, 
    totalPages: 1, 
    currentPage: 1, 
    pageSize: 10 
  };

  return (
    <div className="products">
      <div className="page-header">
        <h1>Products</h1>
        <button 
          className="add-button"
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', stock: '', category: '' });
            setShowModal(true);
          }}
        >
          + Add Product
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
        showPriceRange={true}
        onExport={handleExport}
      />

      {products.length === 0 ? (
        <div className="empty-state">
          <p>No products found. {allProducts.length === 0 ? 'Add your first product to get started!' : 'Try adjusting your filters.'}</p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description || 'No description'}</p>
                <div className="product-details">
                  <p><strong>Price:</strong> ${product.price?.toFixed(2) || '0.00'}</p>
                  <p><strong>Stock:</strong> {product.stock || 0}</p>
                  <p><strong>Category:</strong> {product.category || 'Uncategorized'}</p>
                </div>
                <div className="card-actions">
                  <button onClick={() => handleEdit(product)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="delete-button">
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
            <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
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
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
