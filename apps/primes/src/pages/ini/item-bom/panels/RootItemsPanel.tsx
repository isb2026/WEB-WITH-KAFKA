import React, { useMemo } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { RootItemTreeDto } from '@primes/types/ini/mbom';
import { useTranslation } from '@repo/i18n';

interface RootItemsPanelProps {
	rootItems: RootItemTreeDto[];
	selectedRows: Set<string>;
	onRootItemSelect: (item: RootItemTreeDto) => void;
	onRegisterClick: () => void;
	setSelectedRows: (rows: Set<string>) => void;
}

export const RootItemsPanel: React.FC<RootItemsPanelProps> = ({
	rootItems,
	selectedRows,
	onRootItemSelect,
	onRegisterClick,
	setSelectedRows,
}) => {
	const { t } = useTranslation('dataTable');

	// 루트 아이템 컬럼 정의
	const rootColumns = useMemo(
		() => [
			{
				accessorKey: 'productInfo.itemNo',
				header: t('columns.itemNo'),
				size: 80,
			},
			{
				accessorKey: 'productInfo.itemCode',
				header: t('columns.itemInfo'),
				size: 300,
				cell: ({
					getValue,
					row,
				}: {
					getValue: () => string;
					row: { original: RootItemTreeDto };
				}) => {
					const value = getValue();
					const productInfo = row.original.productInfo;
					return (
						<div className="flex flex-col py-1">
							<p className="text-Colors-Brand-600 hover:text-Colors-Brand-700 font-medium hover:underline focus:outline-none focus:underline">
								{value || '-'}
							</p>
							<p className="font-medium">
								{productInfo?.itemName || ''}
							</p>
							<p className="text-Colors-Green-light-700 text-sm">
								{productInfo?.description || ''}
							</p>
						</div>
					);
				},
			},
		],
		[t]
	);

	// DataTable 설정
	const { table: rootTable } = useDataTable(
		rootItems,
		rootColumns,
		10,
		Math.ceil(rootItems.length / 10),
		0,
		rootItems.length,
		() => {}
	);

	const toggleRootRowSelection = (rowId: string) => {
		const rowIndex = parseInt(rowId);
		const selectedItem = rootItems[rowIndex];
		if (selectedItem) {
			onRootItemSelect(selectedItem);
			setSelectedRows(new Set([rowId]));
		}
	};

	// ActionButtonsComponent를 활용한 완제품 등록 버튼
	const getRootProductActionButtons = () => {
		return (
			<ActionButtonsComponent
				create={onRegisterClick}
				useCreate={true}
				visibleText={false}
				classNames={{
					container: 'flex gap-2',
					buttonCreate:
						'bg-Colors-Brand-700 text-white hover:bg-Colors-Brand-800',
				}}
			/>
		);
	};

	return (
		<div className="h-full flex flex-col bg-white border rounded-lg">
			<div className="flex-1 overflow-hidden">
				<DatatableComponent
					table={rootTable}
					columns={rootColumns}
					data={rootItems}
					tableTitle="완제품 현황"
					rowCount={rootItems.length}
					useSearch={false}
					usePageNation={false}
					enableSingleSelect={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRootRowSelection}
					actionButtons={getRootProductActionButtons()}
				/>
			</div>
		</div>
	);
};
