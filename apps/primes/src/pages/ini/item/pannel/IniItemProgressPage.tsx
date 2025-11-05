import { useState, useEffect } from 'react';
import { Item } from '@primes/types/item';
import { ItemProgressDto } from '@primes/types/progress';
import {
	ProgressMachineDto,
	ProgressMachineSearchResponse,
} from '@primes/types/progressMachine';
import { useProgress } from '@primes/hooks/init/progress/useProgress';
import { useProgressMachine } from '@primes/hooks/machine/progressMachine/useProgressMachine';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { useTranslation } from '@repo/i18n';
import { useDataTable } from '@radix-ui/hook';
import { DraggableDialog } from '@repo/radix-ui/components';
import { IniItemProgressRegisterPage } from '@primes/pages/ini/item-progress/IniItemProgressRegisterPage';
import { IniItemProgressMachineRegisterPage } from '@primes/pages/ini/item-progress/IniItemProgressMachineRegisterPage';
import { toast } from 'sonner';
import { SplitterComponent } from '@primes/components/common/Splitter';

interface IniItemProgressPageProps {
	item?: Item;
}

export const IniItemProgressPage: React.FC<IniItemProgressPageProps> = ({
	item,
}) => {
	const DEFAULT_PAGE_SIZE = 30;
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [data, setData] = useState<ItemProgressDto[]>([]);
	const [page, setPage] = useState<number>(0);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [machineData, setMachineData] = useState<
		ProgressMachineSearchResponse[]
	>([]);
	const [machinePage, setMachinePage] = useState<number>(0);
	const [machinePageCount, setMachinePageCount] = useState<number>(0);
	const [machineTotalElements, setMachineTotalElements] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [mode, setMode] = useState<'create' | 'update'>('create');
	const [editingItemData, setEditingItemData] =
		useState<ItemProgressDto | null>(null);

	// ProgressMachine 모달 상태 추가
	const [openMachineModal, setOpenMachineModal] = useState<boolean>(false);
	const [selectedMachine, setSelectedMachine] =
		useState<ProgressMachineSearchResponse | null>(null);
	const [tableKey, setTableKey] = useState<number>(0);

	const tableColumns = [
		{
			accessorKey: 'progressOrder',
			header: t('columns.progressOrder'),
			size: 120,
			align: 'center' as const,
		},
		{
			accessorKey: 'progressName',
			header: t('columns.progressName'),
			size: 150,
		},
		{
			accessorKey: 'progressTypeName',
			header: 'Progress Type',
			size: 160,
			align: 'center' as const,
			cell: ({ row }: { row: { original: any } }) => {
				const progress = row.original;
				console.log('🔍 Progress Type Cell Data:', {
					id: progress.id,
					progressTypeCode: progress.progressTypeCode,
					progressTypeName: progress.progressTypeName,
				});
				return (
					progress.progressTypeName ||
					progress.progressTypeCode ||
					'-'
				);
			},
		},
		{
			accessorKey: 'defaultCycleTime',
			header: t('columns.defaultCycleTime'),
			size: 150,
			align: 'center' as const,
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? `${value}분` : '-';
			},
		},
		{
			header: t('columns.progressMainMachine'),
			size: 120,
			align: 'center' as const,
			cell: ({ row }: { row: { original: any } }) => {
				const progress = row.original;
				if (
					progress.id === editingItemData?.id &&
					machineData.length > 0
				) {
					const defaultMachine = machineData.find((m) => m.isDefault);
					const machine = defaultMachine || machineData[0];
					return machine ? (
						<div className="text-sm">
							<div className="font-medium">
								{machine.machineName}
							</div>
							<div className="text-xs text-gray-500">
								{machine.machineCode}
							</div>
						</div>
					) : (
						'-'
					);
				}
				return (
					<span className="text-gray-400 text-xs">-</span>
				);
			},
		},
		{
			accessorKey: 'isOutsourcing',
			header: t('columns.isOutsourcing'),
			size: 120,
			align: 'center' as const,
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						Y
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						N
					</span>
				);
			},
		},
	];

	const machineTableColumns = [
		{
			header: '설비명',
			accessorKey: 'machineName',
			size: 150,
			align: 'center',
		},
		{
			header: '설비코드',
			accessorKey: 'machineCode',
			size: 120,
			align: 'center',
		},
		{
			header: '대표설비',
			accessorKey: 'isDefault',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
						대표
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						일반
					</span>
				);
			},
		},
		{
			header: '사용여부',
			accessorKey: 'isUse',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						사용
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
						미사용
					</span>
				);
			},
		},
		{
			header: '생성일시',
			accessorKey: 'createdAt',
			size: 120,
			align: 'center',
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
	];

	const { list, create, update, remove } = useProgress({
		page: 0,
		size: DEFAULT_PAGE_SIZE,
		searchRequest: {
			itemId: item?.id,
		},
	});

	const { list: machineList } = useProgressMachine({
		page: 0,
		size: DEFAULT_PAGE_SIZE,
		searchRequest: {
			progressId: editingItemData?.id,
		},
	});

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		tableColumns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		(page: { pageIndex: number }) => {
			setPage(page.pageIndex);
		}
	);

	const {
		table: machineTable,
		selectedRows: machineSelectedRows,
		toggleRowSelection: machineToggleRowSelection,
	} = useDataTable(
		machineData,
		machineTableColumns,
		DEFAULT_PAGE_SIZE,
		machinePageCount,
		machinePage,
		machineTotalElements,
		(page: { pageIndex: number }) => {
			setMachinePage(page.pageIndex);
		}
	);

	useEffect(() => {
		console.log('🔍 Data update:', {
			listData: list.data,
			currentData: data,
		});

		// Debug: Check progress type data
		if (list.data?.content) {
			list.data.content.forEach((item: any, index: number) => {
				console.log(`Progress ${index + 1}:`, {
					id: item.id,
					progressName: item.progressName,
					progressTypeCode: item.progressTypeCode,
					progressTypeName: item.progressTypeName,
				});
			});
		}
		if (list.data?.content) {
			const sortedData = list.data.content.sort(
				(a: any, b: any) => a.progressOrder - b.progressOrder
			);
			console.log('📊 Setting sorted data:', sortedData);
			setData(sortedData);
			setTotalElements(list.data.totalElements || 0);
			setPageCount(list.data?.totalPages || 0);
			setTableKey((prev) => prev + 1); // Force table re-render
		} else if (Array.isArray(list.data)) {
			// Handle case where data is directly an array
			const sortedData = list.data.sort(
				(a: any, b: any) => a.progressOrder - b.progressOrder
			);
			console.log('📊 Setting array data:', sortedData);
			setData(sortedData);
			setTotalElements(list.data.length);
			setPageCount(Math.ceil(list.data.length / DEFAULT_PAGE_SIZE));
			setTableKey((prev) => prev + 1); // Force table re-render
		}
	}, [list.data]);

	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currentRow: ItemProgressDto = data[rowIndex];
			setEditingItemData(currentRow);
		} else {
			setEditingItemData(null);
		}
	}, [selectedRows]);

	// ProgressMachine 데이터 처리
	useEffect(() => {
		if (machineList.data?.content) {
			setMachineData(machineList.data.content);
			setMachineTotalElements(machineList.data.totalElements || 0);
			setMachinePageCount(machineList.data.totalPages || 0);
		}
	}, [machineList.data]);

	// ProgressMachine 선택 처리
	useEffect(() => {
		if (machineSelectedRows.size > 0) {
			const selectedRowIndex = Array.from(machineSelectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currentRow: ProgressMachineSearchResponse =
				machineData[rowIndex];
			setSelectedMachine(currentRow);
		} else {
			setSelectedMachine(null);
		}
	}, [machineSelectedRows, machineData]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={mode === 'create' ? '공정 정보 등록' : '공정 정보 수정'}
				content={
					<IniItemProgressRegisterPage
						onClose={() => {
							setOpenModal(false);
							setEditingItemData(null);
							setMode('create');
						}}
						mode={mode}
						productId={item?.id?.toString() || ''}
						progressData={editingItemData}
						onSuccess={() => {
							// 성공 시 모달 닫기 및 상태 초기화
							setOpenModal(false);
							setEditingItemData(null);
							setMode('create');
							// 데이터 새로고침
							list.refetch();
							setTableKey((prev) => prev + 1); // Force table re-render
						}}
					/>
				}
			/>

			{/* ProgressMachine 등록 모달 */}
			<DraggableDialog
				open={openMachineModal}
				onOpenChange={setOpenMachineModal}
				title="설비 정보 등록"
				content={
					<IniItemProgressMachineRegisterPage
						onClose={() => setOpenMachineModal(false)}
						progressId={editingItemData?.id}
						productName={item?.itemName}
						progressName={editingItemData?.progressName}
						mode="create"
						selectedMachineData={undefined}
					/>
				}
			/>

			<SplitterComponent
				direction="vertical"
				sizes={[50, 50]}
				minSize={[250, 250]}
				gutterSize={4}
				height="100%"
			>
				<div className="border rounded-lg overflow-auto h-40">
					<DatatableComponent
						key={`progress-table-${tableKey}-${data.length}`}
						table={table}
						tableTitle={tCommon('tabs.titles.progressInfo')}
						columns={tableColumns}
						data={data}
						rowCount={totalElements}
						useSearch={true}
						enableSingleSelect={true}
						selectedRows={selectedRows}
						usePageNation={false}
						toggleRowSelection={toggleRowSelection}
						searchSlot={
							<div className="flex justify-end w-full">
								<ActionButtonsComponent
									useCreate={true}
									create={() => {
										setMode('create');
										setEditingItemData(null);
										setOpenModal(true);
									}}
									useEdit={true}
									edit={() => {
										if (selectedRows.size === 0) {
											toast.error(
												'수정할 공정을 선택하세요.'
											);
											return;
										}
										setMode('update');
										setOpenModal(true);
									}}
									remove={() => {
										if (selectedRows.size > 0) {
											const selectedRowIndex =
												Array.from(selectedRows)[0];
											const rowIndex: number =
												parseInt(selectedRowIndex);
											const currentRow: ItemProgressDto =
												data[rowIndex];
											remove.mutate([currentRow.id]);
										} else {
											toast.error(
												'삭제할 공정 정보를 선택하세요.'
											);
										}
									}}
									useRemove={true}
									visibleText={false}
								/>
							</div>
						}
					/>
				</div>
				<div className="border rounded-lg overflow-hidden">
					<DatatableComponent
						tableTitle={tCommon('tabs.titles.progressMachineInfo')}
						table={machineTable}
						columns={machineTableColumns}
						data={machineData}
						rowCount={machineTotalElements}
						usePageNation={false}
						enableSingleSelect={true}
						selectedRows={machineSelectedRows}
						useSearch={true}
						searchSlot={
							<div className="flex justify-end w-full">
								<ActionButtonsComponent
									useCreate={true}
									create={() => {
										// 공정이 선택되었는지 체크
										if (!editingItemData) {
											toast.error(
												'먼저 공정을 선택해주세요.'
											);
											return;
										}
										setSelectedMachine(null);
										setOpenMachineModal(true);
									}}
									useRemove={true}
									remove={() => {
										if (!selectedMachine) {
											toast.error(
												'삭제할 설비를 선택해주세요.'
											);
											return;
										}
										// 삭제 로직 구현 필요
										console.log(
											'삭제할 설비:',
											selectedMachine
										);
									}}
									visibleText={false}
								/>
							</div>
						}
						toggleRowSelection={machineToggleRowSelection}
					/>
				</div>
			</SplitterComponent>
		</>
	);
};
