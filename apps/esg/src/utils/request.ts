import { AxiosResponse } from 'axios';
import apiClient from './apiClient';

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
	params: Record<string, any>,
	config?: Record<string, any>
): Promise<ApiResponse<T>> => {
	try {
		const response: AxiosResponse<ApiResponse<T>> = await apiClient.post(
			url,
			params,
			config
		);
		if (response.data.status !== 'success') throw response.data.message;
		return response.data;
	} catch (error: any) {
		return { resultCode: 9999, errorMessage: error.message || error };
	}
};

export const FetchApiPut = async <T = any>(
	url: string,
	params: Record<string, any>
): Promise<ApiResponse<T>> => {
	try {
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
	params?: Record<string, any>
): Promise<ApiResponse<T>> => {
	try {
		const response: AxiosResponse<ApiResponse<T>> = await apiClient.delete(
			url,
			{
				params, // Axios가 자동으로 쿼리스트링 변환
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
