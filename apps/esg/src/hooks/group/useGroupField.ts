import { getGroupFieldValues } from '@esg/services';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const useGroupField = (fieldName: string) => {
	return useQuery({
		queryKey: ['groupField', fieldName],
		queryFn: () => getGroupFieldValues(fieldName),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
