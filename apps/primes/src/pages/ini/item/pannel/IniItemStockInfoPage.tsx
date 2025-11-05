import React, { useState, useEffect } from 'react';
import { useDataTable } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { Item } from '@primes/types/item';

interface IniItemStockInfoPageProps {
	item?: Item;
}

export const IniItemStockInfoPage: React.FC<IniItemStockInfoPageProps> = ({
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

		const locations = [
			'A창고 1-A-01',
			'B창고 2-B-05',
			'C창고 3-C-10',
			'외부창고 EXT-01',
		];
		const stockTypes = ['완제품', '반제품', '원자재', '부품'];
		const stockStatuses = ['정상', '불량', '보류', '검사중'];

		const mockupData = [];
		for (let i = 0; i < 5; i++) {
			const location = locations[i % locations.length];
			const stockType = stockTypes[i % stockTypes.length];
			const status = stockStatuses[i % stockStatuses.length];
			const currentStock = Math.floor(Math.random() * 1000) + 100;
			const safetyStock = Math.floor(currentStock * 0.2);
			const optimalStock = Math.floor(currentStock * 1.5);

			mockupData.push({
				id: i + 1,
				location: location,
				stockType: stockType,
				currentStock: currentStock,
				safetyStock: safetyStock,
				optimalStock: optimalStock,
				availableStock: currentStock - Math.floor(Math.random() * 50),
				reservedStock: Math.floor(Math.random() * 50),
				lastInDate: new Date(
					Date.now() - i * 2 * 24 * 60 * 60 * 1000
				).toLocaleDateString(),
				lastOutDate: new Date(
					Date.now() - i * 24 * 60 * 60 * 1000
				).toLocaleDateString(),
				status: status,
				unitCost: (
					(i + 1) * 1000 +
					Math.floor(Math.random() * 500)
				).toLocaleString(),
				totalValue: (
					currentStock *
					((i + 1) * 1000 + Math.floor(Math.random() * 500))
				).toLocaleString(),
				memo:
					i === 0
						? '주력 재고 위치'
						: i === 1
							? '예비 재고'
							: i === 2
								? '긴급 재고'
								: '',
			});
		}
		setData(mockupData);
		setTotalElements(mockupData.length);
	};

	useEffect(() => {
		createMockupData();
	}, [item]);

	const stockInfoColumns = [
		{
			accessorKey: 'location',
			header: '보관위치',
			size: 130,
			cell: ({ getValue }: { getValue: () => string }) => {
				const location = getValue();
				return <span>{location}</span>;
			},
		},
		{
			accessorKey: 'stockType',
			header: '재고유형',
			size: 100,
			cell: ({ getValue }: { getValue: () => string }) => {
				const type = getValue();
				return <span>{type}</span>;
			},
		},
		{
			accessorKey: 'currentStock',
			header: '현재재고',
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const stock = getValue();
				return (
					<span className="font-medium text-blue-600">
						{stock.toLocaleString()}
					</span>
				);
			},
		},
		{
			accessorKey: 'availableStock',
			header: '가용재고',
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const stock = getValue();
				return (
					<span className="font-medium text-green-600">
						{stock.toLocaleString()}
					</span>
				);
			},
		},
		{
			accessorKey: 'reservedStock',
			header: '예약재고',
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const stock = getValue();
				return stock > 0 ? (
					<span className="font-medium text-orange-600">
						{stock.toLocaleString()}
					</span>
				) : (
					<span className="text-gray-400">-</span>
				);
			},
		},
		{
			accessorKey: 'safetyStock',
			header: '안전재고',
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const stock = getValue();
				return (
					<span className="text-gray-600">
						{stock.toLocaleString()}
					</span>
				);
			},
		},
		{
			accessorKey: 'optimalStock',
			header: '적정재고',
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const stock = getValue();
				return (
					<span className="text-gray-600">
						{stock.toLocaleString()}
					</span>
				);
			},
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 100,
			cell: ({ getValue }: { getValue: () => string }) => {
				const status = getValue();
				const getStatusColor = (status: string) => {
					switch (status) {
						case '정상':
							return 'bg-green-100 text-green-800 border-green-200';
						case '불량':
							return 'bg-red-100 text-red-800 border-red-200';
						case '보류':
							return 'bg-yellow-100 text-yellow-800 border-yellow-200';
						case '검사중':
							return 'bg-blue-100 text-blue-800 border-blue-200';
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
			accessorKey: 'lastInDate',
			header: '최종입고일',
			size: 120,
		},
		{
			accessorKey: 'lastOutDate',
			header: '최종출고일',
			size: 120,
		},
		{
			accessorKey: 'unitCost',
			header: '단가',
			size: 100,
			cell: ({ getValue }: { getValue: () => string }) => {
				const cost = getValue();
				return `₩${cost}`;
			},
		},
		{
			accessorKey: 'totalValue',
			header: '총재고가치',
			size: 130,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return (
					<span className="font-semibold text-purple-600">
						₩{value}
					</span>
				);
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
		stockInfoColumns,
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
						왼쪽에서 품목을 선택하면 재고 정보를 확인할 수 있습니다
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full">
			{/* 재고 요약 정보 */}
			<div className="p-4 mb-4 grid grid-cols-4 gap-4">
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<div>
						<p className="text-xs text-blue-600 font-medium mb-1">
							현재재고
						</p>
						<p className="text-xl font-bold text-blue-800">
							{data
								.reduce(
									(sum, item) => sum + item.currentStock,
									0
								)
								.toLocaleString()}
						</p>
					</div>
				</div>
				<div className="bg-green-50 border border-green-200 rounded-lg p-4">
					<div>
						<p className="text-xs text-green-600 font-medium mb-1">
							가용재고
						</p>
						<p className="text-xl font-bold text-green-800">
							{data
								.reduce(
									(sum, item) => sum + item.availableStock,
									0
								)
								.toLocaleString()}
						</p>
					</div>
				</div>
				<div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
					<div>
						<p className="text-xs text-orange-600 font-medium mb-1">
							예약재고
						</p>
						<p className="text-xl font-bold text-orange-800">
							{data
								.reduce(
									(sum, item) => sum + item.reservedStock,
									0
								)
								.toLocaleString()}
						</p>
					</div>
				</div>
				<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
					<div>
						<p className="text-xs text-purple-600 font-medium mb-1">
							총재고가치
						</p>
						<p className="text-xl font-bold text-purple-800">
							₩
							{data
								.reduce(
									(sum, item) =>
										sum +
										parseInt(
											item.totalValue.replace(/,/g, '')
										),
									0
								)
								.toLocaleString()}
						</p>
					</div>
				</div>
			</div>

			{/* 재고 상세 테이블 */}
			<DatatableComponent
				table={table}
				columns={stockInfoColumns}
				data={data}
				tableTitle={`${item.itemName} - 재고 상세 정보`}
				rowCount={totalElements}
				useSearch={true}
				enableSingleSelect={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
			/>
		</div>
	);
};

export default IniItemStockInfoPage;
