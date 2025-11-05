import React, { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import {
	BarChart3,
	TrendingUp,
	TrendingDown,
	ClipboardList,
	Target,
	Clock,
	CheckCircle,
} from 'lucide-react';

// 작지분석 데이터 타입
interface CommandAnalysisData {
	id: number;
	workOrderNo: string;
	itemName: string;
	itemCode: string;
	planQuantity: number;
	actualQuantity: number;
	achievementRate: number;
	workTime: number; // 작업 시간 (시간)
	efficiency: number; // 효율성 %
	status: string;
	startDate: string;
	endDate: string;
	worker: string;
}

// 작지분석 KPI 데이터
interface CommandKPIData {
	totalCommands: number;
	completedCommands: number;
	averageEfficiency: number;
	onTimeCompletionRate: number;
}

export const ProductionCommandAnalysisPage: React.FC = () => {
	const { t } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');

	// 임시 KPI 데이터
	const [kpiData] = useState<CommandKPIData>({
		totalCommands: 45,
		completedCommands: 38,
		averageEfficiency: 87,
		onTimeCompletionRate: 84,
	});

	// 임시 작지분석 데이터
	const [commandAnalysisData] = useState<CommandAnalysisData[]>([
		{
			id: 1,
			workOrderNo: 'WO-2024-001',
			itemName: '스마트폰 케이스',
			itemCode: 'SC001',
			planQuantity: 1000,
			actualQuantity: 950,
			achievementRate: 95,
			workTime: 8.5,
			efficiency: 92,
			status: '완료',
			startDate: '2024-01-15',
			endDate: '2024-01-15',
			worker: '김작업',
		},
		{
			id: 2,
			workOrderNo: 'WO-2024-002',
			itemName: '태블릿 스탠드',
			itemCode: 'TS002',
			planQuantity: 800,
			actualQuantity: 750,
			achievementRate: 94,
			workTime: 6.2,
			efficiency: 88,
			status: '완료',
			startDate: '2024-01-16',
			endDate: '2024-01-16',
			worker: '이생산',
		},
		{
			id: 3,
			workOrderNo: 'WO-2024-003',
			itemName: '무선 충전기',
			itemCode: 'WC003',
			planQuantity: 500,
			actualQuantity: 400,
			achievementRate: 80,
			workTime: 9.1,
			efficiency: 75,
			status: '지연',
			startDate: '2024-01-17',
			endDate: '2024-01-18',
			worker: '박제조',
		},
		{
			id: 4,
			workOrderNo: 'WO-2024-004',
			itemName: '블루투스 이어폰',
			itemCode: 'BE004',
			planQuantity: 1200,
			actualQuantity: 1180,
			achievementRate: 98,
			workTime: 7.8,
			efficiency: 95,
			status: '완료',
			startDate: '2024-01-19',
			endDate: '2024-01-19',
			worker: '최효율',
		},
		{
			id: 5,
			workOrderNo: 'WO-2024-005',
			itemName: '노트북 스탠드',
			itemCode: 'NS005',
			planQuantity: 600,
			actualQuantity: 520,
			achievementRate: 87,
			workTime: 5.5,
			efficiency: 82,
			status: '진행중',
			startDate: '2024-01-20',
			endDate: '',
			worker: '정진행',
		},
	]);

	// 테이블 컬럼 정의
	const commandAnalysisColumns = [
		{
			accessorKey: 'workOrderNo',
			header: () => '작업지시번호',
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as string;
				return (
					<span className="font-mono text-sm text-blue-600">
						{value}
					</span>
				);
			},
		},
		{
			accessorKey: 'itemCode',
			header: () => tDataTable('columns.itemCode'),
		},
		{
			accessorKey: 'itemName',
			header: () => tDataTable('columns.itemName'),
		},
		{
			accessorKey: 'worker',
			header: () => '작업자',
		},
		{
			accessorKey: 'planQuantity',
			header: () => tDataTable('columns.planQuantity'),
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as number;
				return value.toLocaleString();
			},
		},
		{
			accessorKey: 'actualQuantity',
			header: () => tDataTable('columns.actualQuantity'),
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as number;
				return value.toLocaleString();
			},
		},
		{
			accessorKey: 'achievementRate',
			header: () => '달성률',
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as number;
				const color =
					value >= 95
						? 'text-green-600'
						: value >= 85
							? 'text-yellow-600'
							: 'text-red-600';
				return <span className={color}>{value}%</span>;
			},
		},
		{
			accessorKey: 'workTime',
			header: () => '작업시간',
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as number;
				return `${value}시간`;
			},
		},
		{
			accessorKey: 'efficiency',
			header: () => '효율성',
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as number;
				const color =
					value >= 90
						? 'text-green-600'
						: value >= 80
							? 'text-yellow-600'
							: 'text-red-600';
				return <span className={color}>{value}%</span>;
			},
		},
		{
			accessorKey: 'status',
			header: () => tDataTable('columns.status'),
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as string;
				const statusColors: Record<string, string> = {
					완료: 'bg-green-100 text-green-800',
					지연: 'bg-red-100 text-red-800',
					진행중: 'bg-blue-100 text-blue-800',
				};
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}
					>
						{value}
					</span>
				);
			},
		},
		{
			accessorKey: 'startDate',
			header: () => '시작일',
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as string;
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
	];

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		commandAnalysisData,
		commandAnalysisColumns,
		10,
		Math.ceil(commandAnalysisData.length / 10),
		0,
		commandAnalysisData.length
	);

	// KPI 카드 컴포넌트
	const KPICard: React.FC<{
		title: string;
		value: string | number;
		icon: React.ReactNode;
		color: string;
		trend?: 'up' | 'down' | 'neutral';
	}> = ({ title, value, icon, color, trend }) => (
		<div className="bg-white rounded-lg border p-6 shadow-sm">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<p className={`text-2xl font-bold ${color}`}>{value}</p>
				</div>
				<div className={`${color} opacity-80`}>{icon}</div>
			</div>
			{trend && (
				<div className="mt-2 flex items-center">
					{trend === 'up' ? (
						<TrendingUp className="w-4 h-4 text-green-500" />
					) : trend === 'down' ? (
						<TrendingDown className="w-4 h-4 text-red-500" />
					) : null}
					<span className="text-xs text-gray-500 ml-1">
						{trend === 'up'
							? t('production.plan.trend.up')
							: trend === 'down'
								? t('production.plan.trend.down')
								: t('production.plan.trend.neutral')}
					</span>
				</div>
			)}
		</div>
	);

	return (
		<PageTemplate>
			<div className="space-y-6 h-full">
				{/* 작지분석 KPI 대시보드 */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<KPICard
						title="총 작업지시"
						value={kpiData.totalCommands}
						icon={<ClipboardList className="w-8 h-8" />}
						color="text-blue-600"
						trend="neutral"
					/>
					<KPICard
						title="완료된 작업지시"
						value={kpiData.completedCommands}
						icon={<CheckCircle className="w-8 h-8" />}
						color="text-green-600"
						trend="up"
					/>
					<KPICard
						title="평균 효율성"
						value={`${kpiData.averageEfficiency}%`}
						icon={<Target className="w-8 h-8" />}
						color="text-purple-600"
						trend="up"
					/>
					<KPICard
						title="정시 완료율"
						value={`${kpiData.onTimeCompletionRate}%`}
						icon={<Clock className="w-8 h-8" />}
						color="text-orange-600"
						trend="down"
					/>
				</div>

				{/* 작지분석 차트 영역 (추후 구현) */}
				<div className="bg-white rounded-lg border p-6 shadow-sm">
					<h3 className="text-lg font-semibold mb-4">
						작지별 생산성 트렌드 분석
					</h3>
					<div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
						<div className="text-center">
							<BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-2" />
							<p className="text-gray-500">
								작지별 효율성 및 달성률 차트가 여기에 표시됩니다
							</p>
							<p className="text-sm text-gray-400">
								Chart.js 또는 Recharts를 활용한 시각화 예정
							</p>
						</div>
					</div>
				</div>

				{/* 작지분석 상세 데이터 테이블 */}
				<div className="bg-white rounded-lg border shadow-sm">
					<DatatableComponent
						table={table}
						columns={commandAnalysisColumns}
						data={commandAnalysisData}
						tableTitle="작지별 분석 상세 데이터"
						rowCount={commandAnalysisData.length}
						selectedRows={selectedRows}
						toggleRowSelection={toggleRowSelection}
					/>
				</div>
			</div>
		</PageTemplate>
	);
};
