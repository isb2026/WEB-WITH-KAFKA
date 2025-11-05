import React, { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { MoldBomDetailRegisterActions } from '../../components/MoldBomDetailRegisterActions';
import { useMoldBomDetailByMasterId } from '@primes/hooks/mold/mold-bom';
import { moldBomDetailRegisterColumns } from '@primes/schemas/mold/moldBomSchemas';

interface MoldBomDetailPanelProps {
	newMasterId: number | null;
	onAddClick: () => void;
	onEditClick: (detail: any) => void;
	onDeleteClick: (detail: any) => void;
}

export const MoldBomDetailPanel: React.FC<MoldBomDetailPanelProps> = ({
	newMasterId,
	onAddClick,
	onEditClick,
	onDeleteClick,
}) => {
	const { t: tCommon } = useTranslation('common');
	const { t } = useTranslation('dataTable');

	// Add row feature states
	const [addRowData, setAddRowData] = useState<any[]>([]);
	const [triggerAddRow, setTriggerAddRow] = useState(false);
	const [triggerClearAddRow, setTriggerClearAddRow] = useState(false);

	// Detail 데이터 가져오기
	const listByMasterId = useMoldBomDetailByMasterId(newMasterId || 0, 0, 30);

	// Detail table data
	const detailData = Array.isArray(listByMasterId.data?.data)
		? listByMasterId.data.data
		: [];

	const {
		table: detailTable,
		toggleRowSelection: toggleDetailRowSelection,
		selectedRows: selectedDetailRows,
	} = useDataTable(
		detailData,
		moldBomDetailRegisterColumns,
		30,
		1,
		0,
		detailData.length,
		() => {}
	);

	// Add row handlers
	const handleAddRowClick = () => {
		console.log('Add row button clicked');
		setTriggerAddRow(true);
	};

	const handleSaveAddRows = () => {
		console.log('Save add rows called with data:', addRowData);
		// TODO: Implement save functionality for add rows
		// This would typically involve calling an API to save multiple rows at once
		setAddRowData([]);
		setTriggerClearAddRow(true);
	};

	return (
		<div className="border rounded-lg overflow-hidden flex-1 h-full">
			<DatatableComponent
				table={detailTable}
				columns={moldBomDetailRegisterColumns}
				data={detailData}
				tableTitle={tCommon('pages.mold.bom.detail')}
				rowCount={detailData.length}
				defaultPageSize={30}
				useSearch={false}
				usePageNation={false}
				selectedRows={selectedDetailRows}
				toggleRowSelection={toggleDetailRowSelection}
				useSummary={true}
				useAddRowFeature={true}
				triggerAddRow={triggerAddRow}
				triggerClearAddRow={triggerClearAddRow}
				onAddRow={(newRow) => {
					console.log('onAddRow called with:', newRow);
					setAddRowData((prev) => {
						const newData = [...prev, newRow];
						console.log('Updated addRowData:', newData);
						return newData;
					});
				}}
				onAddRowDataChange={(data) => {
					console.log('onAddRowDataChange called with:', data);
					setAddRowData(data);
				}}
				actionButtons={
					<MoldBomDetailRegisterActions
						newMoldBomMasterId={newMasterId}
						selectedRows={selectedDetailRows}
						listByMasterId={listByMasterId}
						onAddClick={onAddClick}
						onAddRowClick={handleAddRowClick}
						onEditClick={() => {
							if (selectedDetailRows.size > 0) {
								const selectedRowIndex = Array.from(selectedDetailRows)[0];
								const rowIndex = parseInt(selectedRowIndex);
								if (
									!isNaN(rowIndex) &&
									rowIndex >= 0 &&
									rowIndex < detailData.length
								) {
									const selectedRow = detailData[rowIndex];
									onEditClick(selectedRow);
								}
							}
						}}
						onDeleteClick={() => {
							if (selectedDetailRows.size > 0) {
								const selectedRowIndex = Array.from(selectedDetailRows)[0];
								const rowIndex = parseInt(selectedRowIndex);
								if (
									!isNaN(rowIndex) &&
									rowIndex >= 0 &&
									rowIndex < detailData.length
								) {
									const selectedRow = detailData[rowIndex];
									onDeleteClick(selectedRow);
								}
							}
						}}
					/>
				}
				headerOffset="220px"
			/>
		</div>
	);
};
