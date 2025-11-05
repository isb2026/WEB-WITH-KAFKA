// 개발 환경 전용 API 클라이언트
// 기존 apiClient.ts는 그대로 유지하고, 개발 환경에서만 이 파일을 사용

import axios, { AxiosRequestConfig } from 'axios';
import { getToken, refreshAccessToken, clearTokens } from './auth';
import { getDevServiceBaseUrl } from './devMicroserviceRouter';

// 개발 환경에서 마이크로서비스별 axios 인스턴스를 생성하는 함수
const createDevApiClient = (url: string, useLocalEndpoints?: boolean) => {
	const devBaseUrl = getDevServiceBaseUrl(url, useLocalEndpoints);
	const baseURL = devBaseUrl || import.meta.env.VITE_API_BASE_URL;

	const client = axios.create({
		baseURL,
		withCredentials: true,
	});

	// Request interceptor
	client.interceptors.request.use((config) => {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// 개발 모드에서 요청 로깅
		if (import.meta.env.VITE_DEV_MODE === 'true') {
			console.log(
				`🔧 DEV API Request: ${config.method?.toUpperCase()} ${baseURL}${config.url}`
			);
		}

		return config;
	});

	// Response interceptor (기존 로직과 동일)
	client.interceptors.response.use(
		(res) => res,
		async (err) => {
			const originalRequest = err.config;

			if (err.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;

				try {
					const newAccessToken = await refreshAccessToken();

					if (newAccessToken) {
						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
						return client(originalRequest);
					} else {
						clearTokens();
						window.location.href = '/login';
					}
				} catch (refreshError) {
					clearTokens();
					window.location.href = '/login';
				}
			} else if (err.response?.status === 401) {
				clearTokens();
				window.location.href = '/login';
			}

			return Promise.reject(err);
		}
	);

	return client;
};

// 개발 환경에서 사용할 API 요청 함수
export const devApiRequest = async (
	config: AxiosRequestConfig,
	useLocalEndpoints?: boolean
) => {
	// 개발 모드가 아니면 null 반환 (기존 로직 사용)
	if (import.meta.env.VITE_DEV_MODE !== 'true') {
		return null;
	}

	// 로컬 엔드포인트를 사용하지 않으면 null 반환 (서버 엔드포인트 사용)
	if (useLocalEndpoints === false) {
		return null;
	}

	const url = config.url || '';
	const client = createDevApiClient(url, useLocalEndpoints);
	return client(config);
};
