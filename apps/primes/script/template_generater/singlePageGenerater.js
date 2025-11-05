import {
	parseColumnsFromString,
	columnsToString,
} from '../utils/columnUtils.js';
import { toPascalCase, toCamelCase } from '../utils/stringUtils.js';

// 페이지 템플릿을 생성하는 함수 - 개선된 버전
export const SinglePageGenerater = (
	pageKey,
	columnsArray,
	dataHook,
	tableTitle
) => {
	// 컬럼 파싱 및 개선
	const parsedColumns = parseColumnsFromString(columnsArray);
	const improvedColumnsString = columnsToString(parsedColumns);

	// 페이지 데이터 타입명 생성
	const dataTypeName = `${toPascalCase(pageKey.replace(/Page$/, ''))}Data`;

	// hookName에서 하이픈 제거
	const cleanHookName = toCamelCase(dataHook.replace(/^use/, ''));
	const finalHookName = `use${toPascalCase(cleanHookName)}`;

	return `import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { ${finalHookName} } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';

interface ${dataTypeName} {
	id: number;
	name?: string;
	code?: string;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: any;
}

export const ${pageKey}: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<${dataTypeName}[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);

	
	const DEFAULT_PAGE_SIZE = 30;
	
	const tableColumns = ${improvedColumnsString};
	
	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// API 호출
	const { data: apiData, isLoading, error } = ${finalHookName}({ 
		page: page, 
		size: DEFAULT_PAGE_SIZE 
	});
	
	useEffect(() => {
		if (apiData) {
			if (apiData.content) {
				// 페이지네이션 응답 처리
				setData(apiData.content);
				setTotalElements(apiData.totalElements || 0);
				setPageCount(apiData.totalPages || 0);
			} else if (Array.isArray(apiData)) {
				// 배열 형태의 응답 처리
				setData(apiData);
				setTotalElements(apiData.length);
				setPageCount(Math.ceil(apiData.length / DEFAULT_PAGE_SIZE));
			}
		}
	}, [apiData]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		tableColumns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	return (
		<PageTemplate firstChildWidth="30%" className="border rounded-lg">
			<DatatableComponent
				table={table}
				columns={tableColumns}
				data={data}
				tableTitle="${tableTitle}"
				rowCount={totalElements}
				useSearch={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
				searchSlot={<SearchSlotComponent />}
				
			/>
		</PageTemplate>
	);
};

export default ${pageKey};
`;
};
