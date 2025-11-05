import axios from 'axios';
import { getAccessToken, clearTokens, refreshAccessToken, isTokenExpired } from './auth';

// Global auth state update function (will be set by useAuth hook)
let updateAuthState: ((isAuthenticated: boolean) => void) | null = null;

export const setAuthStateUpdater = (updater: (isAuthenticated: boolean) => void) => {
	updateAuthState = updater;
};

export const clearAuthStateUpdater = () => {
	updateAuthState = null;
};

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true, // Include cookies in requests
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(async (config) => {
	const token = getAccessToken();

	if (token) {
		// 토큰이 만료되었으면 갱신 시도
		if (isTokenExpired()) {
			console.log('토큰 만료됨, 갱신 시도...');
			const newToken = await refreshAccessToken();
			if (newToken) {
				config.headers.Authorization = `Bearer ${newToken}`;
			} else {
				// 갱신 실패 시 토큰 클리어
				clearTokens();
			}
		} else {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}

	return config;
});

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// If 401 and we haven't already tried to refresh
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Try to refresh the token
				const newToken = await refreshAccessToken();

				if (newToken) {
					// Retry the original request with new token
					originalRequest.headers.Authorization = `Bearer ${newToken}`;
					return apiClient(originalRequest);
				}
			} catch (refreshError) {
				console.error('Token refresh failed:', refreshError);
			}

			// If refresh failed, clear tokens and update auth state
			clearTokens();

			// Update auth state to trigger re-render
			if (updateAuthState) {
				updateAuthState(false);
			}

			// Only redirect if not already on login page
			if (window.location.pathname !== '/login') {
				window.location.href = '/login';
			}
		}

		return Promise.reject(error);
	}
);

// export interface ApiResponse<T = any> {
// 	status: string;
// 	data: T;
// 	message?: string;
// }

export default apiClient;
