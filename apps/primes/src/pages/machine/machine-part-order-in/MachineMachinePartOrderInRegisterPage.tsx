import { useState, useRef, useEffect, useCallback } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';
import { useMachinePartOrderIn } from '@primes/hooks/machine/useMachinePartOrderIn';
import { MachinePartOrderInFormFields } from '@primes/schemas/machine';
import { MachinePartOrderIn } from '@primes/types/machine';
import { 
	MachinePartSelectComponent,
	MachinePartOrderSelectComponent
 } from '@primes/components/customSelect';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';
import { useVendorListQuery } from '@primes/hooks/init/vendor/useVendorListQuery';
import { useMachinePartByIdQuery } from '@primes/hooks/machine/machine-part/useMachinePartByIdQuery';
import { useMachinePartOrderByIdQuery } from '@primes/hooks/machine/machine-part-order/useMachinePartOrderByIdQuery';

interface MachineMachinePartOrderInRegisterPageProps {
	onClose?: () => void;
	machinePartOrderInData?: MachinePartOrderIn;
	mode: 'create' | 'update';
	selectedMachinePartOrderIn?: MachinePartOrderIn | null;
}

interface MachineMachinePartOrderInRegisterData {
	[key: string]: any;
}

export const MachineMachinePartOrderInRegisterPage: React.FC<MachineMachinePartOrderInRegisterPageProps> = ({
	onClose, 
	mode, 
	selectedMachinePartOrderIn, 
	machinePartOrderInData
}) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
	const [selectedPartOrderId, setSelectedPartOrderId] = useState<string | null>(null);
	const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
	const formMethodsRef = useRef<any>(null);

	const formSchema: FormField[] = MachinePartOrderInFormFields();
	const { create, update } = useMachinePartOrderIn({
		page: 0,
		size: 30,
	});

	// 거래처 데이터를 가져오기 위한 쿼리
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
		if (mode === 'update' && selectedMachinePartOrderIn && formMethodsRef.current) {
			// 기존 데이터를 폼에 설정
			formMethodsRef.current.setValue('inDate', selectedMachinePartOrderIn.inDate || '');
			formMethodsRef.current.setValue('machinePartId', selectedMachinePartOrderIn.machinePartId || '');
			formMethodsRef.current.setValue('machinePartOrderId', selectedMachinePartOrderIn.machinePartOrderId || '');
			formMethodsRef.current.setValue('vendorId', selectedMachinePartOrderIn.vendorId?.toString() || '');
			formMethodsRef.current.setValue('vendorName', selectedMachinePartOrderIn.vendorName || '');
			formMethodsRef.current.setValue('vendorCode', selectedMachinePartOrderIn.vendorCode || '');
			formMethodsRef.current.setValue('inNum', selectedMachinePartOrderIn.inNum || '');
			formMethodsRef.current.setValue('inPrice', selectedMachinePartOrderIn.inPrice || '');

			setSelectedVendorId(selectedMachinePartOrderIn.vendorId?.toString() || null);
		}
	}, [mode, selectedMachinePartOrderIn]);

	// 거래처 선택 시 거래처 ID 저장
	const handlePartSelect = (partId: string | null) => {
		setSelectedPartId(partId);
	};

	const handlePartOrderSelect = (partOrderId: string | null) => {
		setSelectedPartOrderId(partOrderId);
	};

	const handleVendorSelect = (vendorId: string | null) => {
		setSelectedVendorId(vendorId);
	};

	const otherTypeElements = {
		codeSelect: CodeSelectComponent,
	};

	const handleSubmit = async (data: MachineMachinePartOrderInRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			if (mode === 'create') {
				const payload = [
					{
						inDate: data.inDate || '',
						machinePartId: Number(data.machinePartId) || 0,
						machinePartOrderId: Number(data.machinePartOrderId) || 0,
						vendorId: Number(data.vendorId) || 0,
						vendorCode: data.vendorCode || '',
						vendorName: data.vendorName || '',
						inNum: Number(data.inNum) || 0,
						inPrice: Number(data.inPrice) || 0,
					},
				];

				await create.mutateAsync(payload);
				onClose && onClose();
			} else if (mode === 'update' && selectedMachinePartOrderIn) {
				const updatePayload = {
					inDate: data.inDate || '',
					machinePartId: Number(data.machinePartId) || 0,
					machinePartOrderId: Number(data.machinePartOrderId) || 0,
					inNum: Number(data.inNum) || 0,
					inPrice: Number(data.inPrice) || 0,
					vendorId: Number(data.vendorId) || 0,
					vendorCode: data.vendorCode || '',
					vendorName: data.vendorName || '',
				};

				await (update as any).mutateAsync({
					id: selectedMachinePartOrderIn.id,
					data: updatePayload,
				});

				onClose && onClose();
			}
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
								handlePartSelect(value);
							}}
						/>
					),
					machinePartOrderSelect: (props: any) => (
						<MachinePartOrderSelectComponent 
							{...props} 
							onChange={(value) => {
								props.onChange(value);
								handlePartOrderSelect(value);
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
				}}
			/>
		</div>
	);
};

export default MachineMachinePartOrderInRegisterPage;
