# 🔄 Swagger-Code 동기화 시스템 가이드

## 🎯 **개요**

Swagger API 스키마와 현재 프로젝트 코드(Hook, Type, Service)의 동기화 상태를 자동으로 분석하고, 누락되거나 변경된 부분을 감지하여 자동 업데이트를 제안하는 시스템입니다.

### **🚀 주요 기능**

1. **🔍 자동 분석**: Swagger 스키마와 현재 코드 비교
2. **📊 상세 리포트**: 누락된 엔티티, 필드 불일치, 사용되지 않는 코드 감지
3. **🤖 자동 수정 제안**: AI Chat 명령어로 즉시 수정 가능
4. **⚡ 실시간 동기화**: 환경변수 기반으로 최신 Swagger 반영

---

## 🎯 **AI Chat 사용법**

### **전체 동기화 분석**

```bash
# 전체 프로젝트 동기화 상태 분석
"Swagger 동기화 상태 분석해줘"
"코드와 Swagger 동기화 확인해줘"
"전체 동기화 상태 리포트 보여줘"
```

### **특정 엔티티 분석**

```bash
# 특정 엔티티 동기화 상태 확인
"Machine 엔티티 동기화 상태 확인해줘"
"Vendor 동기화 상태 알려줘"
"User 엔티티 Swagger와 비교해줘"

# 자동 수정 (구현 예정)
"Machine 엔티티 자동 수정해줘"
"Vendor 타입 필드 업데이트해줘"
```

## 🎯 **Enhanced Template System Integration (2025-01-08)**

### **📋 Project-Specific Code Generation**

The Swagger sync system now integrates with enhanced template generators:

#### **Primes Project Templates**

```bash
# Generate Primes-style pages with Swagger validation
pp "Vendor 리스트 페이지 만들어줘"

# Auto-generates with Swagger integration:
✅ VendorListPage.tsx (SinglePage template)
✅ VendorTabNavigation.tsx (TabNavigation template)
✅ VendorSelectComponent.tsx (CustomSelect with Field API)
✅ useVendor.ts (Atomic Hooks pattern)
✅ vendorValidation.ts (Zod schema from Swagger)
✅ VendorErrorBoundary.tsx (Error handling)
✅ vendor.json (Translation keys)
```

#### **ESG Project Templates**

```bash
# Generate ESG-style dashboards with Swagger validation
pp "CarbonEmission 대시보드 만들어줘"

# Auto-generates with ESG standards:
✅ CarbonEmissionDashboardPage.tsx (ESG Dashboard)
✅ CarbonEmissionChartWidget.tsx (ESG Charts)
✅ CarbonEmissionKPICard.tsx (ESG KPI Cards)
✅ CarbonEmissionFormWizard.tsx (Multi-step forms)
✅ useCarbonEmission.ts (ESG Hooks with real-time data)
✅ carbonEmissionValidation.ts (ESG framework validation)
```

### **🔧 Unified Schema System**

All generated templates use unified field schemas for consistency:

```typescript
// Swagger field → Unified schema → Multiple outputs
SwaggerField: {
  "vendorName": { "type": "string", "required": true }
}

↓ Converts to ↓

FieldSchema({
  name: "vendorName",
  label: "거래처명",
  type: FieldType.TEXT,
  required: true,
  searchable: true,
  sortable: true
})

↓ Auto-generates ↓

- searchFields: [{ key: "vendorName", type: "text" }]
- tableColumns: [{ accessorKey: "vendorName", header: "거래처명" }]
- formFields: [{ name: "vendorName", type: "text", required: true }]
```

### **⚛️ Enhanced Atomic Hooks with Swagger**

Generated hooks follow atomic pattern with Swagger validation:

```typescript
// Auto-generated from Swagger schema
export const useCreateVendor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateVendorPayload) => {
			// Swagger-validated cleanedParams pattern
			const { vendorName, vendorCode, companyRegNo } = data;
			const cleanedParams = { vendorName, vendorCode, companyRegNo };
			return createVendor(cleanedParams);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vendors'] });
			queryClient.invalidateQueries({ queryKey: ['vendor-fields'] });
		},
	});
};
```

### **✅ Swagger-Based Validation**

Templates include validation schemas generated from Swagger:

```typescript
// Auto-generated from Swagger definitions
export const vendorValidationSchema = z.object({
	vendorName: z
		.string()
		.min(1, '거래처명은 필수 항목입니다')
		.max(200, '거래처명은 200자를 초과할 수 없습니다'),
	vendorCode: z.string().regex(/^V\d{4}$/, '거래처코드 형식: V0001'),
	companyRegNo: z
		.string()
		.regex(/^\d{3}-\d{2}-\d{5}$/, '사업자등록번호 형식이 올바르지 않습니다')
		.optional(),
});
```

### **문제 해결**

```bash
# 연결 상태 확인
"Swagger 상태 확인해줘"
"현재 프로젝트 엔티티 목록 보여줘"

# 환경변수 설정 가이드
"환경변수 설정 방법 알려줘"
"전체 프로젝트 현황 알려줘"
```

---

## 📊 **분석 결과 해석**

### **🔴 누락된 엔티티**

Swagger에는 있지만 프로젝트에 Hook, Type, Service가 없는 엔티티

```markdown
### 🔴 Machine

- **도메인**: machine, production
- **작업**: list, get, create, update, delete
- **필드**: id, name, model, status, createdAt, updatedAt...

## 🚀 자동 생성 명령어

swagger Machine machine --domain=machine

## 🤖 AI Chat 명령어

- "Machine 엔티티 생성해줘"
- "Machine 리스트 페이지 만들어줘"
```

### **🟡 필드 불일치**

엔티티는 존재하지만 Swagger의 최신 필드가 Type 정의에 누락된 경우

```markdown
### 📝 Vendor

- **누락된 필드**: companyRegNo, taxId, creditRating

## 🤖 AI Chat 명령어

- "Vendor 타입 필드 업데이트해줘"
```

### **🟢 동기화 완료**

모든 Hook, Type, Service가 Swagger와 일치하는 상태

```markdown
### ✅ User

- **Hook**: ✅
- **Type**: ✅
- **Service**: ✅
- **모든 필드가 동기화되어 있습니다**
```

---

## 🔧 **분석 과정**

### **1. Swagger 스키마 분석**

```python
# 각 도메인별 Swagger 문서에서 추출
- API 경로 → 엔티티명 추출
- HTTP 메서드 → CRUD 작업 분류
- 스키마 정의 → 필드 목록 추출
- 파라미터/응답 → 타입 정보 수집
```

### **2. 현재 코드 분석**

```python
# 프로젝트 구조 스캔
src/hooks/     → Hook 함수들 분석
src/types/     → TypeScript 인터페이스 분석
src/services/  → API 서비스 함수들 분석
```

### **3. 비교 분석**

```python
# 동기화 상태 확인
- 누락된 엔티티 감지
- 필드 불일치 확인
- 사용되지 않는 코드 식별
- 권장사항 생성
```

---

## 🛠️ **설정 요구사항**

### **환경변수 설정**

동기화 분석을 위해서는 Swagger 환경변수가 필요합니다:

```bash
# Primes 프로젝트 (Multi-Swagger)
export SWAGGER_INI=https://dev-api.primes.company.com/v3/api-docs/ini
export SWAGGER_SALES=https://dev-api.primes.company.com/v3/api-docs/sales
export SWAGGER_MACHINE=https://dev-api.primes.company.com/v3/api-docs/machine

# ESG 프로젝트 (Single-Swagger)
export SWAGGER_DEFAULT=https://dev-api.esg.company.com/v3/api-docs
```

### **프로젝트 구조**

다음 디렉토리 구조를 가정합니다:

```
src/
├── hooks/          # React Query 훅들
│   ├── vendor/
│   └── machine/
├── types/          # TypeScript 타입 정의
│   ├── vendor.ts
│   └── machine.ts
└── services/       # API 서비스 함수들
    ├── vendorService.ts
    └── machineService.ts
```

---

## 🚀 **자동 수정 기능 (구현 예정)**

### **Phase 1: 누락된 엔티티 생성**

```bash
# AI Chat 명령어로 자동 생성
"Machine 엔티티 생성해줘"

# 실행 결과:
✅ src/hooks/machine/useMachine.ts 생성
✅ src/types/machine.ts 생성
✅ src/services/machineService.ts 생성
```

### **Phase 2: 필드 동기화**

```bash
# 누락된 필드 자동 추가
"Vendor 타입 필드 업데이트해줘"

# 실행 결과:
✅ Vendor 인터페이스에 companyRegNo 필드 추가
✅ CreateVendorPayload에 taxId 필드 추가
✅ VendorListColumns에 creditRating 컬럼 추가
```

### **Phase 3: 스마트 업데이트**

```bash
# 전체 프로젝트 자동 동기화
"전체 프로젝트 Swagger와 동기화해줘"

# 실행 결과:
📊 3개 엔티티 생성
🔄 5개 엔티티 필드 업데이트
🧹 2개 사용되지 않는 파일 정리
```

---

## 📋 **분석 리포트 예시**

````markdown
# 🔄 Swagger-Code 동기화 분석 리포트

**분석 시간**: 2025-01-15T10:30:00

## 📊 전체 요약

- **누락된 엔티티**: 3개
- **필드 불일치**: 2개 엔티티
- **사용되지 않는 코드**: 1개 엔티티

## ⚠️ 누락된 엔티티

### 🔴 Machine

- **도메인**: machine, production
- **작업**: list, get, create, update, delete
- **필드**: id, name, model, status, location...

### 🔴 QualityCheck

- **도메인**: quality
- **작업**: list, get, create, update
- **필드**: id, checkDate, result, inspector...

## 🟡 필드 불일치

### 📝 Vendor

- **누락된 필드**: companyRegNo, taxId

### 📝 User

- **누락된 필드**: lastLoginAt

## 🚀 권장사항

### 🔥 1. Create Machine entity with hooks, types, and services

```bash
swagger Machine machine --domain=machine
```
````

### 🔶 2. Add missing fields to Vendor types: companyRegNo, taxId

```bash
update-types Vendor --add-fields=companyRegNo,taxId
```

## 🤖 AI Chat 명령어

- "Machine 엔티티 생성해줘"
- "Vendor 타입 필드 업데이트해줘"
- "Swagger 동기화 상태 다시 확인해줘"

````

---

## 🔍 **고급 기능**

### **필드 타입 분석**
```python
# Swagger 스키마에서 TypeScript 타입 자동 매핑
string → string
integer → number
boolean → boolean
array → Array<T>
object → interface
````

### **관계 분석**

```python
# 엔티티 간 관계 감지
- Foreign Key 필드 식별
- 참조 관계 매핑
- 중첩 객체 구조 분석
```

### **버전 관리**

```python
# 변경 이력 추적
- 필드 추가/삭제 감지
- 타입 변경 확인
- 호환성 검사
```

---

## 💡 **베스트 프랙티스**

### **정기적인 동기화 확인**

```bash
# 주간 동기화 체크
"Swagger 동기화 상태 분석해줘"

# 새로운 API 추가 후
"전체 동기화 상태 리포트 보여줘"
```

### **단계적 업데이트**

```bash
# 1. 누락된 엔티티부터 생성
"Machine 엔티티 생성해줘"

# 2. 필드 불일치 수정
"Vendor 타입 필드 업데이트해줘"

# 3. 전체 확인
"Swagger 동기화 상태 다시 확인해줘"
```

### **팀 협업**

```bash
# 백엔드 API 변경 후 프론트엔드 팀 알림
1. Swagger 문서 업데이트
2. "동기화 상태 분석해줘" 실행
3. 변경사항 리포트 공유
4. 필요한 코드 업데이트 실행
```

---

## 🚨 **주의사항**

### **자동 수정 전 백업**

- 기존 코드 자동 백업
- Git 커밋 권장
- 중요한 커스텀 로직 확인

### **타입 호환성**

- Breaking Change 감지
- 기존 코드 영향도 분석
- 점진적 마이그레이션 권장

### **성능 고려사항**

- 대용량 Swagger 문서 처리 시간
- 네트워크 연결 상태 확인
- 캐시 활용으로 성능 최적화

---

**🎉 이제 Swagger와 코드가 항상 동기화된 상태를 유지할 수 있습니다!** 🚀
