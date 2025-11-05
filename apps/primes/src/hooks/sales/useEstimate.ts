import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { 
	getEstimateList, 
	createEstimate, 
	updateEstimate, 
	deleteEstimate,
	getEstimateDetailList,
	getEstimateDetailByMasterId,
	createEstimateDetail,
	updateEstimateDetail,
	deleteEstimateDetail
} from '@primes/services/sales/estimateService';

export const useEstimate = (params: {
	searchRequest?: any;
	page: number;
	size: number;
}) => {
	const queryClient = useQueryClient();

	const list = useQuery({
		queryKey: ['estimate', params.searchRequest, params.page, params.size],
		queryFn: () => getEstimateList(params.searchRequest || {}, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분
	});

	const create = useMutation({
		mutationFn: (data: any) => createEstimate(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['estimate'],
			});
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: number; data: any }) => updateEstimate(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['estimate'],
			});
		},
	});

	const remove = useMutation({
		mutationFn: (ids: number[]) => deleteEstimate(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['estimate'],
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

export const useEstimateMaster = (params: {
	searchRequest?: any;
	page: number;
	size: number;
}) => {
	return useEstimate(params);
};

export const useEstimateDetail = (params: {
	searchRequest?: any;
	masterId?: number;
	page: number;
	size: number;
}) => {
	const queryClient = useQueryClient();

	const list = useQuery({
		queryKey: ['estimateDetail', params.searchRequest, params.page, params.size],
		queryFn: () => getEstimateDetailList(params.searchRequest || {}, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분
	});

	const listByMasterId = useQuery({
		queryKey: ['estimateDetail', 'byMasterId', params.masterId, params.page, params.size],
		queryFn: () => getEstimateDetailByMasterId(params.masterId!, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분
		enabled: !!params.masterId, // masterId가 있을 때만 실행
	});

	const create = useMutation({
		mutationFn: (data: any) => createEstimateDetail(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['estimateDetail'],
			});
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: number; data: any }) => updateEstimateDetail(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['estimateDetail'],
			});
		},
	});

	const remove = useMutation({
		mutationFn: (ids: number[]) => deleteEstimateDetail(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['estimateDetail'],
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