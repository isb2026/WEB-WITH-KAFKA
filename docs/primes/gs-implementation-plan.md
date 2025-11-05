# 🏆 GS 인증 개선사항 구현 계획

## 📋 **구현 방식 개요**

GS 인증을 위한 개선사항들을 **기존 코드를 최대한 보존하면서 점진적으로 적용**하는 방식으로 진행합니다.

## 🎯 **Phase 1: 보안 강화 (2주)**

### **1. 입력 검증 시스템 구축**

#### **A. 보안 유틸리티 추가**

```bash
# 필요한 패키지 설치
pnpm add dompurify zod
pnpm add -D @types/dompurify
```

```typescript
// src/utils/security.ts (신규 생성)
import DOMPurify from 'dompurify';
import { z } from 'zod';

export class SecurityUtils {
	// XSS 방지를 위한 입력 정화
	static sanitizeInput(input: string): string {
		return DOMPurify.sanitize(input, {
			ALLOWED_TAGS: [],
			ALLOWED_ATTR: [],
		});
	}

	// SQL Injection 패턴 검사
	static validateSQLInjection(input: string): boolean {
		const sqlPatterns = [
			/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
			/(--|\/\*|\*\/|;)/,
			/(\b(OR|AND)\b.*=.*)/i,
		];
		return !sqlPatterns.some((pattern) => pattern.test(input));
	}

	// XSS 패턴 검사
	static validateXSS(input: string): boolean {
		const xssPatterns = [
			/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
			/javascript:/gi,
			/on\w+\s*=/gi,
			/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
		];
		return !xssPatterns.some((pattern) => pattern.test(input));
	}

	// 종합 입력 검증
	static validateInput(input: string): { isValid: boolean; error?: string } {
		if (!this.validateXSS(input)) {
			return { isValid: false, error: 'XSS 패턴이 감지되었습니다.' };
		}

		if (!this.validateSQLInjection(input)) {
			return {
				isValid: false,
				error: 'SQL Injection 패턴이 감지되었습니다.',
			};
		}

		return { isValid: true };
	}
}
```

#### **B. 기존 DynamicForm 컴포넌트 보안 강화**

```typescript
// src/components/form/DynamicFormComponent.tsx (기존 파일 수정)
import { SecurityUtils } from '@primes/utils/security';

// 기존 renderField 함수에 보안 검증 추가
const renderField = (field: FormField) => {
  const {
    name,
    label,
    type,
    // ... 기존 속성들
  } = field;

  // 보안 검증을 위한 커스텀 register 함수
  const secureRegister = (fieldName: string, options: any) => {
    return register(fieldName, {
      ...options,
      validate: {
        ...options.validate,
        security: (value: string) => {
          if (typeof value === 'string' && value.trim()) {
            const validation = SecurityUtils.validateInput(value);
            return validation.isValid || validation.error;
          }
          return true;
        }
      }
    });
  };

  switch (type) {
    case 'text':
      return (
        <div key={name} className="flex items-center mb-4">
          {/* 기존 JSX 구조 유지 */}
          <input
            {...secureRegister(name, {
              required: required && `${label}는 필수입니다.`,
              pattern: pattern && {
                value: pattern,
                message: formatMessage || `${label} 형식이 올바르지 않습니다.`,
              },
              // 기존 검증 규칙들...
            })}
            // 기존 속성들...
          />
          {/* 기존 에러 표시 로직 유지 */}
        </div>
      );
    // 다른 타입들도 동일하게 적용...
  }
};
```

### **2. API 클라이언트 보안 강화**

#### **A. 보안 헤더 추가**

```typescript
// src/utils/apiClient.ts (기존 파일 수정)
import axios from 'axios';
import { getToken, refreshAccessToken, clearTokens } from './auth';

// 기존 apiClient 설정에 보안 헤더 추가
const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
	timeout: 30000, // 타임아웃 추가
	headers: {
		'Content-Type': 'application/json',
		'X-Content-Type-Options': 'nosniff',
		'X-Frame-Options': 'DENY',
		'X-XSS-Protection': '1; mode=block',
	},
});

// 기존 인터셉터 로직 유지하면서 보안 로깅 추가
apiClient.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	// 보안 로깅 (개발 환경에서만)
	if (import.meta.env.MODE === 'development') {
		console.log(
			`🔐 API Request: ${config.method?.toUpperCase()} ${config.url}`
		);
	}

	return config;
});

// 기존 응답 인터셉터 유지
apiClient.interceptors.response.use(
	(res) => res,
	async (err) => {
		// 기존 로직 유지...

		// 보안 이벤트 로깅 추가
		if (err.response?.status === 401) {
			console.warn('🚨 Unauthorized access attempt:', {
				url: err.config?.url,
				timestamp: new Date().toISOString(),
			});
		}

		return Promise.reject(err);
	}
);
```

### **3. 감사 추적 시스템 구축**

#### **A. 감사 로그 Hook 생성**

```typescript
// src/hooks/useAuditTrail.ts (신규 생성)
import { useCallback } from 'react';
import { useAuth } from '@primes/hooks/useAuth'; // 기존 인증 Hook 활용

interface AuditEvent {
	id: string;
	timestamp: string;
	userId: string;
	userName: string;
	action: string;
	resource: string;
	resourceId?: string;
	oldValue?: any;
	newValue?: any;
	ipAddress: string;
	userAgent: string;
	sessionId: string;
	success: boolean;
	errorMessage?: string;
}

export const useAuditTrail = () => {
	const { user } = useAuth(); // 기존 인증 시스템 활용

	const logAuditEvent = useCallback(
		async (
			event: Omit<
				AuditEvent,
				| 'id'
				| 'timestamp'
				| 'userId'
				| 'userName'
				| 'ipAddress'
				| 'userAgent'
				| 'sessionId'
			>
		) => {
			const auditEvent: AuditEvent = {
				id: crypto.randomUUID(),
				timestamp: new Date().toISOString(),
				userId: user?.id?.toString() || 'anonymous',
				userName: user?.name || 'Anonymous',
				ipAddress: await getClientIP(),
				userAgent: navigator.userAgent,
				sessionId: getSessionId(),
				...event,
			};

			// 로컬 스토리지에 임시 저장 (네트워크 실패 대비)
			try {
				const localAuditLogs = JSON.parse(
					localStorage.getItem('auditLogs') || '[]'
				);
				localAuditLogs.push(auditEvent);
				localStorage.setItem(
					'auditLogs',
					JSON.stringify(localAuditLogs.slice(-100))
				);
			} catch (error) {
				console.error('Failed to store audit log locally:', error);
			}

			// 서버로 전송 (비동기)
			try {
				await sendAuditLog(auditEvent);
			} catch (error) {
				console.error('Failed to send audit log:', error);
				// 실패해도 사용자 경험에는 영향 없음
			}
		},
		[user]
	);

	return { logAuditEvent };
};

// 유틸리티 함수들
const getClientIP = async (): Promise<string> => {
	try {
		const response = await fetch('https://api.ipify.org?format=json');
		const data = await response.json();
		return data.ip;
	} catch {
		return 'unknown';
	}
};

const getSessionId = (): string => {
	let sessionId = sessionStorage.getItem('sessionId');
	if (!sessionId) {
		sessionId = crypto.randomUUID();
		sessionStorage.setItem('sessionId', sessionId);
	}
	return sessionId;
};

const sendAuditLog = async (auditEvent: AuditEvent): Promise<void> => {
	// 실제 감사 로그 API 호출
	await fetch('/api/audit-logs', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
		},
		body: JSON.stringify(auditEvent),
	});
};
```

#### **B. 기존 Hook에 감사 로깅 추가**

```typescript
// src/hooks/ini/vendor/useCreateVendor.ts (기존 파일 수정)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVendor } from '@primes/services/ini/vendorService';
import { useAuditTrail } from '@primes/hooks/useAuditTrail'; // 새로 추가

export const useCreateVendor = () => {
	const queryClient = useQueryClient();
	const { logAuditEvent } = useAuditTrail(); // 새로 추가

	return useMutation({
		mutationFn: createVendor,
		onSuccess: (data, variables) => {
			// 기존 로직 유지
			queryClient.invalidateQueries({ queryKey: ['vendors'] });
			queryClient.invalidateQueries({ queryKey: ['vendor-fields'] });

			// 감사 로깅 추가
			logAuditEvent({
				action: 'CREATE',
				resource: 'VENDOR',
				resourceId: data.id?.toString(),
				newValue: data,
				success: true,
			});
		},
		onError: (error, variables) => {
			// 감사 로깅 추가
			logAuditEvent({
				action: 'CREATE',
				resource: 'VENDOR',
				success: false,
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			});
		},
	});
};
```

## 🎯 **Phase 2: 신뢰성 향상 (2주)**

### **1. 에러 처리 개선**

#### **A. 전역 에러 바운더리 강화**

```typescript
// src/components/error/EnhancedErrorBoundary.tsx (기존 ErrorBoundary 개선)
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useAuditTrail } from '@primes/hooks/useAuditTrail';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private auditTrail: ReturnType<typeof useAuditTrail> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: crypto.randomUUID()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 기존 에러 처리 로직 유지
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 감사 로깅
    this.logError(error, errorInfo);

    // 사용자 정의 에러 핸들러 호출
    this.props.onError?.(error, errorInfo);

    this.setState({ errorInfo });
  }

  private logError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // 감사 로그 전송
      await fetch('/api/audit-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          id: this.state.errorId,
          timestamp: new Date().toISOString(),
          action: 'ERROR',
          resource: 'APPLICATION',
          success: false,
          errorMessage: error.message,
          errorStack: error.stack,
          componentStack: errorInfo.componentStack
        })
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: ''
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-800">
                  오류가 발생했습니다
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
                  <p className="mt-1 text-xs">오류 ID: {this.state.errorId}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                다시 시도
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400"
              >
                홈으로
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### **2. 성능 모니터링 시스템**

#### **A. 성능 메트릭 수집**

```bash
# Web Vitals 설치
pnpm add web-vitals
```

```typescript
// src/utils/performance.ts (신규 생성)
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface PerformanceMetric {
	name: string;
	value: number;
	rating: 'good' | 'needs-improvement' | 'poor';
	timestamp: number;
}

class PerformanceMonitor {
	private metrics: PerformanceMetric[] = [];

	init() {
		// Core Web Vitals 수집
		getCLS(this.handleMetric);
		getFID(this.handleMetric);
		getFCP(this.handleMetric);
		getLCP(this.handleMetric);
		getTTFB(this.handleMetric);

		// 메모리 사용량 모니터링
		this.startMemoryMonitoring();
	}

	private handleMetric = (metric: any) => {
		const performanceMetric: PerformanceMetric = {
			name: metric.name,
			value: metric.value,
			rating: metric.rating,
			timestamp: Date.now(),
		};

		this.metrics.push(performanceMetric);

		// 성능 임계값 초과 시 경고
		if (metric.rating === 'poor') {
			console.warn(
				`🐌 Poor performance detected: ${metric.name} = ${metric.value}`
			);
			this.sendPerformanceAlert(performanceMetric);
		}

		// 주기적으로 서버에 전송
		this.sendMetricsToServer();
	};

	private startMemoryMonitoring() {
		setInterval(() => {
			if ('memory' in performance) {
				const memory = (performance as any).memory;
				const memoryMetric: PerformanceMetric = {
					name: 'memory-usage',
					value: memory.usedJSHeapSize,
					rating:
						memory.usedJSHeapSize > 50 * 1024 * 1024
							? 'poor'
							: 'good', // 50MB 임계값
					timestamp: Date.now(),
				};

				this.metrics.push(memoryMetric);
			}
		}, 30000); // 30초마다 체크
	}

	private sendPerformanceAlert(metric: PerformanceMetric) {
		// 성능 경고 로그 전송
		fetch('/api/performance-alerts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
			},
			body: JSON.stringify({
				metric,
				userAgent: navigator.userAgent,
				url: window.location.href,
				timestamp: new Date().toISOString(),
			}),
		}).catch(console.error);
	}

	private sendMetricsToServer() {
		// 5분마다 메트릭 전송
		if (this.metrics.length > 0 && Date.now() % 300000 < 1000) {
			fetch('/api/performance-metrics', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
				body: JSON.stringify({
					metrics: this.metrics.slice(-50), // 최근 50개만 전송
					timestamp: new Date().toISOString(),
				}),
			}).catch(console.error);
		}
	}

	getMetrics(): PerformanceMetric[] {
		return [...this.metrics];
	}
}

export const performanceMonitor = new PerformanceMonitor();
```

#### **B. 메인 앱에 성능 모니터링 적용**

```typescript
// src/main.tsx (기존 파일 수정)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { performanceMonitor } from './utils/performance'; // 새로 추가

// 성능 모니터링 시작
performanceMonitor.init();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

## 🎯 **Phase 3: 사용성 개선 (1주)**

### **1. 접근성 강화**

#### **A. 접근성 검사 유틸리티**

```typescript
// src/utils/accessibility.ts (신규 생성)
export class AccessibilityChecker {
	static checkElement(element: HTMLElement): string[] {
		const issues: string[] = [];

		// 이미지 alt 텍스트 검사
		const images = element.querySelectorAll('img');
		images.forEach((img) => {
			if (!img.alt) {
				issues.push(`Image without alt text: ${img.src}`);
			}
		});

		// 버튼 접근성 검사
		const buttons = element.querySelectorAll('button');
		buttons.forEach((button) => {
			if (
				!button.textContent?.trim() &&
				!button.getAttribute('aria-label')
			) {
				issues.push('Button without accessible text');
			}
		});

		// 폼 라벨 검사
		const inputs = element.querySelectorAll('input, select, textarea');
		inputs.forEach((input) => {
			const id = input.id;
			if (id && !element.querySelector(`label[for="${id}"]`)) {
				issues.push(`Input without associated label: ${id}`);
			}
		});

		// 색상 대비 검사 (기본적인 검사)
		const colorElements = element.querySelectorAll('[style*="color"]');
		colorElements.forEach((el) => {
			// 실제 구현에서는 더 정교한 색상 대비 계산 필요
			console.log('Color contrast check needed for:', el);
		});

		return issues;
	}

	static runAccessibilityAudit(): void {
		const issues = this.checkElement(document.body);

		if (issues.length > 0) {
			console.group('🔍 Accessibility Issues Found:');
			issues.forEach((issue) => console.warn(issue));
			console.groupEnd();

			// 개발 환경에서만 알림
			if (import.meta.env.MODE === 'development') {
				console.warn(
					`Found ${issues.length} accessibility issues. Check console for details.`
				);
			}
		}
	}
}
```

## 📊 **구현 일정 및 체크리스트**

### **Week 1-2: 보안 강화**

- [ ] **Day 1-2**: 보안 유틸리티 구현 (`SecurityUtils`)
- [ ] **Day 3-4**: DynamicForm 보안 검증 추가
- [ ] **Day 5-6**: API 클라이언트 보안 헤더 적용
- [ ] **Day 7-8**: 감사 추적 Hook 구현
- [ ] **Day 9-10**: 주요 Hook에 감사 로깅 적용

### **Week 3-4: 신뢰성 향상**

- [ ] **Day 1-2**: 에러 바운더리 강화
- [ ] **Day 3-4**: 성능 모니터링 시스템 구축
- [ ] **Day 5-6**: 메모리 관리 최적화
- [ ] **Day 7-8**: 트랜잭션 처리 시스템 구현
- [ ] **Day 9-10**: 자동 복구 메커니즘 구현

### **Week 5-6: 사용성 개선**

- [ ] **Day 1-2**: 접근성 검사 도구 구현
- [ ] **Day 3-4**: WCAG 2.1 AA 준수 확인
- [ ] **Day 5-6**: 성능 최적화 적용
- [ ] **Day 7**: 문서화 완성
- [ ] **Day 8-10**: 통합 테스트 및 검증

## 🚀 **즉시 시작 가능한 첫 단계**

```bash
# 1. 보안 패키지 설치
pnpm add dompurify zod web-vitals
pnpm add -D @types/dompurify

# 2. 보안 유틸리티 파일 생성
touch src/utils/security.ts
touch src/hooks/useAuditTrail.ts
touch src/utils/performance.ts

# 3. 첫 번째 보안 검증 적용
# - DynamicFormComponent에 SecurityUtils 적용
# - 기존 코드 최소 변경으로 보안 강화

# 4. 점진적 적용
# - 한 번에 하나씩 컴포넌트/Hook 개선
# - 기존 기능 영향 없이 보안 기능 추가
```

## 💡 **핵심 구현 원칙**

### **1. 기존 코드 보존**

- 기존 컴포넌트/Hook의 인터페이스 유지
- 새로운 기능은 선택적 적용
- 점진적 마이그레이션 지원

### **2. 성능 영향 최소화**

- 비동기 처리로 사용자 경험 보호
- 로컬 캐싱으로 네트워크 부하 감소
- 개발/운영 환경별 차별 적용

### **3. 개발자 친화적**

- 명확한 에러 메시지
- 개발 도구 지원
- 상세한 문서화

**🎯 이 방식으로 구현하면 기존 Primes 시스템의 안정성을 유지하면서도 GS 인증 요구사항을 충족할 수 있습니다!**
