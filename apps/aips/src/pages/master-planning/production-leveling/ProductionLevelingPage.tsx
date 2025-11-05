import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	BarChart3,
	TrendingUp,
	Target,
	Factory,
	Package,
	Activity,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import { RadixSelect, RadixSelectItem } from '@radix-ui/components';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns, ColumnConfig } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface ProductionLevelingData {
	id: number;
	productName: string;
	productCode: string;
	lineName: string;
	plantName: string;
	week1: number;
	week2: number;
	week3: number;
	week4: number;
	week5: number;
	week6: number;
	week7: number;
	week8: number;
	totalProduction: number;
	averageProduction: number;
	standardDeviation: number;
	levelingScore: number;
	status: 'optimal' | 'good' | 'needs-improvement' | 'poor';
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// 더미 데이터
const productionLevelingData: ProductionLevelingData[] = [
	{
		id: 1,
		productName: '제품 A',
		productCode: 'PROD-001',
		lineName: '라인 1',
		plantName: '공장 A',
		week1: 250,
		week2: 260,
		week3: 270,
		week4: 280,
		week5: 290,
		week6: 300,
		week7: 310,
		week8: 320,
		totalProduction: 2180,
		averageProduction: 272.5,
		standardDeviation: 25.5,
		levelingScore: 85,
		status: 'good',
		createdBy: '사용자1',
		createdAt: '2024-01-01',
		updatedBy: '사용자1',
		updatedAt: '2024-01-31',
	},
	{
		id: 2,
		productName: '제품 B',
		productCode: 'PROD-002',
		lineName: '라인 2',
		plantName: '공장 B',
		week1: 200,
		week2: 350,
		week3: 150,
		week4: 400,
		week5: 180,
		week6: 320,
		week7: 220,
		week8: 280,
		totalProduction: 2000,
		averageProduction: 250,
		standardDeviation: 85.2,
		levelingScore: 45,
		status: 'needs-improvement',
		createdBy: '사용자2',
		createdAt: '2024-01-01',
		updatedBy: '사용자2',
		updatedAt: '2024-01-31',
	},
	{
		id: 3,
		productName: '제품 C',
		productCode: 'PROD-003',
		lineName: '라인 3',
		plantName: '공장 C',
		week1: 300,
		week2: 300,
		week3: 300,
		week4: 300,
		week5: 300,
		week6: 300,
		week7: 300,
		week8: 300,
		totalProduction: 2400,
		averageProduction: 300,
		standardDeviation: 0,
		levelingScore: 100,
		status: 'optimal',
		createdBy: '사용자3',
		createdAt: '2024-01-01',
		updatedBy: '사용자3',
		updatedAt: '2024-01-31',
	},
];

const ProductionLevelingPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<ProductionLevelingData[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

	useEffect(() => {
		setData(productionLevelingData);
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

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'optimal':
				return 'text-green-600 bg-green-100';
			case 'good':
				return 'text-blue-600 bg-blue-100';
			case 'needs-improvement':
				return 'text-yellow-600 bg-yellow-100';
			case 'poor':
				return 'text-red-600 bg-red-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'optimal':
				return '최적';
			case 'good':
				return '양호';
			case 'needs-improvement':
				return '개선 필요';
			case 'poor':
				return '불량';
			default:
				return '알 수 없음';
		}
	};

	const getLevelingScoreColor = (score: number) => {
		if (score >= 90) return 'text-green-600';
		if (score >= 70) return 'text-blue-600';
		if (score >= 50) return 'text-yellow-600';
		return 'text-red-600';
	};

	// 전체 생산 평준화 차트 데이터
	const overallChartData = useMemo(() => {
		if (!data || data.length === 0) {
			return {
				weekData: [],
				weeks: [],
			};
		}

		const weekData = weeks.map((week) => {
			const weekKey = week.key as keyof ProductionLevelingData;
			return data.reduce(
				(sum, item) => sum + (item[weekKey] as number),
				0
			);
		});

		return {
			weekData,
			weeks: weeks.map((w) => w.label),
		};
	}, [data, weeks]);

	// 제품별 생산 평준화 차트 데이터
	const productChartData = useMemo(() => {
		if (!selectedProduct) return null;

		const product = data.find((item) => item.id === selectedProduct);
		if (!product) return null;

		const weekData = weeks.map((week) => {
			const weekKey = week.key as keyof ProductionLevelingData;
			return product[weekKey] as number;
		});

		return {
			weekData,
			weeks: weeks.map((w) => w.label),
			productName: product.productName,
		};
	}, [data, selectedProduct]);

	// 전체 생산 평준화 차트 옵션
	const overallChartOption = useMemo(() => {
		if (
			!overallChartData ||
			!overallChartData.weeks ||
			!overallChartData.weekData
		) {
			return {
				title: { text: '데이터 로딩 중...', left: 'center' },
				tooltip: { trigger: 'axis' },
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true,
				},
				xAxis: { type: 'category', data: ['로딩 중...'] },
				yAxis: { type: 'value', name: '생산량' },
				series: [
					{
						name: '생산량',
						type: 'bar',
						data: [0],
						itemStyle: { color: '#3B82F6' },
					},
				],
			};
		}

		return {
			title: {
				text:
					overallChartData.weeks.length > 0
						? '전체 생산 평준화 현황'
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
					overallChartData.weeks.length > 0
						? overallChartData.weeks
						: ['데이터 없음'],
			},
			yAxis: {
				type: 'value',
				name: '생산량',
			},
			series: [
				{
					name: '생산량',
					type: 'bar',
					data:
						overallChartData.weekData.length > 0
							? overallChartData.weekData
							: [0],
					itemStyle: {
						color: '#3B82F6',
					},
				},
			],
		};
	}, [overallChartData]);

	// 제품별 생산 평준화 차트 옵션
	const productChartOption = useMemo(() => {
		if (
			!productChartData ||
			!productChartData.weeks ||
			!productChartData.weekData
		) {
			return {
				title: { text: '제품을 선택해주세요', left: 'center' },
				tooltip: { trigger: 'axis' },
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true,
				},
				xAxis: { type: 'category', data: ['제품 선택 필요'] },
				yAxis: { type: 'value', name: '생산량' },
				series: [
					{
						name: '생산량',
						type: 'bar',
						data: [0],
						itemStyle: { color: '#10B981' },
					},
				],
			};
		}

		return {
			title: {
				text: `${productChartData.productName} 생산 평준화 현황`,
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
					productChartData.weeks.length > 0
						? productChartData.weeks
						: ['데이터 없음'],
			},
			yAxis: {
				type: 'value',
				name: '생산량',
			},
			series: [
				{
					name: '생산량',
					type: 'bar',
					data:
						productChartData.weekData.length > 0
							? productChartData.weekData
							: [0],
					itemStyle: {
						color: '#10B981',
					},
				},
			],
		};
	}, [productChartData]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<ProductionLevelingData>[]>(
		() => [
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
				accessorKey: 'lineName',
				header: '라인',
				size: 80,
				align: 'left' as const,
			},
			{
				accessorKey: 'totalProduction',
				header: '총 생산량',
				size: 100,
				align: 'right' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.totalProduction.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'averageProduction',
				header: '평균 생산량',
				size: 100,
				align: 'right' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.averageProduction.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'standardDeviation',
				header: '표준편차',
				size: 100,
				align: 'right' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.standardDeviation.toFixed(1)}
					</div>
				),
			},
			{
				accessorKey: 'levelingScore',
				header: '평준화 점수',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`text-sm font-medium ${getLevelingScoreColor(row.original.levelingScore)}`}
					>
						{row.original.levelingScore}점
					</span>
				),
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 100,
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

	// Process columns using useDataTableColumns
	const processedColumns = useDataTableColumns(columns);

	// Use useDataTable with all required parameters
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
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Factory className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">총 생산량</p>
							<p className="text-2xl font-bold text-gray-900">
								{data
									.reduce(
										(sum, item) =>
											sum + item.totalProduction,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Target className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">평균 생산량</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									data.reduce(
										(sum, item) =>
											sum + item.averageProduction,
										0
									) / data.length
								).toLocaleString()}
							</p>
						</div>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Activity className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">
								평균 평준화 점수
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									data.reduce(
										(sum, item) => sum + item.levelingScore,
										0
									) / data.length
								)}
								점
							</p>
						</div>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<BarChart3 className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">최적 상태</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'optimal'
									).length
								}
								개
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 제품 선택 */}
			<div className="rounded-lg border">
				<div className="flex items-center gap-4 pt-4 pr-4 justify-end">
					<RadixSelect
						value={selectedProduct?.toString() || 'all'}
						onValueChange={(value) =>
							setSelectedProduct(
								value === 'all' ? null : Number(value)
							)
						}
						placeholder="전체 보기"
						className="max-w-xs"
					>
						<RadixSelectItem value="all">전체 보기</RadixSelectItem>
						{data.map((item) => (
							<RadixSelectItem
								key={item.id}
								value={item.id.toString()}
							>
								{item.productName} ({item.productCode})
							</RadixSelectItem>
						))}
					</RadixSelect>
				</div>
				{/* 차트 */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="p-4 rounded-lg">
						<EchartComponent
							options={overallChartOption}
							styles={{ height: '400px' }}
						/>
					</div>
					<div className="p-4 rounded-lg">
						<EchartComponent
							options={productChartOption}
							styles={{ height: '400px' }}
						/>
					</div>
				</div>
			</div>

			{/* 제품별 평준화 현황 테이블 */}
			<div className="bg-white rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="제품별 평준화 현황"
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

export default ProductionLevelingPage;
