import { useEffect, useState, useCallback } from 'react';
import { PageTemplate } from '@primes/templates';
import { RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '@primes/hooks/init/progress/useProgress';
import { useMachineListQuery } from '@primes/hooks/machine/machine/useMachineListQuery';
import { useVendorListQuery } from '@primes/hooks/init/vendor/useVendorListQuery';
import { useProgressVendorsByProgressId } from '@primes/hooks/ini/progressVendor/useProgressVendorsByProgressId';
import { useDeleteProgressVendor } from '@primes/hooks/ini/progressVendor/useDeleteProgressVendor';
import { useTranslation } from '@repo/i18n';
import { useParams } from 'react-router-dom';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
} from '@repo/radix-ui/components';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { IniItemProgressRegisterPage } from './IniItemProgressRegisterPage';
import { IniItemProgressVendorRegisterPage } from './IniItemProgressVendorRegisterPage';
import { IniItemProgressVendorConnectRegisterPage } from './IniItemProgressVendorConnectRegisterPage';
import { IniItemProgressMachineRegisterPage } from './IniItemProgressMachineRegisterPage';
import { IniVendorRegisterPage } from '../vendor/IniVendorRegisterPage';
import { MachineMachineRegisterPage } from '../../machine/machine/MachineMachineRegisterPage';
import { DraggableDialog } from '@repo/radix-ui/components';
import { toast } from 'sonner';
import { size } from 'lodash';

export const IniProgressListPage = () => {
	const { t: tCommon } = useTranslation('common');
	const { t } = useTranslation('dataTable');
	const navigate = useNavigate();

	const [data, setData] = useState<any[]>([]);
	const [machineData, setMachineData] = useState<any[]>([]);
	const [vendorData, setVendorData] = useState<any[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [machineTotalElements, setMachineTotalElements] = useState(0);
	const [vendorTotalElements, setVendorTotalElements] = useState(0);
	const [page, setPage] = useState(0);
	const [machinePage, setMachinePage] = useState(0);
	const [vendorPage, setVendorPage] = useState(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [machinePageCount, setMachinePageCount] = useState<number>(0);
	const [vendorPageCount, setVendorPageCount] = useState<number>(0);
	const [selectedProgress, setSelectedProgress] = useState<any>(null);
	const [openModal, setOpenModal] = useState(false);
	const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
	const [openVendorModal, setOpenVendorModal] = useState(false);
	const [openMachineModal, setOpenMachineModal] = useState(false);
	const [openVendorConnectionModal, setOpenVendorConnectionModal] =
		useState(false);
	const [openProgressVendorConnectModal, setOpenProgressVendorConnectModal] =
		useState(false);
	const [openProgressVendorEditModal, setOpenProgressVendorEditModal] =
		useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openVendorDeleteDialog, setOpenVendorDeleteDialog] = useState(false);
	const [selectedVendorForEdit, setSelectedVendorForEdit] =
		useState<any>(null);
	const PAGE_SIZE = 30;
	const { productId } = useParams();

	const ProgressInfoGridKeys = [
		{ key: 'progressName', label: t('columns.progressName') },
		{ key: 'progressOrder', label: t('columns.progressOrder') },
		{ key: 'isOutsourcing', label: t('columns.isOutsourcing') },
		{ key: 'vendorName', label: t('columns.vendorName') },
		{ key: 'unitCost', label: t('columns.unitCost') },
		{ key: 'createdAt', label: t('columns.createdAt') },
		{ key: 'createdBy', label: t('columns.createdBy') },
		{ key: 'updatedAt', label: t('columns.updatedAt') },
		{ key: 'updatedBy', label: t('columns.updatedBy') },
	];

	const tableColumns = [
		{
			header: t('columns.progressOrder'),
			accessorKey: 'progressOrder',
			align: 'center',
			size: 100,
		},
		{
			header: t('columns.progressName'),
			accessorKey: 'progressName',
			size: 150,
			align: 'center',
		},
		{
			header: t('columns.itemInfo'),
			size: 200,
			cell: ({ row }: { row: { original: any } }) => {
				const progress = row.original;
				const item = progress.item;

				if (!item) {
					return <span className="text-gray-400">-</span>;
				}

				return (
					<div className="text-left">
						<div className="font-medium text-sm">
							{item.itemNumber}
						</div>
						<div className="text-xs text-gray-600">
							{item.itemName}
						</div>
						{item.itemSpec && (
							<div className="text-xs text-gray-500">
								{item.itemSpec}
							</div>
						)}
					</div>
				);
			},
		},
		// 새로운 필드들 추가
		{
			header: t('columns.progressTypeCode'),
			accessorKey: 'progressTypeCode',
			size: 120,
			align: 'center',
		},
		{
			header: t('columns.progressTypeName'),
			accessorKey: 'progressTypeName',
			size: 150,
			align: 'center',
		},
		{
			header: t('columns.progressRealName'),
			accessorKey: 'progressRealName',
			size: 150,
			align: 'center',
		},
		{
			header: t('columns.isOutsourcing'),
			accessorKey: 'isOutsourcing',
			size: 100,
			align: 'center',
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? '외주' : '사내';
			},
		},
		{
			header: t('columns.defaultCycleTime'),
			accessorKey: 'defaultCycleTime',
			size: 120,
			align: 'right',
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? `${value}분` : '-';
			},
		},
		{
			header: t('columns.optimalProgressInventoryQty'),
			accessorKey: 'optimalProgressInventoryQty',
			size: 150,
			align: 'right',
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			header: t('columns.safetyProgressInventoryQty'),
			accessorKey: 'safetyProgressInventoryQty',
			size: 150,
			align: 'right',
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			header: t('columns.createdAt'),
			accessorKey: 'createdAt',
			size: 150,
			align: 'center',
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			header: t('columns.createdBy'),
			accessorKey: 'createdBy',
			size: 100,
			align: 'center',
		},
	];

	const machineTableColumns = [
		{
			header: t('columns.machineName'),
			accessorKey: 'machineName',
			size: 120,
			align: 'center',
		},
		{
			header: t('columns.machineCode'),
			accessorKey: 'machineCode',
			size: 120,
			align: 'center',
		},
		{
			header: t('columns.machineType'),
			accessorKey: 'machineType',
			size: 120,
			align: 'center',
		},
		{
			header: t('columns.manufacturer'),
			accessorKey: 'manufacturer',
			size: 120,
			align: 'center',
		},
		{
			header: t('columns.modelName'),
			accessorKey: 'modelName',
			size: 120,
			align: 'center',
		},
		{
			header: t('columns.serialNumber'),
			accessorKey: 'serialNumber',
			size: 140,
			align: 'center',
		},
		{
			header: t('columns.installDate'),
			accessorKey: 'installDate',
			size: 120,
			align: 'center',
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			header: t('columns.status'),
			accessorKey: 'status',
			size: 100,
			align: 'center',
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value === 'ACTIVE'
					? '활성'
					: value === 'INACTIVE'
						? '비활성'
						: value || '-';
			},
		},
		{
			header: t('columns.description'),
			accessorKey: 'description',
			size: 150,
			align: 'left',
		},
	];

	const vendorTableColumns = [
		{
			header: t('columns.compName'),
			accessorKey: 'compName',
			size: 150,
			align: 'left',
		},
		{
			header: t('columns.compCode'),
			accessorKey: 'compCode',
			size: 120,
			align: 'center',
		},
		{
			header: t('columns.compType'),
			accessorKey: 'compType',
			size: 100,
			align: 'center',
		},
		{
			header: t('columns.ceoName'),
			accessorKey: 'ceoName',
			size: 100,
			align: 'center',
		},
		{
			header: t('columns.telNumber'),
			accessorKey: 'telNumber',
			size: 120,
			align: 'center',
		},
		{
			header: t('columns.compEmail'),
			accessorKey: 'compEmail',
			size: 180,
			align: 'left',
		},
		{
			header: t('columns.licenseNo'),
			accessorKey: 'licenseNo',
			size: 140,
			align: 'center',
		},
		{
			header: t('columns.quantity'),
			accessorKey: 'quantity',
			size: 100,
			align: 'right',
		},
		{
			header: t('columns.unit'),
			accessorKey: 'unit',
			size: 80,
			align: 'center',
		},
		{
			header: t('columns.unitCost'),
			accessorKey: 'unitCost',
			size: 120,
			align: 'right',
		},
		{
			header: t('columns.isDefaultVendor'),
			accessorKey: 'isDefaultVendor',
			size: 100,
			align: 'center',
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? '기본' : '일반';
			},
		},
	];

	const { list, remove, update } = useProgress({
		page: page,
		size: PAGE_SIZE,
		searchRequest: {
			itemId: Number(productId?.trim()),
		},
	});

	// 거래처 연결 삭제 훅
	const removeProgressVendor = useDeleteProgressVendor();

	// 기계 목록 조회 (isOutsourcing이 0일 때만 활성화)
	const machineListQuery = useMachineListQuery({
		page: machinePage,
		size: PAGE_SIZE,
		searchRequest: {
			// 기계 목록 전체 조회 (필요시 추가 필터링 가능)
		},
	});

	// 거래처 목록 조회 (외주 작업일 때 해당 공정의 연결된 vendor 목록 조회)
	const progressVendorsQuery = useProgressVendorsByProgressId(
		selectedProgress?.id,
		selectedProgress?.isOutsourcing === true && !!selectedProgress?.id
	);

	// 기존 vendor 목록 조회 (fallback용)
	const vendorListQuery = useVendorListQuery({
		page: vendorPage,
		size: PAGE_SIZE,
		searchRequest:
			selectedProgress?.isOutsourcing === true &&
			selectedProgress?.vendorId
				? {
						id: selectedProgress.vendorId,
					}
				: {},
	});

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		tableColumns,
		PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		() => {}
	);

	const {
		table: machineTable,
		selectedRows: machineSelectedRows,
		toggleRowSelection: machineToggleRowSelection,
	} = useDataTable(
		machineData,
		machineTableColumns,
		PAGE_SIZE,
		machinePageCount,
		machinePage,
		machineTotalElements,
		() => {}
	);

	const {
		table: vendorTable,
		selectedRows: vendorSelectedRows,
		toggleRowSelection: vendorToggleRowSelection,
	} = useDataTable(
		vendorData,
		vendorTableColumns,
		PAGE_SIZE,
		vendorPageCount,
		vendorPage,
		vendorTotalElements,
		() => {}
	);

	useEffect(() => {
		if (list.data) {
			const sortedData = list.data.content?.sort(
				(a: any, b: any) => a.progressOrder - b.progressOrder
			);
			setData(sortedData || []);
			setTotalElements(list.data?.totalElements || 0);
			setPageCount(list.data?.totalPages || 0);

			// 데이터가 있고 현재 선택된 항목이 없으면 첫 번째 항목 자동 선택
			if (
				sortedData &&
				sortedData.length > 0 &&
				selectedRows.size === 0
			) {
				toggleRowSelection('0'); // 첫 번째 행 선택
			}
		}
	}, [list.data, selectedRows.size, toggleRowSelection]);

	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currenrRow: any = data[rowIndex];

			setSelectedProgress(currenrRow);
		} else {
			setSelectedProgress(null);
		}
	}, [selectedRows]);

	// 선택된 공정에 따른 데이터 업데이트
	useEffect(() => {
		if (!selectedProgress) {
			// 선택된 공정이 없으면 데이터 초기화
			setMachineData([]);
			setVendorData([]);
			setMachineTotalElements(0);
			setVendorTotalElements(0);
			setMachinePageCount(0);
			setVendorPageCount(0);
			return;
		}

		if (selectedProgress.isOutsourcing === false) {
			// 사내 공정 - 기계 데이터 사용
			if (machineListQuery.data) {
				setMachineData(machineListQuery.data.content || []);
				setMachineTotalElements(
					machineListQuery.data.totalElements || 0
				);
				setMachinePageCount(machineListQuery.data?.totalPages || 0);
			}
			// 거래처 데이터 초기화
			setVendorData([]);
			setVendorTotalElements(0);
			setVendorPageCount(0);
		} else if (selectedProgress.isOutsourcing === true) {
			// 외주 작업 - 해당 공정에 연결된 거래처 데이터 사용
			if (progressVendorsQuery.data) {
				// 새로운 API에서 가져온 vendor 목록 사용
				const vendorList = Array.isArray(progressVendorsQuery.data)
					? progressVendorsQuery.data
					: progressVendorsQuery.data.content || [];

				// isDefaultVendor가 true인 항목을 최상단에 정렬
				const sortedVendorList = vendorList.sort((a: any, b: any) => {
					// isDefaultVendor가 true인 항목이 먼저 오도록 정렬
					if (a.isDefaultVendor && !b.isDefaultVendor) return -1;
					if (!a.isDefaultVendor && b.isDefaultVendor) return 1;
					// 둘 다 같은 경우 거래처명으로 정렬
					return (a.compName || '').localeCompare(b.compName || '');
				});

				setVendorData(sortedVendorList);
				setVendorTotalElements(sortedVendorList.length);
				setVendorPageCount(sortedVendorList.length > 0 ? 1 : 0);
			} else if (vendorListQuery.data && selectedProgress.vendorId) {
				// fallback: 기존 API 사용 (vendorId가 있는 경우)
				const filteredVendorData = (
					vendorListQuery.data.content || []
				).filter(
					(vendor: any) => vendor.id === selectedProgress.vendorId
				);

				// isDefaultVendor가 true인 항목을 최상단에 정렬
				const sortedFilteredVendorData = filteredVendorData.sort(
					(a: any, b: any) => {
						if (a.isDefaultVendor && !b.isDefaultVendor) return -1;
						if (!a.isDefaultVendor && b.isDefaultVendor) return 1;
						return (a.compName || '').localeCompare(
							b.compName || ''
						);
					}
				);

				setVendorData(sortedFilteredVendorData);
				setVendorTotalElements(sortedFilteredVendorData.length);
				setVendorPageCount(sortedFilteredVendorData.length > 0 ? 1 : 0);
			} else {
				// 연결된 vendor가 없는 경우
				setVendorData([]);
				setVendorTotalElements(0);
				setVendorPageCount(0);
			}
			// 기계 데이터 초기화
			setMachineData([]);
			setMachineTotalElements(0);
			setMachinePageCount(0);
		}
	}, [
		selectedProgress,
		machineListQuery.data,
		vendorListQuery.data,
		progressVendorsQuery.data,
	]);

	// 삭제 확인 함수
	const handleDeleteConfirm = () => {
		if (selectedProgress) {
			remove.mutate(Number(selectedProgress.id), {
				onSuccess: () => {
					// 삭제 성공 후 선택 상태 초기화
					if (selectedRows.size > 0) {
						// 현재 선택된 행 해제
						const selectedRowIndex = Array.from(selectedRows)[0];
						toggleRowSelection(selectedRowIndex);
					}
					// 잠시 후 첫 번째 행 자동 선택 (데이터 새로고침 후)
					setTimeout(() => {
						if (data.length > 0) {
							toggleRowSelection('0');
						}
					}, 100);
				},
			});
		}
		setOpenDeleteDialog(false);
	};

	// 거래처 연결 삭제 확인 함수
	const handleVendorDeleteConfirm = () => {
		if (vendorSelectedRows.size > 0) {
			const selectedRowIndex = Array.from(vendorSelectedRows)[0];
			const selectedVendor = vendorData[parseInt(selectedRowIndex)];

			// 복합키 확인: progressId와 vendorId
			const progressId = selectedProgress?.id;
			const vendorId = selectedVendor?.id || selectedVendor?.vendorId;

			if (progressId && vendorId) {
				removeProgressVendor.mutate(
					{
						progressId: Number(progressId),
						vendorId: Number(vendorId),
					},
					{
						onSuccess: () => {
							// 삭제 성공 후 선택 상태 초기화
							if (vendorSelectedRows.size > 0) {
								const selectedRowIndex =
									Array.from(vendorSelectedRows)[0];
								vendorToggleRowSelection(selectedRowIndex);
							}
							// 데이터 새로고침을 위해 progressVendorsQuery 재실행
							if (selectedProgress?.id) {
								// 쿼리 무효화로 자동 새로고침
							}
						},
					}
				);
			} else {
				toast.error(
					'삭제할 연결 정보를 찾을 수 없습니다. (progressId 또는 vendorId 누락)'
				);
			}
		}
		setOpenVendorDeleteDialog(false);
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={`${tCommon('tabs.titles.progress')} ${
					modalMode === 'create' ? tCommon('add') : tCommon('edit')
				}`}
				content={
					<IniItemProgressRegisterPage
						onClose={() => {
							setOpenModal(false);
							setSelectedProgress(null);
							if (selectedRows.size > 0) {
								toggleRowSelection(Array.from(selectedRows)[0]);
							}
						}}
						mode={modalMode}
						selectedProgress={selectedProgress}
						productId={productId ?? ''}
						progressData={data}
					/>
				}
			/>
			{/* 거래처 등록 모달 */}
			<DraggableDialog
				open={openVendorConnectionModal}
				onOpenChange={setOpenVendorConnectionModal}
				title="거래처 등록"
				content={
					<IniItemProgressVendorRegisterPage
						onClose={() => {
							setOpenVendorConnectionModal(false);
						}}
						itemId={selectedProgress?.itemId || productId}
						productName={`제품 ID: ${selectedProgress?.itemId || productId}`}
					/>
				}
			/>
			{/* 공정-거래처 연결 등록 모달 */}
			<DraggableDialog
				open={openProgressVendorConnectModal}
				onOpenChange={setOpenProgressVendorConnectModal}
				title="공정-거래처 연결"
				content={
					<IniItemProgressVendorConnectRegisterPage
						onClose={() => {
							setOpenProgressVendorConnectModal(false);

							// 생성 후 선택 해제
							if (vendorSelectedRows.size > 0) {
								vendorSelectedRows.forEach((rowId) => {
									vendorToggleRowSelection(rowId);
								});
							}
						}}
						progressId={selectedProgress?.id}
						mode="create"
					/>
				}
			/>
			{/* 기계 등록 모달 */}
			<DraggableDialog
				open={openMachineModal}
				onOpenChange={setOpenMachineModal}
				title="사내 설비 등록"
				content={
					<IniItemProgressMachineRegisterPage
						onClose={() => {
							setOpenMachineModal(false);

							// 생성 후 선택 해제
							if (machineSelectedRows.size > 0) {
								machineSelectedRows.forEach((rowId) => {
									machineToggleRowSelection(rowId);
								});
							}
						}}
						progressId={selectedProgress?.id}
						productName={`제품 ID: ${selectedProgress?.itemId || productId}`}
						progressName={selectedProgress?.progressName}
						mode="create"
					/>
				}
			/>
			{/* 공정-거래처 연결 수정 모달 */}
			<DraggableDialog
				open={openProgressVendorEditModal}
				onOpenChange={setOpenProgressVendorEditModal}
				title="공정-거래처 연결 수정"
				content={
					<IniItemProgressVendorConnectRegisterPage
						onClose={() => {
							setOpenProgressVendorEditModal(false);
							setSelectedVendorForEdit(null);

							// 수정 후 선택 해제
							if (vendorSelectedRows.size > 0) {
								vendorSelectedRows.forEach((rowId) => {
									vendorToggleRowSelection(rowId);
								});
							}
						}}
						progressId={selectedProgress?.id}
						mode="edit"
						selectedVendorData={selectedVendorForEdit}
					/>
				}
			/>
			{/* 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
				onConfirm={handleDeleteConfirm}
				isDeleting={remove.isPending}
				title="공정 삭제"
				description={`선택한 공정 '${selectedProgress?.progressName}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>
			{/* 거래처 연결 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={openVendorDeleteDialog}
				onOpenChange={setOpenVendorDeleteDialog}
				onConfirm={handleVendorDeleteConfirm}
				isDeleting={removeProgressVendor.isPending}
				title="거래처 연결 삭제"
				description="선택한 거래처 연결을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다."
			/>
			<div className="max-w-full mx-auto p-4 h-full flex flex-col">
				<h2 className="text-xl font-bold mb-3">
					{tCommon('pages.titles.itemProgressList')}
				</h2>

				<div className="flex justify-between items-center gap-2 mb-3">
					<RadixButton
						className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
						onClick={() => navigate(-1)}
					>
						<ArrowLeft
							size={16}
							className="text-muted-foreground"
						/>
						{tCommon('pages.titles.itemList')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					<div className="border rounded-lg overflow-auto">
						<DatatableComponent
							table={table}
							columns={tableColumns}
							data={data}
							tableTitle="공정 목록"
							rowCount={totalElements}
							useSearch={true}
							enableSingleSelect={true}
							selectedRows={selectedRows}
							toggleRowSelection={toggleRowSelection}
							searchSlot={
								<ActionButtonsComponent
									useCreate={true}
									useRemove={true}
									useEdit={true}
									create={() => {
										setModalMode('create');
										setOpenModal(true);
									}}
									remove={() => {
										if (selectedProgress) {
											setOpenDeleteDialog(true);
										} else {
											toast.error(
												'삭제할 공정을 선택해주세요.'
											);
										}
									}}
									edit={() => {
										setModalMode('update');
										setOpenModal(true);
									}}
									visibleText={false}
									classNames={{
										container: 'ml-auto',
									}}
								/>
							}
						/>
					</div>
					<div className="border rounded-lg overflow-hidden">
						<div className="border rounded-lg h-full">
							<RadixTabsRoot
								defaultValue="info"
								className="flex flex-1 flex-col h-full"
							>
								<RadixTabsList className="inline-flex h-10 items-center w-full justify-start border-b">
									{/* 현황 */}
									<RadixTabsTrigger
										key="info"
										value="info"
										className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
									>
										{tCommon('tabs.labels.list')}
									</RadixTabsTrigger>
									{/* 검사목록 */}
									<RadixTabsTrigger
										key="checkList"
										value="checkList"
										className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
									>
										{tCommon('tabs.labels.checkList')}
									</RadixTabsTrigger>
									{/* 댓글 */}
									<RadixTabsTrigger
										key="comment"
										value="comment"
										className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
									>
										{tCommon('tabs.labels.comment')}
									</RadixTabsTrigger>
									{/* 첨부파일 */}
									<RadixTabsTrigger
										key="files"
										value="files"
										className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
									>
										{tCommon('tabs.labels.attachments')}
									</RadixTabsTrigger>
								</RadixTabsList>
								{/* 현황 */}
								<RadixTabsContent
									key="info"
									value="info"
									className="flex flex-1 flex-col h-full"
								>
									<div className="flex-1 flex flex-col h-full">
										<InfoGrid
											columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 "
											classNames={{
												container:
													'rounded shadow-sm mb-2 border-b',
												item: 'flex gap-2 items-center p-2',
												label: 'text-gray-700 text-sm',
												value: 'font-bold text-sm',
											}}
											data={selectedProgress}
											keys={ProgressInfoGridKeys}
										/>
										<div className="flex-1 overflow-auto ">
											{!selectedProgress ? (
												<div className="flex items-center justify-center h-32 text-gray-500">
													공정을 선택해주세요
												</div>
											) : selectedProgress.isOutsourcing ===
											  false ? (
												<DatatableComponent
													table={machineTable}
													columns={
														machineTableColumns
													}
													data={machineData}
													tableTitle="사내 설비 정보"
													rowCount={
														machineTotalElements
													}
													enableSingleSelect={true}
													selectedRows={
														machineSelectedRows
													}
													toggleRowSelection={
														machineToggleRowSelection
													}
													headerOffset="374px"
													searchSlot={
														<ActionButtonsComponent
															useCreate={true}
															useRemove={true}
															useEdit={true}
															create={() => {
																// 사내 공정 - 설비 등록
																setOpenMachineModal(
																	true
																);
															}}
															remove={() => {}}
															edit={() => {}}
															visibleText={false}
															classNames={{
																container:
																	'ml-auto',
															}}
														/>
													}
												/>
											) : selectedProgress.isOutsourcing ===
											  true ? (
												<DatatableComponent
													table={vendorTable}
													columns={vendorTableColumns}
													data={vendorData}
													tableTitle="외주 업체 정보"
													rowCount={
														vendorTotalElements
													}
													enableSingleSelect={true}
													selectedRows={
														vendorSelectedRows
													}
													toggleRowSelection={
														vendorToggleRowSelection
													}
													headerOffset="374px"
													searchSlot={
														<ActionButtonsComponent
															useCreate={true}
															useRemove={true}
															useEdit={true}
															create={() => {
																// 외주 공정 - 거래처 연결 등록
																setOpenProgressVendorConnectModal(
																	true
																);
															}}
															remove={() => {
																if (
																	vendorSelectedRows.size >
																	0
																) {
																	const selectedRowIndex =
																		Array.from(
																			vendorSelectedRows
																		)[0];
																	const selectedVendor =
																		vendorData[
																			parseInt(
																				selectedRowIndex
																			)
																		];
																	if (
																		selectedVendor?.progressId
																	) {
																		setOpenVendorDeleteDialog(
																			true
																		);
																	}
																} else {
																	toast.error(
																		'삭제할 거래처를 선택해주세요.'
																	);
																}
															}}
															edit={() => {
																if (
																	vendorSelectedRows.size >
																	0
																) {
																	const selectedRowIndex =
																		Array.from(
																			vendorSelectedRows
																		)[0];
																	const selectedVendor =
																		vendorData[
																			parseInt(
																				selectedRowIndex
																			)
																		];
																	if (
																		selectedVendor
																	) {
																		setSelectedVendorForEdit(
																			selectedVendor
																		);
																		setOpenProgressVendorEditModal(
																			true
																		);
																	}
																} else {
																	toast.error(
																		'수정할 거래처를 선택해주세요.'
																	);
																}
															}}
															visibleText={false}
															classNames={{
																container:
																	'ml-auto',
															}}
														/>
													}
												/>
											) : (
												<div className="flex flex-col items-center justify-center h-32 text-gray-500">
													<div className="text-sm">
														알 수 없는 공정
														유형입니다
													</div>
													<div className="text-xs mt-1 text-gray-400">
														isOutsourcing 값:{' '}
														{
															selectedProgress.isOutsourcing
														}
													</div>
												</div>
											)}
										</div>
									</div>
								</RadixTabsContent>
								{/* 검사목록 */}
								<RadixTabsContent
									key="checkList"
									value="checkList"
									className="flex-1"
								>
									<div className="flex h-full p-4">
										{tCommon('tabs.labels.checkList')}
									</div>
								</RadixTabsContent>
								{/* 댓글 */}
								<RadixTabsContent
									key="comment"
									value="comment"
									className="flex-1"
								>
									<div className="min-h-[120px] p-4">
										{tCommon('tabs.labels.comment')}
									</div>
								</RadixTabsContent>
								{/* 첨부파일 */}
								<RadixTabsContent
									key="files"
									value="files"
									className="flex-1"
								>
									<div className="min-h-[120px] p-4">
										{tCommon('tabs.labels.attachments')}
									</div>
								</RadixTabsContent>
							</RadixTabsRoot>
						</div>
					</div>
				</PageTemplate>
			</div>
		</>
	);
};
