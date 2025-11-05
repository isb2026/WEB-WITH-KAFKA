import { getToken, getTokenFromCookie } from './auth';
import { TenantInfo } from '@primes/services/tenant/tenantService';

export interface TokenPayload {
	// 실제 토큰 구조에 맞춤
	user_id?: number;
	tenant_id?: number;
	username?: string;
	sub?: string;
	iat?: number;
	exp?: number;
	// 기존 구조와의 호환성을 위한 fallback
	userInfo?: {
		user_id: number;
		tenant_id: number;
		username: string;
		sub: string;
		iat: number;
		exp: number;
	};
	tenantId?: number; // fallback
	userId?: number; // fallback
	[key: string]: any;
}

/**
 * JWT 토큰을 디코딩하여 페이로드 정보를 추출합니다.
 * @param token JWT 토큰 문자열
 * @returns 디코딩된 페이로드 또는 null
 */
export const decodeToken = (token: string): TokenPayload | null => {
	try {
		// JWT 토큰은 base64로 인코딩된 3부분으로 구성: header.payload.signature
		const parts = token.split('.');
		
		if (parts.length !== 3) {
			console.warn('Invalid JWT token format');
			return null;
		}

		// 페이로드 부분 디코딩 (인덱스 1)
		const payload = parts[1];
		
		// Base64 URL 디코딩
		const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
		
		// JSON 파싱
		return JSON.parse(decodedPayload);
	} catch (error) {
		console.error('Token decoding failed:', error);
		return null;
	}
};

/**
 * 현재 저장된 토큰에서 사용자 정보를 추출합니다.
 * @returns 토큰 페이로드 또는 null
 */
export const getCurrentUserFromToken = (): TokenPayload | null => {
	const token = getToken();
	if (!token) {
		return null;
	}
	
	return decodeToken(token);
};

/**
 * 현재 저장된 토큰에서 테넌트 ID를 추출합니다.
 * @returns 테넌트 ID 또는 null
 */
export const getCurrentTenantIdFromToken = (): number | null => {
	const userInfo = getCurrentUserFromToken();
	
	// 실제 토큰 구조에서 tenant_id 추출
	if (userInfo?.tenant_id) {
		return userInfo.tenant_id;
	}
	
	// 기존 구조 fallback (userInfo 객체 안에 있는 경우)
	if (userInfo?.userInfo?.tenant_id) {
		return userInfo.userInfo.tenant_id;
	}
	
	// 기존 구조 fallback
	return userInfo?.tenantId || null;
};

/**
 * 쿠키에서 토큰을 가져와서 테넌트 ID를 추출합니다.
 * @returns 테넌트 ID 또는 null
 */
export const getCurrentTenantIdFromCookie = (): number | null => {
	// 먼저 쿠키에서 토큰 시도
	const cookieToken = getTokenFromCookie();
	if (cookieToken) {
		const userInfo = decodeToken(cookieToken);
		if (userInfo?.tenant_id) {
			return userInfo.tenant_id;
		}
		if (userInfo?.userInfo?.tenant_id) {
			return userInfo.userInfo.tenant_id;
		}
		return userInfo?.tenantId || null;
	}
	
	// 쿠키에서 토큰을 찾을 수 없으면 세션 스토리지에서 시도
	return getCurrentTenantIdFromToken();
};

/**
 * 현재 저장된 토큰에서 사용자 ID를 추출합니다.
 * @returns 사용자 ID 또는 null
 */
export const getCurrentUserIdFromToken = (): number | null => {
	const userInfo = getCurrentUserFromToken();
	
	// 실제 토큰 구조에서 user_id 추출
	if (userInfo?.user_id) {
		return userInfo.user_id;
	}
	
	// 기존 구조 fallback (userInfo 객체 안에 있는 경우)
	if (userInfo?.userInfo?.user_id) {
		return userInfo.userInfo.user_id;
	}
	
	// 기존 구조 fallback
	return userInfo?.userId || null;
};

// 테넌트 정보 관련 상수
const TENANT_INFO_KEY = 'tenant_info';

/**
 * 테넌트 정보를 sessionStorage에 저장합니다.
 * @param tenantInfo 저장할 테넌트 정보
 */
export const saveTenantInfo = (tenantInfo: TenantInfo): void => {
	try {
		sessionStorage.setItem(TENANT_INFO_KEY, JSON.stringify(tenantInfo));
	} catch (error) {
		console.error('테넌트 정보 저장 실패:', error);
	}
};

/**
 * sessionStorage에서 테넌트 정보를 가져옵니다.
 * @returns 저장된 테넌트 정보 또는 null
 */
export const getTenantInfo = (): TenantInfo | null => {
	try {
		const tenantInfoStr = sessionStorage.getItem(TENANT_INFO_KEY);
		
		if (!tenantInfoStr) {
			return null;
		}
		
		return JSON.parse(tenantInfoStr) as TenantInfo;
	} catch (error) {
		console.error('테넌트 정보 로드 실패:', error);
		return null;
	}
};

/**
 * sessionStorage에서 테넌트 정보를 삭제합니다.
 */
export const clearTenantInfo = (): void => {
	try {
		sessionStorage.removeItem(TENANT_INFO_KEY);
	} catch (error) {
		console.error('테넌트 정보 삭제 실패:', error);
	}
};

/**
 * 테넌트 정보가 캐시되어 있는지 확인합니다.
 * @returns 캐시된 테넌트 정보가 있으면 true
 */
export const hasTenantInfoCache = (): boolean => {
	return getTenantInfo() !== null;
};
