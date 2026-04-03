import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    // 1. Loading State
    if (loading) {
        return (
            <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-400 font-bold uppercase tracking-widest text-[10px]">Securing Connection...</p>
            </div>
        );
    }

    // DEBUG LOG: This helps us see what the gatekeeper sees
    console.log("GUARD CHECK:", {
        path: location.pathname,
        userRole: user?.role,
        allowed: allowedRoles,
        isAuthorized: allowedRoles ? allowedRoles.includes(user?.role) : true
    });

    // 2. No User logged in
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Role Authorization Check
    // We check if allowedRoles exists and if the user's role is inside that array
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn("UNAUTHORIZED ACCESS ATTEMPT:", user.role, "tried to access", location.pathname);
        return <Navigate to="/" replace />;
    }

    // 4. Authorized - Grant Access
    return children;
};

export default ProtectedRoute;