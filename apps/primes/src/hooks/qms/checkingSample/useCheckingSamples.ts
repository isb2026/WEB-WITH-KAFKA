import { useCheckingSampleListQuery } from './useCheckingSampleListQuery';
import { useCreateCheckingSample } from './useCreateCheckingSample';
import { useUpdateCheckingSample } from './useUpdateCheckingSample';
import { useDeleteCheckingSample } from './useDeleteCheckingSample';
import type { CheckingSampleListParams } from '@primes/types/qms/checkingSample';

/**
 * QMS 검사 샘플 복합 Hook (Atomic Hook들의 조합)
 * Field API Hook은 제외하고 CRUD 관련만 포함
 */
export const useCheckingSamples = (params: CheckingSampleListParams) => {
	const list = useCheckingSampleListQuery(params);
	const create = useCreateCheckingSample();
	const update = useUpdateCheckingSample();
	const remove = useDeleteCheckingSample();

	return { list, create, update, remove };
};
