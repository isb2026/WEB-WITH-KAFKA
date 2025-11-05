import React, { useState, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import { EchartComponent } from '@repo/echart/components';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
} from '@repo/radix-ui/components';
import { Calendar, Clock, TrendingDown, AlertCircle } from 'lucide-react';

// KPI 카드 컴포넌트
interface KPICardProps {
	title: string;
	value: string | number;
	unit?: string;
	icon: React.ReactNode;
	trend?: 'up' | 'down' | 'neutral';
	trendValue?: string;
	color?: 'blue' | 'green' | 'red' | 'yellow';
}

const KPICard: React.FC<KPICardProps> = ({
	title,
	value,
	unit,
	icon,
	trend,
	trendValue,
	color = 'blue',
}) => {
	const colorClasses = {
		blue: 'bg-blue-50 text-blue-600',
		green: 'bg-green-50 text-green-600',
		red: 'bg-red-50 text-red-600',
		yellow: 'bg-yellow-50 text-yellow-600',
	};

	const trendColors = {
		up: 'text-red-500',
		down: 'text-green-500',
		neutral: 'text-gray-500',
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow border">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<div className="flex items-baseline mt-2">
						<p className="text-2xl font-bold text-gray-900">
							{value}
						</p>
						{unit && (
							<span className="ml-1 text-sm text-gray-500">
								{unit}
							</span>
						)}
					</div>
					{trend && trendValue && (
						<p className={`text-sm mt-1 ${trendColors[trend]}`}>
							{trend === 'up'
								? '↗'
								: trend === 'down'
									? '↘'
									: '→'}{' '}
							{trendValue}
						</p>
					)}
				</div>
				<div className={`p-3 rounded-full ${colorClasses[color]}`}>
					{icon}
				</div>
			</div>
		</div>
	);
};

const ProductionNotworkAnalysisPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [selectedPeriod, setSelectedPeriod] = useState('month');
	const [selectedMachine, setSelectedMachine] = useState('all');

	// 목업 KPI 데이터
	const kpiData = {
		totalDowntime: 234,
		avgDowntimePerDay: 18.5,
		mtbf: 127,
		mostFrequentCause: '설비점검',
	};

	// 목업 다운타임 트렌드 데이터
	const downtimeTrendData = [
		{ date: '01-15', planned: 12, unplanned: 6, total: 18 },
		{ date: '01-16', planned: 8, unplanned: 14, total: 22 },
		{ date: '01-17', planned: 15, unplanned: 3, total: 18 },
		{ date: '01-18', planned: 10, unplanned: 8, total: 18 },
		{ date: '01-19', planned: 6, unplanned: 12, total: 18 },
		{ date: '01-20', planned: 20, unplanned: 2, total: 22 },
		{ date: '01-21', planned: 14, unplanned: 7, total: 21 },
	];

	// 목업 원인별 분석 데이터
	const causeAnalysisData = [
		{ cause: '설비점검', count: 45, percentage: 32.1 },
		{ cause: '고장수리', count: 38, percentage: 27.1 },
		{ cause: '청소작업', count: 22, percentage: 15.7 },
		{ cause: '교육훈련', count: 18, percentage: 12.9 },
		{ cause: '기타', count: 17, percentage: 12.2 },
	];

	// 목업 상세 데이터
	const detailData = [
		{
			id: 1,
			date: '2024-01-19',
			machine: 'MC-001',
			cause: '설비점검',
			startTime: '09:00',
			endTime: '10:30',
			duration: 90,
			type: '계획',
			responsible: '김정비',
		},
		{
			id: 2,
			date: '2024-01-19',
			machine: 'MC-002',
			cause: '고장수리',
			startTime: '14:20',
			endTime: '16:45',
			duration: 145,
			type: '비계획',
			responsible: '이수리',
		},
		{
			id: 3,
			date: '2024-01-18',
			machine: 'MC-001',
			cause: '청소작업',
			startTime: '18:00',
			endTime: '18:45',
			duration: 45,
			type: '계획',
			responsible: '박청소',
		},
		{
			id: 4,
			date: '2024-01-18',
			machine: 'MC-003',
			cause: '교육훈련',
			startTime: '13:00',
			endTime: '15:00',
			duration: 120,
			type: '계획',
			responsible: '최교육',
		},
		{
			id: 5,
			date: '2024-01-17',
			machine: 'MC-002',
			cause: '고장수리',
			startTime: '11:30',
			endTime: '12:15',
			duration: 45,
			type: '비계획',
			responsible: '이수리',
		},
	];

	// 다운타임 트렌드 차트 옵션 (useMemo로 최적화)
	const downtimeTrendChartOption = useMemo(() => {
		if (!downtimeTrendData || downtimeTrendData.length === 0) {
			return null;
		}

		return {
			grid: {
				top: 60,
				left: 60,
				right: 40,
				bottom: 80,
			},
			legend: {
				data: ['계획 비가동', '비계획 비가동', '전체 비가동'],
				top: 10,
			},
			xAxis: {
				type: 'category' as const,
				data: downtimeTrendData.map((item) => item.date),
				axisLabel: {
					interval: 0,
					rotate: 45,
				},
			},
			yAxis: {
				type: 'value' as const,
				name: '시간 (분)',
				nameLocation: 'middle',
				nameGap: 50,
			},
			series: [
				{
					name: '계획 비가동',
					type: 'bar',
					stack: '비가동',
					data: downtimeTrendData.map((item) => item.planned),
					itemStyle: { color: '#3b82f6' },
				},
				{
					name: '비계획 비가동',
					type: 'bar',
					stack: '비가동',
					data: downtimeTrendData.map((item) => item.unplanned),
					itemStyle: { color: '#ef4444' },
				},
				{
					name: '전체 비가동',
					type: 'line',
					data: downtimeTrendData.map((item) => item.total),
					itemStyle: { color: '#8b5cf6' },
					lineStyle: { width: 3 },
				},
			],
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'cross' },
			},
		};
	}, [downtimeTrendData]);

	// 원인별 분석 차트 옵션 (useMemo로 최적화)
	const causeAnalysisChartOption = useMemo(() => {
		if (!causeAnalysisData || causeAnalysisData.length === 0) {
			return null;
		}

		return {
			grid: {
				top: 40,
				left: 60,
				right: 40,
				bottom: 60,
			},
			xAxis: {
				type: 'category' as const,
				data: causeAnalysisData.map((item) => item.cause),
				axisLabel: {
					interval: 0,
					rotate: 45,
				},
			},
			yAxis: [
				{
					type: 'value' as const,
					name: '발생 횟수',
					position: 'left',
				},
				{
					type: 'value' as const,
					name: '비율 (%)',
					position: 'right',
					max: 100,
				},
			],
			series: [
				{
					name: '발생 횟수',
					type: 'bar',
					yAxisIndex: 0,
					data: causeAnalysisData.map((item) => item.count),
					itemStyle: { color: '#f59e0b' },
				},
				{
					name: '누적 비율',
					type: 'line',
					yAxisIndex: 1,
					data: causeAnalysisData.reduce((acc, item, index) => {
						const cumulative =
							index === 0
								? item.percentage
								: acc[index - 1] + item.percentage;
						acc.push(Number(cumulative.toFixed(1)));
						return acc;
					}, [] as number[]),
					itemStyle: { color: '#dc2626' },
					lineStyle: { width: 3 },
				},
			],
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'cross' },
			},
		};
	}, [causeAnalysisData]);

	// 테이블 컬럼 정의
	const tableColumns = [
		{
			accessorKey: 'date',
			header: '일자',
			size: 100,
		},
		{
			accessorKey: 'machine',
			header: '설비',
			size: 100,
		},
		{
			accessorKey: 'cause',
			header: '원인',
			size: 120,
		},
		{
			accessorKey: 'type',
			header: '유형',
			size: 80,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				const colorMap = {
					계획: 'bg-blue-100 text-blue-800',
					비계획: 'bg-red-100 text-red-800',
				};
				return (
					<span
						className={`px-2 py-1 rounded text-xs ${
							colorMap[value as keyof typeof colorMap] ||
							'bg-gray-100 text-gray-800'
						}`}
					>
						{value}
					</span>
				);
			},
		},
		{
			accessorKey: 'startTime',
			header: '시작시간',
			size: 100,
		},
		{
			accessorKey: 'endTime',
			header: '종료시간',
			size: 100,
		},
		{
			accessorKey: 'duration',
			header: '소요시간',
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				return `${getValue()}분`;
			},
		},
		{
			accessorKey: 'responsible',
			header: '담당자',
			size: 100,
		},
	];

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		detailData,
		tableColumns,
		10,
		1,
		0,
		detailData.length,
		() => {}
	);

	return (
		<PageTemplate>
			<div className="space-y-6 h-full">
				{/* 필터 섹션 */}
				<div className="bg-white p-4 rounded-lg shadow border">
					<div className="flex items-center gap-6 flex-wrap">
						<div className="flex items-center gap-2 min-w-0">
							<Calendar className="shrink-0 h-5 w-5 text-gray-500" />
							<span className="shrink-0 text-sm font-medium text-gray-700">
								기간
							</span>
							<RadixSelect
								value={selectedPeriod}
								onValueChange={setSelectedPeriod}
							>
								<RadixSelectGroup>
									<RadixSelectItem value="week">
										최근 1주
									</RadixSelectItem>
									<RadixSelectItem value="month">
										최근 1개월
									</RadixSelectItem>
									<RadixSelectItem value="quarter">
										최근 3개월
									</RadixSelectItem>
								</RadixSelectGroup>
							</RadixSelect>
						</div>

						<div className="flex items-center gap-2 min-w-0">
							<Clock className="shrink-0 h-5 w-5 text-gray-500" />
							<span className="shrink-0 text-sm font-medium text-gray-700">
								설비
							</span>
							<RadixSelect
								value={selectedMachine}
								onValueChange={setSelectedMachine}
							>
								<RadixSelectGroup>
									<RadixSelectItem value="all">
										전체
									</RadixSelectItem>
									<RadixSelectItem value="MC-001">
										MC-001
									</RadixSelectItem>
									<RadixSelectItem value="MC-002">
										MC-002
									</RadixSelectItem>
									<RadixSelectItem value="MC-003">
										MC-003
									</RadixSelectItem>
								</RadixSelectGroup>
							</RadixSelect>
						</div>
					</div>
				</div>

				{/* KPI 카드 섹션 */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<KPICard
						title="총 비가동 시간"
						value={kpiData.totalDowntime}
						unit="시간"
						icon={<Clock size={20} />}
						trend="up"
						trendValue="+12% vs 지난달"
						color="red"
					/>
					<KPICard
						title="일평균 비가동"
						value={kpiData.avgDowntimePerDay}
						unit="시간"
						icon={<TrendingDown size={20} />}
						trend="down"
						trendValue="-5% vs 지난달"
						color="green"
					/>
					<KPICard
						title="MTBF"
						value={kpiData.mtbf}
						unit="시간"
						icon={<AlertCircle size={20} />}
						trend="up"
						trendValue="+8% vs 지난달"
						color="blue"
					/>
					<KPICard
						title="주요 원인"
						value={kpiData.mostFrequentCause}
						icon={<AlertCircle size={20} />}
						color="yellow"
					/>
				</div>

				{/* 차트 섹션 */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* 다운타임 트렌드 차트 */}
					<div className="bg-white p-6 rounded-lg shadow border">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							비가동 트렌드 분석
						</h3>
						{downtimeTrendChartOption ? (
							<EchartComponent
								options={downtimeTrendChartOption}
								styles={{ width: '100%', height: '400px' }}
							/>
						) : (
							<div className="flex items-center justify-center h-[400px] text-gray-500">
								데이터를 불러오는 중...
							</div>
						)}
					</div>

					{/* 원인별 분석 차트 */}
					<div className="bg-white p-6 rounded-lg shadow border">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							원인별 파레토 분석
						</h3>
						{causeAnalysisChartOption ? (
							<EchartComponent
								options={causeAnalysisChartOption}
								styles={{ width: '100%', height: '400px' }}
							/>
						) : (
							<div className="flex items-center justify-center h-[400px] text-gray-500">
								데이터를 불러오는 중...
							</div>
						)}
					</div>
				</div>

				{/* 상세 데이터 테이블 */}
				<div className="bg-white rounded-lg shadow border">
					<div className="p-6 border-b">
						<h3 className="text-lg font-semibold text-gray-900">
							비가동 상세 현황
						</h3>
					</div>
					<DatatableComponent
						table={table}
						columns={tableColumns}
						data={detailData}
						selectedRows={selectedRows}
						toggleRowSelection={toggleRowSelection}
						rowCount={detailData.length}
						useSearch={true}
						usePageNation={true}
						useSummary={true}
					/>
				</div>
			</div>
		</PageTemplate>
	);
};

export default ProductionNotworkAnalysisPage;
