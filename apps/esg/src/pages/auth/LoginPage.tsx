import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginTemplate } from '@repo/moornmo-ui/components';
import { useAuth } from '@esg/hooks/auth/useAuth';
import { debugCookieState } from '@esg/utils/auth';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, authState, isAuthChecking } = useAuth();
    const loginContainerRef = useRef<HTMLDivElement>(null);

    // Debug logging in development
    useEffect(() => {
        if (import.meta.env.DEV) {
            console.log('🔐 LoginPage - Auth State:', {
                isAuthenticated,
                hasClientCookie: authState?.hasClientCookie,
                serverAuthStatus: authState?.serverAuthStatus,
                isAuthChecking,
                isLoading: authState?.isLoading,
                lastChecked: authState?.lastChecked ? new Date(authState.lastChecked).toISOString() : null,
                error: authState?.error
            });

            // Also show cookie debug info
            debugCookieState();
        }
    }, [isAuthenticated, authState, isAuthChecking]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Focus management for accessibility
    useEffect(() => {
        if (!isAuthenticated && loginContainerRef.current) {
            // Focus the first input field after component mounts
            const firstInput = loginContainerRef.current.querySelector('input[type="email"], input[type="text"]') as HTMLInputElement;
            if (firstInput) {
                setTimeout(() => {
                    firstInput.focus();
                }, 100);
            }
        }
    }, [isAuthenticated]);

    const initialValues = {
        username: '',
        password: '',
    };

    const handleLogin = (values: { username: string; password: string }) => {
        // Convert username to email for the auth service
        login({
            email: values.username,
            password: values.password,
        });
    };

    // Show loading while checking auth status
    if (isAuthChecking && authState?.hasClientCookie) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">인증 상태 확인 중...</span>
                    </div>
                    <p className="mt-2 text-muted">인증 상태를 확인하고 있습니다...</p>
                </div>
            </div>
        );
    }

    // Don't render login form if already authenticated
    if (isAuthenticated) {
        return null;
    }

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-2 p-sm-3"
            style={{
                minHeight: '100vh', // Fallback for older browsers
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {/* Full viewport height container with flexbox centering */}
            <div className="w-100 mx-2 mx-sm-0" style={{ maxWidth: '400px' }}>
                {/* Responsive width container with max-width constraint */}
                <div
                    ref={loginContainerRef}
                    className="bg-white rounded shadow-sm p-3 p-sm-4 p-md-5"
                    role="main"
                    aria-label="로그인 폼"
                    style={{
                        backgroundColor: '#ffffff', // Fallback for bg-white
                        borderRadius: '0.375rem', // Fallback for rounded
                        boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)' // Fallback for shadow-sm
                    }}
                >


                    {/* Login form container with responsive padding */}
                    <LoginTemplate
                        login={handleLogin}
                        initialValues={initialValues}
                        useSignIn={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;