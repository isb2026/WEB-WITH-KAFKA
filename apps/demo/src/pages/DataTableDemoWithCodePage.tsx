import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import DataTableDemo from './demo/DataTableDemo';

const DataTableDemoWithCodePage: React.FC = () => {
	const codeString = `import { DataTable } from '@repo/radix-ui/components';
  import React, { useEffect, useState } from 'react';
  import {
    useDataTableColumns,
    type ProcessedColumnConfig,
  } from '../../../../../packages/radix-ui/src/hook/useDataTableColumns';
  import { columns, getData } from '../../utils/data-table';
  
  // Define your data type
  export type Payment = {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'success' | 'failed';
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    description: string;
  };
  
  const DataTableDemo: React.FC = () => {
    const [data, setData] = useState<Payment[]>([]);
    // Define your columns that matches what you want 
    const processedColumns = useDataTableColumns<Payment>(columns);
  
    useEffect(() => {
      // This is mock data, Welcome to use your nice real data from db
      getData().then(setData);
    }, []);
  
    return (
      <div className="py-2 space-y-8">
        <DataTable
          columns={processedColumns as ProcessedColumnConfig<Payment>[]}
          data={data}
        />
      </div>
    );
  };
  
  export default DataTableDemo;
  `.trim();

	return (
		<div className="min-h-screen w-full bg-gray-50 px-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Data Table 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					표 형식의 데이터를 표시, 필터링, 정렬, 페이지 매김하기 위한
					강력하고 유연한 데이터 테이블 컴포넌트입니다.
				</p>

				<PreviewCodeTabs
					preview={<DataTableDemo />}
					code={
						<pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
							{codeString}
						</pre>
					}
				/>
			</div>
		</div>
	);
};

export default DataTableDemoWithCodePage;
