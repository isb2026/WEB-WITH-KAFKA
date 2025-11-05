import { useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DraggableDialog, RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { SalesShippingRequestRegisterForm } from './SalesShippingRequestRegisterForm';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { commaNumber, uncommaNumber } from '@repo/utils';
import { useShippingRequestDetail } from '@primes/hooks/sales/shippingRequestDetail/useShippingRequestDetail';
import { useGetShippingRequestMasterById } from '@primes/hooks/sales/shippingRequestMaster/useGetShippingRequestMasterById';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { ShippingRequestDetailRegisterActions } from '../components/ShippingRequestDetailRegisterActions';

import {
	DataTableDataType,
	shippingRequestDetailFormSchema,
	shippingRequestDetailEditFormSchema,
	useShippingRequestDetailColumns,
} from '@primes/schemas/sales/shippingRequestDetailSchemas';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';

export const SalesShippingRequestEditPage = () => {
	const { t } = useTranslation('common');
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const shippingRequestDetailColumns = useShippingRequestDetailColumns();
	const processedColumns = useDataTableColumns<DataTableDataType>(
		shippingRequestDetailColumns
	);
	const [openModal, setOpenModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [selectedDetail, setSelectedDetail] =
		useState<DataTableDataType | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDetailToDelete, setSelectedDetailToDelete] =
		useState<DataTableDataType | null>(null);

	// Add state to trigger add row feature
	const [triggerAddRow, setTriggerAddRow] = useState(false);

	// Add state to trigger clearing add row data
	const [triggerClearAddRow, setTriggerClearAddRow] = useState(false);

	// Add state to store add row data
	const [addRowData, setAddRowData] = useState<Record<string, unknown>[]>([]);

	const shippingRequestMasterId = parseInt(id || '0');

	// Add useGetShippingRequestMasterById hook to get master data by ID
	const getById = useGetShippingRequestMasterById(
		shippingRequestMasterId,
		0,
		30
	);

	// Add useShippingRequestDetail hook
	const {
		create,
		listByMasterId,
		update: updateDetail,
		remove,
	} = useShippingRequestDetail({
		masterId: shippingRequestMasterId,
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
		if (shippingRequestMasterId > 0) {
			// The query will automatically run when shippingRequestMasterId changes
		}
	}, [shippingRequestMasterId]);

	useEffect(() => {
		if (!formMethods) return;

		const subscription = formMethods.watch((value, info) => {
			if (info?.name === 'unitPrice' || info?.name === 'requestNumber') {
				const rawUnit = value.unitPrice as string;
				const rawRequest = value.requestNumber as string;

				const unit = Number(uncommaNumber(rawUnit ?? '')) || 0;
				const request = Number(uncommaNumber(rawRequest ?? '')) || 0;
				const total = unit * request;

				// 현재 상태와 다를 때만 setValue 실행
				const prevGross = formMethods.getValues('grossPrice');
				const formattedTotal = commaNumber(total);

				if (prevGross !== formattedTotal) {
					formMethods.setValue('grossPrice', formattedTotal);
					formMethods.setValue('unitPrice', commaNumber(unit));
					formMethods.setValue('requestNumber', commaNumber(request));
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [formMethods]);

	// Handle form submission for detail add dialog
	const handleDetailFormSubmit = (data: Record<string, unknown>) => {
		if (!shippingRequestMasterId) {
			console.error('Shipping request master ID is required');
			return;
		}

		// Validate required fields
		const requiredFields = [
			'itemNumber',
			'itemName',
			'itemSpec',
			'requestNumber',
			'requestUnit',
			'unitPrice',
			'netPrice',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			return;
		}

		// Create payload as array directly
		const payload = [
			{
				shippingRequestMasterId: shippingRequestMasterId,
				itemId: 1,
				itemNo: 1,
				itemNumber: (data.itemNumber as string) || '',
				itemName: (data.itemName as string) || '',
				itemSpec: (data.itemSpec as string) || '',
				requestUnit:
					(data.requestUnit as string)?.substring(0, 3) || '개',
				requestNumber:
					Number(uncommaNumber(data.requestNumber as string)) || 1,
				currencyUnit: (data.currencyUnit as string) || 'USD',
				unitPrice: Number(uncommaNumber(data.unitPrice as string)) || 0,
				netPrice: Number(uncommaNumber(data.netPrice as string)) || 0,
				grossPrice:
					Number(uncommaNumber(data.grossPrice as string)) || 0,
				memo: (data.memo as string) || '',
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
			'itemSpec',
			'requestNumber',
			'requestUnit',
			'unitPrice',
			'netPrice',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			return;
		}

		// Create payload for updating shipping request detail
		const payload = [
			{
				id: selectedDetail.id,
				shippingRequestMasterId: shippingRequestMasterId,
				itemId: 1,
				itemNo: 1,
				itemNumber: (data.itemNumber as string) || '',
				itemName: (data.itemName as string) || '',
				itemSpec: (data.itemSpec as string) || '',
				requestUnit:
					(data.requestUnit as string)?.substring(0, 3) || '개',
				requestNumber:
					Number(uncommaNumber(data.requestNumber as string)) || 1,
				currencyUnit: (data.currencyUnit as string) || 'USD',
				unitPrice: Number(uncommaNumber(data.unitPrice as string)) || 0,
				netPrice: Number(uncommaNumber(data.netPrice as string)) || 0,
				grossPrice:
					Number(uncommaNumber(data.grossPrice as string)) || 0,
				vat: 0,
				memo: (data.memo as string) || '',
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

	const handleEditClick = (detail: DataTableDataType) => {
		setSelectedDetail(detail);
		setEditModal(true);
	};

	const handleDeleteClick = (detail: DataTableDataType) => {
		setSelectedDetailToDelete(detail);
		setDeleteDialogOpen(true);
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
					shippingRequestMasterId: shippingRequestMasterId,
					itemId: getNumberValue('itemId', 1),
					itemNo: getNumberValue('itemNo', 1),
					itemNumber: getStringValue('itemNumber', ''),
					itemName: getStringValue('itemName', ''),
					itemSpec: getStringValue('itemSpec', ''),
					requestUnit: getStringValue('requestUnit', '개'),
					requestNumber: getNumberValue('requestNumber', 0),
					currencyUnit: getStringValue('currencyUnit', 'USD'),
					unitPrice: getNumberValue('unitPrice', 0),
					netPrice: getNumberValue('netPrice', 0),
					grossPrice: getNumberValue('grossPrice', 0),
					vat: 0,
					memo: getStringValue('memo', ''),
				};

				// Check if this row has any meaningful data
				const hasMeaningfulData =
					payload.itemName !== '' ||
					payload.itemNumber !== '' ||
					payload.requestNumber > 0 ||
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

		// Send single API request with all data
		create.mutate(processedRows, {
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
				console.error(
					'Error creating shipping request details:',
					error
				);
				toast.error(`출하요청 상세 저장 중 오류가 발생했습니다.`);
			},
		});
	};

	const handleAddRowClick = () => {
		// Trigger the add row feature by setting the state
		setTriggerAddRow(true);
		// Reset after a short delay to allow the effect to trigger
		setTimeout(() => setTriggerAddRow(false), 100);
	};

	const populateEditForm = (
		methods: UseFormReturn<Record<string, unknown>>,
		detail: DataTableDataType
	) => {
		const defaultValues: Record<string, string | number> = {
			itemNumber: detail.itemNumber || '',
			itemName: detail.itemName || '',
			itemSpec: detail.itemSpec || '',
			requestNumber: detail.requestNumber?.toString() || '0',
			requestUnit: detail.requestUnit || '개',
			unitPrice: detail.unitPrice?.toString() || '0',
			netPrice: detail.netPrice?.toString() || '0',
			grossPrice: detail.grossPrice?.toString() || '0',
			currencyUnit: detail.currencyUnit || 'USD',
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
				title={t('pages.shippingRequest.add')}
				content={
					<DynamicForm
						onFormReady={handleFormReady}
						fields={shippingRequestDetailFormSchema.map(
							(field) => ({
								...field,
								disabled: create.isPending,
							})
						)}
						onSubmit={handleDetailFormSubmit}
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
				title={t('pages.shippingRequest.modify')}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							handleFormReady(methods);
							if (selectedDetail && methods) {
								populateEditForm(methods, selectedDetail);
							}
						}}
						fields={shippingRequestDetailEditFormSchema.map(
							(field) => ({
								...field,
								disabled: updateDetail.isPending,
							})
						)}
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
				title={t('pages.shippingRequest.detailDelete')}
				description={t('pages.shippingRequest.detailDeleteConfirm')}
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
						{t('pages.shippingRequest.backToShippingRequest')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					<div className="border rounded-lg overflow-auto h-[calc(100vh-210px)]">
						<SalesShippingRequestRegisterForm
							masterData={getById.data?.content?.[0]}
							isEditMode={true}
						/>
					</div>
					<div className="border rounded-lg overflow-hidden">
						<DatatableComponent
							columns={processedColumns}
							table={table}
							data={listByMasterId.data?.content || []}
							tableTitle={t('pages.shippingRequest.detailInfo')}
							rowCount={listByMasterId.data?.totalElements || 0}
							defaultPageSize={30}
							actionButtons={
								<ShippingRequestDetailRegisterActions
									newShippingRequestMasterId={
										shippingRequestMasterId
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

export default SalesShippingRequestEditPage;
