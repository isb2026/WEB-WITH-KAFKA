# Requirements Document

## Introduction

Swagger API 문서를 분석하여 자동으로 Primes 메타데이터 config를 생성하는 시스템을 구축합니다. 각 솔루션별 API 구조를 분석하여 master-detail 패턴을 자동 감지하고, 실제 필드 정보를 추출하여 정확한 컬럼 정의를 생성합니다.

## Requirements

### Requirement 1

**User Story:** 개발자로서 Swagger API 문서 URL을 입력하면 자동으로 해당 솔루션의 config 메타데이터가 생성되기를 원한다.

#### Acceptance Criteria

1. WHEN 개발자가 Swagger API URL을 제공하면 THEN 시스템은 API 문서를 분석하여 엔티티 목록을 추출해야 한다
2. WHEN API에 master/detail 엔드포인트가 존재하면 THEN 시스템은 자동으로 masterDetailPage 타입으로 분류해야 한다
3. WHEN API에 master 엔드포인트만 존재하면 THEN 시스템은 singlePage 타입으로 분류해야 한다
4. WHEN 분석이 완료되면 THEN 시스템은 해당 솔루션의 config.json 파일을 생성해야 한다

### Requirement 2

**User Story:** 개발자로서 API 스키마에서 실제 필드 정보를 추출하여 정확한 컬럼 정의를 얻고 싶다.

#### Acceptance Criteria

1. WHEN 시스템이 API 스키마를 분석하면 THEN 각 필드의 타입, 설명, 예시값을 추출해야 한다
2. WHEN 필드 정보를 추출하면 THEN 적절한 컬럼 크기와 헤더명을 자동 생성해야 한다
3. WHEN master-detail 구조를 감지하면 THEN master와 detail 각각의 컬럼을 분리하여 정의해야 한다
4. WHEN 검색 가능한 필드를 식별하면 THEN searchOptions에 자동으로 포함해야 한다

### Requirement 3

**User Story:** 개발자로서 생성된 config를 솔루션별로 분리하여 관리하고 싶다.

#### Acceptance Criteria

1. WHEN config가 생성되면 THEN configs/[solution-name].json 형태로 분리 저장되어야 한다
2. WHEN 메인 generateFromConfig.js가 실행되면 THEN 모든 솔루션 config를 자동으로 병합해야 한다
3. WHEN 특정 솔루션만 업데이트하면 THEN 해당 솔루션 config만 재생성되어야 한다
4. WHEN config 구조가 변경되면 THEN 기존 config와 호환성을 유지해야 한다

### Requirement 4

**User Story:** 개발자로서 여러 솔루션의 API를 일괄 처리하여 전체 시스템을 빠르게 구축하고 싶다.

#### Acceptance Criteria

1. WHEN 여러 솔루션 URL 목록을 제공하면 THEN 시스템은 순차적으로 모든 솔루션을 처리해야 한다
2. WHEN 처리 중 오류가 발생하면 THEN 해당 솔루션을 건너뛰고 나머지를 계속 처리해야 한다
3. WHEN 모든 처리가 완료되면 THEN 전체 결과 요약과 통계를 제공해야 한다
4. WHEN 생성된 config들이 준비되면 THEN 자동으로 페이지 생성까지 실행해야 한다