# BOM 관리 시스템

Item BOM(Bill of Materials) 관리 기능의 페이지와 컴포넌트들을 포함합니다.

## 📁 디렉토리 구조

```
apps/primes/src/pages/ini/item-bom/
├── IniItemBomStatusPage.tsx          # 메인 현황 페이지
├── IniItemBomListPage.tsx           # 트리뷰 페이지
├── IniItemBomRegisterPage.tsx       # 기존 등록 페이지
├── panels/                          # 페이지 패널 컴포넌트들
│   ├── index.ts
│   ├── RootItemsPanel.tsx          # 완제품 목록 패널
│   └── BomDetailPanel.tsx          # BOM 상세 패널
├── register/                        # 등록 관련 모달들
│   ├── index.ts
│   ├── MaterialRegistrationModal.tsx   # 투입품 등록 모달
│   └── RootProductRegistrationModal.tsx # 완제품 등록 모달
└── components/                      # 재사용 가능한 작은 컴포넌트들
    └── (향후 추가될 작은 컴포넌트들)
```

## 🎯 컴포넌트 역할

### **📊 Panels (패널)**

- **RootItemsPanel**: 완제품 목록 표시 및 관리
- **BomDetailPanel**: 선택된 완제품의 투입품 상세 정보

### **📝 Register (등록)**

- **MaterialRegistrationModal**: 투입품 등록 모달 (공정 선택 포함)
- **RootProductRegistrationModal**: 완제품 등록 모달

### **🧩 Components (컴포넌트)**

- 향후 재사용 가능한 작은 컴포넌트들을 위한 디렉토리

## 🚀 주요 기능

### **투입품 등록 모달 특징**

1. **투입공정 선택** (필수) - 부모제품의 공정 중 선택
2. **제품 선택** (필수) - 투입할 제품 선택
3. **제품 공정 선택** (선택사항) - ItemProgressSelectComponent 활용
4. **투입량** (필수) - 숫자 입력
5. **투입단위** (필수) - CodeSelectComponent('PRD-006') 활용
    - `inputUnitCode`: 선택된 codeValue
    - `inputUnit`: 선택된 codeName

### **API 연동**

- **완제품 목록**: `useFullBomTree()` 훅 사용
- **투입품 상세**: `useMbomListByRootItem()` 훅 사용
- **제품 공정**: `useProgress()` 훅으로 동적 로딩
- **투입단위**: `useCodeFieldQuery('PRD-006')` 훅 사용

## 🔧 사용 방법

```typescript
// 메인 페이지에서 패널 사용
<RootItemsPanel
  rootItems={rootItems}
  onRootItemSelect={handleSelect}
  onRegisterClick={() => setRootModalOpen(true)}
/>

<BomDetailPanel
  selectedRootItem={selectedItem}
  bomDetails={details}
  onMaterialRegisterClick={() => setMaterialModalOpen(true)}
/>

// 등록 모달 사용
<MaterialRegistrationModal
  isOpen={isOpen}
  selectedRootItem={selectedItem}
  productOptions={productOptions}
  onSubmit={handleSubmit}
/>
```

## 📋 필드 순서 (투입품 등록)

1. **투입공정 선택** - 어느 공정에 투입될지
2. **제품 선택** - 투입할 제품
3. **제품 공정** - 제품의 어느 공정까지 완료되어야 하는지
4. **투입량** - 투입 수량
5. **투입단위** - PRD-006 코드 그룹에서 선택
