import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
    const userInfo = localStorage.getItem('userInfo');
    const token = localStorage.getItem('token');

    if (!userInfo || !token) {
        // Not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userInfo);
        if (allowedRole && user.role !== allowedRole) {
            // Logged in but wrong role, redirect to appropriate dashboard or home
            return <Navigate to={`/dashboard/${user.role}`} replace />;
        }
    } catch (e) {
        // Invalid JSON, clear and redirect
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
