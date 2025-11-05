import { useCheckingHeadListQuery } from './useCheckingHeadListQuery';
import { useCreateCheckingHead } from './useCreateCheckingHead';
import { useUpdateCheckingHead } from './useUpdateCheckingHead';
import { useDeleteCheckingHead } from './useDeleteCheckingHead';
import type { CheckingHeadListParams } from '@primes/types/qms/checkingHead';

/**
 * QMS 검사 헤드 복합 Hook (Atomic Hook들의 조합)
 * Field API Hook은 제외하고 CRUD 관련만 포함
 */
export const useCheckingHeads = (params: CheckingHeadListParams) => {
	const list = useCheckingHeadListQuery(params);
	const create = useCreateCheckingHead();
	const update = useUpdateCheckingHead();
	const remove = useDeleteCheckingHead();

	return { list, create, update, remove };
};
