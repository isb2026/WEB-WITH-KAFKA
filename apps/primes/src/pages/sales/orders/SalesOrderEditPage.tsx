import { useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DraggableDialog, RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { SalesOrderRegisterForm } from './SalesOrderRegisterForm';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { commaNumber, uncommaNumber } from '@repo/utils';
import { useOrderDetail } from '@primes/hooks/sales/orderDetail/useOrderDetail';
import { useOrderMaster } from '@primes/hooks/sales/orderMaster/useOrderMaster';
import { OrderDetail, OrderDetailItem } from '@primes/types/sales';
import { useItem } from '@primes/hooks/init/item/useItem';
import { Item, ItemDto } from '@primes/types/item';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { OrderDetailRegisterActions } from '../components/OrderDetailRegisterActions';

import {
	orderDetailColumns,
	orderDetailFormSchema,
	orderDetailEditFormSchema,
} from '@primes/schemas/sales/orderDetailSchemas';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';

export const SalesOrderEditPage = () => {
	const { t } = useTranslation('common');
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	// Add state to trigger add row feature
	const [triggerAddRow, setTriggerAddRow] = useState(false);

	// Add state to trigger clearing add row data
	const [triggerClearAddRow, setTriggerClearAddRow] = useState(false);

	// Add state to store add row data
	const [addRowData, setAddRowData] = useState<Record<string, unknown>[]>([]);

	// Add state to store current requestDate from the form
	const [currentRequestDate, setCurrentRequestDate] = useState<string>('');

	// Get today's date for default requestDate
	const getTodayDateString = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = (today.getMonth() + 1).toString().padStart(2, '0');
		const day = today.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	const processedColumns =
		useDataTableColumns<OrderDetail>(orderDetailColumns as any);
	const [openModal, setOpenModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [selectedDetail, setSelectedDetail] =
		useState<OrderDetail | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDetailToDelete, setSelectedDetailToDelete] =
		useState<OrderDetail | null>(null);

	const orderMasterId = parseInt(id || '0');

	const { list : orderMasterList } = useOrderMaster({
		page: 0,
		size: 30,
		searchRequest: {id: orderMasterId},
	});

	// Add useOrderDetail hook
	const { createDetail, listByMasterId, updateDetail, removeDetail } =
		useOrderDetail({
			orderMasterId: orderMasterId,
			page: 0,
			size: 30,
		});

	// Add useItems hook for item selection
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
			if (name === 'select' && value.select) {
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
		if (orderMasterId > 0) {
			// The query will automatically run when orderMasterId changes
		}
	}, [orderMasterId]);

	useEffect(() => {
		if (!formMethods) return;

		const subscription = formMethods.watch((value, info) => {
			if (info?.name === 'unitPrice' || info?.name === 'orderNumber') {
				const rawUnitPrice = value.unitPrice as string;
				const rawOrderNumber = value.orderNumber as string;

				const unitPrice = Number(uncommaNumber(rawUnitPrice ?? '')) || 0;
				const orderNumber = Number(uncommaNumber(rawOrderNumber ?? '')) || 0;
				
				// 공급가액 = 단가 * 1.1
				const netPrice = unitPrice * 1.1;
				// 총금액 = 주문 수량 * 공급가액
				const grossPrice = orderNumber * netPrice;

				// 현재 상태와 다를 때만 setValue 실행
				const prevNetPrice = formMethods.getValues('netPrice');
				const prevGrossPrice = formMethods.getValues('grossPrice');
				const formattedNetPrice = commaNumber(Math.round(netPrice));
				const formattedGrossPrice = commaNumber(Math.round(grossPrice));

				if (prevNetPrice !== formattedNetPrice || prevGrossPrice !== formattedGrossPrice) {
					formMethods.setValue('netPrice', formattedNetPrice);
					formMethods.setValue('grossPrice', formattedGrossPrice);
					formMethods.setValue('unitPrice', commaNumber(unitPrice));
					formMethods.setValue('orderNumber', commaNumber(orderNumber));
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [formMethods]);

	// Handle form submission for product add dialog
	const handleProductFormSubmit = (data: Record<string, unknown>) => {
		if (!orderMasterId) {
			console.error('Order master ID is required');
			return;
		}

		// Validate required fields
		const requiredFields = [
			'orderNumber',
			'orderUnit',
			'unitPrice',
			'netPrice',
			'requestDate',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			return;
		}

		// Create payload using array structure for consistency
		const payload = [
			{
				id: orderMasterId,
				itemId: 1,
				itemNo: 1,
				itemNumber: (data.itemNumber as string) || '',
				itemName: data.itemName as string,
				orderUnit: data.orderUnit as string,
				orderNumber: Number(data.orderNumber),
				currencyUnit: (data.currencyUnit as string) || 'KRW',
				unitPrice: Number(uncommaNumber(data.unitPrice as string)),
				netPrice: Number(uncommaNumber(data.netPrice as string)),
				grossPrice: Number(uncommaNumber(data.grossPrice as string)),
				requestDate: data.requestDate as string,
			},
		];

		// Cast to any to bypass type checking since we're using the array structure
		createDetail.mutate(payload as any, {
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

		// Validate required fields
		const requiredFields = [
			'itemNumber',
			'itemName',
			'orderNumber',
			'orderUnit',
			'unitPrice',
			'netPrice',
			'requestDate',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			return;
		}

		// Create payload for updating order detail with plain object structure
		const payload: OrderDetailItem = {
			orderMasterId: orderMasterId,
			itemId: 1,
			itemNo: 1,
			itemNumber: (data.itemNumber as string) || '품번',
			itemName: (data.itemName as string) || '품명',
			vat: 1,
			orderUnit: data.orderUnit as string,
			orderNumber: Number(data.orderNumber),
			currencyUnit: 'KRW',
			unitPrice: Number(uncommaNumber(data.unitPrice as string)),
			netPrice: Number(uncommaNumber(data.netPrice as string)),
			grossPrice: Number(uncommaNumber(data.grossPrice as string)),
			requestDate: data.requestDate as string,
			isUse: true,
		};

		const detailId = selectedDetail.id;
		updateDetail.mutate(
			{
				id: detailId,
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

		removeDetail.mutate([detailId], {
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

	const handleEditClick = (detail: OrderDetail) => {
		setSelectedDetail(detail);
		setEditModal(true);
	};

	const handleDeleteClick = (detail: OrderDetail) => {
		setSelectedDetailToDelete(detail);
		setDeleteDialogOpen(true);
	};

	const populateEditForm = (
		methods: UseFormReturn<Record<string, unknown>>,
		detail: OrderDetail
	) => {
		const defaultValues: Record<string, string | number> = {
			itemNumber: detail.itemNumber,
			itemName: detail.itemName,
			requestDate: detail.requestDate,
			orderNumber: detail.orderNumber.toString(),
			orderUnit: detail.orderUnit || '개', // Default value
			unitPrice: detail.unitPrice.toString(),
			netPrice: detail.netPrice.toString(),
			grossPrice: detail.grossPrice.toString(),
		};

		Object.entries(defaultValues).forEach(([key, value]) =>
			methods.setValue(key, value)
		);
	};

	const handleAddRowClick = () => {
		// Trigger the add row feature by setting the state
		setTriggerAddRow(true);
		// Reset after a short delay to allow the effect to trigger
		setTimeout(() => setTriggerAddRow(false), 100);
	};

	// Handle save add rows
	const handleSaveAddRows = () => {
		// Check if there are any add rows to save
		if (addRowData.length === 0) {
			toast.warning('저장할 데이터가 없습니다.');
			return;
		}
		console.log('addRowData', addRowData);
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
					orderMasterId: orderMasterId || 0,
					itemId: getNumberValue('itemId', 1),
					itemNo: getNumberValue('itemNo', 1),
					itemNumber: getStringValue('itemNumber', ''),
					itemName: getStringValue('itemName', ''),
					orderUnit: getStringValue('orderUnit', ''),
					orderNumber: getNumberValue('orderNumber', 0),
					currencyUnit: getStringValue('currencyUnit', 'KRW'),
					unitPrice: getNumberValue('unitPrice', 0),
					netPrice: getNumberValue('netPrice', 0),
					grossPrice: getNumberValue('grossPrice', 0),
					requestDate: getStringValue('requestDate', ''),
				};

				// Check if this row has any meaningful data
				const hasMeaningfulData =
					payload.itemName !== '' ||
					payload.itemNumber !== '' ||
					payload.orderNumber > 0 ||
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

		const payload = processedRows;

		// Send single API request with all data
		createDetail.mutate(payload as any, {
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
				console.error('Error creating order details:', error);
				toast.error(`주문 상세 저장 중 오류가 발생했습니다.`);
			},
		});
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={(open: boolean) => {
					setOpenModal(open);
				}}
				title={t('pages.order.add')}
				content={
					<DynamicForm
						onFormReady={handleFormReady}
						fields={orderDetailFormSchema.map((field) => ({
							...field,
							disabled: createDetail.isPending,
							options: field.name === 'select' 
								? list.data?.content?.map((item: ItemDto) => ({
									label: `${item.itemNumber} - ${item.itemName}${item.itemSpec ? ` (${item.itemSpec})` : ''}`,
									value: `${item.itemNumber} - ${item.itemName}`,
								})) || []
								: field.options,
						}))}
						onSubmit={handleProductFormSubmit}
						submitButtonText={
							createDetail.isPending
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
				title={t('pages.order.modify')}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							handleFormReady(methods);
							if (selectedDetail && methods) {
								populateEditForm(methods, selectedDetail);
							}
						}}
						fields={orderDetailEditFormSchema.map((field) => ({
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
				isDeleting={removeDetail.isPending}
				title={t('pages.order.detailDelete')}
				description={t('pages.order.detailDeleteConfirm')}
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
						{t('pages.order.backToOrder')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					<div className="border rounded-lg overflow-auto h-[calc(100vh-210px)]">
						<SalesOrderRegisterForm
							masterData={orderMasterList.data?.content?.[0]}
							isEditMode={true}
							orderMasterId={orderMasterId}
							onRequestDateChange={(requestDate: string) => {
								setCurrentRequestDate(requestDate);
							}}
						/>
					</div>
					<div className="border rounded-lg overflow-hidden">
						<DatatableComponent
							columns={processedColumns}
							table={table}
							data={listByMasterId.data?.content || []}
							tableTitle={t('pages.order.orderInfo')}
							rowCount={listByMasterId.data?.content?.length || 0}
							defaultPageSize={30}
							actionButtons={
								<OrderDetailRegisterActions
									newOrderMasterId={orderMasterId}
									selectedRows={selectedRows}
									listByMasterId={listByMasterId.data?.content || []}
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
							defaultRowValues={{
								requestDate: currentRequestDate || getTodayDateString(),
							}}
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

export default SalesOrderEditPage;
