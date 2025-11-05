import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { EmissionRequestParams, EmissionResponse } from '../../types/emissions';
import { getEmissions } from '../../services/emissionsService';

// 스코프별 배출량 데이터 조회 Hook
export const useEmissionsByScope = (
	params: EmissionRequestParams | null,
	options?: UseQueryOptions<any, Error>
) => {
	// params가 null이면 기본값 반환
	if (!params) {
		return {
			data: undefined,
			isLoading: false,
			isError: false,
			error: null,
			isFetching: false,
			isSuccess: false,
			isPending: false,
			status: 'idle',
			fetchStatus: 'idle',
			refetch: () => Promise.resolve(),
		};
	}

	const { scope, groupId, companyId, workplaceId, year, month } = params;

	// 스코프별 유효성 검증
	const isValidParams = () => {
		switch (scope) {
			case 'group':
				return true; // 그룹은 선택사항
			case 'company':
				return !!companyId;
			case 'workplace':
				return !!workplaceId;
			default:
				return false;
		}
	};

	// 쿼리 키 생성
	const queryKey = [
		'emissions',
		scope,
		groupId,
		companyId,
		workplaceId,
		year,
		month,
	];

	return useQuery({
		queryKey,
		queryFn: () => getEmissions(params),
		enabled: isValidParams(),
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 10 * 60 * 1000, // 10분
		...options,
	});
};
