import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { getIdToken } from 'firebase/auth';
import SearchFilterBar from './SearchFilterBar';
import Pagination from './Pagination';
import { sortItems } from '../utils/searchUtils';
import { getPaginatedItems } from '../utils/paginationUtils';
import { getAllRoles, getRoleDisplayName, getRoleDescription } from '../utils/roleUtils';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [formData, setFormData] = useState({
    email: '',
    role: 'staff',
    status: 'active'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyAllFilters();
  }, [searchTerm, allUsers, currentPage]);

  const fetchUsers = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyAllFilters = () => {
    let filtered = allUsers;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    const paginated = getPaginatedItems(filtered, currentPage, pageSize);
    setUsers(paginated.items);

    window.paginationInfo = {
      totalItems: paginated.totalItems,
      totalPages: paginated.totalPages,
      currentPage: paginated.currentPage,
      pageSize: paginated.pageSize,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingUser(null);
        setFormData({ email: '', role: 'staff', status: 'active' });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  const paginationInfo = window.paginationInfo || { 
    totalItems: allUsers.length, 
    totalPages: 1, 
    currentPage: 1, 
    pageSize: 10 
  };

  return (
    <div className="users">
      <div className="page-header">
        <h1>👥 User Management</h1>
        <button 
          className="add-button"
          onClick={() => {
            setEditingUser(null);
            setFormData({ email: '', role: 'staff', status: 'active' });
            setShowModal(true);
          }}
        >
          + Add User
        </button>
      </div>

      <SearchFilterBar
        onSearch={setSearchTerm}
        onFilter={() => {}}
        onSort={() => {}}
      />

      {users.length === 0 ? (
        <div className="empty-state">
          <p>No users found.</p>
        </div>
      ) : (
        <>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="email-cell">{user.email}</td>
                    <td>
                      <span className="role-badge" title={getRoleDescription(user.role)}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setFormData({
                              email: user.email,
                              role: user.role,
                              status: user.status
                            });
                            setShowModal(true);
                          }}
                          className="edit-button-small"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="delete-button-small"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={!!editingUser}
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  {getAllRoles().map(role => (
                    <option key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
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

export default Users;
