import { useCheckingSpecListQuery } from './useCheckingSpecListQuery';
import { useCreateCheckingSpec } from './useCreateCheckingSpec';
import { useUpdateCheckingSpec } from './useUpdateCheckingSpec';
import { useDeleteCheckingSpec } from './useDeleteCheckingSpec';
import type { CheckingSpecListParams } from '@primes/types/qms/checkingSpec';

/**
 * QMS 검사 규격 복합 Hook (Atomic Hook들의 조합)
 * Field API Hook은 제외하고 CRUD 관련만 포함
 */
export const useCheckingSpecs = (params: CheckingSpecListParams) => {
	const list = useCheckingSpecListQuery(params);
	const create = useCreateCheckingSpec();
	const update = useUpdateCheckingSpec();
	const remove = useDeleteCheckingSpec();

	return { list, create, update, remove };
};
