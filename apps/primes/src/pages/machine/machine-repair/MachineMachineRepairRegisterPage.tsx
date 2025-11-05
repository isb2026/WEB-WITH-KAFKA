import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';

import { MachineRepairFormFields } from '@primes/schemas/machine';
import {
	MachineRepair,
	CreateMachineRepairPayload,
	UpdateMachineRepairPayload,
} from '@primes/types/machine';
import {
	useCreateMachineRepair,
	useUpdateMachineRepair,
} from '@primes/hooks/machine/useMachineRepair';

import { MachineSelectComponent, MachinePartSelectComponent } from '@primes/components/customSelect';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';
import { BinaryToggleComponent } from '@primes/components/customSelect';
import { useVendorListQuery } from '@primes/hooks/init/vendor/useVendorListQuery';

interface MachineMachineRepairRegisterPageProps {
	onClose?: () => void;
	machineRepairData?: MachineRepair;
	mode: 'create' | 'update';
	selectedMachineRepair?: MachineRepair | any;
}

interface MachineMachineRepairRegisterData {
	[key: string]: any;
}

export const MachineMachineRepairRegisterPage: React.FC<MachineMachineRepairRegisterPageProps> = ({
	onClose,
	mode,
	selectedMachineRepair,
	machineRepairData
}) => {
	const { t } = useTranslation('dataTable');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	const formSchema: FormField[] = MachineRepairFormFields();
	const createMutation = useCreateMachineRepair();
	const updateMutation = useUpdateMachineRepair();
	const [selectedRepairPart, setSelectedRepairPart] = useState<string | null>(null);

	// 설비 업체 데이터를 가져오기 위한 쿼리
	const [selectedMachineVendorId, setSelectedMachineVendorId] = useState<string | null>(null);

	const { data: machineVendorData } = useVendorListQuery({
		searchRequest: selectedMachineVendorId ? { id: Number(selectedMachineVendorId) } : {},
		page: 0,
		size: 1
	});

	// 설비 업체 데이터가 로드되면 폼에 값 설정
	useEffect(() => {
		if (machineVendorData && formMethodsRef.current) {
			if (machineVendorData.content && machineVendorData.content.length > 0) {
				const vendor = machineVendorData.content[0];
				formMethodsRef.current.setValue('machineVendorName', vendor.compName || '');
			}
		}
	}, [machineVendorData]);

	// 거래처 선택 시 거래처 ID 저장
	const handleMachineVendorSelect = (machineVendorId: string | null) => {
		setSelectedMachineVendorId(machineVendorId);
	};

	// 수리 업체 데이터를 가져오기 위한 쿼리
	const [selectedRepairVendorId, setSelectedRepairVendorId] = useState<string | null>(null);

	const { data: repairVendorData } = useVendorListQuery({
		searchRequest: selectedRepairVendorId ? { id: Number(selectedRepairVendorId) } : {},
		page: 0,
		size: 1
	});

	// 수리 업체 데이터가 로드되면 폼에 값 설정
	useEffect(() => {
		if (repairVendorData && formMethodsRef.current) {
			if (repairVendorData.content && repairVendorData.content.length > 0) {
				const vendor = repairVendorData.content[0];
				formMethodsRef.current.setValue('repairVendorName', vendor.compName || '');
			}
		}
	}, [repairVendorData]);

	const handleRepairVendorSelect = (repairVendorId: string | null) => {
		setSelectedRepairVendorId(repairVendorId);
	};

	const handleSubmit = async (formData: MachineMachineRepairRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			const processedData: CreateMachineRepairPayload = {
				subject: String(formData.subject || ''),
				repairPart: String(formData.repairPart || ''),
				repairCost: formData.repairCost ? Number(formData.repairCost) : 0,
				description: formData.description ? String(formData.description) : undefined,
				repairStartDt: formData.repairStartDt ? String(formData.repairStartDt) : undefined,
				repairEndDt: formData.repairEndDt ? String(formData.repairEndDt) : undefined,
				brokenAt: formData.brokenAt ? String(formData.brokenAt) : undefined,
				machineId: formData.machineId ? Number(formData.machineId) : 0,
				machinePartId: formData.machinePartId ? Number(formData.machinePartId) : undefined,
				partAmount: formData.partAmount ? Number(formData.partAmount) : undefined,
				machineVendorId: formData.machineVendorId ? Number(formData.machineVendorId) : 0,
				machineVendorName: formData.machineVendorName ? String(formData.machineVendorName) : undefined,
				repairVendorId: formData.repairVendorId ? Number(formData.repairVendorId) : 0,
				repairVendorName: formData.repairVendorName ? String(formData.repairVendorName) : undefined,
				repairWorker: formData.repairWorker ? String(formData.repairWorker) : undefined,
				repairVendorTel: formData.repairVendorTel ? String(formData.repairVendorTel) : undefined,
				isClose: formData.isClose !== undefined ? formData.isClose : false,
				closeName: formData.closeName ? String(formData.closeName) : undefined,
				closeAt: formData.closeAt ? String(formData.closeAt) : undefined,
				isAdmit: formData.isAdmit !== undefined ? formData.isAdmit : false,
				admitName: formData.admitName ? String(formData.admitName) : undefined,
				admitAt: formData.admitAt ? String(formData.admitAt) : undefined,
			};
			
			if (mode === 'create') {
				await createMutation.mutateAsync([processedData]);
			} else if (mode === 'update' && selectedMachineRepair) {
				await updateMutation.mutateAsync({
					id: selectedMachineRepair.id,
					data: processedData as UpdateMachineRepairPayload,
				});
			}
			handleCancel();
		} catch (error) {
			console.error('등록 실패:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	// 수리부품 선택 핸들러
	const handleRepairPartSelect = (partId: string | null) => {
		setSelectedRepairPart(partId);
	};
	
	useEffect(() => {
		if (mode === 'update' && selectedMachineRepair && formMethodsRef.current) {
			formMethodsRef.current.setValue('subject', selectedMachineRepair.subject || '');
			formMethodsRef.current.setValue('repairPart', selectedMachineRepair.repairPart || '');
			formMethodsRef.current.setValue('repairCost', selectedMachineRepair.repairCost || 0);
			formMethodsRef.current.setValue('description', selectedMachineRepair.description || '');
			formMethodsRef.current.setValue('repairStartDt', selectedMachineRepair.repairStartDt || '');
			formMethodsRef.current.setValue('repairEndDt', selectedMachineRepair.repairEndDt || '');
			formMethodsRef.current.setValue('brokenAt', selectedMachineRepair.brokenAt || '');
			formMethodsRef.current.setValue('machineId', selectedMachineRepair.machineId || 0);
			formMethodsRef.current.setValue('machinePartId', selectedMachineRepair.machinePartId || '');
			formMethodsRef.current.setValue('partAmount', selectedMachineRepair.partAmount || '');
			formMethodsRef.current.setValue('machineVendorId', selectedMachineRepair.machineVendorId?.toString() || 0);
			formMethodsRef.current.setValue('machineVendorName', selectedMachineRepair.machineVendorName || '');
			formMethodsRef.current.setValue('repairVendorId', selectedMachineRepair.repairVendorId?.toString() || 0);
			formMethodsRef.current.setValue('repairVendorName', selectedMachineRepair.repairVendorName || '');
			formMethodsRef.current.setValue('repairWorker', selectedMachineRepair.repairWorker || '');
			formMethodsRef.current.setValue('repairVendorTel', selectedMachineRepair.repairVendorTel || '');
			formMethodsRef.current.setValue('isClose', selectedMachineRepair.isClose || false);
			formMethodsRef.current.setValue('closeName', selectedMachineRepair.closeName || '');
			formMethodsRef.current.setValue('closeAt', selectedMachineRepair.closeAt || '');
			formMethodsRef.current.setValue('isAdmit', selectedMachineRepair.isAdmit || false);
			formMethodsRef.current.setValue('admitName', selectedMachineRepair.admitName || '');
			formMethodsRef.current.setValue('admitAt', selectedMachineRepair.admitAt || '');

			setSelectedMachineVendorId(selectedMachineRepair.machineVendorId?.toString() || null);
			setSelectedRepairVendorId(selectedMachineRepair.repairVendorId?.toString() || null);
		}
	}, [mode, selectedMachineRepair, formMethodsRef.current]);

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={formSchema}
				onSubmit={handleSubmit}
				onFormReady={handleFormReady}
				layout="split"
				otherTypeElements={{
					machineName: (props: any) => (
						<MachineSelectComponent
							{...props}
							showMachineName={true}
							showMachineType={false}
							onChange={(value: any) => {
								props.onChange(value);
							}}
							onMachineIdChange={(machineId: number) => {
								formMethodsRef.current?.setValue('machineId', machineId);
							}}
						/>
					),
					partName: (props: any) => (
						<MachinePartSelectComponent 
							{...props} 
							value={props.value || selectedRepairPart}
							onChange={(value: any) => {
								props.onChange(value);
								handleRepairPartSelect(value);
							}}
							onMachinePartIdChange={(machinePartId: number) => {
								formMethodsRef.current?.setValue('machinePartId', machinePartId);
							}}
						/>
					),
					machineVendorId: (props: any) => (
						<VendorSelectComponent 
							{...props} 
							onChange={(value) => {
								props.onChange(value);
								handleMachineVendorSelect(value);
							}}
						/>
					),
					repairVendorId: (props: any) => (
						<VendorSelectComponent 
							{...props} 
							onChange={(value) => {
								props.onChange(value);
								handleRepairVendorSelect(value);
							}}
						/>
					),
					isClose: (props: any) => (
						<BinaryToggleComponent
							value={props.value === true ? 'true' : 'false'}
							onChange={(value) => {
								props.onChange(value === 'true');
							}}
							falseLabel="마감대기"
							trueLabel="마감완료"
						/>
					),
					isAdmit: (props: any) => (
						<BinaryToggleComponent
							value={props.value === true ? 'true' : 'false'}
							onChange={(value) => {
								props.onChange(value === 'true');
							}}
							falseLabel="승인대기"
							trueLabel="승인완료"
						/>
					),
				}}

			/>
		</div>
	);
};

export default MachineMachineRepairRegisterPage;
