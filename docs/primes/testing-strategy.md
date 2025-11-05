# 🧪 Primes 테스트 전략 가이드 (로그인 기반 API 대응)

## 📋 **현재 상황 분석**

### **🔍 현재 테스트 환경**
- ❌ **테스트 스크립트 없음**: `"test": "echo \"Error: no test specified\" && exit 1"`
- ❌ **테스트 프레임워크 미설치**: Jest, Vitest, Testing Library 등 없음
- ✅ **테스트 라우트 존재**: 개발용 테스트 페이지들 (`/search-test`, `/form-test` 등)
- ✅ **TypeScript 완전 적용**: 타입 안전성 확보

### **🚨 주요 도전과제**
1. **로그인 필수 API**: 모든 API 호출에 JWT 토큰 필요
2. **복잡한 인증 플로우**: 토큰 갱신, 세션 관리
3. **422개 훅, 260개 페이지**: 대규모 테스트 대상
4. **실제 백엔드 의존성**: Mock 처리 필요

## 🎯 **테스트 전략 설계**

### **1. 테스트 피라미드 구조**

```
        🔺 E2E Tests (5%)
       ────────────────
      🔺🔺 Integration Tests (15%)
     ──────────────────────────
    🔺🔺🔺 Unit Tests (80%)
   ────────────────────────────
```

#### **A. Unit Tests (80%) - 우선순위 HIGH**
- **대상**: Hooks, Utils, Components (로직 부분)
- **특징**: 빠른 실행, 독립적, Mock 활용
- **도구**: Vitest + Testing Library

#### **B. Integration Tests (15%) - 우선순위 MEDIUM**
- **대상**: API 연동, 페이지 플로우
- **특징**: 실제 API 호출, 인증 포함
- **도구**: Vitest + MSW (Mock Service Worker)

#### **C. E2E Tests (5%) - 우선순위 LOW**
- **대상**: 핵심 사용자 플로우
- **특징**: 브라우저 자동화, 실제 환경
- **도구**: Playwright

## 🛠️ **테스트 환경 구축**

### **1. 필수 패키지 설치**

```bash
# 테스트 프레임워크
pnpm add -D vitest @vitest/ui @vitest/coverage-v8

# React 테스트 유틸리티
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Mock 서버 (API 모킹)
pnpm add -D msw

# E2E 테스트 (선택사항)
pnpm add -D @playwright/test

# 추가 유틸리티
pnpm add -D jsdom happy-dom
```

### **2. Vitest 설정**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/script/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@primes': path.resolve(__dirname, './src'),
      '@repo': path.resolve(__dirname, '../../packages')
    }
  }
});
```

### **3. 테스트 설정 파일**

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// MSW 서버 설정
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// 전역 모킹
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 환경변수 모킹
vi.mock('import.meta', () => ({
  env: {
    VITE_API_BASE_URL: 'http://localhost:8080',
    MODE: 'test'
  }
}));
```

## 🔐 **로그인 기반 API 테스트 전략**

### **1. Mock Service Worker (MSW) 설정**

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

// 인증 관련 Mock
export const authHandlers = [
  // 로그인 Mock
  http.post('/user/auth/login', async ({ request }) => {
    const { username, password } = await request.json();
    
    if (username === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        status: 'success',
        data: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            roles: ['USER']
          }
        }
      });
    }
    
    return HttpResponse.json(
      { status: 'error', message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // 토큰 갱신 Mock
  http.post('/user/auth/refresh', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        accessToken: 'new-mock-access-token'
      }
    });
  }),

  // 사용자 정보 Mock
  http.get('/user/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return HttpResponse.json({
      status: 'success',
      data: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        roles: ['USER']
      }
    });
  })
];

// 비즈니스 로직 Mock
export const businessHandlers = [
  // Vendor API Mock
  http.get('/ini/vendor', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return HttpResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    
    return HttpResponse.json({
      status: 'success',
      data: {
        content: [
          {
            id: 1,
            vendorName: 'Test Vendor 1',
            vendorCode: 'V001',
            companyRegNo: '123-45-67890'
          },
          {
            id: 2,
            vendorName: 'Test Vendor 2',
            vendorCode: 'V002',
            companyRegNo: '123-45-67891'
          }
        ],
        totalElements: 2,
        totalPages: 1,
        size,
        number: page
      }
    });
  }),

  // Vendor 생성 Mock
  http.post('/ini/vendor', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return HttpResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    return HttpResponse.json({
      status: 'success',
      data: {
        id: 3,
        ...data,
        createdAt: new Date().toISOString()
      }
    });
  })
];

export const handlers = [...authHandlers, ...businessHandlers];
```

```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### **2. 인증 테스트 유틸리티**

```typescript
// src/test/utils/auth-utils.ts
import { QueryClient } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

// 인증된 사용자 모킹
export const mockAuthenticatedUser = () => {
  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    roles: ['USER']
  };
  
  // localStorage에 토큰 저장
  localStorage.setItem('accessToken', 'mock-access-token');
  localStorage.setItem('refreshToken', 'mock-refresh-token');
  localStorage.setItem('user', JSON.stringify(mockUser));
  
  return mockUser;
};

// 인증 해제
export const clearAuthMock = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// 테스트용 Wrapper
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authenticated?: boolean;
  queryClient?: QueryClient;
}

export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { authenticated = true, queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  }), ...renderOptions } = options;
  
  if (authenticated) {
    mockAuthenticatedUser();
  } else {
    clearAuthMock();
  }
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  );
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};
```

## 🧪 **테스트 패턴별 구현**

### **1. Hook 테스트 (Unit Test)**

```typescript
// src/hooks/ini/vendor/__tests__/useVendor.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useVendors } from '../useVendor';
import { mockAuthenticatedUser, clearAuthMock } from '../../../test/utils/auth-utils';

describe('useVendors', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    mockAuthenticatedUser();
  });
  
  afterEach(() => {
    clearAuthMock();
  });
  
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  it('should fetch vendor list successfully', async () => {
    const { result } = renderHook(
      () => useVendors({ page: 0, size: 10 }),
      { wrapper }
    );
    
    await waitFor(() => {
      expect(result.current.list.isSuccess).toBe(true);
    });
    
    expect(result.current.list.data?.content).toHaveLength(2);
    expect(result.current.list.data?.content[0].vendorName).toBe('Test Vendor 1');
  });
  
  it('should handle create vendor mutation', async () => {
    const { result } = renderHook(
      () => useVendors({ page: 0, size: 10 }),
      { wrapper }
    );
    
    const newVendor = {
      vendorName: 'New Vendor',
      vendorCode: 'V003',
      companyRegNo: '123-45-67892'
    };
    
    result.current.create.mutate(newVendor);
    
    await waitFor(() => {
      expect(result.current.create.isSuccess).toBe(true);
    });
    
    expect(result.current.create.data?.vendorName).toBe('New Vendor');
  });
  
  it('should handle unauthorized error', async () => {
    clearAuthMock(); // 인증 해제
    
    const { result } = renderHook(
      () => useVendors({ page: 0, size: 10 }),
      { wrapper }
    );
    
    await waitFor(() => {
      expect(result.current.list.isError).toBe(true);
    });
    
    expect(result.current.list.error?.message).toContain('Unauthorized');
  });
});
```

### **2. 컴포넌트 테스트 (Integration Test)**

```typescript
// src/pages/ini/vendor/__tests__/IniVendorListPage.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IniVendorListPage } from '../IniVendorListPage';
import { renderWithProviders } from '../../../test/utils/auth-utils';

describe('IniVendorListPage', () => {
  beforeEach(() => {
    // 각 테스트 전에 인증 상태 초기화
  });
  
  it('should render vendor list with data', async () => {
    renderWithProviders(<IniVendorListPage />);
    
    // 로딩 상태 확인
    expect(screen.getByText(/로딩/)).toBeInTheDocument();
    
    // 데이터 로드 완료 대기
    await waitFor(() => {
      expect(screen.getByText('Test Vendor 1')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Vendor 2')).toBeInTheDocument();
    expect(screen.getByText('V001')).toBeInTheDocument();
  });
  
  it('should open create modal when register button clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IniVendorListPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Vendor 1')).toBeInTheDocument();
    });
    
    // 등록 버튼 클릭
    const registerButton = screen.getByRole('button', { name: /등록/ });
    await user.click(registerButton);
    
    // 모달 열림 확인
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/거래처 등록/)).toBeInTheDocument();
  });
  
  it('should handle search functionality', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IniVendorListPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Vendor 1')).toBeInTheDocument();
    });
    
    // 검색 입력
    const searchInput = screen.getByPlaceholderText(/검색/);
    await user.type(searchInput, 'Test Vendor 1');
    
    // 검색 버튼 클릭
    const searchButton = screen.getByRole('button', { name: /검색/ });
    await user.click(searchButton);
    
    // 검색 결과 확인 (MSW에서 필터링 로직 구현 필요)
    await waitFor(() => {
      expect(screen.getByText('Test Vendor 1')).toBeInTheDocument();
    });
  });
  
  it('should redirect to login when unauthorized', async () => {
    renderWithProviders(<IniVendorListPage />, { authenticated: false });
    
    // 인증 오류 처리 확인
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });
});
```

### **3. E2E 테스트 (선택사항)**

```typescript
// tests/e2e/vendor-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Vendor Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 처리
    await page.goto('/login');
    await page.fill('[name="username"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });
  
  test('should complete vendor creation flow', async ({ page }) => {
    // 거래처 관리 페이지로 이동
    await page.goto('/ini/vendor/list');
    
    // 등록 버튼 클릭
    await page.click('button:has-text("등록")');
    
    // 모달에서 데이터 입력
    await page.fill('[name="vendorName"]', 'E2E Test Vendor');
    await page.fill('[name="vendorCode"]', 'V999');
    await page.fill('[name="companyRegNo"]', '999-99-99999');
    
    // 저장 버튼 클릭
    await page.click('button:has-text("저장")');
    
    // 성공 메시지 확인
    await expect(page.locator('.toast-success')).toBeVisible();
    
    // 목록에서 새로 생성된 항목 확인
    await expect(page.locator('text=E2E Test Vendor')).toBeVisible();
  });
});
```

## 📊 **테스트 실행 및 관리**

### **1. package.json 스크립트 업데이트**

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### **2. 테스트 실행 명령어**

```bash
# 전체 테스트 실행
pnpm test

# 특정 파일 테스트
pnpm test useVendor

# 커버리지 포함 실행
pnpm test:coverage

# UI 모드로 실행
pnpm test:ui

# E2E 테스트 실행
pnpm test:e2e
```

### **3. CI/CD 통합**

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test:run
      - run: pnpm test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 🎯 **테스트 우선순위 및 로드맵**

### **Phase 1: 기본 테스트 환경 구축 (1주)**
- [ ] Vitest + Testing Library 설정
- [ ] MSW 기본 설정
- [ ] 인증 Mock 구현
- [ ] 테스트 유틸리티 작성

### **Phase 2: 핵심 Hook 테스트 (2주)**
- [ ] useVendor 테스트 (예시)
- [ ] useAuth 테스트
- [ ] useErrorBoundary 테스트
- [ ] 주요 비즈니스 로직 Hook 테스트

### **Phase 3: 컴포넌트 테스트 (2주)**
- [ ] DynamicForm 테스트
- [ ] DatatableComponent 테스트
- [ ] 주요 페이지 컴포넌트 테스트
- [ ] 모달/다이얼로그 테스트

### **Phase 4: E2E 테스트 (1주, 선택사항)**
- [ ] Playwright 설정
- [ ] 핵심 사용자 플로우 테스트
- [ ] 인증 플로우 테스트

## 💡 **테스트 모범 사례**

### **1. 테스트 작성 원칙**
- **AAA 패턴**: Arrange, Act, Assert
- **단일 책임**: 하나의 테스트는 하나의 기능만 검증
- **독립성**: 테스트 간 의존성 없음
- **반복 가능**: 언제든 동일한 결과

### **2. Mock 전략**
- **API 호출**: MSW로 Mock
- **외부 라이브러리**: vi.mock() 사용
- **환경변수**: 테스트용 값 설정
- **타이머**: vi.useFakeTimers() 활용

### **3. 테스트 데이터 관리**
- **Factory 패턴**: 테스트 데이터 생성기
- **Fixture**: 재사용 가능한 테스트 데이터
- **Builder 패턴**: 복잡한 객체 생성

## 🚀 **즉시 시작 가능한 첫 단계**

```bash
# 1. 테스트 패키지 설치
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event msw jsdom

# 2. 설정 파일 생성
# - vitest.config.ts
# - src/test/setup.ts
# - src/test/mocks/handlers.ts

# 3. 첫 번째 테스트 작성
# - src/hooks/ini/vendor/__tests__/useVendor.test.ts

# 4. 테스트 실행
pnpm test
```

**🎯 로그인 기반 API 테스트의 핵심은 MSW를 활용한 인증 Mock과 테스트 유틸리티를 통한 일관된 테스트 환경 구축입니다!**
