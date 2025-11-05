import { useState, useMemo } from 'react';
import { BarChart3, Target, Factory, Activity } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import { GanttChart } from '@repo/gantt-charts';

interface PlanAdjustmentData {
	id: number;
	planName: string;
	planCode: string;
	productName: string;
	productCode: string;
	lineName: string;
	plantName: string;
	originalStartDate: string;
	originalEndDate: string;
	adjustedStartDate: string;
	adjustedEndDate: string;
	originalQuantity: number;
	adjustedQuantity: number;
	priority: 'high' | 'medium' | 'low';
	status: 'draft' | 'pending' | 'approved' | 'rejected';
	adjustmentReason: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// Dummy data
const planAdjustmentData: PlanAdjustmentData[] = [
	{
		id: 1,
		planName: '2024년 1월 생산계획 A',
		planCode: 'PLAN-2024-001',
		productName: '제품 A',
		productCode: 'PROD-001',
		lineName: '라인 1',
		plantName: '공장 A',
		originalStartDate: '2024-01-01',
		originalEndDate: '2024-01-15',
		adjustedStartDate: '2024-01-03',
		adjustedEndDate: '2024-01-18',
		originalQuantity: 1000,
		adjustedQuantity: 1200,
		priority: 'high',
		status: 'pending',
		adjustmentReason: '고객 요청으로 인한 수량 증가',
		createdBy: '사용자1',
		createdAt: '2024-01-01',
		updatedBy: '사용자1',
		updatedAt: '2024-01-31',
	},
	{
		id: 2,
		planName: '2024년 1월 생산계획 B',
		planCode: 'PLAN-2024-002',
		productName: '제품 B',
		productCode: 'PROD-002',
		lineName: '라인 2',
		plantName: '공장 B',
		originalStartDate: '2024-01-10',
		originalEndDate: '2024-01-25',
		adjustedStartDate: '2024-01-08',
		adjustedEndDate: '2024-01-22',
		originalQuantity: 800,
		adjustedQuantity: 750,
		priority: 'medium',
		status: 'approved',
		adjustmentReason: '설비 점검 일정 조정',
		createdBy: '사용자2',
		createdAt: '2024-01-01',
		updatedBy: '사용자2',
		updatedAt: '2024-01-31',
	},
	{
		id: 3,
		planName: '2024년 1월 생산계획 C',
		planCode: 'PLAN-2024-003',
		productName: '제품 C',
		productCode: 'PROD-003',
		lineName: '라인 3',
		plantName: '공장 C',
		originalStartDate: '2024-01-15',
		originalEndDate: '2024-01-30',
		adjustedStartDate: '2024-01-20',
		adjustedEndDate: '2024-02-05',
		originalQuantity: 1200,
		adjustedQuantity: 1000,
		priority: 'low',
		status: 'draft',
		adjustmentReason: '재료 공급 지연',
		createdBy: '사용자3',
		createdAt: '2024-01-01',
		updatedBy: '사용자3',
		updatedAt: '2024-01-31',
	},
];

const ManualPlanAdjustmentPage = () => {
	const [data, setData] = useState<PlanAdjustmentData[]>(planAdjustmentData);

	// Chart options
	const adjustmentChartOption = useMemo(
		() => ({
			title: {
				text: '계획 조정 현황',
				left: 'center',
			},
			tooltip: {
				trigger: 'axis',
			},
			legend: {
				data: ['원본 수량', '조정 수량'],
				bottom: 0,
			},
			xAxis: {
				type: 'category',
				data: data.map((item) => item.productName),
			},
			yAxis: {
				type: 'value',
			},
			series: [
				{
					name: '원본 수량',
					type: 'bar',
					data: data.map((item) => item.originalQuantity),
					itemStyle: { color: '#3B82F6' },
				},
				{
					name: '조정 수량',
					type: 'bar',
					data: data.map((item) => item.adjustedQuantity),
					itemStyle: { color: '#10B981' },
				},
			],
		}),
		[data]
	);

	const timelineChartOption = useMemo(
		() => ({
			title: {
				text: '계획 일정 조정 현황',
				left: 'center',
			},
			tooltip: {
				trigger: 'axis',
				formatter: function (params: any) {
					const data = params[0];
					return `${data.name}<br/>${data.seriesName}: ${data.value}일`;
				},
			},
			legend: {
				data: ['원본 기간', '조정 기간'],
				bottom: 0,
			},
			xAxis: {
				type: 'category',
				data: data.map((item) => item.productName),
			},
			yAxis: {
				type: 'value',
				name: '기간 (일)',
			},
			series: [
				{
					name: '원본 기간',
					type: 'bar',
					data: data.map((item) => {
						const start = new Date(item.originalStartDate);
						const end = new Date(item.originalEndDate);
						return Math.ceil(
							(end.getTime() - start.getTime()) /
								(1000 * 60 * 60 * 24)
						);
					}),
					itemStyle: { color: '#F59E0B' },
				},
				{
					name: '조정 기간',
					type: 'bar',
					data: data.map((item) => {
						const start = new Date(item.adjustedStartDate);
						const end = new Date(item.adjustedEndDate);
						return Math.ceil(
							(end.getTime() - start.getTime()) /
								(1000 * 60 * 60 * 24)
						);
					}),
					itemStyle: { color: '#EF4444' },
				},
			],
		}),
		[data]
	);

	return (
		<div className="space-y-4">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Factory className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">총 계획 수</p>
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
							<p className="text-sm text-gray-600">승인된 계획</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'approved'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Activity className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">
								대기중인 계획
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'pending'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<BarChart3 className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">고우선순위</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.priority === 'high'
									).length
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 차트 섹션 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="p-4 rounded-lg border">
					<EchartComponent
						options={adjustmentChartOption}
						styles={{ height: '400px' }}
					/>
				</div>
				<div className="p-4 rounded-lg border">
					<EchartComponent
						options={timelineChartOption}
						styles={{ height: '400px' }}
					/>
				</div>
			</div>

			{/* Gantt Chart Toggle */}
			<GanttChart headerOffset={210} />
		</div>
	);
};

export default ManualPlanAdjustmentPage;
