import { useState, useRef, useEffect } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';
import { MachinePartOrderFormFields } from '@primes/schemas/machine';
import { 
	MachinePartOrder,
	CreateMachinePartOrderPayload,
	UpdateMachinePartOrderPayload
} from '@primes/types/machine';
import {
	useCreateMachinePartOrder,
	useUpdateMachinePartOrder,
} from '@primes/hooks/machine/useMachinePartOrder';
import { BinaryToggleComponent } from '@primes/components/customSelect';
import { MachinePartSelectComponent } from '@primes/components/customSelect/MachinePartSelectComponent';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';
import { useVendorListQuery } from '@primes/hooks/init/vendor/useVendorListQuery';

interface MachineMachinePartOrderRegisterPageProps {
	onClose?: () => void;
	machinePartOrderData?: MachinePartOrder;
	mode: 'create' | 'update';
	selectedMachinePartOrder?: MachinePartOrder | null;
}

interface MachineMachinePartOrderRegisterData {
	[key: string]: any;
}

export const MachineMachinePartOrderRegisterPage: React.FC<MachineMachinePartOrderRegisterPageProps> = ({
	onClose, 
	mode, 
	selectedMachinePartOrder, 
	machinePartOrderData 
}) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	const formSchema: FormField[] = MachinePartOrderFormFields();
	const createMutation = useCreateMachinePartOrder();
	const updateMutation = useUpdateMachinePartOrder();

	// 거래처 데이터를 가져오기 위한 쿼리
	const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

	const { data: vendorData } = useVendorListQuery({
		searchRequest: selectedVendorId ? { id: Number(selectedVendorId) } : {},
		page: 0,
		size: 1
	});

	// 거래처 데이터가 로드되면 폼에 값 설정
	useEffect(() => {
		if (vendorData && formMethodsRef.current) {
			if (vendorData.content && vendorData.content.length > 0) {
				const vendor = vendorData.content[0];
				formMethodsRef.current.setValue('vendorName', vendor.compName || '');
				formMethodsRef.current.setValue('vendorCode', vendor.compCode || '');
			}
		}
	}, [vendorData]);

	// 수정 모드일 때 기존 데이터를 폼에 바인딩
	useEffect(() => {
		if (mode === 'update' && selectedMachinePartOrder && formMethodsRef.current) {
			// 기존 데이터를 폼에 설정
			formMethodsRef.current.setValue('orderDate', selectedMachinePartOrder.orderDate || '');
			formMethodsRef.current.setValue('partId', selectedMachinePartOrder.machinePartId || '');
			formMethodsRef.current.setValue('partName', selectedMachinePartOrder.partName || '');
			formMethodsRef.current.setValue('partStandard', selectedMachinePartOrder.partStandard || '');
			formMethodsRef.current.setValue('number', selectedMachinePartOrder.number || '');
			formMethodsRef.current.setValue('vendorId', selectedMachinePartOrder.vendorId?.toString() || '');
			formMethodsRef.current.setValue('vendorName', selectedMachinePartOrder.vendorName || '');
			formMethodsRef.current.setValue('vendorCode', selectedMachinePartOrder.vendorCode || '');
			formMethodsRef.current.setValue('isEnd', selectedMachinePartOrder.isEnd || false);

			// 거래처 ID 설정
			setSelectedVendorId(selectedMachinePartOrder.vendorId?.toString() || null);
		}
	}, [mode, selectedMachinePartOrder, formMethodsRef.current]);

	// 거래처 선택 시 거래처 ID 저장
	const handleVendorSelect = (vendorId: string | null) => {
		setSelectedVendorId(vendorId);
	};

	const otherTypeElements = {
		codeSelect: CodeSelectComponent,
	};

	const handleSubmit = async (data: MachineMachinePartOrderRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			const processedData: CreateMachinePartOrderPayload = {
					orderDate: data.orderDate || '',
					machinePartId: Number(data.partId) || 0, // partId에서 ID 추출
					number: Number(data.number) || 0,
					vendorId: Number(data.vendorId) || 0, // vendorName에서 ID 추출
					vendorCode: data.vendorCode || '',
					vendorName: data.vendorName || '',
					isEnd: data.isEnd !== undefined ? data.isEnd : false,
			};

			if (mode === 'create') {
				await createMutation.mutateAsync([processedData]);
			} else if (mode === 'update' && selectedMachinePartOrder) {
				await updateMutation.mutateAsync({
					id: selectedMachinePartOrder.id,
					data: processedData as UpdateMachinePartOrderPayload,
				});
			}

			handleCancel();
		} catch (error) {
			console.error('등록 실패:', error);
			console.error('등록 중 오류가 발생했습니다.');
			console.error('오류 상세:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm 
				fields={formSchema} 
				onSubmit={handleSubmit}
				onFormReady={(methods) => {
					formMethodsRef.current = methods;
				}}
				otherTypeElements={{
					machinePartSelect: (props: any) => (
						<MachinePartSelectComponent 
							{...props} 
							onChange={(value) => {
								props.onChange(value);
							}}
						/>
					),
					vendorSelect: (props: any) => (
						<VendorSelectComponent 
							{...props} 
							onChange={(value) => {
								props.onChange(value);
								handleVendorSelect(value);
							}}
						/>
					),
					isEnd: (props: any) => {
						return (
							<BinaryToggleComponent
								value={Boolean(props.value) ? 'true' : 'false'}
								onChange={(value) => {
									props.onChange(value === 'true');
								}}
								falseLabel="미완료"
								trueLabel="완료"
							/>
						);
					},
				}}
			/>
		</div>
	);
};

export default MachineMachinePartOrderRegisterPage;
