import { useQuery } from '@tanstack/react-query';
import { getAccountsByFilter } from '@esg/services';

interface AccountByCompanyParams {
	companyId: string | number;
	enabled?: boolean;
}

export const useAccountByCompanyQuery = ({
	companyId,
	enabled = true,
}: AccountByCompanyParams) => {
	// 기존 getAccountsByFilter 서비스를 활용하여 회사별 관리항목 조회
	return useQuery({
		queryKey: ['accounts', 'by-company', companyId],
		queryFn: () =>
			getAccountsByFilter({
				page: 0,
				size: 1000, // 충분히 큰 사이즈로 모든 관리항목 조회
				searchRequest: {
					companyId: Number(companyId),
					isUse: true, // 사용 중인 관리항목만 조회
				},
			}),
		enabled: enabled && !!companyId,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
		gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션 방지
		retry: 2,
		retryDelay: 1000,
	});
};
