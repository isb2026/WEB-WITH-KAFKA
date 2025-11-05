import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { EchartComponent } from '@repo/echart/components';
import {
	ArrowLeft,
	Settings,
	Eye,
	Wrench,
	BarChart3,
	CheckCircle,
	AlertTriangle,
	Clock,
	TrendingUp,
	TrendingDown,
} from 'lucide-react';
import { RadixIconButton } from '@radix-ui/components';

// 금형 기본 정보 타입
interface MoldInfo {
	moldCode: string;
	moldName: string;
	moldType: string;
	supplier: string;
	manufacturingDate: string;
	totalShots: number;
	currentShots: number;
	location: string;
	status: string;
	specifications: {
		length: number;
		width: number;
		height: number;
		weight: number;
		cavityCount: number;
	};
}

// 검사 항목별 데이터 타입
interface InspectionData {
	id: number;
	inspectionDate: string;
	inspector: string;
	itemCode: string;
	itemName: string;
	standardValue: number;
	measuredValue: number;
	tolerance: string;
	result: 'OK' | 'NG' | 'WARNING';
	sampleSize: number;
	notes?: string;
}

// 차트 옵션 생성 함수
const createInspectionTrendChart = (data: InspectionData[], title: string) => {
	const dates = data.map((item) => item.inspectionDate);
	const standardValues = data.map((item) => item.standardValue);
	const measuredValues = data.map((item) => item.measuredValue);
	const results = data.map((item) => item.result);

	return {
		title: {
			text: `${title} 검사 트렌드`,
			left: 'center',
			textStyle: {
				fontSize: 16,
				fontWeight: 'bold' as const,
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
			},
			formatter: function (params: any) {
				const index = params[0].dataIndex;
				const result = results[index];
				const resultColor =
					result === 'OK'
						? '#22c55e'
						: result === 'WARNING'
							? '#f59e0b'
							: '#ef4444';

				return `
					<div style="padding: 8px;">
						<div style="font-weight: bold; margin-bottom: 4px;">${dates[index]}</div>
						<div style="margin-bottom: 2px;">
							<span style="color: #6b7280;">기준값:</span> <span style="font-weight: bold;">${standardValues[index]}</span>
						</div>
						<div style="margin-bottom: 2px;">
							<span style="color: #6b7280;">측정값:</span> <span style="font-weight: bold;">${measuredValues[index]}</span>
						</div>
						<div>
							<span style="color: #6b7280;">결과:</span> 
							<span style="color: ${resultColor}; font-weight: bold;">${result}</span>
						</div>
					</div>
				`;
			},
		},
		legend: {
			data: ['기준값', '측정값'],
			bottom: 10,
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true,
		},
		xAxis: {
			type: 'category' as const,
			data: dates,
			axisLabel: {
				rotate: 45,
				fontSize: 11,
			},
		},
		yAxis: {
			type: 'value' as const,
			name: '값',
			nameLocation: 'middle' as const,
			nameGap: 40,
		},
		series: [
			{
				name: '기준값',
				type: 'line',
				data: standardValues,
				lineStyle: {
					color: '#3b82f6',
					width: 2,
				},
				itemStyle: {
					color: '#3b82f6',
				},
				symbol: 'circle',
				symbolSize: 6,
			},
			{
				name: '측정값',
				type: 'line',
				data: measuredValues.map((value, index) => ({
					value,
					itemStyle: {
						color:
							results[index] === 'OK'
								? '#22c55e'
								: results[index] === 'WARNING'
									? '#f59e0b'
									: '#ef4444',
					},
				})),
				lineStyle: {
					color: '#ef4444',
					width: 3,
				},
				symbol: 'diamond',
				symbolSize: 8,
			},
		],
	};
};

// 검사 결과 분포 도넛 차트
const createResultDistributionChart = (data: InspectionData[]) => {
	const resultCounts = data.reduce(
		(acc, item) => {
			acc[item.result] = (acc[item.result] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>
	);

	const chartData = Object.entries(resultCounts).map(([result, count]) => ({
		name: result,
		value: count,
		itemStyle: {
			color:
				result === 'OK'
					? '#22c55e'
					: result === 'WARNING'
						? '#f59e0b'
						: '#ef4444',
		},
	}));

	return {
		title: {
			text: '검사 결과 분포',
			left: 'center',
			textStyle: {
				fontSize: 14,
				fontWeight: 'bold' as const,
			},
		},
		tooltip: {
			trigger: 'item' as const,
			formatter: '{a} <br/>{b}: {c} ({d}%)',
		},
		legend: {
			orient: 'horizontal',
			bottom: 10,
			data: Object.keys(resultCounts),
		},
		series: [
			{
				name: '검사 결과',
				type: 'pie',
				radius: ['40%', '70%'],
				center: ['50%', '45%'],
				data: chartData,
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
				label: {
					formatter: '{b}\n{d}%',
					fontSize: 11,
				},
			},
		],
	};
};

const ProductionMoldMaintenanceDetailPage: React.FC = () => {
	const { t } = useTranslation('common');
	const { moldCode } = useParams<{ moldCode: string }>();
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState<string>('dimension');

	// 임시 금형 정보 데이터
	const [moldInfo] = useState<MoldInfo>({
		moldCode: moldCode || 'MLD-001',
		moldName: '스마트폰 케이스 금형',
		moldType: 'Injection',
		supplier: '정밀금형',
		manufacturingDate: '2022-03-15',
		totalShots: 100000,
		currentShots: 75000,
		location: '라인-1',
		status: '가동중',
		specifications: {
			length: 250,
			width: 180,
			height: 120,
			weight: 850,
			cavityCount: 4,
		},
	});

	// 임시 검사 데이터 (검사 항목별)
	const [dimensionData] = useState<InspectionData[]>([
		{
			id: 1,
			inspectionDate: '2024-01-25',
			inspector: '김검사',
			itemCode: 'DIM-001',
			itemName: '전체 길이',
			standardValue: 150.0,
			measuredValue: 149.8,
			tolerance: '±0.5',
			result: 'OK',
			sampleSize: 5,
			notes: '정상 범위',
		},
		{
			id: 2,
			inspectionDate: '2024-01-25',
			inspector: '김검사',
			itemCode: 'DIM-002',
			itemName: '내부 너비',
			standardValue: 80.0,
			measuredValue: 80.3,
			tolerance: '±0.3',
			result: 'WARNING',
			sampleSize: 5,
			notes: '허용 상한선 근접',
		},
		{
			id: 3,
			inspectionDate: '2024-01-25',
			inspector: '김검사',
			itemCode: 'DIM-003',
			itemName: '두께',
			standardValue: 2.5,
			measuredValue: 2.6,
			tolerance: '±0.1',
			result: 'NG',
			sampleSize: 3,
			notes: '기준치 초과, 조정 필요',
		},
	]);

	const [appearanceData] = useState<InspectionData[]>([
		{
			id: 4,
			inspectionDate: '2024-01-25',
			inspector: '이검사',
			itemCode: 'APP-001',
			itemName: '표면 거칠기',
			standardValue: 0.8,
			measuredValue: 0.7,
			tolerance: '≤1.0',
			result: 'OK',
			sampleSize: 10,
			notes: '양호',
		},
		{
			id: 5,
			inspectionDate: '2024-01-25',
			inspector: '이검사',
			itemCode: 'APP-002',
			itemName: '색상 균일도',
			standardValue: 95,
			measuredValue: 93,
			tolerance: '≥90',
			result: 'OK',
			sampleSize: 8,
			notes: '허용 범위',
		},
	]);

	const [functionalData] = useState<InspectionData[]>([
		{
			id: 6,
			inspectionDate: '2024-01-25',
			inspector: '박검사',
			itemCode: 'FUNC-001',
			itemName: '토출압력',
			standardValue: 120,
			measuredValue: 118,
			tolerance: '±5',
			result: 'OK',
			sampleSize: 3,
			notes: '정상 작동',
		},
		{
			id: 7,
			inspectionDate: '2024-01-25',
			inspector: '박검사',
			itemCode: 'FUNC-002',
			itemName: '사이클 타임',
			standardValue: 35,
			measuredValue: 36,
			tolerance: '≤40',
			result: 'OK',
			sampleSize: 5,
			notes: '효율적',
		},
	]);

	// 검사 결과별 색상
	const getResultColor = (result: string) => {
		switch (result) {
			case 'OK':
				return 'text-green-600 bg-green-50';
			case 'WARNING':
				return 'text-yellow-600 bg-yellow-50';
			case 'NG':
				return 'text-red-600 bg-red-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	};

	// 검사 결과별 아이콘
	const getResultIcon = (result: string) => {
		switch (result) {
			case 'OK':
				return <CheckCircle size={16} className="text-green-600" />;
			case 'WARNING':
				return <AlertTriangle size={16} className="text-yellow-600" />;
			case 'NG':
				return <AlertTriangle size={16} className="text-red-600" />;
			default:
				return <Clock size={16} className="text-gray-600" />;
		}
	};

	// 공통 테이블 컬럼 설정
	const createTableColumns = (data: InspectionData[]) => [
		{
			id: 'inspectionDate',
			header: '검사일',
			accessorKey: 'inspectionDate',
		},
		{
			id: 'inspector',
			header: '검사자',
			accessorKey: 'inspector',
		},
		{
			id: 'itemName',
			header: '검사항목',
			accessorKey: 'itemName',
		},
		{
			id: 'standardValue',
			header: '기준값',
			accessorKey: 'standardValue',
		},
		{
			id: 'measuredValue',
			header: '측정값',
			accessorKey: 'measuredValue',
		},
		{
			id: 'tolerance',
			header: '허용차',
			accessorKey: 'tolerance',
		},
		{
			id: 'result',
			header: '결과',
			accessorKey: 'result',
			cell: ({ row }: any) => {
				const result = row.original.result;
				return (
					<div
						className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getResultColor(result)}`}
					>
						{getResultIcon(result)}
						{result}
					</div>
				);
			},
		},
		{
			id: 'sampleSize',
			header: '시료수',
			accessorKey: 'sampleSize',
		},
		{
			id: 'notes',
			header: '비고',
			accessorKey: 'notes',
		},
	];

	// 각 탭별 데이터 테이블 컴포넌트
	const createDataTable = (data: InspectionData[], title: string) => {
		const tableColumns = createTableColumns(data);
		const { table, selectedRows, toggleRowSelection } = useDataTable(
			data,
			tableColumns,
			10,
			1,
			0,
			data.length
		);

		return (
			<div className="space-y-6 h-full">
				{/* 차트 영역 */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* 트렌드 라인 차트 */}
					<div className="bg-white rounded-lg shadow p-6">
						<div className="h-80">
							<EchartComponent
								options={createInspectionTrendChart(
									data,
									title
								)}
								styles={{ width: '100%', height: '320px' }}
							/>
						</div>
						<div className="mt-4 text-center text-sm text-gray-600">
							총 시료수:{' '}
							{data.reduce(
								(sum, item) => sum + item.sampleSize,
								0
							)}
							개
						</div>
					</div>

					{/* 결과 분포 도넛 차트 */}
					<div className="bg-white rounded-lg shadow p-6">
						<div className="h-80">
							<EchartComponent
								options={createResultDistributionChart(data)}
								styles={{ width: '100%', height: '320px' }}
							/>
						</div>
						<div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
							<div className="flex flex-col">
								<span className="text-green-600 font-bold text-lg">
									{
										data.filter(
											(item) => item.result === 'OK'
										).length
									}
								</span>
								<span className="text-gray-600">정상</span>
							</div>
							<div className="flex flex-col">
								<span className="text-yellow-600 font-bold text-lg">
									{
										data.filter(
											(item) => item.result === 'WARNING'
										).length
									}
								</span>
								<span className="text-gray-600">주의</span>
							</div>
							<div className="flex flex-col">
								<span className="text-red-600 font-bold text-lg">
									{
										data.filter(
											(item) => item.result === 'NG'
										).length
									}
								</span>
								<span className="text-gray-600">불량</span>
							</div>
						</div>
					</div>
				</div>

				{/* 데이터 테이블 */}
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle={`${title} 상세 데이터`}
					rowCount={data.length}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					classNames={{
						container: 'border rounded-lg',
					}}
				/>
			</div>
		);
	};

	const tabs: TabItem[] = [
		{
			id: 'dimension',
			icon: <Settings size={16} />,
			label: '치수검사',
			to: '',
			content: createDataTable(dimensionData, '치수검사'),
		},
		{
			id: 'appearance',
			icon: <Eye size={16} />,
			label: '외관검사',
			to: '',
			content: createDataTable(appearanceData, '외관검사'),
		},
		{
			id: 'functional',
			icon: <Wrench size={16} />,
			label: '기능검사',
			to: '',
			content: createDataTable(functionalData, '기능검사'),
		},
	];

	const handleBack = () => {
		navigate('/production/mold/maintenance');
	};

	return (
		<div className="max-w-full mx-auto p-4 h-full flex flex-col">
			<h1 className="text-xl font-bold mt-2 mb-3">금형 점검 상세현황</h1>

			<div className="flex justify-between items-center gap-2 mb-6">
				<RadixIconButton
					className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
					onClick={handleBack}
				>
					<ArrowLeft size={16} className="text-muted-foreground" />
					{t('tabs.actions.back')}
				</RadixIconButton>
			</div>

			{/* 금형 기본 정보 섹션 */}
			<div className="bg-white rounded-lg border p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4 text-gray-900">
					금형 기본 정보
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* 기본 정보 */}
					<div className="space-y-3">
						<h3 className="font-medium text-gray-700 border-b pb-2">
							기본 정보
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">금형코드:</span>
								<span className="font-medium text-blue-600">
									{moldInfo.moldCode}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">금형명:</span>
								<span className="font-medium">
									{moldInfo.moldName}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">금형타입:</span>
								<span>{moldInfo.moldType}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">공급업체:</span>
								<span>{moldInfo.supplier}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">제작일:</span>
								<span>{moldInfo.manufacturingDate}</span>
							</div>
						</div>
					</div>

					{/* 사용 현황 */}
					<div className="space-y-3">
						<h3 className="font-medium text-gray-700 border-b pb-2">
							사용 현황
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">총 샷수:</span>
								<span className="font-medium">
									{moldInfo.totalShots.toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">
									현재 샷수:
								</span>
								<span className="font-medium">
									{moldInfo.currentShots.toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">사용률:</span>
								<span className="font-medium text-orange-600">
									{Math.round(
										(moldInfo.currentShots /
											moldInfo.totalShots) *
											100
									)}
									%
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">위치:</span>
								<span>{moldInfo.location}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">상태:</span>
								<span className="text-green-600 font-medium">
									{moldInfo.status}
								</span>
							</div>
						</div>
					</div>

					{/* 규격 정보 */}
					<div className="space-y-3">
						<h3 className="font-medium text-gray-700 border-b pb-2">
							규격 정보
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">길이:</span>
								<span>{moldInfo.specifications.length}mm</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">너비:</span>
								<span>{moldInfo.specifications.width}mm</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">높이:</span>
								<span>{moldInfo.specifications.height}mm</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">무게:</span>
								<span>{moldInfo.specifications.weight}kg</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">
									캐비티 수:
								</span>
								<span>
									{moldInfo.specifications.cavityCount}개
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 검사 항목별 상세 현황 섹션 */}
			<div className="bg-white rounded-lg border p-6">
				<h2 className="text-xl font-semibold mb-4 text-gray-900">
					검사 항목별 상세 현황
				</h2>
				<TabLayout
					title="검사 항목별 상세 현황"
					tabs={tabs}
					defaultValue={currentTab}
					onValueChange={setCurrentTab}
				/>
			</div>
		</div>
	);
};

export default ProductionMoldMaintenanceDetailPage;
