import { useCodeListQuery } from './useCodeListQuery';
import { useCreateCode } from './useCreateCode';
import { useUpdateCode } from './useUpdateCode';
import { useDeleteCode } from './useDeleteCode';
import { useCreateCodeGroup } from './useCreateCodeGroup';
import { useUpdateCodeGroup } from './useUpdateCodeGroup';
import { useDeleteCodeGroup } from './useDeleteCodeGroup';

export const useCode = () => {
	const list = useCodeListQuery();
	const create = useCreateCode();
	const update = useUpdateCode();
	const remove = useDeleteCode();
	const createCodeGroup = useCreateCodeGroup();
	const updateCodeGroup = useUpdateCodeGroup();
	const removeCodeGroup = useDeleteCodeGroup();

	return {
		list,
		create,
		update,
		remove,
		createCodeGroup,
		updateCodeGroup,
		removeCodeGroup,
	};
};
