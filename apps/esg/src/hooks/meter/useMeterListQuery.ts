import { getAllMeters } from '@esg/services';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { GetAllMeterListPayload } from '@esg/types/meter';

export const useMeterListQuery = (params: GetAllMeterListPayload) => {
	return useQuery({
		queryKey: ['meter', 'list', params],
		queryFn: () => getAllMeters(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
