import React, { useState, useEffect, useMemo } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { RadixButton } from '@radix-ui/components';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useMoldInstanceInputRecords } from '@primes/hooks/mold/mold-instance/useMoldInstanceInputRecords';
import { useInputMoldInstances } from '@primes/hooks/mold/mold-instance/useInputMoldInstances';
import { useCollectMoldInstances } from '@primes/hooks/mold/mold-instance/useCollectMoldInstances';
import { getMoldInstanceById } from '@primes/services/mold/moldInstanceService';
import { inoutTableColumns } from '@primes/schemas/mold/moldInoutInformationSchemas';
import { MoldInstanceDto } from '@primes/types/mold';
import { toast } from 'sonner';

interface MoldInoutInstancePanelProps {
	selectedCommandId: number | null;
	onNewWindowRegister: () => void;
	onInputModalOpen: () => void;
	onRefetchReady?: (refetchFn: () => void) => void; // refetch 함수를 외부로 전달
}

export const MoldInoutInstancePanel: React.FC<MoldInoutInstancePanelProps> = ({
	selectedCommandId,
	onNewWindowRegister,
	onInputModalOpen,
	onRefetchReady,
}) => {
	const { t: tCommon } = useTranslation('common');
	const [recordsPage, setRecordsPage] = useState<number>(0);
	// addRowData와 newlyAddedItems는 더 이상 사용하지 않음 (투입 버튼이 모달로 변경됨)
	const [addRowData, setAddRowData] = useState<Record<string, unknown>[]>([]);
	const [newlyAddedItems, setNewlyAddedItems] = useState<MoldInstanceDto[]>([]);
	const [triggerAddRow, setTriggerAddRow] = useState(false);
	const [triggerClearAddRow, setTriggerClearAddRow] = useState(false);
	const RECORDS_PAGE_SIZE = 10;

	// API 호출 - get mold instances filtered by selected command
	const {
		data: recordsApiData,
		isLoading: recordsLoading,
		error: recordsError,
		refetch: refetchRecords,
		records: moldInstanceRecords,
		totalElements: recordsTotalElementsFromApi,
		totalPages: recordsPageCountFromApi,
	} = useMoldInstanceInputRecords({
		inputCommandId: selectedCommandId || undefined,
		page: recordsPage,
		size: RECORDS_PAGE_SIZE,
	});

	// refetchRecords 함수를 외부로 전달
	React.useEffect(() => {
		if (onRefetchReady) {
			onRefetchReady(refetchRecords);
		}
	}, [onRefetchReady, refetchRecords]);

	// 회수 hooks
	const collectMoldInstances = useCollectMoldInstances();

	// Records data processing - useMemo로 변경하여 무한 루프 방지
	const inoutData = useMemo(() => {
		return moldInstanceRecords; // newlyAddedItems 제거 (모달에서 직접 투입하므로)
	}, [moldInstanceRecords]);

	const [recordsTotalElements, setRecordsTotalElements] = useState<number>(0);
	const [recordsPageCount, setRecordsPageCount] = useState<number>(0);

	// Records pagination data processing
	useEffect(() => {
		setRecordsTotalElements(recordsTotalElementsFromApi);
		setRecordsPageCount(recordsPageCountFromApi);
	}, [recordsTotalElementsFromApi, recordsPageCountFromApi]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		inoutData,
		inoutTableColumns,
		RECORDS_PAGE_SIZE,
		recordsPageCount,
		recordsPage,
		recordsTotalElements,
		(pagination: { pageIndex: number }) =>
			setRecordsPage(pagination.pageIndex)
	);

	// Handle collect
	const handleCollectSelectedItems = async () => {
		if (!selectedCommandId || selectedRows.size === 0) {
			toast.error('회수할 항목을 선택해주세요.');
			return;
		}

		const selectedRowIndices = Array.from(selectedRows);
		const selectedItems = selectedRowIndices
			.map(index => {
				const rowIndex = parseInt(index);
				if (!isNaN(rowIndex) && rowIndex >= 0 && rowIndex < inoutData.length) {
					return inoutData[rowIndex];
				}
				return null;
			})
			.filter(item => item !== null);

		if (selectedItems.length === 0) {
			toast.error('유효한 항목이 선택되지 않았습니다.');
			return;
		}

		try {
			const moldInstanceIds = selectedItems
				.filter(item => item.id)
				.map(item => Number(item.id));

			if (moldInstanceIds.length === 0) {
				toast.error('회수할 금형 인스턴스가 없습니다.');
				return;
			}

			await collectMoldInstances.mutateAsync(moldInstanceIds);
			
			// 선택 상태 초기화
			selectedRowIndices.forEach(index => {
				toggleRowSelection(index.toString());
			});
			
			// 데이터 새로고침
			refetchRecords();
			
			toast.success(`${moldInstanceIds.length}개 금형이 회수되었습니다.`);
			
		} catch (error) {
			console.error('Error collecting items:', error);
			toast.error('항목 회수 중 오류가 발생했습니다.');
		}
	};

	return (
		<div className="border rounded-lg overflow-hidden">
			<DatatableComponent
				table={table}
				columns={inoutTableColumns}
				data={inoutData}
				tableTitle="금형 목록"
				rowCount={recordsTotalElements}
				defaultPageSize={RECORDS_PAGE_SIZE}
				useSearch={true}
				usePageNation={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
				enableSingleSelect={true}
						useAddRowFeature={false}
						triggerAddRow={false}
						triggerClearAddRow={false}
						onAddRow={() => {}}
						onAddRowDataChange={() => {}}
				actionButtons={
					<div className="flex items-center gap-2.5">
						<RadixButton
							className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
								!selectedCommandId
									? 'bg-gray-200 text-gray-400 cursor-not-allowed'
									: 'bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700'
							}`}
							onClick={onNewWindowRegister}
							disabled={!selectedCommandId}
						>
							<Save
								size={16}
								className={
									!selectedCommandId
										? 'text-gray-400'
										: 'text-white'
								}
							/>
							{tCommon('pages.actions.input', '투입')}
						</RadixButton>
						<RadixButton
							className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
								!selectedCommandId ||
								selectedRows.size === 0
									? 'cursor-not-allowed bg-gray-200 text-gray-400'
									: 'bg-red-600 text-white hover:bg-red-700'
							}`}
							disabled={
								!selectedCommandId ||
								selectedRows.size === 0
							}
							onClick={handleCollectSelectedItems}
						>
							<Trash2
								size={16}
								className={
									!selectedCommandId ||
									selectedRows.size === 0
										? 'text-gray-400'
										: 'text-white'
								}
							/>
							{tCommon('pages.actions.collect', '회수')}
						</RadixButton>
					</div>
				}
			/>
		</div>
	);
};
