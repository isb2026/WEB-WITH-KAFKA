export interface LoginPayload {
    email: string;
    password: string;
}

// JWT 토큰 데이터 타입

export interface TokenData {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user?: {
        id: number;
        username: string;
        email?: string;
        name?: string;
    };
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

// Enhanced auth state management types
export interface AuthState {
    hasClientCookie: boolean;      // 클라이언트에서 감지한 쿠키 존재 여부
    serverAuthStatus: boolean | null; // 서버에서 확인한 실제 인증 상태
    isLoading: boolean;            // 서버 체크 진행 중 여부
    lastChecked: number;           // 마지막 서버 체크 시간
    error?: AuthError;             // 인증 체크 에러 정보
}

export interface AuthConfig {
    cookieCheckInterval: number;   // 쿠키 상태 체크 주기 (ms)
    serverCheckInterval: number;   // 서버 상태 체크 주기 (ms)
    cacheTime: number;            // 서버 응답 캐시 시간 (ms)
    retryAttempts: number;        // 실패 시 재시도 횟수
}

export interface AuthError {
    type: 'network' | 'unauthorized' | 'server' | 'unknown';
    message: string;
    statusCode?: number;
    timestamp: number;
}

// Auth utility function types
export type AuthCheckResult = {
    isAuthenticated: boolean;
    source: 'cookie' | 'server' | 'fallback';
    confidence: 'high' | 'medium' | 'low';
};