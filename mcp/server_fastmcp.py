#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
통합 프로젝트 정보 제공용 MCP 서버 (FastMCP 패턴)
- Primes, ESG, AIPS, SCM 모든 프로젝트 정보 제공
- 개발 패턴, 템플릿, Swagger 정보
- 실제 Swagger URL 기반 API 정보 제공
"""

import os
import logging
from typing import Dict
from mcp.server.fastmcp import FastMCP

# 로깅 설정
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger("unified-project-info-mcp")

# MCP 서버 인스턴스
mcp = FastMCP("unified-project-info-mcp")

# 실제 Swagger URL들 (환경변수로 오버라이드 가능)
SWAGGER_URLS: Dict[str, str] = {
    "esg": os.getenv("SWAGGER_ESG", "https://api.esg.primes-cloud.co.kr/api-docs/esg"),
    "primes_production": os.getenv("SWAGGER_PRIMES_PROD", "https://api.orcamaas.com/api-docs/production"),
    "primes_sales": os.getenv("SWAGGER_PRIMES_SALES", "https://api.orcamaas.com/api-docs/sales"),
    "primes_purchase": os.getenv("SWAGGER_PRIMES_PURCHASE", "https://api.orcamaas.com/api-docs/purchase"),
    "primes_inventory": os.getenv("SWAGGER_PRIMES_INVENTORY", "https://api.orcamaas.com/api-docs/inventory"),
    "primes_machine": os.getenv("SWAGGER_PRIMES_MACHINE", "https://api.orcamaas.com/api-docs/machine"),
    "primes_mold": os.getenv("SWAGGER_PRIMES_MOLD", "https://api.orcamaas.com/api-docs/mold"),
    "primes_ini": os.getenv("SWAGGER_PRIMES_INI", "https://api.orcamaas.com/api-docs/init"),
}

# ===== 공통 유틸 =====
@mcp.tool()
def ping() -> str:
    """서버 헬스 체크 문자열 반환"""
    logger.info("ping called")
    return "pong"

# ===== Primes 프로젝트 툴 =====

@mcp.tool()
def get_primes_overview() -> str:
    """Primes 프로젝트 개요(마크다운)"""
    return """
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

@mcp.tool()
def get_primes_patterns() -> str:
    """Primes 개발 패턴(마크다운)"""
    return """
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

@mcp.tool()
def get_primes_swagger() -> str:
    """Primes Swagger API 정보(마크다운)"""
    return f"""
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
"""

# ===== ESG 프로젝트 툴 =====

@mcp.tool()
def get_esg_overview() -> str:
    """ESG 프로젝트 개요(마크다운)"""
    return """
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

@mcp.tool()
def get_esg_swagger() -> str:
    """ESG Swagger API 정보(마크다운)"""
    return f"""
# 🔍 ESG Swagger API 정보

## 📊 **실제 Swagger URL**

### **🌱 ESG API**
- **URL**: {SWAGGER_URLS['esg']}
- **용도**: ESG 데이터 수집, 분석, 리포트 생성
- **주요 API**: CarbonEmission, EnergyUsage, WaterUsage, WasteManagement

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
"""

# ===== AIPS 프로젝트 툴 =====

@mcp.tool()
def get_aips_overview() -> str:
    """AIPS 프로젝트 개요(마크다운)"""
    return """
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

# ===== SCM 프로젝트 툴 =====

@mcp.tool()
def get_scm_overview() -> str:
    """SCM 프로젝트 개요(마크다운)"""
    return """
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
"""

# ===== 공통 정보 툴 =====

@mcp.tool()
def get_project_comparison() -> str:
    """프로젝트 비교 정보(마크다운)"""
    return """
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

@mcp.tool()
def get_swagger_urls() -> Dict[str, str]:
    """모든 Swagger URL 딕셔너리 반환"""
    return SWAGGER_URLS

# ===== 메인 실행 =====
if __name__ == "__main__":
    # 기본: stdio 전송으로 실행
    # HTTP 전송이 필요하면 FastAPI에 mcp.streamable_http_app() 마운트 방식을 사용하세요.
    # (예) app.mount("/", mcp.streamable_http_app())
    logger.info("Starting MCP server (stdio)")
    mcp.run(transport="stdio")
