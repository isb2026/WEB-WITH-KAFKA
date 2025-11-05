import React, { useState } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import { Target, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { ProcessedColumnDef } from '@repo/radix-ui/hook';
import { EchartComponent } from '@repo/echart';

interface DailyProductionTarget {
	id: string;
	date: string;
	productCode: string;
	productName: string;
	targetQuantity: number;
	actualQuantity: number;
	achievementRate: number;
	status: 'on-track' | 'behind' | 'ahead';
	notes?: string;
}

const DailyProductionTargetsPage: React.FC = () => {
	const { t } = useTranslation('common');

	// Mock data
	const mockData: DailyProductionTarget[] = [
		{
			id: '1',
			date: '2024-01-15',
			productCode: 'P001',
			productName: '제품 A',
			targetQuantity: 100,
			actualQuantity: 95,
			achievementRate: 95.0,
			status: 'behind',
			notes: '설비 점검으로 인한 지연',
		},
		{
			id: '2',
			date: '2024-01-15',
			productCode: 'P002',
			productName: '제품 B',
			targetQuantity: 80,
			actualQuantity: 85,
			achievementRate: 106.3,
			status: 'ahead',
			notes: '효율성 향상',
		},
		{
			id: '3',
			date: '2024-01-15',
			productCode: 'P003',
			productName: '제품 C',
			targetQuantity: 120,
			actualQuantity: 120,
			achievementRate: 100.0,
			status: 'on-track',
			notes: '계획대로 진행',
		},
		{
			id: '4',
			date: '2024-01-16',
			productCode: 'P001',
			productName: '제품 A',
			targetQuantity: 100,
			actualQuantity: 0,
			achievementRate: 0.0,
			status: 'behind',
			notes: '아직 시작하지 않음',
		},
		{
			id: '5',
			date: '2024-01-16',
			productCode: 'P002',
			productName: '제품 B',
			targetQuantity: 80,
			actualQuantity: 0,
			achievementRate: 0.0,
			status: 'behind',
			notes: '아직 시작하지 않음',
		},
	];

	const columns: ProcessedColumnDef<DailyProductionTarget, any>[] = [
		{
			accessorKey: 'date',
			header: '날짜',
			size: 120,
		},
		{
			accessorKey: 'productCode',
			header: '제품 코드',
			size: 120,
		},
		{
			accessorKey: 'productName',
			header: '제품명',
			size: 200,
		},
		{
			accessorKey: 'targetQuantity',
			header: '목표 수량',
			size: 120,
		},
		{
			accessorKey: 'actualQuantity',
			header: '실적 수량',
			size: 120,
		},
		{
			accessorKey: 'achievementRate',
			header: '달성률 (%)',
			size: 120,
			cell: ({ row }: any) => (
				<div className="flex items-center gap-2">
					<span
						className={`font-medium ${
							row.original.achievementRate >= 100
								? 'text-green-600'
								: row.original.achievementRate >= 90
									? 'text-yellow-600'
									: 'text-red-600'
						}`}
					>
						{row.original.achievementRate.toFixed(1)}%
					</span>
					{row.original.achievementRate >= 100 ? (
						<TrendingUp size={16} className="text-green-600" />
					) : row.original.achievementRate >= 90 ? (
						<TrendingDown size={16} className="text-yellow-600" />
					) : (
						<TrendingDown size={16} className="text-red-600" />
					)}
				</div>
			),
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 120,
			cell: ({ row }: any) => {
				const status = row.original.status;
				const statusConfig = {
					'on-track': {
						label: '정상',
						className: 'bg-green-100 text-green-800',
					},
					behind: {
						label: '지연',
						className: 'bg-red-100 text-red-800',
					},
					ahead: {
						label: '진행',
						className: 'bg-blue-100 text-blue-800',
					},
				};
				// @ts-ignore
				const config = statusConfig[status];
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
					>
						{config.label}
					</span>
				);
			},
		},
		{
			accessorKey: 'notes',
			header: '비고',
			size: 200,
		},
	];

	const DEFAULT_PAGE_SIZE = 30;
	const pageCount = Math.ceil(mockData.length / DEFAULT_PAGE_SIZE);

	const {
		table,
		selectedRows: tableSelectedRows,
		toggleRowSelection,
	} = useDataTable(
		mockData,
		columns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		0,
		mockData.length,
		() => {}
	);

	// Chart data for dashboard
	const chartOption = {
		title: {
			text: '일일 생산 목표 대비 실적',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: {
			data: ['목표 수량', '실적 수량'],
			top: 30,
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: mockData.map((item) => item.productName),
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				name: '목표 수량',
				type: 'bar',
				data: mockData.map((item) => item.targetQuantity),
				itemStyle: { color: '#3B82F6' },
			},
			{
				name: '실적 수량',
				type: 'bar',
				data: mockData.map((item) => item.actualQuantity),
				itemStyle: { color: '#10B981' },
			},
		],
	};

	// Summary cards data
	const summaryData = [
		{
			title: '전체 목표',
			value: mockData.reduce((sum, item) => sum + item.targetQuantity, 0),
			icon: Target,
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
		},
		{
			title: '전체 실적',
			value: mockData.reduce((sum, item) => sum + item.actualQuantity, 0),
			icon: TrendingUp,
			color: 'text-green-600',
			bgColor: 'bg-green-50',
		},
		{
			title: '평균 달성률',
			value: `${(mockData.reduce((sum, item) => sum + item.achievementRate, 0) / mockData.length).toFixed(1)}%`,
			icon: TrendingUp,
			color: 'text-purple-600',
			bgColor: 'bg-purple-50',
		},
		{
			title: '진행 상태',
			value: `${mockData.filter((item) => item.status === 'on-track').length}/${mockData.length}`,
			icon: Calendar,
			color: 'text-orange-600',
			bgColor: 'bg-orange-50',
		},
	];

	return (
		<div className="space-y-4">
			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{summaryData.map((item, index) => (
					<div
						key={index}
						className={`${item.bgColor} p-4 rounded-lg border`}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									{item.title}
								</p>
								<p
									className={`text-2xl font-bold ${item.color}`}
								>
									{item.value}
								</p>
							</div>
							<item.icon size={24} className={item.color} />
						</div>
					</div>
				))}
			</div>

			{/* Chart */}
			<div className="bg-white p-6 rounded-lg border">
				<EchartComponent options={chartOption} height="400px" />
			</div>

			{/* Data Table */}
			<div className="bg-white rounded-lg border">
				<DatatableComponent
					table={table}
					columns={columns}
					data={mockData}
					toggleRowSelection={toggleRowSelection}
					selectedRows={tableSelectedRows}
					tableTitle="일일 생산 목표 현황"
					rowCount={mockData.length}
					useSearch={true}
					usePageNation={true}
					actionButtons={
						<div className="flex gap-2">
							<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
								<Calendar size={16} />
								계획 수립
							</RadixIconButton>
							<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
								<TrendingUp size={16} />
								실적 입력
							</RadixIconButton>
						</div>
					}
				/>
			</div>
		</div>
	);
};

export default DailyProductionTargetsPage;
