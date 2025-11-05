import { useMemo } from 'react';
import { EmissionRequestParams, EmissionScope } from '../../types/emissions';
import { useEmissionsByScope } from './useEmissionsByScope';

// 통합 배출량 데이터 Hook
export const useEmissions = (params: EmissionRequestParams | null) => {
	// params가 null이면 기본값 반환
	if (!params) {
		return {
			data: null,
			isLoading: false,
			isError: false,
			error: null,
			isGroupScope: false,
			isCompanyScope: false,
			isWorkplaceScope: false,
			scopeLabel: '선택 안됨',
			scopeIcon: '❓',
			hasValidSelection: false,
			chartData: null,
			filterOptions: {
				scope: 'group' as EmissionScope,
				timeRange: 'monthly' as const,
				emissionType: 'all' as const,
				energyType: 'all' as const,
				availableScopes: [
					'group',
					'company',
					'workplace',
				] as EmissionScope[],
			},
			actions: {
				switchToGroup: () => ({
					scope: 'group' as const,
					groupId: undefined,
				}),
				switchToCompany: (id: string) => ({
					scope: 'company' as const,
					companyId: id,
				}),
				switchToWorkplace: (id: string) => ({
					scope: 'workplace' as const,
					workplaceId: id,
				}),
			},
		};
	}

	const { scope, groupId, companyId, workplaceId } = params;

	// 스코프별 데이터 조회
	const emissionsQuery = useEmissionsByScope(params);

	// 스코프별 유틸리티 함수들
	const scopeUtils = useMemo(
		() => ({
			isGroupScope: scope === 'group',
			isCompanyScope: scope === 'company',
			isWorkplaceScope: scope === 'workplace',
			scopeLabel: getScopeLabel(scope),
			scopeIcon: getScopeIcon(scope),
			hasValidSelection: hasValidSelection(params),
		}),
		[scope, params]
	);

	// 스코프별 차트 데이터 변환
	const chartData = useMemo(() => {
		if (!emissionsQuery.data?.data) return null;

		const { monthlyEmissions, scopeEmissions, yearlyTrend } =
			emissionsQuery.data.data;

		return {
			monthlyChart: monthlyEmissions
				? transformMonthlyData(monthlyEmissions)
				: null,
			scopeChart: scopeEmissions
				? transformScopeData(scopeEmissions)
				: null,
			trendChart: yearlyTrend ? transformTrendData(yearlyTrend) : null,
		};
	}, [emissionsQuery.data]);

	// 스코프별 필터 옵션
	const filterOptions = useMemo(
		() => ({
			scope,
			timeRange: 'monthly' as const,
			emissionType: 'all' as const,
			energyType: 'all' as const,
			availableScopes: getAvailableScopes(params),
		}),
		[scope, params]
	);

	return {
		// 기본 쿼리 데이터
		...emissionsQuery,

		// 스코프별 유틸리티
		...scopeUtils,

		// 차트 데이터
		chartData,

		// 필터 옵션
		filterOptions,

		// 스코프별 액션
		actions: {
			switchToGroup: () => ({ scope: 'group' as const, groupId }),
			switchToCompany: (id: string) => ({
				scope: 'company' as const,
				companyId: id,
			}),
			switchToWorkplace: (id: string) => ({
				scope: 'workplace' as const,
				workplaceId: id,
			}),
		},
	};
};

// 스코프 라벨 반환
const getScopeLabel = (scope: EmissionScope): string => {
	switch (scope) {
		case 'group':
			return '그룹';
		case 'company':
			return '회사';
		case 'workplace':
			return '사업장';
		default:
			return '알 수 없음';
	}
};

// 스코프 아이콘 반환
const getScopeIcon = (scope: EmissionScope): string => {
	switch (scope) {
		case 'group':
			return '🏢';
		case 'company':
			return '🏭';
		case 'workplace':
			return '🏗️';
		default:
			return '❓';
	}
};

// 유효한 선택 여부 확인
const hasValidSelection = (params: EmissionRequestParams): boolean => {
	const { scope, groupId, companyId, workplaceId } = params;

	switch (scope) {
		case 'group':
			return true;
		case 'company':
			return !!companyId;
		case 'workplace':
			return !!workplaceId;
		default:
			return false;
	}
};

// 사용 가능한 스코프 반환
const getAvailableScopes = (params: EmissionRequestParams): EmissionScope[] => {
	const { groupId, companyId, workplaceId } = params;
	const available: EmissionScope[] = ['group'];

	if (groupId) available.push('company');
	if (companyId) available.push('workplace');

	return available;
};

// 월별 데이터 변환
const transformMonthlyData = (monthlyEmissions: Record<string, number>) => {
	if (!monthlyEmissions) return [];
	return Object.entries(monthlyEmissions).map(([month, emission]) => ({
		month: parseInt(month),
		emission,
		label: `${month}월`,
	}));
};

// Scope별 데이터 변환
const transformScopeData = (scopeEmissions: Record<string, any>) => {
	if (!scopeEmissions) return [];
	return Object.entries(scopeEmissions).map(([scope, data]) => ({
		scope: `Scope ${scope}`,
		rate: data.rate,
		emission: data.totalEmission,
		color: getScopeColor(scope),
	}));
};

// 추이 데이터 변환
const transformTrendData = (yearlyTrend: any) => {
	if (!yearlyTrend?.years) return [];

	return yearlyTrend.years.map((year: string) => ({
		year,
		actual: yearlyTrend.actual[year] || 0,
		target: yearlyTrend.target[year] || 0,
	}));
};

// Scope별 색상 반환
const getScopeColor = (scope: string): string => {
	switch (scope) {
		case '1':
			return '#FF6B6B';
		case '2':
			return '#4ECDC4';
		case '3':
			return '#45B7D1';
		default:
			return '#96CEB4';
	}
};
