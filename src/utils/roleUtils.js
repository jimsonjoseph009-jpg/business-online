/**
 * Role-Based Access Control (RBAC) Utilities
 * Manages user roles and permissions
 */

// Define user roles and their permissions
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  CUSTOMER: 'customer'
};

// Define permissions for each role
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'view_dashboard',
    'view_analytics',
    'manage_customers',
    'manage_products',
    'manage_orders',
    'manage_users',
    'manage_roles',
    'export_data',
    'settings',
    'view_reports',
    'send_emails'
  ],
  [ROLES.MANAGER]: [
    'view_dashboard',
    'view_analytics',
    'manage_customers',
    'manage_products',
    'manage_orders',
    'export_data',
    'view_reports'
  ],
  [ROLES.STAFF]: [
    'view_dashboard',
    'manage_customers',
    'manage_orders',
    'view_products'
  ],
  [ROLES.CUSTOMER]: [
    'view_profile',
    'view_orders',
    'create_orders'
  ]
};

/**
 * Check if user has a specific permission
 * @param {String} userRole - User's role
 * @param {String} permission - Permission to check
 * @returns {Boolean}
 */
export const hasPermission = (userRole, permission) => {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};

/**
 * Check if user has any of the provided permissions
 * @param {String} userRole - User's role
 * @param {Array} permissions - Permissions to check
 * @returns {Boolean}
 */
export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

/**
 * Check if user has all provided permissions
 * @param {String} userRole - User's role
 * @param {Array} permissions - Permissions to check
 * @returns {Boolean}
 */
export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

/**
 * Get all permissions for a role
 * @param {String} role - User role
 * @returns {Array}
 */
export const getPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Get role display name
 * @param {String} role - Role key
 * @returns {String}
 */
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.MANAGER]: 'Manager',
    [ROLES.STAFF]: 'Staff',
    [ROLES.CUSTOMER]: 'Customer'
  };
  return displayNames[role] || role;
};

/**
 * Get role description
 * @param {String} role - Role key
 * @returns {String}
 */
export const getRoleDescription = (role) => {
  const descriptions = {
    [ROLES.ADMIN]: 'Full access to all features and settings',
    [ROLES.MANAGER]: 'Access to most features, limited settings',
    [ROLES.STAFF]: 'Access to basic operations and customers',
    [ROLES.CUSTOMER]: 'Limited access, can view profile and orders'
  };
  return descriptions[role] || 'Standard user role';
};

/**
 * Get all available roles
 * @returns {Array}
 */
export const getAllRoles = () => {
  return Object.values(ROLES);
};

/**
 * Check if role can be assigned (Admin only for now)
 * @param {String} userRole - Current user's role
 * @param {String} targetRole - Role to assign
 * @returns {Boolean}
 */
export const canAssignRole = (userRole, targetRole) => {
  if (userRole === ROLES.ADMIN) {
    return true;
  }
  if (userRole === ROLES.MANAGER && (targetRole === ROLES.STAFF || targetRole === ROLES.CUSTOMER)) {
    return true;
  }
  return false;
};

/**
 * Filter items based on user permissions
 * @param {Array} items - Items to filter
 * @param {String} userRole - User's role
 * @param {String} requiredPermission - Required permission
 * @returns {Array}
 */
export const filterByPermission = (items, userRole, requiredPermission) => {
  if (!hasPermission(userRole, requiredPermission)) {
    return [];
  }
  return items;
};
