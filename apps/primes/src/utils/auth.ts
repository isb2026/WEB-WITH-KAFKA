// utils/auth.ts

export const TOKEN_KEY = 'auth_token';
export const TOKEN_TIMESTAMP_KEY = 'auth_token_timestamp';
export const REFRESH_TOKEN_KEY = 'refresh_token';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// 인증 모드 설정 (쿠키 기반 ↔ 토큰 기반 전환용)
export const AUTH_MODE = {
	COOKIE_BASED: 'cookie',
	TOKEN_BASED: 'token'
} as const;

// 현재 사용할 인증 모드 (웹은 쿠키 기반 사용)
export let CURRENT_AUTH_MODE: (typeof AUTH_MODE)[keyof typeof AUTH_MODE] = AUTH_MODE.COOKIE_BASED;

// 쿠키 기반 인증을 위한 유틸리티 함수들
export const setCookie = (name: string, value: string, days: number = 7) => {
	const expires = new Date();
	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
	document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

export const getCookie = (name: string): string | null => {
	const nameEQ = name + "=";
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
};

export const deleteCookie = (name: string) => {
	document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// 쿠키에서 토큰 가져오기 (HttpOnly가 아닌 경우)
export const getTokenFromCookie = (): string | null => {
	// 일반적인 토큰 쿠키 이름들 시도
	const tokenNames = ['auth_token', 'access_token', 'token', 'jwt'];
	
	for (const name of tokenNames) {
		const token = getCookie(name);
		if (token) {
			return token;
		}
	}
	
	return null;
};

// 쿠키 기반 인증 상태 확인 (개선된 버전)
export const isAuthenticatedFromCookie = (): boolean => {
	// 쿠키에서 토큰 확인
	const cookieToken = getTokenFromCookie();
	if (cookieToken) {
		return true;
	}
	
	// 세션 스토리지 토큰도 확인 (fallback)
	return !!sessionStorage.getItem(TOKEN_KEY);
};

export const saveToken = (token: string) => {
	sessionStorage.setItem(TOKEN_KEY, token);
	sessionStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
};

export const saveTokens = (accessToken: string, refreshToken: string) => {
	sessionStorage.setItem(TOKEN_KEY, accessToken);
	sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
	sessionStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
};

export const getToken = (): string | null => {
	return sessionStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
	return sessionStorage.getItem(REFRESH_TOKEN_KEY);
};

export const isTokenExpired = (): boolean => {
	const savedAt = parseInt(
		sessionStorage.getItem(TOKEN_TIMESTAMP_KEY) || '0',
		10
	);
	return Date.now() - savedAt > ONE_DAY_MS;
};

export const clearToken = () => {
	sessionStorage.removeItem(TOKEN_KEY);
	sessionStorage.removeItem(TOKEN_TIMESTAMP_KEY);
};

export const clearTokens = () => {
	sessionStorage.removeItem(TOKEN_KEY);
	sessionStorage.removeItem(REFRESH_TOKEN_KEY);
	sessionStorage.removeItem(TOKEN_TIMESTAMP_KEY);
	
	// 테넌트 정보 캐시도 함께 삭제
	try {
		sessionStorage.removeItem('tenant_info');
	} catch (error) {
		console.error('테넌트 캐시 삭제 실패:', error);
	}
};

// Refresh token function for cookie-based auth
export const refreshAccessToken = async (): Promise<string | null> => {
	try {
        const refreshUrl = import.meta.env.DEV
            ? `/user/auth/refresh/web`
            : `${import.meta.env.VITE_API_BASE_URL}/user/auth/refresh/web`;
        const response = await fetch(
            refreshUrl,
			{
				method: 'POST',
				credentials: 'include', // 쿠키 포함
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		
		if (!response.ok) {
			throw new Error('Refresh failed');
		}

		const res = await response.json();

		if (res.status === 'success') {
			// 쿠키 기반에서는 서버가 새로운 쿠키를 설정하므로
			// 클라이언트에서는 별도로 토큰을 저장하지 않음
			return 'refreshed'; // 성공 표시
		}

		return null;
	} catch (error) {
		console.error('Token refresh failed:', error);
		return null;
	}
};
