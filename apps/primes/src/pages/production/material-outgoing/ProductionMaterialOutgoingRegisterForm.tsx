import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from '@repo/i18n';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import CommandSearchInput from '@primes/components/common/search/CommandSearchInput';
import { useMbomListByRootItem } from '@primes/hooks/ini/useMbom';
import { toast } from 'sonner';
import { MbomSearchRequest, MbomListDto } from '@primes/types/ini/mbom';
import FormComponent from '@primes/components/form/FormComponent';
import { RadixButton } from '@radix-ui/components';
import { RotateCw } from 'lucide-react';


interface ProductionMaterialOutgoingRegisterFormProps {
	onSuccess?: (res: any) => void;
	onReset?: () => void;
	onMbomDataUpdate?: (mbomData: MbomListDto[]) => void;
}

interface ProductionMaterialOutgoingRegisterData {
	[key: string]: any;
}

export const ProductionMaterialOutgoingRegisterForm: React.FC<
	ProductionMaterialOutgoingRegisterFormProps
> = ({ onSuccess, onReset, onMbomDataUpdate }) => {
	const { t } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');

	const [formData, setFormData] = useState<ProductionMaterialOutgoingRegisterData>({});
	const [selectedItemId, setSelectedItemId] = useState<number>(-1);
	const formMethodsRef = useRef<UseFormReturn<Record<string, unknown>> | null>(null);
	const [searchRequest, setSearchRequest] = useState<MbomSearchRequest>({});
	
	const { data: mbomData } = useMbomListByRootItem(
		selectedItemId, 1, selectedItemId > 0, searchRequest);

	useEffect(() => {
		if (mbomData && mbomData.length > 0 && onMbomDataUpdate) {
			onMbomDataUpdate(mbomData);
		}
	}, [mbomData, onMbomDataUpdate]);

	const handleOutgoingCodeFound = async (data: any) => {
		setSelectedItemId(data.itemId);
		setSearchRequest({
			parentProgressId: data.progressId,
		});
		
		// 검색 결과 데이터를 폼 데이터에 바인딩
		const newFormData = {
			...formData,
			itemNumber: data.itemNumber || '',
			itemName: data.itemName || '',
			itemId: data.itemId || '',
			itemNo: data.itemNo || '',
			itemSpec: data.itemSpec || '',
			progressTypeCode: data.progressTypeCode || '',
			progressName: data.progressName || '',
			preProgressId: data.preProgressId || '',
			commandId: data.commandId || '',
			commandNo: data.commandNo || '',
			commandAmount: data.commandAmount || '',
			commandWeight: data.commandWeight || '',
			unit: data.unit || '',
		};
		
		setFormData(newFormData);
		
		// 실제 폼 필드에 값 설정
		if (formMethodsRef.current) {
			Object.entries(newFormData).forEach(([key, value]) => {
				formMethodsRef.current?.setValue(key, value);
			});
		}
		
		toast.success('작업지시서 정보가 로드되었습니다.');
		
		// 검색 성공 시 오른쪽 새창등록 버튼 활성화를 위해 onSuccess 호출
		if (onSuccess) {
			onSuccess({
				...newFormData,
				commandId: Number(data.commandId) || 1, // 숫자로 변환
				commandGroupNo: data.commandGroupNo || '',
				progressId: data.progressId || '',
				preProgressId: data.preProgressId || '',
				progressOrder: data.progressOrder || '',
			});
		}
	};

	const handleOutgoingCodeNotFound = () => {
		toast.error(t('common.dataNotFound'));
	};

	// 번역된 폼 스키마 생성 (dataTable namespace 사용)
	const materialOutgoingFormSchema: FormField[] = [
		{
			name: 'commandNo',
			label: 'commandNo',
			type: 'custom',
			component: (
				<CommandSearchInput
					onCommandFound={handleOutgoingCodeFound}
					onCommandNotFound={handleOutgoingCodeNotFound}
					placeholder="예: 2501010001-01"
				/>
			),
			required: true,
		},
		{
			name: 'commandId',
			label: 'commandId',
			type: 'hidden',
			placeholder: '',
			required: false,
		},
		{
			name: 'itemNumber',
			label: 'itemNumber',
			type: 'text',
			readOnly: true,
			placeholder: '',
			required: false,
		},
		{
			name: 'itemName',
			label: 'itemName',
			type: 'text',
			readOnly: true,
			placeholder: '',
			required: false,
		},
		{
			name: 'itemNo',
			label: 'itemNo',
			type: 'hidden',
			placeholder: '',
			required: true,
		},
		{
			name: 'itemId',
			label: 'itemId',
			type: 'hidden',
			placeholder: '',
			required: true,
		},
		{
			name: 'itemSpec',
			label: 'itemSpec',
			type: 'text',
			placeholder: '',
			readOnly: true,
			required: false,
		},
		{
			name: 'progressTypeCode',
			label: 'progressTypeCode',
			type: 'hidden',
			placeholder: '',
			required: true,
		},
		{
			name: 'progressName',
			label: 'progressName',
			type: 'text',
			placeholder: '',
			readOnly: true,
			required: false,
		},
		{
			name: 'commandAmount',
			label: 'commandAmount',
			type: 'number',
			placeholder: '',
			readOnly: true,
			required: false,
		},
		{
			name: 'commandWeight',
			label: 'commandWeight',
			type: 'number',
			placeholder: '',
			readOnly: true,
			required: false,
		},
		{
			name: 'unit',
			label: 'unit',
			type: 'text',
			placeholder: '',
			readOnly: true,
			required: false,
		},
	];

	const formSchema: FormField[] = materialOutgoingFormSchema.map((field) => ({
		...field,
		label: tDataTable(`columns.${field.label}` as any) || field.label,
		placeholder:
			field.placeholder != ''
				? tDataTable(`columns.${field.placeholder}` as any) : '',
	}));

	const handleFormReady = (methods: UseFormReturn<Record<string, unknown>>) => {
		formMethodsRef.current = methods;
	};

	const handleResetForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.reset();
			setFormData({});
			setSelectedItemId(-1);
			setSearchRequest({});
			if (onReset) {
				onReset();
			}
		}
	};

	const ActionButtons = () => (
		<div className="flex items-center gap-2.5">
			<RadixButton
				className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white"
				onClick={handleResetForm}
			>
				<RotateCw
					size={16}
					className="text-muted-foreground text-white"
				/>
				{t('pages.form.reset')}
			</RadixButton>
		</div>
	);

	return (
		<FormComponent
			title={t('pages.production.materialOutgoing.register')}
			actionButtons={<ActionButtons />}
		>
			<div className="max-w-full mx-auto">
				<DynamicForm 
					onFormReady={handleFormReady}
					fields={formSchema}
					visibleSaveButton={false}
				/>
			</div>
		</FormComponent>
	);
}; 