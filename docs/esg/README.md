# 🌱 ESG 프로젝트 문서

## 📋 **프로젝트 개요**

ESG는 지속가능성 관리 시스템으로, 환경(Environmental), 사회(Social), 지배구조(Governance) 데이터를 통합 관리하는 대시보드 중심의 웹 애플리케이션입니다.

### **🏗️ 기술 스택**

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Falcon UI + Bootstrap + Material-UI
- **Charts**: Recharts (ESG 데이터 시각화 최적화)
- **State Management**: React Query
- **Build Tool**: Vite

### **📊 현재 상태**

- **완성도**: 🟡 85%
- **주요 기능**: 대시보드, 데이터 수집, 리포트 생성
- **특화 영역**: ESG 프레임워크 준수 (GRI, SASB, TCFD, CDP)

## 📚 **문서 목록**

### **🎨 UI 컴포넌트**

- **[차트 위젯](./chart-widgets.md)**: ESG 특화 차트 컴포넌트 가이드
- **[KPI 카드](./kpi-cards.md)**: ESG 지표 카드 컴포넌트 사용법

### **🏗️ 아키텍처**

- **[템플릿 시스템](../mcp/template-usage-guide.md)**: ESG 전용 템플릿 가이드
- **[개발 패턴](../../.cursorrules)**: ESG 개발 표준 및 패턴

## 🎯 **ESG 특화 기능**

### **📊 Dashboard Templates**

- **DashboardPage**: ESG 메트릭 대시보드 with KPI cards
- **ReportPage**: ESG 리포트 빌더 (GRI, SASB, TCFD 템플릿)
- **CollectPage**: 데이터 수집 with 검증
- **GroupGridPage**: 그룹 네비게이션 + 데이터 그리드 레이아웃

### **📈 Chart Widgets**

- **Line Charts**: 시계열 ESG 데이터 (배출량, 에너지 사용량)
- **Bar Charts**: 카테고리별 비교 (Scope 1/2/3 배출량)
- **Area Charts**: 누적 데이터 표시
- **Pie Charts**: 구성 비율 (에너지원별, 폐기물 유형별)

### **📋 KPI Cards**

- **탄소 배출량**: tCO2e 단위, 목표 대비 진행률
- **에너지 사용량**: MWh 단위, 재생에너지 비율
- **물 사용량**: 톤 단위, 재활용률
- **폐기물**: 톤 단위, 재활용률 및 매립률

### **📝 Form Wizards**

- **다단계 데이터 입력**: 기본 정보 → 환경 데이터 → 검토
- **프레임워크 준수**: GRI, SASB, TCFD 표준 자동 적용
- **데이터 품질 관리**: 정확도, 검증 상태 추적

## 🚀 **빠른 시작**

### **개발 환경 설정**

```bash
# 프로젝트 루트에서
cd apps/esg

# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev
```

### **MCP 사용법**

```bash
# ESG 대시보드 생성
pp "CarbonEmission 대시보드 만들어줘"

# ESG 데이터 수집 페이지
pp "WaterUsage 수집 페이지 만들어줘"

# ESG 리포트 페이지
pp "Sustainability 리포트 페이지 만들어줘"
```

### **ESG 컴포넌트 사용**

```typescript
// KPI 카드
<KPICard
  title="탄소 배출량"
  value={1250}
  unit="tCO2e"
  trend={{ direction: "down", percentage: 15 }}
  target={{ value: 1000, unit: "tCO2e" }}
  status="good"
/>

// 차트 위젯
<ChartWidget
  type="line"
  data={emissionsData}
  config={{
    yAxis: { unit: "tCO2e" },
    series: [
      { dataKey: "scope1", name: "Scope 1", color: "#FF6B35" },
      { dataKey: "scope2", name: "Scope 2", color: "#004E89" }
    ]
  }}
/>

// 폼 위저드
<FormWizard
  steps={[
    { id: "basic", title: "기본 정보", fields: [...] },
    { id: "environmental", title: "환경 데이터", fields: [...] },
    { id: "review", title: "검토", fields: [] }
  ]}
  currentStep={currentStep}
  onNext={handleNext}
  onSubmit={handleSubmit}
/>
```

## 🌍 **ESG 프레임워크 지원**

### **GRI (Global Reporting Initiative)**

- 표준 지표 자동 매핑
- 보고서 템플릿 제공
- 데이터 검증 규칙

### **SASB (Sustainability Accounting Standards Board)**

- 산업별 특화 지표
- 재무적 중요성 평가
- 투자자 중심 보고

### **TCFD (Task Force on Climate-related Financial Disclosures)**

- 기후 리스크 평가
- 시나리오 분석
- 거버넌스 체계

### **CDP (Carbon Disclosure Project)**

- 탄소 배출 데이터 관리
- 공급망 배출량 추적
- 기후 변화 대응 전략

## 📊 **데이터 품질 관리**

### **검증 시스템**

```typescript
const esgValidation = z.object({
	carbonEmissions: z.number().min(0, '배출량은 0 이상이어야 합니다'),
	unit: z.enum(['tCO2e', 'kgCO2e'], '지원되지 않는 단위입니다'),
	framework: z.enum(['GRI', 'SASB', 'TCFD'], 'ESG 프레임워크를 선택하세요'),
	dataQuality: z.object({
		accuracy: z.number().min(0).max(100),
		verificationStatus: z.enum(['verified', 'unverified', 'pending']),
	}),
});
```

### **실시간 데이터 모니터링**

- WebSocket 기반 실시간 업데이트
- 데이터 이상치 자동 감지
- 알림 시스템 통합

## 🔗 **관련 링크**

- **[메인 문서](../README.md)**: 전체 프로젝트 문서
- **[MCP 가이드](../mcp/README.md)**: 코드 생성 시스템
- **[공통 컴포넌트](../common/README.md)**: 공유 컴포넌트
- **[프로젝트 상태](../common/project-status-analysis.md)**: 전체 프로젝트 현황

## 📞 **지원**

- **ESG 개발팀**: esg-dev@company.com
- **이슈 리포트**: [GitHub Issues](https://github.com/your-org/msa-react-monorepo/issues?label=esg)
- **ESG 표준 문의**: esg-standards@company.com

---

**📝 Last Updated**: 2025-01-08  
**🌱 Current Version**: v1.5.0  
**👥 Team**: ESG Development Team
