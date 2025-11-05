import React, { useState, useEffect } from 'react';
import { useDataTable } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { Item } from '@primes/types/item';

interface IniItemCheckListPageProps {
	item?: Item;
}

export const IniItemCheckListPage: React.FC<IniItemCheckListPageProps> = ({
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

		const inspectionTypes = [
			'치수검사',
			'외관검사',
			'기능검사',
			'성능검사',
			'내구성검사',
		];
		const inspectionMethods = [
			'육안검사',
			'측정기검사',
			'시험기검사',
			'샘플링검사',
		];
		const standards = ['KS 표준', 'ISO 표준', '사내 기준', '고객 기준'];
		const frequencies = ['전수검사', '샘플링', '주기적', '수시'];

		const mockupData = [];
		for (let i = 0; i < 8; i++) {
			const type = inspectionTypes[i % inspectionTypes.length];
			const method = inspectionMethods[i % inspectionMethods.length];
			const standard = standards[i % standards.length];
			const frequency = frequencies[i % frequencies.length];

			mockupData.push({
				id: i + 1,
				inspectionItem: `${type} ${i + 1}`,
				inspectionType: type,
				inspectionMethod: method,
				standard: standard,
				upperLimit: i % 2 === 0 ? `${10 + i}mm` : '',
				lowerLimit: i % 2 === 0 ? `${5 + i}mm` : '',
				targetValue: i % 2 === 0 ? `${7.5 + i}mm` : '',
				frequency: frequency,
				isRequired: i < 4, // 처음 4개는 필수
				memo:
					i === 0
						? '핵심 품질 검사항목'
						: i === 1
							? '고객 요구사항 반영'
							: i === 2
								? '정기 점검 필요'
								: '',
			});
		}
		setData(mockupData);
		setTotalElements(mockupData.length);
	};

	useEffect(() => {
		createMockupData();
	}, [item]);

	const checkListColumns = [
		{
			accessorKey: 'inspectionItem',
			header: '검사항목',
			size: 150,
		},
		{
			accessorKey: 'inspectionType',
			header: '검사유형',
			size: 100,
			cell: ({ getValue }: { getValue: () => string }) => {
				const type = getValue();
				return <span>{type}</span>;
			},
		},
		{
			accessorKey: 'inspectionMethod',
			header: '검사방법',
			size: 120,
		},
		{
			accessorKey: 'standard',
			header: '검사기준',
			size: 100,
		},
		{
			accessorKey: 'targetValue',
			header: '기준값',
			size: 80,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'upperLimit',
			header: '상한값',
			size: 80,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'lowerLimit',
			header: '하한값',
			size: 80,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'frequency',
			header: '검사빈도',
			size: 100,
		},
		{
			accessorKey: 'isRequired',
			header: '필수여부',
			size: 100,
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const isRequired = getValue();
				return isRequired ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
						필수
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
						선택
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
		checkListColumns,
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
						왼쪽에서 품목을 선택하면 검사항목을 확인할 수 있습니다
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full">
			<DatatableComponent
				table={table}
				columns={checkListColumns}
				data={data}
				tableTitle={`${item.itemName} - 검사항목`}
				rowCount={totalElements}
				useSearch={true}
				enableSingleSelect={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
			/>
		</div>
	);
};

export default IniItemCheckListPage;
