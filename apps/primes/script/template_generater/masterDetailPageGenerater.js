import {
	parseColumnsFromString,
	columnsToString,
	generateInfoGridKeys,
} from '../utils/columnUtils.js';
import { toPascalCase, toCamelCase } from '../utils/stringUtils.js';

// 마스터-디테일 페이지 템플릿을 생성하는 함수 - 개선된 버전
export const masterDetailPageGenerater = (
	pageKey,
	masterColumnsArray,
	masterDataHook,
	detailColumnsArray,
	detailDataHook,
	masterTableTitle,
	detailTableTitle
) => {
	// 컬럼 파싱 및 개선
	const masterColumns = parseColumnsFromString(masterColumnsArray);
	const detailColumns = parseColumnsFromString(detailColumnsArray);

	const improvedMasterColumnsString = columnsToString(masterColumns);
	const improvedDetailColumnsString = columnsToString(detailColumns);

	// InfoGrid 키 생성
	const infoGridKeys = generateInfoGridKeys(masterColumns);
	const infoGridKeysString = JSON.stringify(infoGridKeys, null, 2);

	// 타입명 생성
	const baseTypeName = pageKey
		.replace(/MasterDetailPage$/, '')
		.replace(/Page$/, '');
	const masterTypeName = `${toPascalCase(baseTypeName)}MasterData`;
	const detailTypeName = `${toPascalCase(baseTypeName)}DetailData`;

	// hookName에서 하이픈 제거
	const cleanMasterHookName = toCamelCase(masterDataHook.replace(/^use/, ''));
	const finalMasterHookName = `use${toPascalCase(cleanMasterHookName)}`;

	const cleanDetailHookName = toCamelCase(detailDataHook.replace(/^use/, ''));
	const finalDetailHookName = `use${toPascalCase(cleanDetailHookName)}`;

	return `import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useState, useEffect, useCallback } from 'react';
import { ${finalMasterHookName} } from '@primes/hooks';
import { ${finalDetailHookName} } from '@primes/hooks';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
} from '@repo/radix-ui/components';

interface ${masterTypeName} {
	id: number;
	[key: string]: any;
}

interface ${detailTypeName} {
	id: number;
	[key: string]: any;
}

const PAGE_SIZE = 30;

const ${pageKey}MasterTableColumns = ${improvedMasterColumnsString};
const ${pageKey}DetailTableColumns = ${improvedDetailColumnsString};

const InfoGridKeys = ${infoGridKeysString};

export const ${pageKey}: React.FC = () => {
	// Master Table State
	const [masterPage, setMasterPage] = useState<number>(0);
	const [masterTotalElements, setMasterTotalElements] = useState<number>(0);
	const [masterPageCount, setMasterPageCount] = useState<number>(0);
	const [masterData, setMasterData] = useState<${masterTypeName}[]>([]);
	const [selectedMasterData, setSelectedMasterData] = useState<${masterTypeName} | null>(null);
	const [masterLoading, setMasterLoading] = useState<boolean>(false);

	// Detail Table State
	const [detailData, setDetailData] = useState<${detailTypeName}[]>([]);
	const [selectedMasterRowId, setSelectedMasterRowId] = useState<number>(0);
	const [detailLoading, setDetailLoading] = useState<boolean>(false);

	// API hooks
	const { list: masterList } = ${finalMasterHookName}({
		page: masterPage,
		size: PAGE_SIZE,
	});

	const { listByMasterId: detailList } = ${finalDetailHookName}({
		masterId: selectedMasterRowId,
		page: 0,
		size: PAGE_SIZE,
	});

	// Master table pagination handler
	const onMasterPageChange = useCallback((pagination: { pageIndex: number }) => {
		setMasterPage(pagination.pageIndex);
	}, []);

	// Master table data table hook
	const {
		table: masterTable,
		toggleRowSelection: toggleMasterRowSelection,
		selectedRows: selectedMasterRows,
	} = useDataTable(
		masterData,
		${pageKey}MasterTableColumns,
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
		${pageKey}DetailTableColumns,
		0,
		1,
		0,
		detailData.length,
		() => {}
	);

	// Update master data when API response changes
	useEffect(() => {
		if (masterList) {
			setMasterLoading(masterList.isLoading || false);
			
			if (masterList.data && masterList.data.content) {
				setMasterData(masterList.data.content);
				setMasterTotalElements(masterList.data.totalElements || 0);
				setMasterPageCount(masterList.data.totalPages || 0);
			} else if (masterList.data && Array.isArray(masterList.data)) {
				setMasterData(masterList.data);
				setMasterTotalElements(masterList.data.length);
				setMasterPageCount(Math.ceil(masterList.data.length / PAGE_SIZE));
			}
		}
	}, [masterList]);

	// Update detail data when API response changes
	useEffect(() => {
		if (detailList) {
			setDetailLoading(detailList.isLoading || false);
			
			if (detailList.data && detailList.data.content) {
				setDetailData(detailList.data.content);
			} else if (detailList.data && Array.isArray(detailList.data)) {
				setDetailData(detailList.data);
			} else if (!selectedMasterRowId) {
				setDetailData([]);
			}
		}
	}, [detailList, selectedMasterRowId]);

	// Handle master row selection to load details
	useEffect(() => {
		if (selectedMasterRows.size > 0) {
			const selectedRowIndex = Array.from(selectedMasterRows)[0];
			const rowIndex = parseInt(selectedRowIndex as string);
			
			if (!isNaN(rowIndex) && rowIndex >= 0 && rowIndex < masterData.length) {
				const selectedRow = masterData[rowIndex];
				if (selectedRow && selectedRow.id) {
					setSelectedMasterData(selectedRow);
					setSelectedMasterRowId(selectedRow.id);
				}
			}
		} else {
			setSelectedMasterData(null);
			setSelectedMasterRowId(0);
		}
	}, [selectedMasterRows, masterData]);

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
					columns={${pageKey}MasterTableColumns}
					data={masterData}
					tableTitle="${masterTableTitle}"
					rowCount={masterTotalElements}
					useSearch={true}
					selectedRows={selectedMasterRows}
					toggleRowSelection={toggleMasterRowSelection}
					enableSingleSelect
					
				/>
			</div>
			<div className="flex flex-col gap-2">
				<div className="border rounded-lg">
					<RadixTabsRoot defaultValue="info">
						<RadixTabsList className="inline-flex h-10 items-center w-full justify-start border-b">
							<RadixTabsTrigger
								value="info"
								className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
							>
								현황
							</RadixTabsTrigger>
							<RadixTabsTrigger
								value="comment"
								className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
							>
								코멘트
							</RadixTabsTrigger>
							<RadixTabsTrigger
								value="files"
								className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
							>
								첨부파일
							</RadixTabsTrigger>
						</RadixTabsList>
						<RadixTabsContent value="info">
							<InfoGrid
								columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 h-full"
								classNames={{
									container: 'rounded shadow-sm',
									item: 'flex gap-2 items-center p-2',
									label: 'text-gray-700 text-sm',
									value: 'font-bold text-sm',
								}}
								data={selectedMasterData || {}}
								keys={InfoGridKeys}
							/>
						</RadixTabsContent>
						<RadixTabsContent value="comment">
							<div className="min-h-[120px] p-4 text-gray-500">
								코멘트 기능이 구현될 예정입니다.
							</div>
						</RadixTabsContent>
						<RadixTabsContent value="files">
							<div className="min-h-[120px] p-4 text-gray-500">
								첨부파일 기능이 구현될 예정입니다.
							</div>
						</RadixTabsContent>
					</RadixTabsRoot>
				</div>
				<div className="border rounded-lg overflow-hidden">
					<DatatableComponent
						table={detailTable}
						columns={${pageKey}DetailTableColumns}
						data={detailData}
						tableTitle="${detailTableTitle}"
						rowCount={detailData.length}
						useSearch={false}
						usePageNation={false}
						selectedRows={selectedDetailRows}
						toggleRowSelection={toggleDetailRowSelection}
						useSummary={true}
						headerOffset="366px"
						isLoading={detailLoading}
					/>
				</div>
			</div>
		</PageTemplate>
	);
};

export default ${pageKey};
`;
};
