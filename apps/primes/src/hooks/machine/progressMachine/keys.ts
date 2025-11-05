import { ProgressMachineSearchRequest } from '@primes/types/progressMachine';

export interface ProgressMachineListParams {
	page?: number;
	size?: number;
	searchRequest?: ProgressMachineSearchRequest;
}

export const progressMachineKeys = {
	all: ['progressMachine'] as const,
	list: (params: ProgressMachineListParams) =>
		[...progressMachineKeys.all, 'list', params] as const,
	detail: (id: number) => [...progressMachineKeys.all, 'detail', id] as const,
};
