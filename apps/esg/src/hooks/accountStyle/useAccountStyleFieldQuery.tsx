import { getAccountStyleFieldValues } from '@esg/services';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { GetFieldDataPayload } from '@esg/types/accountStyle';

export const useAccountStyleField = (
	fieldName: string,
	filterPayload?: GetFieldDataPayload
) => {
	return useQuery({
		queryKey: ['companyField', fieldName],
		queryFn: () =>
			getAccountStyleFieldValues(fieldName, filterPayload ?? {}),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
