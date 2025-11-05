#!/usr/bin/env python3
"""
통합 프로젝트 정보 제공용 MCP 서버 (stdio 전용)
- Primes, ESG, AIPS, SCM 모든 프로젝트 정보 제공
- 개발 패턴, 템플릿, Swagger 정보
- 실제 Swagger URL 기반 API 정보 제공
- Cursor IDE가 자동으로 프로세스 관리 (백그라운드 실행 불필요)
"""

import asyncio
import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
from mcp.server.stdio import stdio_server
from mcp.types import (
    Resource,
    TextContent,
    ImageContent,
    EmbeddedResource,
    LoggingLevel,
)

# 프로젝트 루트 경로
PROJECT_ROOT = Path(__file__).parent.parent

# 실제 Swagger URL들
SWAGGER_URLS = {
    "esg": "https://api.esg.primes-cloud.co.kr/api-docs/esg",
    "primes_production": "https://api.orcamaas.com/api-docs/production",
    "primes_sales": "https://api.orcamaas.com/api-docs/sales",
    "primes_purchase": "https://api.orcamaas.com/api-docs/purchase",
    "primes_inventory": "https://api.orcamaas.com/api-docs/inventory",
    "primes_machine": "https://api.orcamaas.com/api-docs/machine",
    "primes_mold": "https://api.orcamaas.com/api-docs/mold",
    "primes_ini": "https://api.orcamaas.com/api-docs/init"
}

class UnifiedMCPServer:
    def __init__(self):
        self.server = Server("unified-project-info-mcp")
        self.setup_handlers()
        
    def setup_handlers(self):
        """MCP 핸들러 설정"""
        
        @self.server.list_resources()
        async def list_resources() -> List[Resource]:
            """사용 가능한 리소스 목록"""
            return [
                # Primes 프로젝트
                Resource(
                    uri="primes://overview",
                    name="Primes 프로젝트 개요",
                    description="ERP 시스템 - Radix UI + Tailwind CSS",
                    mimeType="text/markdown"
                ),
                Resource(
                    uri="primes://patterns",
                    name="Primes 개발 패턴",
                    description="아키텍처, UI 컴포넌트, Hook 패턴",
                    mimeType="text/markdown"
                ),
                Resource(
                    uri="primes://templates",
                    name="Primes 템플릿 시스템",
                    description="SinglePage, MasterDetailPage, TabNavigation",
                    mimeType="text/markdown"
                ),
                Resource(
                    uri="primes://domains",
                    name="Primes 솔루션 도메인",
                    description="ini, sales, purchase, production, machine, mold, quality",
                    mimeType="text/markdown"
                ),
                Resource(
                    uri="primes://swagger",
                    name="Primes Swagger API",
                    description="실제 Swagger URL 및 API 정보",
                    mimeType="text/markdown"
                ),
                
                # ESG 프로젝트
                Resource(
                    uri="esg://overview",
                    name="ESG 프로젝트 개요",
                    description="지속가능성 관리 - Falcon UI + Bootstrap",
                    mimeType="text/markdown"
                ),
                Resource(
                    uri="esg://features",
                    name="ESG 특화 기능",
                    description="Dashboard, Chart Widgets, KPI Cards, Form Wizards",
                    mimeType="text/markdown"
                ),
                Resource(
                    uri="esg://frameworks",
                    name="ESG 프레임워크",
                    description="GRI, SASB, TCFD, CDP 준수",
                    mimeType="text/markdown"
                ),
                Resource(
                    uri="esg://swagger",
                    name="ESG Swagger API",
                    description="ESG API 스키마 및 엔드포인트",
                    mimeType="text/markdown"
                ),
                Resource(
                    uri="esg://swagger",
                    name="ESG Swagger API",
                    description="ESG API 스키마 및 엔드포인트",
                    mimeType="text/markdown"
                ),
                
                # AIPS 프로젝트
                Resource(
                    uri="aips://overview",
                    name="AIPS 프로젝트 개요",
                    description="AI 기반 생산성 시스템 - Radix UI + AI 모듈",
                    mimeType="text/markdown"
                ),
                Resource(
                    uri="aips://ai-features",
                    name="AIPS AI 기능",
                    description="AI 통합, 정보 처리, 생산성 향상",
                    mimeType="text/markdown"
                ),
                
                # SCM 프로젝트
                Resource(
                    uri="scm://overview",
                    name="SCM 프로젝트 개요",
                    description="공급망 관리 시스템 - Radix UI + Tailwind",
                    mimeType="text/markdown"
                ),
                
                # 공통 정보
                Resource(
                    uri="common://swagger",
                    name="Swagger 정보",
                    description="API 스키마 및 Swagger 관련 정보",
                    mimeType="text/markdown"
                ),
                Resource(
                    uri="common://packages",
                    name="공통 패키지",
                    description="공유 컴포넌트 및 유틸리티",
                    mimeType="text/markdown"
                ),
                Resource(
                    uri="common://comparison",
                    name="프로젝트 비교",
                    description="각 프로젝트의 기술 스택 및 특징 비교",
                    mimeType="text/markdown"
                )
            ]
        
        @self.server.read_resource()
        async def read_resource(uri: str) -> Optional[EmbeddedResource]:
            """리소스 내용 읽기"""
            
            # Primes 프로젝트
            if uri.startswith("primes://"):
                return self.get_primes_info(uri)
            
            # ESG 프로젝트
            elif uri.startswith("esg://"):
                return self.get_esg_info(uri)
            
            # AIPS 프로젝트
            elif uri.startswith("aips://"):
                return self.get_aips_info(uri)
            
            # SCM 프로젝트
            elif uri.startswith("scm://"):
                return self.get_scm_info(uri)
            
            # 공통 정보
            elif uri.startswith("common://"):
                return self.get_common_info(uri)
            
            return None
    
    def get_primes_info(self, uri: str) -> EmbeddedResource:
        """Primes 프로젝트 정보"""
        if uri == "primes://overview":
            content = """
# 🎯 Primes 프로젝트 개요

## 📋 **프로젝트 설명**
Primes는 현대적인 기업용 ERP 시스템으로, React 18 + TypeScript + Radix UI를 기반으로 구축된 고품질 웹 애플리케이션입니다.

## 🏗️ **기술 스택**
- **Frontend**: React 18.3.1 + TypeScript 5.7.2
- **UI Framework**: Radix UI + Tailwind CSS
- **State Management**: React Query (@tanstack/react-query)
- **Build Tool**: Vite 6.2.0
- **Package Manager**: pnpm

## 📊 **현재 상태**
- **완성도**: 🟢 98%
- **페이지 수**: 260개
- **Hook 수**: 422개
- **솔루션 도메인**: 7개 (ini, sales, purchase, production, machine, mold, quality)

## 🎯 **주요 특징**
- **Enhanced Template System**: SinglePage, MasterDetailPage, TabNavigation
- **Atomic Hooks**: 단일 책임 원칙의 훅 패턴
- **MCP 통합**: AI 기반 코드 생성
- **Swagger 동기화**: API 스키마 자동 동기화
- **GS 인증 준비**: 보안성, 신뢰성, 감사 추적 강화
            """
        elif uri == "primes://patterns":
            content = """
# 🏗️ Primes 개발 패턴

## 🏗️ **아키텍처 패턴**
- **레이어 구조**: Presentation → Business Logic → Service → API
- **도메인 분리**: 7개 솔루션 (ini, sales, purchase, production, machine, mold, quality)
- **모듈화**: 각 도메인별 독립적 구조

## 🎨 **UI 컴포넌트 패턴**
- **Radix UI + Tailwind CSS**: 접근성과 일관성
- **Enhanced Template System**:
  - SinglePage: Modal-based CRUD with DatatableComponent
  - MasterDetailPage: Navigation-based CRUD with relationships
  - TabNavigation: Tab-based navigation structure
  - CustomSelect: Field API integrated select components

## 🔧 **Hook 패턴**
- **Atomic Hooks**: 단일 책임 원칙
  - useCreateEntity() - 생성 전용
  - useUpdateEntity() - 수정 전용
  - useDeleteEntity() - 삭제 전용
  - useEntityListQuery() - 목록 조회 전용
  - useEntityByIdQuery() - 단일 조회 전용

## 📝 **코드 생성 패턴**
- **Swagger 기반**: API 스키마 자동 동기화
- **Template 기반**: 일관된 코드 구조
- **ValidationSchema**: Zod-based validation with business rules
            """
        elif uri == "primes://templates":
            content = """
# 📋 Primes 템플릿 시스템

## 🎯 **SinglePage 템플릿**
- **용도**: 단일 페이지 CRUD 작업
- **구조**: Modal-based CRUD with DatatableComponent
- **특징**: 
  - 검색, 필터링, 정렬 기능
  - Modal을 통한 생성/수정/삭제
  - 페이지네이션 지원

## 🔗 **MasterDetailPage 템플릿**
- **용도**: 마스터-디테일 관계 CRUD
- **구조**: Navigation-based CRUD with relationships
- **특징**:
  - 좌측: 마스터 리스트
  - 우측: 선택된 항목의 상세 정보
  - 관계형 데이터 처리

## 📑 **TabNavigation 템플릿**
- **용도**: 탭 기반 네비게이션
- **구조**: Tab-based navigation structure
- **특징**:
  - 여러 탭으로 정보 분류
  - 각 탭별 독립적인 CRUD
  - 상태 공유 및 동기화

## 🎨 **CustomSelect 템플릿**
- **용도**: Field API 연동 선택 컴포넌트
- **구조**: Field API integrated select components
- **특징**:
  - 동적 옵션 로딩
  - 검색 및 필터링
  - 다중 선택 지원
            """
        elif uri == "primes://domains":
            content = """
# 🌐 Primes 솔루션 도메인

## 🏢 **ini (기본 정보)**
- **거래처 관리**: Vendor, Customer
- **품목 관리**: Item, Category
- **코드 관리**: Code, CodeGroup
- **사용자 관리**: User, Role

## 💰 **sales (판매 관리)**
- **견적 관리**: Quote, QuoteItem
- **주문 관리**: Order, OrderItem
- **출하 관리**: Shipment, ShipmentItem
- **매출 관리**: Revenue, Invoice

## 🛒 **purchase (구매 관리)**
- **견적 요청**: RFQ, RFQItem
- **구매 주문**: PO, POItem
- **입고 관리**: Receipt, ReceiptItem
- **지급 관리**: Payment, PaymentItem

## 🏭 **production (생산 관리)**
- **생산 계획**: Plan, PlanItem
- **작업 지시**: WorkOrder, WorkOrderItem
- **생산 실적**: Performance, PerformanceItem
- **자재 소요**: Material, MaterialItem

## ⚙️ **machine (설비 관리)**
- **설비 정보**: Machine, MachineType
- **점검 관리**: Inspection, InspectionItem
- **수리 관리**: Repair, RepairItem
- **이력 관리**: History, HistoryItem

## 🎯 **mold (금형 관리)**
- **금형 정보**: Mold, MoldType
- **사용 이력**: Usage, UsageItem
- **보관 관리**: Storage, StorageItem
- **수명 관리**: Lifecycle, LifecycleItem

## ✅ **quality (품질 관리)**
- **검사 기준**: Standard, StandardItem
- **검사 결과**: Result, ResultItem
- **불량 관리**: Defect, DefectItem
- **개선 관리**: Improvement, ImprovementItem
            """
        elif uri == "primes://swagger":
            content = f"""
# 🔍 Primes Swagger API 정보

## 📊 **실제 Swagger URL들**

### **🏭 Production (생산 관리)**
- **URL**: {SWAGGER_URLS['primes_production']}
- **용도**: 생산 계획, 작업 지시, 생산 실적 관리
- **주요 API**: Plan, WorkOrder, Performance, Material

### **💰 Sales (판매 관리)**
- **URL**: {SWAGGER_URLS['primes_sales']}
- **용도**: 견적, 주문, 출하, 매출 관리
- **주요 API**: Quote, Order, Shipment, Revenue, Invoice

### **🛒 Purchase (구매 관리)**
- **URL**: {SWAGGER_URLS['primes_purchase']}
- **용도**: 견적 요청, 구매 주문, 입고, 지급 관리
- **주요 API**: RFQ, PO, Receipt, Payment

### **📦 Inventory (재고 관리)**
- **URL**: {SWAGGER_URLS['primes_inventory']}
- **용도**: 재고 수준, 입출고, 재고 이동 관리
- **주요 API**: Stock, Movement, Transfer, Adjustment

### **⚙️ Machine (설비 관리)**
- **URL**: {SWAGGER_URLS['primes_machine']}
- **용도**: 설비 정보, 점검, 수리, 이력 관리
- **주요 API**: Machine, Inspection, Repair, History

### **🎯 Mold (금형 관리)**
- **URL**: {SWAGGER_URLS['primes_mold']}
- **용도**: 금형 정보, 사용 이력, 보관, 수명 관리
- **주요 API**: Mold, Usage, Storage, Lifecycle

### **🏢 INI (기본 정보)**
- **URL**: {SWAGGER_URLS['primes_ini']}
- **용도**: 거래처, 품목, 코드, 사용자 관리
- **주요 API**: Vendor, Customer, Item, Category, Code, User

## 🚀 **사용법**

### **1. 환경변수 설정**
```bash
export SWAGGER_URL_PRODUCTION={SWAGGER_URLS['primes_production']}
export SWAGGER_URL_SALES={SWAGGER_URLS['primes_sales']}
export SWAGGER_URL_PURCHASE={SWAGGER_URLS['primes_purchase']}
export SWAGGER_URL_INVENTORY={SWAGGER_URLS['primes_inventory']}
export SWAGGER_URL_MACHINE={SWAGGER_URLS['primes_machine']}
export SWAGGER_URL_MOLD={SWAGGER_URLS['primes_mold']}
export SWAGGER_URL_INI={SWAGGER_URLS['primes_ini']}
```

### **2. 직접 API 호출**
```bash
# Production API 스키마 확인
curl {SWAGGER_URLS['primes_production']}

# Sales API 스키마 확인
curl {SWAGGER_URLS['primes_sales']}

# Purchase API 스키마 확인
curl {SWAGGER_URLS['primes_purchase']}
```

### **3. 코드 생성 시 활용**
- **Swagger 분석**: 각 도메인별 API 스키마 자동 분석
- **타입 생성**: API 응답 구조 기반 TypeScript 타입 자동 생성
- **서비스 생성**: API 엔드포인트 기반 서비스 레이어 자동 생성
- **검증 스키마**: API 요청/응답 기반 Zod 검증 스키마 자동 생성
            """
        else:
            content = "Primes 프로젝트 정보를 찾을 수 없습니다."
        
        return EmbeddedResource(
            contents=[TextContent(type="text/markdown", text=content)]
        )
    
    def get_esg_info(self, uri: str) -> EmbeddedResource:
        """ESG 프로젝트 정보"""
        if uri == "esg://overview":
            content = """
# 🌱 ESG 프로젝트 개요

## 📋 **프로젝트 설명**
ESG는 지속가능성 관리 시스템으로, 환경(Environmental), 사회(Social), 지배구조(Governance) 데이터를 통합 관리하는 대시보드 중심의 웹 애플리케이션입니다.

## 🏗️ **기술 스택**
- **Frontend**: React 18 + TypeScript
- **UI Framework**: Falcon UI + Bootstrap + Material-UI
- **Charts**: Recharts (ESG 데이터 시각화 최적화)
- **State Management**: React Query
- **Build Tool**: Vite

## 📊 **현재 상태**
- **완성도**: 🟡 85%
- **주요 기능**: 대시보드, 데이터 수집, 리포트 생성
- **특화 영역**: ESG 프레임워크 준수 (GRI, SASB, TCFD, CDP)

## 🎯 **주요 특징**
- **Dashboard Templates**: ESG 메트릭 대시보드 with KPI cards
- **Chart Widgets**: 시계열, 막대, 영역, 파이 차트
- **KPI Cards**: 탄소 배출량, 에너지 사용량, 물 사용량, 폐기물
- **Form Wizards**: 다단계 데이터 입력 with 검증
            """
        elif uri == "esg://features":
            content = """
# 🎯 ESG 특화 기능

## 📊 **Dashboard Templates**
- **DashboardPage**: ESG 메트릭 대시보드 with KPI cards
- **ReportPage**: ESG 리포트 빌더 (GRI, SASB, TCFD 템플릿)
- **CollectPage**: 데이터 수집 with 검증
- **GroupGridPage**: 그룹 네비게이션 + 데이터 그리드 레이아웃

## 📈 **Chart Widgets**
- **Line Charts**: 시계열 ESG 데이터 (배출량, 에너지 사용량)
- **Bar Charts**: 카테고리별 비교 (Scope 1/2/3 배출량)
- **Area Charts**: 누적 데이터 표시
- **Pie Charts**: 구성 비율 (에너지원별, 폐기물 유형별)

## 📋 **KPI Cards**
- **탄소 배출량**: tCO2e 단위, 목표 대비 진행률
- **에너지 사용량**: MWh 단위, 재생에너지 비율
- **물 사용량**: 톤 단위, 재활용률
- **폐기물**: 톤 단위, 재활용률 및 매립률

## 📝 **Form Wizards**
- **다단계 데이터 입력**: 기본 정보 → 환경 데이터 → 검토
- **프레임워크 준수**: GRI, SASB, TCFD 표준 자동 적용
- **데이터 품질 관리**: 정확도, 검증 상태 추적
            """
        elif uri == "esg://frameworks":
            content = """
# 📋 ESG 프레임워크

## 🌍 **GRI (Global Reporting Initiative)**
- **목적**: 지속가능성 보고 표준
- **범위**: 경제, 환경, 사회 영향
- **적용**: ESG 데이터 수집 및 보고 체계

## 📊 **SASB (Sustainability Accounting Standards Board)**
- **목적**: 재무적 중요성 ESG 이슈
- **범위**: 77개 산업별 표준
- **적용**: 투자자 의사결정 지원

## 🌡️ **TCFD (Task Force on Climate-related Financial Disclosures)**
- **목적**: 기후 관련 재무 정보 공개
- **범위**: 거버넌스, 전략, 리스크 관리, 지표 및 목표
- **적용**: 기후 리스크 평가 및 관리

## 📈 **CDP (Carbon Disclosure Project)**
- **목적**: 탄소 배출량 및 기후 변화 정보 공개
- **범위**: Scope 1, 2, 3 배출량
- **적용**: 탄소 관리 및 감축 목표 설정
            """
        elif uri == "esg://swagger":
            content = f"""
# 🔍 ESG Swagger API 정보

## 📊 **실제 Swagger URL**

### **🌱 ESG API**
- **URL**: {SWAGGER_URLS['esg']}
- **용도**: ESG 데이터 수집, 분석, 리포트 생성
- **주요 API**: CarbonEmission, EnergyUsage, WaterUsage, WasteManagement

## 🚀 **사용법**

### **1. 환경변수 설정**
```bash
export SWAGGER_URL_ESG={SWAGGER_URLS['esg']}
```

### **2. 직접 API 호출**
```bash
# ESG API 스키마 확인
curl {SWAGGER_URLS['esg']}
```

### **3. 코드 생성 시 활용**
- **Swagger 분석**: ESG API 스키마 자동 분석
- **타입 생성**: ESG 데이터 구조 기반 TypeScript 타입 자동 생성
- **서비스 생성**: ESG API 엔드포인트 기반 서비스 레이어 자동 생성
- **검증 스키마**: ESG 데이터 요청/응답 기반 Zod 검증 스키마 자동 생성

## 📋 **주요 ESG API 모듈**

### **🌡️ 배출량 관리 (Emission Management)**
- **EmissionFactor**: 배출계수 관리 (category, gasType, coefficientValue, unit)
- **EmissionFactorHead**: 배출계수 헤더 (title, applyYm, publishedBy)
- **DataType**: GHG Scope별 배출원 분류 (Scope 1/2/3, emissionSource, category, uom)
- **EmissionDashboard**: 월별/스코프별 배출량 대시보드

### **📊 데이터 수집 (Data Collection)**
- **Record**: 실제 사용량/배출량 데이터 (accountMonth, quantity, totalCost)
- **RecordMatrix**: 월별 매트릭스 형태 데이터 입력 (12개월 데이터)
- **Account**: 계정 관리 (name, supplier, accountStyle, meter, company, charger)
- **Meter**: 계량기 관리 (name, serialNo, servicePoint, component)

### **🏢 조직 관리 (Organization Management)**
- **Company**: 회사 정보 (name, license, companyType, businessType, address)
- **Group**: 그룹 구조 (groupName, type, parentId, reportPercent, isOpenToPublic)
- **Location**: 위치 정보 (country, state, city, emissionFactorHead)
- **Charger**: 담당자 관리 (name, department, grade, phone, address)

### **📈 대시보드 & 분석 (Dashboard & Analytics)**
- **UsageDashboard**: 월별/스코프별 사용량 대시보드
- **YearlyEmissionTrend**: 연도별 배출량 추이 (actualEmission, targetEmission, achievementRate)
- **GroupEmissionTree**: 그룹별 배출량 트리 구조
- **CompanyEmission/Usage**: 회사별 월별 배출량/사용량 분석

### **📝 리포트 & 설문 (Report & Survey)**
- **Report**: ESG 리포트 생성 (title, titleImage, description)
- **ReportTab**: 리포트 탭 구조 (tabOrder, name)
- **Survey**: ESG 설문조사 관리
- **Question/Answer**: 질문/답변 시스템 (reportTypeId, name)

### **🔧 시스템 관리 (System Management)**
- **AccountStyle**: 계정 스타일 (dataType, caption, categoryInScope)
- **CustomFormula**: 사용자 정의 공식 (operator, operand)
- **Code/CodeGroup**: 코드 관리 시스템
- **AuditLog**: 감사 로그 (userId, action, changedData, ipAddress)
            """
        else:
            content = "ESG 프로젝트 정보를 찾을 수 없습니다."
        
        return EmbeddedResource(
            contents=[TextContent(type="text/markdown", text=content)]
        )
    
    def get_aips_info(self, uri: str) -> EmbeddedResource:
        """AIPS 프로젝트 정보"""
        if uri == "aips://overview":
            content = """
# 🤖 AIPS 프로젝트 개요

## 📋 **프로젝트 설명**
AIPS(AI-Powered Information Processing System)는 인공지능을 활용하여 정보 처리 및 생산성 향상을 목표로 하는 현대적인 웹 애플리케이션입니다.

## 🏗️ **기술 스택**
- **Frontend**: React 18.3.1 + TypeScript 5.7.2
- **UI Framework**: Radix UI + Tailwind CSS
- **AI Integration**: AI 모듈 및 머신러닝 알고리즘
- **Charts**: ECharts (데이터 시각화 최적화)
- **Editor**: Flora Editor (리치 텍스트 편집)
- **Build Tool**: Vite 6.2.0
- **Package Manager**: pnpm

## 📊 **현재 상태**
- **완성도**: 🟡 70%
- **주요 기능**: AI 분석, 데이터 처리, 생산성 도구
- **특화 영역**: AI 기반 정보 처리 및 분석

## 🎯 **주요 특징**
- **AI Integration**: 머신러닝 모델 통합
- **Information Processing**: 대용량 데이터 처리
- **Productivity Tools**: 작업 자동화 및 최적화
- **Advanced Analytics**: 예측 분석 및 인사이트
            """
        elif uri == "aips://ai-features":
            content = """
# 🤖 AIPS AI 기능

## 🧠 **AI 통합**
- **머신러닝 모델**: 예측 분석 및 패턴 인식
- **자연어 처리**: 텍스트 분석 및 요약
- **이미지 인식**: 컴퓨터 비전 및 이미지 처리
- **음성 인식**: 음성-텍스트 변환

## 📊 **정보 처리**
- **대용량 데이터**: 효율적인 데이터 처리 및 분석
- **실시간 처리**: 스트리밍 데이터 분석
- **데이터 품질**: 자동 데이터 검증 및 정제
- **메타데이터 관리**: 데이터 카탈로그 및 거버넌스

## 🚀 **생산성 향상**
- **작업 자동화**: 반복 작업 자동화
- **스마트 추천**: AI 기반 추천 시스템
- **예측 분석**: 트렌드 예측 및 리스크 분석
- **인사이트 생성**: 데이터 기반 의사결정 지원

## 🛠️ **개발 도구**
- **AI 모듈**: 재사용 가능한 AI 컴포넌트
- **API 통합**: 외부 AI 서비스 연동
- **모델 관리**: AI 모델 버전 관리 및 배포
- **성능 모니터링**: AI 모델 성능 추적
            """
        else:
            content = "AIPS 프로젝트 정보를 찾을 수 없습니다."
        
        return EmbeddedResource(
            contents=[TextContent(type="text/markdown", text=content)]
        )
    
    def get_scm_info(self, uri: str) -> EmbeddedResource:
        """SCM 프로젝트 정보"""
        if uri == "scm://overview":
            content = """
# 📦 SCM 프로젝트 개요

## 📋 **프로젝트 설명**
SCM은 공급망 관리 시스템으로, 공급업체부터 고객까지의 전체 공급망을 효율적으로 관리하고 최적화하는 웹 애플리케이션입니다.

## 🏗️ **기술 스택**
- **Frontend**: React 18.3.1 + TypeScript 5.7.2
- **UI Framework**: Radix UI + Tailwind CSS
- **State Management**: React Query + React Table
- **Charts**: ECharts (공급망 시각화)
- **Build Tool**: Vite 6.2.0
- **Package Manager**: pnpm

## 📊 **현재 상태**
- **완성도**: 🟠 40%
- **개발 단계**: 초기 개발 단계
- **주요 기능**: 공급업체 관리, 재고 관리, 물류 관리
- **특화 영역**: 공급망 최적화 및 리스크 관리

## 🎯 **주요 특징**
- **공급업체 관리**: 공급업체 정보 및 성과 관리
- **재고 관리**: 실시간 재고 추적 및 최적화
- **물류 관리**: 운송, 배송, 창고 관리
- **공급망 시각화**: 네트워크 맵 및 분석 도구

## 🔗 **핵심 모듈**
- **Supplier Management**: 공급업체 등록, 평가, 성과 관리
- **Inventory Management**: 재고 수준, 주문점, 안전재고
- **Logistics Management**: 운송 계획, 배송 추적, 창고 관리
- **Demand Planning**: 수요 예측, 계획 수립, 실행 관리
- **Risk Management**: 공급망 리스크 식별 및 대응
            """
        else:
            content = "SCM 프로젝트 정보를 찾을 수 없습니다."
        
        return EmbeddedResource(
            contents=[TextContent(type="text/markdown", text=content)]
        )
    
    def get_common_info(self, uri: str) -> EmbeddedResource:
        """공통 정보"""
        if uri == "common://swagger":
            content = f"""
# 🔍 Swagger 정보

## 📊 **현재 상태**
- **동적 발견**: 환경변수 기반 Swagger URL 자동 탐지
- **프로젝트별 분리**: SWAGGER_[PROJECT]_[MODULE] 패턴
- **자동 동기화**: API 스키마 변경사항 자동 반영

## 🚀 **사용법**

### **1. 환경변수 설정**
```bash
# ESG 프로젝트
export SWAGGER_URL_ESG={SWAGGER_URLS['esg']}

# Primes 프로젝트
export SWAGGER_URL_PRODUCTION={SWAGGER_URLS['primes_production']}
export SWAGGER_URL_SALES={SWAGGER_URLS['primes_sales']}
export SWAGGER_URL_PURCHASE={SWAGGER_URLS['primes_purchase']}
export SWAGGER_URL_INVENTORY={SWAGGER_URLS['primes_inventory']}
export SWAGGER_URL_MACHINE={SWAGGER_URLS['primes_machine']}
export SWAGGER_URL_MOLD={SWAGGER_URLS['primes_mold']}
export SWAGGER_URL_INI={SWAGGER_URLS['primes_ini']}
```

### **2. 직접 API 호출**
```bash
# ESG API 스키마 확인
curl {SWAGGER_URLS['esg']}

# Primes Production API 스키마 확인
curl {SWAGGER_URLS['primes_production']}

# Primes Sales API 스키마 확인
curl {SWAGGER_URLS['primes_sales']}
```

### **3. 로컬 파일 읽기**
- swagger_data/ 디렉토리의 분석 결과 활용

## 📋 **프로젝트별 지원**

### **🌱 ESG 프로젝트**
- **URL**: {SWAGGER_URLS['esg']}
- **모듈**: ESG 데이터 수집, 분석, 리포트
- **프레임워크**: GRI, SASB, TCFD, CDP 준수

### **🎯 Primes 프로젝트**
- **Production**: {SWAGGER_URLS['primes_production']} - 생산 관리
- **Sales**: {SWAGGER_URLS['primes_sales']} - 판매 관리
- **Purchase**: {SWAGGER_URLS['primes_purchase']} - 구매 관리
- **Inventory**: {SWAGGER_URLS['primes_inventory']} - 재고 관리
- **Machine**: {SWAGGER_URLS['primes_machine']} - 설비 관리
- **Mold**: {SWAGGER_URLS['primes_mold']} - 금형 관리
- **INI**: {SWAGGER_URLS['primes_ini']} - 기본 정보

### **🤖 AIPS 프로젝트**
- **AI 모듈**: 머신러닝, 자연어 처리, 컴퓨터 비전
- **분석 도구**: 예측 분석, 패턴 인식, 인사이트 생성

### **📦 SCM 프로젝트**
- **공급망 모듈**: 공급업체, 재고, 물류, 수요 계획, 리스크 관리
            """
        elif uri == "common://packages":
            content = """
# 📦 공통 패키지

## 🎨 **UI 컴포넌트**
- **@repo/radix-ui**: Radix UI 기반 컴포넌트 (Primes, AIPS, SCM)
- **@repo/falcon-ui**: Bootstrap 기반 컴포넌트 (ESG)
- **@repo/moornmo-ui**: Material-UI 기반 컴포넌트
- **@repo/ui**: 공통 UI 컴포넌트

## 📊 **차트 및 시각화**
- **@repo/echart**: ECharts 기반 차트 컴포넌트
- **@repo/gantt-charts**: 간트 차트 컴포넌트
- **@repo/react-flow**: 플로우 차트 컴포넌트

## 🛠️ **도구 및 유틸리티**
- **@repo/utils**: 공통 유틸리티 함수
- **@repo/typescript-config**: TypeScript 설정
- **@repo/eslint-config**: ESLint 설정
- **@repo/i18n**: 다국어 지원

## 📝 **편집기 및 입력**
- **@repo/editor-js**: 블록 기반 에디터
- **@repo/flora-editor**: 리치 텍스트 에디터
- **@repo/swiper**: 슬라이더 및 캐러셀
            """
        elif uri == "common://comparison":
            content = """
# 🔄 프로젝트별 특징 비교

## 🎯 **Primes (ERP 시스템)**
- **완성도**: 🟢 98%
- **UI**: Radix UI + Tailwind CSS
- **특징**: 7개 솔루션 도메인, 260개 페이지, 422개 Hook
- **용도**: 기업 전반의 업무 프로세스 관리
- **Swagger**: 7개 도메인별 API (orcamaas.com)

## 🌱 **ESG (지속가능성 관리)**
- **완성도**: 🟡 85%
- **UI**: Falcon UI + Bootstrap + Material-UI
- **특징**: 대시보드 중심, 차트 위젯, KPI 카드
- **용도**: ESG 데이터 수집, 분석, 리포트
- **Swagger**: ESG 통합 API (esg.primes-cloud.co.kr)

## 🤖 **AIPS (AI 생산성 시스템)**
- **완성도**: 🟡 70%
- **UI**: Radix UI + Tailwind CSS
- **특징**: AI 통합, 정보 처리, 생산성 도구
- **용도**: AI 기반 분석 및 생산성 향상
- **Swagger**: AI 모듈별 API (개발 중)

## 📦 **SCM (공급망 관리)**
- **완성도**: 🟠 40%
- **UI**: Radix UI + Tailwind CSS
- **특징**: 공급업체 관리, 재고 관리, 물류 관리
- **용도**: 공급망 최적화 및 관리
- **Swagger**: 공급망 모듈별 API (개발 중)

## 🔗 **공통점**
- **Frontend**: React 18 + TypeScript
- **State Management**: React Query
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Monorepo**: Turborepo 기반 구조
            """
        else:
            content = "공통 정보를 찾을 수 없습니다."
        
        return EmbeddedResource(
            contents=[TextContent(type="text/markdown", text=content)]
        )

async def main():
    """메인 함수"""
    server = UnifiedMCPServer()
    
    async with stdio_server() as (read_stream, write_stream):
        await server.server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="unified-project-info-mcp",
                server_version="1.0.0",
                capabilities=server.server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )

if __name__ == "__main__":
    asyncio.run(main())
