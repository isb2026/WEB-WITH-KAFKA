import { useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DraggableDialog, RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { SalesDeliveryRegisterForm } from './SalesDeliveryRegisterForm';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { commaNumber, uncommaNumber } from '@repo/utils';
import { useDeliveryDetail } from '@primes/hooks/sales/deliveryDetail/useDeliveryDetail';
import { useDeliveryMaster } from '@primes/hooks/sales/deliveryMaster/useDeliveryMaster';
import { CreateDeliveryDetailPayload, DeliveryDetailItem } from '@primes/types/sales';
import { DeliveryDetail } from '@primes/types/sales/deliveryDetail';
import { useItem } from '@primes/hooks/init/item/useItem';
import { Item, ItemDto } from '@primes/types/item';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { DeliveryDetailRegisterActions } from '../components/DeliveryDetailRegisterActions';

import {
	deliveryDetailColumns,
	DataTableDataType,
	deliveryDetailFormSchema,
	deliveryDetailEditFormSchema,
} from '@primes/schemas/sales/deliveryDetailSchemas';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';

export const SalesDeliveryEditPage = () => {
	const { t } = useTranslation('common');
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const processedColumns = useDataTableColumns<DeliveryDetail>(
		deliveryDetailColumns
	);
	const [openModal, setOpenModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [selectedDetail, setSelectedDetail] =
		useState<DeliveryDetail | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDetailToDelete, setSelectedDetailToDelete] =
		useState<DataTableDataType | null>(null);

	// Add row feature state
	const [addRowData, setAddRowData] = useState<Record<string, unknown>[]>([]);
	const [triggerAddRow, setTriggerAddRow] = useState(false);
	const [triggerClearAddRow, setTriggerClearAddRow] = useState(false);

	const deliveryMasterId = parseInt(id || '0');

	// Add useGetDeliveryMasterById hook to get master data by ID
	const { list : deliveryMasterList } = useDeliveryMaster({
		page: 0,
		size: 55,
		searchRequest: {id: deliveryMasterId},
	});

	// Add useDeliveryDetail hook
	const {
		create,
		listByMasterId,
		update: updateDetail,
		remove,
	} = useDeliveryDetail({
		deliveryMasterId: deliveryMasterId,
		page: 0,
		size: 30,
	});

	// Add useItem hook for item selection
	const { list } = useItem({
		page: 0,
		size: 1000,
	});

	// Initialize useDataTable after getting the data
	const { table, toggleRowSelection, selectedRows } = useDataTable(
		listByMasterId.data?.content || [],
		processedColumns,
		30,
		1,
		0,
		40,
		() => {}
	);

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);

		// Watch for itemSelect changes to update hidden fields
		const subscription = methods.watch((value, { name }) => {
			if (name === 'itemSelect' && value.itemSelect) {
				const selectedItemValue = value.itemSelect as string;
				const selectedItem = list.data?.content?.find((item: ItemDto) => 
					`${item.itemNumber} - ${item.itemName}` === selectedItemValue
				);

				if (selectedItem) {
					methods.setValue('itemId', selectedItem.id);
					methods.setValue('itemNo', selectedItem.itemNo);
					methods.setValue('itemNumber', selectedItem.itemNumber);
					methods.setValue('itemName', selectedItem.itemName);
					methods.setValue('itemSpec', selectedItem.itemSpec || '');
				}
			}
		});

		return () => subscription.unsubscribe();
	};

	// Load master data when component mounts
	useEffect(() => {
		if (deliveryMasterId > 0) {
			// The query will automatically run when deliveryMasterId changes
		}
	}, [deliveryMasterId]);

	useEffect(() => {
		if (!formMethods) return;

		const subscription = formMethods.watch((value, info) => {
			if (info?.name === 'unitPrice' || info?.name === 'deliveryAmount') {
				const rawUnitPrice = value.unitPrice as string;
				const rawDeliveryAmount = value.deliveryAmount as string;

				const unitPrice = Number(uncommaNumber(rawUnitPrice ?? '')) || 0;
				const deliveryAmount = Number(uncommaNumber(rawDeliveryAmount ?? '')) || 0;
				
				// 공급가액 = 단가 * 1.1
				const netPrice = unitPrice * 1.1;
				// 총금액 = 납품 수량 * 공급가액
				const grossPrice = deliveryAmount * netPrice;

				// 현재 상태와 다를 때만 setValue 실행
				const prevNetPrice = formMethods.getValues('netPrice');
				const prevGrossPrice = formMethods.getValues('grossPrice');
				const formattedNetPrice = commaNumber(Math.round(netPrice));
				const formattedGrossPrice = commaNumber(Math.round(grossPrice));

				if (prevNetPrice !== formattedNetPrice || prevGrossPrice !== formattedGrossPrice) {
					formMethods.setValue('netPrice', formattedNetPrice);
					formMethods.setValue('grossPrice', formattedGrossPrice);
					formMethods.setValue('unitPrice', commaNumber(unitPrice));
					formMethods.setValue('deliveryAmount', commaNumber(deliveryAmount));
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [formMethods]);

	// Handle form submission for product add dialog
	const handleProductFormSubmit = (data: Record<string, unknown>) => {
		if (!deliveryMasterId) {
			console.error('Delivery master ID is required');
			return;
		}

		// Validate required fields - match with deliveryDetailFormSchema
		const requiredFields = [
			'itemName',
			'itemSpec',
			'deliveryAmount',
			'deliveryUnit',
			'currencyUnit',
			'unitPrice',
			'netPrice',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			return;
		}

		// Create payload matching the CreateDeliveryDetailPayload structure
		const payload: CreateDeliveryDetailPayload[] = [{
			deliveryMasterId: deliveryMasterId,
			itemId: Number(data.itemId) || 1,
			itemNo: Number(data.itemNo) || 1,
			itemNumber: (data.itemNumber as string) || '품번',
			itemName: (data.itemName as string) || '품명',
			itemSpec: (data.itemSpec as string) || '제품규격',
			deliveryUnit:
				(data.deliveryUnit as string)?.substring(0, 3) || '개',
			deliveryAmount: Number(data.deliveryAmount),
			currencyUnit: (data.currencyUnit as string) || 'KRW',
			unitPrice: Number(uncommaNumber(data.unitPrice as string)),
			netPrice: Number(uncommaNumber(data.netPrice as string)),
			grossPrice: Number(
				uncommaNumber(data.grossPrice as string)
			),
			memo: (data.memo as string) || '메모',
			vat: 0,
			
		}];

		create.mutate(payload, {
			onSuccess: () => {
				setOpenModal(false);
				if (formMethods) {
					formMethods.reset();
				}
			},
		});
	};

	// Handle edit form submission
	const handleEditFormSubmit = (data: Record<string, unknown>) => {
		if (!selectedDetail) {
			console.error('No detail selected for editing');
			return;
		}

		// Validate required fields - match with deliveryDetailEditFormSchema
		const requiredFields = [
			'itemNumber',
			'itemName',
			'itemSpec',
			'deliveryUnit',
			'deliveryAmount',
			'currencyUnit',
			'unitPrice',
			'netPrice',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			return;
		}

		// Create payload for updating delivery detail with array structure (matching register page)
		const payload = [
			{
				id: selectedDetail.id,
			deliveryMasterId: deliveryMasterId,
			itemId: Number(data.itemId) || 1,
			itemNo: Number(data.itemNo) || 1,
			itemNumber: (data.itemNumber as string) || '품번',
			itemName: (data.itemName as string) || '품명',
			itemSpec: (data.itemSpec as string) || '제품규격',
			deliveryUnit:
				(data.deliveryUnit as string)?.substring(0, 3) || '개',
			deliveryAmount: Number(data.deliveryAmount) || 1,
			currencyUnit: (data.currencyUnit as string) || 'KRW',
			unitPrice: Number(uncommaNumber(data.unitPrice as string)) || 0,
			netPrice: Number(uncommaNumber(data.netPrice as string)) || 0,
			grossPrice:
				Number(uncommaNumber(data.grossPrice as string)) || 0,
			memo: (data.memo as string) || '메모',
			vat: 0,
			},
		];

		updateDetail.mutate(
			{
				id: selectedDetail.id,
				data: payload,
			},
			{
				onSuccess: () => {
					setEditModal(false);
					setSelectedDetail(null);
					if (formMethods) {
						formMethods.reset();
					}
				},
			}
		);
	};

	const handleDeleteConfirm = () => {
		if (!selectedDetailToDelete) {
			console.error('No detail selected for deletion');
			return;
		}

		const detailId = selectedDetailToDelete.id;

		remove.mutate([detailId], {
			onSuccess: () => {
				setDeleteDialogOpen(false);
				setSelectedDetailToDelete(null);
			},
		});
	};

	// Action button handlers
	const handleAddClick = () => {
		setOpenModal(true);
	};

	const handleEditClick = (detail: DeliveryDetail) => {
		setSelectedDetail(detail);
		setEditModal(true);
	};

	const handleDeleteClick = (detail: DeliveryDetail) => {
		setSelectedDetailToDelete(detail);
		setDeleteDialogOpen(true);
	};

	// Add row feature handlers
	const handleAddRowClick = () => {
		setTriggerAddRow(true);
		setTimeout(() => setTriggerAddRow(false), 100);
	};

	// Handle save add rows
	const handleSaveAddRows = () => {
		// Check if there are any add rows to save
		if (addRowData.length === 0) {
			toast.warning('저장할 데이터가 없습니다.');
			return;
		}
		// Process the add row data
		processAddRowData(addRowData);
	};

	// Helper function to process add row data
	const processAddRowData = (dataToProcess: Record<string, unknown>[]) => {
		// Process all rows efficiently by only taking data from non-empty fields
		const processedRows = dataToProcess
			.map((rowData: Record<string, unknown>) => {
				// Helper function to safely extract values only if they exist
				const getValue = (key: string, defaultValue: any) => {
					const value = rowData[key];
					if (value === undefined || value === null || value === '') {
						return defaultValue;
					}
					return value;
				};

				// Helper function to safely convert to number
				const getNumberValue = (key: string, defaultValue: number) => {
					const value = getValue(key, defaultValue);
					const numValue = Number(value);
					return isNaN(numValue) ? defaultValue : numValue;
				};

				// Helper function to safely convert to string
				const getStringValue = (key: string, defaultValue: string) => {
					const value = getValue(key, defaultValue);
					return String(value).trim() || defaultValue;
				};

				// Build payload object with only existing data
				const payload = {
					deliveryMasterId: deliveryMasterId || 0,
					itemId: getNumberValue('itemId', 1),
					itemNo: getNumberValue('itemNo', 1),
					itemNumber: getStringValue('itemNumber', ''),
					itemName: getStringValue('itemName', ''),
					itemSpec: getStringValue('itemSpec', '제품규격'),
					deliveryUnit: getStringValue('deliveryUnit', 'KG'),
					deliveryAmount: getNumberValue('deliveryAmount', 0),
					currencyUnit: getStringValue('currencyUnit', 'USD'),
					unitPrice: getNumberValue('unitPrice', 0),
					netPrice: getNumberValue('netPrice', 0),
					grossPrice: getNumberValue('grossPrice', 0),
					memo: getStringValue('memo', '메모'),
					vat: getNumberValue('vat', 0),
				};

				// Check if this row has any meaningful data
				const hasMeaningfulData =
					payload.itemName !== '' ||
					payload.itemNumber !== '' ||
					payload.deliveryAmount > 0 ||
					payload.unitPrice > 0;

				return hasMeaningfulData ? payload : null;
			})
			.filter((row) => row !== null) as any[];

		if (processedRows.length === 0) {
			toast.warning(
				'저장할 데이터가 없습니다. 최소한 하나의 필드를 입력해주세요.'
			);
			return;
		}

		// Send single API request with all data - using plain array format
		create.mutate(processedRows as any, {
			onSuccess: () => {
				// Reset add row data to empty values but keep the rows
				setAddRowData((prev) => {
					if (prev.length === 0) return prev;
					// Return the same number of rows but with empty values
					return Array(prev.length).fill({});
				});

				// Trigger clearing of input fields in DataTableBody
				setTriggerClearAddRow(true);

				// Reset the trigger after a short delay
				setTimeout(() => {
					setTriggerClearAddRow(false);
				}, 100);
			},
			onError: (error) => {
				console.error('Error creating delivery details:', error);
				toast.error(`배송 상세 저장 중 오류가 발생했습니다.`);
			},
		});
	};

	const populateEditForm = (
		methods: UseFormReturn<Record<string, unknown>>,
		detail: DeliveryDetail
	) => {
		const defaultValues: Record<string, string | number> = {
			itemId: detail.id || '', // Use detail id as itemId
			itemNo: 1, // Default value
			itemNumber: detail.itemNumber || '',
			itemName: detail.itemName || '',
			itemSpec: detail.itemSpec || '',
			deliveryUnit: detail.deliveryUnit || 'KG',
			deliveryAmount: detail.deliveryAmount?.toString() || '',
			currencyUnit: detail.currencyUnit || 'USD',
			unitPrice: detail.unitPrice?.toString() || '',
			netPrice: detail.netPrice?.toString() || '',
			grossPrice: detail.grossPrice?.toString() || '',
			memo: detail.memo || '',
		};

		Object.entries(defaultValues).forEach(([key, value]) =>
			methods.setValue(key, value)
		);
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={(open: boolean) => {
					setOpenModal(open);
				}}
				title={t('pages.delivery.add')}
				content={
					<DynamicForm
						onFormReady={handleFormReady}
						fields={deliveryDetailFormSchema.map((field) => ({
							...field,
							disabled: create.isPending,
							options: field.name === 'itemSelect' 
								? list.data?.content?.map((item: ItemDto) => ({
									label: `${item.itemNumber} - ${item.itemName}${item.itemSpec ? ` (${item.itemSpec})` : ''}`,
									value: `${item.itemNumber} - ${item.itemName}`,
								})) || []
								: field.options,
						}))}
						onSubmit={handleProductFormSubmit}
						submitButtonText={
							create.isPending
								? t('pages.form.saving')
								: t('pages.form.save')
						}
						visibleSaveButton={true}
					/>
				}
			/>
			<DraggableDialog
				open={editModal}
				onOpenChange={(open: boolean) => {
					setEditModal(open);
					if (!open) {
						setSelectedDetail(null);
					}
				}}
				title={t('pages.delivery.modify')}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							handleFormReady(methods);
							if (selectedDetail && methods) {
								populateEditForm(methods, selectedDetail);
							}
						}}
						fields={deliveryDetailEditFormSchema.map((field) => ({
							...field,
							disabled: updateDetail.isPending,
							readOnly: field.name === 'itemNumber' || field.name === 'itemName' || field.name === 'itemSpec',
						}))}
						onSubmit={handleEditFormSubmit}
						submitButtonText={
							updateDetail.isPending
								? t('pages.form.modifying')
								: t('pages.form.modify')
						}
						visibleSaveButton={true}
					/>
				}
			/>
			<DeleteConfirmDialog
				isOpen={deleteDialogOpen}
				onOpenChange={(open) => setDeleteDialogOpen(open)}
				onConfirm={handleDeleteConfirm}
				isDeleting={remove.isPending}
				title={t('pages.delivery.detailDelete')}
				description={t('pages.delivery.detailDeleteConfirm')}
			/>
			<div className="max-w-full mx-auto p-4 h-full flex flex-col">
				<div className="flex justify-between items-center gap-2 mb-3">
					<RadixButton
						className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
						onClick={() => navigate(-1)}
					>
						<ArrowLeft
							size={16}
							className="text-muted-foreground"
						/>
						{t('pages.delivery.backToDelivery')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					<div className="border rounded-lg overflow-auto h-[calc(100vh-210px)]">
						<SalesDeliveryRegisterForm
							masterData={deliveryMasterList.data?.content?.[0]}
							isEditMode={true}
							deliveryMasterId={deliveryMasterId}
						/>
					</div>
					<div className="border rounded-lg overflow-hidden">
						<DatatableComponent
							columns={processedColumns}
							table={table}
							data={listByMasterId.data?.content || []}
							tableTitle={t('pages.delivery.deliveryInfo')}
							rowCount={listByMasterId.data?.totalElements || 0}
							defaultPageSize={30}
							actionButtons={
								<DeliveryDetailRegisterActions
									newDeliveryMasterId={deliveryMasterId}
									selectedRows={selectedRows}
									listByMasterId={listByMasterId}
									onAddClick={handleAddClick}
									onEditClick={handleEditClick}
									onDeleteClick={handleDeleteClick}
									onAddRowClick={handleAddRowClick}
									onSaveAddRows={handleSaveAddRows}
									hasAddRowData={addRowData.length > 0}
								/>
							}
							useSearch={true}
							toggleRowSelection={toggleRowSelection}
							selectedRows={selectedRows}
							headerOffset="220px"
							useAddRowFeature={true}
							triggerAddRow={triggerAddRow}
							triggerClearAddRow={triggerClearAddRow}
							onAddRow={(newRow) => {
								console.log('onAddRow called with:', newRow);
								// Store the new row data for later saving
								setAddRowData((prev) => {
									const newData = [...prev, newRow];
									console.log('Updated addRowData:', newData);
									return newData;
								});
							}}
							onAddRowDataChange={(data) => {
								console.log(
									'onAddRowDataChange called with:',
									data
								);
								// Update local state with current add row data
								setAddRowData(data);
							}}
						/>
					</div>
				</PageTemplate>
			</div>
		</>
	);
};

export default SalesDeliveryEditPage;
