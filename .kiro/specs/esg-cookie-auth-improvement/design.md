# 디자인 문서

## 개요

ESG 애플리케이션에서 서버의 httpOnly 쿠키 기반 인증을 정확하게 처리하기 위한 디자인입니다. 현재 클라이언트 사이드 쿠키만 체크하는 방식을 개선하여 서버 API를 통한 실제 인증 상태 확인으로 변경합니다.

## 아키텍처

### 현재 구조 분석

```
useAuth Hook
├── isAuthenticated() - 클라이언트 쿠키만 체크
├── authStatusQuery - 서버 API 호출 (조건부)
└── loginMutation - 로그인 처리
```

### 개선된 구조

```
useAuth Hook
├── isAuthenticated() - 하이브리드 체크 (쿠키 + 서버 확인)
├── authStatusQuery - 항상 활성화된 서버 상태 체크
├── cookieAuthCheck() - 쿠키 존재 여부 빠른 체크
└── serverAuthCheck() - 서버 API 인증 상태 확인
```

## 컴포넌트 및 인터페이스

### 1. 인증 상태 체크 전략

#### 하이브리드 접근법
```typescript
interface AuthState {
  hasClientCookie: boolean;
  serverAuthStatus: boolean | null;
  isLoading: boolean;
  lastChecked: number;
}

const getAuthState = (): AuthState => {
  return {
    hasClientCookie: !!getCookie(TOKEN_COOKIE_NAME),
    serverAuthStatus: null, // Will be populated by server check
    isLoading: false,
    lastChecked: 0
  };
};
```

#### 개선된 isAuthenticated 함수
```typescript
export const isAuthenticated = (authState?: AuthState): boolean => {
  // 1. 빠른 체크: 클라이언트 쿠키가 없으면 확실히 미인증
  if (!getCookie(TOKEN_COOKIE_NAME)) {
    return false;
  }
  
  // 2. 서버 상태가 있으면 그것을 우선 사용
  if (authState?.serverAuthStatus !== null) {
    return authState.serverAuthStatus;
  }
  
  // 3. 서버 상태를 모르면 쿠키 존재를 기준으로 임시 판단
  return true;
};
```

### 2. useAuth Hook 개선

#### 서버 상태 체크 최적화
```typescript
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(getAuthState);
  
  // 서버 인증 상태 체크 (항상 활성화)
  const authStatusQuery = useQuery({
    queryKey: ['authStatus'],
    queryFn: checkAuthStatus,
    enabled: authState.hasClientCookie, // 쿠키가 있을 때만 체크
    staleTime: 2 * 60 * 1000, // 2분간 캐시
    refetchInterval: 5 * 60 * 1000, // 5분마다 자동 갱신
    retry: (failureCount, error) => {
      // 네트워크 오류는 재시도, 401/403은 재시도 안함
      return failureCount < 2 && !isAuthError(error);
    },
    onSuccess: (isValid) => {
      setAuthState(prev => ({
        ...prev,
        serverAuthStatus: isValid,
        lastChecked: Date.now()
      }));
    },
    onError: (error) => {
      console.error('Auth status check failed:', error);
      setAuthState(prev => ({
        ...prev,
        serverAuthStatus: false,
        lastChecked: Date.now()
      }));
    }
  });
  
  // 쿠키 상태 모니터링
  useEffect(() => {
    const checkCookieState = () => {
      const hasClientCookie = !!getCookie(TOKEN_COOKIE_NAME);
      setAuthState(prev => {
        if (prev.hasClientCookie !== hasClientCookie) {
          return {
            ...prev,
            hasClientCookie,
            serverAuthStatus: hasClientCookie ? null : false
          };
        }
        return prev;
      });
    };
    
    // 주기적으로 쿠키 상태 체크
    const interval = setInterval(checkCookieState, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return {
    isAuthenticated: isAuthenticated(authState),
    isAuthChecking: authStatusQuery.isLoading,
    authState,
    // ... 기타 기능들
  };
};
```

### 3. 로그인 프로세스 개선

#### 로그인 성공 후 상태 동기화
```typescript
const loginMutation = useMutation({
  mutationFn: (payload: LoginPayload) => login(payload),
  onSuccess: (data) => {
    // 1. 쿠키 상태 즉시 업데이트
    setAuthState(prev => ({
      ...prev,
      hasClientCookie: true,
      serverAuthStatus: true,
      lastChecked: Date.now()
    }));
    
    // 2. React Query 캐시 업데이트
    queryClient.setQueryData(['authStatus'], true);
    queryClient.setQueryData(['currentUser'], data.user);
    
    // 3. 성공 처리
    showSuccessMessage(data.user);
    navigateToIntendedPage();
  },
  onError: (error) => {
    // 로그인 실패 시 상태 초기화
    setAuthState(prev => ({
      ...prev,
      hasClientCookie: false,
      serverAuthStatus: false,
      lastChecked: Date.now()
    }));
    showErrorMessage(error);
  }
});
```

## 데이터 모델

### 인증 상태 인터페이스
```typescript
interface AuthState {
  hasClientCookie: boolean;      // 클라이언트에서 감지한 쿠키 존재 여부
  serverAuthStatus: boolean | null; // 서버에서 확인한 실제 인증 상태
  isLoading: boolean;            // 서버 체크 진행 중 여부
  lastChecked: number;           // 마지막 서버 체크 시간
  error?: string;                // 인증 체크 에러 메시지
}

interface AuthConfig {
  cookieCheckInterval: number;   // 쿠키 상태 체크 주기 (ms)
  serverCheckInterval: number;   // 서버 상태 체크 주기 (ms)
  cacheTime: number;            // 서버 응답 캐시 시간 (ms)
  retryAttempts: number;        // 실패 시 재시도 횟수
}
```

### 에러 처리 타입
```typescript
interface AuthError {
  type: 'network' | 'unauthorized' | 'server' | 'unknown';
  message: string;
  statusCode?: number;
  timestamp: number;
}

const isAuthError = (error: any): boolean => {
  return error?.response?.status === 401 || error?.response?.status === 403;
};
```

## 에러 처리

### 1. 네트워크 에러 처리
```typescript
const handleNetworkError = (error: any) => {
  if (!navigator.onLine) {
    return {
      type: 'network',
      message: '네트워크 연결을 확인해주세요.',
      fallbackAuth: false
    };
  }
  
  return {
    type: 'server',
    message: '서버 연결에 실패했습니다.',
    fallbackAuth: false
  };
};
```

### 2. 인증 에러 처리
```typescript
const handleAuthError = (error: any) => {
  if (error?.response?.status === 401) {
    clearTokens();
    return {
      type: 'unauthorized',
      message: '인증이 만료되었습니다.',
      shouldRedirect: true
    };
  }
  
  if (error?.response?.status === 403) {
    return {
      type: 'unauthorized',
      message: '접근 권한이 없습니다.',
      shouldRedirect: false
    };
  }
  
  return {
    type: 'unknown',
    message: '인증 확인 중 오류가 발생했습니다.',
    shouldRedirect: false
  };
};
```

### 3. Fallback 전략
```typescript
const getFallbackAuthState = (error: AuthError): boolean => {
  switch (error.type) {
    case 'network':
      // 네트워크 오류 시 쿠키 존재 여부로 판단
      return !!getCookie(TOKEN_COOKIE_NAME);
    case 'unauthorized':
      // 인증 오류 시 확실히 미인증
      return false;
    case 'server':
      // 서버 오류 시 보수적으로 미인증 처리
      return false;
    default:
      // 알 수 없는 오류 시 쿠키 기준
      return !!getCookie(TOKEN_COOKIE_NAME);
  }
};
```

## 테스트 전략

### 1. 단위 테스트
```typescript
describe('Enhanced Auth System', () => {
  test('should detect client cookie correctly', () => {
    // 쿠키 설정 후 감지 테스트
  });
  
  test('should handle server auth check', async () => {
    // 서버 API 호출 및 응답 처리 테스트
  });
  
  test('should sync auth state after login', async () => {
    // 로그인 후 상태 동기화 테스트
  });
  
  test('should handle network errors gracefully', async () => {
    // 네트워크 오류 시 fallback 테스트
  });
});
```

### 2. 통합 테스트
```typescript
describe('Auth Integration', () => {
  test('should maintain auth state across page refresh', () => {
    // 페이지 새로고침 시 상태 유지 테스트
  });
  
  test('should redirect on auth failure', () => {
    // 인증 실패 시 리다이렉트 테스트
  });
  
  test('should handle concurrent auth checks', () => {
    // 동시 인증 체크 처리 테스트
  });
});
```

### 3. 성능 테스트
- API 호출 빈도 모니터링
- 캐시 효율성 측정
- 메모리 사용량 체크
- 네트워크 트래픽 분석

## 구현 고려사항

### 1. 성능 최적화
- React Query 캐싱 활용
- 불필요한 API 호출 방지
- 쿠키 체크 최적화
- 메모리 누수 방지

### 2. 보안 고려사항
- httpOnly 쿠키 지원
- CSRF 토큰 처리
- XSS 방지
- 민감한 정보 로깅 방지

### 3. 사용자 경험
- 로딩 상태 표시
- 에러 메시지 개선
- 자동 재시도 로직
- 오프라인 지원

### 4. 개발자 경험
- 명확한 에러 메시지
- 디버깅 정보 제공
- 타입 안전성 보장
- 문서화 및 예제

## 디자인 결정사항

### 1. 하이브리드 접근법 선택
**이유**: 
- 빠른 초기 응답 (쿠키 체크)
- 정확한 최종 상태 (서버 확인)
- 네트워크 오류 시 fallback

### 2. React Query 활용
**이유**:
- 자동 캐싱 및 재시도
- 백그라운드 업데이트
- 에러 처리 표준화

### 3. 상태 동기화 전략
**이유**:
- 실시간 상태 반영
- 컴포넌트 간 일관성
- 메모리 효율성

이 디자인은 서버의 쿠키 기반 인증을 정확하게 처리하면서도 성능과 사용자 경험을 모두 고려한 실용적인 솔루션을 제공합니다.