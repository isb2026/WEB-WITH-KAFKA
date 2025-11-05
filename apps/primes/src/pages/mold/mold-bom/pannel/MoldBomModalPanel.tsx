import React, { useState, useRef } from 'react';
import { useTranslation } from '@repo/i18n';
import { DraggableDialog } from '@radix-ui/components';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	createMoldBomDetail,
	updateMoldBomDetail,
	deleteMoldBomDetail,
} from '@primes/services/mold/moldBomService';
import { moldBomDetailFormSchema } from '@primes/schemas/mold/moldBomSchemas';
import { MoldMasterSelectComponent } from '@primes/components/customSelect';
import { toast } from 'sonner';

interface MoldBomModalPanelProps {
	newMasterId: number | null;
	onSuccess?: () => void;
}

export const MoldBomModalPanel = React.forwardRef<any, MoldBomModalPanelProps>(({
	newMasterId,
	onSuccess,
}, ref) => {
	const { t: tCommon } = useTranslation('common');
	const queryClient = useQueryClient();

	// Selected data state for moldMasterSelect
	const [selectedMoldMasterData, setSelectedMoldMasterData] = useState<any>(null);

	// Modal states
	const [openModal, setOpenModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
	const [selectedDetailToDelete, setSelectedDetailToDelete] = useState<any | null>(null);

	// Form ref
	const formMethodsRef = useRef<UseFormReturn<Record<string, unknown>> | null>(null);

	// Detail CRUD mutations
	const createDetailMutation = useMutation({
		mutationFn: (data: any) => createMoldBomDetail(data),
		onSuccess: () => {
			toast.success('Detail이 성공적으로 추가되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldBomDetail', newMasterId],
			});
			onSuccess?.();
		},
		onError: (error) => {
			console.error('Detail 생성 실패:', error);
			toast.error('Detail 추가 중 오류가 발생했습니다.');
		},
	});

	const updateDetailMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: any }) =>
			updateMoldBomDetail(id, data),
		onSuccess: () => {
			toast.success('Detail이 성공적으로 수정되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldBomDetail', newMasterId],
			});
			onSuccess?.();
		},
		onError: (error) => {
			console.error('Detail 수정 실패:', error);
			toast.error('Detail 수정 중 오류가 발생했습니다.');
		},
	});

	const deleteDetailMutation = useMutation({
		mutationFn: (ids: number[]) => deleteMoldBomDetail(ids),
		onSuccess: () => {
			toast.success('Detail이 성공적으로 삭제되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldBomDetail', newMasterId],
			});
			onSuccess?.();
		},
		onError: (error) => {
			console.error('Detail 삭제 실패:', error);
			toast.error('Detail 삭제 중 오류가 발생했습니다.');
		},
	});

	// Form ready handler
	const handleFormReady = (methods: UseFormReturn<Record<string, unknown>>) => {
		formMethodsRef.current = methods;
	};

	// Detail form submission handlers
	const handleDetailFormSubmit = (data: Record<string, unknown>) => {
		if (!newMasterId) {
			console.error('Master ID is required');
			toast.error('Master를 먼저 생성해주세요.');
			return;
		}

		// API 구조에 맞게 데이터 변환
		const payload = {
			moldBomMasterId: newMasterId,
			parentId: 0, // 부모ID 제거됨
			isRoot: true, // root 여부 제거됨 (기본값 true)
			moldMasterId: Number(data.moldMasterSelect) || 0,
			num: String(data.num || ''),
			isManage: data.isManage === 'true',
			leftSer: Number(data.leftSer) || 0,
			rightSer: Number(data.rightSer) || 0,
			subOrder: Number(data.subOrder) || 0,
		};

		createDetailMutation.mutate(payload, {
			onSuccess: () => {
				setOpenModal(false);
				if (formMethodsRef.current) {
					formMethodsRef.current.reset();
				}
			},
		});
	};

	const handleEditFormSubmit = (data: Record<string, unknown>) => {
		if (!selectedDetail) {
			console.error('No detail selected for editing');
			return;
		}

		// API 구조에 맞게 데이터 변환
		const payload = {
			moldBomMasterId: newMasterId || selectedDetail.moldBomMasterId,
			parentId: 0, // 부모ID 제거됨
			isRoot: true, // root 여부 제거됨 (기본값 true)
			moldMasterId: Number(data.moldMasterSelect) || 0,
			num: String(data.num || ''),
			isManage: data.isManage === 'true',
			leftSer: Number(data.leftSer) || 0,
			rightSer: Number(data.rightSer) || 0,
			subOrder: Number(data.subOrder) || 0,
		};

		updateDetailMutation.mutate(
			{ id: selectedDetail.id, data: payload },
			{
				onSuccess: () => {
					setEditModal(false);
					setSelectedDetail(null);
					if (formMethodsRef.current) {
						formMethodsRef.current.reset();
					}
				},
			}
		);
	};

	const handleDeleteConfirm = () => {
		if (!selectedDetailToDelete) {
			console.error('No detail selected for deletion');
			return;
		}

		deleteDetailMutation.mutate([selectedDetailToDelete.id], {
			onSuccess: () => {
				setDeleteDialogOpen(false);
				setSelectedDetailToDelete(null);
			},
		});
	};

	// Edit form population
	const populateEditForm = (
		methods: UseFormReturn<Record<string, unknown>>,
		detail: any
	) => {
		const defaultValues: Record<string, string | number> = {
			moldMasterSelect: detail.moldMasterId || 0,
			num: detail.num || '',
			isManage: detail.isManage ? 'true' : 'false',
			leftSer: detail.leftSer || 0,
			rightSer: detail.rightSer || 0,
			subOrder: detail.subOrder || 0,
		};

		Object.entries(defaultValues).forEach(([key, value]) =>
			methods.setValue(key, value)
		);
	};

	// 외부에서 호출할 수 있는 함수들
	const openAddModal = () => setOpenModal(true);
	const openEditModal = (detail: any) => {
		setSelectedDetail(detail);
		setEditModal(true);
	};
	const openDeleteDialog = (detail: any) => {
		setSelectedDetailToDelete(detail);
		setDeleteDialogOpen(true);
	};

	// 외부에서 접근할 수 있도록 ref로 노출
	React.useImperativeHandle(ref, () => ({
		openAddModal,
		openEditModal,
		openDeleteDialog,
	}));

	return (
		<>
			{/* Detail 추가 모달 */}
			<DraggableDialog
				open={openModal}
				onOpenChange={(open: boolean) => {
					setOpenModal(open);
				}}
				title={tCommon('pages.mold.bom.addDetail')}
				content={
					<DynamicForm
						onFormReady={handleFormReady}
						fields={moldBomDetailFormSchema}
						onSubmit={handleDetailFormSubmit}
						submitButtonText={tCommon('pages.form.save')}
						visibleSaveButton={true}
						otherTypeElements={{
							moldMasterSelect: (props: any) => (
								<MoldMasterSelectComponent
									{...props}
									value={props.value}
									onChange={(value) => {
										setSelectedMoldMasterData({
											moldMasterId: value,
										});
										props.onChange?.(value);
									}}
								/>
							),
						}}
					/>
				}
			/>

			{/* Detail 수정 모달 */}
			<DraggableDialog
				open={editModal}
				onOpenChange={(open: boolean) => {
					setEditModal(open);
					if (!open) {
						setSelectedDetail(null);
					}
				}}
				title={tCommon('pages.mold.bom.editDetail')}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							handleFormReady(methods);
							if (selectedDetail && methods) {
								populateEditForm(methods, selectedDetail);
							}
						}}
						fields={moldBomDetailFormSchema}
						onSubmit={handleEditFormSubmit}
						submitButtonText={tCommon('pages.form.modify')}
						visibleSaveButton={true}
						otherTypeElements={{
							moldMasterSelect: (props: any) => (
								<MoldMasterSelectComponent
									{...props}
									value={props.value}
									onChange={(value) => {
										setSelectedMoldMasterData({
											moldMasterId: value,
										});
										props.onChange?.(value);
									}}
								/>
							),
						}}
					/>
				}
			/>

			{/* 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={deleteDialogOpen}
				onOpenChange={(open) => setDeleteDialogOpen(open)}
				onConfirm={handleDeleteConfirm}
				isDeleting={false}
				title={tCommon('pages.mold.bom.deleteDetail')}
				description={tCommon('pages.mold.bom.deleteDetailConfirm')}
			/>
		</>
	);
});
