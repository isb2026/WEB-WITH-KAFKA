import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoldSet } from '@primes/hooks/mold/mold-set/useMoldSet';
import { useMoldBomDetailSetAssignedInstances } from '@primes/hooks/mold/mold-bom';
// import { useMoldSetDetailByMasterId } from '@primes/hooks/mold/mold-set/useMoldSetDetailByMasterId';
import {
	MoldSetMasterDto,
	MoldSetDetailDto,
	MoldSetMasterSearchRequest,
	MoldBomDetailSetAssignedInstanceDto,
} from '@primes/types/mold';
import { useTranslation } from '@repo/i18n';
import { MoldSetMasterActions } from '../components/MoldSetMasterActions';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { moldSetMasterSearchFields } from '@primes/schemas/mold';
import { QuickSearchField } from '@primes/components/common/search/QuickSearch';

const PAGE_SIZE = 30;

// Quick search fields for common searches
const quickSearchFields: QuickSearchField[] = [
	{ key: 'itemName', value: '품명', active: true },
];

interface MoldSetRelatedListPageProps {
	onEditClick?: (item: MoldSetMasterDto) => void;
}

export const MoldSetRelatedListPage: React.FC<
	MoldSetRelatedListPageProps
> = ({ onEditClick }) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const navigate = useNavigate();

	const MoldSetMasterTableColumns = [
		{
			accessorKey: 'moldSetCode',
			header: t('columns.moldSetCode'),
			size: 120,
		},
		{
			accessorKey: 'moldSetName',
			header: t('columns.moldSetName'),
			size: 150,
		},
		{
			accessorKey: 'itemName',
			header: t('columns.itemName'),
			size: 150,
		},
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 120,
		},
		{
			accessorKey: 'itemSpec',
			header: t('columns.itemSpec'),
			size: 150,
		},
		{
			accessorKey: 'machineName',
			header: t('columns.machineName'),
			size: 120,
		},
		{
			accessorKey: 'createdAt',
			header: t('columns.createdAt'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
	];

	const MoldSetDetailTableColumns = [
		{
			accessorKey: 'moldCode',
			header: '금형 코드',
			size: 120,
		},
		{
			accessorKey: 'moldName',
			header: '금형명',
			size: 200,
		},
		{
			accessorKey: 'moldStandard',
			header: '금형 규격',
			size: 150,
		},
		{
			accessorKey: 'assignedMoldInstanceCode',
			header: '할당된 실금형 코드',
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				if (value) {
					return (
						<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
							{value}
						</span>
					);
				}
				return (
					<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
						미할당
					</span>
				);
			},
		},
		{
			accessorKey: 'assignedMoldInstanceName',
			header: '할당된 실금형명',
			size: 200,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				if (value) {
					return (
						<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							{value}
						</span>
					);
				}
				return (
					<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
						미할당
					</span>
				);
			},
		},
	];

	// Master Table State
	const [masterPage, setMasterPage] = useState(0);
	const [masterTotalElements, setMasterTotalElements] = useState(0);
	const [masterPageCount, setMasterPageCount] = useState(0);
	const [masterData, setMasterData] = useState<MoldSetMasterDto[]>([]);
	const [selectedMasterData, setSelectedMasterData] =
		useState<MoldSetMasterDto | null>(null);

	// Search State
	const [searchRequest, setSearchRequest] =
		useState<MoldSetMasterSearchRequest>({});

	// Detail Table State
	const [detailData, setDetailData] = useState<MoldBomDetailSetAssignedInstanceDto[]>([]);
	const [selectedMasterRowId, setSelectedMasterRowId] = useState<number>(0);
	const [moldBomMasterId, setMoldBomMasterId] = useState<number | null>(null);

	// API hooks
	const { list, removeMoldSet } = useMoldSet({
		searchRequest,
		page: masterPage,
		size: PAGE_SIZE,
	});

	// 새로운 API 훅 사용 - moldBomMasterId를 사용
	const { data: setAssignedInstancesData, isLoading: detailLoading } = 
		useMoldBomDetailSetAssignedInstances(moldBomMasterId);

	// Master table pagination handler
	const onMasterPageChange = (pagination: { pageIndex: number }) => {
		setMasterPage(pagination.pageIndex);
	};

	// Search handlers
	const handleSearch = useCallback(
		(filters: MoldSetMasterSearchRequest) => {
			setSearchRequest(filters);
			setMasterPage(0); // Reset to first page when searching
		},
		[]
	);

	// Quick Search 핸들러
	const handleQuickSearch = useCallback(() => {
		// Disabled: Enter key functionality disabled for mold pages
		// QuickSearch will not respond to Enter key presses
		return;
	}, []);

	// Master table data table hook
	const {
		table: masterTable,
		toggleRowSelection: toggleMasterRowSelection,
		selectedRows: selectedMasterRows,
	} = useDataTable(
		masterData,
		MoldSetMasterTableColumns,
		PAGE_SIZE,
		masterPageCount,
		masterPage,
		masterTotalElements,
		onMasterPageChange
	);

	// Detail table data table hook
	const {
		table: detailTable,
		toggleRowSelection: toggleDetailRowSelection,
		selectedRows: selectedDetailRows,
	} = useDataTable(
		detailData,
		MoldSetDetailTableColumns,
		0,
		1,
		0,
		detailData.length,
		() => {}
	);

	// Update master data when API response changes
	useEffect(() => {
		if (list.data?.content && Array.isArray(list.data.content)) {
			setMasterData(list.data.content);
			setMasterTotalElements(list.data.totalElements || list.data.content.length);
			setMasterPageCount(list.data.totalPages || Math.ceil(list.data.content.length / PAGE_SIZE));
		} else if (list.data?.data && Array.isArray(list.data.data)) {
			setMasterData(list.data.data);
			setMasterTotalElements(list.data.data.length);
			setMasterPageCount(Math.ceil(list.data.data.length / PAGE_SIZE));
		} else if (Array.isArray(list.data)) {
			setMasterData(list.data);
			setMasterTotalElements(list.data.length);
			setMasterPageCount(Math.ceil(list.data.length / PAGE_SIZE));
		}
	}, [list.data]);

	// Handle master row selection to load details
	useEffect(() => {
		if (selectedMasterRows.size > 0) {
			const selectedRowIndex = Array.from(selectedMasterRows)[0];
			const rowIndex = parseInt(selectedRowIndex);
			if (
				!isNaN(rowIndex) &&
				rowIndex >= 0 &&
				rowIndex < masterData.length
			) {
				const selectedRow = masterData[rowIndex];
				if (selectedRow && selectedRow.id) {
					setSelectedMasterData(selectedRow);
					setSelectedMasterRowId(selectedRow.id);
					// API 응답에서 moldBomMasterId를 직접 사용
					setMoldBomMasterId(selectedRow.moldBomMasterId || null);
				}
			}
		} else {
			// 선택된 행이 없으면 detail 데이터 초기화
			setDetailData([]);
			setSelectedMasterData(null);
			setSelectedMasterRowId(0);
			setMoldBomMasterId(null);
		}
	}, [selectedMasterRows, masterData]);

	// Update detail data when new API response changes
	useEffect(() => {
		if (setAssignedInstancesData?.data && Array.isArray(setAssignedInstancesData.data)) {
			setDetailData(setAssignedInstancesData.data);
		} else if (!selectedMasterRowId) {
			setDetailData([]);
		}
	}, [setAssignedInstancesData, selectedMasterRowId]);

	// Edit 버튼 클릭 핸들러
	const handleEditClick = (item: MoldSetMasterDto) => {
		if (onEditClick) {
			onEditClick(item);
		} else {
			// 선택된 데이터를 state로 전달하면서 register 페이지로 이동
			navigate('/mold/set/register', { 
				state: { 
					editMode: true, 
					editData: item 
				} 
			});
		}
	};

	return (
		<PageTemplate
			firstChildWidth="30%"
			splitterSizes={[30, 70]}
			splitterMinSize={[430, 800]}
			splitterGutterSize={6}
		>
			<div className="border rounded-lg">
				<DatatableComponent
					table={masterTable}
					columns={MoldSetMasterTableColumns}
					data={masterData}
					tableTitle={tCommon('pages.mold.set.masterList')}
					rowCount={masterTotalElements}
					useSearch={true}
					searchSlot={
						<SearchSlotComponent
							fields={moldSetMasterSearchFields}
							onSearch={handleSearch}
							useQuickSearch={false}
							quickSearchField={quickSearchFields}
							onQuickSearch={handleQuickSearch}
						/>
					}
					selectedRows={selectedMasterRows}
					toggleRowSelection={toggleMasterRowSelection}
					enableSingleSelect
					actionButtons={
						<MoldSetMasterActions
							selectedRows={selectedMasterRows}
							masterData={masterData}
							removeMaster={removeMoldSet.mutateAsync}
							onEditClick={handleEditClick}
						/>
					}
				/>
			</div>
			<div className="h-full">
				{/* Detail List */}
				<div className="border rounded-lg h-full overflow-hidden">
					<DatatableComponent
						table={detailTable}
						columns={MoldSetDetailTableColumns}
						data={detailData}
						tableTitle={tCommon('pages.mold.set.detail')}
						rowCount={detailData.length}
						useSearch={false}
						usePageNation={false}
						selectedRows={selectedDetailRows}
						toggleRowSelection={toggleDetailRowSelection}
						useSummary={true}
					/>
				</div>
			</div>
		</PageTemplate>
	);
};

export default MoldSetRelatedListPage;