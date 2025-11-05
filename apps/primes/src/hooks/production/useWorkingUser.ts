import { WorkingUserSearchParams } from '@primes/types/production';
import { useWorkingUserListQuery } from './useWorkingUserListQuery';
import { useCreateWorkingUser } from './useCreateWorkingUser';
import { useUpdateWorkingUser } from './useUpdateWorkingUser';
import { useDeleteWorkingUser } from './useDeleteWorkingUser';

interface UseWorkingUserParams extends WorkingUserSearchParams {
	page?: number;
	size?: number;
}

export const useWorkingUser = (params: UseWorkingUserParams) => {
	const list = useWorkingUserListQuery(params);
	const create = useCreateWorkingUser();
	const update = useUpdateWorkingUser();
	const remove = useDeleteWorkingUser();

	return { list, create, update, remove };
};
