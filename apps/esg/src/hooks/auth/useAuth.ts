import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, logout } from '@esg/services/authService';
import { LoginPayload, AuthState } from '@esg/types/auth';
import {
    isAuthenticated,
    setupTokenRefresh,
    getInitialAuthState,
    handleAuthError,
    handleNetworkError,
    getFallbackAuthState,
    getAccessToken,
    mightHaveServerCookies,
    DEFAULT_AUTH_CONFIG
} from '@esg/utils/auth';
import { authLogger } from '@esg/utils/logger';
import { setAuthStateUpdater, clearAuthStateUpdater } from '@esg/utils/apiClient';
import { useSnackbarNotifier } from '@esg/hooks/utils/UseSnackBar';
import { useEffect, useState } from 'react';

export const useAuth = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [authState, setAuthState] = useState<AuthState>(getInitialAuthState);

    // Safe snackbar usage - handle case where provider might not be available
    let showSnackbar: any;
    try {
        const snackbarNotifier = useSnackbarNotifier();
        showSnackbar = snackbarNotifier.showSnackbar;
    } catch (error) {
        // Fallback to console.log if SnackbarProvider is not available
        showSnackbar = ({ message, severity }: { message: string; severity: string }) => {
            console.log(`[${severity.toUpperCase()}] ${message}`);
        };
    }

    // Setup automatic token refresh and auth state updater
    useEffect(() => {
        if (isAuthenticated(authState)) {
            setupTokenRefresh();
        }

        // Register auth state updater for API client
        const handleAuthStateUpdate = (isAuth: boolean) => {
            setAuthState(prev => ({
                ...prev,
                hasClientCookie: isAuth,
                serverAuthStatus: isAuth,
                lastChecked: Date.now(),
                isLoading: false
            }));
        };

        setAuthStateUpdater(handleAuthStateUpdate);

        // Cleanup on unmount
        return () => {
            clearAuthStateUpdater();
        };
    }, [authState]);

    // Monitor cookie state changes
    useEffect(() => {
        const checkCookieState = () => {
            const hasClientCookie = !!getAccessToken();
            const mightHaveServer = mightHaveServerCookies();
            const shouldHaveCookie = hasClientCookie || mightHaveServer;

            setAuthState(prev => {
                if (prev.hasClientCookie !== shouldHaveCookie) {
                    authLogger.cookieStateChange(shouldHaveCookie, 'CookieMonitor');
                    authLogger.authStateChange(
                        prev.hasClientCookie ? 'authenticated' : 'unauthenticated',
                        shouldHaveCookie ? 'authenticated' : 'unauthenticated',
                        shouldHaveCookie ? 'Cookie detected or server cookies possible' : 'No cookies detected'
                    );

                    return {
                        ...prev,
                        hasClientCookie: shouldHaveCookie,
                        serverAuthStatus: shouldHaveCookie ? null : false,
                        isLoading: shouldHaveCookie && prev.serverAuthStatus === null,
                        lastChecked: shouldHaveCookie ? prev.lastChecked : Date.now()
                    };
                }
                return prev;
            });
        };

        // Check cookie state periodically
        const interval = setInterval(checkCookieState, DEFAULT_AUTH_CONFIG.cookieCheckInterval);
        return () => clearInterval(interval);
    }, []);

    // Cookie-based authentication check (no server verify API needed)
    // We'll detect auth status from actual API responses (401 = unauthenticated)

    // Update auth state when cookies are detected
    useEffect(() => {
        const hasClientCookie = !!getAccessToken();
        const mightHaveServer = mightHaveServerCookies();

        if (hasClientCookie || mightHaveServer) {
            setAuthState(prev => ({
                ...prev,
                serverAuthStatus: true, // Assume authenticated if we have cookies
                isLoading: false,
                lastChecked: Date.now()
            }));
        }
    }, []);

    // JWT 세션 기반 로그인 mutation
    const loginMutation = useMutation({
        mutationFn: (payload: LoginPayload) => login(payload),
        onSuccess: (data) => {
            console.log('로그인 성공:', data);

            // 1. 인증 상태 즉시 업데이트
            setAuthState(prev => ({
                ...prev,
                hasClientCookie: true,
                serverAuthStatus: true,
                lastChecked: Date.now(),
                isLoading: false,
                error: undefined
            }));

            // 2. React Query 캐시 업데이트
            if (data.user) {
                queryClient.setQueryData(['currentUser'], data.user);
            }

            // 3. 성공 메시지 표시
            showSnackbar({
                message: `환영합니다, ${data.user?.name || data.user?.username || '사용자'}님!`,
                severity: 'success',
                duration: 3000,
            });

            // 4. 토큰 자동 갱신 설정
            setupTokenRefresh();

            // 5. 의도된 페이지로 이동
            const intendedPath = sessionStorage.getItem('intendedPath') || '/';
            sessionStorage.removeItem('intendedPath');
            navigate(intendedPath);
        },
        onError: (error: any) => {
            console.error('로그인 실패:', error);

            // 인증 상태 업데이트
            setAuthState(prev => ({
                ...prev,
                hasClientCookie: false,
                serverAuthStatus: false,
                lastChecked: Date.now(),
                isLoading: false,
                error: handleAuthError(error)
            }));

            const errorMessage = error.message || '로그인에 실패했습니다.';
            showSnackbar({
                message: errorMessage,
                severity: 'error',
                duration: 4000,
            });
        },
    });

    // JWT 세션 기반 로그아웃 mutation
    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            console.log('로그아웃 성공');

            // 1. 인증 상태 클리어
            setAuthState({
                hasClientCookie: false,
                serverAuthStatus: false,
                lastChecked: Date.now(),
                isLoading: false
            });

            // 2. 모든 캐시 데이터 클리어
            queryClient.clear();

            // 3. 로그아웃 메시지 표시
            showSnackbar({
                message: '로그아웃되었습니다.',
                severity: 'info',
                duration: 3000,
            });

            // 4. 로그인 페이지로 이동
            navigate('/login');
        },
        onError: (error) => {
            console.error('로그아웃 실패:', error);

            // API 실패해도 로컬 데이터는 클리어하고 리다이렉트
            setAuthState({
                hasClientCookie: false,
                serverAuthStatus: false,
                lastChecked: Date.now(),
                isLoading: false,
                error: handleNetworkError(error)
            });

            queryClient.clear();
            navigate('/login');
        },
    });

    const handleLogin = (payload: LoginPayload) => {
        loginMutation.mutate(payload);
    };

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return {
        // Login/Logout functions
        login: handleLogin,
        logout: handleLogout,

        // Loading states
        isLoggingIn: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,

        // Enhanced auth status
        isAuthenticated: isAuthenticated(authState),
        isAuthChecking: authState.isLoading,
        authState, // Expose full auth state for debugging

        // Error states
        loginError: loginMutation.error,
        logoutError: logoutMutation.error,
        authError: authState.error,
    };
};