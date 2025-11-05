import { useRef, useState, useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnConfig, useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { ProductionMaterialOutgoingRegisterForm } from './ProductionMaterialOutgoingRegisterForm';
import { useTranslation } from '@repo/i18n';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { MaterialOutgoingDetailRegisterActions } from '@primes/pages/production/components/MaterialOutgoingDetailRegisterActions';
import { MaterialOutgoingAddModal } from './MaterialOutgoingAddModal';
import { toast } from 'sonner';
import { WorkingInLot } from '@primes/types/production/working';
import { MbomListDto } from '@primes/types/ini/mbom';
import { useCommandListQuery } from '@primes/hooks/production/command/useCommandListQuery';

export const ProductionMaterialOutgoingRegisterPage = () => {
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<Record<string, unknown>> | null>(null);
	const navigate = useNavigate();

	// Material outgoing columns configuration - WorkingInLot 데이터에 맞게 수정
	const useMaterialOutgoingColumns = (): any => {
		const { t } = useTranslation('dataTable');

		return [
			{
				accessorKey: 'itemNumber',
				header: t('columns.itemNumber'),
				size: 150,
				minSize: 120,
				cell: ({ row }: { row: any }) => {
					return row.original.item.itemNumber ? row.original.item.itemNumber : '-';
				},
			},
			{
				accessorKey: 'itemName',
				header: t('columns.itemName'),
				size: 180,
				minSize: 140,
				cell: ({ row }: { row: any }) => {
					return row.original.item.itemName ? row.original.item.itemName : '-';
				},
			},
			{
				accessorKey: 'itemSpec',
				header: t('columns.itemSpec'),
				size: 120,
				minSize: 100,
				cell: ({ row }: { row: any }) => {
					return row.original.item.itemSpec ? row.original.item.itemSpec : '-';
				},
			},
			{
				accessorKey: 'itemProgress',
				header: t('columns.progressName'),
				size: 120,
				minSize: 100,
				cell: ({ row }: { row: any }) => {
					return row.original.itemProgress.progressName ? row.original.itemProgress.progressName : '-';
				},
			},
			{
				accessorKey: 'inputNum',
				header: t('columns.inputNum'),
				size: 120,
				minSize: 100,
			},
			{
				accessorKey: 'inputUnit',
				header: t('columns.inputUnit'),
				size: 120,
				minSize: 100,
			},
			
		];
	};

	const materialOutgoingColumns = useMaterialOutgoingColumns();
	const processedColumns = useDataTableColumns<WorkingInLot>(
		materialOutgoingColumns
	);

	const [openModal, setOpenModal] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedDetail, setSelectedDetail] = useState<WorkingInLot | null>(null);
	const [newMaterialOutgoingMasterId, setNewMaterialOutgoingMasterId] = useState<number | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<Record<string, unknown>> | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDetailToDelete, setSelectedDetailToDelete] = useState<WorkingInLot | null>(null);
	const [mbomData, setMbomData] = useState<MbomListDto[]>([]);
	// 왼쪽 폼에서 선택한 작업지시 데이터 저장
	const [selectedCommandData, setSelectedCommandData] = useState<any>(null);
	const { data: commandList, refetch: refetchCommandList } = useCommandListQuery({
		searchRequest: {
			commandGroupNo: selectedCommandData?.commandGroupNo,
			progressId: selectedCommandData?.preProgressId,
		},
	});

	// WorkingInLot 데이터를 그리드에 맞는 형태로 변환
	const gridData = useMemo(() => {
		let filteredData: any[] = [];
		console.log('mbomData', mbomData);
		console.log('commandList', commandList);
		if(mbomData.length > 0) {
			filteredData = mbomData.filter((item: MbomListDto) => {
				//isRoot가 false인 데이터만 필터링
				if (item.isRoot) {
					return false;
				}
				return true;
			});
		}

		if(selectedCommandData && selectedCommandData.progressOrder > 1 && commandList?.data?.content.length > 0) {
			//commandList 데이터를 조회하여 데이터에 추가
			const commandListData = commandList?.data?.content[0];
	
			if (commandListData) {
				const itemData = {
					id: commandListData.itemId,
					itemNumber: commandListData.itemNumber,
					itemName: commandListData.itemName,
					itemSpec: commandListData.itemSpec,
				}
				const itemProgressData = {
					id: commandListData.itemProgressId,
					progressName: commandListData.progressName,
					progressTypeCode: commandListData.progressTypeCode,
				}
				const preProgressData  = {
					item: itemData,
					itemProgress: itemProgressData,
				}
				filteredData.push(preProgressData as any);
			}
		}
		if (filteredData.length === 0) {
			return [];
		}
		return filteredData;
	}, [mbomData, commandList]);

	const { table, toggleRowSelection, selectedRows } = useDataTable(
		gridData,
		processedColumns,
		30,
		1,
		0,
		40,
		() => {}
	);

	const handleFormReady = (methods: UseFormReturn<Record<string, unknown>>) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	const handleAddClick = () => {
		setOpenModal(true);
	};

	const handleEditClick = (workingInLot: WorkingInLot) => {
		setSelectedDetail(workingInLot);
		setIsEditMode(true);
		setOpenModal(true);
	};

	// const handleDeleteClick = (workingInLot: WorkingInLot) => {
	// 	setSelectedDetailToDelete(workingInLot);
	// 	setDeleteDialogOpen(true);
	// };

	// const [isDeleting, setIsDeleting] = useState(false);

	// const handleDeleteConfirm = async () => {
	// 	if (!selectedDetailToDelete) {
	// 		return;
	// 	}

	// 	setIsDeleting(true);
	// 	console.log('selectedDetailToDelete', selectedDetailToDelete);
		
	// 	try {
	// 		// 실제 삭제 API 호출
	// 		await deleteWorkingInLotMutation.mutateAsync({ ids: [selectedDetailToDelete.id] });
			
	// 		toast.success('자재투입 데이터가 삭제되었습니다.');
			
	// 		// 다이얼로그 닫기 및 상태 초기화
	// 		setDeleteDialogOpen(false);
	// 		setSelectedDetailToDelete(null);

	// 	} catch (error) {
	// 		console.error('삭제 실패:', error);
	// 		toast.error('자재투입 데이터 삭제에 실패했습니다.');
	// 	} finally {
	// 		setIsDeleting(false);
	// 	}
	// };

	// 모달 성공 시 콜백 - 데이터 새로고침
	const handleModalSuccess = () => {
		refetchCommandList(); // WorkingInLot 데이터 새로고침
	};
	
	// 선택된 row 데이터를 모달로 전달
	const selectedRowData = selectedRows.size > 0 ? {
		itemId: gridData[Number(selectedRows.values().next().value)].itemId,
		itemProgressId: gridData[Number(selectedRows.values().next().value)].itemProgressId,
	} : null;

	useEffect(() => {
		console.log('selectedRowData?', selectedRowData);
	}, [selectedRowData]);

	return (
		<>
			{/* 자재출고 추가 모달 - 별도 컴포넌트로 분리 */}
			<MaterialOutgoingAddModal
				open={openModal}
				onOpenChange={(open) => {
					setOpenModal(open);
					if (!open) {
						setIsEditMode(false);
						setSelectedDetail(null);
					}
				}}
				isBatchMode={true}
				selectedCommandData={selectedCommandData}
				lotSearchArray={selectedRowData ? {itemId: Number(selectedRowData.itemId), itemProgressId: Number(selectedRowData.itemProgressId)} : null} // 폼에서 전달받은 배열
				onSuccess={handleModalSuccess}
				isEditMode={isEditMode}
				editData={selectedDetail}
			/>

			{/* <DeleteConfirmDialog
				isOpen={deleteDialogOpen}
				onOpenChange={(open) => setDeleteDialogOpen(open)}
				onConfirm={handleDeleteConfirm}
				isDeleting={isDeleting} // 실제 삭제 상태
				title={tCommon('pages.production.materialOutgoing.detailDelete')}
				description={tCommon('pages.production.materialOutgoing.detailDeleteConfirm')}
			/> */}
			
			<div className="max-w-full mx-auto p-4 h-full flex-col">
				<div className="flex justify-between items-center gap-2 mb-3">
					<RadixButton
						className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
						onClick={() => navigate(-1)}
					>
						<ArrowLeft
							size={16}
							className="text-muted-foreground"
						/>
						{tCommon('tabs.actions.back')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[30, 70]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					<div className="border rounded-lg overflow-auto h-[calc(100vh-210px)]">
						<ProductionMaterialOutgoingRegisterForm
							onSuccess={(res: any) => {
								// CommandSearchInput 검색 성공 시 새창등록 버튼 활성화
								if (res.commandId) {
									setNewMaterialOutgoingMasterId(res.commandId);
								}
								// 작업지시 데이터 저장
								setSelectedCommandData(res);
							}}
							onReset={() => {
								setNewMaterialOutgoingMasterId(null);
								setSelectedCommandData(null); // 작업지시 데이터도 초기화
							}}
							onMbomDataUpdate={(data) => {
								setMbomData(data);
							}}

						/>
					</div>
					<div className="border rounded-lg overflow-hidden">
						<DatatableComponent
							columns={processedColumns}
							table={table}
							data={gridData}
							tableTitle={tCommon('pages.production.materialOutgoing.detailInfo')}
							rowCount={gridData.length}
							defaultPageSize={30}
							actionButtons={
								<MaterialOutgoingDetailRegisterActions
									newMaterialOutgoingMasterId={newMaterialOutgoingMasterId}
									selectedRows={selectedRows}
									listByMasterId={{ data: { content: gridData as any } }}
									onAddClick={handleAddClick}
									onEditClick={handleEditClick as any}
									// onDeleteClick={handleDeleteClick as any}
								/>
							}
							useSearch={true}
							toggleRowSelection={toggleRowSelection}
							enableSingleSelect={true}
							selectedRows={selectedRows}
							headerOffset="220px"
						/>
					</div>
				</PageTemplate>
			</div>
		</>
	);
};

export default ProductionMaterialOutgoingRegisterPage;
