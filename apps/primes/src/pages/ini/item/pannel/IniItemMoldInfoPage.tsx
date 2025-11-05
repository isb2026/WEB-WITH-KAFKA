import React, { useState, useEffect } from 'react';
import { useDataTable } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { Item } from '@primes/types/item';

interface IniItemMoldInfoPageProps {
	item?: Item;
}

export const IniItemMoldInfoPage: React.FC<IniItemMoldInfoPageProps> = ({
	item,
}) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	// DataTable State
	const [data, setData] = useState<any[]>([]);
	const [page, setPage] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(30);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);

	// 목업 데이터 생성
	const createMockupData = () => {
		if (!item) return;

		const moldTypes = ['사출금형', '압출금형', '블로우금형', '프레스금형'];
		const progressNames = ['1차 성형', '2차 가공', '조립', '마감', '포장'];
		const moldStatuses = ['사용중', '점검중', '수리중', '대기중'];
		const locations = ['A동 1층', 'B동 2층', 'C동 지하', '외부창고'];

		const mockupData = [];
		for (let i = 0; i < 6; i++) {
			const moldType = moldTypes[i % moldTypes.length];
			const progressName = progressNames[i % progressNames.length];
			const status = moldStatuses[i % moldStatuses.length];
			const location = locations[i % locations.length];

			mockupData.push({
				id: i + 1,
				moldCode: `MOLD-${(i + 1).toString().padStart(3, '0')}`,
				moldName: `${item.itemName} ${moldType} ${i + 1}`,
				moldType: moldType,
				progressName: progressName,
				progressOrder: i + 1,
				capacity: `${(i + 1) * 100}개/시간`,
				status: status,
				location: location,
				lastUsedDate: new Date(
					Date.now() - i * 24 * 60 * 60 * 1000
				).toLocaleDateString(),
				totalUsageCount: (i + 1) * 1000,
				memo:
					i === 0
						? '주력 생산 금형'
						: i === 1
							? '예비 금형'
							: i === 2
								? '정밀 가공용'
								: '',
			});
		}
		setData(mockupData);
		setTotalElements(mockupData.length);
	};

	useEffect(() => {
		createMockupData();
	}, [item]);

	const moldInfoColumns = [
		{
			accessorKey: 'moldCode',
			header: '금형코드',
			size: 120,
		},
		{
			accessorKey: 'moldName',
			header: '금형명',
			size: 180,
		},
		{
			accessorKey: 'moldType',
			header: '금형유형',
			size: 100,
			cell: ({ getValue }: { getValue: () => string }) => {
				const type = getValue();
				return <span>{type}</span>;
			},
		},
		{
			accessorKey: 'progressName',
			header: '적용공정',
			size: 120,
		},
		{
			accessorKey: 'progressOrder',
			header: '공정순서',
			size: 80,
			cell: ({ getValue }: { getValue: () => number }) => {
				const order = getValue();
				return (
					<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
						{order}단계
					</span>
				);
			},
		},
		{
			accessorKey: 'capacity',
			header: '생산능력',
			size: 120,
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 100,
			cell: ({ getValue }: { getValue: () => string }) => {
				const status = getValue();
				const getStatusColor = (status: string) => {
					switch (status) {
						case '사용중':
							return 'bg-green-100 text-green-800 border-green-200';
						case '점검중':
							return 'bg-yellow-100 text-yellow-800 border-yellow-200';
						case '수리중':
							return 'bg-red-100 text-red-800 border-red-200';
						case '대기중':
							return 'bg-gray-100 text-gray-800 border-gray-200';
						default:
							return 'bg-gray-100 text-gray-800';
					}
				};
				return (
					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
					>
						{status}
					</span>
				);
			},
		},
		{
			accessorKey: 'location',
			header: '보관위치',
			size: 120,
		},
		{
			accessorKey: 'lastUsedDate',
			header: '최종사용일',
			size: 120,
		},
		{
			accessorKey: 'totalUsageCount',
			header: '총사용횟수',
			size: 120,
			cell: ({ getValue }: { getValue: () => number }) => {
				const count = getValue();
				return `${count.toLocaleString()}회`;
			},
		},
		{
			accessorKey: 'memo',
			header: '비고',
			size: 150,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value || '-';
			},
		},
	];

	// 테이블 설정
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		moldInfoColumns,
		pageSize,
		pageCount,
		page,
		totalElements,
		(page) => {
			setPage(page.pageIndex);
		}
	);

	if (!item) {
		return (
			<div className="flex items-center justify-center h-64 text-gray-500">
				<div className="text-center">
					<p className="text-lg font-medium">품목을 선택해주세요</p>
					<p className="text-sm">
						왼쪽에서 품목을 선택하면 금형 정보를 확인할 수 있습니다
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full">
			<DatatableComponent
				table={table}
				columns={moldInfoColumns}
				data={data}
				tableTitle={`${item.itemName} - 금형 정보`}
				rowCount={totalElements}
				useSearch={true}
				enableSingleSelect={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
			/>
		</div>
	);
};

export default IniItemMoldInfoPage;
