import { useRef, useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DraggableDialog, RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { MoldOrderRegisterForm } from './MoldOrderRegisterForm';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { useTranslation } from '@repo/i18n';
import { useMoldOrderMaster } from '@primes/hooks';
import { useGetMoldOrderMasterById } from '@primes/hooks/mold/mold-order/useGetMoldOrderMasterById';
import { useMoldOrderDetailByMasterId } from '@primes/hooks/mold/mold-order/useMoldOrderDetailByMasterId';
import { useMoldOrderDetail } from '@primes/hooks/mold/mold-order/useMoldOrderDetail';
import {
	useMoldOrderDetailFormSchema,
	useMoldOrderDetailEditFormSchema,
	useMoldOrderDetailColumns,
} from '@primes/schemas/mold/moldOrderDetailSchemas';
import { MoldOrderDetailCreateRequest } from '@primes/types/mold';

export type DataTableDataType = {
	id: string;
	[key: string]: any;
};

export const MoldOrderEditPage = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	// Get translated columns and form schemas
	const detailColumns = useMoldOrderDetailColumns();
	const moldOrderDetailFormSchema = useMoldOrderDetailFormSchema();
	const moldOrderDetailEditFormSchema = useMoldOrderDetailEditFormSchema();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	// Handle missing ID
	if (!id) {
		return (
			<div className="p-4">
				<h1 className="text-2xl font-bold text-red-600">
					No ID provided in URL
				</h1>
				<button
					onClick={() => navigate(-1)}
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
				>
					Go Back
				</button>
			</div>
		);
	}
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const processedColumns =
		useDataTableColumns<DataTableDataType>(detailColumns);
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

	// Handle large number IDs - keep as string if too large, otherwise convert to number
	const rawId = id || '0';
	const orderMasterId = rawId.length > 15 ? rawId : Number(rawId);

	// 편집 모드 전용 hooks
	const { updateMoldOrderMaster } = useMoldOrderMaster({
		page: 0,
		size: 30,
	});
	const getById = useGetMoldOrderMasterById(orderMasterId);

	// 마스터 ID로 디테일 조회
	const listByMasterQuery = useMoldOrderDetailByMasterId(
		orderMasterId,
		0,
		30
	);
	const listByMasterId = listByMasterQuery.data;

	// Detail CRUD hooks
	const {
		createMoldOrderDetail,
		updateMoldOrderDetail,
		removeMoldOrderDetail,
	} = useMoldOrderDetail({
		page: 0,
		size: 30,
	});

	// Initialize useDataTable
	const { table, toggleRowSelection, selectedRows } = useDataTable(
		listByMasterId?.content || listByMasterId?.data || [],
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
		if (
			(typeof orderMasterId === 'number' && orderMasterId > 0) ||
			(typeof orderMasterId === 'string' && orderMasterId !== '0')
		) {
			// The query will automatically run when orderMasterId changes
		}
	}, [orderMasterId]);

	// 디테일 추가 처리
	const handleProductFormSubmit = (data: Record<string, unknown>) => {
		const payload = {
			moldOrderMasterId:
				typeof orderMasterId === 'string'
					? Number(orderMasterId)
					: orderMasterId,
			moldCode: data.moldCode as string,
			moldName: data.moldName as string,
			moldNumber: (data.moldNumber || data.moldSize) as string,
			moldStandard: (data.moldStandard || data.moldType) as string,
			orderMonth: new Date(data.orderDate as string)
				.toISOString()
				.substring(0, 7),
			accountMonth: new Date().toISOString().substring(0, 7),
			itemId: Number(data.itemId) || 1,
			inDate: data.orderDate as string,
			moldMasterId: 1, // Default value
			progressId: 1, // Default value
			inMonth: new Date(data.orderDate as string)
				.toISOString()
				.substring(0, 7),
			num: Number(data.orderQuantity) || 1,
			inNum: Number(data.orderQuantity) || 1,
			orderPrice: Number(data.unitPrice) || 0,
			inPrice: Number(data.unitPrice) || 0,
			isIn: data.isCompleted === 'true',
			orderAmount: Number(data.totalPrice) || 0,
			inAmount: Number(data.totalPrice) || 0,
			vendorId: Number(data.vendorId) || 1, // Add required vendorId
			vendorName: (data.vendorName as string) || 'Default Vendor', // Add required vendorName
			ownVendorId: 1, // Default value
			isDev: false,
			isChange: false,
		};

		createMoldOrderDetail.mutate([payload], {
			onSuccess: () => {
				setOpenModal(false);
				listByMasterQuery.refetch();
				formMethodsRef.current?.reset();
			},
		});
	};

	// 디테일 수정 처리
	const handleEditFormSubmit = (data: Record<string, unknown>) => {
		if (!selectedDetail?.id) return;

		const payload = {
			id: Number(selectedDetail.id),
			data: {
				moldOrderMasterId:
					typeof orderMasterId === 'string'
						? Number(orderMasterId)
						: orderMasterId,
				moldCode: data.moldCode as string,
				moldName: data.moldName as string,
				moldType: data.moldType as string,
				moldSize: data.moldSize as string,
				cavity: Number(data.cavity),
				orderQuantity: Number(data.orderQuantity),
				unitPrice: Number(data.unitPrice),
				totalPrice: Number(data.totalPrice),
				orderDate: data.orderDate as string,
				expectedDeliveryDate: data.expectedDeliveryDate as string,
				actualDeliveryDate: data.actualDeliveryDate as string,
				isCompleted: data.isCompleted === 'true',
			},
		};

		updateMoldOrderDetail.mutate(payload, {
			onSuccess: () => {
				setEditModal(false);
				setSelectedDetail(null);
				listByMasterQuery.refetch();
			},
		});
	};

	// 액션 버튼 핸들러들
	const handleAddClick = () => {
		setOpenModal(true);
	};

	const handleEditClick = () => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = parseInt(Array.from(selectedRows)[0]);
			const selectedDetailData = (listByMasterId?.content ||
				listByMasterId?.data ||
				[])[selectedRowIndex];
			setSelectedDetail(selectedDetailData);
			setEditModal(true);
		}
	};

	const handleDeleteClick = () => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = parseInt(Array.from(selectedRows)[0]);
			const selectedDetailData = (listByMasterId?.content ||
				listByMasterId?.data ||
				[])[selectedRowIndex];
			setSelectedDetailToDelete(selectedDetailData);
			setDeleteDialogOpen(true);
		}
	};

	const handleDeleteConfirm = () => {
		if (selectedDetailToDelete?.id) {
			removeMoldOrderDetail.mutate([Number(selectedDetailToDelete.id)], {
				onSuccess: () => {
					setDeleteDialogOpen(false);
					setSelectedDetailToDelete(null);
					listByMasterQuery.refetch();
				},
			});
		}
	};

	// 편집 폼 데이터 채우기
	const populateEditForm = (
		methods: UseFormReturn<Record<string, unknown>>,
		detail: DataTableDataType
	) => {
		Object.entries(detail).forEach(([key, value]) => {
			if (key === 'isCompleted') {
				methods.setValue(key, value ? 'true' : 'false');
			} else {
				methods.setValue(key, value);
			}
		});
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={(open: boolean) => {
					setOpenModal(open);
				}}
				title={tCommon('pages.mold.orders.add')}
				content={
					<DynamicForm
						onFormReady={handleFormReady}
						fields={moldOrderDetailFormSchema.map((field: any) => ({
							...field,
							disabled: createMoldOrderDetail.isPending,
						}))}
						onSubmit={handleProductFormSubmit}
						submitButtonText={
							createMoldOrderDetail.isPending
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
				title={tCommon('pages.mold.orders.modify')}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							handleFormReady(methods);
							if (selectedDetail && methods) {
								populateEditForm(methods, selectedDetail);
							}
						}}
						fields={moldOrderDetailEditFormSchema.map(
							(field: any) => ({
								...field,
								disabled: updateMoldOrderDetail.isPending,
							})
						)}
						onSubmit={handleEditFormSubmit}
						submitButtonText={
							updateMoldOrderDetail.isPending
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
				isDeleting={removeMoldOrderDetail.isPending}
				description={tCommon('pages.mold.orders.detailDeleteConfirm')}
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
						{tCommon('pages.mold.orders.backToOrder')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					<div className="border rounded-lg overflow-auto h-full">
						<MoldOrderRegisterForm
							masterData={getById.data}
							updateMaster={updateMoldOrderMaster as any}
							isEditMode={true}
						/>
					</div>
					<div className="border rounded-lg overflow-hidden h-full">
						<DatatableComponent
							columns={processedColumns}
							table={table}
							data={
								listByMasterId?.content ||
								listByMasterId?.data ||
								[]
							}
							tableTitle={tCommon('pages.mold.orders.orderInfo')}
							rowCount={
								listByMasterId?.totalElements ||
								(listByMasterId?.data || []).length
							}
							defaultPageSize={30}
							actionButtons={
								<div className="flex gap-2">
									<RadixButton
										onClick={handleAddClick}
										disabled={
											createMoldOrderDetail.isPending
										}
										className="bg-Colors-Brand-700 text-white hover:bg-Colors-Brand-800"
									>
										{tCommon('pages.mold.orders.add')}
									</RadixButton>
									<RadixButton
										onClick={handleEditClick}
										disabled={
											selectedRows.size === 0 ||
											updateMoldOrderDetail.isPending
										}
										variant="outline"
									>
										{tCommon('pages.mold.orders.modify')}
									</RadixButton>
									<RadixButton
										onClick={handleDeleteClick}
										disabled={
											selectedRows.size === 0 ||
											removeMoldOrderDetail.isPending
										}
										variant="outline"
									>
										{tCommon('pages.mold.orders.delete')}
									</RadixButton>
								</div>
							}
							useSearch={true}
							toggleRowSelection={toggleRowSelection}
							selectedRows={selectedRows}
						/>
					</div>
				</PageTemplate>
			</div>
		</>
	);
};

export default MoldOrderEditPage;
