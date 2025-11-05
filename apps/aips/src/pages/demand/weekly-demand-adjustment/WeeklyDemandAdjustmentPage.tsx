import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { CalendarDays, TrendingUp, Edit3, BarChart3 } from 'lucide-react';
import { weeklyDemandAdjustmentData } from '../dummy-data/weeklyDemandAdjustmentData';
import { EchartComponent } from '@repo/echart';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns, ColumnConfig } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface WeeklyDemandAdjustment {
	id: number;
	productName: string;
	week1: { original: number; adjusted: number; variance: number };
	week2: { original: number; adjusted: number; variance: number };
	week3: { original: number; adjusted: number; variance: number };
	week4: { original: number; adjusted: number; variance: number };
	week5: { original: number; adjusted: number; variance: number };
	week6: { original: number; adjusted: number; variance: number };
	week7: { original: number; adjusted: number; variance: number };
	week8: { original: number; adjusted: number; variance: number };
	totalOriginal: number;
	totalAdjusted: number;
	totalVariance: number;
	adjustmentReason?: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

export const WeeklyDemandAdjustmentPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<WeeklyDemandAdjustment[]>([]);

	useEffect(() => {
		setData(weeklyDemandAdjustmentData);
	}, []);

	const weeks = [
		{ key: 'week1', label: '1주차' },
		{ key: 'week2', label: '2주차' },
		{ key: 'week3', label: '3주차' },
		{ key: 'week4', label: '4주차' },
		{ key: 'week5', label: '5주차' },
		{ key: 'week6', label: '6주차' },
		{ key: 'week7', label: '7주차' },
		{ key: 'week8', label: '8주차' },
	];

	const getVarianceColor = (variance: number) => {
		if (variance > 0) return 'text-green-600';
		if (variance < 0) return 'text-red-600';
		return 'text-gray-600';
	};

	const getVarianceIcon = (variance: number) => {
		if (variance > 0)
			return <TrendingUp className="h-4 w-4 text-green-600" />;
		if (variance < 0)
			return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
		return <BarChart3 className="h-4 w-4 text-gray-600" />;
	};

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<WeeklyDemandAdjustment>[]>(
		() => [
			{
				accessorKey: 'productName',
				header: '제품명',
				size: 150,
				align: 'left' as const,
			},
			...weeks.map((week) => ({
				accessorKey: week.key as keyof WeeklyDemandAdjustment,
				header: week.label,
				size: 120,
				align: 'left' as const,
				accessorFn: (row: WeeklyDemandAdjustment) => {
					const weekKey = week.key as keyof WeeklyDemandAdjustment;
					const weekData = row[weekKey] as {
						original: number;
						adjusted: number;
						variance: number;
					};
					return weekData.adjusted; // Return adjusted value for editing
				},
				cell: ({ row }: { row: any }) => {
					const item = row.original as WeeklyDemandAdjustment;
					const weekKey = week.key as keyof WeeklyDemandAdjustment;
					const weekData = item[weekKey] as {
						original: number;
						adjusted: number;
						variance: number;
					};

					return (
						<div className="space-y-1">
							<div className="text-gray-600">
								{weekData.original.toLocaleString()}
							</div>
							<div className="font-medium text-center">
								{weekData.adjusted.toLocaleString()}
							</div>
							<div
								className={`flex items-center justify-center gap-1 ${getVarianceColor(weekData.variance)}`}
							>
								{getVarianceIcon(weekData.variance)}
								<span className="text-xs">
									{weekData.variance > 0 ? '+' : ''}
									{weekData.variance.toLocaleString()}
								</span>
							</div>
						</div>
					);
				},
			})),
			{
				accessorKey: 'totalOriginal',
				header: '합계',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => {
					const item = row.original as WeeklyDemandAdjustment;
					return (
						<div className="space-y-1">
							<div className="text-gray-600 text-center">
								{item.totalOriginal.toLocaleString()}
							</div>
							<div className="font-medium text-center">
								{item.totalAdjusted.toLocaleString()}
							</div>
							<div
								className={`flex items-center justify-center gap-1 ${getVarianceColor(item.totalVariance)}`}
							>
								{getVarianceIcon(item.totalVariance)}
								<span className="text-xs">
									{item.totalVariance > 0 ? '+' : ''}
									{item.totalVariance.toLocaleString()}
								</span>
							</div>
						</div>
					);
				},
			},
		],
		[weeks]
	);

	const processedColumns = useDataTableColumns(columns);
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		processedColumns,
		30,
		0,
		0,
		data.length,
		undefined
	);

	// Handle cell updates for adjusted values
	const handleCellUpdate = (id: number, field: string, value: string) => {
		const numValue = parseInt(value) || 0;

		// Check if it's a week field
		if (weeks.some((w) => w.key === field)) {
			setData((prev) =>
				prev.map((item) => {
					if (item.id === id) {
						const updatedItem = { ...item };
						const weekKey = field as keyof WeeklyDemandAdjustment;
						const weekData = updatedItem[weekKey] as any;

						// Update adjusted value
						weekData.adjusted = numValue;
						// Recalculate variance
						weekData.variance =
							weekData.adjusted - weekData.original;

						// Recalculate totals
						let totalAdjusted = 0;
						weeks.forEach((week) => {
							const weekKey =
								week.key as keyof WeeklyDemandAdjustment;
							const weekData = updatedItem[weekKey] as any;
							totalAdjusted += weekData.adjusted;
						});

						updatedItem.totalAdjusted = totalAdjusted;
						updatedItem.totalVariance =
							totalAdjusted - updatedItem.totalOriginal;

						return updatedItem;
					}
					return item;
				})
			);
		}
	};

	return (
		<div className="space-y-6">
			{/* 요약 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center">
						<div className="p-2 bg-blue-100 rounded-lg">
							<TrendingUp className="h-6 w-6 text-blue-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								총 원본 수요
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data
									.reduce(
										(sum, item) => sum + item.totalOriginal,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center">
						<div className="p-2 bg-green-100 rounded-lg">
							<CalendarDays className="h-6 w-6 text-green-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								총 조정 수량
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data
									.reduce(
										(sum, item) => sum + item.totalAdjusted,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
				<div className=" p-4 rounded-lg border">
					<div className="flex items-center">
						<div className="p-2 bg-yellow-100 rounded-lg">
							<BarChart3 className="h-6 w-6 text-yellow-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								조정 비율
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									(data.reduce(
										(sum, item) => sum + item.totalAdjusted,
										0
									) /
										data.reduce(
											(sum, item) =>
												sum + item.totalOriginal,
											0
										)) *
										100
								)}
								%
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center">
						<div className="p-2 bg-purple-100 rounded-lg">
							<Edit3 className="h-6 w-6 text-purple-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								관리 제품 수
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data.length}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 트렌드 차트 */}
			<div className="p-4 rounded-lg border">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					주간 수요 조정 트렌드
				</h3>
				<div className="h-62">
					<EchartComponent
						options={{
							title: {
								text: '주간 수요 조정 트렌드',
								left: 'center',
							},
							tooltip: {
								trigger: 'axis',
							},
							legend: {
								data: ['원본 수요', '조정 수요'],
								top: 30,
							},
							xAxis: {
								type: 'category',
								data: weeks.map((w) => w.label),
							},
							yAxis: {
								type: 'value',
							},
							series: [
								{
									name: '원본 수요',
									type: 'line',
									data: weeks.map((week) =>
										data.reduce(
											(sum, item) =>
												sum +
												(
													item[
														week.key as keyof WeeklyDemandAdjustment
													] as any
												).original,
											0
										)
									),
								},
								{
									name: '조정 수요',
									type: 'line',
									data: weeks.map((week) =>
										data.reduce(
											(sum, item) =>
												sum +
												(
													item[
														week.key as keyof WeeklyDemandAdjustment
													] as any
												).adjusted,
											0
										)
									),
								},
							],
						}}
						height="250px"
					/>
				</div>
			</div>

			{/* DataTable */}
			<div className="rounded-lg border overflow-hidden">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="주간 수요 조정 데이터"
					rowCount={data.length}
					useSearch={false}
					usePageNation={false}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					onCellUpdate={handleCellUpdate}
					useEditable={true}
				/>
			</div>
		</div>
	);
};

export default WeeklyDemandAdjustmentPage;
