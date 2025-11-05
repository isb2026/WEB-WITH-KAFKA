import { useQuery } from '@tanstack/react-query';
import { getMoldInstanceByInputCommandId } from '@primes/services/mold/moldInstanceService';
import { keepPreviousData } from '@tanstack/react-query';

export const useMoldInstanceByInputCommandId = (params: {
	inputCommandId?: number;
	isInput?: boolean;
	page: number;
	size: number;
}) => {
	const { inputCommandId, isInput = true, page, size } = params;

	return useQuery({
		queryKey: ['moldInstanceByInputCommandId', inputCommandId, isInput, page, size],
		queryFn: () => getMoldInstanceByInputCommandId(inputCommandId!, isInput, page, size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
		enabled: !!inputCommandId, // inputCommandId가 있을 때만 쿼리 실행
	});
};
