import { useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DraggableDialog, RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { PurchaseOrdersRegisterForm } from './PurchaseOrdersRegisterForm';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { commaNumber, uncommaNumber } from '@repo/utils';
import { usePurchaseDetail } from '@primes/hooks/purchase/purchaseDetail/usePurchaseDetail';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { PurchaseOrdersDetailRegisterActions } from '@primes/pages/purchase/components/PurchaseOrdersDetailRegisterActions';
import { PurchaseMaster } from '@primes/types/purchase/purchaseMaster';
import { PurchaseDetail } from '@primes/types/purchase/purchaseDetail';
import {
	usePurchaseDetailColumns,
	PurchaseDataTableDataType,
	purchaseDetailFormSchema,
	purchaseDetailEditFormSchema,
} from '@primes/schemas/purchase/purchaseDetailSchemas';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';
import { ItemSelectComponent } from '@primes/components/customSelect/ItemSelectComponent';
import { useItemFieldQuery } from '@primes/hooks/init/item/useItemFieldQuery';

export const PurchaseOrdersRegisterPage = () => {
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const purchaseDetailColumns = usePurchaseDetailColumns();
	const navigate = useNavigate();
	const processedColumns = useDataTableColumns<PurchaseDataTableDataType>(
		purchaseDetailColumns
	);
	const [openModal, setOpenModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [selectedDetail, setSelectedDetail] = useState<PurchaseDetail | null>(
		null
	);
	const [newPurchaseMasterId, setNewPurchaseMasterId] = useState<
		number | null
	>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDetailToDelete, setSelectedDetailToDelete] =
		useState<PurchaseDetail | null>(null);
	const [purchaseMasterCreated, setPurchaseMasterCreated] = useState(false);

	const [masterFormData, setMasterFormData] = useState<PurchaseMaster | null>(
		null
	);
	const [triggerAddRow, setTriggerAddRow] = useState(false);
	const [triggerClearAddRow, setTriggerClearAddRow] = useState(false);
	const [addRowData, setAddRowData] = useState<Record<string, unknown>[]>([]);

	const { create, listByMasterId, update, remove } = usePurchaseDetail({
		purchaseMasterId: newPurchaseMasterId || 0,
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

	useEffect(() => {
		if (!formMethods) return;

		const subscription = formMethods.watch((value, info) => {
			if (info?.name === 'unitPrice' || info?.name === 'number') {
				const rawUnit = value.unitPrice as string;
				const rawNumber = value.number as string;

				const unit = Number(uncommaNumber(rawUnit ?? '')) || 0;
				const number = Number(uncommaNumber(rawNumber ?? '')) || 0;
				const netTotal = unit * number;
				const grossTotal = unit * number;

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

	// Update requestDate when masterFormData changes
	useEffect(() => {
		if (formMethods && masterFormData?.requestDate) {
			formMethods.setValue('requestDate', masterFormData.requestDate);
		}
	}, [formMethods, masterFormData?.requestDate]);

	// Handle form submission for product add dialog
	const handleProductFormSubmit = (data: Record<string, unknown>) => {
		if (!newPurchaseMasterId) {
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

		const itemId = Number(data.itemId);
		const itemNo = Number(data.itemNo);

		// Create payload matching the required structure
		const payload = {
			dataList: [
				{
					purchaseMasterId: newPurchaseMasterId || 1,
					itemId: itemId,
					itemNo: itemNo,
					itemNumber: (data.itemNumber as string) || '', // 선택된 아이템의 품번
					itemName: (data.itemName as string) || '', // 선택된 아이템의 품명
					itemSpec: (data.itemSpec as string) || '', // 선택된 아이템의 규격
					unit: (data.unit as string)?.substring(0, 3) || 'KG',
					number: Number(uncommaNumber(data.number as string)) || 1,
					currencyUnit: (data.currencyUnit as string) || 'KRW',
					unitPrice:
						Number(uncommaNumber(data.unitPrice as string)) || 0,
					netPrice:
						Number(uncommaNumber(data.netPrice as string)) || 0,
					grossPrice:
						Number(uncommaNumber(data.grossPrice as string)) || 0,
					requestDate: (data.requestDate as string) || masterFormData?.requestDate || '',
					vat: 0,
				},
			],
		};

		create.mutate(
			{ data: payload },
			{
				onSuccess: () => {
					setOpenModal(false);
					if (formMethods) {
						formMethods.reset();
					}
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

		const itemId = Number(data.itemId) || selectedDetail.itemId;
		const itemNo = Number(data.itemNo) || selectedDetail.itemNo;

		// Get item details from the item list
		const itemDetails = findItemById(itemId);

		// Create payload for updating purchase detail
		const payload = {
			id: selectedDetail.id,
			data: {
				purchaseMasterId:
					newPurchaseMasterId || selectedDetail.purchaseId,
				itemId: itemId,
				itemNo: itemNo,
				// Use item details from the item list if available, otherwise use form data or existing detail values
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
				unit: (data.unit as string)?.substring(0, 3) || 'KG',
				number: Number(uncommaNumber(data.number as string)) || 1,
				currencyUnit: (data.currencyUnit as string) || 'KRW',
				unitPrice: Number(uncommaNumber(data.unitPrice as string)) || 0,
				netPrice: Number(uncommaNumber(data.netPrice as string)) || 0,
				grossPrice:
					Number(uncommaNumber(data.grossPrice as string)) || 0,
				requestDate: (data.requestDate as string) || masterFormData?.requestDate || '',
				vat: 0,
			},
		};

		update.mutate(payload, {
			onSuccess: () => {
				setEditModal(false);
				setSelectedDetail(null);
				if (formMethods) {
					formMethods.reset();
				}
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
					setDeleteDialogOpen(false);
					setSelectedDetailToDelete(null);
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
		// Transform the data to match the API structure
		const payload = {
			dataList: dataToProcess.map((item) => {
				const itemId = Number(item.itemId);
				const itemNo = Number(item.itemNo);

				return {
					purchaseMasterId: newPurchaseMasterId || 1,
					itemId: itemId,
					itemNo: itemNo,
					itemNumber: (item.itemNumber as string) || '',
					itemName: (item.itemName as string) || '',
					itemSpec: (item.itemSpec as string) || '',
					unit: (item.unit as string)?.substring(0, 3) || 'KG',
					number: Number(uncommaNumber(item.number as string)) || 1,
					currencyUnit: (item.currencyUnit as string) || 'KRW',
					unitPrice:
						Number(uncommaNumber(item.unitPrice as string)) || 0,
					netPrice:
						Number(uncommaNumber(item.netPrice as string)) || 0,
					grossPrice:
						Number(uncommaNumber(item.grossPrice as string)) || 0,
					requestDate: (item.requestDate as string) || masterFormData?.requestDate || '',
					vat: 0,
				};
			}),
		};

		create.mutate(
			{ data: payload },
			{
				onSuccess: () => {
					toast.success('성공적으로 저장되었습니다.');
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
			itemId: detail.itemId || 1,
			itemNo: detail.itemNo || 1,
			// Use item details from the item list if available, otherwise use detail values
			itemName: itemDetails?.itemName || detail.itemName || '',
			itemNumber: itemDetails?.itemNumber || detail.itemNumber || '',
			itemSpec: itemDetails?.itemSpec || detail.itemSpec || '',
			unit: detail.unit || 'KG',
			number: detail.number?.toString() || '0',
			currencyUnit: detail.currencyUnit || 'KRW',
			unitPrice: detail.unitPrice?.toString() || '0',
			netPrice: detail.netPrice?.toString() || '0',
			grossPrice: detail.grossPrice?.toString() || '0',
			requestDate: detail.requestDate || masterFormData?.requestDate || '',
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
				title={tCommon('pages.purchase.add')}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							handleFormReady(methods);
							// Set requestDate immediately when form is ready
							if (masterFormData?.requestDate) {
								methods.setValue(
									'requestDate',
									masterFormData.requestDate
								);
							}
						}}
						fields={purchaseDetailFormSchema().map((field) => {
							return {
								...field,
								disabled: create.isPending,
								...(field.name === 'requestDate' && {
									defaultValue:
										masterFormData?.requestDate || '',
									disabled: false,
									readOnly: false,
								}),
							};
						})}
						onSubmit={handleProductFormSubmit}
						submitButtonText={
							create.isPending
								? tCommon('pages.form.saving')
								: tCommon('pages.form.save')
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
										const { itemId, itemNo, itemNumber, itemName, itemSpec } =
											itemData;
										formMethodsRef.current?.setValue(
											'itemId',
											itemId
										);
										formMethodsRef.current?.setValue(
											'itemNo',
											Number(itemNo)
										);
										if (itemNumber) {
											formMethodsRef.current?.setValue('itemNumber', itemNumber);
										}
										if (itemName) {
											formMethodsRef.current?.setValue('itemName', itemName);
										}
										if (itemSpec) {
											formMethodsRef.current?.setValue('itemSpec', itemSpec);
										}
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
				title={tCommon('pages.purchase.modify')}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							handleFormReady(methods);
							if (selectedDetail && methods) {
								populateEditForm(methods, selectedDetail);
							}
						}}
						fields={purchaseDetailEditFormSchema().map((field) => {
							return {
								...field,
								disabled: update.isPending,
								...(field.name === 'requestDate' && {
									defaultValue:
										masterFormData?.requestDate || '',
									disabled: false,
									readOnly: false,
								}),
							};
						})}
						onSubmit={handleEditFormSubmit}
						submitButtonText={
							update.isPending
								? tCommon('pages.form.modifying')
								: tCommon('pages.form.modify')
						}
						visibleSaveButton={true}
						otherTypeElements={{
							itemId: (props: any) => (
								<ItemSelectComponent
									{...props}
									placeholder="품목을 선택하세요"
									disabled={update.isPending}
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
				title={tCommon('pages.purchase.detailDelete')}
				description={tCommon('pages.purchase.detailDeleteConfirm')}
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
						{tCommon('pages.purchase.backToPurchase')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					<div className="border rounded-lg overflow-auto h-[calc(100vh-210px)]">
						<PurchaseOrdersRegisterForm
							onSuccess={(res: PurchaseMaster) => {
								if (
									res &&
									res.id &&
									typeof res.id === 'number'
								) {
									setNewPurchaseMasterId(res.id);
									setPurchaseMasterCreated(true);
									setMasterFormData(res);
								}
							}}
							onRequestDateChange={(requestDate: string) => {
								// Update masterFormData with new requestDate
								setMasterFormData((prev) =>
									prev ? { ...prev, requestDate } : null
								);
								// Also update the detail form if it's open
								if (formMethodsRef.current) {
									formMethodsRef.current.setValue(
										'requestDate',
										requestDate
									);
								}
							}}
							onReset={() => {
								setNewPurchaseMasterId(null);
								setPurchaseMasterCreated(false);
								setMasterFormData(null);
							}}
						/>
					</div>
					{/* h-[calc(100vh-210px)] */}
					<div className="border rounded-lg overflow-hidden">
						<DatatableComponent
							columns={processedColumns}
							table={table}
							data={listByMasterId.data?.content || []}
							tableTitle={tCommon(
								'pages.purchaseOrder.detailInfo'
							)}
							rowCount={listByMasterId.data?.totalElements || 0}
							defaultPageSize={30}
							actionButtons={
								<PurchaseOrdersDetailRegisterActions
									newPurchaseMasterId={newPurchaseMasterId}
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
								// Set requestDate from masterFormData if available
								const rowWithRequestDate = {
									...newRow,
									requestDate: (newRow as any).requestDate || masterFormData?.requestDate || '',
								};
								// Store the new row data for later saving
								setAddRowData((prev) => [
									...prev,
									rowWithRequestDate,
								]);
							}}
							onAddRowDataChange={(data) => {
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
