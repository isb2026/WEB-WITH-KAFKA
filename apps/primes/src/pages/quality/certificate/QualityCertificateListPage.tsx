import React, { useMemo, useState } from 'react';
import PageTemplate from '@primes/templates/PageTemplate';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import type { FormField } from '@primes/components/form/DynamicFormComponent';
import {
	RadixButton,
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
} from '@repo/radix-ui/components';
import {
	Calendar,
	Download,
	Eye,
	FileText,
	XCircle,
	CheckCircle,
} from 'lucide-react';

type TableCellContext<TData, TValue> = {
	getValue: () => TValue;
	row: { original: TData };
};

interface CertificateRow {
	id: number;
	certNo: string;
	issuedAt: string;
	templateName: string;
	targetType: string;
	targetCode: string;
	inspector: string;
	status: 'issued' | 'cancelled';
}

const QualityCertificateListPage: React.FC = () => {
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [selectedMonth, setSelectedMonth] = useState(
		new Date().getMonth() + 1
	);
	const [statusFilter, setStatusFilter] = useState<
		'all' | 'issued' | 'cancelled'
	>('all');
	const [templateFilter, setTemplateFilter] = useState<
		'all' | 'default' | 'en-default'
	>('all');

	const [rows] = useState<CertificateRow[]>([
		{
			id: 1,
			certNo: 'QC-202401-0001',
			issuedAt: '2024-01-15',
			templateName: '기본 템플릿',
			targetType: 'equipment',
			targetCode: 'INJ-001',
			inspector: '김정비',
			status: 'issued',
		},
		{
			id: 2,
			certNo: 'QC-202401-0002',
			issuedAt: '2024-01-16',
			templateName: '영문 템플릿',
			targetType: 'equipment',
			targetCode: 'PRS-003',
			inspector: '박안전',
			status: 'issued',
		},
		{
			id: 3,
			certNo: 'QC-202401-0003',
			issuedAt: '2024-01-18',
			templateName: '기본 템플릿',
			targetType: 'product',
			targetCode: 'SP-CASE-001',
			inspector: '최정밀',
			status: 'cancelled',
		},
	]);

	const tableColumns = useMemo(
		() => [
			{ accessorKey: 'certNo', header: '성적서번호', size: 160 },
			{ accessorKey: 'issuedAt', header: '발행일', size: 100 },
			{ accessorKey: 'templateName', header: '템플릿', size: 140 },
			{ accessorKey: 'targetType', header: '대상유형', size: 100 },
			{ accessorKey: 'targetCode', header: '대상코드', size: 140 },
			{ accessorKey: 'inspector', header: '발행자', size: 100 },
			{
				accessorKey: 'status',
				header: '상태',
				size: 100,
				cell: (
					info: TableCellContext<
						CertificateRow,
						CertificateRow['status']
					>
				) => {
					const value = info.getValue();
					return value === 'issued' ? (
						<span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 flex items-center gap-1">
							<CheckCircle size={12} /> 발행
						</span>
					) : (
						<span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 flex items-center gap-1">
							<XCircle size={12} /> 취소
						</span>
					);
				},
			},
			{
				accessorKey: 'actions',
				header: '작업',
				size: 120,
				cell: (info: TableCellContext<CertificateRow, unknown>) => {
					const row = info.row.original;
					return (
						<div className="flex gap-1">
							<RadixButton
								size="sm"
								variant="ghost"
								className="p-1 h-6 w-6"
								onClick={() => console.log('view', row)}
							>
								<Eye size={12} />
							</RadixButton>
							<RadixButton
								size="sm"
								variant="ghost"
								className="p-1 h-6 w-6"
								onClick={() => console.log('download', row)}
							>
								<FileText size={12} />
							</RadixButton>
						</div>
					);
				},
			},
		],
		[]
	);

	const filtered = rows.filter((r) => {
		const d = new Date(r.issuedAt);
		const byYm =
			d.getFullYear() === selectedYear &&
			d.getMonth() + 1 === selectedMonth;
		const byStatus = statusFilter === 'all' || r.status === statusFilter;
		const byTemplate =
			templateFilter === 'all' ||
			(templateFilter === 'default'
				? r.templateName.includes('기본')
				: r.templateName.includes('영문'));
		return byYm && byStatus && byTemplate;
	});

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		filtered,
		tableColumns,
		10,
		1,
		0,
		filtered.length,
		() => {}
	);

	const searchFields: FormField[] = [
		{
			name: 'status',
			label: '상태',
			type: 'select',
			options: [
				{ label: '전체', value: 'all' },
				{ label: '발행', value: 'issued' },
				{ label: '취소', value: 'cancelled' },
			],
		},
		{
			name: 'template',
			label: '템플릿',
			type: 'select',
			options: [
				{ label: '전체', value: 'all' },
				{ label: '기본 템플릿', value: 'default' },
				{ label: '영문 템플릿', value: 'en-default' },
			],
		},
		{
			name: 'keyword',
			label: '검색어',
			type: 'text',
			placeholder: '성적서번호/대상코드',
		},
	];

	const FilterSlot = () => (
		<div className="flex items-center gap-4">
			<div className="flex items-center gap-2">
				<Calendar size={16} className="text-gray-500" />
				<span className="text-sm font-medium">발행년월:</span>
			</div>
			<div className="flex items-center gap-2">
				<div className="min-w-[100px]">
					<RadixSelect
						value={selectedYear.toString()}
						onValueChange={(v) => setSelectedYear(parseInt(v))}
					>
						<RadixSelectGroup>
							<RadixSelectItem value="2023">
								2023년
							</RadixSelectItem>
							<RadixSelectItem value="2024">
								2024년
							</RadixSelectItem>
							<RadixSelectItem value="2025">
								2025년
							</RadixSelectItem>
						</RadixSelectGroup>
					</RadixSelect>
				</div>
				<div className="min-w-[80px]">
					<RadixSelect
						value={selectedMonth.toString()}
						onValueChange={(v) => setSelectedMonth(parseInt(v))}
					>
						<RadixSelectGroup>
							{Array.from({ length: 12 }, (_, i) => (
								<RadixSelectItem
									key={i + 1}
									value={(i + 1).toString()}
								>
									{i + 1}월
								</RadixSelectItem>
							))}
						</RadixSelectGroup>
					</RadixSelect>
				</div>
			</div>
		</div>
	);

	const ActionButtons = () => (
		<RadixButton
			variant="outline"
			className="flex items-center gap-2"
			onClick={() => console.log('export')}
		>
			<Download size={16} /> 내보내기
		</RadixButton>
	);

	return (
		<PageTemplate>
			<div className="bg-white rounded-lg shadow">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={filtered}
					tableTitle={`${selectedYear}년 ${selectedMonth}월 성적서 목록`}
					rowCount={filtered.length}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					useSearch={true}
					usePageNation={true}
					useSummary={true}
					searchSlot={
						<SearchSlotComponent
							topSlot={<FilterSlot />}
							endSlot={<ActionButtons />}
							fields={searchFields}
							onSearch={(data) => {
								if (data.status)
									setStatusFilter(data.status as any);
								if (data.template)
									setTemplateFilter(data.template as any);
							}}
						/>
					}
				/>
			</div>
		</PageTemplate>
	);
};

export default QualityCertificateListPage;
