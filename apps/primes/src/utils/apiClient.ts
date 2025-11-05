import axios from 'axios';
import { refreshAccessToken, clearTokens, getToken, CURRENT_AUTH_MODE, AUTH_MODE } from './auth';

const apiClient = axios.create({
    baseURL: import.meta.env.DEV ? '/' : import.meta.env.VITE_API_BASE_URL,
    withCredentials: CURRENT_AUTH_MODE === AUTH_MODE.COOKIE_BASED,
});

// 인증 모드에 따라 요청 헤더 설정
apiClient.interceptors.request.use((config) => {
    if (CURRENT_AUTH_MODE === AUTH_MODE.TOKEN_BASED) {
		// 토큰 기반: Authorization 헤더에 토큰 추가
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
    // 쿠키 기반에서는 withCredentials: true로 쿠키가 자동으로 포함됨
	
	return config;
});

apiClient.interceptors.response.use(
	(res) => res,
	async (err) => {
		const originalRequest = err.config;
		
		// 인증 모드에 따라 401 에러 처리
		if (err.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				if (CURRENT_AUTH_MODE === AUTH_MODE.TOKEN_BASED) {
					// 토큰 기반: 토큰 갱신 로직 (필요시 구현)
					// 현재는 토큰 갱신 없이 바로 로그인 페이지로 이동
				} else {
					// 쿠키 기반 토큰 갱신 시도
					const refreshResult = await refreshAccessToken();
					if (refreshResult) {
						return apiClient(originalRequest);
					}
				}
				
				// 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
				clearTokens();
				window.location.href = '/login';
			} catch (refreshError) {
				// 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
				clearTokens();
				window.location.href = '/login';
			}
		} else if (err.response?.status === 401) {
			// 다른 401 에러들도 로그인 페이지로 리다이렉트
			clearTokens();
			window.location.href = '/login';
		}

		return Promise.reject(err);
	}
);

// export interface ApiResponse<T = any> {
// 	status: string;
// 	data: T;
// 	message?: string;
// }

export default apiClient;
