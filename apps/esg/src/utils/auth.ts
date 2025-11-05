// utils/auth.ts - Enhanced cookie-based authentication with server validation

import { AuthError, AuthState, AuthCheckResult } from '@esg/types/auth';

export const TOKEN_COOKIE_NAME = 'access_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

// Default auth configuration
export const DEFAULT_AUTH_CONFIG = {
	cookieCheckInterval: 1000,     // 1초
	serverCheckInterval: 5 * 60 * 1000, // 5분
	cacheTime: 2 * 60 * 1000,     // 2분
	retryAttempts: 2
};

// Cookie utility functions
export const setCookie = (name: string, value: string, days: number = 7, httpOnly: boolean = false) => {
	const expires = new Date();
	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

	let cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;

	// Note: httpOnly can only be set by server, not client-side JavaScript
	if (httpOnly) {
		console.warn('httpOnly cookies can only be set by server. Ignoring httpOnly flag.');
	}

	if (location.protocol === 'https:') {
		cookieString += '; Secure';
	}

	document.cookie = cookieString;
};

export const getCookie = (name: string): string | null => {
	const nameEQ = name + '=';
	const ca = document.cookie.split(';');

	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
};

export const deleteCookie = (name: string) => {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
};

// Auth token management - JWT 세션 방식
export const saveTokens = (accessToken: string, refreshToken: string, expiresIn?: number) => {
	// JWT 토큰을 sessionStorage에 저장 (브라우저 탭 종료 시 자동 삭제)
	sessionStorage.setItem('accessToken', accessToken);
	sessionStorage.setItem('refreshToken', refreshToken);

	if (expiresIn) {
		const expiryTime = Date.now() + (expiresIn * 1000);
		sessionStorage.setItem('tokenExpiry', expiryTime.toString());
	}

	// 백업용으로 쿠키에도 저장 (보안상 짧은 만료시간)
	setCookie(TOKEN_COOKIE_NAME, accessToken, 1 / 24, false);
	setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, 1, false);
};

export const getAccessToken = (): string | null => {
	// 우선 sessionStorage에서 확인
	const sessionToken = sessionStorage.getItem('accessToken');
	if (sessionToken) {
		return sessionToken;
	}

	// 백업으로 쿠키에서 확인
	return getCookie(TOKEN_COOKIE_NAME);
};

export const getRefreshToken = (): string | null => {
	// 우선 sessionStorage에서 확인
	const sessionToken = sessionStorage.getItem('refreshToken');
	if (sessionToken) {
		return sessionToken;
	}

	// 백업으로 쿠키에서 확인
	return getCookie(REFRESH_TOKEN_COOKIE_NAME);
};

export const getTokenExpiry = (): number | null => {
	const expiry = sessionStorage.getItem('tokenExpiry');
	return expiry ? parseInt(expiry) : null;
};

export const isTokenExpired = (): boolean => {
	const expiry = getTokenExpiry();
	if (!expiry) return false;

	return Date.now() > expiry;
};

export const clearTokens = () => {
	// sessionStorage 클리어
	sessionStorage.removeItem('accessToken');
	sessionStorage.removeItem('refreshToken');
	sessionStorage.removeItem('tokenExpiry');

	// 쿠키 클리어
	deleteCookie(TOKEN_COOKIE_NAME);
	deleteCookie(REFRESH_TOKEN_COOKIE_NAME);
};

// Simplified authentication check - rely on cookies and API responses
export const isAuthenticated = (authState?: AuthState): boolean => {
	// 1. If we have explicit server status from API responses, use that
	if (authState && authState.serverAuthStatus !== null) {
		return authState.serverAuthStatus;
	}

	// 2. Check for any authentication indicators
	const hasClientCookie = !!getAccessToken();
	const mightHaveServer = mightHaveServerCookies();

	// 3. If we have any cookies or recent login, assume authenticated
	// API calls will correct this if we get 401 responses
	return hasClientCookie || mightHaveServer;
};

// Detailed authentication check with confidence level
export const checkAuthenticationStatus = (authState?: AuthState): AuthCheckResult => {
	const hasClientCookie = !!getAccessToken();

	if (!hasClientCookie) {
		return {
			isAuthenticated: false,
			source: 'cookie',
			confidence: 'high'
		};
	}

	if (authState && authState.serverAuthStatus !== null) {
		return {
			isAuthenticated: authState.serverAuthStatus,
			source: 'server',
			confidence: 'high'
		};
	}

	return {
		isAuthenticated: true,
		source: 'cookie',
		confidence: 'medium'
	};
};

// Refresh token function - 새로운 API 엔드포인트 사용
export const refreshAccessToken = async (): Promise<string | null> => {
	const refreshTokenValue = getRefreshToken();

	if (!refreshTokenValue) {
		return null;
	}

	try {
		const response = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/auth/refresh/app`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ refreshToken: refreshTokenValue }),
			}
		);

		if (!response.ok) {
			throw new Error('Refresh failed');
		}

		const res = await response.json();

		if (res.status === 'success' && res.data?.accessToken) {
			// 새로운 토큰들로 업데이트
			saveTokens(res.data.accessToken, res.data.refreshToken, res.data.expiresIn);
			return res.data.accessToken;
		}

		return null;
	} catch (error) {
		console.error('Token refresh failed:', error);
		clearTokens();
		return null;
	}
};

// Auto-refresh token before expiry - 동적 만료시간 기반
export const setupTokenRefresh = () => {
	const checkAndRefresh = async () => {
		if (!isAuthenticated()) return;

		const expiry = getTokenExpiry();
		if (!expiry) return;

		// 만료 5분 전에 갱신
		const refreshTime = expiry - (5 * 60 * 1000);
		const now = Date.now();

		if (now >= refreshTime) {
			console.log('토큰 자동 갱신 시도...');
			await refreshAccessToken();
		}
	};

	// 1분마다 체크
	const interval = setInterval(checkAndRefresh, 60 * 1000);

	// 초기 체크
	checkAndRefresh();

	return () => clearInterval(interval);
};

// Enhanced auth utility functions
export const isAuthError = (error: any): boolean => {
	return error?.response?.status === 401 || error?.response?.status === 403;
};

export const createAuthError = (
	type: AuthError['type'],
	message: string,
	statusCode?: number
): AuthError => {
	return {
		type,
		message,
		statusCode,
		timestamp: Date.now()
	};
};

export const handleNetworkError = (error: any): AuthError => {
	if (!navigator.onLine) {
		return createAuthError('network', '네트워크 연결을 확인해주세요.');
	}

	return createAuthError('server', '서버 연결에 실패했습니다.');
};

export const handleAuthError = (error: any): AuthError => {
	if (error?.response?.status === 401) {
		clearTokens();
		return createAuthError('unauthorized', '인증이 만료되었습니다.', 401);
	}

	if (error?.response?.status === 403) {
		return createAuthError('unauthorized', '접근 권한이 없습니다.', 403);
	}

	return createAuthError('unknown', '인증 확인 중 오류가 발생했습니다.', error?.response?.status);
};

export const getFallbackAuthState = (error: AuthError): boolean => {
	switch (error.type) {
		case 'network':
			// 네트워크 오류 시 쿠키 존재 여부로 판단
			return !!getAccessToken();
		case 'unauthorized':
			// 인증 오류 시 확실히 미인증
			return false;
		case 'server':
			// 서버 오류 시 보수적으로 미인증 처리
			return false;
		default:
			// 알 수 없는 오류 시 쿠키 기준
			return !!getAccessToken();
	}
};

// JWT 세션 기반 인증 상태 확인
export const hasAnyAuthIndicator = (): boolean => {
	// sessionStorage 또는 쿠키에서 토큰 확인
	const hasToken = !!getAccessToken();

	if (hasToken && !isTokenExpired()) {
		return true;
	}

	// 토큰이 만료되었지만 refresh token이 있으면 갱신 가능
	const hasRefreshToken = !!getRefreshToken();
	return hasRefreshToken;
};

// JWT 세션에서는 서버 쿠키보다는 토큰 기반으로 판단
export const mightHaveServerCookies = (): boolean => {
	// JWT 세션 방식에서는 주로 sessionStorage 사용
	// 최근 로그인이 있고 refresh token이 있으면 세션 유지 가능
	const lastLoginTime = localStorage.getItem('lastLoginTime');
	const hasRefreshToken = !!getRefreshToken();

	if (lastLoginTime && hasRefreshToken) {
		const timeSinceLogin = Date.now() - parseInt(lastLoginTime);
		// 로그인 후 24시간 이내면 세션 유지 가능
		return timeSinceLogin < 24 * 60 * 60 * 1000;
	}

	return false;
};

// Debug function to check all cookie states
export const debugCookieState = () => {
	const allCookies = document.cookie;
	const accessToken = getAccessToken();
	const refreshToken = getRefreshToken();
	const lastLoginTime = localStorage.getItem('lastLoginTime');

	console.log('🍪 Cookie Debug Info:', {
		allCookies,
		accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : null,
		refreshToken: refreshToken ? `${refreshToken.substring(0, 10)}...` : null,
		lastLoginTime: lastLoginTime ? new Date(parseInt(lastLoginTime)).toISOString() : null,
		mightHaveServerCookies: mightHaveServerCookies()
	});

	return {
		hasAccessToken: !!accessToken,
		hasRefreshToken: !!refreshToken,
		hasRecentLogin: !!lastLoginTime,
		mightHaveServerCookies: mightHaveServerCookies()
	};
};

export const getInitialAuthState = (): AuthState => {
	const hasToken = !!getAccessToken();
	const isExpired = isTokenExpired();
	const hasRefresh = !!getRefreshToken();

	// Debug in development
	if (import.meta.env.DEV) {
		console.log('🔐 JWT Auth State:', {
			hasToken,
			isExpired,
			hasRefresh,
			tokenExpiry: getTokenExpiry() ? new Date(getTokenExpiry()!).toISOString() : null
		});
	}

	// 토큰이 있고 만료되지 않았으면 인증됨
	const isAuthenticated = hasToken && !isExpired;
	// 토큰이 만료되었지만 refresh token이 있으면 갱신 시도 가능
	const canRefresh = isExpired && hasRefresh;

	return {
		hasClientCookie: isAuthenticated || canRefresh,
		serverAuthStatus: isAuthenticated ? true : null,
		isLoading: canRefresh, // refresh token이 있으면 갱신 시도
		lastChecked: Date.now()
	};
};