import { useRef, useState, useMemo, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import FormComponent from '@primes/components/form/FormComponent';
import { useIncomingMaster } from '@primes/hooks/purchase/incomingMaster/useIncomingMaster';
import { useIncomingMasterFieldQuery } from '@primes/hooks/purchase/incomingMaster/useIncomingMasterFieldQuery';
// import { useIncomingMasterListQuery } from '@primes/hooks/purchase/incomingMaster/useIncomingMasterListQuery';
import { useVendorFieldQuery } from '@primes/hooks/init/vendor/useVendorFieldQuery';
import { RadixButton } from '@radix-ui/components';
import { Check, RotateCw } from 'lucide-react';
import {
	CreateIncomingMasterPayload,
	UpdateIncomingMasterPayload,
	IncomingMaster,
} from '@primes/types/purchase/incomingMaster';
import { useTranslation } from '@repo/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PurchaseCodeSelectComponent } from '@primes/components/customSelect/PurchaseSelectComponent';

// Utility function to get today's date in 'YYYY-MM-DD' format
const getTodayDateString = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1).toString().padStart(2, '0');
	const day = today.getDate().toString().padStart(2, '0');

	return `${year}-${month}-${day}`;
};

interface IncomingOrdersRegisterFormProps {
	onSuccess?: (res: IncomingMaster) => void;
	onError?: (error: Error) => void;
	onReset?: () => void;
	masterData?: IncomingMaster & {
		incomingDate?: string;
		currencyUnit?: string;
	};
	isEditMode?: boolean;
	incomingMasterId?: number;
}

export const IncomingOrdersRegisterForm = (
	props: IncomingOrdersRegisterFormProps
) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const { onSuccess, onReset } = props;
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { create, update: updateMaster } = useIncomingMaster({
		page: 0,
		size: 30,
	});
	const [isCreated, setIsCreated] = useState(false);
	const [selectedPurchaseCode, setSelectedPurchaseCode] = useState<string>('');
	// const [isDuplicateChecking, setIsDuplicateChecking] = useState(false);
	// const [duplicateCheckCode, setDuplicateCheckCode] = useState<string>('');
	// const [shouldTriggerDuplicateCheck, setShouldTriggerDuplicateCheck] = useState(false);
	// const [isCheckCompleted, setIsCheckCompleted] = useState(false);
	
	// Get vendor names for select dropdown
	const { data: vendorNames, isLoading: vendorNamesLoading } = useVendorFieldQuery('compName');
	
	// Get incoming codes for select dropdown
	const { data: incomingCodes, isLoading: incomingCodesLoading } = useIncomingMasterFieldQuery('incomingCode');
	
	// Check for duplicate incoming code - only when explicitly triggered by user action
	// Create a conditional query that only executes when we have a valid search code
	// const shouldExecuteQuery = shouldTriggerDuplicateCheck && 
	// 	duplicateCheckCode && 
	// 	duplicateCheckCode.trim() !== '' && 
	// 	!props.isEditMode && 
	// 	!isCheckCompleted;
	
	// const { data: duplicateCheckResult, isLoading: isDuplicateLoading } = useIncomingMasterListQuery({
	// 	page: 0,
	// 	size: shouldExecuteQuery ? 1 : 0, // Set size to 0 when we don't want to execute
	// 	searchRequest: shouldExecuteQuery ? {
	// 		incomingCode: duplicateCheckCode,
	// 	} : {}, // Empty search request when not executing
	// });

	// Check if data is loading in edit mode
	const isDataLoading = props.isEditMode && (vendorNamesLoading || incomingCodesLoading);
	
	// Handle duplicate check result
	// useEffect(() => {
	// 	if (shouldExecuteQuery && duplicateCheckResult && !isDuplicateLoading) {
	// 		// Debug log to check API response structure
	// 		console.log('=== Duplicate Check Debug ===');
	// 		console.log('shouldExecuteQuery:', shouldExecuteQuery);
	// 		console.log('duplicateCheckCode:', duplicateCheckCode);
	// 		console.log('shouldTriggerDuplicateCheck:', shouldTriggerDuplicateCheck);
	// 		console.log('isCheckCompleted:', isCheckCompleted);
	// 		console.log('Duplicate check result:', duplicateCheckResult);
	// 		console.log('Content:', duplicateCheckResult.content);
	// 		console.log('Content length:', duplicateCheckResult.content?.length);
	// 		console.log('Total elements:', duplicateCheckResult.totalElements);
	// 		console.log('==============================');
	// 		
	// 		const hasDuplicate = duplicateCheckResult.content && 
	// 			Array.isArray(duplicateCheckResult.content) && 
	// 			duplicateCheckResult.content.length > 0 &&
	// 			duplicateCheckResult.totalElements > 0;
	// 		
	// 		if (hasDuplicate) {
	// 			const existingIncoming = duplicateCheckResult.content[0];
	// 			
	// 			// Show confirmation dialog to user
	// 			const shouldRedirect = window.confirm(
	// 				`해당 발주코드(${duplicateCheckCode})에 대한 입고 데이터가 이미 존재합니다.\n\n` +
	// 				`기존 입고 데이터(ID: ${existingIncoming.id})를 수정하시겠습니까?\n\n` +
	// 				`'확인'을 클릭하면 수정 페이지로 이동하고, '취소'를 클릭하면 현재 페이지에 남습니다.`
	// 			);
	// 			
	// 			// Reset the form and block further actions
	// 			if (formMethodsRef.current) {
	// 				formMethodsRef.current.setValue('purchaseCode', '');
	// 				formMethodsRef.current.setValue('incomingCode', '');
	// 			}
	// 			setSelectedPurchaseCode('');
	// 			setDuplicateCheckCode('');
	// 			setIsDuplicateChecking(false);
	// 			setShouldTriggerDuplicateCheck(false);
	// 			setIsCheckCompleted(true);
	// 			
	// 			// Redirect to edit page if user confirms
	// 			if (shouldRedirect) {
	// 				navigate(`/purchase/incoming/${existingIncoming.id}`);
	// 			}
	// 		} else {
	// 			setIsDuplicateChecking(false);
	// 			setShouldTriggerDuplicateCheck(false);
	// 			setIsCheckCompleted(true);
	// 		}
	// 	}
	// }, [shouldExecuteQuery, duplicateCheckResult, isDuplicateLoading]);

	const vendorFormSchema = useMemo(
		() => [
			// Show different field based on edit mode
			...(props.isEditMode ? [
				{
					name: 'incomingCode',
					label: t('columns.incomingCode'),
					type: 'text',
					placeholder: tCommon('pages.form.incomingCodePlaceholder'),
					required: true,
					defaultValue: props.masterData?.incomingCode || '',
					disabled: true, // Always readonly in edit mode
					readOnly: true,
				}
			] : [
			{
				name: 'purchaseCode',
				label: t('columns.purchaseCode'),
				type: 'purchaseCode',
				placeholder: tCommon('pages.form.purchaseCodePlaceholder'),
				required: true,
				defaultValue: '',
				disabled: isCreated,
				}
			]),
			{
				name: 'vendorName',
				label: t('columns.vendorName'),
				type: props.isEditMode ? 'text' : 'select',
				placeholder: tCommon('pages.form.vendorNamePlaceholder'),
				required: true,
				defaultValue: props.masterData?.vendorName || '',
				disabled: props.isEditMode ? true : isCreated, // Always disabled in edit mode
				readOnly: props.isEditMode ? true : false, // Always readonly in edit mode
				options: props.isEditMode ? [] : (Array.isArray(vendorNames) ? vendorNames
					.filter((vendor: any) => vendor.value && vendor.value.trim() !== '')
					.map((vendor: any, index: number) => ({
						label: vendor.value,
						value: vendor.id.toString(),
						vendorName: vendor.value,
						vendorId: vendor.id,
					})) : []),
			},
			{
				name: 'incomingDate',
				label: t('columns.incomingDate'),
				type: 'date',
				defaultValue:
					props.masterData?.incomingDate || getTodayDateString(),
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
				defaultValue: props.masterData?.currencyUnit || 'KRW',
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
				defaultValue: props.masterData?.isClose || 'false',
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
				defaultValue: props.masterData?.isApproval || 'false',
				required: true,
				disabled: isCreated,
			},
		],
		[t, props.masterData, props.isEditMode, isCreated, vendorNames, incomingCodes]
	);

	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
	};

	// Set form values when data is loaded in edit mode
	useEffect(() => {
		if (props.isEditMode && props.masterData && formMethodsRef.current && !isDataLoading) {
			const form = formMethodsRef.current;
			// Set basic values first
			form.setValue('incomingDate', props.masterData.incomingDate || getTodayDateString());
			form.setValue('currencyUnit', props.masterData.currencyUnit || 'KRW');
			
			// Set incoming code value (only for edit mode)
			if (props.masterData.incomingCode) {
				// Set the incoming code in the form
					form.setValue('incomingCode', props.masterData.incomingCode, { shouldValidate: true, shouldDirty: true });
				
				// Update the selected purchase code state for consistency
				setSelectedPurchaseCode(props.masterData.incomingCode);
			}
			
			// Set vendor name based on edit mode
			if (props.isEditMode) {
				// In edit mode, directly set the vendor name as text
				if (props.masterData.vendorName) {
					form.setValue('vendorName', props.masterData.vendorName, { shouldValidate: true, shouldDirty: true });
				}
			} else {
				// In create mode, find and set vendor ID for select dropdown
			if (props.masterData.vendorId && Array.isArray(vendorNames)) {
				const matchingVendor = vendorNames.find((vendor: any) => vendor.id === props.masterData?.vendorId);
				if (matchingVendor) {
					form.setValue('vendorName', matchingVendor.id.toString(), { shouldValidate: true, shouldDirty: true });
				}
			} else if (props.masterData.vendorName && Array.isArray(vendorNames)) {
				// Fallback: find by name if vendorId is not available
				const matchingVendor = vendorNames.find((vendor: any) => vendor.value === props.masterData?.vendorName);
				if (matchingVendor) {
					form.setValue('vendorName', matchingVendor.id.toString(), { shouldValidate: true, shouldDirty: true });
					}
				}
			}
			
			// Force form to re-render with new values
			form.trigger();
			
			// Clear validation errors after setting values
			setTimeout(() => {
				form.clearErrors(['incomingCode', 'vendorName']);
			}, 200);
		}
	}, [props.isEditMode, props.masterData, incomingCodes, vendorNames, isDataLoading]);

	const handleResetForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.reset();
			// Reset form fields to default values
			formMethodsRef.current.setValue(
				'incomingDate',
				getTodayDateString()
			);
			formMethodsRef.current.setValue('currencyUnit', 'KRW');
			setIsCreated(false);
			setSelectedPurchaseCode(''); // Reset selected purchase code
			// setDuplicateCheckCode(''); // Reset duplicate check code
			// setIsDuplicateChecking(false); // Reset duplicate checking state
			// setShouldTriggerDuplicateCheck(false); // Reset duplicate check trigger
			// setIsCheckCompleted(false); // Reset check completed state
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
					isCreated // || isDuplicateChecking || isDuplicateLoading
						? 'bg-gray-300 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-white'
				}`}
				onClick={handleSubmitForm}
				disabled={isCreated} // || isDuplicateChecking || isDuplicateLoading}
			>
				<Check
					size={16}
					className={isCreated ? 'text-gray-400' : 'text-white'} // || isDuplicateChecking || isDuplicateLoading ? 'text-gray-400' : 'text-white'}
				/>
				{tCommon('pages.form.save')} {/* isDuplicateChecking || isDuplicateLoading ? '중복검사중...' : tCommon('pages.form.save') */}
			</RadixButton>
		</div>
	);

	const CreateMasterData = (data: Record<string, unknown>) => {
		if (!formMethodsRef.current) return;
		
		// Block submission if duplicate check is in progress
		// if (isDuplicateChecking || isDuplicateLoading) {
		// 	toast.warning('발주코드 중복 검사 중입니다. 잠시 기다려주세요.');
		// 	return;
		// }

		if (props.isEditMode) {
			// Extract vendorId and vendorName from selected option
			const selectedVendorId = Number(data.vendorName) || 0;
			const selectedVendor = vendorNames?.find((vendor: any) => vendor.id === selectedVendorId);
			const vendorName = selectedVendor?.value || '';
			
			// Use selected purchase code as incoming code for update as well
			const incomingCodeToUse = selectedPurchaseCode || (data.incomingCode as string) || '';
			
			// Create update payload matching the provided API structure
			const updatePayload: Partial<UpdateIncomingMasterPayload> = {
				incomingCode: incomingCodeToUse,
				vendorId: selectedVendorId,
				vendorName: vendorName,
				incomingDate: (data.incomingDate as string) ?? '',
				currencyUnit: (data.currencyUnit as string) ?? '',
				isApproval: (data.isApproval as string) === 'true',
				approvalBy: (data.approvalBy as string) || '',
				approvalAt: (data.approvalAt as string) || '',
				isClose: (data.isClose as string) === 'true',
				closeBy: (data.closeBy as string) || '',
				closeAt: (data.closeAt as string) || '',
			};

			// Use the incomingMasterId prop or fallback to masterData.id
			const masterId =
				props.incomingMasterId || props.masterData?.id || 0;

			if (masterId === 0) {
				console.error('Incoming master ID is required for update');
				return;
			}

			updateMaster.mutate({
				id: masterId,
				data: updatePayload,
			}, {
				onSuccess: () => {
					// Invalidate and refetch queries to refresh data
					queryClient.invalidateQueries({
						queryKey: ['IncomingMaster', 'getById', masterId]
					});
					queryClient.invalidateQueries({
						queryKey: ['IncomingDetail', 'byMasterId', masterId]
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
			
			// Create new incoming with all required fields matching the provided API structure
			// Use selected purchase code as incoming code
			const incomingCodeToUse = selectedPurchaseCode || (data.incomingCode as string) || '';
			
			const createPayload: CreateIncomingMasterPayload = {
				incomingCode: incomingCodeToUse,
				vendorId: selectedVendorId,
				vendorName: vendorName,
				incomingDate: (data.incomingDate as string) ?? '',
				currencyUnit: (data.currencyUnit as string) ?? '',
				isApproval: (data.isApproval as string) === 'true',
				approvalBy: (data.approvalBy as string) || '',
				approvalAt: (data.approvalAt as string) || '',
				isClose: (data.isClose as string) === 'true',
				closeBy: (data.closeBy as string) || '',
				closeAt: (data.closeAt as string) || '',
			};

			create.mutate(
				{ data: createPayload },
				{
					onSuccess: (res) => {
						// Invalidate and refetch queries to refresh data
						queryClient.invalidateQueries({
							queryKey: ['IncomingMaster']
						});
						queryClient.invalidateQueries({
							queryKey: ['IncomingDetail']
						});
						
						if (onSuccess && res) {
							onSuccess(res);
						}
						setIsCreated(true);
						toast.success('성공적으로 저장되었습니다.');
					},
					onError: (error) => {
						toast.error('저장 중 오류가 발생했습니다.');
						console.error('Create master error:', error);
					},
				}
			);
		}
	};

	return (
		<FormComponent
			title={tCommon('pages.incoming.register')}
			actionButtons={<OrderInfoActionButtons />}
		>
			<div className="max-w-full mx-auto">
				<DynamicForm
					onFormReady={handleFormReady}
					fields={vendorFormSchema}
					visibleSaveButton={false}
					otherTypeElements={{
						// Only show purchase code component in create mode
						...(props.isEditMode ? {} : {
						purchaseCode: (props: any) => (
							<PurchaseCodeSelectComponent
								{...props}
								placeholder="구매코드를 선택하세요"
								disabled={isCreated}
																	onChange={(value) => {
									// Handle purchase code selection
									if (value && formMethodsRef.current) {
										// Get purchase code from selected value
										const purchaseCode = value.toString();
										
										// Reset check completed state for new search
										// setIsCheckCompleted(false);
										
										// Start duplicate check - explicitly trigger it
										// setIsDuplicateChecking(true);
										// setDuplicateCheckCode(purchaseCode);
										// setShouldTriggerDuplicateCheck(true);
										
										setSelectedPurchaseCode(purchaseCode);
										
										// Auto-populate incoming code field with selected purchase code
										formMethodsRef.current.setValue('incomingCode', purchaseCode);
									} else {
										// Clear states when no value selected
										setSelectedPurchaseCode('');
										// setDuplicateCheckCode('');
										// setIsDuplicateChecking(false);
										// setShouldTriggerDuplicateCheck(false);
										// setIsCheckCompleted(false);
									}
									// Call original onChange if provided
									if (props.onChange) {
										props.onChange(value);
									}
								}}
							/>
						),
						}),
					}}
				/>
			</div>
		</FormComponent>
	);
};
