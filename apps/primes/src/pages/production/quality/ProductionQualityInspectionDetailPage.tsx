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
	FileText,
} from 'lucide-react';
import { RadixIconButton } from '@radix-ui/components';

// 검사 기본 정보 타입
interface InspectionInfo {
	inspectionCode: string;
	inspectionDate: string;
	workOrderNo: string;
	productCode: string;
	productName: string;
	lotNumber: string;
	inspectorName: string;
	inspectionType: string;
	status: string;
	startTime: string;
	endTime?: string;
	totalItems: number;
	okItems: number;
	ngItems: number;
	warningItems: number;
	overallResult: 'OK' | 'NG' | 'WARNING';
}

// 검사 항목별 세부 데이터 타입
interface InspectionDetailData {
	id: number;
	itemCode: string;
	itemName: string;
	category: string; // 치수, 외관, 기능
	standardValue: number | string;
	measuredValue: number | string;
	tolerance: string;
	unit: string;
	result: 'OK' | 'NG' | 'WARNING';
	inspectionTime: string;
	notes?: string;
	imageUrl?: string; // 검사 이미지
}

const ProductionQualityInspectionDetailPage: React.FC = () => {
	const { t } = useTranslation('common');
	const { inspectionId } = useParams<{ inspectionId: string }>();
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState<string>('dimension');

	// 임시 검사 정보 데이터
	const [inspectionInfo] = useState<InspectionInfo>({
		inspectionCode: `QI-2024-${inspectionId?.padStart(3, '0')}`,
		inspectionDate: '2024-01-25',
		workOrderNo: 'WO-240125-001',
		productCode: 'PROD-001',
		productName: '스마트폰 케이스',
		lotNumber: 'LOT-240125-001',
		inspectorName: '김검사',
		inspectionType: '자주검사',
		status: '완료',
		startTime: '09:00',
		endTime: '11:30',
		totalItems: 15,
		okItems: 12,
		ngItems: 1,
		warningItems: 2,
		overallResult: 'WARNING',
	});

	// 임시 검사 세부 데이터 (카테고리별)
	const [dimensionData] = useState<InspectionDetailData[]>([
		{
			id: 1,
			itemCode: 'DIM-001',
			itemName: '전체 길이',
			category: '치수',
			standardValue: 150.0,
			measuredValue: 149.8,
			tolerance: '±0.5',
			unit: 'mm',
			result: 'OK',
			inspectionTime: '09:15',
			notes: '정상 범위',
		},
		{
			id: 2,
			itemCode: 'DIM-002',
			itemName: '내부 너비',
			category: '치수',
			standardValue: 80.0,
			measuredValue: 80.3,
			tolerance: '±0.3',
			unit: 'mm',
			result: 'WARNING',
			inspectionTime: '09:25',
			notes: '허용 상한선 근접',
		},
		{
			id: 3,
			itemCode: 'DIM-003',
			itemName: '두께',
			category: '치수',
			standardValue: 2.5,
			measuredValue: 2.6,
			tolerance: '±0.1',
			unit: 'mm',
			result: 'NG',
			inspectionTime: '09:35',
			notes: '기준치 초과, 조정 필요',
		},
	]);

	const [appearanceData] = useState<InspectionDetailData[]>([
		{
			id: 4,
			itemCode: 'APP-001',
			itemName: '표면 거칠기',
			category: '외관',
			standardValue: '≤1.0',
			measuredValue: 0.7,
			tolerance: '≤1.0',
			unit: 'μm',
			result: 'OK',
			inspectionTime: '09:45',
			notes: '양호',
		},
		{
			id: 5,
			itemCode: 'APP-002',
			itemName: '색상 균일도',
			category: '외관',
			standardValue: '≥90%',
			measuredValue: 93,
			tolerance: '≥90%',
			unit: '%',
			result: 'OK',
			inspectionTime: '09:55',
			notes: '허용 범위',
		},
	]);

	const [functionalData] = useState<InspectionDetailData[]>([
		{
			id: 6,
			itemCode: 'FUNC-001',
			itemName: '조립 공차',
			category: '기능',
			standardValue: '±0.05',
			measuredValue: 0.03,
			tolerance: '±0.05',
			unit: 'mm',
			result: 'OK',
			inspectionTime: '10:05',
			notes: '정상 작동',
		},
		{
			id: 7,
			itemCode: 'FUNC-002',
			itemName: '내구성 테스트',
			category: '기능',
			standardValue: '≥1000회',
			measuredValue: 1200,
			tolerance: '≥1000회',
			unit: '회',
			result: 'OK',
			inspectionTime: '10:15',
			notes: '기준 통과',
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
	const createTableColumns = (data: InspectionDetailData[]) => [
		{
			id: 'itemCode',
			header: '검사항목코드',
			accessorKey: 'itemCode',
			size: 120,
		},
		{
			id: 'itemName',
			header: '검사항목명',
			accessorKey: 'itemName',
			size: 150,
		},
		{
			id: 'standardValue',
			header: '기준값',
			accessorKey: 'standardValue',
			size: 100,
		},
		{
			id: 'measuredValue',
			header: '측정값',
			accessorKey: 'measuredValue',
			size: 100,
		},
		{
			id: 'tolerance',
			header: '허용차',
			accessorKey: 'tolerance',
			size: 100,
		},
		{
			id: 'unit',
			header: '단위',
			accessorKey: 'unit',
			size: 60,
		},
		{
			id: 'result',
			header: '결과',
			accessorKey: 'result',
			size: 100,
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
			id: 'inspectionTime',
			header: '검사시간',
			accessorKey: 'inspectionTime',
			size: 100,
		},
		{
			id: 'notes',
			header: '비고',
			accessorKey: 'notes',
			size: 150,
		},
	];

	// 각 탭별 데이터 테이블 컴포넌트
	const createDataTable = (
		data: InspectionDetailData[],
		title: string,
		category: string
	) => {
		const tableColumns = createTableColumns(data);
		const { table, selectedRows, toggleRowSelection } = useDataTable(
			data,
			tableColumns,
			10,
			1,
			1,
			data.length
		);

		// 카테고리별 결과 분포 차트
		const createResultChart = (data: InspectionDetailData[]) => {
			const resultCounts = data.reduce(
				(acc, item) => {
					acc[item.result] = (acc[item.result] || 0) + 1;
					return acc;
				},
				{} as Record<string, number>
			);

			const chartData = Object.entries(resultCounts).map(
				([result, count]) => ({
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
				})
			);

			return {
				title: {
					text: `${title} 결과 분포`,
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

		return (
			<div className="space-y-6 h-full">
				{/* 카테고리 요약 및 차트 */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* 요약 정보 */}
					<div className="bg-white rounded-lg border p-6">
						<h3 className="text-lg font-semibold mb-4">
							{title} 요약
						</h3>
						<div className="grid grid-cols-3 gap-4 text-center">
							<div className="flex flex-col">
								<span className="text-green-600 font-bold text-2xl">
									{
										data.filter(
											(item) => item.result === 'OK'
										).length
									}
								</span>
								<span className="text-gray-600 text-sm">
									정상
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-yellow-600 font-bold text-2xl">
									{
										data.filter(
											(item) => item.result === 'WARNING'
										).length
									}
								</span>
								<span className="text-gray-600 text-sm">
									주의
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-red-600 font-bold text-2xl">
									{
										data.filter(
											(item) => item.result === 'NG'
										).length
									}
								</span>
								<span className="text-gray-600 text-sm">
									불량
								</span>
							</div>
						</div>
					</div>

					{/* 결과 분포 차트 */}
					<div className="bg-white rounded-lg border p-6">
						<div className="h-64">
							<EchartComponent
								options={createResultChart(data)}
								styles={{ width: '100%', height: '250px' }}
							/>
						</div>
					</div>
				</div>

				{/* 상세 데이터 테이블 */}
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
			content: createDataTable(dimensionData, '치수검사', 'dimension'),
		},
		{
			id: 'appearance',
			icon: <Eye size={16} />,
			label: '외관검사',
			to: '',
			content: createDataTable(appearanceData, '외관검사', 'appearance'),
		},
		{
			id: 'functional',
			icon: <Wrench size={16} />,
			label: '기능검사',
			to: '',
			content: createDataTable(functionalData, '기능검사', 'functional'),
		},
	];

	const handleBack = () => {
		navigate('/production/quality/inspection');
	};

	return (
		<div className="max-w-full mx-auto p-4 h-full flex flex-col">
			<h1 className="text-xl font-bold mt-2 mb-3">자주검사 상세현황</h1>

			<div className="flex justify-between items-center gap-2 mb-6">
				<RadixIconButton
					className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
					onClick={handleBack}
				>
					<ArrowLeft size={16} className="text-muted-foreground" />
					{t('tabs.actions.back')}
				</RadixIconButton>
			</div>

			{/* 검사 기본 정보 섹션 */}
			<div className="bg-white rounded-lg border p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4 text-gray-900">
					검사 기본 정보
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* 기본 정보 */}
					<div className="space-y-3">
						<h3 className="font-medium text-gray-700 border-b pb-2">
							기본 정보
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">검사코드:</span>
								<span className="font-medium text-blue-600">
									{inspectionInfo.inspectionCode}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">검사일자:</span>
								<span className="font-medium">
									{inspectionInfo.inspectionDate}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">검사유형:</span>
								<span>{inspectionInfo.inspectionType}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">검사자:</span>
								<span>{inspectionInfo.inspectorName}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">상태:</span>
								<span className="text-green-600 font-medium">
									{inspectionInfo.status}
								</span>
							</div>
						</div>
					</div>

					{/* 작업 정보 */}
					<div className="space-y-3">
						<h3 className="font-medium text-gray-700 border-b pb-2">
							작업 정보
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">
									작업지시번호:
								</span>
								<span className="font-medium">
									{inspectionInfo.workOrderNo}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">제품코드:</span>
								<span className="font-medium">
									{inspectionInfo.productCode}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">제품명:</span>
								<span>{inspectionInfo.productName}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">로트번호:</span>
								<span>{inspectionInfo.lotNumber}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">검사시간:</span>
								<span>
									{inspectionInfo.startTime} -{' '}
									{inspectionInfo.endTime}
								</span>
							</div>
						</div>
					</div>

					{/* 검사 결과 요약 */}
					<div className="space-y-3">
						<h3 className="font-medium text-gray-700 border-b pb-2">
							검사 결과 요약
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">
									총 검사항목:
								</span>
								<span className="font-medium">
									{inspectionInfo.totalItems}개
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">정상:</span>
								<span className="text-green-600 font-medium">
									{inspectionInfo.okItems}개
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">주의:</span>
								<span className="text-yellow-600 font-medium">
									{inspectionInfo.warningItems}개
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">불량:</span>
								<span className="text-red-600 font-medium">
									{inspectionInfo.ngItems}개
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">종합결과:</span>
								<span
									className={`font-medium ${
										inspectionInfo.overallResult === 'OK'
											? 'text-green-600'
											: inspectionInfo.overallResult ===
												  'WARNING'
												? 'text-yellow-600'
												: 'text-red-600'
									}`}
								>
									{inspectionInfo.overallResult}
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

export default ProductionQualityInspectionDetailPage;
