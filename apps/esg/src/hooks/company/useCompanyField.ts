import { getCompanyFieldValues } from '@esg/services';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { GetFieldDataPayload } from '@esg/types/company';

export const useCompanyField = (
	fieldName: string,
	payload: GetFieldDataPayload
) => {
	return useQuery({
		queryKey: ['companyField', fieldName],
		queryFn: () => getCompanyFieldValues(fieldName, payload),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
