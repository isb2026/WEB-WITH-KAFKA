import React from 'react';
import { useDataTable } from '@repo/radix-ui/hook';
import { DatatableComponent } from '@primes/components/datatable/DatatableComponent';
import { useTranslation } from '@repo/i18n';

interface MoldInputInfoProps {
	selectedCommand?: any;
	className?: string;
}

export const MoldInputInfo: React.FC<MoldInputInfoProps> = ({
	selectedCommand,
	className = '',
}) => {
	const { t } = useTranslation('common');

	// 금형 투입 정보 컬럼 정의
	const columns = [
		{
			accessorKey: 'moldCode',
			header: '금형코드',
			size: 120,
		},
		{
			accessorKey: 'moldName',
			header: '금형명',
			size: 150,
		},
		{
			accessorKey: 'moldType',
			header: '금형타입',
			size: 100,
		},
		{
			accessorKey: 'inputDate',
			header: '투입일시',
			size: 120,
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 80,
		},
	];

	// 작업지시가 선택되었을 때만 데이터 표시
	const sampleData = selectedCommand
		? [
				{
					id: 1,
					moldCode: 'MOLD001',
					moldName: '주형 A',
					moldType: '주형',
					inputDate: '2024-01-15 09:00',
					status: '투입중',
				},
				{
					id: 2,
					moldCode: 'MOLD002',
					moldName: '주형 B',
					moldType: '주형',
					inputDate: '2024-01-15 09:30',
					status: '투입중',
				},
			]
		: [];

	// useDataTable 훅 사용 (RootItemsPanel 예제 참고)
	const { table } = useDataTable(
		sampleData,
		columns,
		10, // pageSize
		Math.ceil(sampleData.length / 10), // totalPages
		0, // currentPage
		sampleData.length, // totalCount
		() => {} // onPageChange
	);

	const toggleRowSelection = (rowId: string) => {
		// 금형 선택 로직 (필요시 구현)
		console.log('금형 선택:', rowId);
	};

	const selectedRows = new Set<string>();

	return (
		<div className={`bg-white rounded-lg border h-full ${className}`}>
			<DatatableComponent
				table={table}
				columns={columns}
				data={sampleData}
				tableTitle="금형 투입 정보"
				rowCount={sampleData.length}
				toggleRowSelection={toggleRowSelection}
				selectedRows={selectedRows}
				usePageNation={false}
				useSearch={false}
				enableSingleSelect={false}
				classNames={{
					container: 'h-full',
				}}
			/>
		</div>
	);
};

export default MoldInputInfo;
