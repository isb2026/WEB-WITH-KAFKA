import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMeterFieldValues } from '@esg/services';

export const useMeterFieldQuery = (fieldName: string) => {
	return useQuery({
		queryKey: ['meter-fields', fieldName],
		queryFn: () => getMeterFieldValues(fieldName),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
