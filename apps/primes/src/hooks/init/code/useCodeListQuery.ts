import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAllCodeList } from '@primes/services/init/codeService';

export const useCodeListQuery = () => {
	return useQuery({
		queryKey: ['codes'],
		queryFn: () => getAllCodeList(),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
