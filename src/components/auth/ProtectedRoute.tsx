import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/AuthenticationTypes';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, hasRole } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login page but save the current location they were trying to go to
        return <Navigate to="/" state={{ from: location, showAuth: true }} replace />;
    }

    if (allowedRoles && !hasRole(allowedRoles)) {
        // Redirect to home if they don't have the required role
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
