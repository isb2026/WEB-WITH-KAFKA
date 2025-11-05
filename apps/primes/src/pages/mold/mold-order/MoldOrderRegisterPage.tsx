import { useRef, useState, useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DraggableDialog, RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { MoldOrderRegisterForm } from './MoldOrderRegisterForm';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { useTranslation } from '@repo/i18n';
import { useMoldOrderMaster } from '@primes/hooks';
import { useMoldOrderDetailByMasterId } from '@primes/hooks/mold/mold-order/useMoldOrderDetailByMasterId';
import { useMoldOrderDetail } from '@primes/hooks/mold/mold-order/useMoldOrderDetail';
import { useMoldOrderDetailColumns } from '@primes/schemas/mold/moldOrderDetailSchemas';
import {
	MoldOrderDetailCreateRequest,
	MoldOrderMasterDto,
} from '@primes/types/mold';
import { MoldOrderDetailRegisterActions } from '../components/MoldOrderDetailRegisterActions';
import { MoldOrderDetailEditForm } from '../components/MoldOrderDetailEditForm';

export type DataTableDataType = {
	id: string;
	[key: string]: any;
};

interface MoldOrderRegisterPageProps {
	mode?: 'create' | 'edit';
	data?: MoldOrderMasterDto;
	onClose?: () => void;
}

export const MoldOrderRegisterPage: React.FC<MoldOrderRegisterPageProps> = ({
	mode: propMode = 'create',
	data: propData,
	onClose,
}) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	
	// location state에서 데이터 읽기
	const locationState = location.state as { mode?: 'create' | 'edit'; masterData?: MoldOrderMasterDto } | null;
	
	// URL 파라미터에서 mode와 id 읽기 (fallback)
	const urlMode = searchParams.get('mode') as 'create' | 'edit' | null;
	
	// 최종 mode 결정 (location state 우선, 없으면 URL 파라미터, 마지막으로 prop 사용)
	const mode = locationState?.mode || urlMode || propMode;
	
	// 최종 데이터 결정 (location state 우선, 없으면 propData 사용)
	const data = locationState?.masterData || propData;

	// Get translated columns
	const detailColumns = useMoldOrderDetailColumns();
	const [newOrderMasterId, setnewOrderMasterId] = useState<number | null>(
		null
	);
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

	// Handle both create and edit modes
	const isEditMode = mode === 'edit';
	const orderMasterId = useMemo(() => {
		return isEditMode
			? typeof data?.id === 'string'
				? parseInt(data.id)
				: Number(data?.id || 0)
			: newOrderMasterId;
	}, [isEditMode, data?.id, newOrderMasterId]);

	// Hooks for update functionality
	const { updateMoldOrderMaster } = useMoldOrderMaster({
		page: 0,
		size: 30,
	});
	
	// 디버깅 로그
	useEffect(() => {
		console.log('=== DATA DEBUG ===');
		console.log('mode:', mode);
		console.log('locationState:', locationState);
		console.log('final data:', data);
	}, [mode, locationState, data]);

	// Fetch detail data based on the current masterId (only if orderMasterId is valid)
	const listByMasterQuery = useMoldOrderDetailByMasterId(
		orderMasterId && orderMasterId > 0 ? orderMasterId : null,
		0,
		30,
		'register-page' // 페이지 식별자
	);
	const listByMasterId = listByMasterQuery?.data || {
		content: [],
		totalPages: 0,
		totalElements: 0,
	};

	// Detail CRUD hooks
	const {
		createMoldOrderDetail,
		updateMoldOrderDetail,
		removeMoldOrderDetail,
	} = useMoldOrderDetail({
		page: 0,
		size: 30,
	});

	// Table management
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		listByMasterId?.content || [],
		processedColumns,
		30,
		listByMasterId?.totalPages || 0,
		0,
		listByMasterId?.totalElements || 0,
		() => {}
	);

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	// No need for master data loading in create mode

	// 디테일 추가 처리
	const handleProductFormSubmit = (data: Record<string, unknown>) => {
		if (!orderMasterId || orderMasterId === 0) {
			return;
		}

		// 안전한 날짜 처리 함수 - 년월을 YYYYMM 형식으로 변환
		const safeDateToMonth = (dateStr: string | undefined): string => {
			if (!dateStr) {
				const now = new Date();
				return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
			}
			try {
				const date = new Date(dateStr);
				if (isNaN(date.getTime())) {
					const now = new Date();
					return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
				}
				return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
			} catch (error) {
				const now = new Date();
				return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
			}
		};

		const payload: MoldOrderDetailCreateRequest = {
			orderMonth: safeDateToMonth(data.orderDate as string),
			accountMonth: safeDateToMonth(new Date().toISOString()),
			itemId: data.itemId ? Number(data.itemId) : 1,
			inDate: data.orderDate as string,
			moldOrderMasterId: orderMasterId,
			moldMasterId: Number(data.moldMasterId),
			progressId: data.progressId ? Number(data.progressId) : 1,
			inMonth: safeDateToMonth(data.orderDate as string),
			num: data.num ? Number(data.num) : 1,
			orderPrice: data.orderPrice ? Number(data.orderPrice) : 0,
			isIn: data.isCompleted === 'true',
			orderAmount: data.orderAmount ? Number(data.orderAmount) : 0,
			vendorId: data.vendorId ? Number(data.vendorId) : 1,
			vendorName: (data.vendorName as string) || '',
		};

		createMoldOrderDetail.mutate([payload], {
			// 배열로 전송
			onSuccess: () => {
				setOpenModal(false);
				// listByMasterQuery.refetch(); // 제거: 훅에서 자동으로 무효화됨
				formMethodsRef.current?.reset();
			},
		});
	};

	// 디테일 수정 처리
	const handleEditFormSubmit = (data: Record<string, unknown>) => {
		if (!selectedDetail?.id || !orderMasterId || orderMasterId === 0)
			return;

		const payload = {
			id: Number(selectedDetail.id),
			data: {
				orderMonth: selectedDetail.orderMonth,
				accountMonth: selectedDetail.accountMonth,
				itemId: selectedDetail.itemId,
				inDate: selectedDetail.inDate,
				moldOrderMasterId: orderMasterId,
				moldMasterId:
					Number(data.moldMasterId) || selectedDetail.moldMasterId,
				progressId: selectedDetail.progressId,
				inMonth: selectedDetail.inMonth,
				num: Number(data.num) || selectedDetail.num,
				orderPrice:
					Number(data.orderPrice) || selectedDetail.orderPrice,
				isIn: data.isCompleted === 'true',
				orderAmount:
					Number(data.orderAmount) || selectedDetail.orderAmount,
				vendorId: Number(data.vendorId) || selectedDetail.vendorId,
				vendorName:
					(data.vendorName as string) || selectedDetail.vendorName,
			},
		};

		updateMoldOrderDetail.mutate(payload, {
			onSuccess: () => {
				setEditModal(false);
				setSelectedDetail(null);
				// listByMasterQuery.refetch(); // 제거: 훅에서 자동으로 무효화됨
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
					// listByMasterQuery.refetch(); // 제거: 훅에서 자동으로 무효화됨
				},
			});
		}
	};

	// 편집 폼 데이터 채우기 (SalesOrderEditPage와 동일한 패턴)
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

	// Modal-specific logic: If onClose is provided, render simplified modal form
	if (onClose) {
		return (
			<div className="max-w-full mx-auto p-4 max-h-[85vh] overflow-auto">
				<MoldOrderRegisterForm
					masterData={isEditMode ? data : undefined}
					updateMaster={
						isEditMode ? (updateMoldOrderMaster as any) : undefined
					}
					isEditMode={isEditMode}
					onSuccess={(res: MoldOrderMasterDto) => {
						if (
							!isEditMode &&
							res.id &&
							typeof res.id === 'number'
						) {
							setnewOrderMasterId(res.id);
						}
						if (onClose) {
							onClose();
						}
					}}
					onReset={() => {
						if (!isEditMode) {
							setnewOrderMasterId(null);
						}
					}}
				/>
			</div>
		);
	}

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={(open: boolean) => {
					setOpenModal(open);
				}}
				title={tCommon('pages.mold.orders.add')}
				content={
					<div className="max-w-2xl">
						<MoldOrderDetailEditForm
							detail={null} // 새로 추가할 상세 데이터
							moldOrderMasterId={orderMasterId || undefined}
							onClose={() => setOpenModal(false)}
							onSuccess={() => {
								// 모달 닫기
								setOpenModal(false);
								// 상세 데이터 새로고침은 훅에서 자동으로 처리됨
							}}
						/>
					</div>
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
					<div className="max-w-2xl">
						<MoldOrderDetailEditForm
							detail={
								selectedDetail
									? {
											id:
												typeof selectedDetail.id ===
												'string'
													? parseInt(
															selectedDetail.id
														)
													: selectedDetail.id,
											tenantId:
												selectedDetail.tenantId || 0,
											isDelete:
												selectedDetail.isDelete ||
												false,
											isUse:
												selectedDetail.isUse || false,
											orderMonth:
												selectedDetail.orderMonth || '',
											accountMonth:
												selectedDetail.accountMonth ||
												'',
											itemId: selectedDetail.itemId || 0,
											inDate: selectedDetail.inDate || '',
											moldOrderMasterId:
												selectedDetail.moldOrderMasterId ||
												orderMasterId ||
												0,
											moldMasterId:
												selectedDetail.moldMasterId ||
												0,
											progressId:
												selectedDetail.progressId || 0,
											inMonth:
												selectedDetail.inMonth || '',
											num: selectedDetail.num || 0,
											orderPrice:
												selectedDetail.orderPrice || 0,
											orderAmount:
												selectedDetail.orderAmount || 0,
											isIn: selectedDetail.isIn || false,
											vendorId:
												selectedDetail.vendorId || 0,
											vendorName:
												selectedDetail.vendorName || '',
											isDev:
												selectedDetail.isDev || false,
											isChange:
												selectedDetail.isChange ||
												false,
											createdBy:
												selectedDetail.createdBy || '',
											createdAt:
												selectedDetail.createdAt || '',
											updatedBy:
												selectedDetail.updatedBy || '',
											updatedAt:
												selectedDetail.updatedAt || '',
										}
									: null
							}
							moldOrderMasterId={orderMasterId || undefined}
							onClose={() => setEditModal(false)}
							onSuccess={() => {
								// 모달 닫기
								setEditModal(false);
								setSelectedDetail(null);
								// 상세 데이터 새로고침은 훅에서 자동으로 처리됨
							}}
						/>
					</div>
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
						onClick={() => navigate('/mold/orders/related-list')}
					>
						<ArrowLeft
							size={16}
							className="text-muted-foreground"
						/>
						{tCommon('pages.mold.orders.backToOrder')}
					</RadixButton>
					{isEditMode && (
						<div className="text-sm text-gray-600">
							{tCommon('pages.mold.orders.edit')}
						</div>
					)}
				</div>
				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
					isLoading={false}
					loadingMessage={undefined}
				>
					<div className="border rounded-lg overflow-auto h-full">
						<MoldOrderRegisterForm
							onSuccess={(res: MoldOrderMasterDto) => {
								if (res.id && typeof res.id === 'number') {
									setnewOrderMasterId(res.id);
								}
							}}
							onReset={() => {
								setnewOrderMasterId(null);
							}}
							masterData={data}
							isEditMode={isEditMode}
							updateMaster={updateMoldOrderMaster as any}
						/>
					</div>
					<div className="border rounded-lg overflow-hidden h-full">
						<DatatableComponent
							columns={processedColumns}
							table={table}
							data={listByMasterId?.content || []}
							tableTitle={tCommon('pages.mold.orders.orderInfo')}
							rowCount={listByMasterId?.totalElements || 0}
							defaultPageSize={30}
							actionButtons={
								<MoldOrderDetailRegisterActions
									newOrderMasterId={orderMasterId}
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
						/>
					</div>
				</PageTemplate>
			</div>
		</>
	);
};

export default MoldOrderRegisterPage;
