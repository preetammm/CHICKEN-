import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Verifying...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // If roles are specified, check if user has permission
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect based on their actua role, or home
        if (userRole === 'admin') return <Navigate to="/admin" />;
        if (userRole === 'shopkeeper') return <Navigate to="/shop" />;
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
