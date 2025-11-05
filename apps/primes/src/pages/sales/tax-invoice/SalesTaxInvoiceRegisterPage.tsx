import { useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DraggableDialog, RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { SalesTaxInvoiceRegisterForm } from './SalesTaxInvoiceRegisterForm';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { commaNumber, uncommaNumber } from '@repo/utils';
import { useTaxInvoiceDetail } from '@primes/hooks/sales/taxInvoiceDetail/useTaxInvoiceDetail';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { TaxInvoiceDetailRegisterActions } from '@primes/pages/sales/components/TaxInvoiceDetailRegisterActions';
import { TaxInvoiceMaster } from '@primes/types/sales/taxInvoiceMaster';
import { TaxInvoiceDetail } from '@primes/types/sales/taxInvoiceDetail';
import {
	useTaxInvoiceDetailColumns,
	TaxInvoiceDataTableDataType,
	taxInvoiceDetailFormSchema,
	taxInvoiceDetailEditFormSchema,
} from '@primes/schemas/sales/taxInvoiceDetailSchemas';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';

export const SalesTaxInvoiceRegisterPage = () => {
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const taxInvoiceDetailColumns = useTaxInvoiceDetailColumns();
	const navigate = useNavigate();
	const processedColumns = useDataTableColumns<TaxInvoiceDataTableDataType>(
		taxInvoiceDetailColumns
	);
	const [openModal, setOpenModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [selectedDetail, setSelectedDetail] =
		useState<TaxInvoiceDetail | null>(null);
	const [newTaxInvoiceMasterId, setNewTaxInvoiceMasterId] = useState<
		number | null
	>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDetailToDelete, setSelectedDetailToDelete] =
		useState<TaxInvoiceDetail | null>(null);

	// Add state to trigger add row feature
	const [triggerAddRow, setTriggerAddRow] = useState(false);

	// Add state to trigger clearing add row data
	const [triggerClearAddRow, setTriggerClearAddRow] = useState(false);

	// Add state to store add row data
	const [addRowData, setAddRowData] = useState<Record<string, unknown>[]>([]);

	// Add useTaxInvoiceDetail hook
	const { create, listByMasterId, update, remove } = useTaxInvoiceDetail({
		taxInvoiceMasterId: newTaxInvoiceMasterId || 0,
		page: 0,
		size: 30,
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
	};

	useEffect(() => {
		if (!formMethods) return;

		const subscription = formMethods.watch((value, info) => {
			if (info?.name === 'unitPrice' || info?.name === 'taxNumber') {
				const rawUnit = value.unitPrice as string;
				const rawNumber = value.taxNumber as string;

				const unit = Number(uncommaNumber(rawUnit ?? '')) || 0;
				const number = Number(uncommaNumber(rawNumber ?? '')) || 0;
				const total = unit * number;

				// 현재 상태와 다를 때만 setValue 실행
				const prevGross = formMethods.getValues('grossPrice');
				const formattedTotal = commaNumber(total);

				if (prevGross !== formattedTotal) {
					formMethods.setValue('grossPrice', formattedTotal);
					formMethods.setValue('unitPrice', commaNumber(unit));
					formMethods.setValue('taxNumber', commaNumber(number));
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [formMethods]);

	// Handle form submission for product add dialog
	const handleProductFormSubmit = (data: Record<string, unknown>) => {
		if (!newTaxInvoiceMasterId) {
			console.error('Tax invoice master ID is required');
			return;
		}

		// Validate required fields
		const requiredFields = [
			'itemNumber',
			'itemName',
			'taxNumber',
			'unitPrice',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			return;
		}

		// Create payload matching the required structure
		const payload = [
			{
				taxInvoiceMasterId: newTaxInvoiceMasterId,
				itemId: 1,
				itemNo: 1,
				itemNumber: data.itemNumber as string,
				itemName: data.itemName as string,
				itemSpec: (data.itemSpec as string) || '',
				taxUnit: (data.taxUnit as string)?.substring(0, 3) || 'EA',
				taxNumber: Number(uncommaNumber(data.taxNumber as string)) || 1,
				currencyUnit: (data.currencyUnit as string) || 'KRW',
				unitPrice: Number(uncommaNumber(data.unitPrice as string)) || 0,
				netPrice: Number(uncommaNumber(data.netPrice as string)) || 0,
				grossPrice:
					Number(uncommaNumber(data.grossPrice as string)) || 0,
				memo: (data.memo as string) || '',
				vat: data.vat ? Number(data.vat) : 0,
			},
		];

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

		// Validate required fields
		const requiredFields = [
			'itemNumber',
			'itemName',
			'taxNumber',
			'taxUnit',
			'unitPrice',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			return;
		}

		// Create payload for updating tax invoice detail
		const payload = {
			id: selectedDetail.id,
			data: {
				taxInvoiceMasterId: newTaxInvoiceMasterId || 0,
				itemId: 1,
				itemNo: 1,
				itemNumber: data.itemNumber as string,
				itemName: data.itemName as string,
				itemSpec: (data.itemSpec as string) || '',
				taxUnit: (data.taxUnit as string)?.substring(0, 3) || 'EA',
				taxNumber: Number(uncommaNumber(data.taxNumber as string)) || 1,
				currencyUnit: (data.currencyUnit as string) || 'KRW',
				unitPrice: Number(uncommaNumber(data.unitPrice as string)) || 0,
				netPrice: Number(uncommaNumber(data.unitPrice as string)) || 0, // Using unitPrice as netPrice
				grossPrice:
					Number(uncommaNumber(data.unitPrice as string)) || 0, // Using unitPrice as grossPrice
				memo: (data.memo as string) || '',
				vat: data.vat ? Number(data.vat) : 0,
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

	// Handle save add rows
	const handleSaveAddRows = () => {
		// Check if there are any add rows to save
		if (addRowData.length === 0) {
			toast.warning('저장할 데이터가 없습니다.');
			return;
		}
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
					taxInvoiceMasterId: newTaxInvoiceMasterId || 0,
					itemId: getNumberValue('itemId', 1),
					itemNo: getNumberValue('itemNo', 1),
					itemNumber: getStringValue('itemNumber', ''),
					itemName: getStringValue('itemName', ''),
					itemSpec: getStringValue('itemSpec', ''),
					taxUnit: getStringValue('taxUnit', 'EA'),
					taxNumber: getNumberValue('taxNumber', 1),
					currencyUnit: getStringValue('currencyUnit', 'KRW'),
					unitPrice: getNumberValue('unitPrice', 0),
					netPrice: getNumberValue('netPrice', 0),
					grossPrice: getNumberValue('grossPrice', 0),
					memo: getStringValue('memo', ''),
					vat: getNumberValue('vat', 0),
				};

				// Check if this row has any meaningful data
				const hasMeaningfulData =
					payload.itemName !== '' ||
					payload.itemNumber !== '' ||
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
		create.mutate(
			{ data: payload },
			{
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
					console.error('Error creating tax invoice details:', error);
					toast.error(`세금계산서 상세 저장 중 오류가 발생했습니다.`);
				},
			}
		);
	};

	// Action button handlers
	const handleAddClick = () => {
		setOpenModal(true);
	};

	const handleEditClick = (detail: TaxInvoiceDetail) => {
		setSelectedDetail(detail);
		setEditModal(true);
	};

	const handleDeleteClick = (detail: TaxInvoiceDetail) => {
		setSelectedDetailToDelete(detail);
		setDeleteDialogOpen(true);
	};

	const populateEditForm = (
		methods: UseFormReturn<Record<string, unknown>>,
		detail: TaxInvoiceDetail
	) => {
		const defaultValues: Record<string, string | number> = {
			itemNumber: detail.itemNumber || '',
			itemName: detail.itemName || '',
			itemSpec: detail.itemSpec || '',
			taxNumber: detail.taxNumber?.toString() || '0',
			taxUnit: detail.taxUnit || 'EA',
			unitPrice: detail.unitPrice?.toString() || '0',
			currencyUnit: detail.currencyUnit || 'KRW',
			memo: detail.memo || '',
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

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={(open: boolean) => {
					setOpenModal(open);
				}}
				title={tCommon('pages.taxInvoice.add')}
				content={
					<DynamicForm
						onFormReady={handleFormReady}
						fields={taxInvoiceDetailFormSchema.map((field) => ({
							...field,
							disabled: create.isPending,
						}))}
						onSubmit={handleProductFormSubmit}
						submitButtonText={
							create.isPending
								? tCommon('pages.form.saving')
								: tCommon('pages.form.save')
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
				title={tCommon('pages.taxInvoice.modify')}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							handleFormReady(methods);
							if (selectedDetail && methods) {
								populateEditForm(methods, selectedDetail);
							}
						}}
						fields={taxInvoiceDetailEditFormSchema.map((field) => ({
							...field,
							disabled: update.isPending,
						}))}
						onSubmit={handleEditFormSubmit}
						submitButtonText={
							update.isPending
								? tCommon('pages.form.modifying')
								: tCommon('pages.form.modify')
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
				title={tCommon('pages.taxInvoice.detailDelete')}
				description={tCommon('pages.taxInvoice.detailDeleteConfirm')}
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
						{tCommon('pages.taxInvoice.backToTaxInvoice')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					<div className="border rounded-lg overflow-auto h-[calc(100vh-210px)]">
						<SalesTaxInvoiceRegisterForm
							onSuccess={(res: TaxInvoiceMaster) => {
								if (res.id && typeof res.id === 'number') {
									setNewTaxInvoiceMasterId(res.id);
								}
							}}
							onReset={() => {
								setNewTaxInvoiceMasterId(null);
							}}
						/>
					</div>
					{/* h-[calc(100vh-210px)] */}
					<div className="border rounded-lg overflow-hidden">
						<DatatableComponent
							columns={processedColumns}
							table={table}
							data={listByMasterId.data?.content || []}
							tableTitle={tCommon('pages.taxInvoice.detailInfo')}
							rowCount={listByMasterId.data?.totalElements || 0}
							defaultPageSize={30}
							actionButtons={
								<TaxInvoiceDetailRegisterActions
									newTaxInvoiceMasterId={
										newTaxInvoiceMasterId
									}
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
