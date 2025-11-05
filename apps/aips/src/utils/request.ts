import axios, { AxiosResponse } from 'axios';

// API 클라이언트 설정
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
    (config) => {
        // 토큰이 있다면 헤더에 추가
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // 인증 오류 시 로그인 페이지로 리다이렉트
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

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
        const response: AxiosResponse<ApiResponse<T>> = await apiClient.get(url, {
            params,
        });
        if (response.data.status !== 'success') {
            throw new Error(response.data.errorMessage || 'API 요청 실패');
        }
        return response.data;
    } catch (error: any) {
        return {
            resultCode: 9999,
            errorMessage: error.message || error,
        };
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
        if (response.data.status !== 'success') {
            throw new Error(response.data.errorMessage || 'API 요청 실패');
        }
        return response.data;
    } catch (error: any) {
        return {
            resultCode: 9999,
            errorMessage: error.message || error,
        };
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
        if (response.data.status !== 'success') {
            throw new Error(response.data.errorMessage || 'API 요청 실패');
        }
        return response.data;
    } catch (error: any) {
        return {
            resultCode: error.status || 9999,
            errorMessage: error.response?.data?.message || error.message || error,
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
                params,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.status !== 'success') {
            throw new Error(response.data.errorMessage || 'API 요청 실패');
        }

        return response.data;
    } catch (error: any) {
        return {
            resultCode: 9999,
            errorMessage: error?.message || 'Unknown error',
        };
    }
};

export default apiClient;