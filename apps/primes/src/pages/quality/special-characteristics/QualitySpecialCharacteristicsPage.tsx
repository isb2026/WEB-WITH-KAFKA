import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import PageTemplate from '@primes/templates/PageTemplate';
import { EchartComponent } from '@repo/echart/components';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import {
	Calendar,
	Filter,
	TrendingUp,
	TrendingDown,
	Target,
	AlertTriangle,
	BarChart3,
	Activity,
	RefreshCw,
} from 'lucide-react';
import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
	RadixButton,
} from '@repo/radix-ui/components';

// 샘플 데이터 타입 정의
interface SpecialCharacteristicData {
	id: number;
	date: string;
	product: string;
	characteristic: string;
	measuredValue: number;
	targetValue: number;
	tolerance: string;
	deviation: number;
	result: 'OK' | 'NG';
	action: string;
	inspector: string;
}

// KPI 카드 컴포넌트
interface KPICardProps {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	trend?: 'up' | 'down' | 'neutral';
	trendValue?: string;
	color: string;
}

const KPICard: React.FC<KPICardProps> = ({
	title,
	value,
	icon,
	trend,
	trendValue,
	color,
}) => (
	<div className="bg-white rounded-lg border shadow-sm p-6">
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm font-medium text-gray-600">{title}</p>
				<p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
				{trend && trendValue && (
					<div className="flex items-center mt-2">
						{trend === 'up' ? (
							<TrendingUp
								size={16}
								className="text-green-500 mr-1"
							/>
						) : trend === 'down' ? (
							<TrendingDown
								size={16}
								className="text-red-500 mr-1"
							/>
						) : (
							<div className="w-4 h-4 mr-1" />
						)}
						<span
							className={`text-sm font-medium ${
								trend === 'up'
									? 'text-green-600'
									: trend === 'down'
										? 'text-red-600'
										: 'text-gray-600'
							}`}
						>
							{trendValue}
						</span>
					</div>
				)}
			</div>
			<div className={`p-3 rounded-lg ${color}`}>{icon}</div>
		</div>
	</div>
);

const QualitySpecialCharacteristicsPage: React.FC = () => {
	const { t } = useTranslation('common');

	// 필터 상태
	const [selectedInspectionType, setSelectedInspectionType] = useState('all');
	const [selectedPeriod, setSelectedPeriod] = useState('week');
	const [selectedProduct, setSelectedProduct] = useState('all');
	const [selectedCharacteristic, setSelectedCharacteristic] = useState('all');
	const [refreshing, setRefreshing] = useState(false);

	// 샘플 데이터
	const [sampleData] = useState<SpecialCharacteristicData[]>([
		{
			id: 1,
			date: '2024-01-15 09:30',
			product: 'SP-CASE-001',
			characteristic: '두께',
			measuredValue: 2.05,
			targetValue: 2.0,
			tolerance: '±0.05',
			deviation: 0.05,
			result: 'OK',
			action: '-',
			inspector: '김품질',
		},
		{
			id: 2,
			date: '2024-01-15 10:15',
			product: 'SP-CASE-001',
			characteristic: '폭',
			measuredValue: 50.8,
			targetValue: 50.0,
			tolerance: '±0.5',
			deviation: 0.8,
			result: 'NG',
			action: '재작업 지시',
			inspector: '이검사',
		},
		{
			id: 3,
			date: '2024-01-15 11:00',
			product: 'AUTO-GEAR-205',
			characteristic: '직경',
			measuredValue: 25.02,
			targetValue: 25.0,
			tolerance: '±0.03',
			deviation: 0.02,
			result: 'OK',
			action: '-',
			inspector: '박정밀',
		},
		{
			id: 4,
			date: '2024-01-15 14:20',
			product: 'BRAKE-PAD-301',
			characteristic: '경도',
			measuredValue: 65.5,
			targetValue: 65.0,
			tolerance: '±1.0',
			deviation: 0.5,
			result: 'OK',
			action: '-',
			inspector: '최품질',
		},
		{
			id: 5,
			date: '2024-01-15 15:45',
			product: 'SP-CASE-001',
			characteristic: '표면조도',
			measuredValue: 1.8,
			targetValue: 1.6,
			tolerance: '±0.2',
			deviation: 0.2,
			result: 'OK',
			action: '-',
			inspector: '김품질',
		},
	]);

	// KPI 데이터
	const kpiData = {
		cpIndex: 1.33,
		cpkIndex: 1.21,
		defectRate: 0.8,
		improvementRate: 15,
	};

	// 테이블 컬럼 정의
	const tableColumns = [
		{
			accessorKey: 'date',
			header: '검사일시',
			size: 120,
		},
		{
			accessorKey: 'product',
			header: '제품명',
			size: 120,
		},
		{
			accessorKey: 'characteristic',
			header: '특성항목',
			size: 100,
		},
		{
			accessorKey: 'measuredValue',
			header: '측정값',
			size: 80,
			cell: (info: any) => info.getValue()?.toFixed(2),
		},
		{
			accessorKey: 'targetValue',
			header: '기준값',
			size: 80,
			cell: (info: any) => info.getValue()?.toFixed(2),
		},
		{
			accessorKey: 'tolerance',
			header: '허용공차',
			size: 90,
		},
		{
			accessorKey: 'deviation',
			header: '편차',
			size: 80,
			cell: (info: any) => {
				const value = info.getValue();
				return (
					<span
						className={value > 0 ? 'text-red-600' : 'text-blue-600'}
					>
						{value > 0 ? '+' : ''}
						{value?.toFixed(2)}
					</span>
				);
			},
		},
		{
			accessorKey: 'result',
			header: '판정',
			size: 60,
			cell: (info: any) => {
				const value = info.getValue();
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${
							value === 'OK'
								? 'bg-green-100 text-green-800'
								: 'bg-red-100 text-red-800'
						}`}
					>
						{value}
					</span>
				);
			},
		},
		{
			accessorKey: 'action',
			header: '조치사항',
			size: 120,
		},
		{
			accessorKey: 'inspector',
			header: '검사자',
			size: 80,
		},
	];

	// 데이터테이블 훅
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		sampleData,
		tableColumns,
		10,
		1,
		0,
		sampleData.length,
		() => {}
	);

	// 시간별 추세 차트 옵션
	const createTrendChartOption = () => {
		const dates = [
			'01-15 09:00',
			'01-15 10:00',
			'01-15 11:00',
			'01-15 12:00',
			'01-15 13:00',
			'01-15 14:00',
			'01-15 15:00',
		];
		const measuredValues = [2.05, 2.03, 2.02, 2.04, 2.01, 2.06, 2.03];
		const targetValue = 2.0;
		const ucl = 2.05; // 관리상한선
		const lcl = 1.95; // 관리하한선

		return {
			title: {
				text: '시간별 특성값 추세 (관리도)',
				left: 'center',
				textStyle: { fontSize: 16, fontWeight: 'bold' },
			},
			tooltip: {
				trigger: 'axis',
				formatter: function (params: any) {
					let result = params[0].axisValue + '<br/>';
					params.forEach((param: any) => {
						if (param.seriesName === '측정값') {
							result +=
								param.marker +
								param.seriesName +
								': ' +
								param.value +
								'<br/>';
						}
					});
					return result;
				},
			},
			legend: {
				data: [
					'측정값',
					'기준값',
					'관리상한선(UCL)',
					'관리하한선(LCL)',
				],
				top: 30,
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				top: '15%',
				containLabel: true,
			},
			xAxis: {
				type: 'category',
				data: dates,
				boundaryGap: false,
			},
			yAxis: {
				type: 'value',
				min: 1.9,
				max: 2.1,
			},
			series: [
				{
					name: '측정값',
					type: 'line',
					data: measuredValues,
					symbol: 'circle',
					symbolSize: 6,
					lineStyle: { color: '#1f77b4', width: 2 },
					itemStyle: { color: '#1f77b4' },
				},
				{
					name: '기준값',
					type: 'line',
					data: Array(dates.length).fill(targetValue),
					symbol: 'none',
					lineStyle: { color: '#2ca02c', width: 2, type: 'solid' },
					itemStyle: { color: '#2ca02c' },
				},
				{
					name: '관리상한선(UCL)',
					type: 'line',
					data: Array(dates.length).fill(ucl),
					symbol: 'none',
					lineStyle: { color: '#d62728', width: 1, type: 'dashed' },
					itemStyle: { color: '#d62728' },
				},
				{
					name: '관리하한선(LCL)',
					type: 'line',
					data: Array(dates.length).fill(lcl),
					symbol: 'none',
					lineStyle: { color: '#d62728', width: 1, type: 'dashed' },
					itemStyle: { color: '#d62728' },
				},
			],
		};
	};

	// 새로고침 핸들러
	const handleRefresh = async () => {
		setRefreshing(true);
		// 실제로는 API 호출
		setTimeout(() => {
			setRefreshing(false);
		}, 1000);
	};

	return (
		<PageTemplate>
			{/* 페이지 제목 */}

			{/* 필터 및 제어 영역 */}
			<div className="bg-white rounded-lg border p-4 mb-6">
				<div className="flex flex-wrap items-center gap-6">
					{/* 검사유형 선택 */}
					<div className="flex items-center gap-2 min-w-0">
						<Filter size={16} className="text-gray-500 shrink-0" />
						<span className="text-sm font-medium shrink-0">
							검사유형:
						</span>
						<div className="min-w-[140px]">
							<RadixSelect
								value={selectedInspectionType}
								onValueChange={setSelectedInspectionType}
							>
								<RadixSelectGroup>
									<RadixSelectItem value="all">
										전체 검사
									</RadixSelectItem>
									<RadixSelectItem value="patrol">
										순회검사
									</RadixSelectItem>
									<RadixSelectItem value="incoming">
										수입검사
									</RadixSelectItem>
									<RadixSelectItem value="final">
										최종검사
									</RadixSelectItem>
								</RadixSelectGroup>
							</RadixSelect>
						</div>
					</div>

					{/* 기간 선택 */}
					<div className="flex items-center gap-2 min-w-0">
						<Calendar
							size={16}
							className="text-gray-500 shrink-0"
						/>
						<span className="text-sm font-medium shrink-0">
							기간:
						</span>
						<div className="min-w-[120px]">
							<RadixSelect
								value={selectedPeriod}
								onValueChange={setSelectedPeriod}
							>
								<RadixSelectGroup>
									<RadixSelectItem value="week">
										최근 7일
									</RadixSelectItem>
									<RadixSelectItem value="month">
										최근 30일
									</RadixSelectItem>
									<RadixSelectItem value="quarter">
										최근 3개월
									</RadixSelectItem>
								</RadixSelectGroup>
							</RadixSelect>
						</div>
					</div>

					{/* 제품 선택 */}
					<div className="flex items-center gap-2 min-w-0">
						<Target size={16} className="text-gray-500 shrink-0" />
						<span className="text-sm font-medium shrink-0">
							제품:
						</span>
						<div className="min-w-[160px]">
							<RadixSelect
								value={selectedProduct}
								onValueChange={setSelectedProduct}
							>
								<RadixSelectGroup>
									<RadixSelectItem value="all">
										전체 제품
									</RadixSelectItem>
									<RadixSelectItem value="SP-CASE-001">
										갤럭시 S24 케이스
									</RadixSelectItem>
									<RadixSelectItem value="AUTO-GEAR-205">
										변속기 기어 샤프트
									</RadixSelectItem>
									<RadixSelectItem value="BRAKE-PAD-301">
										브레이크 패드
									</RadixSelectItem>
								</RadixSelectGroup>
							</RadixSelect>
						</div>
					</div>

					{/* 특성항목 선택 */}
					<div className="flex items-center gap-2 min-w-0">
						<BarChart3
							size={16}
							className="text-gray-500 shrink-0"
						/>
						<span className="text-sm font-medium shrink-0">
							특성항목:
						</span>
						<div className="min-w-[120px]">
							<RadixSelect
								value={selectedCharacteristic}
								onValueChange={setSelectedCharacteristic}
							>
								<RadixSelectGroup>
									<RadixSelectItem value="all">
										전체 특성
									</RadixSelectItem>
									<RadixSelectItem value="thickness">
										두께
									</RadixSelectItem>
									<RadixSelectItem value="width">
										폭
									</RadixSelectItem>
									<RadixSelectItem value="diameter">
										직경
									</RadixSelectItem>
									<RadixSelectItem value="hardness">
										경도
									</RadixSelectItem>
								</RadixSelectGroup>
							</RadixSelect>
						</div>
					</div>

					{/* 새로고침 버튼 */}
					<div className="ml-auto">
						<RadixButton
							onClick={handleRefresh}
							disabled={refreshing}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
						>
							<RefreshCw
								size={16}
								className={refreshing ? 'animate-spin' : ''}
							/>
							새로고침
						</RadixButton>
					</div>
				</div>
			</div>

			{/* KPI 카드 영역 */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
				<KPICard
					title="Cp 지수"
					value={kpiData.cpIndex.toFixed(2)}
					icon={<Target size={24} className="text-white" />}
					trend="up"
					trendValue="+0.08"
					color="bg-blue-500"
				/>
				<KPICard
					title="Cpk 지수"
					value={kpiData.cpkIndex.toFixed(2)}
					icon={<Activity size={24} className="text-white" />}
					trend="down"
					trendValue="-0.12"
					color="bg-green-500"
				/>
				<KPICard
					title="불량률"
					value={`${kpiData.defectRate}%`}
					icon={<AlertTriangle size={24} className="text-white" />}
					trend="down"
					trendValue="-0.3%"
					color="bg-orange-500"
				/>
				<KPICard
					title="개선도"
					value={`+${kpiData.improvementRate}%`}
					icon={<TrendingUp size={24} className="text-white" />}
					trend="up"
					trendValue="+5%"
					color="bg-purple-500"
				/>
			</div>

			{/* 메인 차트 영역 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* 시간별 추세 차트 */}
				<div className="bg-white rounded-lg shadow p-6">
					<EchartComponent
						options={createTrendChartOption()}
						height="400px"
					/>
				</div>

				{/* 플레이스홀더 차트 영역 */}
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-center h-[400px] text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
						<div className="text-center">
							<BarChart3
								size={48}
								className="mx-auto mb-4 text-gray-400"
							/>
							<p className="text-lg font-medium">
								특성값 분포 히스토그램
							</p>
							<p className="text-sm">Phase 2에서 구현 예정</p>
						</div>
					</div>
				</div>
			</div>

			{/* 플레이스홀더 차트 영역 2개 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-center h-[300px] text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
						<div className="text-center">
							<Target
								size={48}
								className="mx-auto mb-4 text-gray-400"
							/>
							<p className="text-lg font-medium">공정능력 분석</p>
							<p className="text-sm">Cp, Cpk 시각화 (Phase 2)</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-center h-[300px] text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
						<div className="text-center">
							<Activity
								size={48}
								className="mx-auto mb-4 text-gray-400"
							/>
							<p className="text-lg font-medium">
								특성별 비교 레이더
							</p>
							<p className="text-sm">
								다특성 동시 분석 (Phase 2)
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 상세 데이터 테이블 */}
			<div className="bg-white rounded-lg shadow">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={sampleData}
					tableTitle="특별특성 검사 데이터 상세"
					rowCount={sampleData.length}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					useSearch={true}
					usePageNation={true}
					useSummary={true}
				/>
			</div>
		</PageTemplate>
	);
};

export default QualitySpecialCharacteristicsPage;
