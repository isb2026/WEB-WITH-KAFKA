import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	AlertCircle,
	Activity,
	Zap,
	Clock,
	Settings,
	AlertTriangle,
	CheckCircle,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { toast } from 'sonner';
import { RadixIconButton } from '@radix-ui/components';

interface BottleneckAnalysis {
	id: number;
	machineName: string;
	machineCode: string;
	lineName: string;
	utilization: number;
	capacity: number;
	demand: number;
	bottleneckScore: number;
	status: 'critical' | 'warning' | 'normal' | 'optimal';
	avgProcessingTime: number;
	queueLength: number;
	maintenanceDue: string;
	lastMaintenance: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// 더미 데이터
const bottleneckAnalysisData: BottleneckAnalysis[] = [
	{
		id: 1,
		machineName: '프레스 머신 A',
		machineCode: 'PRESS-001',
		lineName: '라인 1',
		utilization: 95,
		capacity: 100,
		demand: 120,
		bottleneckScore: 8.5,
		status: 'critical',
		avgProcessingTime: 45,
		queueLength: 15,
		maintenanceDue: '2024-02-15',
		lastMaintenance: '2024-01-01',
		createdBy: '설비관리팀',
		createdAt: '2024-01-01',
		updatedBy: '설비관리팀',
		updatedAt: '2024-01-01',
	},
	{
		id: 2,
		machineName: '용접 머신 B',
		machineCode: 'WELD-002',
		lineName: '라인 2',
		utilization: 78,
		capacity: 100,
		demand: 85,
		bottleneckScore: 6.2,
		status: 'warning',
		avgProcessingTime: 32,
		queueLength: 8,
		maintenanceDue: '2024-03-01',
		lastMaintenance: '2024-01-15',
		createdBy: '설비관리팀',
		createdAt: '2024-01-02',
		updatedBy: '설비관리팀',
		updatedAt: '2024-01-02',
	},
	{
		id: 3,
		machineName: '조립 머신 C',
		machineCode: 'ASSY-003',
		lineName: '라인 1',
		utilization: 65,
		capacity: 100,
		demand: 70,
		bottleneckScore: 4.1,
		status: 'normal',
		avgProcessingTime: 28,
		queueLength: 3,
		maintenanceDue: '2024-04-01',
		lastMaintenance: '2024-01-30',
		createdBy: '설비관리팀',
		createdAt: '2024-01-03',
		updatedBy: '설비관리팀',
		updatedAt: '2024-01-03',
	},
	{
		id: 4,
		machineName: '검사 머신 D',
		machineCode: 'INSP-004',
		lineName: '라인 3',
		utilization: 45,
		capacity: 100,
		demand: 50,
		bottleneckScore: 2.8,
		status: 'optimal',
		avgProcessingTime: 15,
		queueLength: 1,
		maintenanceDue: '2024-05-01',
		lastMaintenance: '2024-02-01',
		createdBy: '설비관리팀',
		createdAt: '2024-01-04',
		updatedBy: '설비관리팀',
		updatedAt: '2024-01-04',
	},
];

const BottleneckAnalysisPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<BottleneckAnalysis[]>([]);

	useEffect(() => {
		setData(bottleneckAnalysisData);
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'critical':
				return 'text-red-600 bg-red-100';
			case 'warning':
				return 'text-yellow-600 bg-yellow-100';
			case 'normal':
				return 'text-blue-600 bg-blue-100';
			case 'optimal':
				return 'text-green-600 bg-green-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'critical':
				return '위험';
			case 'warning':
				return '경고';
			case 'normal':
				return '정상';
			case 'optimal':
				return '최적';
			default:
				return '알 수 없음';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'critical':
				return <AlertTriangle size={16} className="text-red-600" />;
			case 'warning':
				return <AlertCircle size={16} className="text-yellow-600" />;
			case 'normal':
				return <Activity size={16} className="text-blue-600" />;
			case 'optimal':
				return <CheckCircle size={16} className="text-green-600" />;
			default:
				return <Activity size={16} className="text-gray-600" />;
		}
	};

	// 차트 데이터
	const chartData = useMemo(() => {
		if (!data || data.length === 0) {
			return {
				utilizationData: [],
				bottleneckData: [],
				machines: [],
			};
		}

		const utilizationData = data.map((item) => item.utilization);
		const bottleneckData = data.map((item) => item.bottleneckScore);
		const machines = data.map(
			(item) => item.machineName.substring(0, 12) + '...'
		);

		return {
			utilizationData,
			bottleneckData,
			machines,
		};
	}, [data]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<BottleneckAnalysis>[]>(
		() => [
			{
				accessorKey: 'machineName',
				header: '설비명',
				size: 200,
				align: 'left' as const,
			},
			{
				accessorKey: 'machineCode',
				header: '설비코드',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'lineName',
				header: '라인',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'utilization',
				header: '가동률(%)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.utilization}%
					</div>
				),
			},
			{
				accessorKey: 'bottleneckScore',
				header: '병목 점수',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.bottleneckScore.toFixed(1)}
					</div>
				),
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="flex items-center gap-2">
						{getStatusIcon(row.original.status)}
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}
						>
							{getStatusText(row.original.status)}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'avgProcessingTime',
				header: '평균 처리시간(분)',
				size: 150,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.avgProcessingTime}분
					</div>
				),
			},
			{
				accessorKey: 'queueLength',
				header: '대기열 길이',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.queueLength}
					</div>
				),
			},
			{
				accessorKey: 'maintenanceDue',
				header: '점검 예정일',
				size: 120,
				align: 'left' as const,
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

	// Chart options
	const utilizationChartOption = {
		title: {
			text: '설비별 가동률',
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
				chartData.machines.length > 0
					? chartData.machines
					: ['데이터 없음'],
			axisLabel: {
				rotate: 45,
			},
		},
		yAxis: {
			type: 'value',
			name: '가동률 (%)',
			max: 100,
		},
		series: [
			{
				name: '가동률',
				type: 'bar',
				data:
					chartData.utilizationData.length > 0
						? chartData.utilizationData
						: [0],
				itemStyle: {
					color: (params: any) => {
						const value =
							chartData.utilizationData[params.dataIndex];
						if (value >= 90) return '#EF4444'; // Red for critical
						if (value >= 75) return '#F59E0B'; // Yellow for warning
						if (value >= 60) return '#3B82F6'; // Blue for normal
						return '#10B981'; // Green for optimal
					},
				},
			},
		],
	};

	const bottleneckChartOption = {
		title: {
			text: '설비별 병목 점수',
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
				chartData.machines.length > 0
					? chartData.machines
					: ['데이터 없음'],
			axisLabel: {
				rotate: 45,
			},
		},
		yAxis: {
			type: 'value',
			name: '병목 점수',
			max: 10,
		},
		series: [
			{
				name: '병목 점수',
				type: 'line',
				data:
					chartData.bottleneckData.length > 0
						? chartData.bottleneckData
						: [0],
				itemStyle: {
					color: '#8B5CF6',
				},
				smooth: true,
				markLine: {
					data: [
						{ yAxis: 7, name: '위험 임계값' },
						{ yAxis: 5, name: '경고 임계값' },
					],
					lineStyle: {
						color: '#EF4444',
						type: 'dashed',
					},
				},
			},
		],
	};

	const handleIdentifyBottlenecks = () => {
		toast.success('병목 분석을 시작합니다.');
		// 실제 병목 분석 로직
	};

	const handleOptimizeSchedule = () => {
		toast.info('일정 최적화를 시작합니다.');
		// 일정 최적화 로직
	};

	const handleMaintenanceAlert = () => {
		const criticalMachines = data.filter(
			(item) => item.status === 'critical'
		);
		if (criticalMachines.length > 0) {
			toast.warning(
				`${criticalMachines.length}개의 위험 설비가 발견되었습니다.`
			);
		} else {
			toast.success('모든 설비가 정상 상태입니다.');
		}
	};

	return (
		<div className="space-y-4">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<AlertCircle className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">위험 설비</p>
							<p className="text-2xl font-bold text-red-600">
								{
									data.filter(
										(item) => item.status === 'critical'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<AlertTriangle className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">경고 설비</p>
							<p className="text-2xl font-bold text-yellow-600">
								{
									data.filter(
										(item) => item.status === 'warning'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Activity className="h-8 w-8 text-blue-600" />
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
						<Zap className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">
								평균 병목 점수
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{(
									data.reduce(
										(sum, item) =>
											sum + item.bottleneckScore,
										0
									) / data.length
								).toFixed(1)}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 액션 버튼 */}
			<div className="flex gap-2 justify-end">
				<RadixIconButton
					onClick={handleOptimizeSchedule}
					className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white"
				>
					<Settings size={16} />
					일정 최적화
				</RadixIconButton>

				<RadixIconButton
					onClick={handleIdentifyBottlenecks}
					className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				>
					<AlertCircle size={16} />
					병목 식별
				</RadixIconButton>

				<RadixIconButton
					onClick={handleMaintenanceAlert}
					className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				>
					<Clock size={16} />
					점검 알림
				</RadixIconButton>
			</div>

			{/* 차트 섹션 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="p-6 rounded-lg border">
					{utilizationChartOption && (
						<EchartComponent
							options={utilizationChartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
				<div className="p-6 rounded-lg border">
					{bottleneckChartOption && (
						<EchartComponent
							options={bottleneckChartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
			</div>

			{/* 데이터 테이블 */}
			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="설비 가동률 및 병목 분석"
					rowCount={data.length}
					useSearch={true}
					usePageNation={true}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					useEditable={false}
					actionButtons={
						<div className="flex gap-2">
							<RadixIconButton
								onClick={() => {
									const selectedId =
										Array.from(selectedRows)[0];
									if (selectedId) {
										toast.info(
											`설비 ${selectedId} 상세 분석을 시작합니다.`
										);
									}
								}}
								disabled={selectedRows.size !== 1}
								className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white"
							>
								상세 분석
							</RadixIconButton>

							<RadixIconButton
								onClick={() => {
									const selectedId =
										Array.from(selectedRows)[0];
									if (selectedId) {
										toast.info(
											`설비 ${selectedId} 최적화 방안을 제안합니다.`
										);
									}
								}}
								disabled={selectedRows.size !== 1}
								className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
							>
								최적화 제안
							</RadixIconButton>
						</div>
					}
				/>
			</div>
		</div>
	);
};

export default BottleneckAnalysisPage;
