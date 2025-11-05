import { useState, useRef, useEffect } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';

import { usePlanFormSchema } from '@primes/schemas/production';
import {
	PlanMaster,
	CreatePlanPayload,
	UpdatePlanPayload,
} from '@primes/types/production';
import { useCreatePlan, useUpdatePlan } from '@primes/hooks/production/usePlan';

import { CodeSelectComponent } from '@primes/components/customSelect';
import {
	ItemSelectComponent,
	SalesOrderSelectComponent,
} from '@primes/components/customSelect';
import { toast } from 'sonner';
import { useTranslation } from '@repo/i18n';

interface ProductionPlanRegisterPageProps {
	onClose?: () => void;
	mode: 'create' | 'edit';
	data?: PlanMaster | null;
}

interface ProductionPlanRegisterData {
	accountMon?: string;
	planCode?: string;
	itemNo?: number;
	planQuantity?: number;
	planType?: string;
	vendorOrderCode?: string;
	status?: string;
	itemUnit?: string;
	itemId?: number;
	[key: string]: unknown;
}

export const ProductionPlanRegisterPage: React.FC<
	ProductionPlanRegisterPageProps
> = ({ onClose, mode, data }) => {
	const { t } = useTranslation('dataTable');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	const planFormSchema: FormField[] = usePlanFormSchema();
	const createMutation = useCreatePlan();
	const updateMutation = useUpdatePlan();
	const handleSubmit = async (formData: ProductionPlanRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			const transformAccountMon = (
				accountMon: string | undefined
			): string => {
				if (!accountMon) return '';
				return accountMon.replace('-', '');
			};

			// 데이터 변환 로직
			const processedData: CreatePlanPayload = {
				accountMon: transformAccountMon(formData.accountMon),
				itemId: formData.itemId ? Number(formData.itemId) : undefined,
				itemNo: formData.itemNo ? Number(formData.itemNo) : undefined,
				planQuantity: formData.planQuantity
					? Number(formData.planQuantity)
					: undefined,
				planType: formData.planType
					? String(formData.planType)
					: undefined,
				vendorOrderCode: formData.vendorOrderCode
					? String(formData.vendorOrderCode)
					: undefined,
				status: formData.status ? String(formData.status) : undefined,
				itemUnit: formData.itemUnit
					? String(formData.itemUnit)
					: undefined,
			};

			if (mode === 'create') {
				await createMutation.mutateAsync([processedData]);
				toast.success('생산 계획이 성공적으로 등록되었습니다.');
			} else if (mode === 'edit' && data) {
				await updateMutation.mutateAsync({
					id: data.id,
					data: processedData as UpdatePlanPayload,
				});
				toast.success('생산 계획이 성공적으로 수정되었습니다.');
			}

			handleCancel();
		} catch (error) {
			console.error('등록 실패:', error);
			toast.error('등록 중 오류가 발생했습니다.');
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

	useEffect(() => {
		if (formMethods && mode === 'edit' && data) {
			const transformAccountMon = (
				accountMon: string | undefined
			): string => {
				if (!accountMon || accountMon.length !== 6) return '';
				const year = accountMon.substring(0, 4);
				const month = accountMon.substring(4, 6);
				return `${year}-${month}`;
			};

			const defaultValues = {
				accountMon: transformAccountMon(data.accountMon),
				planCode: data.planCode || '',
				itemId: data.itemId || 0,
				itemNo: data.itemNo || 0,
				itemNumber: data.itemNumber || '',
				itemName: data.itemName || '',
				itemSpec: data.itemSpec || '',
				planQuantity: data.planQuantity || 0,
				planType: data.planType || '',
				vendorOrderCode: data.vendorOrderCode || '',
				status: data.status || '',
				itemUnit: data.itemUnit || '',
			};
			formMethods.reset(defaultValues);
		}
	}, [mode, data, formMethods]);

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={planFormSchema.filter(field => {
					if (mode === 'create' && field.name === 'planCode') {
						return false;
					}
					return true;
				})} 			
				onSubmit={handleSubmit}
				onFormReady={handleFormReady}
				otherTypeElements={{
					codeSelect: CodeSelectComponent,
					itemSelect: (props: any) => (
						<ItemSelectComponent
							{...props}
							onItemDataChange={(itemData: {
								itemId: number;
								itemNo?: string;
								itemNumber?: string;
								itemName?: string;
								itemSpec?: string;
							}) => {
								const { itemId, itemNo } = itemData;
								formMethodsRef.current?.setValue(
									'itemId',
									itemId
								);
								formMethodsRef.current?.setValue(
									'itemNo',
									Number(itemNo)
								);
							}}
						/>
					),
					orderCodeSelect: (props: any) => (
						<SalesOrderSelectComponent
							{...props}
							onChange={(value: string) => {
								props.onChange(value);
								formMethodsRef.current?.setValue(
									'vendorOrderCode',
									value
								);
							}}
						/>
					),
				}}
			/>
		</div>
	);
};

export default ProductionPlanRegisterPage;
