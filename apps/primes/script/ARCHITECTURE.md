# Primes Script 아키텍처 문서

## 🏗️ 전체 아키텍처

```mermaid
graph TB
    subgraph "입력 소스"
        A1[configs/*.json]
        A2[config.json]
        A3[Swagger API]
    end

    subgraph "메인 스크립트"
        B1[generateFromSolutionConfig.js]
        B2[generateFromConfig.js]
        B3[generateFromSwagger.js]
    end

    subgraph "유틸리티 레이어"
        C1[stringUtils.js]
        C2[columnUtils.js]
        C3[templateUtils.js]
        C4[compatibilityUtils.js]
    end

    subgraph "템플릿 생성기"
        D1[singlePageGenerater.js]
        D2[masterDetailPageGenerater.js]
        D3[tabNavigationGenerater.js]
        D4[registerPageGenerater.js]
    end

    subgraph "출력 파일"
        E1[src/pages/]
        E2[src/tabs/]
        E3[src/routes/]
    end

    A1 --> B1
    A2 --> B2
    A3 --> B3

    B1 --> C1
    B1 --> C2
    B1 --> C3
    B1 --> C4

    B2 --> C1
    B2 --> C2
    B2 --> C3
    B2 --> C4

    B3 --> C1
    B3 --> C2
    B3 --> C3
    B3 --> C4

    C1 --> D1
    C1 --> D2
    C1 --> D3
    C1 --> D4

    C2 --> D1
    C2 --> D2

    C3 --> D1
    C3 --> D2
    C3 --> D3
    C3 --> D4

    C4 --> D1
    C4 --> D2
    C4 --> D3
    C4 --> D4

    D1 --> E1
    D2 --> E1
    D3 --> E2
    D4 --> E1

    B1 --> E3
    B2 --> E3
    B3 --> E3
```

## 🔄 솔루션별 코드 생성 흐름

```mermaid
sequenceDiagram
    participant User
    participant Main as generateFromSolutionConfig.js
    participant Utils as Utils Layer
    participant Gen as Template Generators
    participant FS as File System

    User->>Main: npm run generate:solution

    Main->>Main: configs 디렉토리 스캔

    loop 각 솔루션별
        Main->>Main: {solution}.json 로드
        Main->>Utils: 모듈명 변환 (kebab → camel)
        Utils-->>Main: 변환된 이름들

        loop 각 모듈별
            Main->>Main: 탭 정보 파싱

            loop 각 탭별
                alt singlePage
                    Main->>Gen: SinglePageGenerater 호출
                    Gen->>Utils: 컬럼 정보 개선
                    Utils-->>Gen: 개선된 컬럼
                    Gen-->>Main: 페이지 코드
                else masterDetailPage
                    Main->>Gen: MasterDetailPageGenerater 호출
                    Gen->>Utils: 마스터/디테일 컬럼 처리
                    Utils-->>Gen: 처리된 컬럼들
                    Gen-->>Main: 마스터-디테일 코드
                end

                Main->>FS: 페이지 파일 생성
            end

            Main->>Gen: TabNavigationGenerater 호출
            Gen->>Utils: 탭 정보 파싱
            Utils-->>Gen: 파싱된 탭 정보
            Gen-->>Main: 탭 네비게이션 코드
            Main->>FS: 탭 파일 생성

            alt 등록 액션 존재
                Main->>Gen: RegisterPageGenerater 호출
                Gen->>Utils: 폼 필드 개선
                Utils-->>Gen: 개선된 폼 필드
                Gen-->>Main: 등록 페이지 코드
                Main->>FS: 등록 페이지 파일 생성
            end
        end

        Main->>Main: 라우트 템플릿 생성
        Main->>FS: 라우트 파일 생성
    end

    Main->>Main: 모든 설정 병합
    Main->>FS: config.json 생성 (호환성)
    Main-->>User: 생성 완료
```

## 🧩 컴포넌트별 상세 구조

### 1. StringUtils 모듈

```mermaid
graph LR
    A[Input String] --> B{문자열 타입 확인}
    B -->|kebab-case| C[toCamelCase]
    B -->|kebab-case| D[toPascalCase]
    B -->|any| E[toSafeVariableName]

    C --> F[taxInvoice]
    D --> G[TaxInvoice]
    E --> H[safeName]

    F --> I[toHookName]
    G --> J[toComponentName]

    I --> K[useTaxInvoice]
    J --> L[TaxInvoicePage]
```

### 2. ColumnUtils 모듈

```mermaid
graph TD
    A[컬럼 배열 입력] --> B{빈 배열 확인}
    B -->|비어있음| C[generateDefaultColumns]
    B -->|데이터 있음| D[parseColumnsFromString]

    C --> E[기본 컬럼 세트]
    D --> F[파싱된 컬럼들]

    E --> G[improveColumns]
    F --> G

    G --> H{필드 타입 확인}
    H -->|날짜 필드| I[날짜 cell 렌더러 추가]
    H -->|숫자 필드| J[숫자 포맷터 추가]
    H -->|상태 필드| K[상태 렌더러 추가]

    I --> L[최종 컬럼 배열]
    J --> L
    K --> L

    L --> M[columnsToString]
    M --> N[템플릿용 문자열]
```

### 3. 템플릿 생성 과정

```mermaid
graph TD
    A[모듈 설정] --> B[템플릿 타입 결정]

    B --> C{페이지 타입}
    C -->|singlePage| D[SinglePageGenerater]
    C -->|masterDetailPage| E[MasterDetailPageGenerater]
    C -->|register| F[RegisterPageGenerater]

    D --> G[컬럼 정보 처리]
    E --> H[마스터/디테일 컬럼 분리]
    F --> I[폼 필드 개선]

    G --> J[TypeScript 인터페이스 생성]
    H --> K[InfoGrid 키 생성]
    I --> L[기본 폼 필드 추가]

    J --> M[React 컴포넌트 템플릿]
    K --> N[마스터-디테일 템플릿]
    L --> O[등록 폼 템플릿]

    M --> P[파일 생성]
    N --> P
    O --> P
```

## 🔧 에러 처리 및 복구 메커니즘

```mermaid
graph TD
    A[스크립트 실행] --> B{configs 디렉토리 존재?}
    B -->|없음| C[기본 config.json 사용]
    B -->|있음| D[솔루션별 처리]

    D --> E{솔루션 파일 로드}
    E -->|실패| F[해당 솔루션 스킵]
    E -->|성공| G[모듈 처리]

    G --> H{페이지 생성}
    H -->|실패| I[에러 로그 출력]
    H -->|성공| J[파일 저장]

    J --> K{파일 중복?}
    K -->|중복| L[자동 리네이밍 (_1, _2)]
    K -->|없음| M[정상 저장]

    F --> N[다음 솔루션 처리]
    I --> N
    L --> N
    M --> N

    N --> O{모든 솔루션 완료?}
    O -->|아니오| D
    O -->|예| P[병합된 config.json 생성]

    C --> Q[기존 방식으로 처리]
    P --> R[완료]
    Q --> R
```

## 📊 성능 최적화 전략

### 1. 병렬 처리

```mermaid
graph LR
    A[솔루션 목록] --> B[배치 분할]
    B --> C[배치 1: ini, sales, purchase]
    B --> D[배치 2: production, machine, mold]

    C --> E[병렬 처리]
    D --> E

    E --> F[결과 수집]
    F --> G[최종 병합]
```

### 2. 템플릿 캐싱

```mermaid
graph TD
    A[템플릿 요청] --> B{캐시 확인}
    B -->|히트| C[캐시된 템플릿 반환]
    B -->|미스| D[새 템플릿 생성]

    D --> E[캐시에 저장]
    E --> F[템플릿 반환]

    C --> G[사용]
    F --> G
```

## 🎯 확장 포인트

### 1. 새로운 템플릿 생성기 추가

```javascript
// template_generater/newTemplateGenerater.js
export const NewTemplateGenerater = (config) => {
	// 1. 설정 파싱
	// 2. 유틸리티 함수 활용
	// 3. 템플릿 문자열 생성
	// 4. 반환
};
```

### 2. 새로운 유틸리티 함수 추가

```javascript
// utils/newUtils.js
export const newUtilFunction = (input) => {
	// 새로운 유틸리티 로직
};
```

### 3. 새로운 입력 소스 지원

```javascript
// generateFromNewSource.js
import { existingUtils } from './utils/index.js';
import { existingGenerators } from './template_generater/index.js';

export const generateFromNewSource = (source) => {
	// 새로운 소스 파싱 로직
};
```

## 🔍 디버깅 가이드

### 1. 로그 레벨 설정

```bash
# 상세 로그 출력
DEBUG=true npm run generate:solution

# 특정 솔루션만 디버깅
SOLUTION=sales npm run generate:solution
```

### 2. 일반적인 문제들

| 문제                        | 원인                   | 해결책                               |
| --------------------------- | ---------------------- | ------------------------------------ |
| `masterType is not defined` | 타입 정의 누락         | masterDetailPageGenerater.js 확인    |
| `Unexpected token '.'`      | Optional chaining 사용 | compatibilityUtils.js 사용           |
| 파일 생성 실패              | 권한 또는 경로 문제    | 디렉토리 권한 확인                   |
| 하이픈 변환 안됨            | stringUtils 미적용     | 템플릿 생성기에서 유틸리티 사용 확인 |

## 🎯 Primes Standard Patterns (표준 패턴)

### Selected Row Handling Pattern (선택된 행 처리 표준)

#### ✅ **표준 방식 (권장)**

```typescript
// 1. 선택된 데이터를 저장할 state
const [selectedItemData, setSelectedItemData] = useState<ItemType | null>(null);

// 2. selectedRows 변경 감지 (인덱스 기반 접근)
useEffect(() => {
  console.log('selectedRows', selectedRows);
  if (selectedRows.size > 0) {
    const selectedRowIndex = Array.from(selectedRows)[0];
    const rowIndex: number = parseInt(selectedRowIndex);
    const selectedItem: ItemType = data[rowIndex];

    setSelectedItemData(selectedItem || null);
  } else {
    setSelectedItemData(null);
  }
}, [selectedRows, data]);

// 3. 핸들러에서 간단한 검증
const handleEdit = () => {
  console.log('selectedItemData', selectedItemData);
  if (!selectedItemData) {
    toast.warning('수정할 항목을 선택해주세요.');
    return;
  }
  setShowEditModal(true);
};

// 4. DatatableComponent 설정
<DatatableComponent
  enableSingleSelect={true}  // 단일 선택만 허용
  selectedRows={selectedRows}
  toggleRowSelection={toggleRowSelection}
  // ...
/>

// 5. 모달에 데이터 전달
<DraggableDialog
  open={showEditModal}
  content={
    <RegisterComponent
      mode="update"
      selectedItem={selectedItemData}
      onClose={() => setShowEditModal(false)}
    />
  }
/>
```

#### ❌ **비표준 방식 (지양)**

```typescript
// ID로 찾기 - 복잡하고 비효율적
const selectedRowId = Array.from(selectedRows)[0];
const selectedItem = data.find(item => item.id.toString() === selectedRowId);

// 매번 함수로 검색 - 불필요한 연산
const getSelectedItem = () => {
  return data.find(/* ... */);
};

// 별도 state 없이 매번 계산
{selectedRows.size > 0 && <Modal selectedItem={getSelectedItem()} />}
```

#### 🎯 **패턴의 장점**

- **🚀 성능**: 인덱스 직접 접근 (O(1))
- **🔄 일관성**: 모든 리스트 페이지에서 동일한 패턴
- **🐛 디버깅**: 로그로 쉽게 추적 가능
- **🧹 간소화**: 복잡한 검색 로직 불필요
- **⚡ 실시간**: selectedRows 변경 시 즉시 반영

이 아키텍처 문서는 시스템의 전체적인 구조와 동작 방식을 이해하는 데 도움이 됩니다.
