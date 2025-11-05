// ESG 배출량 분석 타입 정의
export type EmissionScope = 'group' | 'company' | 'workplace';

export interface EmissionRequestParams {
	scope: EmissionScope;
	groupId?: string;
	companyId?: string;
	workplaceId?: string;
	year?: number;
	month?: string;
}

// 배출량 데이터 응답 타입 (실제 API 응답 구조에 맞춤)
export interface EmissionResponse {
	status: string;
	data: {
		// 기본 배출량 정보
		totalEmissions: number;
		targetEmissions?: number;

		// 월별 배출량 (선택적)
		monthlyEmissions?: Record<string, number>;

		// Scope별 배출량 (선택적)
		scopeEmissions?: Record<string, EmissionScopeData>;

		// 연도별 추이 (선택적)
		yearlyTrend?: YearlyTrendData;

		// 추가 메타데이터
		unit?: string;
		year?: number;
		lastUpdated?: string;

		// 실제 API에서 반환될 수 있는 다른 필드들
		[key: string]: any;
	};
}

// 공통 API 응답 타입 (기존 ESG 프로젝트와 일치)
export interface CommonResponse<T = any> {
	status: string;
	data: T;
	message?: string;
	resultCode?: number;
	errorMessage?: string;
	[key: string]: any;
}

// 사용량 데이터 응답 타입
export interface UsageResponse {
	status: string;
	data: {
		monthlyUsage: Record<string, number>;
		energyTypes: Record<string, EnergyTypeData>;
		totalUsage: number;
		unit: string;
	};
}

// 배출량 트리 구조 응답 타입 (그룹 전용)
export interface EmissionsTreeResponse {
	status: string;
	data: {
		groupStructure: GroupStructureNode[];
		totalEmissions: number;
		comparisonData: ComparisonData[];
	};
}

// 그룹 구조 노드
export interface GroupStructureNode {
	id: string;
	name: string;
	type: 'group' | 'company' | 'workplace';
	emissions: number;
	children?: GroupStructureNode[];
}

// 비교 데이터
export interface ComparisonData {
	id: string;
	name: string;
	emissions: number;
	percentage: number;
	trend: 'up' | 'down' | 'stable';
}

// 연도별 추이 응답 타입 (사업자 전용)
export interface YearlyTrendResponse {
	status: string;
	data: {
		trends: YearlyTrendData;
		forecast: ForecastData;
		targets: TargetData;
	};
}

// Scope별 배출량 데이터
export interface EmissionScopeData {
	rate: number;
	emissionSources: EmissionSource[];
	totalEmission: number;
}

// 배출원 데이터
export interface EmissionSource {
	id: string;
	name: string;
	emission: number;
	unit: string;
	category: string;
}

// 연도별 추이 데이터
export interface YearlyTrendData {
	actual: Record<string, number>;
	target: Record<string, number>;
	years: string[];
}

// 에너지 타입별 데이터
export interface EnergyTypeData {
	usage: number;
	percentage: number;
	unit: string;
	cost?: number;
}

// 예측 데이터
export interface ForecastData {
	nextYear: number;
	predictedEmissions: number;
	confidence: number;
	factors: string[];
}

// 목표 데이터
export interface TargetData {
	year: number;
	targetEmissions: number;
	reductionTarget: number;
	achievementRate: number;
}

// 에너지 사용량 데이터
export interface EnergyUsageData {
	electricity: number;
	gas: number;
	fuel: number;
	other: number;
	total: number;
}

// 대시보드 필터 옵션
export interface DashboardFilterOptions {
	scope: EmissionScope;
	timeRange: 'monthly' | 'quarterly' | 'yearly';
	emissionType: 'all' | 'scope1' | 'scope2' | 'scope3';
	energyType: 'all' | 'electricity' | 'gas' | 'fuel';
}

// API 응답 공통 타입
export interface CommonResponse<T> {
	status: string;
	message?: string;
	data: T;
	timestamp: string;
}
