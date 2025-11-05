# Primes Script 코드 생성 개선 설계

## 개요

Primes 앱의 스크립트 기반 코드 생성 시스템을 개선하여 Node.js 20 호환성, 변수명 변환, 코드 품질을 향상시킵니다.

## 아키텍처

### 현재 구조

```
apps/primes/script/
├── template_generater/
│   ├── tabNavigationGenerater.js
│   ├── singlePageGenerater.js
│   ├── masterDetailPageGenerater.js
│   └── registerPageGenerater.js
├── generateFromSolutionConfig.js
├── generateFromConfig.js
└── configs/
    ├── ini.json
    ├── sales.json
    └── ...
```

### 개선된 구조

```
apps/primes/script/
├── .nvmrc                          # Node.js 버전 명시
├── utils/
│   ├── stringUtils.js              # 문자열 변환 유틸리티
│   ├── templateUtils.js            # 템플릿 공통 유틸리티
│   └── columnUtils.js              # 컬럼 생성 유틸리티
├── template_generater/
│   ├── tabNavigationGenerater.js   # 개선된 탭 네비게이션
│   ├── singlePageGenerater.js      # 개선된 단일 페이지
│   ├── masterDetailPageGenerater.js # 개선된 마스터-디테일
│   └── registerPageGenerater.js    # 개선된 등록 페이지
└── ...
```

## 컴포넌트 및 인터페이스

### 1. 문자열 변환 유틸리티 (stringUtils.js)

```javascript
// 하이픈을 camelCase로 변환
export const toCamelCase = (str) => {
	return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

// 하이픈을 PascalCase로 변환
export const toPascalCase = (str) => {
	const camelCase = toCamelCase(str);
	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};

// 안전한 변수명 생성
export const toSafeVariableName = (str) => {
	return str.replace(/[^a-zA-Z0-9]/g, '').replace(/^[0-9]/, '_$&');
};
```

### 2. 호환성 유틸리티 (compatibilityUtils.js)

```javascript
// Optional chaining 대체
export const safeGet = (obj, path, defaultValue = undefined) => {
	return path.split('.').reduce((current, key) => {
		return current && current[key] !== undefined
			? current[key]
			: defaultValue;
	}, obj);
};

// Nullish coalescing 대체
export const nullishCoalescing = (value, fallback) => {
	return value !== null && value !== undefined ? value : fallback;
};
```

### 3. 컬럼 생성 유틸리티 (columnUtils.js)

```javascript
// 기본 컬럼 생성
export const generateDefaultColumns = () => {
	return [
		{ accessorKey: 'id', header: 'ID', size: 80, minSize: 60 },
		{ accessorKey: 'name', header: '이름', size: 150 },
		{ accessorKey: 'code', header: '코드', size: 120 },
		{ accessorKey: 'status', header: '상태', size: 100 },
		{
			accessorKey: 'createdAt',
			header: '등록일시',
			size: 150,
			cell: '({ getValue }: { getValue: () => any }) => formatDate(getValue())',
		},
	];
};

// 컬럼 개선
export const improveColumns = (columns) => {
	return columns.map((col) => {
		const improved = { ...col };

		// 날짜 필드 처리
		if (isDateField(col.accessorKey)) {
			improved.cell =
				'({ getValue }: { getValue: () => any }) => formatDate(getValue())';
		}

		// 기본 크기 설정
		if (!improved.size) {
			improved.size = 120;
		}

		return improved;
	});
};
```

## 데이터 모델

### 템플릿 설정 인터페이스

```typescript
interface TemplateConfig {
	pageKey: string;
	dataHook: string;
	tableTitle: string;
	columns: ColumnDefinition[];
	formFields?: FormField[];
	actions?: ActionDefinition[];
}

interface ColumnDefinition {
	accessorKey: string;
	header: string;
	size?: number;
	minSize?: number;
	cell?: string; // 함수 문자열
}

interface FormField {
	name: string;
	label: string;
	type: string;
	placeholder?: string;
	required?: boolean;
	maxLength?: number;
	options?: SelectOption[];
}
```

## 에러 처리

### 1. 문법 호환성 에러 처리

```javascript
// Optional chaining 감지 및 변환
const convertOptionalChaining = (code) => {
	return code.replace(/(\w+)\?\./g, (match, obj) => {
		return `(${obj} && ${obj}.`;
	});
};

// Nullish coalescing 감지 및 변환
const convertNullishCoalescing = (code) => {
	return code.replace(/(\w+)\s*\?\?\s*(.+)/g, (match, left, right) => {
		return `(${left} !== null && ${left} !== undefined ? ${left} : ${right})`;
	});
};
```

### 2. 변수명 검증

```javascript
const validateVariableName = (name) => {
	const errors = [];

	if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
		errors.push(`Invalid variable name: ${name}`);
	}

	if (/^[0-9]/.test(name)) {
		errors.push(`Variable name cannot start with number: ${name}`);
	}

	return errors;
};
```

## 테스트 전략

### 1. 단위 테스트

- 문자열 변환 함수 테스트
- 컬럼 생성 로직 테스트
- 템플릿 생성 결과 검증

### 2. 통합 테스트

- 전체 생성 프로세스 테스트
- Node.js 20 환경에서 실행 테스트
- 생성된 코드의 문법 검증

### 3. 회귀 테스트

- 기존 설정 파일로 생성 테스트
- 하이픈 포함 모듈명 처리 테스트
- 빈 컬럼 배열 처리 테스트

## 성능 고려사항

### 1. 템플릿 캐싱

```javascript
const templateCache = new Map();

const getCachedTemplate = (key, generator) => {
	if (!templateCache.has(key)) {
		templateCache.set(key, generator());
	}
	return templateCache.get(key);
};
```

### 2. 배치 처리

```javascript
const processSolutionsInBatch = async (solutions, batchSize = 3) => {
	const batches = [];
	for (let i = 0; i < solutions.length; i += batchSize) {
		batches.push(solutions.slice(i, i + batchSize));
	}

	for (const batch of batches) {
		await Promise.all(batch.map(processSolution));
	}
};
```

## 마이그레이션 계획

### Phase 1: 유틸리티 함수 구현

- stringUtils.js 구현
- compatibilityUtils.js 구현
- columnUtils.js 구현

### Phase 2: 템플릿 생성기 개선

- tabNavigationGenerater.js 개선
- singlePageGenerater.js 개선
- 기타 생성기들 개선

### Phase 3: 메인 스크립트 업데이트

- generateFromSolutionConfig.js 업데이트
- generateFromConfig.js 업데이트
- .nvmrc 파일 추가

### Phase 4: 테스트 및 검증

- 기존 설정으로 생성 테스트
- 새로운 기능 테스트
- 성능 테스트
