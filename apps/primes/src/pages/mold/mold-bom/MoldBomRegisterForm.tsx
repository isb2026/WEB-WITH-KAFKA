import React, { useState, useEffect } from 'react';
import { RegisterFormTemplate } from '@primes/templates/RegisterFormTemplate';
import { FormField } from '@primes/components/form/DynamicFormComponent';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldBomMaster as createMoldBomMasterAPI, updateMoldBomMaster as updateMoldBomMasterAPI } from '@primes/services/mold/moldBomService';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';
import {
	ItemSelectComponent,
	ItemProgressSelectComponent,
	MachineSelectComponent,
} from '@primes/components/customSelect';
import { MoldBomMasterDto } from '@primes/types/mold';

// MoldBomMaster 폼 필드 정의 - SelectComponent로 통합
const moldBomMasterFormFields: FormField[] = [
	{
		name: 'itemSelect',
		label: '품목',
		type: 'itemSelect',
		required: true,
		placeholder: '품목을 선택하세요',
	},
	{
		name: 'progressSelect',
		label: '공정',
		type: 'itemProgressSelect',
		required: true,
		placeholder: '공정을 선택하세요',
	},
	{
		name: 'machineSelect',
		label: '설비',
		type: 'machineSelect',
		required: true,
		placeholder: '설비를 선택하세요',
	},
	{
		name: 'isUse',
		label: '사용 여부',
		type: 'select',
		options: [
			{ label: '사용', value: 'true' },
			{ label: '미사용', value: 'false' },
		],
		defaultValue: 'true',
	},
];

interface MoldBomRegisterFormProps {
	editMode?: boolean;
	editData?: MoldBomMasterDto | null;
	onSuccess?: (res: any) => void;
	onReset?: () => void;
}

export const MoldBomRegisterForm: React.FC<MoldBomRegisterFormProps> = ({
	editMode,
	editData,
	onSuccess,
	onReset,
}) => {
	const { t: tCommon } = useTranslation('common');
	const queryClient = useQueryClient();
	
	// 선택된 데이터를 저장할 상태
	const [selectedItemData, setSelectedItemData] = useState<any>(null);
	const [selectedProgressData, setSelectedProgressData] = useState<any>(null);
	const [selectedMachineData, setSelectedMachineData] = useState<any>(null);
	const [initialFormValues, setInitialFormValues] = useState<Record<string, any>>({});

	// FormRef를 저장할 상태
	const [formMethods, setFormMethods] = useState<any>(null);

	// 편집 데이터로 폼 초기값 설정
	useEffect(() => {
		if (editMode && editData) {
			setInitialFormValues({
				itemSelect: editData.itemNo?.toString(),
				progressSelect: editData.progressId?.toString(),
				machineSelect: editData.machineId?.toString(),
				isUse: editData.isUse ? 'true' : 'false',
			});
			
			// 선택된 데이터 상태도 업데이트
			setSelectedItemData({
				itemId: editData.itemId,
				itemNo: editData.itemNo,
				itemNumber: editData.itemNumber,
				itemName: editData.itemName,
				itemSpec: editData.itemSpec,
			});
			
			setSelectedProgressData({
				progressId: editData.progressId,
				progressTypeCode: editData.progressTypeCode,
			});
			
			setSelectedMachineData({
				machineId: editData.machineId,
				machineName: editData.machineName,
			});
		}
	}, [editMode, editData]);

	// Form이 준비되었을 때 즉시 초기값 설정
	useEffect(() => {
		if (formMethods && editMode && editData && editData.id) {
			const formValues = {
				itemSelect: editData.itemNo?.toString(),
				progressSelect: editData.progressId?.toString(),
				machineSelect: editData.machineId?.toString(),
				isUse: editData.isUse ? 'true' : 'false',
			};
			
			// 즉시 폼 리셋 (API 로딩과 상관없이)
			formMethods.reset(formValues);
			
			// 추가로 각 필드를 개별적으로 설정
			Object.entries(formValues).forEach(([key, value]) => {
				if (value) {
					formMethods.setValue(key, value);
				}
			});
		}
	}, [formMethods, editMode, editData?.id]);

	// createMoldBomMaster를 직접 사용하는 mutation
	const createMoldBomMasterMutation = useMutation({
		mutationFn: (data: any) => createMoldBomMasterAPI(data),
		onSuccess: () => {
			toast.success('금형 BOM이 성공적으로 등록되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldBom'],
			});
		},
		onError: (error) => {
			console.error('Submit failed:', error);
			toast.error('처리 중 오류가 발생했습니다.');
		},
	});

	// updateMoldBomMaster를 직접 사용하는 mutation
	const updateMoldBomMasterMutation = useMutation({
		mutationFn: (data: any) => updateMoldBomMasterAPI(editData?.id || 0, data),
		onSuccess: () => {
			toast.success('금형 BOM이 성공적으로 수정되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldBom'],
			});
		},
		onError: (error) => {
			console.error('Update failed:', error);
			toast.error('수정 중 오류가 발생했습니다.');
		},
	});

	// SelectComponent에서 선택된 데이터를 사용하여 변환
	const transformData = (data: Record<string, unknown>) => {
		return {
			itemId: selectedItemData?.itemId || 1,
			itemNo: Number(selectedItemData?.itemNo) || 1,
			itemNumber: selectedItemData?.itemNumber || '',
			itemName: selectedItemData?.itemName || '',
			itemSpec: selectedItemData?.itemSpec || '',
			progressId: Number(selectedProgressData?.progressId) || 1,
			progressTypeCode: selectedProgressData?.progressTypeCode || '',
			machineId: selectedMachineData?.machineId || 1,
			machineName: selectedMachineData?.machineName || '',
		};
	};

	return (
		<RegisterFormTemplate
			title={editMode ? tCommon('pages.mold.bom.edit') : tCommon('pages.mold.bom.register')}
			formSchema={moldBomMasterFormFields}
			createMutation={(editMode ? updateMoldBomMasterMutation : createMoldBomMasterMutation) as any}
			transformData={transformData}
			masterData={editData}
			isEditMode={editMode}
			onFormReady={setFormMethods}
			getDefaultValues={(masterData) => {
				if (masterData) {
					return {
						itemSelect: masterData.itemNo?.toString(),
						progressSelect: masterData.progressId?.toString(),
						machineSelect: masterData.machineId?.toString(),
						isUse: masterData.isUse ? 'true' : 'false',
					};
				}
				return {};
			}}
			otherTypeElements={{
				itemSelect: (props: any) => (
					<ItemSelectComponent
						{...props}
						displayFields={['itemName', 'itemNumber', 'itemSpec']}
						displayTemplate="{itemName} - {itemNumber} ({itemSpec})"
						value={props.value}
						onItemDataChange={(itemData) => {
							setSelectedItemData(itemData);
							props.onChange?.(itemData.itemId?.toString());
						}}
					/>
				),
				itemProgressSelect: (props: any) => {
					const currentItemId = selectedItemData?.itemId || (editMode && editData ? editData.itemId : undefined);
					
					return (
						<ItemProgressSelectComponent
							{...props}
							itemId={currentItemId}
							value={props.value}
							onChange={(value) => {
								// progressId를 저장
								setSelectedProgressData({
									progressId: value,
									progressTypeCode: value, // 실제로는 API에서 가져온 데이터 사용
								});
								props.onChange?.(value);
							}}
						/>
					);
				},
				machineSelect: (props: any) => (
					<MachineSelectComponent
						{...props}
						showMachineName={true}
						value={props.value}
						onMachineIdChange={(machineId) => {
							setSelectedMachineData((prev: any) => ({
								...prev,
								machineId,
							}));
						}}
						onMachineNameChange={(machineName) => {
							setSelectedMachineData((prev: any) => ({
								...prev,
								machineName,
							}));
						}}
					/>
				),
			}}
			onSuccess={(res: any) => {
				// createMoldBomMaster는 배열을 반환하므로 첫 번째 요소를 사용
				const masterData = Array.isArray(res) ? res[0] : res;
				if (
					masterData &&
					masterData.id &&
					typeof masterData.id === 'number'
				) {
					if (onSuccess) {
						onSuccess(masterData);
					}
				}
			}}
			onReset={() => {
				// 상태 초기화
				setSelectedItemData(null);
				setSelectedProgressData(null);
				setSelectedMachineData(null);
				
				if (onReset) {
					onReset();
				}
			}}
		/>
	);
};

export default MoldBomRegisterForm;
