// SCM API 기본 설정
export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface ApiResponse<T> {
	status: 'success' | 'error';
	data?: T;
	message?: string;
	errorMessage?: string;
}

export const FetchApiGet = async <T = any>(
	url: string,
	params?: Record<string, any>
): Promise<ApiResponse<T>> => {
	try {
		const searchParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					searchParams.append(key, String(value));
				}
			});
		}

		const fullUrl = `${API_BASE_URL}${url}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

		const response = await fetch(fullUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('API GET Error:', error);
		return {
			status: 'error',
			errorMessage:
				error instanceof Error
					? error.message
					: 'Unknown error occurred',
		};
	}
};

export const FetchApiPost = async <T = any>(
	url: string,
	body?: any
): Promise<ApiResponse<T>> => {
	try {
		const response = await fetch(`${API_BASE_URL}${url}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: body ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('API POST Error:', error);
		return {
			status: 'error',
			errorMessage:
				error instanceof Error
					? error.message
					: 'Unknown error occurred',
		};
	}
};

export const FetchApiPut = async <T = any>(
	url: string,
	body?: any
): Promise<ApiResponse<T>> => {
	try {
		const response = await fetch(`${API_BASE_URL}${url}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: body ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('API PUT Error:', error);
		return {
			status: 'error',
			errorMessage:
				error instanceof Error
					? error.message
					: 'Unknown error occurred',
		};
	}
};

export const FetchApiDelete = async <T = any>(
	url: string
): Promise<ApiResponse<T>> => {
	try {
		const response = await fetch(`${API_BASE_URL}${url}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('API DELETE Error:', error);
		return {
			status: 'error',
			errorMessage:
				error instanceof Error
					? error.message
					: 'Unknown error occurred',
		};
	}
};
