import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { 
	getShipmentList, 
	createShipment, 
	updateShipment, 
	deleteShipment,
	getShipmentDetailList,
	getShipmentDetailByMasterId,
	createShipmentDetail,
	updateShipmentDetail,
	deleteShipmentDetail
} from '@primes/services/sales/shipmentService';

export const useShipment = (params: {
	searchRequest?: any;
	page: number;
	size: number;
}) => {
	const queryClient = useQueryClient();

	const list = useQuery({
		queryKey: ['shipment', params.searchRequest, params.page, params.size],
		queryFn: () => getShipmentList(params.searchRequest || {}, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분
	});

	const create = useMutation({
		mutationFn: (data: any) => createShipment(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['shipment'],
			});
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: number; data: any }) => updateShipment(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['shipment'],
			});
		},
	});

	const remove = useMutation({
		mutationFn: (ids: number[]) => deleteShipment(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['shipment'],
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

export const useShipmentMaster = (params: {
	searchRequest?: any;
	page: number;
	size: number;
}) => {
	return useShipment(params);
};

export const useShipmentDetail = (params: {
	searchRequest?: any;
	masterId?: number;
	page: number;
	size: number;
}) => {
	const queryClient = useQueryClient();

	const list = useQuery({
		queryKey: ['shipmentDetail', params.searchRequest, params.page, params.size],
		queryFn: () => getShipmentDetailList(params.searchRequest || {}, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분
	});

	const listByMasterId = useQuery({
		queryKey: ['shipmentDetail', 'byMasterId', params.masterId, params.page, params.size],
		queryFn: () => getShipmentDetailByMasterId(params.masterId!, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분
		enabled: !!params.masterId, // masterId가 있을 때만 실행
	});

	const create = useMutation({
		mutationFn: (data: any) => createShipmentDetail(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['shipmentDetail'],
			});
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: number; data: any }) => updateShipmentDetail(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['shipmentDetail'],
			});
		},
	});

	const remove = useMutation({
		mutationFn: (ids: number[]) => deleteShipmentDetail(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['shipmentDetail'],
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