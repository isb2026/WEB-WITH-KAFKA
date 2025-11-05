import { useRef, useState, useMemo, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import FormComponent from '@primes/components/form/FormComponent';
import { useTaxInvoiceMaster } from '@primes/hooks/sales/taxInvoiceMaster/useTaxInvoiceMaster';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';
import { RadixButton } from '@radix-ui/components';
import { Check, RotateCw } from 'lucide-react';
import {
	CreateTaxInvoiceMasterPayload,
	UpdateTaxInvoiceMasterPayload,
	TaxInvoiceMaster,
} from '@primes/types/sales/taxInvoiceMaster';
import { useTranslation } from '@repo/i18n';

// Utility function to get today's date in 'YYYY-MM-DD' format
const getTodayDateString = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1).toString().padStart(2, '0');
	const day = today.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};

interface SalesTaxInvoiceRegisterFormProps {
	onSuccess?: (res: TaxInvoiceMaster) => void;
	onError?: (error: Error) => void;
	onReset?: () => void;
	masterData?: TaxInvoiceMaster & { taxDate?: string; currencyUnit?: string };
	isEditMode?: boolean;
	taxInvoiceMasterId?: number;
}

export const SalesTaxInvoiceRegisterForm = (
	props: SalesTaxInvoiceRegisterFormProps
) => {
	const { t } = useTranslation('common');
	const { onSuccess, onReset, masterData, isEditMode } = props;
	const { create, update: updateMaster } = useTaxInvoiceMaster({
		page: 0,
		size: 30,
	});
	const [isCreated, setIsCreated] = useState(false);

	// ✅ 수정: useMemo 의존성 배열에서 불필요한 isEditMode 제거
	const vendorFormSchema = useMemo(
		() => [
			{
				name: 'taxInvoiceCode',
				label: t('pages.form.taxInvoiceCode'),
				type: 'text',
				placeholder: t('pages.form.taxInvoiceCodePlaceholder'),
				disabled: true,
				defaultValue: masterData?.taxInvoiceCode || '',
			},
			{
				name: 'vendorName',
				label: t('pages.form.vendorName'),
				type: 'vendorSelect',
				placeholder: t('pages.form.vendorNamePlaceholder'),
				required: true,
				defaultValue: masterData?.vendorName || '',
				disabled: isCreated,
				includeVendorType: [],
			},
			{
				name: 'taxDate',
				label: t('pages.form.taxDate'),
				type: 'date',
				defaultValue: masterData?.taxDate || getTodayDateString(),
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
				defaultValue: masterData?.currencyUnit || 'KRW',
				required: true,
				disabled: isCreated,
			},
		],
		[t, masterData, isCreated] // ✅ 수정: isEditMode 제거
	);

	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	// ✅ 추가: props.masterData가 변경될 때 form 값 업데이트
	useEffect(() => {
		if (formMethodsRef.current && masterData) {
			const form = formMethodsRef.current;
			
			// form 값들을 masterData로 업데이트
			form.setValue('taxInvoiceCode', masterData.taxInvoiceCode || '');
			form.setValue('vendorName', masterData.vendorName || '');
			form.setValue('taxDate', masterData.taxDate || getTodayDateString());
			form.setValue('currencyUnit', masterData.currencyUnit || 'KRW');
		}
	}, [masterData]); // masterData가 변경될 때마다 실행

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		
		// ✅ 추가: form이 준비되면 즉시 masterData 바인딩
		if (masterData) {
			methods.setValue('taxInvoiceCode', masterData.taxInvoiceCode || '');
			methods.setValue('vendorName', masterData.vendorName || '');
			methods.setValue('taxDate', masterData.taxDate || getTodayDateString());
			methods.setValue('currencyUnit', masterData.currencyUnit || 'KRW');
		}
	};

	const handleResetForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.reset();
			// Reset form fields to default values
			formMethodsRef.current.setValue('taxDate', getTodayDateString());
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

		if (isEditMode) {
			// ✅ 수정: cleanedParams 패턴 적용
			const { vendorName, taxDate } = data;
			const updatePayload: Partial<UpdateTaxInvoiceMasterPayload> = {
				vendorNo: 1,
				vendorName: (vendorName as string) ?? '',
				taxDate: (taxDate as string) ?? '',
			};

			const masterId = props.taxInvoiceMasterId || masterData?.id || 0;

			if (masterId === 0) {
				return;
			}

			updateMaster.mutate({
				id: masterId,
				data: updatePayload,
			});
		} else {
			// ✅ 수정: cleanedParams 패턴 적용
			const { vendorName, taxDate } = data;
			const createPayload: CreateTaxInvoiceMasterPayload = {
				vendorNo: 1,
				vendorName: (vendorName as string) ?? '',
				taxDate: (taxDate as string) ?? '',
			};

			create.mutate(
				{ data: createPayload },
				{
					onSuccess: (res) => {
						if (onSuccess) {
							onSuccess(res as unknown as TaxInvoiceMaster);
						}
						setIsCreated(true);
					},
				}
			);
		}
	};

	return (
		<FormComponent
			title={t('pages.taxInvoice.registerForm')}
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
