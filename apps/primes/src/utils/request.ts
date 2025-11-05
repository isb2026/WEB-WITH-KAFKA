import { AxiosResponse } from 'axios';
import apiClient from './apiClient';
import { devApiRequest } from './devApiClient';
import { devModeStore } from './devModeStore';

export const isEmpty = (value: any): boolean =>
	value === undefined || value === null;

export interface ApiResponse<T = any> {
	status?: string;
	data?: T;
	resultCode?: number;
	errorMessage?: string;
	[key: string]: any;
}

export const FetchApiGet = async <T = any>(
	url: string,
	params?: Record<string, any>
): Promise<ApiResponse<T>> => {
	try {
		// 개발 환경에서 마이크로서비스 라우터 사용 시도
		const useLocalEndpoints = devModeStore.getUseLocalEndpoints();
		const devResponse = await devApiRequest({
			method: 'GET',
			url,
			params
		}, useLocalEndpoints);
		
		// 개발 환경에서 처리되었으면 해당 응답 사용
		if (devResponse) {
			const response = devResponse as AxiosResponse<ApiResponse<T>>;
			if (response.data.status !== 'success') throw response.data.message;
			return response.data;
		}
		
		// 기존 로직 (프로덕션 또는 개발 모드가 아닌 경우)
		const response: AxiosResponse<ApiResponse<T>> = await apiClient.get(
			url,
			{ params }
		);
		if (response.data.status !== 'success') throw response.data.message;
		return response.data;
	} catch (error: any) {
		return { resultCode: 9999, errorMessage: error.message || error };
	}
};

export const FetchApiPost = async <T = any>(
	url: string,
	params: Record<string, any>
): Promise<ApiResponse<T>> => {
	try {
		// 개발 환경에서 마이크로서비스 라우터 사용 시도
		const useLocalEndpoints = devModeStore.getUseLocalEndpoints();
		const devResponse = await devApiRequest({
			method: 'POST',
			url,
			data: params,
			headers: { 'Content-Type': 'application/json' }
		}, useLocalEndpoints);
		
		// 개발 환경에서 처리되었으면 해당 응답 사용
		if (devResponse) {
			const response = devResponse as AxiosResponse<ApiResponse<T>>;

			if (response.data.status !== 'success') throw response.data.message;
			return response.data;
		}

		// 기존 로직 (프로덕션 또는 개발 모드가 아닌 경우)
		const response: AxiosResponse<ApiResponse<T>> = await apiClient.post(
			url,
			params,
			{
				headers: { 'Content-Type': 'application/json' },
			}
		);

		if (response.data.status !== 'success') {
			console.error('API returned non-success status:', response.data);
			throw new Error(
				response.data.errorMessage ||
					response.data.message ||
					'API call failed'
			);
		}
		return response.data;
	} catch (error: any) {
		// Create a more detailed error message
		if (error.response) {
			// Server responded with error status
			const responseData = error.response.data;

			// Try to extract the most specific error message
			let errorMessage = 'Server error';

			if (responseData) {
				if (responseData.message) {
					errorMessage = responseData.message;
				} else if (responseData.errorMessage) {
					errorMessage = responseData.errorMessage;
				} else if (responseData.error) {
					errorMessage = responseData.error;
				} else if (responseData.details) {
					errorMessage = JSON.stringify(responseData.details);
				} else if (typeof responseData === 'string') {
					errorMessage = responseData;
				} else {
					errorMessage = JSON.stringify(responseData);
				}
			} else {
				errorMessage =
					error.response.statusText || 'Unknown server error';
			}

			throw new Error(
				`API Error (${error.response.status}): ${errorMessage}`
			);
		} else if (error.request) {
			// Request was made but no response received
			throw new Error('Network error: No response from server');
		} else {
			// Something else happened
			throw new Error(`Request error: ${error.message}`);
		}
	}
};

export const FetchApiPut = async <T = any>(
	url: string,
	params: Record<string, any>
): Promise<ApiResponse<T>> => {
	try {
		// 개발 환경에서 마이크로서비스 라우터 사용 시도
		const useLocalEndpoints = devModeStore.getUseLocalEndpoints();
		const devResponse = await devApiRequest({
			method: 'PUT',
			url,
			data: params,
			headers: { 'Content-Type': 'application/json' }
		}, useLocalEndpoints);
		
		// 개발 환경에서 처리되었으면 해당 응답 사용
		if (devResponse) {
			const response = devResponse as AxiosResponse<ApiResponse<T>>;
			if (response.data.status !== 'success') throw response.data.message;
			return response.data;
		}

		// 기존 로직 (프로덕션 또는 개발 모드가 아닌 경우)
		const response: AxiosResponse<ApiResponse<T>> = await apiClient.put(
			url,
			params,
			{
				headers: { 'Content-Type': 'application/json' },
			}
		);
		if (response.data.status !== 'success') throw response.data.message;
		return response.data;
	} catch (error: any) {
		console.error('error', error);
		return {
			resultCode: error.status || 9999,
			errorMessage: error.response.data.message || error,
		};
	}
};

export const FetchApiDelete = async <T = any>(
	url: string,
	params?: Record<string, any>,
	data?: any
): Promise<ApiResponse<T>> => {
	try {
		// 개발 환경에서 마이크로서비스 라우터 사용 시도
		const useLocalEndpoints = devModeStore.getUseLocalEndpoints();
		const devResponse = await devApiRequest({
			method: 'DELETE',
			url,
			params,
			data,
			headers: { 'Content-Type': 'application/json' }
		}, useLocalEndpoints);
		
		// 개발 환경에서 처리되었으면 해당 응답 사용
		if (devResponse) {
			const response = devResponse as AxiosResponse<ApiResponse<T>>;
			if (response.data.status !== 'success') {
				throw new Error(response.data.message || 'API 호출 실패');
			}
			return response.data;
		}

		// 기존 로직 (프로덕션 또는 개발 모드가 아닌 경우)
		const response: AxiosResponse<ApiResponse<T>> = await apiClient.delete(
			url,
			{
				params, // Axios가 자동으로 쿼리스트링 변환
				data, // Request body for DELETE
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		if (response.data.status !== 'success') {
			throw new Error(response.data.message || 'API 호출 실패');
		}

		return response.data;
	} catch (error: any) {
		return {
			resultCode: 9999,
			errorMessage: error?.message || 'Unknown error',
		};
	}
};

export const FetchApiUpload = async <T = any>(
	url: string,
	formData: FormData
): Promise<ApiResponse<T>> => {
	try {
		// 개발 환경에서 마이크로서비스 라우터 사용 시도
		const useLocalEndpoints = devModeStore.getUseLocalEndpoints();
		const devResponse = await devApiRequest({
			method: 'POST',
			url,
			data: formData,
			headers: { 'Content-Type': 'multipart/form-data' }
		}, useLocalEndpoints);
		
		// 개발 환경에서 처리되었으면 해당 응답 사용
		if (devResponse) {
			const response = devResponse as AxiosResponse<ApiResponse<T>>;
			if (response.data.status !== 'success') throw response.data.message;
			return response.data;
		}

		// 기존 로직 (프로덕션 또는 개발 모드가 아닌 경우)
		const response: AxiosResponse<ApiResponse<T>> = await apiClient.post(
			url,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		if (response.data.status !== 'success') throw response.data.message;
		return response.data;
	} catch (error: any) {
		console.error('FetchApiUpload - Error details:', {
			message: error.message,
			status: error.response?.status,
			statusText: error.response?.statusText,
			data: error.response?.data,
		});

		throw error;
	}
};

export const getSearchParams = (searchRequest: Record<string, any>) => {
	return Object.entries(searchRequest || {})
		.filter(
			([_, value]) =>
				value !== undefined && value !== null && value !== ''
		)
		.map(
			([key, value]) =>
				`${encodeURIComponent(key)}=${encodeURIComponent(value)}`
		)
		.join('&');
};
