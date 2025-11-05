import { getGroupList } from '@esg/services';
import { addDelay } from '@esg/utils/addDelay';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
interface GroupListParams {
	page: number | null;
	size: number | null;
	searchRequest?: import('@esg/types/group').GroupSearchRequest;
}
export const useGroupListQuery = ({
	page,
	size,
	searchRequest,
}: GroupListParams) => {
	if (page == null || size == null) return null;
	return useQuery({
		queryKey: ['group', page, size, searchRequest],
		queryFn: () =>
			addDelay(300, getGroupList({ page, size, searchRequest } as any)),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
