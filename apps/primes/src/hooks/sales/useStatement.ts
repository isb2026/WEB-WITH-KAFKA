import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { 
	getStatementList, 
	createStatement, 
	updateStatement, 
	deleteStatement,
	getStatementDetailList,
	getStatementDetailByMasterId,
	createStatementDetail,
	updateStatementDetail,
	deleteStatementDetail
} from '@primes/services/sales/statementService';

export const useStatement = (params: {
	searchRequest?: any;
	page: number;
	size: number;
}) => {
	const queryClient = useQueryClient();

	const list = useQuery({
		queryKey: ['statement', params.searchRequest, params.page, params.size],
		queryFn: () => getStatementList(params.searchRequest || {}, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분
	});

	const create = useMutation({
		mutationFn: (data: any) => createStatement(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['statement'],
			});
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: number; data: any }) => updateStatement(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['statement'],
			});
		},
	});

	const remove = useMutation({
		mutationFn: (ids: number[]) => deleteStatement(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['statement'],
			});
		},
	});

	return {
		list,
		create,
		update,
		remove,
	};
};

export const useStatementMaster = (params: {
	searchRequest?: any;
	page: number;
	size: number;
}) => {
	return useStatement(params);
};

export const useStatementDetail = (params: {
	searchRequest?: any;
	masterId?: number;
	page: number;
	size: number;
}) => {
	const queryClient = useQueryClient();

	const list = useQuery({
		queryKey: ['statementDetail', params.searchRequest, params.page, params.size],
		queryFn: () => getStatementDetailList(params.searchRequest || {}, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분
	});

	const listByMasterId = useQuery({
		queryKey: ['statementDetail', 'byMasterId', params.masterId, params.page, params.size],
		queryFn: () => getStatementDetailByMasterId(params.masterId!, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분
		enabled: !!params.masterId, // masterId가 있을 때만 실행
	});

	const create = useMutation({
		mutationFn: (data: any) => createStatementDetail(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['statementDetail'],
			});
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: number; data: any }) => updateStatementDetail(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['statementDetail'],
			});
		},
	});

	const remove = useMutation({
		mutationFn: (ids: number[]) => deleteStatementDetail(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['statementDetail'],
			});
		},
	});

	return {
		list,
		listByMasterId,
		create,
		update,
		remove,
	};
};