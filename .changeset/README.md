# 🧩 릴리즈 전략 및 흐름 가이드 (Changeset 기반)

## 📦 기본 흐름 요약

```text
1. feature/* 브랜치 생성 → 작업
2. MR 요청 (GitLab 기준)
3. MR 내에서 `pnpm changeset` 실행 → 버전 후보 작성
4. MR 병합 후 변경 쌓임

--- 여러 PR 반복 후 ---

5. 릴리즈 타이밍에 `pnpm changeset version`
6. 버전 업데이트 & changelog 자동 생성
7. `git commit -am` 후 `git push --follow-tags`
8. 태그 기반 CI/CD 자동 배포
```

---

## 🛠 변경 작성 단계 (`pnpm changeset`)

- MR 요청 전, **변경 사항 요약**을 작성함
- 패키지 선택 → 버전 수준 선택 (patch, minor, major)
- 요약 메시지 작성 → `.changeset/*.md` 생성됨

### 📌 예시

```bash
pnpm changeset
```

```md
---
'esg': minor
---

feat: 보고서 모듈 추가
```

---

## 🔢 버전 정책 (SemVer 기준)

| 타입    | 의미                                      | 예시          |
| ------- | ----------------------------------------- | ------------- |
| `patch` | 버그 수정 또는 UI/문서 등 비기능성 변경   | 1.0.0 → 1.0.1 |
| `minor` | 하위 호환 가능한 기능 추가                | 1.0.0 → 1.1.0 |
| `major` | 하위 호환이 깨지는 변경 (breaking change) | 1.0.0 → 2.0.0 |

> ✅ `patch`는 일반적인 버그 수정에 자주 사용됨
> ✅ `minor`는 새로운 기능이지만 기존 사용자 영향이 없는 경우
> ⚠️ `major`는 API 변경/삭제처럼 주의가 필요한 경우만 사용

---

## 🚀 릴리즈 단계

### [1] 버전 반영

```bash
pnpm changeset version
```

- 모든 `.changeset/*.md` 처리됨
- 관련 `package.json` 버전 변경됨
- `CHANGELOG.md` 자동 업데이트됨

### [2] 커밋 및 푸시

```bash
git commit -am "chore: version bump"
git push --follow-tags
```

---

## ⚙️ CI/CD 연동 (GitLab 기준)

> `.gitlab-ci.yml` 에서 다음처럼 태그 릴리즈 기반으로 잡을 수 있음

```yaml
stages:
    - release

release_job:
    stage: release
    only:
        - tags
    script:
        - echo "🚀 Deploying tag $CI_COMMIT_TAG"
        - docker build -t myapp:$CI_COMMIT_TAG .
        - docker push myapp:$CI_COMMIT_TAG
```

---

## 📝 CHANGELOG 자동화

> Changesets를 통해 릴리즈 시 자동으로 생성됨

- `.changeset/config.json` 설정으로 커스텀 가능

```json
{
	"changelog": [
		"@changesets/changelog-github",
		{ "repo": "your-org/your-repo" }
	],
	"commit": false
}
```

---

## ✅ 핵심 포인트 요약

| 항목                     | 설명                           |
| ------------------------ | ------------------------------ |
| `pnpm changeset`         | 변경사항 기록 (MR 단위)        |
| `pnpm changeset version` | 릴리즈 준비 (병합 후)          |
| `--follow-tags`          | 태그 푸시로 CI/CD 유도         |
| `CHANGELOG`              | 자동 생성, 수동 관리 필요 없음 |

---

## 📚 기타 꿀팁

- 버전 올리지 않으려면 `.changeset/` 만들지 말고 머지
- 실수로 major 선택했으면 `.md` 파일 수정 가능
- 릴리즈 후 태그/버전 rollback은 수동 조정 필요

---

필요하면 이 문서를 팀 위키나 `/docs/RELEASE.md` 등으로 반영 추천합니다 ✅
