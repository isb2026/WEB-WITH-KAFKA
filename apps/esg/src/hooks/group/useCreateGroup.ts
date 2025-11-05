import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGroup } from '@esg/services';
import { CreateGroupPayload, Group } from '@esg/types/group';

type CreateGroupInput = { data: Partial<CreateGroupPayload> };

export const useCreateGroup = () => {
	const queryClient = useQueryClient();

	return useMutation<Group, Error, CreateGroupInput>({
		mutationFn: ({ data }) => createGroup(data as CreateGroupPayload),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					['group', 'groupList', 'groupTree'].some((key) =>
						query.queryKey.includes(key)
					),
			});
		},
		onError: (error) => {
			// Error handling moved to component level
			console.error('Group creation error:', error);
		},
	});
};
