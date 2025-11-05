import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ItemDto } from '@primes/types/item';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { useProgress } from '@primes/hooks/init/progress/useProgress';
import { ItemProgressDto } from '@primes/types/progress';
import { useTranslation } from '@repo/i18n';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
} from '@repo/radix-ui/components';
import { CheckingSpecData, CheckingSpecListResponse, CheckingSpecMeta } from '@primes/types/qms/checkingSpec';

// DataTable row 타입 정의
interface DataTableRow {
	original: CheckingSpecData;
}

interface InspectionItemsPatrolTabsProps {
	tabs: {
		label: string;
		value: number;
	}[];
	initialTab: string | number;
	inspectionType: string;
}

interface InspectionItemsPatrolTableProps {
	item: ItemDto | null;
	onTabValueChange: (tabId: number) => void;
	onCreate: () => void;
	onEdit?: () => void;
	inspectionType: string;
	selectedRows: Set<string>;
	onSelectionChange: (rows: Set<string>) => void;
	onRemove: () => void;
	checkingData?: CheckingSpecListResponse;
	onDataChange?: (data: CheckingSpecData[]) => void;
}

const EmptyState: React.FC<{ message: string; subMessage?: string }> = ({
	message,
	subMessage,
}) => (
	<div className="flex w-full h-full items-center justify-center text-center flex-col gap-2">
		<p className="text-lg font-bold text-muted-foreground">{message}</p>
		{subMessage && (
			<p className="text-sm text-muted-foreground">{subMessage}</p>
		)}
	</div>
);

const InspectionItemsPatrolTabs = ({
	tabs,
	initialTab,
	inspectionType,
}: InspectionItemsPatrolTabsProps) => {
	const [activeTab, setActiveTab] = useState<string>(
		tabs.length > 0 ? initialTab.toString() : ''
	);
	const classNames = {
		tab: 'inline-flex border-r gap-2 items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]',
	};

	useEffect(() => {
		setActiveTab(initialTab.toString());
	}, [initialTab]);

	const TabUi = () => {
		return (
			<RadixTabsRoot
				value={activeTab}
				onValueChange={(value) => {
					setActiveTab(value);
				}}
			>
				<RadixTabsList className="inline-flex items-center w-full justify-start">
					{tabs.map((tab) => (
						<RadixTabsTrigger
							key={tab.value}
							className={classNames.tab}
							value={tab.value.toString()}
						>
							{tab.label}
						</RadixTabsTrigger>
					))}
				</RadixTabsList>
				<RadixTabsContent value={activeTab}></RadixTabsContent>
			</RadixTabsRoot>
		);
	};

	return { activeTab, TabUi };
};

export const InspectionItemsPatrolTable = ({
	item,
	onTabValueChange,
	onCreate,
	onEdit,
	inspectionType,
	selectedRows,
	onSelectionChange,
	onRemove,
	checkingData,
	onDataChange,
}: InspectionItemsPatrolTableProps) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [page, setPage] = useState(0);
	const [pageCount, setPageCount] = useState(0);
	const [data, setData] = useState<CheckingSpecData[]>([]);
	const [totalItemCount, setTotalItemCount] = useState(0);
	const [initialTab, setInitialTab] = useState<number>(0);
	const [progressTabs, setProgressTabs] = useState<
		{ label: string; value: number }[]
	>([]);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'checkingName',
				header: t('columns.checkingName'),
				size: 150,
			},
			{
				accessorKey: 'standard',
				header: t('columns.checkStandard'),
				size: 150,
			},
			{
				accessorKey: 'standardUnit',
				header: t('columns.standardUnit'),
				size: 120,
			},
			{
				accessorKey: 'maxValue',
				header: t('columns.upperLimit'),
				size: 80,
				cell: ({ row }: { row: DataTableRow }) => {
					const meta = row.original.meta as CheckingSpecMeta;
					return <div>{meta?.maxValue}</div>;
				},
			},
			{
				accessorKey: 'minValue',
				header: t('columns.lowerLimit'),
				size: 80,
				cell: ({ row }: { row: DataTableRow }) => {
					const meta = row.original.meta as CheckingSpecMeta;
					return <div>{meta?.minValue}</div>;
				},
			},
			{
				accessorKey: 'tolerance',
				header: t('columns.tolerance'),
				size: 80,
				cell: ({ row }: { row: DataTableRow }) => {
					const meta = row.original.meta as CheckingSpecMeta;
					return <div>{meta?.tolerance}</div>;
				},
			},
			{
				accessorKey: 'sampleQuantity',
				header: t('columns.sampleQuantity'),
				size: 80,
			},
			{
				accessorKey: 'checkPeriod',
				header: t('columns.checkPeriod'),
				size: 150,
			},
			{
				accessorKey: 'referenceNote',
				header: t('columns.precautions'),
				size: 150,
				cell: ({ row }: { row: DataTableRow }) => {
					const meta = row.original.meta as CheckingSpecMeta;
					return <div>{meta?.referenceNote}</div>;
				},
			},
		],
		[t]
	);

	const { list: progressList } = useProgress({
		page: 0,
		size: 20,
		searchRequest: item ? { 
			itemId: item.id,
			...(inspectionType === 'INCOMING' ? { isOutsourcing: true } : {isOutsourcing: false}),
		} : {},
	});

	const makeTab = useMemo(() => {
		if (!progressList.data?.content) return [];
		return progressList.data.content
			.sort((a: ItemProgressDto, b: ItemProgressDto) => a.progressOrder - b.progressOrder)
			.map((progress: ItemProgressDto) => ({
				label: progress.progressName,
				value: progress.id,
			}));
	}, [progressList.data?.content]);

	const { table, toggleRowSelection } = useDataTable(
		data,
		columns,
		10,
		pageCount,
		page,
		totalItemCount,
		(page) => setPage(page.pageIndex)
	);

	const { activeTab: progressId, TabUi } = InspectionItemsPatrolTabs({
		tabs: progressTabs,
		initialTab: initialTab,
		inspectionType: inspectionType,
	});

	useEffect(() => {
		if (progressList.data?.content) {
			const newTabs = makeTab;
			setProgressTabs(newTabs);

			if (newTabs.length > 0) {
				setInitialTab(newTabs[0].value);
			}
		}
	}, [makeTab]);

	useEffect(() => {
		if (checkingData?.content) {
			setData(checkingData.content);
			setTotalItemCount(checkingData.totalElements);
			setPageCount(checkingData.totalPages);
			onDataChange?.(checkingData.content);
		}
	}, [checkingData, onDataChange]);

	useEffect(() => {
		onTabValueChange(Number(progressId));
	}, [progressId, onTabValueChange]);

	const handleRowSelection = (rowId: string) => {
		if (!onSelectionChange) return;
		
		const currentSelection = selectedRows || new Set();
		
		if (currentSelection.has(rowId)) {
			const newSelection = new Set(currentSelection);
			newSelection.delete(rowId);
			onSelectionChange(newSelection);
		} else {
			onSelectionChange(new Set([rowId]));
		}
	};

	const renderContent = () => {
		if (!item) {
			return (
				<EmptyState
					message={tCommon('pages.messages.selectItemFirst')} //아이템을 선택해주세요
					subMessage={tCommon('pages.messages.selectItemFromLeft')} //왼쪽에서 아이템을 선택해주세요
				/>
			);
		}

		if (progressTabs.length === 0) {
			return (
				<EmptyState
					message={tCommon('pages.messages.noProgressForItem')} //등록된 공정이 없습니다.
					subMessage={tCommon('pages.messages.registerProgressFirst')} //먼저 공정을 등록해주세요
				/>
			);
		}

		return (
			<DatatableComponent
				table={table}
				columns={columns}
				tableTitle={t('tabs.inspectionList')}
				data={data}
				rowCount={totalItemCount}
				selectedRows={selectedRows || new Set()}
				toggleRowSelection={handleRowSelection}
				enableSingleSelect={true}
				usePageNation={true}
				searchSlot={
					<div className="flex w-full justify-end">
						<ActionButtonsComponent
							create={onCreate}
							edit={onEdit || (() => {})}
							remove={onRemove}
							useCreate={true}
							useEdit={true}
							useRemove={true}
							visibleText={false}
						/>
					</div>
				}
				tableTabs={<TabUi />}
				useSearch={true}
			/>
		);
	};

	return (
		<div className="w-full h-full">
			{renderContent()}
		</div>
	);
};

export default InspectionItemsPatrolTabs;
