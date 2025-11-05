import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	Activity,
	AlertCircle,
	TrendingUp,
	Target,
	Factory,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns, ColumnConfig } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface CapacityData {
	id: number;
	lineName: string;
	plantName: string;
	productName: string;
	productCode: string;
	plannedCapacity: number;
	actualCapacity: number;
	utilization: number;
	load: number;
	capacity: number;
	loadVsCapacity: number;
	bottleneck: boolean;
	bottleneckType: 'capacity' | 'material' | 'labor' | 'none';
	status: 'optimal' | 'warning' | 'critical';
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// 더미 데이터
const capacityData: CapacityData[] = [
	{
		id: 1,
		lineName: '라인 1',
		plantName: '공장 A',
		productName: '제품 A',
		productCode: 'PROD-001',
		plannedCapacity: 1000,
		actualCapacity: 950,
		utilization: 95,
		load: 950,
		capacity: 1000,
		loadVsCapacity: 95,
		bottleneck: false,
		bottleneckType: 'none',
		status: 'optimal',
		createdBy: '사용자1',
		createdAt: '2024-01-01',
		updatedBy: '사용자1',
		updatedAt: '2024-01-31',
	},
	{
		id: 2,
		lineName: '라인 2',
		plantName: '공장 B',
		productName: '제품 B',
		productCode: 'PROD-002',
		plannedCapacity: 800,
		actualCapacity: 720,
		utilization: 90,
		load: 800,
		capacity: 800,
		loadVsCapacity: 100,
		bottleneck: true,
		bottleneckType: 'capacity',
		status: 'critical',
		createdBy: '사용자2',
		createdAt: '2024-01-01',
		updatedBy: '사용자2',
		updatedAt: '2024-01-31',
	},
	{
		id: 3,
		lineName: '라인 3',
		plantName: '공장 C',
		productName: '제품 C',
		productCode: 'PROD-003',
		plannedCapacity: 1200,
		actualCapacity: 1080,
		utilization: 90,
		load: 1100,
		capacity: 1200,
		loadVsCapacity: 91.7,
		bottleneck: false,
		bottleneckType: 'none',
		status: 'warning',
		createdBy: '사용자3',
		createdAt: '2024-01-01',
		updatedBy: '사용자3',
		updatedAt: '2024-01-31',
	},
	{
		id: 4,
		lineName: '라인 4',
		plantName: '공장 D',
		productName: '제품 D',
		productCode: 'PROD-004',
		plannedCapacity: 600,
		actualCapacity: 540,
		utilization: 90,
		load: 650,
		capacity: 600,
		loadVsCapacity: 108.3,
		bottleneck: true,
		bottleneckType: 'capacity',
		status: 'critical',
		createdBy: '사용자4',
		createdAt: '2024-01-01',
		updatedBy: '사용자4',
		updatedAt: '2024-01-31',
	},
];

const CapacityAnalysisPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<CapacityData[]>([]);

	useEffect(() => {
		setData(capacityData);
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'optimal':
				return 'text-green-600 bg-green-100';
			case 'warning':
				return 'text-yellow-600 bg-yellow-100';
			case 'critical':
				return 'text-red-600 bg-red-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'optimal':
				return '최적';
			case 'warning':
				return '경고';
			case 'critical':
				return '위험';
			default:
				return '알 수 없음';
		}
	};

	const getBottleneckTypeColor = (type: string) => {
		switch (type) {
			case 'capacity':
				return 'text-red-600 bg-red-100';
			case 'material':
				return 'text-orange-600 bg-orange-100';
			case 'labor':
				return 'text-blue-600 bg-blue-100';
			case 'none':
				return 'text-green-600 bg-green-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getBottleneckTypeText = (type: string) => {
		switch (type) {
			case 'capacity':
				return '능력 부족';
			case 'material':
				return '자재 부족';
			case 'labor':
				return '인력 부족';
			case 'none':
				return '해당 없음';
			default:
				return '알 수 없음';
		}
	};

	const getUtilizationColor = (utilization: number) => {
		if (utilization >= 90) return 'text-green-600';
		if (utilization >= 70) return 'text-yellow-600';
		return 'text-red-600';
	};

	// 차트 데이터
	const chartData = useMemo(() => {
		if (!data || data.length === 0) {
			return {
				lineNames: [],
				plannedCapacity: [],
				actualCapacity: [],
				utilization: [],
				loadVsCapacity: [],
			};
		}

		const lineNames = data.map((item) => item.lineName);
		const plannedCapacity = data.map((item) => item.plannedCapacity);
		const actualCapacity = data.map((item) => item.actualCapacity);
		const utilization = data.map((item) => item.utilization);
		const loadVsCapacity = data.map((item) => item.loadVsCapacity);

		return {
			lineNames,
			plannedCapacity,
			actualCapacity,
			utilization,
			loadVsCapacity,
		};
	}, [data]);

	// 능력 vs 부하 차트 옵션
	const capacityVsLoadChartOption = {
		title: {
			text:
				chartData.lineNames.length > 0
					? '능력 vs 부하 분석'
					: '데이터가 없습니다',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: {
			data: ['계획 능력', '실제 능력', '부하 vs 능력 비율'],
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
			data:
				chartData.lineNames.length > 0
					? chartData.lineNames
					: ['데이터 없음'],
		},
		yAxis: [
			{
				type: 'value',
				name: '수량',
				position: 'left',
			},
			{
				type: 'value',
				name: '비율 (%)',
				position: 'right',
				max: 120,
			},
		],
		series: [
			{
				name: '계획 능력',
				type: 'bar',
				data:
					chartData.plannedCapacity.length > 0
						? chartData.plannedCapacity
						: [0],
				itemStyle: {
					color: '#3B82F6',
				},
			},
			{
				name: '실제 능력',
				type: 'bar',
				data:
					chartData.actualCapacity.length > 0
						? chartData.actualCapacity
						: [0],
				itemStyle: {
					color: '#10B981',
				},
			},
			{
				name: '부하 vs 능력 비율',
				type: 'line',
				yAxisIndex: 1,
				data:
					chartData.loadVsCapacity.length > 0
						? chartData.loadVsCapacity
						: [0],
				itemStyle: {
					color: '#F59E0B',
				},
				lineStyle: {
					width: 3,
				},
			},
		],
	};

	// 가동률 차트 옵션
	const utilizationChartOption = {
		title: {
			text:
				chartData.utilization.length > 0
					? '라인별 가동률'
					: '데이터가 없습니다',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data:
				chartData.lineNames.length > 0
					? chartData.lineNames
					: ['데이터 없음'],
		},
		yAxis: {
			type: 'value',
			name: '가동률 (%)',
			max: 100,
		},
		series: [
			{
				name: '가동률',
				type: 'line',
				data:
					chartData.utilization.length > 0
						? chartData.utilization
						: [0],
				itemStyle: {
					color: '#10B981',
				},
				smooth: true,
				lineStyle: {
					width: 3,
				},
				symbol: 'circle',
				symbolSize: 8,
			},
		],
	};

	// 부하 vs 능력 차트 옵션
	const loadVsCapacityChartOption = {
		title: {
			text:
				chartData.loadVsCapacity.length > 0
					? '라인별 부하 vs 능력'
					: '데이터가 없습니다',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data:
				chartData.lineNames.length > 0
					? chartData.lineNames
					: ['데이터 없음'],
		},
		yAxis: {
			type: 'value',
			name: '부하 vs 능력 (%)',
			max: 120,
		},
		series: [
			{
				name: '부하 vs 능력',
				type: 'line',
				data:
					chartData.loadVsCapacity.length > 0
						? chartData.loadVsCapacity
						: [0],
				itemStyle: {
					color: '#F59E0B',
				},
				smooth: true,
				lineStyle: {
					width: 3,
				},
				symbol: 'circle',
				symbolSize: 8,
			},
		],
	};

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<CapacityData>[]>(
		() => [
			{
				accessorKey: 'lineName',
				header: '라인명',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div>
						<div className="text-sm font-medium text-gray-900">
							{row.original.lineName}
						</div>
					</div>
				),
			},
			{
				accessorKey: 'productName',
				header: '제품명',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div>
						<div className="text-sm font-medium text-gray-900">
							{row.original.productName}
						</div>
					</div>
				),
			},
			{
				accessorKey: 'plannedCapacity',
				header: '계획 능력',
				size: 100,
				align: 'right' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-sm text-gray-900">
						{row.original.plannedCapacity.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'actualCapacity',
				header: '실제 능력',
				size: 100,
				align: 'right' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-sm text-gray-900">
						{row.original.actualCapacity.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'utilization',
				header: '가동률',
				size: 80,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`text-sm font-medium ${getUtilizationColor(row.original.utilization)}`}
					>
						{row.original.utilization}%
					</span>
				),
			},
			{
				accessorKey: 'loadVsCapacity',
				header: '부하 vs 능력',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-sm text-gray-900">
						{row.original.loadVsCapacity.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'bottleneckType',
				header: '병목 유형',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getBottleneckTypeColor(row.original.bottleneckType)}`}
					>
						{getBottleneckTypeText(row.original.bottleneckType)}
					</span>
				),
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 80,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}
					>
						{getStatusText(row.original.status)}
					</span>
				),
			},
		],
		[]
	);

	const processedColumns = useDataTableColumns(columns);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		processedColumns,
		30, // defaultPageSize
		0, // pageCount
		0, // page
		data.length, // totalElements
		undefined // onPageChange
	);

	return (
		<div className="space-y-4">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Factory className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">총 라인 수</p>
							<p className="text-2xl font-bold text-gray-900">
								{data.length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Target className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">평균 가동률</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									data.reduce(
										(sum, item) => sum + item.utilization,
										0
									) / data.length
								)}
								%
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<AlertCircle className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">병목 라인</p>
							<p className="text-2xl font-bold text-gray-900">
								{data.filter((item) => item.bottleneck).length}
								개
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<TrendingUp className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">
								총 계획 능력
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data
									.reduce(
										(sum, item) =>
											sum + item.plannedCapacity,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 차트 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="p-6 rounded-lg border">
					{capacityVsLoadChartOption && (
						<EchartComponent
							options={capacityVsLoadChartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
				<div className="p-6 rounded-lg border">
					{utilizationChartOption && (
						<EchartComponent
							options={utilizationChartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
			</div>

			{/* 병목 식별 리스트 */}
			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="능력 분석 데이터"
					rowCount={data.length}
					useSearch={false}
					usePageNation={false}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					useEditable={false}
				/>
			</div>
		</div>
	);
};

export default CapacityAnalysisPage;
