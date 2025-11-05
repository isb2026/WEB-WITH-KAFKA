import { useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DraggableDialog, RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { PurchaseOrdersRegisterForm } from './PurchaseOrdersRegisterForm';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { commaNumber, uncommaNumber } from '@repo/utils';
import { usePurchaseDetail } from '@primes/hooks/purchase/purchaseDetail/usePurchaseDetail';
import { useGetPurchaseMasterById } from '@primes/hooks/purchase/purchaseMaster/useGetPurchaseMasterById';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { PurchaseDetail } from '@primes/types/purchase/purchaseDetail';
import {
	usePurchaseDetailColumns,
	PurchaseDataTableDataType,
	purchaseDetailFormSchema,
	purchaseDetailEditFormSchema,
} from '@primes/schemas/purchase/purchaseDetailSchemas';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ItemSelectComponent } from '@primes/components/customSelect/ItemSelectComponent';
import { useItemFieldQuery } from '@primes/hooks/init/item/useItemFieldQuery';
import PurchaseOrdersDetailRegisterActions from '../components/PurchaseOrdersDetailRegisterActions';

export const PurchaseOrdersEditPage = () => {
	const { t } = useTranslation('common');
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const purchaseDetailColumns = usePurchaseDetailColumns();
	const processedColumns = useDataTableColumns<PurchaseDataTableDataType>(
		purchaseDetailColumns
	);
	const [openModal, setOpenModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [selectedDetail, setSelectedDetail] = useState<PurchaseDetail | null>(
		null
	);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDetailToDelete, setSelectedDetailToDelete] =
		useState<PurchaseDetail | null>(null);

	// Add state to trigger add row feature
	const [triggerAddRow, setTriggerAddRow] = useState(false);

	// Add state to trigger clearing add row data
	const [triggerClearAddRow, setTriggerClearAddRow] = useState(false);

	// Add state to store add row data
	const [addRowData, setAddRowData] = useState<Record<string, unknown>[]>([]);
	
	// Add state for item search modal
	const [itemSearchModalOpen, setItemSearchModalOpen] = useState(false);
	const [currentEditingRowIndex, setCurrentEditingRowIndex] = useState<number | null>(null);
	const [currentEditingField, setCurrentEditingField] = useState<string | null>(null);

	const purchaseMasterId = parseInt(id || '0');

	// Add useGetPurchaseMasterById hook to get master data by ID
	const getById = useGetPurchaseMasterById(purchaseMasterId, 0, 30);

	// Get master data for requestDate binding
	const masterData = getById.data?.content[0];

	// Add usePurchaseDetail hook
	const {
		create,
		listByMasterId,
		update: updateDetail,
		remove,
	} = usePurchaseDetail({
		purchaseMasterId: purchaseMasterId,
		page: 0,
		size: 30,
	});

	// Add useItem hook to get item details
	const { data: itemList } = useItemFieldQuery('itemName', { isUse: true });

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
	};

	// Load master data when component mounts
	useEffect(() => {
		if (purchaseMasterId > 0) {
			// The query will automatically run when purchaseMasterId changes
		}
	}, [purchaseMasterId]);

	useEffect(() => {
		if (!formMethods) return;

		const subscription = formMethods.watch((value, info) => {
			if (info?.name === 'unitPrice' || info?.name === 'number') {
				const rawUnit = value.unitPrice as string;
				const rawNumber = value.number as string;

				const unit = Number(uncommaNumber(rawUnit ?? '')) || 0;
				const number = Number(uncommaNumber(rawNumber ?? '')) || 0;
				const netTotal = unit * number; // quantity × unit price = net price
				const grossTotal = unit * number; // Keep existing gross price calculation

				// 현재 상태와 다를 때만 setValue 실행
				const prevNet = formMethods.getValues('netPrice');
				const prevGross = formMethods.getValues('grossPrice');
				const formattedNetTotal = commaNumber(netTotal);
				const formattedGrossTotal = commaNumber(grossTotal);

				if (prevNet !== formattedNetTotal) {
					formMethods.setValue('netPrice', formattedNetTotal);
				}
				if (prevGross !== formattedGrossTotal) {
					formMethods.setValue('grossPrice', formattedGrossTotal);
				}
				formMethods.setValue('unitPrice', commaNumber(unit));
				formMethods.setValue('number', commaNumber(number));
			}
		});

		return () => subscription.unsubscribe();
	}, [formMethods]);

	// Handle form submission for product add dialog
	const handleProductFormSubmit = (data: Record<string, unknown>) => {
		if (!purchaseMasterId) {
			console.error('Purchase master ID is required');
			return;
		}

		// Validate required fields - only API fields
		const requiredFields = [
			'unit',
			'number',
			'currencyUnit',
			'unitPrice',
			'netPrice',
			'requestDate',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			return;
		}

		// Extract itemId and itemNo from the value
		const itemId = Number(data.itemId) || 0;
		const itemNo = Number(data.itemNo) || 0;

		// Create payload matching the required structure
		const payload = {
			dataList: [
				{
					purchaseMasterId: purchaseMasterId,
					itemId: itemId,
					itemNo: itemNo,
					itemNumber: (data.itemNumber as string) || '',
					itemName: (data.itemName as string) || '',
					itemSpec: (data.itemSpec as string) || '',
					unit: (data.unit as string)?.substring(0, 3) || '',
					number: Number(uncommaNumber(data.number as string)) || 0,
					currencyUnit: (data.currencyUnit as string) || '',
					unitPrice:
						Number(uncommaNumber(data.unitPrice as string)) || 0,
					netPrice:
						Number(uncommaNumber(data.netPrice as string)) || 0,
					grossPrice:
						Number(uncommaNumber(data.grossPrice as string)) || 0,
					requestDate:
						masterData?.requestDate || (data.requestDate as string),
					vat: 0,
				},
			],
		};

		create.mutate(
			{ data: payload },
			{
				onSuccess: () => {
					// Invalidate and refetch queries to refresh data
					queryClient.invalidateQueries({
						queryKey: [
							'PurchaseDetail',
							'byMasterId',
							purchaseMasterId,
						],
					});
					queryClient.invalidateQueries({
						queryKey: [
							'PurchaseMaster',
							'getById',
							purchaseMasterId,
						],
					});

					setOpenModal(false);
					if (formMethods) {
						formMethods.reset();
					}
					toast.success('성공적으로 저장되었습니다.');
				},
				onError: (error) => {
					toast.error('저장 중 오류가 발생했습니다.');
					console.error('Create error:', error);
				},
			}
		);
	};

	// Handle edit form submission
	const handleEditFormSubmit = (data: Record<string, unknown>) => {
		if (!selectedDetail) {
			console.error('No detail selected for editing');
			return;
		}

		// Validate required fields - only API fields
		const requiredFields = [
			'unit',
			'number',
			'currencyUnit',
			'unitPrice',
			'netPrice',
			'requestDate',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			return;
		}

		// Extract itemId and itemNo from the value
		const itemId = Number(data.itemId) || selectedDetail.itemId || 1;
		const itemNo = Number(data.itemNo) || selectedDetail.itemNo || 1;

		// Get item details from the item list
		const itemDetails = findItemById(itemId);

		// Create payload for updating purchase detail
		const payload = {
			id: selectedDetail.id,
			data: {
				purchaseMasterId: purchaseMasterId || 0,
				itemId: itemId,
				itemNo: itemNo,
				itemNumber:
					(data.itemNumber as string) ||
					itemDetails?.itemNumber ||
					selectedDetail.itemNumber ||
					'',
				itemName:
					(data.itemName as string) ||
					itemDetails?.itemName ||
					selectedDetail.itemName ||
					'',
				itemSpec:
					(data.itemSpec as string) ||
					itemDetails?.itemSpec ||
					selectedDetail.itemSpec ||
					'',
				unit: (data.unit as string)?.substring(0, 3) || 'EA',
				number: Number(uncommaNumber(data.number as string)) || 1,
				currencyUnit: (data.currencyUnit as string) || 'KRW',
				unitPrice: Number(uncommaNumber(data.unitPrice as string)) || 0,
				netPrice: Number(uncommaNumber(data.netPrice as string)) || 0,
				grossPrice:
					Number(uncommaNumber(data.grossPrice as string)) || 0,
				requestDate:
					masterData?.requestDate || (data.requestDate as string),
				vat: 0,
			},
		};

		updateDetail.mutate(payload, {
			onSuccess: () => {
				// Invalidate and refetch queries to refresh data
				queryClient.invalidateQueries({
					queryKey: [
						'PurchaseDetail',
						'byMasterId',
						purchaseMasterId,
					],
				});
				queryClient.invalidateQueries({
					queryKey: ['PurchaseMaster', 'getById', purchaseMasterId],
				});

				setEditModal(false);
				setSelectedDetail(null);
				if (formMethods) {
					formMethods.reset();
				}
				toast.success('성공적으로 수정되었습니다.');
			},
			onError: (error) => {
				toast.error('수정 중 오류가 발생했습니다.');
				console.error('Update error:', error);
			},
		});
	};

	const handleDeleteConfirm = () => {
		if (!selectedDetailToDelete) {
			console.error('No detail selected for deletion');
			return;
		}

		const detailId = selectedDetailToDelete.id;

		remove.mutate(
			{ ids: [detailId] },
			{
				onSuccess: () => {
					// Invalidate and refetch queries to refresh data
					queryClient.invalidateQueries({
						queryKey: [
							'PurchaseDetail',
							'byMasterId',
							purchaseMasterId,
						],
					});
					queryClient.invalidateQueries({
						queryKey: [
							'PurchaseMaster',
							'getById',
							purchaseMasterId,
						],
					});

					setDeleteDialogOpen(false);
					setSelectedDetailToDelete(null);
					toast.success('성공적으로 삭제되었습니다.');
				},
				onError: (error) => {
					toast.error('삭제 중 오류가 발생했습니다.');
					console.error('Delete error:', error);
				},
			}
		);
	};

	// Action button handlers
	const handleAddClick = () => {
		setOpenModal(true);
	};

	const handleEditClick = (detail: PurchaseDetail) => {
		setSelectedDetail(detail);
		setEditModal(true);
	};

	const handleDeleteClick = (detail: PurchaseDetail) => {
		setSelectedDetailToDelete(detail);
		setDeleteDialogOpen(true);
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
		// Process the add row data
		processAddRowData(addRowData);
	};

	// Helper function to process add row data
	const processAddRowData = (dataToProcess: Record<string, unknown>[]) => {
		// Filter out rows with zero quantity and transform the data to match the API structure
		const validData = dataToProcess.filter((item) => {
			const quantity = Number(uncommaNumber(item.number as string)) || 0;
			return quantity > 0; // Only include rows with quantity greater than 0
		});

		// If no valid data, show warning and return
		if (validData.length === 0) {
			toast.warning('발주수량이 0보다 큰 행만 저장됩니다.');
			return;
		}

		const payload = {
			dataList: validData.map((item) => {
				// Extract itemId and itemNo from the value
				const itemId = Number(item.itemId) || 0;
				const itemNo = Number(item.itemNo) || 0;
				
				return {
					purchaseMasterId: purchaseMasterId,
					itemId: itemId,
					itemNo: itemNo,
					itemNumber: (item.itemNumber as string) || '',
					itemName: (item.itemName as string) || '',
					itemSpec: (item.itemSpec as string) || '',
					unit: (item.unit as string)?.substring(0, 3) || '',
					number: Number(uncommaNumber(item.number as string)) || 0,
					currencyUnit: (item.currencyUnit as string) || '',
					unitPrice:
						Number(uncommaNumber(item.unitPrice as string)) || 0,
					netPrice:
						Number(uncommaNumber(item.netPrice as string)) || 0,
					grossPrice:
						Number(uncommaNumber(item.grossPrice as string)) || 0,
					requestDate:
						masterData?.requestDate || (item.requestDate as string),
					vat: 0,
				};
			}),
		};

		create.mutate(
			{ data: payload },
			{
				onSuccess: () => {
					// Invalidate and refetch queries to refresh data
					queryClient.invalidateQueries({
						queryKey: [
							'PurchaseDetail',
							'byMasterId',
							purchaseMasterId,
						],
					});
					queryClient.invalidateQueries({
						queryKey: [
							'PurchaseMaster',
							'getById',
							purchaseMasterId,
						],
					});

					const savedCount = validData.length;
					const totalCount = dataToProcess.length;
					const skippedCount = totalCount - savedCount;
					
					if (skippedCount > 0) {
						toast.success(`${savedCount}개 행이 저장되었습니다.`);
					} else {
						toast.success('성공적으로 저장되었습니다.');
					}
					
					// Clear the add row data after successful save
					setAddRowData([]);
					setTriggerClearAddRow(true);
					setTimeout(() => setTriggerClearAddRow(false), 100);
				},
				onError: (error) => {
					toast.error('저장 중 오류가 발생했습니다.');
					console.error('Add row save error:', error);
				},
			}
		);
	};

	// Helper function to find item by itemId
	const findItemById = (itemId: number) => {
		if (!itemList.data?.content) return null;
		return itemList.data.content.find((item: any) => item.id === itemId);
	};

	const populateEditForm = (
		methods: UseFormReturn<Record<string, unknown>>,
		detail: PurchaseDetail
	) => {
		// Find item details using itemId
		const itemDetails = findItemById(detail.itemId || 1);

		const defaultValues = {
			itemId: detail.itemId || 0,
			itemNo: detail.itemNo || 0,
			itemName: itemDetails?.itemName || detail.itemName || '',
			itemNumber: itemDetails?.itemNumber || detail.itemNumber || '',
			itemSpec: itemDetails?.itemSpec || detail.itemSpec || '',
			unit: detail.unit || '',
			number: detail.number?.toString() || '0',
			currencyUnit: detail.currencyUnit || '',
			unitPrice: detail.unitPrice?.toString() || '0',
			netPrice: detail.netPrice?.toString() || '0',
			grossPrice: detail.grossPrice?.toString() || '0',
			requestDate: masterData?.requestDate || detail.requestDate || '',
		};

		methods.reset(defaultValues);
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={(open: boolean) => {
					setOpenModal(open);
				}}
				title={t('pages.purchase.add')}
				content={
					<DynamicForm
						onFormReady={handleFormReady}
						fields={purchaseDetailFormSchema().map((field) => ({
							...field,
							disabled: create.isPending,
							...(field.name === 'requestDate' && {
								defaultValue: masterData?.requestDate || '',
								disabled: true,
								readOnly: true,
							}),
						}))}
						onSubmit={handleProductFormSubmit}
						submitButtonText={
							create.isPending
								? t('pages.form.saving')
								: t('pages.form.save')
						}
						visibleSaveButton={true}
						otherTypeElements={{
							itemId: (props: any) => (
								<ItemSelectComponent
									{...props}
									placeholder="품목을 선택하세요"
									disabled={create.isPending}
									onItemDataChange={(itemData: {
										itemId: number;
										itemNo?: string;
										itemNumber?: string;
										itemName?: string;
										itemSpec?: string;
									}) => {
										const {
											itemId,
											itemNo,
											itemName,
											itemNumber,
											itemSpec,
										} = itemData;
										formMethodsRef.current?.setValue(
											'itemId',
											itemId
										);
										formMethodsRef.current?.setValue(
											'itemNo',
											Number(itemNo)
										);
										if (itemName)
											formMethodsRef.current?.setValue(
												'itemName',
												itemName
											);
										if (itemNumber)
											formMethodsRef.current?.setValue(
												'itemNumber',
												itemNumber
											);
										if (itemSpec)
											formMethodsRef.current?.setValue(
												'itemSpec',
												itemSpec
											);
									}}
								/>
							),
						}}
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
				title={t('pages.purchaseOrder.edit')}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							handleFormReady(methods);
							if (selectedDetail && methods) {
								populateEditForm(methods, selectedDetail);
							}
						}}
						fields={purchaseDetailEditFormSchema().map((field) => ({
							...field,
							disabled: updateDetail.isPending,
							...(field.name === 'requestDate' && {
								defaultValue: masterData?.requestDate || '',
								disabled: true,
								readOnly: true,
							}),
						}))}
						onSubmit={handleEditFormSubmit}
						submitButtonText={
							updateDetail.isPending
								? t('pages.form.modifying')
								: t('pages.form.modify')
						}
						visibleSaveButton={true}
						otherTypeElements={{
							itemId: (props: any) => (
								<ItemSelectComponent
									{...props}
									placeholder="품목을 선택하세요"
									disabled={updateDetail.isPending}
									onItemDataChange={(itemData: {
										itemId: number;
										itemNo?: string;
										itemNumber?: string;
										itemName?: string;
										itemSpec?: string;
									}) => {
										const {
											itemId,
											itemNo,
											itemName,
											itemNumber,
											itemSpec,
										} = itemData;
										formMethodsRef.current?.setValue(
											'itemId',
											itemId
										);
										formMethodsRef.current?.setValue(
											'itemNo',
											Number(itemNo)
										);
										if (itemName)
											formMethodsRef.current?.setValue(
												'itemName',
												itemName
											);
										if (itemNumber)
											formMethodsRef.current?.setValue(
												'itemNumber',
												itemNumber
											);
										if (itemSpec)
											formMethodsRef.current?.setValue(
												'itemSpec',
												itemSpec
											);
									}}
								/>
							),
						}}
					/>
				}
			/>
			<DeleteConfirmDialog
				isOpen={deleteDialogOpen}
				onOpenChange={(open) => setDeleteDialogOpen(open)}
				onConfirm={handleDeleteConfirm}
				isDeleting={remove.isPending}
				title={t('pages.purchase.detailDelete')}
				description={t('pages.purchase.detailDeleteConfirm')}
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
						{t('pages.purchase.backToPurchase')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					<div className="border rounded-lg overflow-auto h-[calc(100vh-210px)]">
						{getById.isLoading ? (
							<div className="flex items-center justify-center h-full">
								<div className="text-lg">
									Loading purchase data...
								</div>
							</div>
						) : getById.error ? (
							<div className="flex items-center justify-center h-full">
								<div className="text-lg text-red-500">
									Error loading purchase data:{' '}
									{getById.error.message}
								</div>
							</div>
						) : (
							<PurchaseOrdersRegisterForm
								isEditMode={true}
								masterData={getById.data?.content?.[0]}
								purchaseMasterId={purchaseMasterId}
								onRequestDateChange={(requestDate: string) => {
									// Update the detail form if it's open
									if (formMethodsRef.current) {
										formMethodsRef.current.setValue(
											'requestDate',
											requestDate
										);
									}
								}}
							/>
						)}
					</div>
					<div className="border rounded-lg overflow-hidden">
						{listByMasterId.isLoading ? (
							<div className="flex items-center justify-center h-64">
								<div className="text-lg">
									Loading detail data...
								</div>
							</div>
						) : listByMasterId.error ? (
							<div className="flex items-center justify-center h-64">
								<div className="text-lg text-red-500">
									Error loading detail data:{' '}
									{listByMasterId.error.message}
								</div>
							</div>
						) : (
							<DatatableComponent
								columns={processedColumns}
								table={table}
								data={listByMasterId.data?.content || []}
								tableTitle={t('pages.purchase.detailInfo')}
								rowCount={
									listByMasterId.data?.totalElements || 0
								}
								defaultPageSize={30}
								actionButtons={
									<PurchaseOrdersDetailRegisterActions
										newPurchaseMasterId={purchaseMasterId}
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
								defaultRowValues={{
									requestDate: masterData?.requestDate || '',
									unit: 'T',
									currencyUnit: 'KRW',
									netPrice: '0',
									grossPrice: '0',
									unitPrice: '0',
									number: '0',
								}}
								columnFieldTypes={{
									requestDate: {
										type: 'date',
									},
									itemId: {
										type: 'text',
									},
									itemNumber: {
										type: 'text',
									},
									itemName: {
										type: 'text',
									},
									itemSpec: {
										type: 'text',
									},
									unit: {
										type: 'select',
										options: [
											{ label: 'T', value: 'T' },
											{ label: 'KG', value: 'KG' },
											{ label: 'EA', value: 'EA' },
										],
									},
									number: {
										type: 'text',
										align: 'right',
									},
									unitPrice: {
										type: 'text',
										align: 'right',
									},
									netPrice: {
										type: 'text',
										align: 'right',
									},
									grossPrice: {
										type: 'text',
										align: 'right',
									},
									currencyUnit: {
										type: 'select',
										options: [
											{ label: 'KRW', value: 'KRW' },
											{ label: 'USD', value: 'USD' },
										],
									},
								}}
								onAddRow={(newRow) => {
									// Store the new row data for later saving
									setAddRowData((prev) => {
										const newData = [
											...prev,
											newRow,
										];
										return newData;
									});
								}}
								onAddRowDataChange={(data) => {
									// Update local state with current add row data
									setAddRowData(data);
								}}
							/>
						)}
					</div>
				</PageTemplate>
			</div>
		</>
	);
};

export default PurchaseOrdersEditPage;
