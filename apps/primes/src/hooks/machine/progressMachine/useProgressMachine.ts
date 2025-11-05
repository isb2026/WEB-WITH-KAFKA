import { useGetProgressMachineList } from './useGetProgressMachineList';
import { useCreateProgressMachine } from './useCreateProgressMachine';
import { useUpdateProgressMachine } from './useUpdateProgressMachine';
import { useDeleteProgressMachine } from './useDeleteProgressMachine';
import type { ProgressMachineListParams } from './keys';

export const useProgressMachine = (params: ProgressMachineListParams) => {
	const list = useGetProgressMachineList(params);
	const create = useCreateProgressMachine();
	const update = useUpdateProgressMachine();
	const remove = useDeleteProgressMachine();

	return {
		list,
		create,
		update,
		remove,
	};
};
