import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { XCircle, Clock, Zap, Wrench } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface EquipmentStatus {
	id: number;
	equipmentId: string;
	equipmentName: string;
	equipmentType: string;
	lineName: string;
	status: 'running' | 'idle' | 'down' | 'maintenance' | 'setup';
	uptime: number;
	downtime: number;
	availability: number;
	temperature: number;
	pressure: number;
	lastMaintenance: string;
	nextMaintenance: string;
	operatorName: string;
	createdAt: string;
	updatedAt: string;
}

// 더미 데이터
const equipmentStatusData: EquipmentStatus[] = [
	{
		id: 1,
		equipmentId: 'EQ-001',
		equipmentName: '설비 A-01',
		equipmentType: '프레스',
		lineName: '라인 1',
		status: 'running',
		uptime: 95.5,
		downtime: 4.5,
		availability: 95.5,
		temperature: 65,
		pressure: 120,
		lastMaintenance: '2024-01-10',
		nextMaintenance: '2024-02-10',
		operatorName: '김철수',
		createdAt: '2024-01-15 08:00:00',
		updatedAt: '2024-01-15 16:30:00',
	},
	{
		id: 2,
		equipmentId: 'EQ-002',
		equipmentName: '설비 B-01',
		equipmentType: '컨베이어',
		lineName: '라인 2',
		status: 'idle',
		uptime: 88.2,
		downtime: 11.8,
		availability: 88.2,
		temperature: 45,
		pressure: 80,
		lastMaintenance: '2024-01-08',
		nextMaintenance: '2024-02-08',
		operatorName: '이영희',
		createdAt: '2024-01-15 09:00:00',
		updatedAt: '2024-01-15 16:00:00',
	},
	{
		id: 3,
		equipmentId: 'EQ-003',
		equipmentName: '설비 C-01',
		equipmentType: '로봇',
		lineName: '라인 1',
		status: 'down',
		uptime: 75.8,
		downtime: 24.2,
		availability: 75.8,
		temperature: 0,
		pressure: 0,
		lastMaintenance: '2024-01-05',
		nextMaintenance: '2024-02-05',
		operatorName: '박민수',
		createdAt: '2024-01-15 06:00:00',
		updatedAt: '2024-01-15 14:00:00',
	},
	{
		id: 4,
		equipmentId: 'EQ-004',
		equipmentName: '설비 D-01',
		equipmentType: '용접기',
		lineName: '라인 3',
		status: 'maintenance',
		uptime: 92.1,
		downtime: 7.9,
		availability: 92.1,
		temperature: 0,
		pressure: 0,
		lastMaintenance: '2024-01-15',
		nextMaintenance: '2024-02-15',
		operatorName: '최지영',
		createdAt: '2024-01-15 07:00:00',
		updatedAt: '2024-01-15 16:00:00',
	},
	{
		id: 5,
		equipmentId: 'EQ-005',
		equipmentName: '설비 E-01',
		equipmentType: '커터',
		lineName: '라인 2',
		status: 'setup',
		uptime: 96.3,
		downtime: 3.7,
		availability: 96.3,
		temperature: 55,
		pressure: 100,
		lastMaintenance: '2024-01-12',
		nextMaintenance: '2024-02-12',
		operatorName: '정수진',
		createdAt: '2024-01-15 10:00:00',
		updatedAt: '2024-01-15 16:00:00',
	},
];

const EquipmentStatusIntegrationPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<EquipmentStatus[]>([]);

	useEffect(() => {
		setData(equipmentStatusData);
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'running':
				return 'text-green-600 bg-green-100';
			case 'idle':
				return 'text-yellow-600 bg-yellow-100';
			case 'down':
				return 'text-red-600 bg-red-100';
			case 'maintenance':
				return 'text-blue-600 bg-blue-100';
			case 'setup':
				return 'text-purple-600 bg-purple-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'running':
				return '가동중';
			case 'idle':
				return '대기중';
			case 'down':
				return '정지';
			case 'maintenance':
				return '정비중';
			case 'setup':
				return '설정중';
			default:
				return '알 수 없음';
		}
	};

	// 차트 데이터
	const chartData = useMemo(() => {
		if (!data || data.length === 0) {
			return {
				statusData: [],
				availabilityData: [],
				temperatureData: [],
				pressureData: [],
				labels: [],
			};
		}

		const statusCounts = data.reduce(
			(acc, item) => {
				acc[item.status] = (acc[item.status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		return {
			statusData: Object.values(statusCounts),
			availabilityData: data.map((item) => item.availability),
			temperatureData: data
				.filter((item) => item.temperature > 0)
				.map((item) => item.temperature),
			pressureData: data
				.filter((item) => item.pressure > 0)
				.map((item) => item.pressure),
			labels: Object.keys(statusCounts),
		};
	}, [data]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<EquipmentStatus>[]>(
		() => [
			{
				accessorKey: 'equipmentId',
				header: '설비 ID',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'equipmentName',
				header: '설비명',
				size: 140,
				align: 'left' as const,
			},
			{
				accessorKey: 'equipmentType',
				header: '설비 유형',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'lineName',
				header: '라인명',
				size: 100,
				align: 'left' as const,
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
			{
				accessorKey: 'availability',
				header: '가동률(%)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`font-medium ${row.original.availability >= 90 ? 'text-green-600' : row.original.availability >= 80 ? 'text-yellow-600' : 'text-red-600'}`}
					>
						{row.original.availability.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'temperature',
				header: '온도(°C)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium">
						{row.original.temperature > 0
							? `${row.original.temperature}°C`
							: '-'}
					</div>
				),
			},
			{
				accessorKey: 'pressure',
				header: '압력(bar)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium">
						{row.original.pressure > 0
							? `${row.original.pressure}bar`
							: '-'}
					</div>
				),
			},
			{
				accessorKey: 'operatorName',
				header: '담당자',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'nextMaintenance',
				header: '다음 정비일',
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

	const statusChartOption = {
		title: {
			text: '설비 상태별 현황',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
		},
		series: [
			{
				name: '설비 상태',
				type: 'pie',
				radius: '50%',
				data: chartData.labels.map((label, index) => ({
					value: chartData.statusData[index],
					name: getStatusText(label),
				})),
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
			},
		],
	};

	const availabilityChartOption = {
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
			data: data.map((item) => item.equipmentName),
		},
		yAxis: {
			type: 'value',
			name: '가동률(%)',
			max: 100,
		},
		series: [
			{
				name: '가동률',
				type: 'bar',
				data: chartData.availabilityData,
				itemStyle: {
					color: '#3B82F6',
				},
			},
		],
	};

	return (
		<div className="space-y-6">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Zap className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">
								가동중인 설비
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'running'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Clock className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">
								대기중인 설비
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'idle'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<XCircle className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">정지된 설비</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'down'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Wrench className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">
								정비중인 설비
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'maintenance'
									).length
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 차트 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-lg border">
					<EchartComponent
						options={statusChartOption}
						styles={{ height: '300px' }}
					/>
				</div>
				<div className="bg-white p-6 rounded-lg border">
					<EchartComponent
						options={availabilityChartOption}
						styles={{ height: '300px' }}
					/>
				</div>
			</div>

			{/* 설비 상태 연동 테이블 */}
			<div className="bg-white rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="설비 상태 연동"
					rowCount={data.length}
					useSearch={true}
					usePageNation={true}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					useEditable={false}
				/>
			</div>
		</div>
	);
};

export default EquipmentStatusIntegrationPage;
