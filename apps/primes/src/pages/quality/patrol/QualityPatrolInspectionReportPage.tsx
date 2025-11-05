// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { useDataTable } from '@radix-ui/hook';
import { EchartComponent } from '@repo/echart/components';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { RadixIconButton } from '@radix-ui/components';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useCheckingHeads } from '@primes/hooks/qms/checkingHead/useCheckingHeads';
import type { CheckingHeadData } from '@primes/types/qms/checkingHead';

// ============================================================================
// TYPES
// ============================================================================
interface InspectionInfo {
	inspectionCode: string;
	inspectionDate: string;
	workOrderNo: string;
	productCode: string;
	productName: string;
	inspectorName: string;
	inspectionType: string;
	status: string;
	inspectionTime: string;
	totalItems: number;
	okItems: number;
	ngItems: number;
	overallResult: 'OK' | 'NG';
	notes: string;
}

interface InspectionMeta {
	inspectionDate: string;
	inspectionTime: string;
	itemNumber: string;
	itemName: string;
	inspectorName: string;
	notes?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const RESULT_COLORS = {
	OK: 'text-green-600 bg-green-50',
	NG: 'text-red-600 bg-red-50',
	DEFAULT: 'text-gray-600 bg-gray-50',
} as const;

const CHART_COLORS = {
	OK: '#22c55e',
	NG: '#ef4444',
} as const;

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const QualityPatrolInspectionReportPage: React.FC = () => {
	// ============================================================================
	// HOOKS
	// ============================================================================
	const { t } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');
	const { reportId: headId } = useParams<{ reportId: string }>();
	const navigate = useNavigate();
	
	// ============================================================================
	// STATE
	// ============================================================================
	const [checkingHead, setCheckingHead] = useState<CheckingHeadData>();
	
	// ============================================================================
	// DATA FETCHING
	// ============================================================================
	const { list: checkingHeads } = useCheckingHeads({
		page: 0,
		size: 1,
		searchRequest: { 
			id: Number(headId),
		},
	});
	
	// ============================================================================
	// EFFECTS
	// ============================================================================
	useEffect(() => {
		if (checkingHeads.data?.content && checkingHeads.data.content.length > 0) {
			setCheckingHead(checkingHeads.data.content[0]);
		}
	}, [checkingHeads.data]);
	
	// ============================================================================
	// COMPUTED VALUES
	// ============================================================================
	const inspectionInfo = useMemo((): InspectionInfo | null => {
		if (!checkingHead) return null;
		
		const meta = checkingHead.meta as unknown as InspectionMeta;
		const totalItems = checkingHead.checkingSamples?.length || 0;
		const okItems = checkingHead.checkingSamples?.filter(item => item.isPass === true).length || 0;
		const ngItems = checkingHead.checkingSamples?.filter(item => item.isPass === false).length || 0;
		const overallResult = ngItems === 0 ? 'OK' : 'NG';

		return {
			inspectionCode: checkingHead.checkingName,
			inspectionDate: meta.inspectionDate,
			inspectionType: checkingHead.inspectionType || t('inspection.type.patrol'),
			workOrderNo: checkingHead.targetCode || 'N/A',
			productCode: meta.itemNumber || 'N/A',
			productName: meta.itemName || 'N/A',
			inspectorName: meta.inspectorName || 'N/A',
			status: checkingHead.isUse ? '완료' : '대기',
			inspectionTime: meta.inspectionTime,
			totalItems,
			okItems,
			ngItems,
			overallResult,
			notes: meta.notes || '',
		};
	}, [checkingHead, t]);

	const inspectionData = useMemo(() => {
		return checkingHead?.checkingSamples || [];
	}, [checkingHead]);

	// ============================================================================
	// UTILITY FUNCTIONS
	// ============================================================================
	const getResultColor = (result: string): string => {
		switch (result) {
			case 'OK': return RESULT_COLORS.OK;
			case 'NG': return RESULT_COLORS.NG;
			default: return RESULT_COLORS.DEFAULT;
		}
	};

	const getResultIcon = (result: string) => {
		switch (result) {
			case 'OK':
				return <CheckCircle size={16} className="text-green-600" />;
			case 'NG':
				return <AlertTriangle size={16} className="text-red-600" />;
			default:
				return <AlertTriangle size={16} className="text-gray-600" />;
		}
	};

	// CHOICE 타입일 때 측정값에 따른 표시값 반환
	const getChoiceDisplayValue = (sample: any) => {
		try {
			const meta = typeof sample.meta === 'string' ? JSON.parse(sample.meta) : sample.meta;
			if (meta?.specType === 'CHOICE') {
				const measuredValue = sample.measuredValue;
				if (measuredValue === 1 && meta.maxValue !== undefined) {
					return meta.maxValue;
				} else if (measuredValue === 0 && meta.minValue !== undefined) {
					return meta.minValue;
				}
			}
			return sample.measuredValue;
		} catch (error) {
			return sample.measuredValue;
		}
	};

	// ============================================================================
	// TABLE CONFIGURATION
	// ============================================================================
	const tableColumns = useMemo(() => [
		{
			id: 'checkingName',
			header: tDataTable('columns.checkingName'),
			accessorKey: 'checkingName',
			size: 150,
		},
		{
			id: 'standard',
			header: tDataTable('columns.standard'),
			accessorKey: 'standard',
			size: 100,
		},
		{
			id: 'standardUnit',
			header: tDataTable('columns.standardUnit'),
			accessorKey: 'standardUnit',
			size: 100,
		},
		{
			id: 'measuredValue',
			header: tDataTable('columns.measuredValue'),
			accessorKey: 'measuredValue',
			size: 100,
			cell: ({ row }: any) => {
				const displayValue = getChoiceDisplayValue(row.original);
				return (
					<div className="text-center">
						{displayValue}
					</div>
				);
			},
		},
		{
			id: 'measureUnit',
			header: tDataTable('columns.measureUnit'),
			accessorKey: 'measureUnit',
			size: 100,
		},
		{
			id: 'isPass',
			header: tDataTable('columns.isPass'),
			accessorKey: 'isPass',
			size: 100,
			cell: ({ row }: any) => {
				const result = row.original.isPass ? 'OK' : 'NG';
				return (
					<div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getResultColor(result)}`}>
						{getResultIcon(result)}
						{result}
					</div>
				);
			},
		},
		{
			id: 'inspectionTime',
			header: tDataTable('columns.inspectionTime'),
			accessorKey: 'inspectionTime',
			size: 100,
			cell: () => (
				<div className="text-center">
					{inspectionInfo?.inspectionTime || 'N/A'}
				</div>
			),
		},
		{
			id: 'notes',
			header: tDataTable('columns.notes'),
			accessorKey: 'notes',
			size: 150,
		},
	], [inspectionInfo, tDataTable]);

	// ============================================================================
	// DATA TABLE HOOK
	// ============================================================================
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		inspectionData,
		tableColumns,
		10,
		1,
		1,
		inspectionData.length
	);
	
	// ============================================================================
	// CHART FUNCTIONS
	// ============================================================================
	const createResultChart = useCallback((data: CheckingHeadData) => {
		const resultCounts = {
			OK: data.checkingSamples?.filter((item) => item.isPass === true).length || 0,
			NG: data.checkingSamples?.filter((item) => item.isPass === false).length || 0,
		};

		const chartData = Object.entries(resultCounts).map(([result, count]) => ({
			name: result === 'OK' ? t('inspection.report.normal') : t('inspection.report.defective'),
			value: count,
			itemStyle: {
				color: result === 'OK' ? CHART_COLORS.OK : CHART_COLORS.NG,
			},
		}));

		return {
			title: {
				text: t('inspection.report.itemSummary'),
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
				data: [t('inspection.report.normal'), t('inspection.report.defective')],
			},
			series: [
				{
					name: t('inspection.report.itemSummary'),
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
	}, [t]);

	// ============================================================================
	// EVENT HANDLERS
	// ============================================================================
	const handleBack = () => {
		navigate('/quality/patrol-inspection/list');
	};

	// ============================================================================
	// RENDER HELPERS
	// ============================================================================
	const renderLoadingState = () => (
		<div className="max-w-full p-4 h-full flex flex-col">
			<h1 className="text-xl font-bold mt-2 mb-3">{t('inspection.report.title')}</h1>
			<div className="flex justify-center items-center h-64">
				<div className="text-gray-500">{t('inspection.report.loading')}</div>
			</div>
		</div>
	);

	const renderBasicInfoSection = () => (
		<div className="bg-white rounded-lg border p-6 mb-6">
			<h2 className="text-xl font-semibold mb-4 text-gray-900">
				{t('inspection.report.basicInfo')}
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* 기본 정보 */}
				<div className="space-y-3">
					<h3 className="font-medium text-gray-700 border-b pb-2">
						{t('inspection.report.basicInfoTitle')}
					</h3>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-gray-600">{t('inspection.report.inspectionCode')}:</span>
							<span className="font-medium text-blue-600">{inspectionInfo!.inspectionCode}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">{t('inspection.report.inspectionDateTime')}:</span>
							<span className="font-medium">
								{inspectionInfo!.inspectionDate} {inspectionInfo!.inspectionTime}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">{t('inspection.report.inspectionType')}:</span>
							<span>{inspectionInfo!.inspectionType}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">{t('inspection.report.inspectorName')}:</span>
							<span>{inspectionInfo!.inspectorName}</span>
						</div>
					</div>
				</div>

				{/* 작업 정보 */}
				<div className="space-y-3">
					<h3 className="font-medium text-gray-700 border-b pb-2">
						{t('inspection.report.workInfoTitle')}
					</h3>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-gray-600">{t('inspection.report.workOrderLot')}:</span>
							<span className="font-medium">{inspectionInfo!.workOrderNo}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">{t('inspection.report.productCode')}:</span>
							<span className="font-medium">{inspectionInfo!.productCode}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">{t('inspection.report.productName')}:</span>
							<span>{inspectionInfo!.productName}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">{t('inspection.report.status')}:</span>
							<span className="text-green-600 font-medium">{inspectionInfo!.status}</span>
						</div>
					</div>
				</div>

				{/* 검사 결과 요약 */}
				<div className="space-y-3">
					<h3 className="font-medium text-gray-700 border-b pb-2">
						{t('inspection.report.resultSummaryTitle')}
					</h3>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-gray-600">{t('inspection.report.totalInspectionItems')}:</span>
							<span className="font-medium">
								{inspectionInfo!.totalItems}{t('inspection.report.items')}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">{t('inspection.report.normal')}:</span>
							<span className="text-green-600 font-medium">
								{inspectionInfo!.okItems}{t('inspection.report.items')}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">{t('inspection.report.defective')}:</span>
							<span className="text-red-600 font-medium">
								{inspectionInfo!.ngItems}{t('inspection.report.items')}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">{t('inspection.report.overallResult')}:</span>
							<span className={`font-medium ${inspectionInfo!.overallResult === 'OK' ? 'text-green-600' : 'text-red-600'}`}>
								{inspectionInfo!.overallResult}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderDetailedStatusSection = () => (
		<div className="bg-white rounded-lg border p-6">
			<h2 className="text-xl font-semibold mb-4 text-gray-900">
				{t('inspection.report.detailedStatus')}
			</h2>
			
			{/* 카테고리 요약 및 차트 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* 왼쪽 영역: 검사항목 요약 */}
				<div className="grid grid-cols-1 gap-6">
					{/* 검사항목 요약 */}
					<div className="bg-white rounded-lg border p-6">
						<h3 className="text-lg font-semibold mb-4">{t('inspection.report.itemSummary')}</h3>
						<div className="grid grid-cols-2 gap-4 text-center">
							<div className="flex flex-col">
								<span className="text-green-600 font-bold text-2xl">{inspectionInfo!.okItems}</span>
								<span className="text-gray-600 text-sm">{t('inspection.report.normal')}</span>
							</div>
							<div className="flex flex-col">
								<span className="text-red-600 font-bold text-2xl">{inspectionInfo!.ngItems}</span>
								<span className="text-gray-600 text-sm">{t('inspection.report.defective')}</span>
							</div>
						</div>
					</div>

					{/* 검사 결과 분포 차트 - 주석 처리된 상태로 유지 */}
					{/* <div className="bg-white rounded-lg border p-6">
						<h3 className="text-lg font-semibold mb-4">검사 결과 분포</h3>
						<div className="h-64">
							<EchartComponent
								options={createResultChart(checkingHead!)}
								styles={{ width: '100%', height: '250px' }}
							/>
						</div>
					</div> */}
				</div>

				{/* 검사 비고 */}
				<div className="bg-white rounded-lg border p-6">
					<h3 className="text-lg font-semibold mb-4">{t('inspection.report.inspectionNotes')}</h3>
					{inspectionInfo!.notes ? (
						<div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md min-h-[120px]">
							{inspectionInfo!.notes}
						</div>
					) : (
						<div className="text-sm text-gray-400 bg-gray-50 p-3 rounded-md min-h-[120px] flex items-center justify-center">
							{t('inspection.report.noNotes')}
						</div>
					)}
				</div>
			</div>

			{/* 상세 데이터 테이블 */}
			<div className="max-h-96 overflow-auto">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={inspectionData}
					tableTitle={t('inspection.report.detailedData')}
					rowCount={inspectionData.length}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					classNames={{
						container: 'border rounded-lg',
					}}
				/>
			</div>
		</div>
	);

	// ============================================================================
	// MAIN RENDER
	// ============================================================================
	if (!inspectionInfo || !checkingHead) {
		return renderLoadingState();
	}

	return (
		<div className="max-w-full p-4 h-full flex flex-col">
			<h1 className="text-xl font-bold mt-2 mb-3">{t('inspection.report.title')}</h1>

			<div className="flex justify-between items-center gap-2 mb-6">
				<RadixIconButton
					className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
					onClick={handleBack}
				>
					<ArrowLeft size={16} className="text-muted-foreground" />
					{t('tabs.actions.back')}
				</RadixIconButton>
			</div>

			{renderBasicInfoSection()}
			{renderDetailedStatusSection()}
		</div>
	);
};

export default QualityPatrolInspectionReportPage;
