import { useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DraggableDialog, RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { IncomingOrdersRegisterForm } from './IncomingOrdersRegisterForm';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { uncommaNumber } from '@repo/utils';
import { useIncomingDetail } from '@primes/hooks/purchase/incomingDetail/useIncomingDetail';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { IncomingOrdersDetailRegisterActions } from '@primes/pages/purchase/components/IncomingOrdersDetailRegisterActions';
import { IncomingMaster } from '@primes/types/purchase/incomingMaster';
import { IncomingDetail } from '@primes/types/purchase/incomingDetail';
import {
	useIncomingDetailColumns,
	IncomingDataTableDataType,
	incomingDetailFormSchema,
	incomingDetailEditFormSchema,
	useItemOptions,
} from '@primes/schemas/purchase/incomingDetailSchemas';
import { useTranslation } from '@repo/i18n';
import { ItemSelectComponent } from '@primes/components/customSelect/ItemSelectComponent';

export const IncomingOrdersRegisterPage = () => {
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const incomingDetailColumns = useIncomingDetailColumns();
	const navigate = useNavigate();
	const processedColumns = useDataTableColumns<IncomingDataTableDataType>(
		incomingDetailColumns
	);
	const [openModal, setOpenModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [selectedDetail, setSelectedDetail] = useState<IncomingDetail | null>(
		null
	);
	const [newIncomingMasterId, setNewIncomingMasterId] = useState<
		number | null
	>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDetailToDelete, setSelectedDetailToDelete] =
		useState<IncomingDetail | null>(null);

	// Add useIncomingDetail hook
	const { create, listByMasterId, update, remove } = useIncomingDetail({
		incomingMasterId: newIncomingMasterId || 0,
		page: 0,
		size: 30,
	});

	// Get item options for select dropdown
	const { itemOptions, isLoading: itemOptionsLoading } = useItemOptions();

	// Add states for item selection
	const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
	const [selectedItemNo, setSelectedItemNo] = useState<string | null>(null);

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

		const subscription = formMethods.watch((values, { name }) => {
			// Handle itemId changes to auto-populate itemNo
			if (name === 'itemId' && values.itemId) {
				const selectedValue = values.itemId as string;
				if (selectedValue.includes('_')) {
					const [itemId, itemNo] = selectedValue.split('_');
					// Only set itemNo, keep the combined value for itemId
					formMethods.setValue('itemNo', itemNo);
					setSelectedItemId(Number(itemId));
					setSelectedItemNo(itemNo);
				}
			}
			
			if (name === 'number' || name === 'unitPrice') {
				const number = parseFloat(values.number as string) || 0;
				const unitPrice = parseFloat(values.unitPrice as string) || 0;
				const netPrice = number * unitPrice; // quantity × unit price = net price
				const grossPrice = number * unitPrice; // Keep existing gross price calculation

				formMethods.setValue('netPrice', netPrice.toString());
				formMethods.setValue('grossPrice', grossPrice.toString());
			}
		});

		return () => subscription.unsubscribe();
	}, [formMethods]);

	// Handle form submission for product add dialog
	const handleProductFormSubmit = (data: Record<string, unknown>) => {
		if (!newIncomingMasterId) {
			console.error('No incoming master ID available');
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
			return;
		}

		// Extract itemId and itemNo from the combined value or use selected states
		const selectedItemValue = String(data.itemId) || '';
		const [itemId, itemNo] = selectedItemValue.includes('_') 
			? selectedItemValue.split('_').map(Number)
			: [selectedItemId || 1, Number(selectedItemNo) || 1];

		// Create payload matching the provided API structure
		const payload = [
			{
				incomingMasterId: newIncomingMasterId,
				itemId: itemId,
				itemNo: itemNo,
				itemNumber: '품번',
				itemName: '품명',
				itemSpec: '제품규격',
				unit:
					(data.unit as string)?.substring(0, 3) || '단위(수량,중량)',
				number: Number(uncommaNumber(data.number as string)) || 1,
				currencyUnit: (data.currencyUnit as string) || '통화단위',
				unitPrice:
					Number(uncommaNumber(data.unitPrice as string)) || 1000000,
				netPrice:
					Number(uncommaNumber(data.netPrice as string)) || 1000000,
				grossPrice:
					Number(uncommaNumber(data.grossPrice as string)) || 1000000,
				memo: (data.memo as string) || '메모',
				vat: 0,
			},
		];

		create.mutate(
			{ data: { dataList: payload } },
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
		];
		const missingFields = requiredFields.filter((field) => !data[field]);

		if (missingFields.length > 0) {
			console.error('Missing required fields:', missingFields);
			return;
		}

		// Extract itemId and itemNo from the combined value or use existing detail values
		const selectedItemValue = String(data.itemId) || '';
		const [itemId, itemNo] = selectedItemValue.includes('_') 
			? selectedItemValue.split('_').map(Number)
			: [selectedDetail.itemId || 1, selectedDetail.itemNo || 1];

		// Create payload for updating incoming detail - match actual API structure
		const payload = {
			id: selectedDetail.id,
			data: {
				incomingId: newIncomingMasterId || selectedDetail.incomingId,
				itemId: itemId,
				itemNo: itemNo,
				itemNumber: selectedDetail.itemNumber || '',
				itemName: selectedDetail.itemName || '',
				itemSpec: selectedDetail.itemSpec || '',
				unit: (data.unit as string)?.substring(0, 3) || 'KG',
				number: Number(uncommaNumber(data.number as string)) || 1,
				currencyUnit: (data.currencyUnit as string) || 'KRW',
				unitPrice: Number(uncommaNumber(data.unitPrice as string)) || 0,
				netPrice: Number(uncommaNumber(data.netPrice as string)) || 0,
				grossPrice:
					Number(uncommaNumber(data.grossPrice as string)) || 0,
				memo: (data.memo as string) || selectedDetail.memo || '',
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

	const handleEditClick = (detail: IncomingDetail) => {
		setSelectedDetail(detail);
		setEditModal(true);
	};

	const handleDeleteClick = (detail: IncomingDetail) => {
		setSelectedDetailToDelete(detail);
		setDeleteDialogOpen(true);
	};

	const populateEditForm = (
		methods: UseFormReturn<Record<string, unknown>>,
		detail: IncomingDetail
	) => {
		const defaultValues: Record<string, string | number> = {
			itemId: `${detail.itemId}_${detail.itemNo}`, // Combine itemId and itemNo for select value
			unit: detail.unit || 'KG',
			number: detail.number?.toString() || '0',
			currencyUnit: detail.currencyUnit || 'KRW',
			unitPrice: detail.unitPrice?.toString() || '0',
			netPrice: detail.netPrice?.toString() || '0',
			grossPrice: detail.grossPrice?.toString() || '0',
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
				title={tCommon('pages.incoming.add')}
				content={
					<DynamicForm
						onFormReady={handleFormReady}
						fields={incomingDetailFormSchema().map((field) => ({
							...field,
							disabled: create.isPending || itemOptionsLoading,
							...(field.name === 'itemId' && { options: itemOptions }),
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
				title={tCommon('pages.incoming.modify')}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							handleFormReady(methods);
							if (selectedDetail && methods) {
								populateEditForm(methods, selectedDetail);
							}
						}}
						fields={incomingDetailEditFormSchema().map((field) => ({
							...field,
							disabled: update.isPending || itemOptionsLoading,
							...(field.name === 'itemId' && { options: itemOptions }),
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
				title={tCommon('pages.incoming.detailDelete')}
				description={tCommon('pages.incoming.detailDeleteConfirm')}
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
						{tCommon('pages.incoming.backToIncoming')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					<div className="border rounded-lg overflow-auto h-[calc(100vh-210px)]">
						<IncomingOrdersRegisterForm
							onSuccess={(res: IncomingMaster) => {
								if (res.id && typeof res.id === 'number') {
									setNewIncomingMasterId(res.id);
								}
							}}
							onReset={() => {
								setNewIncomingMasterId(null);
							}}
						/>
					</div>
					{/* h-[calc(100vh-210px)] */}
					<div className="border rounded-lg overflow-hidden">
						<DatatableComponent
							columns={processedColumns}
							table={table}
							data={listByMasterId.data?.content || []}
							tableTitle={tCommon('pages.incoming.detailInfo')}
							rowCount={listByMasterId.data?.totalElements || 0}
							defaultPageSize={30}
							actionButtons={
								<IncomingOrdersDetailRegisterActions
									newIncomingMasterId={newIncomingMasterId}
									selectedRows={selectedRows}
									listByMasterId={listByMasterId}
									onAddClick={handleAddClick}
									onEditClick={handleEditClick}
									onDeleteClick={handleDeleteClick}
								/>
							}
							useSearch={true}
							toggleRowSelection={toggleRowSelection}
							selectedRows={selectedRows}
							headerOffset="220px"
						/>
					</div>
				</PageTemplate>
			</div>
		</>
	);
};
