import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@repo/i18n';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { useMoldBom } from '@primes/hooks/mold/mold-bom';
import { MoldBomMasterDto, MoldBomMasterSearchRequest } from '@primes/types/mold';
import { MoldBomMasterActions } from '../../components/MoldBomMasterActions';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { moldBomMasterSearchFields, moldBomMasterRelatedColumns } from '@primes/schemas/mold';
import { QuickSearchField } from '@primes/components/common/search/QuickSearch';

const PAGE_SIZE = 30;

// Quick search fields for common searches
const quickSearchFields: QuickSearchField[] = [
	{ key: 'itemName', value: '품명', active: true },
];

interface MoldBomMasterListPanelProps {
	onMasterSelect: (master: MoldBomMasterDto | null) => void;
	onEditClick?: (item: MoldBomMasterDto) => void;
}

export const MoldBomMasterListPanel: React.FC<MoldBomMasterListPanelProps> = ({
	onMasterSelect,
	onEditClick,
}) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	// Master Table State
	const [masterPage, setMasterPage] = useState(0);
	const [masterTotalElements, setMasterTotalElements] = useState(0);
	const [masterPageCount, setMasterPageCount] = useState(0);
	const [masterData, setMasterData] = useState<MoldBomMasterDto[]>([]);

	// Search State
	const [searchRequest, setSearchRequest] = useState<MoldBomMasterSearchRequest>({});

	// API hooks
	const { list, removeMoldBom } = useMoldBom({
		searchRequest,
		page: masterPage,
		size: PAGE_SIZE,
	});

	// Master table pagination handler
	const onMasterPageChange = (pagination: { pageIndex: number }) => {
		setMasterPage(pagination.pageIndex);
	};

	// Search handlers
	const handleSearch = useCallback(
		(filters: MoldBomMasterSearchRequest) => {
			setSearchRequest(filters);
			setMasterPage(0); // Reset to first page when searching
		},
		[]
	);

	// Quick Search 핸들러
	const handleQuickSearch = useCallback((value: string) => {
		// Disabled: Enter key functionality disabled for mold pages
		// QuickSearch will not respond to Enter key presses
		return;
	}, []);

	const handleClearSearch = useCallback(() => {
		setSearchRequest({});
		setMasterPage(0);
	}, []);

	// Master table data table hook
	const {
		table: masterTable,
		toggleRowSelection: toggleMasterRowSelection,
		selectedRows: selectedMasterRows,
	} = useDataTable(
		masterData,
		moldBomMasterRelatedColumns,
		PAGE_SIZE,
		masterPageCount,
		masterPage,
		masterTotalElements,
		onMasterPageChange
	);

	// Update master data when API response changes
	useEffect(() => {
		if (list.data?.data && Array.isArray(list.data.data)) {
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
					onMasterSelect(selectedRow);
				}
			}
		} else {
			onMasterSelect(null);
		}
	}, [selectedMasterRows, masterData, onMasterSelect]);

	return (
		<div className="border rounded-lg">
			<DatatableComponent
				table={masterTable}
				columns={moldBomMasterRelatedColumns}
				data={masterData}
				tableTitle={tCommon('pages.mold.bom.masterList')}
				rowCount={masterTotalElements}
				useSearch={true}
				searchSlot={
					<SearchSlotComponent
						fields={moldBomMasterSearchFields}
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
					<MoldBomMasterActions
						selectedRows={selectedMasterRows}
						masterData={masterData}
						removeMaster={removeMoldBom.mutateAsync}
						onEditClick={onEditClick}
					/>
				}
			/>
		</div>
	);
};
