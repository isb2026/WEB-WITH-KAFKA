import { useRef, useState, useMemo, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import FormComponent from '@primes/components/form/FormComponent';
import { useShippingRequestMaster } from '@primes/hooks/sales/shippingRequestMaster/useShippingRequestMaster';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';
import { RadixButton } from '@radix-ui/components';
import { Check, RotateCw } from 'lucide-react';
import {
	CreateShippingRequestMasterPayload,
	UpdateShippingRequestMasterPayload,
	ShippingRequestMaster,
} from '@primes/types/sales/shippingRequestMaster';
import { useTranslation } from '@repo/i18n';

// Utility function to get today's date in 'YYYY-MM-DD' format
const getTodayDateString = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1).toString().padStart(2, '0');
	const day = today.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};

interface SalesShippingRequestRegisterFormProps {
	onSuccess?: (res: ShippingRequestMaster) => void;
	onError?: (error: Error) => void;
	onReset?: () => void;
	masterData?: ShippingRequestMaster & { requestDate?: string };
	isEditMode?: boolean;
	shippingRequestMasterId?: number; // ✅ 추가: shippingRequestMasterId prop
}

export const SalesShippingRequestRegisterForm = (
	props: SalesShippingRequestRegisterFormProps
) => {
	const { t } = useTranslation('common');
	const { onSuccess, onReset, masterData, isEditMode } = props;
	const { create, update: updateMaster } = useShippingRequestMaster({
		page: 0,
		size: 30,
	});
	const [isCreated, setIsCreated] = useState(false);

	// ✅ 수정: useMemo 의존성 배열에서 불필요한 isEditMode 제거
	const shippingRequestFormSchema = useMemo(
		() => [
			{
				name: 'shippingRequestCode',
				label: t('pages.form.shippingRequestCode'),
				type: 'text',
				placeholder: t('pages.form.shippingRequestCodePlaceholder'),
				disabled: true,
				defaultValue: masterData?.shippingRequestCode || '',
			},
			{
				name: 'vendorName',
				label: t('pages.form.vendorName'),
				type: 'vendorSelect',
				placeholder: t('pages.form.vendorNamePlaceholder'),
				required: true,
				defaultValue: masterData?.vendorName || '',
				disabled: isCreated,
				includeVendorType: ['COM-006'], // Filter vendors by COM-006 type
			},
			{
				name: 'requestDate',
				label: t('pages.form.requestDate'),
				type: 'date',
				defaultValue: masterData?.requestDate || getTodayDateString(),
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
			form.setValue('shippingRequestCode', masterData.shippingRequestCode || '');
			form.setValue('vendorName', masterData.vendorName || '');
			form.setValue('requestDate', masterData.requestDate || getTodayDateString());
		}
	}, [masterData]); // masterData가 변경될 때마다 실행

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		
		// ✅ 추가: form이 준비되면 즉시 masterData 바인딩
		if (masterData) {
			methods.setValue('shippingRequestCode', masterData.shippingRequestCode || '');
			methods.setValue('vendorName', masterData.vendorName || '');
			methods.setValue('requestDate', masterData.requestDate || getTodayDateString());
		}
	};

	const handleResetForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.reset();
			// Reset form fields to default values
			formMethodsRef.current.setValue(
				'requestDate',
				getTodayDateString()
			);
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
			const { vendorName, requestDate, shippingRequestDetails } = data;
			const updatePayload: Partial<UpdateShippingRequestMasterPayload> = {
				vendorNo: 1,
				vendorName: (vendorName as string) ?? '',
				requestDate: (requestDate as string) ?? '',
			};

			// Use the shippingRequestMasterId prop or fallback to masterData.id
			const masterId = props.shippingRequestMasterId || masterData?.id || 0;

			if (masterId === 0) {
				console.error('Shipping request master ID is required for update');
				return;
			}

			updateMaster.mutate({
				id: masterId,
				data: updatePayload,
			});
		} else {
			// ✅ 수정: cleanedParams 패턴 적용
			const { vendorName, requestDate, vendorNo } = data;
			const createPayload: CreateShippingRequestMasterPayload = {
				vendorNo: (vendorNo as number) ?? 1,
				vendorName: (vendorName as string) ?? '',
				requestDate: (requestDate as string) ?? '',
			};

			create.mutate(
				createPayload,
				{
					onSuccess: (res) => {
						if (onSuccess) {
							onSuccess(res as unknown as ShippingRequestMaster);
						}
						setIsCreated(true);
					},
				}
			);
		}
	};

	return (
		<FormComponent
			title={t('pages.shippingRequest.registerForm')}
			actionButtons={<OrderInfoActionButtons />}
		>
			<div className="max-w-full mx-auto">
				<DynamicForm
					onFormReady={handleFormReady}
					fields={shippingRequestFormSchema}
					visibleSaveButton={false}
					otherTypeElements={{
						vendorSelect: VendorSelectComponent,
					}}
				/>
			</div>
		</FormComponent>
	);
};
