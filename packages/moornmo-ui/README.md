---
## ✅ 상태관리 설계 원칙 (MVVM 원칙)

### 1. **단일 책임 원칙 (SRP)**
- `Context`는 상태만 제공 (`state`, `dispatch`)
- 상태를 변경하는 **비즈니스 로직은 Custom Hook에 작성**

### 2. **Context는 최대한 얇게!**
- `dispatch()`를 직접 노출하지 않고 `useTab()` 훅을 통해 제어
- 모든 동작은 명확한 함수명으로 추상화 (`addTab`, `setActiveTab` 등)

### 3. **타입 분리로 유지보수성 향상**
- 모든 상태/액션 타입은 `types/` 디렉토리로 분리
- Context/Reducer/Hook 모두 타입 안전성 보장

### 4. **Hook은 도메인별 기능 단위로 분리**
- 예: `useTab()` → 탭 도메인 전용
- 예: `useActionButtons()` → 버튼 상태/핸들러 전용

---

## 🔖 Tabs 도메인 예시

### `useTab()` API

```ts
const {
	tabs, // 등록된 탭 배열
	activeTab, // 현재 활성 탭
	addTab, // 탭 추가
	removeTab, // 탭 제거
	updateTab, // 탭 정보 갱신
	setActiveTab, // 특정 탭 활성화
	clearTabs, // 전체 탭 초기화
} = useTab();
```
