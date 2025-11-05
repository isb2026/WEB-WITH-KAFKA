import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
	getFileLinkList, 
	createFileLink, 
	updateFileLink, 
	deleteFileLink,
	deleteFileLinks,
} from '@primes/services/common/fileLinkService';
import { 
	FileLinkDto, 
	FileLinkCreateRequest, 
	FileLinkUpdateRequest, 
	FileLinkSearchRequest,
	FileOwnerType
} from '@primes/types/fileUrl';
import { toast } from 'sonner';

// FileLink 목록 조회 훅
export const useFileLinkListQuery = (params: {
	searchRequest?: FileLinkSearchRequest;
	page: number;
	size: number;
}) => {
	return useQuery({
		queryKey: ['filelink', 'list', params.searchRequest, params.page, params.size],
		queryFn: () => getFileLinkList(params.searchRequest, params.page, params.size),
		staleTime: 1000 * 60 * 3, // 3분 캐시
		gcTime: 1000 * 60 * 3,    // 3분 가비지 컬렉션
	});
};

// FileLink 생성 훅
export const useCreateFileLink = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (data: FileLinkCreateRequest) => createFileLink(data),
		onSuccess: (newFileLink) => {
			toast.success('파일 링크가 성공적으로 생성되었습니다.');
			
			// 관련 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['filelink', 'list'] });
			queryClient.invalidateQueries({ 
				queryKey: ['filelink', 'owner', newFileLink.ownerTable, newFileLink.ownerType, newFileLink.ownerId] 
			});
		},
		onError: (error: Error) => {
			toast.error('파일 링크 생성에 실패했습니다.', {
				description: error.message
			});
		},
	});
};

// FileLink 수정 훅
export const useUpdateFileLink = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: FileLinkUpdateRequest }) => 
			updateFileLink(id, data),
		onSuccess: (updatedFileLink) => {
			toast.success('파일 링크가 성공적으로 수정되었습니다.');
			
			// 관련 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['filelink', 'list'] });
			queryClient.invalidateQueries({ 
				queryKey: ['filelink', 'owner', updatedFileLink.ownerTable, updatedFileLink.ownerType, updatedFileLink.ownerId] 
			});
		},
		onError: (error: Error) => {
			toast.error('파일 링크 수정에 실패했습니다.', {
				description: error.message
			});
		},
	});
};

// FileLink 삭제 훅 (단일)
export const useDeleteFileLink = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (id: number) => deleteFileLink(id),
		onSuccess: () => {
			toast.success('파일 링크가 성공적으로 삭제되었습니다.');
			
			// 관련 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['filelink', 'list'] });
			queryClient.invalidateQueries({ queryKey: ['filelink', 'owner'] });
		},
		onError: (error: Error) => {
			toast.error('파일 링크 삭제에 실패했습니다.', {
				description: error.message
			});
		},
	});
};

// FileLink 삭제 훅 (다중)
export const useDeleteFileLinks = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (ids: number[]) => deleteFileLinks(ids),
		onSuccess: () => {
			toast.success('파일 링크가 성공적으로 삭제되었습니다.');
			
			// 관련 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['filelink', 'list'] });
			queryClient.invalidateQueries({ queryKey: ['filelink', 'owner'] });
		},
		onError: (error: Error) => {
			toast.error('파일 링크 삭제에 실패했습니다.', {
				description: error.message
			});
		},
	});
};

// 통합 FileLink 훅
export const useFileLink = (params: {
	searchRequest?: FileLinkSearchRequest;
	page: number;
	size: number;
}) => {
	const list = useFileLinkListQuery(params);
	const create = useCreateFileLink();
	const update = useUpdateFileLink();
	const remove = useDeleteFileLink();
	const removeMultiple = useDeleteFileLinks();

	return {
		list,
		create,
		update,
		remove,
		removeMultiple,
	};
}; 