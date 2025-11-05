# 📚 통합 프로젝트 정보 제공용 MCP 서버

## 🎯 **목적**

이 MCP 서버는 **모든 프로젝트(Primes, ESG, AIPS, SCM)의 개발 정보를 통합하여 제공**하는 용도로 설계되었습니다.

## 🚀 **주요 기능**

### **🎯 Primes 프로젝트 (ERP 시스템)**

- **프로젝트 개요**: 기술 스택, 현재 상태, 주요 특징
- **개발 패턴**: 아키텍처, UI 컴포넌트, Hook 패턴
- **템플릿 시스템**: SinglePage, MasterDetailPage, TabNavigation
- **솔루션 도메인**: 7개 도메인 (ini, sales, purchase, production, machine, mold, quality)

### **🌱 ESG 프로젝트 (지속가능성 관리)**

- **프로젝트 개요**: ESG 관리 시스템, 기술 스택
- **특화 기능**: Dashboard, Chart Widgets, KPI Cards, Form Wizards
- **ESG 프레임워크**: GRI, SASB, TCFD, CDP 준수

### **🤖 AIPS 프로젝트 (AI 생산성 시스템)**

- **프로젝트 개요**: AI 기반 생산성 시스템
- **AI 기능**: AI 통합, 정보 처리, 생산성 향상
- **특화 영역**: 머신러닝, 자연어 처리, 이미지 인식

### **📦 SCM 프로젝트 (공급망 관리)**

- **프로젝트 개요**: 공급망 관리 시스템
- **핵심 모듈**: 공급업체 관리, 재고 관리, 물류 관리
- **특화 기능**: 공급망 시각화, 리스크 관리

### **🔗 공통 정보**

- **Swagger 정보**: API 스키마 및 설정 방법
- **공통 패키지**: UI 컴포넌트, 차트, 유틸리티
- **프로젝트 비교**: 기술 스택 및 특징 비교

## 🛠️ **설치 및 실행**

### **1. 가상환경 생성 및 의존성 설치**

```bash
cd mcp
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### **2. MCP 서버 설정 (stdio 전용)**

```bash
# MCP 서버는 Cursor IDE가 자동으로 관리합니다
# 백그라운드 실행 불필요
# Cursor IDE 시작 시 자동 실행
# 수동 프로세스 관리 불필요
```

## 📖 **사용법**

### **Cursor에서 MCP 연결**

1. **가상환경 준비**

    ```bash
    cd mcp
    source venv/bin/activate
    ```

2. **Cursor 설정에서 MCP 서버 추가**
    - Cursor 설정 열기 (Cmd/Ctrl + ,)
    - "MCP" 검색
    - "Add MCP Server" 클릭
    - 서버 경로: `python /path/to/mcp/server.py`
    - 또는 `cd /path/to/mcp && source venv/bin/activate && python server.py`

3. **정보 요청**: "Primes 개발 패턴 알려줘", "ESG 특화 기능 설명해줘"

### **사용 가능한 리소스**

#### **🎯 Primes 프로젝트**

- `primes://overview` - 프로젝트 개요
- `primes://patterns` - 개발 패턴
- `primes://templates` - 템플릿 시스템
- `primes://domains` - 솔루션 도메인

#### **🌱 ESG 프로젝트**

- `esg://overview` - 프로젝트 개요
- `esg://features` - 특화 기능
- `esg://frameworks` - ESG 프레임워크

#### **🤖 AIPS 프로젝트**

- `aips://overview` - 프로젝트 개요
- `aips://ai-features` - AI 기능

#### **📦 SCM 프로젝트**

- `scm://overview` - 프로젝트 개요

#### **🔗 공통 정보**

- `common://swagger` - Swagger 정보
- `common://packages` - 공통 패키지
- `common://comparison` - 프로젝트 비교

## 💡 **사용 예시**

### **프로젝트별 정보 확인**

```
"Primes 프로젝트 개요를 알려줘"
"ESG 특화 기능을 설명해줘"
"AIPS AI 기능을 보여줘"
"SCM 프로젝트 상태를 알려줘"
```

### **MCP 서버 연결 테스트**

```bash
# 1. 가상환경 활성화
cd mcp
source venv/bin/activate

# 2. MCP 서버가 정상적으로 시작되는지 확인
# (직접 실행하지 말고 Cursor에서 MCP 연결로 사용)
echo "MCP 서버 준비 완료"
```

### **개발 패턴 확인**

```
"Primes에서 SinglePage 템플릿은 어떻게 사용하나요?"
"ESG 대시보드 템플릿 구조를 설명해줘"
"Atomic Hooks 패턴을 보여줘"
```

### **도메인 정보 확인**

```
"Primes ini 도메인에는 어떤 모듈이 있나요?"
"ESG 프레임워크 준수 방법을 알려줘"
"공통 패키지 구조를 보여줘"
```

### **프로젝트 비교**

```
"각 프로젝트의 기술 스택을 비교해줘"
"프로젝트별 완성도를 보여줘"
"UI 프레임워크 차이점을 설명해줘"
```

## 🔄 **MCP vs 수동 작업**

### **MCP (정보 제공)**

- ✅ **빠른 정보 검색**: 모든 프로젝트의 개발 패턴, 템플릿 구조
- ✅ **패턴 가이드**: 개발할 때 참고할 수 있는 가이드라인
- ✅ **일관성 체크**: 생성된 코드가 패턴에 맞는지 검증
- ✅ **프로젝트 비교**: 여러 프로젝트 간 차이점 및 공통점 파악

### **수동 작업 (실제 구현)**

- ✅ **Swagger 분석**: curl로 직접 가져와서 분석
- ✅ **템플릿 적용**: 문서 기반으로 수동 생성
- ✅ **패턴 검증**: 실제 코드로 테스트

### **⚠️ 현재 MCP 시스템 한계**

- ❌ **코드 생성**: 실제 컴포넌트나 페이지 생성 불가
- ❌ **실시간 동기화**: Swagger 변경사항 실시간 반영 불가
- ❌ **템플릿 적용**: 코드 생성 시 템플릿 자동 적용 불가

### **💡 MCP 활용 전략**

1. **정보 수집**: 프로젝트 패턴 및 Swagger 정보 확인
2. **패턴 파악**: 개발할 기능의 적절한 패턴 선택
3. **참고 자료**: 코드 작성 시 가이드라인으로 활용
4. **검증 도구**: 작성된 코드가 패턴에 맞는지 확인

## 🎯 **장점**

1. **통합 정보 접근**: 모든 프로젝트 정보를 한 곳에서 확인
2. **패턴 일관성**: 모든 개발자가 동일한 패턴 사용
3. **학습 효율성**: 새로운 개발자도 빠르게 패턴 파악
4. **품질 향상**: 검증된 패턴으로 코드 품질 보장
5. **프로젝트 비교**: 기술 스택 및 특징 비교로 의사결정 지원

## 📞 **지원**

- **개발팀**: primes-dev@company.com
- **이슈 리포트**: [GitHub Issues](https://github.com/your-org/msa-react-monorepo/issues)
- **문서 기여**: [Contributing Guide](../../CONTRIBUTING.md)

---

**📝 Last Updated**: 2025-01-08  
**🎯 Current Version**: v2.0.0  
**👥 Team**: Development Team
