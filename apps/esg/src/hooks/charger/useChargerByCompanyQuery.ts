import { useQuery } from '@tanstack/react-query';
import { getChargersByCompanyId } from '@esg/services/chargerService';

export const useChargerByCompanyQuery = (
	companyId?: string | number,
	enabled = true
) => {
	return useQuery({
		queryKey: ['chargers', 'by-company', companyId],
		queryFn: () => getChargersByCompanyId(String(companyId)),
		enabled: enabled && !!companyId,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
		gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션 방지
		retry: 2,
		retryDelay: 1000,
	});
};
