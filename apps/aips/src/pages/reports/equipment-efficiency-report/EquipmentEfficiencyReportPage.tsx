import { useState, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { Target, Gauge, Clock, Zap } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface EquipmentEfficiencyReport {
	id: number;
	equipmentName: string;
	equipmentCode: string;
	lineName: string;
	plantName: string;
	period: string;
	availability: number;
	performance: number;
	quality: number;
	oee: number;
	plannedProductionTime: number;
	actualProductionTime: number;
	idealCycleTime: number;
	actualCycleTime: number;
	totalPieces: number;
	goodPieces: number;
	rejectedPieces: number;
	status: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// Dummy data
const equipmentEfficiencyReportData: EquipmentEfficiencyReport[] = [
	{
		id: 1,
		equipmentName: '프레스 기계 A',
		equipmentCode: 'EQ-001',
		lineName: '라인 1',
		plantName: '공장 A',
		period: '2024-05',
		availability: 95.2,
		performance: 88.5,
		quality: 99.1,
		oee: 83.7,
		plannedProductionTime: 480,
		actualProductionTime: 456,
		idealCycleTime: 2.5,
		actualCycleTime: 2.8,
		totalPieces: 1800,
		goodPieces: 1784,
		rejectedPieces: 16,
		status: 'good',
		createdBy: '사용자1',
		createdAt: '2024-05-31',
		updatedBy: '사용자1',
		updatedAt: '2024-05-31',
	},
	{
		id: 2,
		equipmentName: '용접 로봇 B',
		equipmentCode: 'EQ-002',
		lineName: '라인 2',
		plantName: '공장 B',
		period: '2024-05',
		availability: 98.1,
		performance: 92.3,
		quality: 98.8,
		oee: 89.4,
		plannedProductionTime: 480,
		actualProductionTime: 471,
		idealCycleTime: 1.8,
		actualCycleTime: 1.95,
		totalPieces: 2400,
		goodPieces: 2371,
		rejectedPieces: 29,
		status: 'excellent',
		createdBy: '사용자2',
		createdAt: '2024-05-31',
		updatedBy: '사용자2',
		updatedAt: '2024-05-31',
	},
	{
		id: 3,
		equipmentName: '조립 라인 C',
		equipmentCode: 'EQ-003',
		lineName: '라인 3',
		plantName: '공장 C',
		period: '2024-05',
		availability: 87.3,
		performance: 78.9,
		quality: 96.5,
		oee: 66.8,
		plannedProductionTime: 480,
		actualProductionTime: 419,
		idealCycleTime: 3.2,
		actualCycleTime: 4.1,
		totalPieces: 1200,
		goodPieces: 1158,
		rejectedPieces: 42,
		status: 'poor',
		createdBy: '사용자3',
		createdAt: '2024-05-31',
		updatedBy: '사용자3',
		updatedAt: '2024-05-31',
	},
	{
		id: 4,
		equipmentName: '도장 시스템 D',
		equipmentCode: 'EQ-004',
		lineName: '라인 1',
		plantName: '공장 A',
		period: '2024-05',
		availability: 91.7,
		performance: 85.2,
		quality: 97.3,
		oee: 76.1,
		plannedProductionTime: 480,
		actualProductionTime: 440,
		idealCycleTime: 4.0,
		actualCycleTime: 4.7,
		totalPieces: 900,
		goodPieces: 876,
		rejectedPieces: 24,
		status: 'average',
		createdBy: '사용자1',
		createdAt: '2024-05-31',
		updatedBy: '사용자1',
		updatedAt: '2024-05-31',
	},
];

const EquipmentEfficiencyReportPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data] = useState<EquipmentEfficiencyReport[]>(
		equipmentEfficiencyReportData
	);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'excellent':
				return 'bg-green-100 text-green-800';
			case 'good':
				return 'bg-blue-100 text-blue-800';
			case 'average':
				return 'bg-yellow-100 text-yellow-800';
			case 'poor':
				return 'bg-orange-100 text-orange-800';
			case 'critical':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'excellent':
				return '우수';
			case 'good':
				return '양호';
			case 'average':
				return '보통';
			case 'poor':
				return '불량';
			case 'critical':
				return '위험';
			default:
				return '알 수 없음';
		}
	};

	const getOeeColor = (oee: number) => {
		if (oee >= 90) return 'text-green-600';
		if (oee >= 80) return 'text-blue-600';
		if (oee >= 70) return 'text-yellow-600';
		if (oee >= 60) return 'text-orange-600';
		return 'text-red-600';
	};

	const columns = useMemo<ColumnConfig<EquipmentEfficiencyReport>[]>(
		() => [
			{
				accessorKey: 'equipmentName',
				header: '설비명',
				size: 150,
				align: 'left' as const,
			},
			{
				accessorKey: 'equipmentCode',
				header: '설비코드',
				size: 140,
				align: 'left' as const,
			},
			{
				accessorKey: 'lineName',
				header: '라인명',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'period',
				header: '기간',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'availability',
				header: '가용성(%)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium text-blue-600">
						{row.original.availability.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'performance',
				header: '성능(%)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium text-yellow-600">
						{row.original.performance.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'quality',
				header: '품질(%)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium text-green-600">
						{row.original.quality.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'oee',
				header: 'OEE(%)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`text-right font-bold text-lg ${getOeeColor(row.original.oee)}`}
					>
						{row.original.oee.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'totalPieces',
				header: '총 생산량',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.totalPieces.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'goodPieces',
				header: '양품',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium text-green-600">
						{row.original.goodPieces.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'rejectedPieces',
				header: '불량',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium text-red-600">
						{row.original.rejectedPieces.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 120,
				align: 'left' as const,
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
		30,
		0,
		0,
		data.length,
		undefined // onPageChange
	);

	// Chart data preparation
	const chartData = useMemo(() => {
		const equipmentNames = data.map((item) => item.equipmentName);
		const availabilityData = data.map((item) => item.availability);
		const performanceData = data.map((item) => item.performance);
		const qualityData = data.map((item) => item.quality);
		const oeeData = data.map((item) => item.oee);

		return {
			equipmentNames,
			availabilityData,
			performanceData,
			qualityData,
			oeeData,
		};
	}, [data]);

	// OEE Components Chart
	const oeeComponentsChartOption = {
		title: {
			text: 'OEE 구성 요소 분석',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: {
			data: ['가용성', '성능', '품질', 'OEE'],
			top: '30px',
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: chartData.equipmentNames,
			axisLabel: {
				rotate: 45,
			},
		},
		yAxis: {
			type: 'value',
			name: '비율(%)',
			min: 0,
			max: 100,
		},
		series: [
			{
				name: '가용성',
				type: 'bar',
				data: chartData.availabilityData,
				itemStyle: {
					color: '#3b82f6',
				},
			},
			{
				name: '성능',
				type: 'bar',
				data: chartData.performanceData,
				itemStyle: {
					color: '#f59e0b',
				},
			},
			{
				name: '품질',
				type: 'bar',
				data: chartData.qualityData,
				itemStyle: {
					color: '#10b981',
				},
			},
			{
				name: 'OEE',
				type: 'line',
				data: chartData.oeeData,
				itemStyle: {
					color: '#8b5cf6',
				},
				lineStyle: {
					width: 3,
				},
				symbol: 'circle',
				symbolSize: 8,
			},
		],
	};

	// OEE Distribution Chart
	const oeeDistributionChartOption = {
		title: {
			text: 'OEE 분포 현황',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			top: 'middle',
		},
		series: [
			{
				name: 'OEE 수준',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center',
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '18',
						fontWeight: 'bold',
					},
				},
				labelLine: {
					show: false,
				},
				data: [
					{
						value: data.filter((item) => item.oee >= 90).length,
						name: '우수 (90%+)',
						itemStyle: { color: '#10b981' },
					},
					{
						value: data.filter(
							(item) => item.oee >= 80 && item.oee < 90
						).length,
						name: '양호 (80-89%)',
						itemStyle: { color: '#3b82f6' },
					},
					{
						value: data.filter(
							(item) => item.oee >= 70 && item.oee < 80
						).length,
						name: '보통 (70-79%)',
						itemStyle: { color: '#f59e0b' },
					},
					{
						value: data.filter((item) => item.oee < 70).length,
						name: '개선 필요 (<70%)',
						itemStyle: { color: '#ef4444' },
					},
				],
			},
		],
	};

	return (
		<div className="space-y-4">
			{/* OEE Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100">
					<div className="flex items-center gap-3">
						<Clock className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">평균 가용성</p>
							<p className="text-2xl font-bold text-blue-900">
								{Math.round(
									data.reduce(
										(sum, item) => sum + item.availability,
										0
									) / data.length
								)}
								%
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-gradient-to-br from-yellow-50 to-yellow-100">
					<div className="flex items-center gap-3">
						<Zap className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">평균 성능</p>
							<p className="text-2xl font-bold text-yellow-900">
								{Math.round(
									data.reduce(
										(sum, item) => sum + item.performance,
										0
									) / data.length
								)}
								%
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-gradient-to-br from-green-50 to-green-100">
					<div className="flex items-center gap-3">
						<Target className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">평균 품질</p>
							<p className="text-2xl font-bold text-green-900">
								{Math.round(
									data.reduce(
										(sum, item) => sum + item.quality,
										0
									) / data.length
								)}
								%
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100">
					<div className="flex items-center gap-3">
						<Gauge className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">평균 OEE</p>
							<p className="text-2xl font-bold text-purple-900">
								{Math.round(
									data.reduce(
										(sum, item) => sum + item.oee,
										0
									) / data.length
								)}
								%
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="p-6 rounded-lg border">
					{oeeComponentsChartOption && (
						<EchartComponent
							options={oeeComponentsChartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
				<div className="p-6 rounded-lg border">
					{oeeDistributionChartOption && (
						<EchartComponent
							options={oeeDistributionChartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
			</div>

			{/* Data table */}
			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="설비 효율성 보고서 데이터"
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

export default EquipmentEfficiencyReportPage;
