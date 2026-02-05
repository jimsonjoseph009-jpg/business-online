import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import './RBAC.css';

const RBAC = () => {
  const { t } = useLocalization();
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Admin',
      description: 'Full system access',
      permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'view_reports', 'system_settings'],
      userCount: 2,
      color: '#d32f2f'
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Business operations management',
      permissions: ['create', 'read', 'update', 'view_reports', 'manage_inventory'],
      userCount: 5,
      color: '#f57c00'
    },
    {
      id: 3,
      name: 'Staff',
      description: 'Day-to-day operations',
      permissions: ['read', 'update', 'create_orders'],
      userCount: 15,
      color: '#fbc02d'
    },
    {
      id: 4,
      name: 'Viewer',
      description: 'Read-only access',
      permissions: ['read'],
      userCount: 8,
      color: '#1976d2'
    },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@business.com', role: 'Admin', status: 'active', lastLogin: '2024-01-26' },
    { id: 2, name: 'Manager 1', email: 'manager1@business.com', role: 'Manager', status: 'active', lastLogin: '2024-01-26' },
    { id: 3, name: 'Staff Member 1', email: 'staff1@business.com', role: 'Staff', status: 'active', lastLogin: '2024-01-25' },
    { id: 4, name: 'Viewer User', email: 'viewer@business.com', role: 'Viewer', status: 'inactive', lastLogin: '2024-01-20' },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, user: 'Admin User', action: 'Create Product', resource: 'Laptop Pro', timestamp: '2024-01-26 14:32:00', status: 'success' },
    { id: 2, user: 'Manager 1', action: 'Update Order', resource: 'Order #5678', timestamp: '2024-01-26 14:28:00', status: 'success' },
    { id: 3, user: 'Staff Member 1', action: 'Delete Payment', resource: 'Payment #1234', timestamp: '2024-01-26 14:15:00', status: 'denied' },
    { id: 4, user: 'Admin User', action: 'Change User Role', resource: 'John Smith', timestamp: '2024-01-26 13:45:00', status: 'success' },
  ]);

  const [selectedTab, setSelectedTab] = useState('roles');
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const allPermissions = [
    'create', 'read', 'update', 'delete', 'manage_users', 'view_reports',
    'system_settings', 'manage_inventory', 'create_orders', 'manage_payments'
  ];

  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowModal(true);
  };

  const handleSaveRole = (updatedRole) => {
    if (editingRole) {
      setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
    } else {
      setRoles([...roles, { ...updatedRole, id: Date.now(), userCount: 0 }]);
    }
    setShowModal(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm(t('rbac', 'confirmDeleteRole'))) {
      setRoles(roles.filter(r => r.id !== roleId));
    }
  };

  return (
    <div className="rbac">
      <div className="page-header">
        <h1>🔐 {t('rbac', 'title')}</h1>
        <p>{t('rbac', 'description')}</p>
      </div>

      {/* Tab Navigation */}
      <div className="rbac-tabs">
        <button
          className={`tab-btn ${selectedTab === 'roles' ? 'active' : ''}`}
          onClick={() => setSelectedTab('roles')}
        >
          {t('rbac', 'roles')}
        </button>
        <button
          className={`tab-btn ${selectedTab === 'users' ? 'active' : ''}`}
          onClick={() => setSelectedTab('users')}
        >
          {t('rbac', 'users')}
        </button>
        <button
          className={`tab-btn ${selectedTab === 'audit' ? 'active' : ''}`}
          onClick={() => setSelectedTab('audit')}
        >
          {t('rbac', 'auditLogs')}
        </button>
      </div>

      {/* Roles Section */}
      {selectedTab === 'roles' && (
        <div className="rbac-content">
          <div className="section-header">
            <h2>{t('rbac', 'roles')}</h2>
            <button className="btn-primary" onClick={() => {
              setEditingRole(null);
              setShowModal(true);
            }}>
              + {t('rbac', 'addRole')}
            </button>
          </div>

          <div className="roles-grid">
            {roles.map((role) => (
              <div key={role.id} className="role-card" style={{ borderLeft: `4px solid ${role.color}` }}>
                <div className="role-header">
                  <h3>{role.name}</h3>
                  <span className="user-count">{role.userCount} {t('rbac', 'users')}</span>
                </div>
                <p className="role-description">{role.description}</p>
                <div className="permissions-list">
                  <h4>{t('rbac', 'permissions')}:</h4>
                  <div className="permissions">
                    {role.permissions.map((perm) => (
                      <span key={perm} className="permission-badge">{t('rbac', perm)}</span>
                    ))}
                  </div>
                </div>
                <div className="role-actions">
                  <button className="btn-small" onClick={() => handleEditRole(role)}>{t('common', 'edit')}</button>
                  <button className="btn-small danger" onClick={() => handleDeleteRole(role.id)}>{t('common', 'delete')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Section */}
      {selectedTab === 'users' && (
        <div className="rbac-content">
          <h2>{t('rbac', 'users')}</h2>
          <table className="users-table">
            <thead>
              <tr>
                <th>{t('common', 'name')}</th>
                <th>{t('common', 'email')}</th>
                <th>{t('rbac', 'role')}</th>
                <th>{t('common', 'status')}</th>
                <th>{t('rbac', 'lastLogin')}</th>
                <th>{t('common', 'actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select defaultValue={user.role} className="role-select">
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>{role.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? '●' : '○'} {user.status}
                    </span>
                  </td>
                  <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-small">{t('common', 'edit')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Audit Logs Section */}
      {selectedTab === 'audit' && (
        <div className="rbac-content">
          <h2>{t('rbac', 'auditLogs')}</h2>
          <table className="audit-table">
            <thead>
              <tr>
                <th>{t('common', 'user')}</th>
                <th>{t('rbac', 'action')}</th>
                <th>{t('rbac', 'resource')}</th>
                <th>{t('rbac', 'timestamp')}</th>
                <th>{t('common', 'status')}</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.resource}</td>
                  <td>{log.timestamp}</td>
                  <td>
                    <span className={`audit-status ${log.status}`}>
                      {log.status === 'success' ? '✓' : '✗'} {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Role Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingRole ? t('common', 'edit') : t('rbac', 'addRole')}</h3>
            <RoleForm
              role={editingRole}
              allPermissions={allPermissions}
              onSave={handleSaveRole}
              onCancel={() => setShowModal(false)}
              t={t}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const RoleForm = ({ role, allPermissions, onSave, onCancel, t }) => {
  const [formData, setFormData] = useState(
    role || {
      name: '',
      description: '',
      permissions: [],
      color: '#1976d2'
    }
  );

  const handlePermissionToggle = (permission) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(permission)
        ? formData.permissions.filter(p => p !== permission)
        : [...formData.permissions, permission]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="role-form">
      <div className="form-group">
        <label>{t('common', 'name')}</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>{t('common', 'description')}</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>{t('rbac', 'permissions')}</label>
        <div className="permissions-grid">
          {allPermissions.map((perm) => (
            <label key={perm} className="permission-checkbox">
              <input
                type="checkbox"
                checked={formData.permissions.includes(perm)}
                onChange={() => handlePermissionToggle(perm)}
              />
              {t('rbac', perm)}
            </label>
          ))}
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">{t('common', 'save')}</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>{t('common', 'cancel')}</button>
      </div>
    </form>
  );
};

export default RBAC;
