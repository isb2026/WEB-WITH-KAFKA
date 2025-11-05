# 디자인 문서

## 개요

ESG 애플리케이션의 로그인 페이지에서 로그인 폼을 화면 중앙에 완벽하게 정렬하기 위한 디자인입니다. 현재 Bootstrap 기반의 스타일링을 사용하고 있으며, Falcon UI와 Moornmo UI 컴포넌트를 활용하는 기존 아키텍처를 유지하면서 개선합니다.

## 아키텍처

### 현재 구조 분석

```
LoginPage (apps/esg/src/pages/auth/LoginPage.tsx)
├── div.w-50.m-auto.d-flex.center (현재 래퍼)
└── LoginTemplate (@repo/moornmo-ui)
    ├── Flex (제목 영역)
    └── LoginFormComponent (폼 영역)
```

### 개선된 구조

```
LoginPage
├── FullScreenContainer (새로운 전체 화면 컨테이너)
└── CenteredLoginWrapper (중앙 정렬 래퍼)
    └── LoginTemplate (기존 컴포넌트 유지)
        ├── Flex (제목 영역)
        └── LoginFormComponent (폼 영역)
```

## 컴포넌트 및 인터페이스

### 1. LoginPage 컴포넌트 개선

#### 현재 문제점
- `w-50 m-auto d-flex center` 클래스 조합이 완전한 중앙 정렬을 제공하지 못함
- 세로 중앙 정렬이 부족함
- 반응형 디자인 고려 부족

#### 개선 방안
```typescript
// 새로운 스타일링 접근법
const LoginPage: React.FC = () => {
  return (
    <div className="login-page-container">
      <div className="login-content-wrapper">
        <LoginTemplate {...props} />
      </div>
    </div>
  );
};
```

### 2. CSS 스타일링 전략

#### Flexbox 기반 중앙 정렬
```css
.login-page-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bs-body-bg, #f8f9fa);
  padding: 1rem;
}

.login-content-wrapper {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  padding: 2rem;
}
```

#### Bootstrap 유틸리티 클래스 활용
```typescript
// Bootstrap 클래스 조합 방식
<div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
  <div className="w-100" style={{ maxWidth: '400px' }}>
    <div className="bg-white rounded shadow-sm p-4">
      <LoginTemplate {...props} />
    </div>
  </div>
</div>
```

### 3. 반응형 디자인

#### 브레이크포인트별 대응
- **모바일 (< 576px)**: 전체 너비 사용, 최소 패딩 유지
- **태블릿 (576px - 768px)**: 최대 너비 500px
- **데스크톱 (> 768px)**: 최대 너비 400px

```css
.login-content-wrapper {
  width: 100%;
  max-width: 400px;
}

@media (max-width: 575.98px) {
  .login-content-wrapper {
    max-width: none;
    margin: 0 1rem;
  }
  
  .login-page-container {
    padding: 1rem;
  }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .login-content-wrapper {
    max-width: 500px;
  }
}
```

## 데이터 모델

### 스타일링 설정 인터페이스
```typescript
interface LoginPageStyles {
  containerClass: string;
  wrapperClass: string;
  contentMaxWidth: string;
  backgroundStyle?: React.CSSProperties;
}

interface ResponsiveConfig {
  mobile: {
    maxWidth: string;
    padding: string;
  };
  tablet: {
    maxWidth: string;
    padding: string;
  };
  desktop: {
    maxWidth: string;
    padding: string;
  };
}
```

## 에러 처리

### 스타일링 관련 에러 처리
1. **CSS 로드 실패**: 기본 인라인 스타일 fallback 제공
2. **반응형 브레이크포인트 오류**: 기본 너비값 사용
3. **브라우저 호환성**: CSS Grid fallback을 위한 Flexbox 사용

### 접근성 에러 처리
1. **포커스 관리**: 페이지 로드 시 첫 번째 입력 필드로 포커스 이동
2. **키보드 네비게이션**: Tab 순서 보장
3. **스크린 리더**: 적절한 ARIA 레이블 제공

## 테스트 전략

### 1. 시각적 회귀 테스트
- 다양한 화면 크기에서의 중앙 정렬 확인
- 브라우저별 렌더링 차이 검증
- 다크모드/라이트모드 테스트

### 2. 반응형 테스트
```typescript
describe('LoginPage Responsive Design', () => {
  test('should center login form on desktop', () => {
    // 1920x1080 해상도 테스트
  });
  
  test('should center login form on tablet', () => {
    // 768x1024 해상도 테스트
  });
  
  test('should center login form on mobile', () => {
    // 375x667 해상도 테스트
  });
});
```

### 3. 접근성 테스트
- 키보드 네비게이션 테스트
- 스크린 리더 호환성 테스트
- 색상 대비 테스트
- 포커스 관리 테스트

### 4. 성능 테스트
- CSS 로딩 시간 측정
- 렌더링 성능 확인
- 메모리 사용량 모니터링

## 구현 고려사항

### 1. 기존 컴포넌트 호환성
- LoginTemplate 컴포넌트의 기존 props 인터페이스 유지
- Moornmo UI 컴포넌트 스타일과의 충돌 방지
- Falcon UI 레이아웃과의 일관성 유지

### 2. Bootstrap 통합
- 기존 Bootstrap 테마와의 일관성
- 유틸리티 클래스 우선 사용
- 커스텀 CSS 최소화

### 3. 성능 최적화
- CSS-in-JS 대신 CSS 클래스 사용
- 불필요한 리렌더링 방지
- 이미지 및 폰트 최적화

### 4. 유지보수성
- 명확한 클래스 네이밍 규칙
- 재사용 가능한 스타일 컴포넌트
- 문서화된 스타일 가이드

## 디자인 결정사항

### 1. 레이아웃 방식 선택
**선택**: CSS Flexbox
**이유**: 
- 브라우저 호환성 우수
- 간단한 중앙 정렬 구현
- Bootstrap과의 호환성

### 2. 스타일링 방법 선택
**선택**: Bootstrap 유틸리티 클래스 + 최소 커스텀 CSS
**이유**:
- 기존 프로젝트 패턴과 일관성
- 유지보수 용이성
- 번들 크기 최적화

### 3. 반응형 전략
**선택**: Mobile-first 접근법
**이유**:
- 모바일 사용자 경험 우선
- 점진적 향상 원칙
- 성능 최적화

이 디자인은 ESG 애플리케이션의 기존 아키텍처를 존중하면서도 사용자 경험을 크게 개선할 수 있는 실용적인 솔루션을 제공합니다.