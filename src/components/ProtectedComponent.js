import React from 'react';
import { hasPermission } from '../utils/roleUtils';

/**
 * ProtectedComponent - Renders content only if user has required permission
 * @param {Object} props
 * @param {String} props.permission - Required permission
 * @param {Array} props.permissions - Multiple permissions (any)
 * @param {String} props.userRole - Current user's role
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {React.ReactNode} props.fallback - Fallback content if not authorized
 */
const ProtectedComponent = ({
  permission,
  permissions,
  userRole,
  children,
  fallback = null
}) => {
  let isAuthorized = false;

  if (permission) {
    isAuthorized = hasPermission(userRole, permission);
  } else if (permissions && Array.isArray(permissions)) {
    isAuthorized = permissions.some(p => hasPermission(userRole, p));
  }

  return isAuthorized ? children : fallback;
};

export default ProtectedComponent;

/**
 * usePermission Hook
 * @param {String} userRole - Current user's role
 * @returns {Object} Permission checker functions
 */
export const usePermission = (userRole) => {
  return {
    has: (permission) => hasPermission(userRole, permission),
    can: (permission) => hasPermission(userRole, permission),
    cannot: (permission) => !hasPermission(userRole, permission),
  };
};
