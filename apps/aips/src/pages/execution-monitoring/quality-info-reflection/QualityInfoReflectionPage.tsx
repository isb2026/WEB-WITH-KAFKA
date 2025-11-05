import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { Award, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface QualityInfo {
	id: number;
	productName: string;
	productCode: string;
	lineName: string;
	inspectionDate: string;
	totalInspected: number;
	passedQuantity: number;
	failedQuantity: number;
	yieldRate: number;
	defectRate: number;
	mainDefectType: string;
	inspectorName: string;
	status: 'passed' | 'failed' | 'pending';
	priority: 'high' | 'medium' | 'low';
	createdAt: string;
	updatedAt: string;
}

// 더미 데이터
const qualityInfoData: QualityInfo[] = [
	{
		id: 1,
		productName: '제품 A',
		productCode: 'PROD-001',
		lineName: '라인 1',
		inspectionDate: '2024-01-15',
		totalInspected: 1000,
		passedQuantity: 950,
		failedQuantity: 50,
		yieldRate: 95.0,
		defectRate: 5.0,
		mainDefectType: '표면 결함',
		inspectorName: '김철수',
		status: 'passed',
		priority: 'low',
		createdAt: '2024-01-15 16:30:00',
		updatedAt: '2024-01-15 16:30:00',
	},
	{
		id: 2,
		productName: '제품 B',
		productCode: 'PROD-002',
		lineName: '라인 2',
		inspectionDate: '2024-01-15',
		totalInspected: 800,
		passedQuantity: 720,
		failedQuantity: 80,
		yieldRate: 90.0,
		defectRate: 10.0,
		mainDefectType: '치수 불량',
		inspectorName: '이영희',
		status: 'failed',
		priority: 'medium',
		createdAt: '2024-01-15 17:00:00',
		updatedAt: '2024-01-15 17:00:00',
	},
	{
		id: 3,
		productName: '제품 C',
		productCode: 'PROD-003',
		lineName: '라인 1',
		inspectionDate: '2024-01-15',
		totalInspected: 500,
		passedQuantity: 490,
		failedQuantity: 10,
		yieldRate: 98.0,
		defectRate: 2.0,
		mainDefectType: '색상 불량',
		inspectorName: '박민수',
		status: 'passed',
		priority: 'low',
		createdAt: '2024-01-15 15:45:00',
		updatedAt: '2024-01-15 15:45:00',
	},
	{
		id: 4,
		productName: '제품 D',
		productCode: 'PROD-004',
		lineName: '라인 3',
		inspectionDate: '2024-01-15',
		totalInspected: 1200,
		passedQuantity: 1008,
		failedQuantity: 192,
		yieldRate: 84.0,
		defectRate: 16.0,
		mainDefectType: '기능 불량',
		inspectorName: '최지영',
		status: 'failed',
		priority: 'high',
		createdAt: '2024-01-15 18:00:00',
		updatedAt: '2024-01-15 18:00:00',
	},
	{
		id: 5,
		productName: '제품 E',
		productCode: 'PROD-005',
		lineName: '라인 2',
		inspectionDate: '2024-01-15',
		totalInspected: 600,
		passedQuantity: 570,
		failedQuantity: 30,
		yieldRate: 95.0,
		defectRate: 5.0,
		mainDefectType: '포장 불량',
		inspectorName: '정수진',
		status: 'passed',
		priority: 'medium',
		createdAt: '2024-01-15 14:30:00',
		updatedAt: '2024-01-15 14:30:00',
	},
];

const QualityInfoReflectionPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<QualityInfo[]>([]);

	useEffect(() => {
		setData(qualityInfoData);
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'passed':
				return 'text-green-600 bg-green-100';
			case 'failed':
				return 'text-red-600 bg-red-100';
			case 'pending':
				return 'text-yellow-600 bg-yellow-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'passed':
				return '합격';
			case 'failed':
				return '불합격';
			case 'pending':
				return '대기중';
			default:
				return '알 수 없음';
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'text-red-600 bg-red-100';
			case 'medium':
				return 'text-yellow-600 bg-yellow-100';
			case 'low':
				return 'text-green-600 bg-green-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getPriorityText = (priority: string) => {
		switch (priority) {
			case 'high':
				return '높음';
			case 'medium':
				return '보통';
			case 'low':
				return '낮음';
			default:
				return '알 수 없음';
		}
	};

	// 차트 데이터
	const chartData = useMemo(() => {
		if (!data || data.length === 0) {
			return {
				yieldData: [],
				defectData: [],
				statusData: [],
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
			yieldData: data.map((item) => item.yieldRate),
			defectData: data.map((item) => item.defectRate),
			statusData: Object.values(statusCounts),
			labels: data.map((item) => item.productName),
		};
	}, [data]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<QualityInfo>[]>(
		() => [
			{
				accessorKey: 'productName',
				header: '제품명',
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
				accessorKey: 'inspectionDate',
				header: '검사일',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'totalInspected',
				header: '검사 수량',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium">
						{row.original.totalInspected.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'passedQuantity',
				header: '합격 수량',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium text-green-600">
						{row.original.passedQuantity.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'failedQuantity',
				header: '불합격 수량',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium text-red-600">
						{row.original.failedQuantity.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'yieldRate',
				header: '수율(%)',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`font-medium ${row.original.yieldRate >= 95 ? 'text-green-600' : row.original.yieldRate >= 90 ? 'text-yellow-600' : 'text-red-600'}`}
					>
						{row.original.yieldRate.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'defectRate',
				header: '불량률(%)',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`font-medium ${row.original.defectRate <= 5 ? 'text-green-600' : row.original.defectRate <= 10 ? 'text-yellow-600' : 'text-red-600'}`}
					>
						{row.original.defectRate.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'mainDefectType',
				header: '주요 불량 유형',
				size: 150,
				align: 'left' as const,
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 100,
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
				accessorKey: 'priority',
				header: '우선순위',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(row.original.priority)}`}
					>
						{getPriorityText(row.original.priority)}
					</span>
				),
			},
			{
				accessorKey: 'inspectorName',
				header: '검사자',
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

	const yieldChartOption = {
		title: {
			text: '제품별 수율 현황',
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
			data: chartData.labels,
		},
		yAxis: {
			type: 'value',
			name: '수율(%)',
			max: 100,
		},
		series: [
			{
				name: '수율',
				type: 'bar',
				data: chartData.yieldData,
				itemStyle: {
					color: '#10B981',
				},
			},
		],
	};

	const defectChartOption = {
		title: {
			text: '제품별 불량률 현황',
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
			data: chartData.labels,
		},
		yAxis: {
			type: 'value',
			name: '불량률(%)',
			max: 20,
		},
		series: [
			{
				name: '불량률',
				type: 'bar',
				data: chartData.defectData,
				itemStyle: {
					color: '#EF4444',
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
						<Award className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">평균 수율</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									data.reduce(
										(sum, item) => sum + item.yieldRate,
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
						<XCircle className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">평균 불량률</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									data.reduce(
										(sum, item) => sum + item.defectRate,
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
						<CheckCircle className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">합격 제품</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'passed'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<AlertTriangle className="h-8 w-8 text-orange-600" />
						<div>
							<p className="text-sm text-gray-600">불합격 제품</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'failed'
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
						options={yieldChartOption}
						styles={{ height: '300px' }}
					/>
				</div>
				<div className="bg-white p-6 rounded-lg border">
					<EchartComponent
						options={defectChartOption}
						styles={{ height: '300px' }}
					/>
				</div>
			</div>

			{/* 품질 정보 반영 테이블 */}
			<div className="bg-white rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="품질 정보 반영"
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

export default QualityInfoReflectionPage;
