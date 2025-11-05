import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGroup } from '@esg/services';
import { UpdateGroupPayload, Group } from '@esg/types/group';
type UpdateGroupInput = { id: number; data: Partial<UpdateGroupPayload> };

export const useUpdateGroup = () => {
	const queryClient = useQueryClient();

	return useMutation<Group, Error, UpdateGroupInput>({
		mutationFn: ({ id, data }) => updateGroup(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					['group', 'groupList', 'groupTree'].some((key) =>
						query.queryKey.includes(key)
					),
			});
		},
		onError: (error) => {
			// Error handling moved to component level with useDeleteSnackbarWithTransition
		},
	});
};
