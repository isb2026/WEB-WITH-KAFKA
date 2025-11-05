// JWT 토큰 관리를 위한 유틸리티 클래스
export class TokenManager {
    private static instance: TokenManager;
    private refreshTimer: NodeJS.Timeout | null = null;

    private constructor() { }

    public static getInstance(): TokenManager {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }

    // 토큰 만료 시간 계산
    public getTokenExpiryTime(expiresIn: number): number {
        return Date.now() + (expiresIn * 1000);
    }

    // 토큰 만료까지 남은 시간 (밀리초)
    public getTimeUntilExpiry(): number {
        const expiry = sessionStorage.getItem('tokenExpiry');
        if (!expiry) return 0;

        return parseInt(expiry) - Date.now();
    }

    // 토큰이 곧 만료되는지 확인 (5분 이내)
    public isTokenExpiringSoon(): boolean {
        const timeUntilExpiry = this.getTimeUntilExpiry();
        return timeUntilExpiry > 0 && timeUntilExpiry <= 5 * 60 * 1000; // 5분
    }

    // 자동 갱신 타이머 설정
    public setupAutoRefresh(refreshCallback: () => Promise<void>): void {
        this.clearAutoRefresh();

        const checkAndRefresh = async () => {
            if (this.isTokenExpiringSoon()) {
                console.log('토큰 자동 갱신 실행...');
                try {
                    await refreshCallback();
                } catch (error) {
                    console.error('자동 토큰 갱신 실패:', error);
                }
            }
        };

        // 1분마다 체크
        this.refreshTimer = setInterval(checkAndRefresh, 60 * 1000);

        // 즉시 한 번 체크
        checkAndRefresh();
    }

    // 자동 갱신 타이머 해제
    public clearAutoRefresh(): void {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    // 토큰 정보 디버그 출력
    public debugTokenInfo(): void {
        const accessToken = sessionStorage.getItem('accessToken');
        const refreshToken = sessionStorage.getItem('refreshToken');
        const expiry = sessionStorage.getItem('tokenExpiry');

        console.log('🔐 Token Debug Info:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            tokenExpiry: expiry ? new Date(parseInt(expiry)).toISOString() : null,
            timeUntilExpiry: this.getTimeUntilExpiry(),
            isExpiringSoon: this.isTokenExpiringSoon(),
            accessTokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : null
        });
    }
}

export const tokenManager = TokenManager.getInstance();