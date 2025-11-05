import { useRef, useState, useMemo, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import FormComponent from '@primes/components/form/FormComponent';
import { usePurchaseMaster } from '@primes/hooks/purchase/purchaseMaster/usePurchaseMaster';
import { useVendorFieldQuery } from '@primes/hooks/init/vendor/useVendorFieldQuery';
import { RadixButton } from '@radix-ui/components';
import { Check, RotateCw } from 'lucide-react';
import {
	CreatePurchaseMasterPayload,
	UpdatePurchaseMasterPayload,
	PurchaseMaster,
} from '@primes/types/purchase/purchaseMaster';
import { useTranslation } from '@repo/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const getTodayDateString = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1).toString().padStart(2, '0');
	const day = today.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};

interface PurchaseOrdersRegisterFormProps {
	onSuccess?: (res: PurchaseMaster) => void;
	onError?: (error: Error) => void;
	onReset?: () => void;
	onRequestDateChange?: (requestDate: string) => void;
	masterData?: PurchaseMaster & {
		purchaseDate?: string;
		currencyUnit?: string;
	};
	isEditMode?: boolean;
	purchaseMasterId?: number;
}

export const PurchaseOrdersRegisterForm = (
	props: PurchaseOrdersRegisterFormProps
) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const { onSuccess, onReset, onRequestDateChange } = props;
	const queryClient = useQueryClient();
	const { create, update: updateMaster } = usePurchaseMaster({
		page: 0,
		size: 30,
	});
	const [isCreated, setIsCreated] = useState(false);
	
	// Get vendor names for select dropdown
	const { data: vendorNames, isLoading: vendorNamesLoading } = useVendorFieldQuery('compName');
	const { data: deliveryLocations, isLoading: deliveryLocationsLoading } = useVendorFieldQuery('compName');

	// Check if data is loading in edit mode
	const isDataLoading = props.isEditMode && vendorNamesLoading;

	const vendorFormSchema = useMemo(
		() => [
			{
				name: 'vendorName',
				label: t('columns.vendorName'),
				type: 'select',
				placeholder: tCommon('pages.form.vendorNamePlaceholder'),
				required: true,
				defaultValue: props.masterData?.vendorName || '',
				disabled: isCreated,
				options: Array.isArray(vendorNames) ? vendorNames
					.filter((vendor: any) => vendor.value && vendor.value.trim() !== '')
					.map((vendor: any, index: number) => ({
						label: vendor.value,
						value: vendor.id.toString(),
						vendorName: vendor.value,
						vendorId: vendor.id,
					})) : [],
			},
			{
				name: 'deliveryLocation',
				label: t('columns.deliveryLocation'),
				type: 'select',
				placeholder: tCommon('pages.form.deliveryLocationPlaceholder'),
				required: true,
				defaultValue: props.masterData?.deliveryLocation || '',
				disabled: isCreated,
				options: Array.isArray(deliveryLocations) ? deliveryLocations
					.filter((deliveryLocation: any) => deliveryLocation.value && deliveryLocation.value.trim() !== '')
					.map((deliveryLocation: any, index: number) => ({
						label: deliveryLocation.value,
						value: deliveryLocation.id,
					})) : [],
			},
			{
				name: 'purchaseDate',
				label: t('columns.purchaseDate'),
				type: 'date',
				defaultValue:
					props.masterData?.purchaseDate || getTodayDateString(),
				required: true,
				disabled: isCreated,
			},
			{
				name: 'requestDate',
				label: t('columns.requestDate'),
				type: 'date',
				defaultValue:
					props.masterData?.requestDate || getTodayDateString(),
				required: true,
				disabled: isCreated,
			},
			{
				name: 'currencyUnit',
				label: t('columns.currencyUnit'),
				type: 'select',
				options: [
					{ label: 'KRW', value: 'KRW' },
					{ label: 'USD', value: 'USD' },
				],
				defaultValue: props.masterData?.currencyUnit || '',
				required: true,
				disabled: isCreated,
			},
			{
				name: 'isClose',
				label: t('columns.isClose'),
				type: 'select',
				options: [
					{ label: '마감됨', value: 'true' },
					{ label: '마감되지않음', value: 'false' },
				],
				defaultValue: props.masterData?.isClose !== undefined ? String(props.masterData.isClose) : 'false',
				required: true,
				disabled: isCreated,
			},
			{
				name: 'isApproval',
				label: t('columns.isApproval'),
				type: 'select',
				options: [
					{ label: '승인됨', value: 'true' },
					{ label: '승인되지않음', value: 'false' },
				],
				defaultValue: props.masterData?.isApproval !== undefined ? String(props.masterData.isApproval) : 'false',
				required: true,
				disabled: isCreated,
			},
		],
		[t, props.masterData, props.isEditMode, isCreated, vendorNames, deliveryLocations]
	);

	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
	};

	// Watch for requestDate changes and notify parent
	useEffect(() => {
		if (formMethodsRef.current && onRequestDateChange) {
			const subscription = formMethodsRef.current.watch((value, { name }) => {
				if (name === 'requestDate' && value.requestDate) {
					onRequestDateChange(value.requestDate as string);
				}
			});
			return () => {
				subscription.unsubscribe();
			};
		}
		return undefined;
	}, [onRequestDateChange]);

	// Set form values when data is loaded in edit mode
	useEffect(() => {
		if (props.isEditMode && props.masterData && formMethodsRef.current && !isDataLoading) {
			const form = formMethodsRef.current;
			
			if (props.masterData.vendorId && Array.isArray(vendorNames)) {
				const matchingVendor = vendorNames.find((vendor: any) => vendor.id === props.masterData?.vendorId);
				if (matchingVendor) {
					form.setValue('vendorName', matchingVendor.id.toString(), { shouldValidate: true, shouldDirty: true });
				}
			} else if (props.masterData.vendorName && Array.isArray(vendorNames)) {
				const matchingVendor = vendorNames.find((vendor: any) => vendor.value === props.masterData?.vendorName);
				if (matchingVendor) {
					form.setValue('vendorName', matchingVendor.id.toString(), { shouldValidate: true, shouldDirty: true });
				}
			}
			
			// Find and set delivery location value using deliveryLocationId or deliveryLocation
			if (props.masterData.deliveryLocationId && Array.isArray(deliveryLocations)) {
				const matchingDelivery = deliveryLocations.find((delivery: any) => delivery.id === props.masterData?.deliveryLocationId);
				if (matchingDelivery) {
					form.setValue('deliveryLocation', matchingDelivery.id, { shouldValidate: true, shouldDirty: true });
				}
			} else if (props.masterData.deliveryLocation && Array.isArray(deliveryLocations)) {
				const matchingDelivery = deliveryLocations.find((delivery: any) => delivery.value === props.masterData?.deliveryLocation);
				if (matchingDelivery) {
					form.setValue('deliveryLocation', matchingDelivery.id, { shouldValidate: true, shouldDirty: true });
				}
			}

			if (props.masterData.isClose !== undefined) {
				form.setValue('isClose', String(props.masterData.isClose), { shouldValidate: true, shouldDirty: true });
			}
			
			if (props.masterData.isApproval !== undefined) {
				form.setValue('isApproval', String(props.masterData.isApproval), { shouldValidate: true, shouldDirty: true });
			}

			// Force form to re-render with new values
			form.trigger();
			
			// Clear validation errors after setting values
			setTimeout(() => {
				form.clearErrors(['vendorName', 'deliveryLocation']);
			}, 200);
		}
	}, [props.isEditMode, props.masterData, vendorNames, deliveryLocations, isDataLoading]);

	const handleResetForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.reset();
			// Reset form fields to default values
			formMethodsRef.current.setValue(
				'purchaseDate',
				getTodayDateString()
			);
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
				{tCommon('pages.form.reset')}
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
				{tCommon('pages.form.save')}
			</RadixButton>
		</div>
	);

	const CreateMasterData = (data: Record<string, unknown>) => {
		if (!formMethodsRef.current) return;

		if (props.isEditMode) {
			const purchaseDate = (data.purchaseDate as string) || '';
			const requestDate = (data.requestDate as string) || '';
			
			// Extract vendorId and vendorName from selected option
			const selectedVendorId = Number(data.vendorName) || 0;
			const selectedVendor = vendorNames?.find((vendor: any) => vendor.id === selectedVendorId);
			const vendorName = selectedVendor?.value || '';
			
			// Extract deliveryLocationId and deliveryLocation from selected option
			const selectedDeliveryLocationId = Number(data.deliveryLocation) || 0;
			const selectedDeliveryLocation = deliveryLocations?.find((delivery: any) => delivery.id === selectedDeliveryLocationId);
			const deliveryLocationId = selectedDeliveryLocation?.id || 0;
			const deliveryLocation = selectedDeliveryLocation?.value || '';
			
			// Create update payload matching the working Swagger example
			const updatePayload: Partial<UpdatePurchaseMasterPayload> = {
				// Remove purchaseCode - it's auto-generated by the API and shouldn't be updated
				purchaseType: (data.purchaseType as string) || '',
				vendorId: selectedVendorId,
				vendorName: vendorName,
				purchaseDate: purchaseDate,
				deliveryLocationId: deliveryLocationId,
				deliveryLocation: deliveryLocation,
				requestDate: requestDate,
				currencyUnit: (data.currencyUnit as string) || '',
				isApproval: (data.isApproval as string) === 'true',
				approvalBy: (data.approvalBy as string) || '',
				approvalAt: (data.approvalAt as string) || '',
				isClose: (data.isClose as string) === 'true',
				closeBy: (data.closeBy as string) || '',
				closeAt: (data.closeAt as string) || ''
			};

			// Use the purchaseMasterId prop or fallback to masterData.id
			const masterId =
				props.purchaseMasterId || props.masterData?.id || 0;

			if (masterId === 0) {
				console.error('Purchase master ID is required for update');
				return;
			}



			updateMaster.mutate({
				id: masterId,
				data: updatePayload,
			}, {
				onSuccess: () => {
					// Invalidate and refetch queries to refresh data
					queryClient.invalidateQueries({
						queryKey: ['PurchaseMaster', 'getById', masterId]
					});
					queryClient.invalidateQueries({
						queryKey: ['PurchaseDetail', 'byMasterId', masterId]
					});
					toast.success('성공적으로 수정되었습니다.');
				},
				onError: (error) => {
					toast.error('수정 중 오류가 발생했습니다.');
					console.error('Update master error:', error);
				},
			});
		} else {
			// Extract vendorId and vendorName from selected option
			const selectedVendorId = Number(data.vendorName) || 0;
			const selectedVendor = vendorNames?.find((vendor: any) => vendor.id === selectedVendorId);
			const vendorName = selectedVendor?.value || '';
			
			// Extract deliveryLocationId and deliveryLocation from selected option
			const selectedDeliveryLocationId = Number(data.deliveryLocation) || 0;
			const selectedDeliveryLocation = deliveryLocations?.find((delivery: any) => delivery.id === selectedDeliveryLocationId);
			const deliveryLocationId = selectedDeliveryLocation?.id || 0;
			const deliveryLocation = selectedDeliveryLocation?.value || '';
			
			// Create payload matching the working Swagger example
			const createPayload = {
				purchaseType: (data.purchaseType as string) || '',
				vendorId: selectedVendorId,
				vendorName: vendorName,
				purchaseDate: (data.purchaseDate as string) || '',
				deliveryLocationId: deliveryLocationId,
				deliveryLocation: deliveryLocation,
				requestDate: (data.requestDate as string) || '',
				currencyUnit: (data.currencyUnit as string) || '',
				isApproval: (data.isApproval as string) === 'true',
				approvalBy: data.approvalBy || '',
				approvalAt: `${(data.approvalAt as string) || ''}`,
				isClose: (data.isClose as string) === 'true',
				closeBy: data.closeBy || '',
				closeAt: `${(data.closeAt as string) || ''}`,
			};
			
			create.mutate(
				{ data: createPayload },
				{
					onSuccess: (res: any) => {
						// Invalidate and refetch queries to refresh data
						queryClient.invalidateQueries({
							queryKey: ['PurchaseMaster']
						});
						queryClient.invalidateQueries({
							queryKey: ['PurchaseDetail']
						});
						
						// Check if res has the expected structure
						let purchaseMasterData = null;
						
						if (res && typeof res === 'object') {
							// Check if res.data exists (common API response structure)
							if (res.data && res.data.id) {
								purchaseMasterData = res.data;
							}
							// Check if res has id directly
							else if (res.id) {
								purchaseMasterData = res;
							}
							// Check if res.content exists (pagination structure)
							else if (res.content && Array.isArray(res.content) && res.content[0]) {
								purchaseMasterData = res.content[0];
							}
						}
						
						if (onSuccess && purchaseMasterData) {
							onSuccess(purchaseMasterData as PurchaseMaster);
						}
						
						setIsCreated(true);
						toast.success('성공적으로 저장되었습니다.');
					},
					onError: (error) => {
						console.error('🔍 Create master error:', error);
						console.error('🔍 Error details:', JSON.stringify(error, null, 2));
						toast.error('저장 중 오류가 발생했습니다.');
					},
				}
			);
		}
	};

	return (
		<FormComponent
			title={tCommon('pages.purchaseOrder.register')}
			actionButtons={<OrderInfoActionButtons />}
		>
			<div className="max-w-full mx-auto">
				<DynamicForm
					onFormReady={handleFormReady}
					fields={vendorFormSchema}
					visibleSaveButton={false}
				/>
			</div>
		</FormComponent>
	);
};
