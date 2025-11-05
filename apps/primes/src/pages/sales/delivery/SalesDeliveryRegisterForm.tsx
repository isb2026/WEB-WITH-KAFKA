import { useRef, useState, useMemo, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import FormComponent from '@primes/components/form/FormComponent';
import { useDeliveryMaster } from '@primes/hooks/sales/deliveryMaster/useDeliveryMaster';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';
import { RadixButton } from '@radix-ui/components';
import { Check, RotateCw } from 'lucide-react';
import { DeliveryMasterPayload, DeliveryMaster } from '@primes/types/sales';
import { useTranslation } from '@repo/i18n';

// Utility function to get today's date in 'YYYY-MM-DD' format
const getTodayDateString = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1).toString().padStart(2, '0');
	const day = today.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};

interface SalesDeliveryRegisterFormProps {
	onSuccess?: (res: DeliveryMaster) => void;
	onError?: (error: Error) => void;
	onReset?: () => void;
	masterData?: DeliveryMaster & {
		deliveryDate?: string;
		currencyUnit?: string;
	};
	isEditMode?: boolean;
	deliveryMasterId?: number;
}

export const SalesDeliveryRegisterForm = (
	props: SalesDeliveryRegisterFormProps
) => {
	const { t } = useTranslation('common');
	const { onSuccess, onReset } = props;
	const { create, update: updateMaster } = useDeliveryMaster({
		page: 0,
		size: 30,
		searchRequest: {},
	});
	const [isCreated, setIsCreated] = useState(false);

	const vendorFormSchema = useMemo(
		() => [
			{
				name: 'deliveryCode',
				label: t('pages.form.deliveryCode'),
				type: 'text',
				placeholder: t('pages.form.deliveryCodePlaceholder'),
				disabled: true,
				defaultValue: props.masterData?.deliveryCode || '',
			},
			{
				name: 'vendorName',
				label: t('pages.form.vendorName'),
				type: 'vendorSelect',
				placeholder: t('pages.form.vendorNamePlaceholder'),
				required: true,
				defaultValue: props.masterData?.vendorName || '',
				disabled: isCreated,
				includeVendorType: ['COM-006'], // Filter vendors by COM-006 type
			},
			{
				name: 'deliveryDate',
				label: t('pages.form.deliveryDate'),
				type: 'date',
				defaultValue:
					props.masterData?.deliveryDate || getTodayDateString(),
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
			form.setValue('deliveryCode', props.masterData.deliveryCode || '');
			form.setValue('vendorName', props.masterData.vendorName || '');
			form.setValue('deliveryDate', props.masterData.deliveryDate || getTodayDateString());
			form.setValue('currencyUnit', props.masterData.currencyUnit || 'KRW');
		}
	}, [props.masterData]); // masterData가 변경될 때마다 실행

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		
		// ✅ 추가: form이 준비되면 즉시 masterData 바인딩
		if (props.masterData) {
			methods.setValue('deliveryCode', props.masterData.deliveryCode || '');
			methods.setValue('vendorName', props.masterData.vendorName || '');
			methods.setValue('deliveryDate', props.masterData.deliveryDate || getTodayDateString());
			methods.setValue('currencyUnit', props.masterData.currencyUnit || 'KRW');
		}
	};

	const handleResetForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.reset();
			// Reset form fields to default values
			formMethodsRef.current.setValue(
				'deliveryDate',
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
			const updatePayload: DeliveryMasterPayload = {
				vendorNo: 1,
				vendorName: (data.vendorName as string) ?? '',
				deliveryDate: (data.deliveryDate as string) ?? '',
				currencyUnit: (data.currencyUnit as string) ?? '',
			};
			// Use the deliveryMasterId prop or fallback to masterData.id
			const masterId = props.deliveryMasterId || props.masterData?.id || 0;

			if (masterId === 0) {
				console.error('Delivery master ID is required for update');
				return;
			}

			updateMaster.mutate({
				id: masterId,
				data: updatePayload,
			});
		} else {
			const createPayload: DeliveryMasterPayload = {
				vendorNo: 1,
				vendorName: (data.vendorName as string) ?? '',
				deliveryDate: (data.deliveryDate as string) ?? '',
				deliveryLocationCode: 1,
				deliveryLocation: '2024-01-01T00:00:00',
				currencyUnit: (data.currencyUnit as string) ?? 'USD',
			};

			create.mutate(createPayload, {
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
			title={t('pages.delivery.deliveryInfo')}
			actionButtons={<OrderInfoActionButtons />}
		>
			<div className="max-w-full mx-auto">
				<DynamicForm
					onFormReady={handleFormReady}
					fields={vendorFormSchema}
					visibleSaveButton={false}
					otherTypeElements={{
						vendorSelect: VendorSelectComponent,
					}}
				/>
			</div>
		</FormComponent>
	);
};
