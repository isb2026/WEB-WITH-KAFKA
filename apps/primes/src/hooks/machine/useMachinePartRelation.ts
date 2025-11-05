import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
	createMachinePartRelation, 
	updateMachinePartRelation, 
	deleteMachinePartRelation,
	getMachinePartRelationList
} from '@primes/services/machine/machinePartRelationService';
import type { 
	CreateMachinePartRelationPayload, 
	UpdateMachinePartRelationPayload,
	MachinePartRelationListParams 
} from '@primes/types/machine';

// 생성 훅
export const useCreateMachinePartRelation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateMachinePartRelationPayload[]) =>
			createMachinePartRelation(data),
		onSuccess: () => {
			// 관련된 모든 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['machine-part-relations'] });
		},
		onError: (error) => {
			console.error('설비 부품 관계 등록 실패:', error);
		},
	});
};

// 수정 훅
export const useUpdateMachinePartRelation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateMachinePartRelationPayload }) =>
			updateMachinePartRelation(id, data),
		onSuccess: () => {
			// 관련된 모든 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['machine-part-relations'] });
		},
		onError: (error) => {
			console.error('설비 부품 관계 수정 실패:', error);
		},
	});
};

// 삭제 훅
export const useDeleteMachinePartRelation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => deleteMachinePartRelation(ids),
		onSuccess: () => {
			// 관련된 모든 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['machine-part-relations'] });
		},
		onError: (error) => {
			console.error('설비 부품 관계 삭제 실패:', error);
		},
	});
};

// 조회 훅
export const useMachinePartRelations = (params?: { page?: number; size?: number; searchRequest?: any }) => {
	return useQuery({
		queryKey: ['machine-part-relations', params],
		queryFn: () => getMachinePartRelationList(
			params?.searchRequest || {},
			params?.page || 0,
			params?.size || 10
		),
		enabled: true,
	});
};