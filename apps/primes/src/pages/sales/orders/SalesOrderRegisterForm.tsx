import { useRef, useState, useMemo, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import FormComponent from '@primes/components/form/FormComponent';
import { useOrderMaster } from '@primes/hooks/sales/orderMaster/useOrderMaster';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';
import { RadixButton } from '@radix-ui/components';
import { Check, RotateCw } from 'lucide-react';
import { CreateOrderMasterPayload, UpdateOrderMasterPayload, OrderMaster } from '@primes/types/sales/orderMaster';
import { useTranslation } from '@repo/i18n';

// Utility function to get today's date in 'YYYY-MM-DD' format
const getTodayDateString = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1).toString().padStart(2, '0');
	const day = today.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};

interface SalesOrderRegisterFormProps {
	onSuccess?: (res: OrderMaster) => void;
	onError?: (error: Error) => void;
	onReset?: () => void;
	onRequestDateChange?: (requestDate: string) => void;
	masterData?: OrderMaster & { orderDate?: string; currencyUnit?: string };
	isEditMode?: boolean;
	orderMasterId?: number;
}

export const SalesOrderRegisterForm = (props: SalesOrderRegisterFormProps) => {
	const { t } = useTranslation('common');
	const { onSuccess, onReset, onRequestDateChange } = props;
	const { createMaster, updateMaster } = useOrderMaster({
		page: 0,
		size: 30,
		searchRequest: {},
	});
	const [isCreated, setIsCreated] = useState(false);

	const vendorFormSchema = useMemo(
		() => [
			{
				name: 'orderCode',
				label: t('pages.form.orderCode'),
				type: 'text',
				placeholder: t('pages.form.orderCodePlaceholder'),
				disabled: true,
				defaultValue: props.masterData?.orderCode || '',
			},
			{
				name: 'vendorName',
				label: t('pages.form.vendorName'),
				type: 'vendorSelect',
				placeholder: t('pages.form.vendorNamePlaceholder'),
				required: true,
				defaultValue: props.masterData?.vendorName || '',
				disabled: isCreated,
				valueKey: 'id',
				includeVendorType: ['COM-006'],
			},
			{
				name: 'vendorNo',
				label: 'VendorId',
				type: 'hidden',
				defaultValue: props.masterData?.vendorNo || '',
			},
			{
				name: 'orderDate',
				label: t('pages.form.orderDate'),
				type: 'date',
				defaultValue:
					props.masterData?.orderDate || getTodayDateString(),
				required: true,
				disabled: isCreated,
			},
			{
				name: 'requestDate',
				label: t('pages.form.requestDate'),
				type: 'date',
				defaultValue:
					props.masterData?.requestDate || getTodayDateString(),
				required: true,
				disabled: isCreated,
			},
			{
				name: 'currencyUnit',
				label: t('pages.form.currencyUnit'),
				type: 'select',
				options: [
					{ label: 'KRW', value: 'KRW' },
					{ label: 'USD', value: 'USD' },
				],
				defaultValue: props.masterData?.currencyUnit || 'KRW',
				required: true,
				disabled: isCreated,
			},
		],
		[t, props.masterData, props.isEditMode, isCreated]
	);

	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	// ✅ 추가: props.masterData가 변경될 때 form 값 업데이트
	useEffect(() => {
		if (formMethodsRef.current && props.masterData) {
			const form = formMethodsRef.current;
			
			// form 값들을 masterData로 업데이트
			form.setValue('orderCode', props.masterData.orderCode || '');
			form.setValue('vendorName', props.masterData.vendorName || '');
			form.setValue('vendorNo', props.masterData.vendorNo || '');
			form.setValue('orderDate', props.masterData.orderDate || getTodayDateString());
			form.setValue('requestDate', props.masterData.requestDate || getTodayDateString());
			form.setValue('currencyUnit', props.masterData.currencyUnit || 'KRW');
		}
	}, [props.masterData]); // masterData가 변경될 때마다 실행

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		
		// ✅ 추가: form이 준비되면 즉시 masterData 바인딩
		if (props.masterData) {
			methods.setValue('orderCode', props.masterData.orderCode || '');
			methods.setValue('vendorName', props.masterData.vendorName || '');
			methods.setValue('vendorNo', props.masterData.vendorNo || '');
			methods.setValue('orderDate', props.masterData.orderDate || getTodayDateString());
			methods.setValue('requestDate', props.masterData.requestDate || getTodayDateString());
			methods.setValue('currencyUnit', props.masterData.currencyUnit || 'KRW');
		}
		
		// Watch for vendor selection changes to update vendorNo
		const subscription = methods.watch((value, { name }) => {
			if (name === 'requestDate' && value.requestDate && onRequestDateChange) {
				onRequestDateChange(value.requestDate as string);
			}
		});
		
		// Also send initial requestDate value
		if (onRequestDateChange) {
			const initialRequestDate = methods.getValues('requestDate');
			if (initialRequestDate) {
				onRequestDateChange(initialRequestDate as string);
			}
			
			subscription.unsubscribe();
			return;
		}
	};

	const handleResetForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.reset();
			// Reset form fields to default values
			formMethodsRef.current.setValue('orderDate', getTodayDateString());
			formMethodsRef.current.setValue(
				'requestDate',
				getTodayDateString()
			);
			formMethodsRef.current.setValue('currencyUnit', 'KRW');
			setIsCreated(false);
			if (onReset) {
				onReset();
			}
		}
	};

	const handleSubmitForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.handleSubmit(CreateMasterData)();
		}
	};

	const OrderInfoActionButtons = () => (
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
			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					isCreated
						? 'bg-gray-300 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-white'
				}`}
				onClick={handleSubmitForm}
				disabled={isCreated}
			>
				<Check
					size={16}
					className={isCreated ? 'text-gray-400' : 'text-white'}
				/>
				{t('pages.form.save')}
			</RadixButton>
		</div>
	);

	const CreateMasterData = (data: Record<string, unknown>) => {
		if (!formMethodsRef.current) return;

		if (props.isEditMode) {
			// Update existing order
			const updatePayload: UpdateOrderMasterPayload = {
				vendorNo: 1,
				vendorName: (data.vendorName as string) ?? '',
				isUse: true,
				orderDate: (data.orderDate as string) ?? '',
				requestDate: (data.requestDate as string) ?? '',
				currencyUnit: (data.currencyUnit as string) ?? '',
				// ...data,
			};

			// Use the orderMasterId prop or fallback to masterData.id
			const masterId = props.orderMasterId || props.masterData?.id || 0;

			if (masterId === 0) {
				console.error('Order master ID is required for update');
				return;
			}

			updateMaster.mutate({
				id: masterId,
				data: updatePayload,
			});
		} else {
			// Create new order
			const createPayload: CreateOrderMasterPayload = {
				vendorNo: 1,
				vendorName: (data.vendorName as string) ?? '',
				orderDate: (data.orderDate as string) ?? '',
				requestDate: (data.requestDate as string) ?? '',
				currencyUnit: (data.currencyUnit as string) ?? '',
				isUse: true,
			};

			createMaster.mutate(createPayload, {
				onSuccess: (res) => {
					if (onSuccess) {
						onSuccess(res);
					}
					setIsCreated(true);
				},
			});
		}
	};

	return (
		<FormComponent
			title={t('pages.order.orderInfo')}
			actionButtons={<OrderInfoActionButtons />}
		>
			<div className="max-w-full mx-auto">
				<DynamicForm
					onFormReady={handleFormReady}
					fields={vendorFormSchema}
					visibleSaveButton={false}
					otherTypeElements={{
						vendorSelect: (props: any) => (
							<VendorSelectComponent
								{...props}
								onChange={(value: string | null, label?: string, vendorData?: { id: number; compName: string }) => {
									// Update vendorName field
									props.onChange(value);
									
									// Update vendorNo field if vendorData is available
									if (vendorData && formMethodsRef.current) {
										formMethodsRef.current.setValue('vendorNo', vendorData.id);
									}
								}}
							/>
						),
					}}
				/>
			</div>
		</FormComponent>
	);
};
