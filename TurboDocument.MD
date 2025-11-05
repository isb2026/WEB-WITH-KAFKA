# 🧩 Monorepo Dependency Management Strategy

> **Comparison: Single Root vs Per-Package `package.json`**
> ✅ **Recommended: Per-package approach for real-world monorepos**

---

## ✅ Comparison Summary | 비교 요약

| 항목                       | 루트 `package.json` 하나만 사용 | 앱/패키지별 `package.json` 사용 (워크스페이스 기반) |
| -------------------------- | ------------------------------- | --------------------------------------------------- |
| **구성 단순성**            | ✅ 매우 간단                    | ❌ 약간 복잡                                        |
| **프로젝트별 빌드/테스트** | ❌ 어렵거나 제한적              | ✅ 독립적으로 가능                                  |
| **캐시 및 병렬화**         | ❌ 낮은 캐시 효율               | ✅ `turbo run`과 최적화                             |
| **의존성 범위 설정**       | ❌ 모든 의존성 공유             | ✅ 프로젝트별 명확하게 설정                         |
| **배포 전략 분리**         | ❌ 어렵고 비효율적              | ✅ 모듈별 배포 유리                                 |
| **버전 충돌 처리**         | ❌ 충돌 해결 어려움             | ✅ 패키지별 버전 설정 가능                          |
| **학습 곡선**              | ✅ 매우 쉬움                    | ❌ 도구 이해 필요                                   |

---

## ✅ Single Root `package.json` Approach

### ✔️ 장점 (Pros)

- 빠르게 셋업 가능 — 초기 구조 설계에 적합
- 의존성 중앙 관리 — 한눈에 보기 쉬움
- 설정 분리가 없어 간단 — 소규모 팀이나 MVP에 유리

### ❌ 단점 (Cons)

- 모든 앱이 같은 의존성을 공유 → 격리가 어려움
- 어떤 패키지가 어떤 의존성을 쓰는지 확인 어려움
- 캐시, 병렬 빌드 비효율적 → `turbo run` 최적화 한계

---

## ✅ Per-App / Per-Package `package.json` (🌟 **Recommended**)

### ✔️ 장점 (Pros)

- 각 패키지가 사용하는 의존성을 명확히 구분 가능
- `turbo run build --filter=apps/web` 등으로 개별 빌드 및 테스트 가능
- 병렬 빌드, 캐시 효율성 ↑
- CI/CD, 모듈 배포 전략에 최적화
- 확장성 뛰어남 (Lerna, Yarn/Nx 스타일 지원)

### ❌ 단점 (Cons)

- 패키지마다 `package.json`, `tsconfig.json` 필요 → 설정 약간 복잡
- 동일 의존성이 여러 패키지에 중복될 수 있음

---

## 🚀 Recommended Strategy | 추천 전략

| 상황                                | 추천 구성 방식                                |
| ----------------------------------- | --------------------------------------------- |
| MVP, PoC, 단일 프로젝트             | 루트 `package.json` 하나로 구성               |
| 실전 프로젝트, 다중 앱/모듈 존재 시 | 패키지별 `package.json` 사용 (workspace 기반) |

> 🔎 **예: ESG, LTS5 등 독립된 앱을 하나의 Monorepo로 관리하는 경우 → 패키지별 관리 방식이 강력히 추천됩니다.**

---

## 🛠️ 추가 도움

- 원하시면 `turbo run --filter` 예제
- 실제 Monorepo 구조 예시
- `pnpm-workspace.yaml`, `tsconfig.base.json` 설정
