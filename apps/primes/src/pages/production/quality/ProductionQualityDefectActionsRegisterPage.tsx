import React, { useState, useEffect, useRef } from 'react';
import { RadixButton } from '@radix-ui/components';
import { Save } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { useQueryClient } from '@tanstack/react-query';
import { useDefectRecords } from '@primes/hooks/production/defectRecord/useDefectRecord';
import { useDefectActions } from '@primes/hooks/production/defectAction/useDefectAction';
import { DefectActionCreateRequest,DefectActionUpdateRequest, DefectStatus, DefectActionType } from '@primes/types/production/defectTypes';

interface ProductionQualityDefectActionsRegisterModalProps {
	isOpen: boolean;
	onClose: () => void;
	defectRecordId: number;
	editingAction?: any;
	status: DefectStatus;
}

interface ExtendedDefectActionUpdateRequest extends DefectActionUpdateRequest {
	status?: DefectStatus;
}

const ProductionQualityDefectActionsRegisterModal: React.FC<ProductionQualityDefectActionsRegisterModalProps> = ({
	isOpen,
	onClose,
	defectRecordId,
	editingAction,
	status,
}) => {
	const isEditMode = !!editingAction;
	const queryClient = useQueryClient();
	
	// DefectAction hooks
	const { create: createDefectAction, update: updateDefectAction } = useDefectActions();
	const { list: defectRecordList, update: updateDefectRecord } = useDefectRecords();
	
	const [isLoading, setIsLoading] = useState(false);
	const [formMethods, setFormMethods] = useState<UseFormReturn<Record<string, unknown>> | null>(null);
	const formMethodsRef = useRef<UseFormReturn<Record<string, unknown>> | null>(null);
	
	// 폼 필드 정의
	const formFields: FormField[] = [
		{
			name: 'actionTaken',
			label: '처리 내용',
			type: 'textarea',
			required: true,
			placeholder: '불량에 대한 처리 내용을 상세히 입력하세요',
			rows: 4,
		},
		{
			name: 'actionDate',
			label: '처리 일자',
			type: 'date',
			required: true,
		},
		{
			name: 'actionBy',
			label: '처리자',
			type: 'text',
			required: true,
			placeholder: '처리자명을 입력하세요',
		},
		{
			name: 'actionType',
			label: '처리 유형',
			type: 'select',
			required: false,
			options: [
				{ label: '임시조치', value: 'TEMPORARY' },
				{ label: '근본조치', value: 'ROOT_CAUSE' },
				{ label: '예방조치', value: 'PREVENTIVE' },
				{ label: '시정조치', value: 'CORRECTIVE' },
			],
		},
		{
			name: 'workingHours',
			label: '소요시간',
			type: 'number',
			required: false,
			placeholder: '소요시간을 입력하세요 (시간 단위)',
		},
		{
			name: 'status',
			label: '불량 현황 변경',
			type: 'select',
			required: true,
			options: [
				{ label: '신규', value: 'OPEN' },
				{ label: '조사중', value: 'INVESTIGATING' },
				{ label: '해결됨', value: 'RESOLVED' },
				{ label: '종료', value: 'CLOSED' },
			],
		},
	];
	
	// 폼 준비 핸들러
	const handleFormReady = (methods: UseFormReturn<Record<string, unknown>>) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};
	
	// 편집 모드일 때 기존 데이터 로드
	useEffect(() => {
		if (formMethods) {
			if (isEditMode && editingAction) {
				const formData = {
					actionTaken: editingAction.description || editingAction.actionTaken || '',
					actionDate: editingAction.date?.split(' ')[0] || editingAction.actionDate || new Date().toISOString().split('T')[0],
					actionBy: editingAction.performedBy || editingAction.actionBy || '',
					actionType: editingAction.actionType || '',
					workingHours: editingAction.workingHours || '',
					status: editingAction.status || status,
				};
				formMethods.reset(formData);
			} else {
				// 새로 추가할 때는 폼 초기화
				const today = new Date().toISOString().split('T')[0];
				formMethods.reset({
					actionTaken: '',
					actionDate: today,
					actionBy: '',
					actionType: '',
					workingHours: '',
					status: status,
				});
			}
		}
	}, [isEditMode, editingAction, isOpen, formMethods]);
	
	// 저장 핸들러
	const handleSave = async (data: Record<string, unknown>) => {
		if (!data.actionTaken || !String(data.actionTaken).trim()) {
			alert('처리 내용을 입력해주세요.');
			return;
		}
		
		setIsLoading(true);
		
		try {
			if (isEditMode) {
				// 수정
				const updateData: ExtendedDefectActionUpdateRequest = {
					actionTaken: String(data.actionTaken),
					actionDate: String(data.actionDate),
					actionBy: String(data.actionBy),
					actionType: data.actionType as DefectActionType,
					workingHours: Number(data.workingHours),
				};
				
				await updateDefectAction.mutateAsync({
					id: editingAction.id,
					data: updateData
				});
				await updateDefectRecord.mutateAsync({
					id: defectRecordId,
					data: {
						status: data.status as DefectStatus,
					}
				});
			} else {
				// 추가
				const createData: DefectActionCreateRequest = {
					defectRecordId: defectRecordId,
					actionTaken: String(data.actionTaken),
					actionDate: String(data.actionDate),
					actionBy: String(data.actionBy),
					actionType: data.actionType as DefectActionType,
					workingHours: Number(data.workingHours),
				};
				
				await createDefectAction.mutateAsync([createData]);
				await updateDefectRecord.mutateAsync({
					id: defectRecordId,
					data: {
						status: data.status as DefectStatus,
					}
				});
			}
			
			// 쿼리 무효화로 데이터 새로고침
			queryClient.invalidateQueries({ queryKey: ['defectActions'] });
			queryClient.invalidateQueries({ queryKey: ['defectRecords'] });
			
			// 성공 시 모달 닫기
			onClose();
		} catch (error) {
			console.error('불량 처리 이력 저장 실패:', error);
		} finally {
			setIsLoading(false);
		}
	};
	
	if (!isOpen) return null;
	
	return (
		<div className="w-full">
			<DynamicForm
				fields={formFields}
				onSubmit={handleSave}
				onFormReady={handleFormReady}
				submitButtonText={isLoading ? '저장 중...' : (isEditMode ? '수정' : '저장')}
				visibleSaveButton={false}
			/>
			
			{/* 버튼 그룹 */}
			<div className="flex justify-end gap-3 mt-6 pt-4 border-t">
				<RadixButton
					className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
					onClick={onClose}
					disabled={isLoading}
				>
					취소
				</RadixButton>
				<RadixButton
					className="px-6 py-2 bg-Colors-Brand-700 text-white rounded-md hover:bg-Colors-Brand-800 flex items-center gap-2"
					onClick={() => {
						if (formMethods) {
							formMethods.handleSubmit(handleSave)();
						}
					}}
					disabled={isLoading}
				>
					<Save size={16} />
					{isLoading ? '저장 중...' : (isEditMode ? '수정' : '저장')}
				</RadixButton>
			</div>
		</div>
	);
};

export default ProductionQualityDefectActionsRegisterModal;
