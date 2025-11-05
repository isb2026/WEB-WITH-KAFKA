import { FetchApiPost } from '@esg/utils/request';
import { LoginPayload, AuthResponse, TokenData } from '@esg/types/auth';
import { saveTokens, clearTokens } from '@esg/utils/auth';

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    console.log('login payload:', payload);

    const res = await FetchApiPost<TokenData>('/auth/login/app', payload, {
        credentials: 'include',
    });

    console.log('login response:', res);

    if (res.status === 'success' && res.data) {
        // Mark successful login time
        localStorage.setItem('lastLoginTime', Date.now().toString());

        // Save tokens to sessionStorage for JWT session management
        saveTokens(res.data.accessToken, res.data.refreshToken, res.data.expiresIn);

        // Return auth response with token data
        return {
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            tokenType: res.data.tokenType,
            expiresIn: res.data.expiresIn,
            user: {
                id: 1, // TODO: 실제 사용자 정보는 별도 API에서 가져와야 함
                username: payload.email.split('@')[0],
                email: payload.email,
                name: payload.email.split('@')[0],
            }
        };
    } else {
        throw new Error(res.errorMessage || '로그인 실패');
    }
};

export const logout = async (): Promise<void> => {
    try {
        // Call logout API to invalidate tokens on server
        await FetchApiPost('/auth/logout/app', {}, {
            credentials: 'include',
        });
    } catch (error) {
        console.error('Logout API call failed:', error);
    } finally {
        // Always clear local tokens and login timestamp
        clearTokens();
        localStorage.removeItem('lastLoginTime');
    }
};

export const refreshToken = async (refreshToken: string): Promise<TokenData> => {
    const res = await FetchApiPost<TokenData>('/auth/refresh/app', {
        refreshToken
    }, {
        credentials: 'include',
    });

    if (res.status === 'success' && res.data) {
        // Update stored tokens
        saveTokens(res.data.accessToken, res.data.refreshToken, res.data.expiresIn);
        return res.data;
    } else {
        throw new Error(res.errorMessage || '토큰 갱신 실패');
    }
};