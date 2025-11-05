import {
	saveToken,
	clearToken,
	saveTokens,
	clearTokens,
	getRefreshToken,
	REFRESH_TOKEN_KEY,
	CURRENT_AUTH_MODE,
	AUTH_MODE,
} from '@primes/utils/auth';
import { FetchApiPost } from '@primes/utils/request';
import { LoginPayload, RegisterRequest } from '@primes/types/auth';
import { saveTenantInfo, clearTenantInfo, getCurrentTenantIdFromToken } from '@primes/utils/tokenUtils';
import axios from 'axios';

export const login = async (payload: LoginPayload) => {
    // 쿠키 기반 웹 로그인 엔드포인트 사용
    const loginUrl = import.meta.env.DEV 
        ? `/user/auth/login/web` 
        : `${import.meta.env.VITE_API_BASE_URL}/user/auth/login/web`;
    const response = await axios.post(loginUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // 쿠키 포함
    });
    const res = response.data;

    if (res.status === 'success') {
        const data = res.data || {};

        // 토큰 기반일 경우에만 클라이언트 저장
        if (CURRENT_AUTH_MODE === AUTH_MODE.TOKEN_BASED && data.accessToken) {
            saveToken(data.accessToken);
            if (data.refreshToken) {
                sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
            }
        }

        // 테넌트 정보 저장 (가능하면)
        let tenantId = data.tenantId;
        if (!tenantId && data.accessToken) {
            tenantId = getCurrentTenantIdFromToken() || undefined;
        }
        if (tenantId) {
            saveTenantInfo({
                id: tenantId,
                tenantName: '무른모',
                tenantImage: '',
                companyLicense: '',
                managerName: '',
                managerEmail: '',
                managerPhone: '',
                status: 'active',
                plan: 'basic',
                startDate: '',
                endDate: '',
                maxUsers: 0,
                currentUsers: 0,
                storageLimitMb: 0
            });
        }

        return data;
    } else {
        throw new Error(res.message || '로그인 실패');
    }
};

export const logout = async () => {
	try {
        // 쿠키 기반 웹 로그아웃 엔드포인트 사용
        const logoutUrl = import.meta.env.DEV 
            ? `/user/auth/logout/web` 
            : `${import.meta.env.VITE_API_BASE_URL}/user/auth/logout/web`;
        await axios.post(logoutUrl, {}, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
	} catch (error) {
		console.error('Logout error:', error);
	}
	
	// 클라이언트 측에서는 쿠키가 자동으로 삭제되므로 별도 처리 불필요
	// 하지만 혹시 모를 경우를 대비해 클라이언트 측 토큰도 정리
	clearTokens();
	// 테넌트 정보도 함께 삭제
	clearTenantInfo();
};

export const signup = async (payload: RegisterRequest) => {
	try {
		const url = '/user/auth/register';

		const res = await FetchApiPost(url, payload);

		if (res.resultCode === 9999) {
			throw new Error(res.errorMessage || 'Signup failed');
		}

		const user = res.data?.user || res.data;
		if (user) {
			localStorage.setItem('userData', JSON.stringify(user));
		}

		return user;
	} catch (err: any) {
		console.error('Signup error details:', err);
		if (err.response) {
			console.error('Response data:', err.response.data);
			console.error('Response status:', err.response.status);
			console.error('Response headers:', err.response.headers);
		}
		throw err;
	}
};
