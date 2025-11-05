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
	Eye,
	FileText,
	Download,
	CheckCircle,
	XCircle,
	AlertTriangle,
} from 'lucide-react';

type TableCellContext<TData, TValue> = {
	getValue: () => TValue;
	row: { original: TData };
};

interface PrecisionResultRow {
	id: number;
	inspectionDate: string;
	equipmentCode: string;
	productCode: string;
	featureName: string;
	inspector: string;
	result: 'OK' | 'NG' | 'WARN';
	deviation: number; // 편차
	cp: number;
	cpk: number;
}

const QualityPrecisionInspectionListPage: React.FC = () => {
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [selectedMonth, setSelectedMonth] = useState(
		new Date().getMonth() + 1
	);
	const [statusFilter, setStatusFilter] = useState<
		'all' | 'OK' | 'NG' | 'WARN'
	>('all');

	const [rows] = useState<PrecisionResultRow[]>([
		{
			id: 1,
			inspectionDate: '2024-01-15',
			equipmentCode: 'MMS-001',
			productCode: 'SHAFT-205',
			featureName: '직경 Ø24.8±0.05',
			inspector: '김정밀',
			result: 'OK',
			deviation: 0.01,
			cp: 1.45,
			cpk: 1.33,
		},
		{
			id: 2,
			inspectionDate: '2024-01-16',
			equipmentCode: 'CMM-002',
			productCode: 'GEAR-110',
			featureName: '원주도 ≤0.02',
			inspector: '박정밀',
			result: 'WARN',
			deviation: 0.018,
			cp: 1.25,
			cpk: 1.05,
		},
		{
			id: 3,
			inspectionDate: '2024-01-18',
			equipmentCode: 'CMM-003',
			productCode: 'PLATE-330',
			featureName: '평면도 ≤0.01',
			inspector: '최정밀',
			result: 'NG',
			deviation: 0.013,
			cp: 0.95,
			cpk: 0.8,
		},
	]);

	const tableColumns = useMemo(
		() => [
			{ accessorKey: 'inspectionDate', header: '검사일', size: 100 },
			{ accessorKey: 'equipmentCode', header: '장비코드', size: 120 },
			{ accessorKey: 'productCode', header: '제품코드', size: 140 },
			{ accessorKey: 'featureName', header: '특성', size: 220 },
			{ accessorKey: 'inspector', header: '검사자', size: 100 },
			{
				accessorKey: 'result',
				header: '결과',
				size: 90,
				cell: (
					info: TableCellContext<
						PrecisionResultRow,
						PrecisionResultRow['result']
					>
				) => {
					const value = info.getValue();
					const map: Record<
						string,
						{ label: string; cls: string; icon: React.ElementType }
					> = {
						OK: {
							label: 'OK',
							cls: 'bg-green-50 text-green-700',
							icon: CheckCircle,
						},
						NG: {
							label: 'NG',
							cls: 'bg-red-50 text-red-700',
							icon: XCircle,
						},
						WARN: {
							label: '경고',
							cls: 'bg-yellow-50 text-yellow-700',
							icon: AlertTriangle,
						},
					};
					const Icon = map[value].icon;
					return (
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${map[value].cls}`}
						>
							<Icon size={12} /> {map[value].label}
						</span>
					);
				},
			},
			{ accessorKey: 'deviation', header: '편차', size: 80 },
			{ accessorKey: 'cp', header: 'Cp', size: 70 },
			{ accessorKey: 'cpk', header: 'Cpk', size: 70 },
			{
				accessorKey: 'actions',
				header: '작업',
				size: 120,
				cell: (info: TableCellContext<PrecisionResultRow, unknown>) => {
					const row = info.row.original;
					return (
						<div className="flex gap-1">
							<RadixButton
								size="sm"
								variant="ghost"
								className="p-1 h-6 w-6"
								onClick={() => console.log('view detail', row)}
							>
								<Eye size={12} />
							</RadixButton>
							<RadixButton
								size="sm"
								variant="ghost"
								className="p-1 h-6 w-6"
								onClick={() => console.log('export pdf', row)}
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
		const d = new Date(r.inspectionDate);
		const byYm =
			d.getFullYear() === selectedYear &&
			d.getMonth() + 1 === selectedMonth;
		const byStatus = statusFilter === 'all' || r.result === statusFilter;
		return byYm && byStatus;
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
			label: '결과',
			type: 'select',
			options: [
				{ label: '전체', value: 'all' },
				{ label: 'OK', value: 'OK' },
				{ label: '경고', value: 'WARN' },
				{ label: 'NG', value: 'NG' },
			],
		},
		{ name: 'productCode', label: '제품코드', type: 'text' },
		{ name: 'equipmentCode', label: '장비코드', type: 'text' },
		{ name: 'feature', label: '특성', type: 'text' },
	];

	const FilterSlot = () => (
		<div className="flex items-center gap-4">
			<div className="flex items-center gap-2">
				<Calendar size={16} className="text-gray-500" />
				<span className="text-sm font-medium">검사년월:</span>
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
					tableTitle={`${selectedYear}년 ${selectedMonth}월 정밀검사 현황`}
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
							}}
						/>
					}
				/>
			</div>
		</PageTemplate>
	);
};

export default QualityPrecisionInspectionListPage;
