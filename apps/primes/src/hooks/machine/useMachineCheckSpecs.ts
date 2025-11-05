import { useMachineCheckSpecListQuery } from './useMachineCheckSpecListQuery';
import { useCreateMachineCheckSpec } from './useCreateMachineCheckSpec';
import { useUpdateMachineCheckSpec } from './useUpdateMachineCheckSpec';
import { useDeleteMachineCheckSpec } from './useDeleteMachineCheckSpec';
import type { MachineCheckSpecListParams } from '@primes/types/machine/machineCheckSpec';

// Composite Hook - 모든 기계 검사 기준 관련 hooks를 조합
export const useMachineCheckSpecs = (params: MachineCheckSpecListParams) => {
	const list = useMachineCheckSpecListQuery(params);
	const create = useCreateMachineCheckSpec();
	const update = useUpdateMachineCheckSpec();
	const remove = useDeleteMachineCheckSpec();

	return {
		list,
		create,
		update,
		remove,
	};
};
