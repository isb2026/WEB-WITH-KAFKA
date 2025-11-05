import { getMeterFieldValues } from '@esg/services';
import { useQuery } from '@tanstack/react-query';

// Placeholder: ESG Swagger에 단건 조회 스펙이 없으면 필드 API 또는 상세 API로 대체
export const useMeterDetailQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['meter', id],
		queryFn: async () => {
			// TODO: 단건 상세 엔드포인트 제공 시 교체
			// return getMeterDetail(id)
			return [];
		},
		enabled: enabled && id > 0,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
