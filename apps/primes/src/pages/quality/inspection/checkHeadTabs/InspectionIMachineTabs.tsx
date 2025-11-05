import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
} from '@repo/radix-ui/components';
import { CheckingSpecData, CheckingSpecListResponse, CheckingSpecMeta } from '@primes/types/qms/checkingSpec';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { Machine } from '@primes/types/machine';

// DataTable row 타입 정의
interface DataTableRow {
	original: CheckingSpecData;
}

// 검사 주기 타입 정의
type CheckPeriodType = 'daily' | 'weekly' | 'monthly';

interface InspectionItemsPatrolTabsProps {
	tabs: {
		label: string;
		value: CheckPeriodType;
	}[];
	initialTab: CheckPeriodType;
	inspectionType: string;
}

interface InspectionItemsPatrolTableProps {
	item: Machine | null; // ItemDto에서 Machine으로 변경
	onTabValueChange: (tabId: CheckPeriodType) => void;
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
	const [activeTab, setActiveTab] = useState<CheckPeriodType>(
		tabs.length > 0 ? initialTab : 'daily'
	);
	const classNames = {
		tab: 'inline-flex border-r gap-2 items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]',
	};

	useEffect(() => {
		setActiveTab(initialTab);
	}, [initialTab]);

	const TabUi = () => {
		return (
			<RadixTabsRoot
				value={activeTab}
				onValueChange={(value) => {
					setActiveTab(value as CheckPeriodType);
				}}
			>
				<RadixTabsList className="inline-flex items-center w-full justify-start">
					{tabs.map((tab) => (
						<RadixTabsTrigger
							key={tab.value}
							className={classNames.tab}
							value={tab.value}
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
	const [initialTab, setInitialTab] = useState<CheckPeriodType>('daily');
	const [filteredData, setFilteredData] = useState<CheckingSpecData[]>([]);

	// 검사 주기별 탭 정의
	const checkPeriodTabs = useMemo(() => [
		{
			label: tCommon('inspection.inspectionItems.checkPeriods.daily'),
			value: 'daily' as CheckPeriodType,
		},
		{
			label: tCommon('inspection.inspectionItems.checkPeriods.weekly'),
			value: 'weekly' as CheckPeriodType,
		},
		{
			label: tCommon('inspection.inspectionItems.checkPeriods.monthly'),
			value: 'monthly' as CheckPeriodType,
		},
	], [tCommon]);

	// 설비 검사용 폼 스키마 (기존 useInspectionMachineFormSchema 대신)
	const machineInspectionFormSchema = useMemo(() => [
		{
			name: 'checkingName',
			label: tCommon('inspection.inspectionItems.itemName'),
			type: 'text',
			required: true,
		},
		{
			name: 'standard',
			label: tCommon('inspection.inspectionItems.standardValue'),
			type: 'text',
			required: true,
		},
		{
			name: 'standardUnit',
			label: tCommon('inspection.inspectionItems.unit'),
			type: 'text',
			required: true,
		},
		{
			name: 'checkPeriod',
			label: tCommon('inspection.inspectionItems.checkPeriod'),
			type: 'select',
			options: [
				{ value: 1, label: tCommon('inspection.inspectionItems.checkPeriods.daily') },
				{ value: 7, label: tCommon('inspection.inspectionItems.checkPeriods.weekly') },
				{ value: 30, label: tCommon('inspection.inspectionItems.checkPeriods.monthly') },
			],
			required: true,
		},
		{
			name: 'sampleQuantity',
			label: tCommon('inspection.inspectionItems.sampleQuantity'),
			type: 'number',
			required: true,
		},
		{
			name: 'maxValue',
			label: tCommon('inspection.inspectionItems.upperLimit'),
			type: 'number',
		},
		{
			name: 'minValue',
			label: tCommon('inspection.inspectionItems.lowerLimit'),
			type: 'number',
		},
		{
			name: 'tolerance',
			label: tCommon('inspection.inspectionItems.tolerance'),
			type: 'number',
		},
		{
			name: 'referenceNote',
			label: tCommon('inspection.inspectionItems.referenceNote'),
			type: 'textarea',
		},
	], [tCommon]);

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

	// check_period 값을 기준으로 데이터 필터링하는 함수
	const filterDataByCheckPeriod = useCallback((data: CheckingSpecData[], periodType: CheckPeriodType) => {
		const periodMap = {
			daily: 'DAY',
			weekly: 'WEEK',
			monthly: 'MONTH',
		};

		const filtered = data.filter(item => item.checkPeriod === periodMap[periodType]);
		console.log(`Filtering data for ${periodType} (${periodMap[periodType]}):`, filtered);
		return filtered;
	}, []);

	const { table, toggleRowSelection } = useDataTable(
		filteredData,
		columns,
		10,
		pageCount,
		page,
		totalItemCount,
		(page) => setPage(page.pageIndex)
	);

	const { activeTab: currentTab, TabUi } = InspectionItemsPatrolTabs({
		tabs: checkPeriodTabs,
		initialTab: initialTab,
		inspectionType: inspectionType,
	});

	// 데이터가 변경될 때 필터링된 데이터 업데이트
	useEffect(() => {
		console.log('Data changed, current tab:', currentTab);
		if (data.length > 0) {
			const filtered = filterDataByCheckPeriod(data, currentTab);
			setFilteredData(filtered);
			setTotalItemCount(filtered.length);
			setPageCount(Math.ceil(filtered.length / 10));
		} else {
			setFilteredData([]);
			setTotalItemCount(0);
			setPageCount(0);
		}
	}, [data, currentTab, filterDataByCheckPeriod]);

	useEffect(() => {
		console.log('checkingData received:', checkingData);
		if (checkingData?.content) {
			setData(checkingData.content);
			onDataChange?.(checkingData.content);
		}
	}, [checkingData, onDataChange]);

	useEffect(() => {
		onTabValueChange(currentTab);
	}, [currentTab, onTabValueChange]);

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

	const handleFormReady = (form: any) => {
		// 폼이 준비되면 데이터를 폼에 바인딩
		// item은 ItemDto이므로 검사 항목 데이터가 아님
		// 대신 빈 폼으로 시작
		const initialValues = {
			checkingName: '',
			standard: '',
			standardUnit: '',
			checkPeriod: 'DAY',
			sampleQuantity: 1,
			maxValue: '',
			minValue: '',
			tolerance: '',
			referenceNote: '',
		};
		form.setValues(initialValues);
	};

	const handleInspectionFormSubmit = async (values: any) => {
		try {
			const newItem: CheckingSpecData = {
				id: Date.now(), // 임시 ID 생성
				isUse: true,
				inspectionType: "MACHINE",
				specType: "CHOICE" as any,
				checkingFormulaId: 0,
				checkingName: values.checkingName,
				orderNo: 0,
				standard: values.standard,
				standardUnit: values.standardUnit,
				checkPeriod: values.checkPeriod,
				sampleQuantity: values.sampleQuantity,
				targetId: 0,
				targetCode: "",
				targetName: "",
				meta: {
					maxValue: values.maxValue,
					minValue: values.minValue,
					tolerance: values.tolerance,
					referenceNote: values.referenceNote,
				} as CheckingSpecMeta,
				createdAt: new Date().toISOString(),	
				updatedAt: new Date().toISOString(),
				createdBy: "",
				updatedBy: "",
			};

			// API 호출 대신 로컬 상태 업데이트
			setData([...data, newItem]);
			onDataChange?.([...data, newItem]);
			
			// 성공 메시지 표시
			alert(tCommon('inspection.toast.inspectionItemAdded'));
		} catch (error) {
			console.error('Error saving item:', error);
			alert(tCommon('inspection.toast.saveInspectionError'));
		}
	};

	const renderContent = () => {
		if (!item) {
			return (
				<EmptyState
					message={tCommon('inspection.toast.selectMachineFirst')}
					subMessage={tCommon('inspection.messages.selectMachineFromLeft')}
				/>
			);
		}

		return (
			<DatatableComponent
				table={table}
				columns={columns}
				tableTitle={tCommon('inspection.inspectionItems.tableTitle')}
				data={filteredData}
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
