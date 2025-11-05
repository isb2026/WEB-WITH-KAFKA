import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@esg/hooks/auth/useAuth';
import LoadingFallback from '@esg/components/common/LoadingFallback';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isAuthChecking } = useAuth();
    const location = useLocation();

    useEffect(() => {
        // Store intended path for redirect after login
        if (!isAuthenticated && location.pathname !== '/login') {
            sessionStorage.setItem('intendedPath', location.pathname);
        }
    }, [isAuthenticated, location.pathname]);

    // Show loading while checking authentication
    if (isAuthChecking) {
        return <LoadingFallback />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render protected content
    return <>{children}</>;
};

export default ProtectedRoute;