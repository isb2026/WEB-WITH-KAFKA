import { useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DraggableDialog, RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { IncomingOrdersRegisterForm } from './IncomingOrdersRegisterForm';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { commaNumber, uncommaNumber } from '@repo/utils';
import { useIncomingDetail } from '@primes/hooks/purchase/incomingDetail/useIncomingDetail';
import { useGetIncomingMasterById } from '@primes/hooks/purchase/incomingMaster/useGetIncomingMasterById';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { IncomingDetail } from '@primes/types/purchase/incomingDetail';
import {
	useIncomingDetailColumns,
	IncomingDataTableDataType,
	incomingDetailFormSchema,
	incomingDetailEditFormSchema,
} from '@primes/schemas/purchase/incomingDetailSchemas';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useItems } from '@primes/hooks/init/useItems';
import IncomingOrdersDetailRegisterActions from '../components/IncomingOrdersDetailRegisterActions';

export const IncomingOrdersEditPage = () => {
	const { t } = useTranslation('common');
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const purchaseDetailColumns = useIncomingDetailColumns();
	const processedColumns = useDataTableColumns<IncomingDataTableDataType>(
		purchaseDetailColumns
	);
	const [openModal, setOpenModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [selectedDetail, setSelectedDetail] = useState<IncomingDetail | null>(
		null
	);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDetailToDelete, setSelectedDetailToDelete] =
		useState<IncomingDetail | null>(null);

	// Add state to trigger add row feature
	const [triggerAddRow, setTriggerAddRow] = useState(false);

	// Add state to trigger clearing add row data
	const [triggerClearAddRow, setTriggerClearAddRow] = useState(false);

	// Add state to store add row data
	const [addRowData, setAddRowData] = useState<Record<string, unknown>[]>([]);

	const purchaseMasterId = parseInt(id || '0');

	// Add useGetIncomingMasterById hook to get master data by ID
	const getById = useGetIncomingMasterById(purchaseMasterId, 0, 30);

	// Add useItems hook to get item options
	const { data: itemsData } = useItems({
		searchRequest: {},
		page: 0,
		size: 100,
	});

	// Add useIncomingDetail hook
	const {
		create,
		listByMasterId,
		update: updateDetail,
		remove,
	} = useIncomingDetail({
		incomingMasterId: purchaseMasterId,
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

	// Handle add form submission
	const handleProductFormSubmit = (data: Record<string, unknown>) => {
		// Validate required fields - only API fields
		const requiredFields = [
			'unit',
			'number',
			'currencyUnit',
			'unitPrice',
			'netPrice',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			toast.error('필수 필드를 모두 입력해주세요.');
			return;
		}

		// Extract itemId and itemNo from the combined value if available
		const selectedItemValue = String(data.itemId) || '';
		const [itemId, itemNo] = selectedItemValue.includes('_') 
			? selectedItemValue.split('_').map(Number)
			: [0, 1];

		// Create payload for creating incoming detail - use actual form data
		const payload = [
			{
				incomingMasterId: purchaseMasterId,
				itemId: itemId,
				itemNo: itemNo,
				itemNumber: data.itemNumber as string,
				itemName: data.itemName as string,
				itemSpec: data.itemSpec as string,
				unit: data.unit as string,
				number: Number(uncommaNumber(data.number as string)),
				currencyUnit: data.currencyUnit as string,
				unitPrice: Number(uncommaNumber(data.unitPrice as string)),
				netPrice: Number(uncommaNumber(data.netPrice as string)),
				grossPrice: Number(uncommaNumber(data.grossPrice as string)),
				memo: data.memo as string,
				vat: Number(data.vat) || 0,
			},
		];

		create.mutate(
			{ data: { dataList: payload } },
			{
				onSuccess: () => {
					// Invalidate and refetch queries to refresh data
					queryClient.invalidateQueries({
						queryKey: [
							'IncomingDetail',
							'byMasterId',
							purchaseMasterId,
						],
					});
					queryClient.invalidateQueries({
						queryKey: [
							'IncomingMaster',
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
			toast.error('수정할 항목을 선택해주세요.');
			return;
		}

		// Validate required fields - only API fields
		const requiredFields = [
			'unit',
			'number',
			'currencyUnit',
			'unitPrice',
			'netPrice',
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			toast.error('필수 필드를 모두 입력해주세요.');
			return;
		}

		// Extract itemId and itemNo from the combined value or use existing detail values
		const selectedItemValue = String(data.itemId) || '';
		const [itemId, itemNo] = selectedItemValue.includes('_') 
			? selectedItemValue.split('_').map(Number)
			: [selectedDetail.itemId || 0, selectedDetail.itemNo || 1];

		// Create payload for updating incoming detail - use actual form data
		const payload = {
			id: selectedDetail.id,
			data: {
				incomingId: selectedDetail.incomingId,
				itemId: itemId,
				itemNo: itemNo,
				itemNumber: (data.itemNumber as string) || selectedDetail.itemNumber,
				itemName: (data.itemName as string) || selectedDetail.itemName,
				itemSpec: (data.itemSpec as string) || selectedDetail.itemSpec,
				unit: data.unit as string,
				number: Number(uncommaNumber(data.number as string)),
				currencyUnit: data.currencyUnit as string,
				unitPrice: Number(uncommaNumber(data.unitPrice as string)),
				netPrice: Number(uncommaNumber(data.netPrice as string)),
				grossPrice: Number(uncommaNumber(data.grossPrice as string)),
				memo: (data.memo as string) || selectedDetail.memo,
				vat: Number(data.vat) || 0,
			},
		};

		updateDetail.mutate(payload, {
			onSuccess: () => {
				// Invalidate and refetch queries to refresh data
				queryClient.invalidateQueries({
					queryKey: [
						'IncomingDetail',
						'byMasterId',
						purchaseMasterId,
					],
				});
				queryClient.invalidateQueries({
					queryKey: ['IncomingMaster', 'getById', purchaseMasterId],
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
							'IncomingDetail',
							'byMasterId',
							purchaseMasterId,
						],
					});
					queryClient.invalidateQueries({
						queryKey: [
							'IncomingMaster',
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

	const handleEditClick = (detail: IncomingDetail) => {
		setSelectedDetail(detail);
		setEditModal(true);
	};

	const handleDeleteClick = (detail: IncomingDetail) => {
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
		// Filter out empty rows - check for meaningful business data
		const validData = dataToProcess.filter((item) => {
			// Check if row has meaningful business data (not just internal fields like __rid)
			const hasItemData = item.itemId && Number(item.itemId) > 0;
			const hasBasicData = item.itemNumber || item.itemName || item.unit || (item.number && Number(item.number) > 0);
			
			return hasItemData || hasBasicData;
		});

		if (validData.length === 0) {
			toast.warning('저장할 유효한 데이터가 없습니다.');
			return;
		}

		console.log('🔍 Valid data to save:', validData);

		// Transform the data to match the API structure
		const payload = validData.map((item) => ({
			incomingMasterId: purchaseMasterId,
			itemId: item.itemId ? Number(item.itemId) : 0,
			itemNo: item.itemNo ? Number(item.itemNo) : 1,
			itemNumber: (item.itemNumber as string) || '',
			itemName: (item.itemName as string) || '',
			itemSpec: (item.itemSpec as string) || '',
			unit: (item.unit as string) || '',
			number: item.number ? Number(uncommaNumber(item.number as string)) : 0,
			currencyUnit: (item.currencyUnit as string) || '',
			unitPrice: item.unitPrice ? Number(uncommaNumber(item.unitPrice as string)) : 0,
			netPrice: item.netPrice ? Number(uncommaNumber(item.netPrice as string)) : 0,
			grossPrice: item.grossPrice ? Number(uncommaNumber(item.grossPrice as string)) : 0,
			memo: (item.memo as string) || '',
			vat: item.vat ? Number(item.vat) : 0,
		}));

		create.mutate(
			{ data: { dataList: payload } },
			{
				onSuccess: () => {
					// Invalidate and refetch queries to refresh data
					queryClient.invalidateQueries({
						queryKey: [
							'IncomingDetail',
							'byMasterId',
							purchaseMasterId,
						],
					});
					queryClient.invalidateQueries({
						queryKey: [
							'IncomingMaster',
							'getById',
							purchaseMasterId,
						],
					});

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

	// Create dynamic form schema with item options
	const createFormSchemaWithItems = (isEdit: boolean = false) => {
		const items = itemsData?.content || [];
		const itemOptions = items.map((item: any) => ({
			label: `${item.itemName} [${item.itemNumber}] - ${item.itemSpec || ''}`,
			value: `${item.id}_${item.itemNo || 1}`,
		}));

		const baseSchema = isEdit ? incomingDetailEditFormSchema() : incomingDetailFormSchema();
		
		return baseSchema.map((field) => {
			if (field.name === 'itemId' || field.name === 'itemNumber') {
				return {
					...field,
					name: 'itemId',
					options: itemOptions,
				};
			}
			return field;
		});
	};

	const populateEditForm = (
		methods: UseFormReturn<Record<string, unknown>>,
		detail: IncomingDetail
	) => {
		const defaultValues: Record<string, string | number> = {
			itemId: detail.itemId && detail.itemNo ? `${detail.itemId}_${detail.itemNo}` : '',
			unit: detail.unit || '',
			number: commaNumber(detail.number) || '',
			currencyUnit: detail.currencyUnit || 'KRW',
			unitPrice: commaNumber(detail.unitPrice) || '',
			netPrice: commaNumber(detail.netPrice) || '',
			grossPrice: commaNumber(detail.grossPrice) || '',
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
				title={t('pages.incoming.add')}
				content={
					<DynamicForm
						onFormReady={handleFormReady}
						fields={createFormSchemaWithItems(false).map((field) => ({
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
				title={t('pages.incoming.modify')}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							handleFormReady(methods);
							if (selectedDetail && methods) {
								populateEditForm(methods, selectedDetail);
							}
						}}
						fields={createFormSchemaWithItems(true).map((field) => ({
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
				title={t('pages.incoming.detailDelete')}
				description={t('pages.incoming.detailDeleteConfirm')}
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
						{t('pages.incoming.backToIncoming')}
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
									Loading incoming data...
								</div>
							</div>
						) : getById.error ? (
							<div className="flex items-center justify-center h-full">
								<div className="text-lg text-red-500">
									Error loading incoming data:{' '}
									{getById.error.message}
								</div>
							</div>
						) : (
							<IncomingOrdersRegisterForm
								isEditMode={true}
								masterData={getById.data?.content?.[0]}
								incomingMasterId={purchaseMasterId}
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
								tableTitle={t('pages.incoming.detailInfo')}
								rowCount={
									listByMasterId.data?.totalElements || 0
								}
								defaultPageSize={30}
								actionButtons={
									<IncomingOrdersDetailRegisterActions
										newIncomingMasterId={purchaseMasterId}
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
									// Store the new row data for later saving
									setAddRowData((prev) => {
										const newData = [...prev, newRow];
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

export default IncomingOrdersEditPage;
