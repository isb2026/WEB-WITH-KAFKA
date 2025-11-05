import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRecord } from '@esg/services';
import { CreateRecordPayload } from '@esg/types/record';

type CreateCompanyInput = { data: Partial<CreateRecordPayload> };

export const useCreateRecord = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateCompanyInput>({
		mutationFn: ({ data }) => createRecord(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					['records'].some((key) => query.queryKey.includes(key)),
			});
		},
		onError: (error) => {},
	});
};
