import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { Link, XCircle, Clock, RefreshCw } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface MesIntegrationLog {
	id: number;
	timestamp: string;
	level: 'info' | 'warning' | 'error' | 'success';
	module: string;
	message: string;
	status: 'connected' | 'disconnected' | 'syncing' | 'error';
	responseTime: number;
	dataSize: number;
	errorCode?: string;
	errorMessage?: string;
	assignedTo?: string;
	resolvedAt?: string;
	createdAt: string;
}

// 더미 데이터
const mesIntegrationData: MesIntegrationLog[] = [
	{
		id: 1,
		timestamp: '2024-01-15 16:30:00',
		level: 'success',
		module: 'WorkOrder',
		message: '작업지시 데이터 동기화 완료',
		status: 'syncing',
		responseTime: 150,
		dataSize: 1024,
		createdAt: '2024-01-15 16:30:00',
	},
	{
		id: 2,
		timestamp: '2024-01-15 16:25:00',
		level: 'info',
		module: 'Production',
		message: '생산 실적 데이터 수신 중',
		status: 'connected',
		responseTime: 45,
		dataSize: 512,
		createdAt: '2024-01-15 16:25:00',
	},
	{
		id: 3,
		timestamp: '2024-01-15 16:20:00',
		level: 'warning',
		module: 'Quality',
		message: '품질 데이터 동기화 지연',
		status: 'syncing',
		responseTime: 3000,
		dataSize: 256,
		assignedTo: '김철수',
		createdAt: '2024-01-15 16:20:00',
	},
	{
		id: 4,
		timestamp: '2024-01-15 16:15:00',
		level: 'error',
		module: 'Equipment',
		message: '설비 상태 데이터 연결 실패',
		status: 'error',
		responseTime: 0,
		dataSize: 0,
		errorCode: 'CONN_001',
		errorMessage: '연결 시간 초과',
		assignedTo: '이영희',
		createdAt: '2024-01-15 16:15:00',
	},
	{
		id: 5,
		timestamp: '2024-01-15 16:10:00',
		level: 'success',
		module: 'Inventory',
		message: '재고 데이터 동기화 완료',
		status: 'connected',
		responseTime: 120,
		dataSize: 2048,
		createdAt: '2024-01-15 16:10:00',
	},
	{
		id: 6,
		timestamp: '2024-01-15 16:05:00',
		level: 'info',
		module: 'WorkOrder',
		message: '작업지시 상태 업데이트',
		status: 'connected',
		responseTime: 80,
		dataSize: 128,
		createdAt: '2024-01-15 16:05:00',
	},
	{
		id: 7,
		timestamp: '2024-01-15 16:00:00',
		level: 'warning',
		module: 'Production',
		message: '생산 계획 데이터 불일치',
		status: 'syncing',
		responseTime: 2500,
		dataSize: 512,
		assignedTo: '박민수',
		createdAt: '2024-01-15 16:00:00',
	},
	{
		id: 8,
		timestamp: '2024-01-15 15:55:00',
		level: 'success',
		module: 'Quality',
		message: '품질 검사 결과 동기화 완료',
		status: 'connected',
		responseTime: 95,
		dataSize: 768,
		createdAt: '2024-01-15 15:55:00',
	},
];

const MesIntegrationMonitoringPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<MesIntegrationLog[]>([]);

	useEffect(() => {
		setData(mesIntegrationData);
	}, []);

	const getLevelColor = (level: string) => {
		switch (level) {
			case 'success':
				return 'text-green-600 bg-green-100';
			case 'warning':
				return 'text-yellow-600 bg-yellow-100';
			case 'error':
				return 'text-red-600 bg-red-100';
			case 'info':
				return 'text-blue-600 bg-blue-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getLevelText = (level: string) => {
		switch (level) {
			case 'success':
				return '성공';
			case 'warning':
				return '경고';
			case 'error':
				return '오류';
			case 'info':
				return '정보';
			default:
				return '알 수 없음';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'connected':
				return 'text-green-600 bg-green-100';
			case 'disconnected':
				return 'text-red-600 bg-red-100';
			case 'syncing':
				return 'text-yellow-600 bg-yellow-100';
			case 'error':
				return 'text-red-600 bg-red-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'connected':
				return '연결됨';
			case 'disconnected':
				return '연결 해제';
			case 'syncing':
				return '동기화 중';
			case 'error':
				return '오류';
			default:
				return '알 수 없음';
		}
	};

	// 차트 데이터
	const chartData = useMemo(() => {
		if (!data || data.length === 0) {
			return {
				levelData: [],
				statusData: [],
				moduleData: [],
				responseTimeData: [],
				labels: [],
			};
		}

		const levelCounts = data.reduce(
			(acc, item) => {
				acc[item.level] = (acc[item.level] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const statusCounts = data.reduce(
			(acc, item) => {
				acc[item.status] = (acc[item.status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const moduleCounts = data.reduce(
			(acc, item) => {
				acc[item.module] = (acc[item.module] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		return {
			levelData: Object.values(levelCounts),
			statusData: Object.values(statusCounts),
			moduleData: Object.values(moduleCounts),
			responseTimeData: data.map((item) => item.responseTime),
			labels: Object.keys(levelCounts),
		};
	}, [data]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<MesIntegrationLog>[]>(
		() => [
			{
				accessorKey: 'timestamp',
				header: '타임스탬프',
				size: 140,
				align: 'left' as const,
			},
			{
				accessorKey: 'level',
				header: '레벨',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(row.original.level)}`}
					>
						{getLevelText(row.original.level)}
					</span>
				),
			},
			{
				accessorKey: 'module',
				header: '모듈',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'message',
				header: '메시지',
				size: 250,
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
				accessorKey: 'responseTime',
				header: '응답시간(ms)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`text-right font-medium ${row.original.responseTime > 1000 ? 'text-red-600' : row.original.responseTime > 500 ? 'text-yellow-600' : 'text-green-600'}`}
					>
						{row.original.responseTime.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'dataSize',
				header: '데이터 크기(KB)',
				size: 140,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.dataSize.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'assignedTo',
				header: '담당자',
				size: 100,
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

	const levelChartOption = {
		title: {
			text: '로그 레벨별 현황',
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
				name: '로그 레벨',
				type: 'pie',
				radius: '50%',
				data: chartData.labels.map((label, index) => ({
					value: chartData.levelData[index],
					name: getLevelText(label),
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

	const statusChartOption = {
		title: {
			text: '연결 상태별 현황',
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
			data: ['연결됨', '연결 해제', '동기화 중', '오류'],
		},
		yAxis: {
			type: 'value',
			name: '건수',
		},
		series: [
			{
				name: '건수',
				type: 'bar',
				data: chartData.statusData,
				itemStyle: {
					color: '#3B82F6',
				},
			},
		],
	};

	return (
		<div className="space-y-4">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Link className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">연결된 모듈</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'connected'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<RefreshCw className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">동기화 중</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'syncing'
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
							<p className="text-sm text-gray-600">연결 오류</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'error'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Clock className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">
								평균 응답시간
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									data.reduce(
										(sum, item) => sum + item.responseTime,
										0
									) / data.length
								)}
								ms
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 차트 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-lg border">
					<EchartComponent
						options={levelChartOption}
						styles={{ height: '300px' }}
					/>
				</div>
				<div className="bg-white p-6 rounded-lg border">
					<EchartComponent
						options={statusChartOption}
						styles={{ height: '300px' }}
					/>
				</div>
			</div>

			{/* MES 연동 모니터링 로그 테이블 */}
			<div className="bg-white rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="MES 연동 모니터링 로그"
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

export default MesIntegrationMonitoringPage;
