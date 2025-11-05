import { useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DraggableDialog, RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { SalesEstimateRegisterForm } from './SalesEstimateRegisterForm';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { commaNumber, uncommaNumber } from '@repo/utils';
import { useEstimateDetail } from '@primes/hooks/sales/estimateDetail/useEstimateDetail';
import { useGetEstimateMasterById } from '@primes/hooks/sales/estimateMaster/useGetEstimateMasterById';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { EstimateDetailRegisterActions } from '../components/EstimateDetailRegisterActions';
import { EstimateDetail } from '@primes/types/sales/estimateDetail';
import {
	useEstimateDetailColumns,
	EstimateDataTableDataType,
	estimateDetailFormSchema,
	estimateDetailEditFormSchema,
} from '@primes/schemas/sales/estimateDetailSchemas';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';

export const SalesEstimateEditPage = () => {
	const { t } = useTranslation('common');
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const estimateDetailColumns = useEstimateDetailColumns();
	const processedColumns = useDataTableColumns<EstimateDataTableDataType>(
		estimateDetailColumns
	);
	const [openModal, setOpenModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [selectedDetail, setSelectedDetail] = useState<EstimateDetail | null>(
		null
	);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDetailToDelete, setSelectedDetailToDelete] =
		useState<EstimateDetail | null>(null);

	// Add state to trigger add row feature
	const [triggerAddRow, setTriggerAddRow] = useState(false);

	// Add state to trigger clearing add row data
	const [triggerClearAddRow, setTriggerClearAddRow] = useState(false);

	// Add state to store add row data
	const [addRowData, setAddRowData] = useState<Record<string, unknown>[]>([]);

	const estimateMasterId = parseInt(id || '0');

	// Add useGetEstimateMasterById hook to get master data by ID
	const getById = useGetEstimateMasterById(estimateMasterId, 0, 30);

	// Add useEstimateDetail hook
	const {
		create,
		listByMasterId,
		update: updateDetail,
		remove,
	} = useEstimateDetail({
		estimateMasterId: estimateMasterId,
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

	// Load master data when component mounts
	useEffect(() => {
		if (estimateMasterId > 0) {
			// The query will automatically run when estimateMasterId changes
		}
	}, [estimateMasterId]);

	useEffect(() => {
		if (!formMethods) return;

		const subscription = formMethods.watch((value, info) => {
			if (info?.name === 'unitPrice' || info?.name === 'number') {
				const rawUnit = value.unitPrice as string;
				const rawNumber = value.number as string;

				const unit = Number(uncommaNumber(rawUnit ?? '')) || 0;
				const number = Number(uncommaNumber(rawNumber ?? '')) || 0;
				const total = unit * number;

				// 현재 상태와 다를 때만 setValue 실행
				const prevGross = formMethods.getValues('grossPrice');
				const formattedTotal = commaNumber(total);

				if (prevGross !== formattedTotal) {
					formMethods.setValue('grossPrice', formattedTotal);
					formMethods.setValue('unitPrice', commaNumber(unit));
					formMethods.setValue('number', commaNumber(number));
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [formMethods]);

	// Handle form submission for product add dialog
	const handleProductFormSubmit = (data: Record<string, unknown>) => {
		if (!estimateMasterId) {
			console.error('Estimate master ID is required');
			return;
		}

		// Validate required fields
		const requiredFields = [
			'itemNumber',
			'itemName',
			'number',
			'unitPrice',
			'netPrice',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			return;
		}

		// Create payload using array format
		const payload = [
			{
				estimateMasterId: estimateMasterId,
				itemId: 1,
				itemNo: 1,
				itemNumber: data.itemNumber as string,
				itemName: data.itemName as string,
				itemSpec: (data.itemSpec as string) || '',
				unit: (data.unit as string)?.substring(0, 3) || 'KG',
				number: Number(uncommaNumber(data.number as string)) || 1,
				currencyUnit: (data.currencyUnit as string) || 'KRW',
				unitPrice: Number(uncommaNumber(data.unitPrice as string)) || 0,
				netPrice: Number(uncommaNumber(data.netPrice as string)) || 0,
				grossPrice:
					Number(uncommaNumber(data.grossPrice as string)) || 0,
				memo: (data.memo as string) || '',
				vat: data.vat ? Number(data.vat) : 0,
			},
		];

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

		// Validate required fields
		const requiredFields = [
			'itemNumber',
			'itemName',
			'number',
			'unit',
			'unitPrice',
			'netPrice',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			return;
		}

		// Create payload for updating estimate detail
		const payload = {
			id: selectedDetail.id,
			data: {
				estimateMasterId: estimateMasterId || 0,
				itemId: 1,
				itemNo: 1,
				itemNumber: data.itemNumber as string,
				itemName: data.itemName as string,
				itemSpec: (data.itemSpec as string) || '',
				unit: (data.unit as string)?.substring(0, 3) || 'KG',
				number: Number(uncommaNumber(data.number as string)) || 1,
				currencyUnit: (data.currencyUnit as string) || 'KRW',
				unitPrice: Number(uncommaNumber(data.unitPrice as string)) || 0,
				netPrice: Number(uncommaNumber(data.netPrice as string)) || 0,
				grossPrice:
					Number(uncommaNumber(data.grossPrice as string)) || 0,
				memo: (data.memo as string) || '',
				vat: data.vat ? Number(data.vat) : 0,
			},
		};

		updateDetail.mutate(payload, {
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

	const handleEditClick = (detail: EstimateDetail) => {
		setSelectedDetail(detail);
		setEditModal(true);
	};

	const handleDeleteClick = (detail: EstimateDetail) => {
		setSelectedDetailToDelete(detail);
		setDeleteDialogOpen(true);
	};

	const populateEditForm = (
		methods: UseFormReturn<Record<string, unknown>>,
		detail: EstimateDetail
	) => {
		const defaultValues: Record<string, string | number> = {
			itemNumber: detail.itemNumber || '',
			itemName: detail.itemName || '',
			number: detail.number?.toString() || '0',
			unit: detail.unit || '개',
			unitPrice: detail.unitPrice?.toString() || '0',
			netPrice: detail.netPrice?.toString() || '0',
			grossPrice: detail.grossPrice?.toString() || '0',
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
					estimateMasterId: estimateMasterId || 0,
					itemId: getNumberValue('itemId', 1),
					itemNo: getNumberValue('itemNo', 1),
					itemNumber: getStringValue('itemNumber', ''),
					itemName: getStringValue('itemName', ''),
					itemSpec: getStringValue('itemSpec', ''),
					unit: getStringValue('unit', ''),
					number: getNumberValue('number', 0),
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
					payload.number > 0 ||
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
		create.mutate(payload, {
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
				console.error('Error creating estimate details:', error);
				toast.error(`견적 상세 저장 중 오류가 발생했습니다.`);
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
				title={t('pages.estimate.add')}
				content={
					<DynamicForm
						onFormReady={handleFormReady}
						fields={estimateDetailFormSchema.map((field) => ({
							...field,
							disabled: create.isPending,
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
				title={t('pages.estimate.modify')}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							handleFormReady(methods);
							if (selectedDetail && methods) {
								populateEditForm(methods, selectedDetail);
							}
						}}
						fields={estimateDetailEditFormSchema.map((field) => ({
							...field,
							disabled: updateDetail.isPending,
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
				title={t('pages.estimate.detailDelete')}
				description={t('pages.estimate.detailDeleteConfirm')}
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
						{t('pages.estimate.backToEstimate')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					<div className="border rounded-lg overflow-auto h-[calc(100vh-210px)]">
						<SalesEstimateRegisterForm
							isEditMode={true}
							masterData={getById.data?.content?.[0]}
							estimateMasterId={estimateMasterId}
						/>
					</div>
					<div className="border rounded-lg overflow-hidden">
						<DatatableComponent
							columns={processedColumns}
							table={table}
							data={listByMasterId.data?.content || []}
							tableTitle={t('pages.estimate.detailInfo')}
							rowCount={listByMasterId.data?.totalElements || 0}
							defaultPageSize={30}
							actionButtons={
								<EstimateDetailRegisterActions
									newEstimateMasterId={estimateMasterId}
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

export default SalesEstimateEditPage;
