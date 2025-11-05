import React, { useMemo } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { RootItemTreeDto } from '@primes/types/ini/mbom';
import { useTranslation } from '@repo/i18n';
import { Package } from 'lucide-react';
import { toast } from 'sonner';

// BOM 상세 아이템 타입
export interface BomDetailItem {
	id: number;
	mbomId: number;
	itemId: number;
	itemName: string;
	itemCode?: string;
	itemSpec?: string;
	processName: string;
	inputNum: number;
	inputUnit: string;
	path: string;
	depth: number;
	parentProgressName: string;
	itemProgressName: string;
	isRoot: boolean; // 루트 제품 여부 추가
}

interface BomDetailPanelProps {
	selectedRootItem: RootItemTreeDto | null;
	bomDetails: BomDetailItem[];
	onMaterialRegisterClick: () => void;
	onMaterialEditClick: (selectedItems: BomDetailItem[]) => void;
	onMaterialDeleteClick: (selectedItems: BomDetailItem[]) => void;
	selectedRows: Set<string>;
	onRowSelectionChange: (selectedRows: Set<string>) => void;
}

export const BomDetailPanel: React.FC<BomDetailPanelProps> = ({
	selectedRootItem,
	bomDetails,
	onMaterialRegisterClick,
	onMaterialEditClick,
	onMaterialDeleteClick,
	selectedRows,
	onRowSelectionChange,
}) => {
	const { t } = useTranslation('dataTable');

	// BOM 상세 컬럼 정의
	const detailColumns = useMemo(
		() => [
			{
				accessorKey: 'itemCode',
				header: t('columns.itemNumber'),
				size: 120,
			},
			{
				accessorKey: 'itemName',
				header: t('columns.itemName'),
				size: 250,
				cell: ({
					getValue,
					row,
				}: {
					getValue: () => string;
					row: { original: BomDetailItem };
				}) => {
					const value = getValue();
					const depth = row.original.depth;

					// depth에 따른 들여쓰기 표시
					const indentPx = depth * 20;

					return (
						<div
							className="flex items-center"
							style={{ paddingLeft: `${indentPx}px` }}
						>
							{depth > 0 && (
								<span className="text-gray-400 mr-2">▶</span>
							)}
							<div className="flex flex-col">
								<div className="flex items-center gap-2">
									<p
										className={`font-medium ${row.original.isRoot ? 'text-blue-700' : ''}`}
									>
										{value}
									</p>
									{row.original.isRoot && (
										<span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
											완제품
										</span>
									)}
								</div>
								<p className="text-Colors-Green-light-700 text-sm">
									{row.original.itemSpec || ''}
								</p>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: 'parentProgressName',
				header: '투입공정',
				size: 150,
				cell: ({ getValue }: { getValue: () => string }) => {
					const value = getValue();
					return value ? value : '-';
				},
			},
			{
				accessorKey: 'processName',
				header: '투입제품공정명',
				size: 150,
				cell: ({ getValue }: { getValue: () => string }) => {
					const value = getValue();
					return value ? value : '-';
				},
			},
			{
				accessorKey: 'inputNum',
				header: '투입량',
				size: 100,
				align: 'center',
				cell: ({ getValue }: { getValue: () => number }) => {
					const value = getValue();
					return value ? value.toLocaleString() : '0';
				},
			},
			{
				accessorKey: 'inputUnit',
				header: '단위',
				size: 80,
				align: 'center',
			},
		],
		[t]
	);

	// DataTable 설정 (체크박스 선택 지원)
	const { table: detailTable, toggleRowSelection } = useDataTable(
		bomDetails,
		detailColumns,
		20,
		Math.ceil(bomDetails.length / 20),
		0,
		bomDetails.length,
		() => {}
	);

	// 선택된 투입품들 가져오기 (품번 기준)
	const getSelectedItems = (): BomDetailItem[] => {
		return Array.from(selectedRows)
			.map((rowId) => {
				const rowIndex = parseInt(rowId);
				return bomDetails[rowIndex];
			})
			.filter(Boolean);
	};

	// ActionButtonsComponent를 활용한 통일된 액션 버튼들
	const getActionButtons = () => {
		const selectedItems = getSelectedItems();
		const hasSelection = selectedItems.length > 0;

		return (
			<ActionButtonsComponent
				create={onMaterialRegisterClick}
				edit={
					hasSelection
						? () => onMaterialEditClick(selectedItems)
						: undefined
				}
				remove={
					hasSelection
						? () => onMaterialDeleteClick(selectedItems)
						: undefined
				}
				useCreate={!!selectedRootItem}
				useEdit={hasSelection}
				useRemove={hasSelection}
				visibleText={false}
				classNames={{
					container: 'flex gap-2',
				}}
			/>
		);
	};

	// 완제품 미선택 상태
	if (!selectedRootItem) {
		return (
			<div className="h-full flex flex-col bg-white border rounded-lg">
				<div className="p-4 border-b border-gray-200">
					<h3 className="text-base font-semibold text-gray-800">
						투입품 상세
					</h3>
				</div>
				<div className="flex-1 flex items-center justify-center text-gray-500">
					<div className="text-center">
						<Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
						<h4 className="text-lg font-medium text-gray-700 mb-2">
							완제품을 선택하세요
						</h4>
						<p className="text-gray-500">
							좌측에서 완제품을 선택하면 투입품 상세 정보가
							표시됩니다.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col bg-white border rounded-lg">
			<div className="flex-1 overflow-hidden">
				<DatatableComponent
					table={detailTable}
					columns={detailColumns}
					data={bomDetails}
					tableTitle={`투입품 상세 - ${selectedRootItem.productInfo?.itemName || ''}`}
					rowCount={bomDetails.length}
					useSearch={false}
					usePageNation={bomDetails.length > 20}
					selectedRows={selectedRows}
					toggleRowSelection={(rowId: string) => {
						// 루트 제품인지 확인
						const rowIndex = parseInt(rowId);
						const selectedItem = bomDetails[rowIndex];

						// 루트 제품인 경우 선택 불가
						if (selectedItem?.isRoot) {
							toast.warning('루트 제품은 선택할 수 없습니다.');
							return;
						}

						toggleRowSelection(rowId);
						const newSelectedRows = new Set(selectedRows);
						if (newSelectedRows.has(rowId)) {
							newSelectedRows.delete(rowId);
						} else {
							newSelectedRows.add(rowId);
						}
						onRowSelectionChange(newSelectedRows);
					}}
					actionButtons={getActionButtons()}
					rowClassName={(row) => {
						const item = row.original as BomDetailItem;
						return item.isRoot
							? 'bg-blue-50 hover:bg-blue-100 cursor-not-allowed'
							: 'hover:bg-gray-50 cursor-pointer';
					}}
				/>
			</div>
		</div>
	);
};
