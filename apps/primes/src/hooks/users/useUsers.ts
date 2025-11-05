import { useUserListQuery } from './useUserListQuery';
import { useCreateUser } from './useCreateUser';
import { useUpdateUser } from './useUpdateUser';
import { useDeleteUser } from './useDeleteUser';
import { UserSearchRequest } from '@primes/types/users';

export const useUsers = (params: {
	page: number;
	size: number;
	searchRequest?: UserSearchRequest;
}) => {
	const list = useUserListQuery(params);
	const create = useCreateUser();
	const update = useUpdateUser(params.page, params.size);
	const remove = useDeleteUser(params.page, params.size);

	return {
		list, // data, isLoading 등 포함
		create,
		update,
		remove,
	};
};
