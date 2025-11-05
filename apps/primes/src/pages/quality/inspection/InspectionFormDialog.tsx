import React, { useState, useMemo, useEffect } from 'react';
import { DraggableDialog } from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';
import type { CheckingSpecType } from '@primes/types/qms/checkingSpec';

import { BinaryToggleComponent } from '@primes/components/customSelect';
import { ItemDto } from '@primes/types/item';
import { ItemProgressDto } from '@primes/types/progress';
import { Machine } from '@primes/types/machine';


type CheckingSpecTypeValue = 'CHOICE' | 'ONE_SIDED' | 'TOLERANCE' | 'RANGE' | 'REFERENCE';
import { toast } from 'sonner';

// 폼 필드 타입
export interface FormField {
	name: string;
	label: string;
	type: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox' | string;
	required?: boolean;
	disabled?: boolean;
	options?: { value: string; label: string }[];
	placeholder?: string;
	defaultValue?: any;
	validation?: {
		minValue?: string;
		maxValue?: string;
		pattern?: string;
		message?: string;
	};
}

// 폼 데이터 타입
export interface InspectionFormData {
	checkingName: string;
	inspectionType?: string;
	CheckingSpecType: CheckingSpecType;
	standard: string;
	standardUnit: string;
	checkPeriod?: string;
	sampleQuantity: number;
	orderNo: number;
	checkingFormulaId?: number;
	meta?: {
		tolerance?: number;
		maxValue?: string;
		minValue?: string;
		referenceNote?: string;
	};
}

// 다이얼로그 props 인터페이스
export interface InspectionFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: InspectionFormData) => Promise<void>;
	title?: string;
	mode?: 'create' | 'edit';
	initialData?: Partial<InspectionFormData>;
	fields?: FormField[];
	isLoading?: boolean;
	loadingText?: string;
	className?: string;
	submitButtonText?: string;
	cancelButtonText?: string;
	item?: ItemDto | Machine; // ItemDto 또는 Machine 타입 허용
	currentProgress?: ItemProgressDto;
	inspectionType?: string;
	onFormReady?: (methods: UseFormReturn<any>) => void;
	onCancel?: () => void;
	onSuccess?: (data: InspectionFormData) => void;
	onError?: (error: string) => void;
}

// 기본값 정의
const defaultProps: Partial<InspectionFormDialogProps> = {
	title: '', // 번역 키로 처리
	mode: 'create',
	fields: [],
	isLoading: false,
	loadingText: '', // 번역 키로 처리
	className: '',
	submitButtonText: '', // 번역 키로 처리
	cancelButtonText: '', // 번역 키로 처리
};

// 검사 종류별 필드 정의
const getCategoryFields = (
	category: CheckingSpecTypeValue,
	t: (key: string) => string,
	initialData?: Partial<InspectionFormData>
): FormField[] => {
	switch (category) {
		case 'CHOICE':
			return [
				{
					name: 'maxValue',
					label: t('inspection.inspectionForm.categoryFields.CHOICE.maxValue'),
					type: 'text',
					required: true,
					placeholder: t('inspection.inspectionForm.categoryFields.CHOICE.maxValuePlaceholder'),
					validation: { message: t('inspection.inspectionForm.categoryFields.CHOICE.maxValueRequired') }
				},
				{
					name: 'minValue',
					label: t('inspection.inspectionForm.categoryFields.CHOICE.minValue'),
					type: 'text',
					required: true,
					placeholder: t('inspection.inspectionForm.categoryFields.CHOICE.minValuePlaceholder'),
					validation: { message: t('inspection.inspectionForm.categoryFields.CHOICE.minValueRequired') }
				}
			];
		case 'ONE_SIDED': {
			const initialMax = initialData?.meta?.maxValue;
			const initialMin = initialData?.meta?.minValue;
			const defaultDirection = initialMax != null ? 'MAX' : initialMin != null ? 'MIN' : 'MAX';
			const defaultValue = initialMax ?? initialMin ?? undefined;
			return [
				{
					name: 'limitDirection',
					label: t('inspection.inspectionForm.categoryFields.ONE_SIDED.limitDirection'),
					type: 'oneSidedDirection',
					required: true,
					defaultValue: defaultDirection,
				},
				{
					name: 'limitValue',
					label: t('inspection.inspectionForm.categoryFields.ONE_SIDED.limitValue'),
					type: 'number',
					required: true,
					placeholder: t('inspection.inspectionForm.categoryFields.ONE_SIDED.limitValuePlaceholder'),
					defaultValue: defaultValue,
				}
			];
		}
		case 'TOLERANCE':
			return [
				{
					name: 'tolerance',
					label: t('inspection.inspectionForm.categoryFields.TOLERANCE.tolerance'),
					type: 'number',
					required: true,
					placeholder: t('inspection.inspectionForm.categoryFields.TOLERANCE.tolerancePlaceholder'),
					validation: { message: t('inspection.inspectionForm.categoryFields.TOLERANCE.toleranceRequired') }
				}
			];
		case 'RANGE':
			return [
				{
					name: 'minValue',
					label: t('inspection.inspectionForm.categoryFields.RANGE.minValue'),
					type: 'number',
					required: true,
					placeholder: t('inspection.inspectionForm.categoryFields.RANGE.minValuePlaceholder'),
					validation: { message: t('inspection.inspectionForm.categoryFields.RANGE.minValueRequired') }
				},
				{
					name: 'maxValue',
					label: t('inspection.inspectionForm.categoryFields.RANGE.maxValue'),
					type: 'number',
					required: true,
					placeholder: t('inspection.inspectionForm.categoryFields.RANGE.maxValuePlaceholder'),
					validation: { message: t('inspection.inspectionForm.categoryFields.RANGE.maxValueRequired') }
				}
			];
		case 'REFERENCE':
			return [
				{
					name: 'referenceNote',
					label: t('inspection.inspectionForm.categoryFields.REFERENCE.referenceNote'),
					type: 'textarea',
					required: false,
					placeholder: t('inspection.inspectionForm.categoryFields.REFERENCE.referenceNotePlaceholder'),
				}
			];
		default:
			return [];
	}
};

// 기본 폼 필드 정의 (상단부)
const getDefaultFieldsTop = (t: (key: string) => string, tDataTable: (key: string) => string): FormField[] => [
	{
		name: 'checkingName',
		label: tDataTable('columns.checkingName'),
		type: 'text',
		required: true,
		placeholder: t('inspection.inspectionForm.fields.checkingNamePlaceholder'),
		validation: { message: t('inspection.inspectionForm.fields.checkingNameRequired') }
	},
	{
		name: 'CheckingSpecType',
		label: t('inspection.inspectionForm.fields.checkingSpecType'),
		type: 'select',
		required: true,
		defaultValue: 'CHOICE',
		options: [
			{ value: 'CHOICE', label: t('inspection.inspectionForm.specTypes.CHOICE') },
			{ value: 'ONE_SIDED', label: t('inspection.inspectionForm.specTypes.ONE_SIDED') },
			{ value: 'TOLERANCE', label: t('inspection.inspectionForm.specTypes.TOLERANCE') },
			{ value: 'RANGE', label: t('inspection.inspectionForm.specTypes.RANGE') },
			{ value: 'REFERENCE', label: t('inspection.inspectionForm.specTypes.REFERENCE') }
		],
		validation: { message: t('inspection.inspectionForm.fields.checkingSpecTypeRequired') }
	},
	{
		name: 'standard',
		label: tDataTable('columns.standard'),
		type: 'text',
		required: true,
		placeholder: t('inspection.inspectionForm.fields.standardPlaceholder'),
		validation: { message: t('inspection.inspectionForm.fields.standardRequired') }
	},
];

// 기본 폼 필드 정의 (하단부)
const getDefaultFieldsBottom = (t: (key: string) => string, tDataTable: (key: string) => string, inspectionType?: string): FormField[] => [
	{
		name: 'standardUnit',
		label: tDataTable('columns.standardUnit'),
		type: 'text',
		required: true,
		placeholder: t('inspection.inspectionForm.fields.standardUnitPlaceholder')
	},
	{
		name: 'checkingFormulaId',
		label: tDataTable('columns.checkingFormulaId'),
		type: 'number',
		required: true,
		placeholder: t('inspection.inspectionForm.fields.checkingFormulaIdPlaceholder')
	},
	// inspectionType이 MACHINE일 때만 checkPeriod 필드 추가
	...(inspectionType === 'MACHINE' ? [{
		name: 'checkPeriod',
		label: t('inspection.inspectionForm.fields.checkPeriod'),
		type: 'select',
		required: true,
		options: [
			{ value: 'DAY', label: t('inspection.inspectionForm.checkPeriods.DAY') },
			{ value: 'WEEK', label: t('inspection.inspectionForm.checkPeriods.WEEK') },
			{ value: 'MONTH', label: t('inspection.inspectionForm.checkPeriods.MONTH') },
		],
		validation: { message: t('inspection.inspectionForm.fields.checkPeriodRequired') }
	}] : []),
	{
		name: 'sampleQuantity',
		label: tDataTable('columns.sampleQuantity'),
		type: 'number',
		required: true,
		placeholder: t('inspection.inspectionForm.fields.sampleQuantityPlaceholder'),
		validation: { message: t('inspection.inspectionForm.fields.sampleQuantityRequired') }
	},
	{
		name: 'orderNo',
		label: t('inspection.inspectionForm.fields.orderNo'),
		type: 'number',
		required: true,
		placeholder: t('inspection.inspectionForm.fields.orderNoPlaceholder'),
		validation: { message: t('inspection.inspectionForm.fields.orderNoRequired') }
	},
];

const InspectionFormDialog: React.FC<InspectionFormDialogProps> = (props) => {
	const {
		open,
		onOpenChange,
		onSubmit,
		title,
		mode,
		initialData,
		fields,
		isLoading,
		loadingText,
		className,
		submitButtonText,
		cancelButtonText,
		item,
		currentProgress,
		inspectionType,
		onFormReady,
		onCancel,
		onSuccess,
		onError,
	} = { ...defaultProps, ...props };

	const { t: tCommon } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');
	const [selectedCategory, setSelectedCategory] = useState<CheckingSpecTypeValue>(
		(initialData?.CheckingSpecType as unknown as CheckingSpecTypeValue) || 'CHOICE'
	);

	// initialData가 변경될 때 selectedCategory 업데이트
	useEffect(() => {
		if (initialData?.CheckingSpecType) {
			setSelectedCategory(initialData.CheckingSpecType as unknown as CheckingSpecTypeValue);
		}
	}, [initialData?.CheckingSpecType]);

	const toNumberOrUndef = (v: unknown) => {
		if (v === '' || v === null || v === undefined) return undefined;
		const n = Number(v);
		return Number.isNaN(n) ? undefined : n;
	};

	const sanitize = (obj: Record<string, any>) =>
		Object.fromEntries(
			Object.entries(obj).filter(([, v]) => v !== undefined && v !== '' && v !== 'undefined' && !Number.isNaN(v))
		);

	// 검사 종류에 따라 동적으로 필드 생성
	const formFields = useMemo(() => {
		if (fields && fields.length > 0) {
			return fields;
		}
		
		// 기본 필드 + 카테고리별 필드 + 하단 필드 (inspectionType 전달)
		return [
			...getDefaultFieldsTop(tCommon, tDataTable),
			...getCategoryFields(selectedCategory as CheckingSpecTypeValue, tCommon, initialData),
			...getDefaultFieldsBottom(tCommon, tDataTable, inspectionType) // inspectionType 전달
		];
	}, [fields, selectedCategory, tCommon, tDataTable, initialData, inspectionType]); // inspectionType 의존성 추가

	// 폼 준비 완료 핸들러 (간단하게)
	const handleFormReady = (methods: UseFormReturn<any>) => {
		onFormReady?.(methods);
		
		// 검사 종류 변경 감지 (간단하게)
		const subscription = methods.watch((data, { name }) => {
			if (name === 'CheckingSpecType' && data.CheckingSpecType) {
				setSelectedCategory(data.CheckingSpecType);
			}
		});
		
		// cleanup 함수 반환
		return () => subscription.unsubscribe();
	};

	// 폼 제출 핸들러 - 상위로 위임
	const handleFormSubmit = async (data: Record<string, unknown>) => {
		try {
			const checkingSpecTypeValue = String((data as any).CheckingSpecType);

			let computedMeta: Record<string, any> | undefined = undefined;
			if (checkingSpecTypeValue === 'ONE_SIDED') {				const direction = (data as any).limitDirection === 'MIN' ? 'MIN' : 'MAX';
				const value = toNumberOrUndef((data as any).limitValue);
				const raw = direction === 'MAX' ? { maxValue: value } : { minValue: value };
				const sanitized = sanitize(raw);
				computedMeta = Object.keys(sanitized).length > 0 ? sanitized : undefined;
			} else {
				const raw = {
					tolerance: toNumberOrUndef((data as any).tolerance),
					maxValue: (data as any).maxValue,
					minValue: (data as any).minValue,
					referenceNote: (data as any).referenceNote,
				};
				const sanitized = sanitize(raw);
				computedMeta = Object.keys(sanitized).length > 0 ? sanitized : undefined;
			}

			const formData: InspectionFormData = {
				checkingName: (data.checkingName as string) || '',
				CheckingSpecType: (data.CheckingSpecType as CheckingSpecType),
				standard: (data.standard as string) || '',
				standardUnit: (data.standardUnit as string) || '',
				checkPeriod: (data.checkPeriod as string) || 'DAY',
				sampleQuantity: (data.sampleQuantity as number) || 1,
				orderNo: (data.orderNo as number) || 1,
				checkingFormulaId: (data.checkingFormulaId as number) || undefined,
				meta: computedMeta,
				inspectionType: inspectionType,
			};

			// 상위 컴포넌트의 onSubmit 호출
			await onSubmit(formData);
			
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : tCommon('inspection.inspectionForm.unknownError');
			onError?.(errorMessage);
			toast.error(errorMessage);
		}
	};

	// 취소 핸들러
	const handleCancel = () => {
		onCancel?.();
		onOpenChange(false);
	};

	const dialogTitle = title || (mode === 'create' ? tCommon('inspection.inspectionForm.title') : tCommon('inspection.inspectionForm.editTitle'));
	const submitBtnText = isLoading ? (loadingText || tCommon('inspection.inspectionForm.saving')) : (submitButtonText || tCommon('inspection.inspectionForm.save'));

	return (
		<DraggableDialog
			open={open}
			onOpenChange={onOpenChange}
			title={dialogTitle}
			content={
				<div className="p-4">
					{(item || currentProgress) && (
						<div className="mb-4 p-3 bg-muted rounded-lg flex flex-row justify-between gap-2">
							{item && (
								<div className="flex flex-row gap-2 w-1/2">
									<span className="font-semibold text-sm text-muted-foreground">{tCommon('inspection.inspectionForm.selectedItem')}</span>
									<span className="ml-2 text-sm">
										{'itemName' in item ? item.itemName : item.machineName || 'N/A'}
									</span>
								</div>
							)}
							{currentProgress && (
								<div className="flex flex-row gap-2 items-center w-1/2">
									<span className="font-semibold text-sm text-muted-foreground">{tCommon('inspection.inspectionForm.selectedProgress')}</span>
									<span className="ml-2 text-sm">{currentProgress.progressName || 'N/A'}</span>
								</div>
							)}
						</div>
					)}
					<DynamicForm
						onFormReady={handleFormReady}
						fields={formFields.map((field) => ({
							...field,
							disabled: isLoading,
						}))}
						onSubmit={handleFormSubmit}
						submitButtonText={submitBtnText}
						visibleSaveButton={true}
						initialData={initialData}
						otherTypeElements={{
							oneSidedDirection: (props: any) => (
								<BinaryToggleComponent
									value={props.value || 'MAX'}
									onChange={(value: string) => props.onChange(value)}
									falseLabel={tCommon('inspection.inspectionForm.binaryToggle.min')}
									trueLabel={tCommon('inspection.inspectionForm.binaryToggle.max')}
									falseValue="MIN"
									trueValue="MAX"
									disabled={isLoading}
								/>
							),
						}}
					/>
					

				</div>
			}
		/>
	);
};

export default InspectionFormDialog; 