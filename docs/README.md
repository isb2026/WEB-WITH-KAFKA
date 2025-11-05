# 📚 MSA React Monorepo Documentation

## 🏗️ **프로젝트별 문서**

### **🎯 [Primes](./primes/README.md)**

- **기업용 ERP 시스템** - 현대적인 기업 전반 업무 프로세스 관리
- **Radix UI + Tailwind CSS** - 접근성과 일관성 중심의 UI
- **React Query + TypeScript** - 타입 안전성과 효율적인 상태 관리
- **완성도**: 🟢 98% (260개 페이지, 422개 Hook)
- **7개 솔루션 도메인**: ini, sales, purchase, production, machine, mold, quality
- **문서**: [개발 가이드](./primes/README.md) | [GS 인증](./primes/gs-certification.md) | [테스트 전략](./primes/testing-strategy.md)

### **🌱 [ESG](./esg/README.md)**

- **ESG 관리 시스템** - 환경, 사회, 지배구조 데이터 통합 관리
- **Falcon UI + Bootstrap** - 대시보드 중심의 사용자 친화적 인터페이스
- **Recharts + KPI Cards** - ESG 데이터 시각화 및 지표 관리
- **완성도**: 🟡 85% (대시보드, 데이터 수집, 리포트 생성)
- **ESG 프레임워크**: GRI, SASB, TCFD, CDP 준수
- **문서**: [개발 가이드](./esg/README.md) | [차트 위젯](./esg/chart-widgets.md) | [KPI 카드](./esg/kpi-cards.md)

### **🤖 [AIPS](./aips/README.md)**

- **AI 기반 생산성 시스템** - 인공지능을 활용한 정보 처리 및 생산성 향상
- **Radix UI + Tailwind CSS** - AI 결과 시각화에 최적화된 UI
- **AI 모듈 + 머신러닝** - 예측 분석, 패턴 인식, 자연어 처리
- **완성도**: 🟡 70% (AI 모듈 기본 구조, NLP 엔진, 데이터 파이프라인)
- **특화 영역**: 머신러닝, 자연어 처리, 컴퓨터 비전, 음성 인식
- **문서**: [개발 가이드](./aips/README.md) | [AI 모듈](./aips/ai-modules.md) | [시스템 아키텍처](./aips/architecture.md)

### **📦 [SCM](./scm/README.md)**

- **공급망 관리 시스템** - 공급업체부터 고객까지의 전체 공급망 최적화
- **Radix UI + Tailwind CSS** - 공급망 시각화에 최적화된 UI
- **React Query + React Table** - 대용량 데이터 처리 및 테이블 관리
- **완성도**: 🟠 40% (기본 구조, 공급업체 관리, 재고 관리)
- **핵심 모듈**: 공급업체 관리, 재고 관리, 물류 관리, 수요 계획, 리스크 관리
- **문서**: [개발 가이드](./scm/README.md) | [시스템 아키텍처](./scm/architecture.md) | [공급업체 관리](./scm/supplier-management.md)

## 🛠️ **공통 문서**

### **[MCP (Model Context Protocol)](./mcp/README.md)**

- **통합 프로젝트 정보 제공 시스템** - 모든 프로젝트의 개발 정보를 한 곳에서 제공
- **개발 패턴 가이드** - 각 프로젝트의 아키텍처, 템플릿, Hook 패턴 안내
- **프로젝트 비교 정보** - 기술 스택, 완성도, 특징 비교를 통한 의사결정 지원
- **문서**: [MCP 가이드](./mcp/README.md) | [통합 정보 시스템](./mcp/server.py) | [사용법 가이드](./mcp/README.md)

### **[공통 컴포넌트](./common/README.md)**

- **패키지 시스템** - 프로젝트별 UI 프레임워크 및 공유 컴포넌트
- **공유 유틸리티** - 타입 정의, 유틸리티 함수, 설정 파일
- **디자인 시스템** - 일관된 UI/UX를 위한 컴포넌트 라이브러리
- **문서**: [컴포넌트 가이드](./common/README.md) | [패키지 구조](./common/packages-guide.md) | [베스트 프랙티스](./common/best-practices.md)

## 🚀 **빠른 시작**

### **새 프로젝트 시작**

```bash
# 프로젝트 클론
git clone <repository-url>
cd msa-react-monorepo

# 의존성 설치
pnpm install

# 개발 서버 시작 (프로젝트별)
pnpm --filter @repo/primes dev      # Primes (포트 3000)
pnpm --filter @repo/esg dev         # ESG (포트 3001)
pnpm --filter @repo/aips dev        # AIPS (포트 3002)
pnpm --filter @repo/scm dev         # SCM (포트 3003)
```

### **MCP 사용**

```bash
# MCP 서버 실행
cd mcp && source venv/bin/activate && python3 server.py

# 프로젝트별 정보 요청
"Primes 개발 패턴 알려줘"
"ESG 특화 기능 설명해줘"
"AIPS AI 기능을 보여줘"
"SCM 핵심 모듈을 설명해줘"
"각 프로젝트의 기술 스택을 비교해줘"
```

### **개발 워크플로우**

```bash
# 1. MCP로 프로젝트 정보 확인
# 2. 프로젝트별 문서 참조
# 3. 템플릿 패턴 적용
# 4. 실제 코드 구현
# 5. 패턴 검증 및 품질 확인
```

## 📋 **문서 업데이트 가이드**

### **새 문서 추가 시**

1. 해당 프로젝트 디렉토리에 문서 생성
2. 프로젝트별 README.md에 링크 추가
3. 이 메인 README.md에 업데이트
4. MCP 서버에 새로운 리소스 추가

### **문서 구조 규칙**

```
docs/
├── README.md (이 파일)
├── primes/
│   ├── README.md (프로젝트 메인)
│   ├── gs-certification.md
│   ├── gs-implementation-plan.md
│   └── testing-strategy.md
├── esg/
│   ├── README.md
│   ├── chart-widgets.md
│   └── kpi-cards.md
├── aips/
│   ├── README.md (프로젝트 메인)
│   ├── ai-modules.md
│   ├── architecture.md
│   └── data-pipeline.md
├── scm/
│   ├── README.md (프로젝트 메인)
│   ├── architecture.md
│   ├── supplier-management.md
│   └── inventory-management.md
├── mcp/
│   ├── README.md
│   ├── server.py
│   └── requirements.txt
└── common/
    ├── README.md
    ├── packages-guide.md
    └── project-status-analysis.md
```

### **MCP 리소스 추가 시**

1. `server.py`에 새로운 리소스 URI 추가
2. 해당 리소스의 정보 제공 함수 구현
3. README.md에 사용법 업데이트
4. 테스트 및 검증

## 🔄 **프로젝트별 특징 비교**

### **UI 프레임워크**

- **Primes, AIPS, SCM**: Radix UI + Tailwind CSS (일관성, 접근성)
- **ESG**: Falcon UI + Bootstrap + Material-UI (대시보드, 차트 최적화)

### **개발 완성도**

- **Primes**: 🟢 98% (프로덕션 준비 완료)
- **ESG**: 🟡 85% (핵심 기능 완성, 고도화 진행 중)
- **AIPS**: 🟡 70% (기본 구조 완성, AI 모듈 개발 중)
- **SCM**: 🟠 40% (기본 구조, 핵심 모듈 개발 중)

### **특화 영역**

- **Primes**: ERP 업무 프로세스, 7개 솔루션 도메인
- **ESG**: 지속가능성 관리, ESG 프레임워크 준수
- **AIPS**: AI 통합, 머신러닝, 정보 처리
- **SCM**: 공급망 최적화, 리스크 관리

## 🔗 **관련 링크**

- **Repository**: [GitHub](https://github.com/your-org/msa-react-monorepo)
- **Issue Tracker**: [GitHub Issues](https://github.com/your-org/msa-react-monorepo/issues)
- **Wiki**: [Project Wiki](https://github.com/your-org/msa-react-monorepo/wiki)
- **Deployment**: [Production Environment](https://your-production-url.com)

## 📞 **지원 및 연락처**

- **Primes**: primes-dev@company.com
- **ESG**: esg-dev@company.com
- **AIPS**: aips-dev@company.com
- **SCM**: scm-dev@company.com
- **공통**: dev-team@company.com

---

**📝 Last Updated**: 2025-01-08  
**🎯 Current Version**: v2.0.0  
**👥 Team**: Development Team  
**🏗️ Architecture**: Monorepo with Turborepo
