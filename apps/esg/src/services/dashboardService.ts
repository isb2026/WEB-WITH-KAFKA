import { FetchApiGet } from '@esg/utils/request';

// Group Dashboard APIs
export const getGroupUsageDashboard = async (
	groupId: number,
	year?: number
) => {
	let url = `/group/${groupId}/dashboard/usage`;
	if (year) {
		url += `?year=${year}`;
	}
	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		throw new Error('그룹 사용량 대시보드 조회 실패');
	}
	return res.data;
};

export const getGroupEmissionDashboard = async (
	groupId: number,
	year?: number
) => {
	let url = `/group/${groupId}/dashboard/emissions`;
	if (year) {
		url += `?year=${year}`;
	}
	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		throw new Error('그룹 배출량 대시보드 조회 실패');
	}
	return res.data;
};

export const getGroupYearlyEmissionTrend = async (
	groupId: number,
	year?: number
) => {
	let url = `/group/${groupId}/dashboard/emissions/yearly-trend`;
	if (year) {
		url += `?year=${year}`;
	}
	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		throw new Error('그룹 연도별 배출량 추이 조회 실패');
	}
	return res.data;
};

export const getGroupEmissionTree = async (groupId: number, year?: number) => {
	let url = `/group/${groupId}/dashboard/emissions/tree`;
	if (year) {
		url += `?year=${year}`;
	}
	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		throw new Error('그룹 트리 구조 배출량 대시보드 조회 실패');
	}
	return res.data;
};

// Company Dashboard APIs
export const getCompanyEmissionDashboard = async (
	companyId: number,
	year?: number
) => {
	let url = `/dashboard/company/${companyId}/emissions`;
	if (year) {
		url += `?year=${year}`;
	}
	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		throw new Error('회사별 배출량 대시보드 조회 실패');
	}
	return res.data;
};

export const getCompanyYearlyEmissionTrend = async (
	companyId: number,
	year?: number
) => {
	let url = `/dashboard/company/${companyId}/emissions/yearly-trend`;
	if (year) {
		url += `?year=${year}`;
	}
	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		throw new Error('회사별 연도별 배출량 추이 조회 실패');
	}
	return res.data;
};

// Company Usage Dashboard API 추가
export const getCompanyUsageDashboard = async (
	companyId: number,
	year?: number
) => {
	let url = `/dashboard/company/${companyId}/usage`;
	if (year) {
		url += `?year=${year}`;
	}
	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		throw new Error('회사별 사용량 대시보드 조회 실패');
	}
	return res.data;
};

export const getCompanyAccountEmissions = async (
	companyId: number,
	accountMonth: string
) => {
	const res = await FetchApiGet(
		`/dashboard/company/${companyId}/accounts/emissions?accountMonth=${accountMonth}`
	);
	if (res.status !== 'success') {
		throw new Error('회사별 Account별 배출량 조회 실패');
	}
	return res.data;
};

// 그룹간 비교 Dashboard API 추가
export const getGroupComparisonDashboard = async (year?: number) => {
	let url = '/dashboard/groups/emissions/yearly-trend';
	if (year) {
		url += `?year=${year}`;
	}
	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		throw new Error('그룹간 비교 대시보드 조회 실패');
	}
	return res.data;
};

// Account Dashboard APIs
export const getAccountUsageDashboard = async (accountId: number) => {
	const res = await FetchApiGet(`/dashboard/account/${accountId}/usage`);
	if (res.status !== 'success') {
		throw new Error('Account별 사용량 대시보드 조회 실패');
	}
	return res.data;
};

// 통합 Dashboard API 헬퍼 함수들
export const getEmissionsByScope = async (
	scope: 'group' | 'company' | 'workplace',
	id: number,
	year?: number
): Promise<any> => {
	switch (scope) {
		case 'group':
			return await getGroupEmissionDashboard(id, year);
		case 'company':
		case 'workplace': // WORKPLACE도 COMPANY API 사용
			return await getCompanyEmissionDashboard(id, year);
		default:
			throw new Error(`지원하지 않는 스코프입니다: ${scope}`);
	}
};

export const getUsageByScope = async (
	scope: 'group' | 'company' | 'workplace',
	id: number,
	year?: number
) => {
	switch (scope) {
		case 'group':
			return await getGroupUsageDashboard(id, year);
		case 'company':
		case 'workplace': // WORKPLACE도 COMPANY API 사용
			return await getCompanyUsageDashboard(id, year);
		default:
			throw new Error(`지원하지 않는 스코프입니다: ${scope}`);
	}
};

export const getYearlyTrendByScope = async (
	scope: 'group' | 'company' | 'workplace',
	id: number,
	year?: number
) => {
	switch (scope) {
		case 'group':
			return await getGroupYearlyEmissionTrend(id, year);
		case 'company':
		case 'workplace': // WORKPLACE도 COMPANY API 사용
			return await getCompanyYearlyEmissionTrend(id, year);
		default:
			throw new Error(`지원하지 않는 스코프입니다: ${scope}`);
	}
};
