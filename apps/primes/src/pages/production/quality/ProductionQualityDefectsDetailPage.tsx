import React, { useState, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { EchartComponent } from '@repo/echart/components';
import { DraggableDialog, RadixButton, RadixIconButton } from '@radix-ui/components';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import {
	ArrowLeft,
	AlertTriangle,
	User,
	Calendar,
	Clock,
} from 'lucide-react';
import { 
	DefectSeverity,
	DefectStatus,
	mapDefectRecordDtoToDefectRecord,
	DefectActionDto,
	DefectRecordSearchRequest
} from '@primes/types/production/defectTypes';
import { useDefectRecords, } from '@primes/hooks/production/defectRecord/useDefectRecord';
import { useDefectActions } from '@primes/hooks/production/defectAction/useDefectAction';
import ProductionQualityDefectActionsRegisterModal from './ProductionQualityDefectActionsRegisterPage';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';

// 불량 상세 정보 타입 (기존 페이지 호환성을 위해 확장)
interface DefectDetailInfo {
	id: number;
	defectCode: string;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	defectType: string;
	defectTypeCode?: string;
	defectReason: string;
	defectReasonCode?: string;
	defectDescription: string;
	reportDate: string;
	reportedBy: string;
	severity: DefectSeverity;
	status: DefectStatus;
	assignedTo?: string;
	dueDate?: string;
	actionPlanDescription?: string;
	rootCause?: string;
	preventiveActions?: string;
	relatedLotNumbers?: string[];
	affectedQuantity?: number;
	estimatedCost?: number;
	expectedLossCurrency?: string;
}

const ProductionQualityDefectsDetailPage: React.FC = () => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const { defectId } = useParams<{ defectId: string }>();

	// 불량 ID 파싱
	const defectRecordId = parseInt(defectId || '0');

	// API 호출 - 특정 불량 레코드 조회를 위한 검색 조건
	const [defectRecordSearchRequest] = useState<DefectRecordSearchRequest>({
		id: defectRecordId
	});

	const { 
		list: defectRecordListResponse, 
	} = useDefectRecords({ searchRequest: defectRecordSearchRequest });

	// 불량 처리 이력 관련 hooks
	const [defectActionSearchRequest] = useState({
		defectRecordId: defectRecordId
	});

	const { 
		list: defectActionsData,
		create: createDefectAction,
		update: updateDefectAction,
		remove: removeDefectAction
	} = useDefectActions({ searchRequest: defectActionSearchRequest });

	// 모달 상태 관리
	const [isActionModalOpen, setIsActionModalOpen] = useState(false);
	const [editingAction, setEditingAction] = useState<any>(null);
	const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
	const [deletingAction, setDeletingAction] = useState<DefectActionDto | null>(null);



	// 불량 상세 정보 변환
	const defectInfo: DefectDetailInfo | null = useMemo(() => {
		// 목록에서 첫 번째 항목을 가져옴 (ID로 검색했으므로 하나만 있을 것)
		const defectRecord = defectRecordListResponse?.data?.data?.content?.[0];
		if (!defectRecord) return null;
		
		const record = mapDefectRecordDtoToDefectRecord(defectRecord);
		return {
			...record,
			rootCause: record.actionPlanDescription || '조사 중', // API 데이터 사용
			preventiveActions: '예방 조치 계획 수립 중',
			relatedLotNumbers: ['LOT-' + record.reportDate?.replace(/-/g, '') + '-001'],
			affectedQuantity: 1, // 기본값
			estimatedCost: 0, // 기본값
		};
	}, [defectRecordListResponse]);

	// 불량 추이 차트 생성
	const createDefectTrendChart = () => {
		// 임시로 기본 데이터 사용 (추후 추이 데이터 API 연결 시 수정)
		const dates = ['01-15', '01-16', '01-17', '01-18', '01-19'];
		const defectCounts = [2, 1, 3, 2, 5];

		return {
			tooltip: {
				trigger: 'axis' as const,
				formatter: (params: any) => {
					const date = params[0].axisValue;
					const count = params[0].value;
					return `<strong>${date}</strong><br/>불량 건수: ${count}건`;
				},
			},
			xAxis: {
				type: 'category' as const,
				data: dates,
			},
			yAxis: {
				type: 'value' as const,
				axisLabel: {
					formatter: '{value}건',
				},
			},
			series: [
				{
					name: '일별 불량 건수',
					type: 'line',
					data: defectCounts,
					smooth: true,
					lineStyle: {
						color: '#EF4444',
						width: 3,
					},
					itemStyle: {
						color: '#EF4444',
					},
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: 'rgba(239, 68, 68, 0.3)',
								},
								{
									offset: 1,
									color: 'rgba(239, 68, 68, 0.1)',
								},
							],
						},
					},
				},
			],
		};
	};
//'TEMPORARY','ROOT_CAUSE','PREVENTIVE','CORRECTIVE'
	// 테이블 컬럼 정의
	const defectActionColumns = [
		{
			accessorKey: 'actionDate',
			header: '처리 일시',
			size: 120,
		},
		{
			accessorKey: 'actionBy',
			header: '처리 담당자',
			size: 100,
		},
		{
			accessorKey: 'actionType',
			header: '처리 유형',
			size: 100,
			cell: ({ row }: any) => {
				const actionType = row.original.actionType;
				const typeLabels: { [key: string]: string } = {
					TEMPORARY: '임시조치',
					ROOT_CAUSE: '근본조치',
					PREVENTIVE: '예방조치',
					CORRECTIVE: '시정조치',
				};
				const typeColors: { [key: string]: string } = {
					TEMPORARY: 'bg-yellow-100 text-yellow-800',
					ROOT_CAUSE: 'bg-red-100 text-red-800',
					PREVENTIVE: 'bg-green-100 text-green-800',
					CORRECTIVE: 'bg-blue-100 text-blue-800',
				};
				return actionType ? (
					<span className={`px-2 py-1 rounded-full text-xs ${typeColors[actionType] || 'bg-gray-100 text-gray-800'}`}>
						{typeLabels[actionType] || actionType}
					</span>
				) : '-';
			},
		},
		{
			accessorKey: 'actionTaken',
			header: '작업 내용',
			size: 200,
		},

		{
			accessorKey: 'workingHours',
			header: '소요시간',
			size: 80,
			cell: ({ row }: any) => {
				const hours = row.original.workingHours;
				return hours ? hours : '-';
			},
		},
	];

	// 불량 이력 데이터 처리 (API에서 가져온 데이터 사용)
	const defectActionData: DefectActionDto[] = useMemo(() => {
		if (!defectActionsData?.data?.data?.content) return [];
		
		return defectActionsData.data.data.content.map((action: any) => ({
			id: action.id,
			tenantId: action.tenantId || 0,
			isDelete: action.isDelete || false,
			defectRecordId: action.defectRecordId || defectRecordId,
			actionDate: action.actionDate,
			actionTaken: action.actionTaken,
			actionBy: action.actionBy || action.createdBy,
			actionType: action.actionType,
			workingHours: action.workingHours,
			createdBy: action.createdBy || action.actionBy || 'system',
			createdAt: action.createdAt || new Date().toISOString(),
			updatedBy: action.updatedBy || action.createdBy || 'system',
			updatedAt: action.updatedAt || action.createdAt || new Date().toISOString(),
		}));
	}, [defectActionsData, defectRecordId]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		defectActionData,
		defectActionColumns,
		10,
		1,
		0,
		defectActionData.length,
		() => {}
	);

	// 심각도 색상 매핑
	const getSeverityColor = (severity: string) => {
		const colorMap: { [key: string]: string } = {
			HIGH: 'text-red-600 bg-red-50',
			MEDIUM: 'text-yellow-600 bg-yellow-50',
			LOW: 'text-green-600 bg-green-50',
		};
		return colorMap[severity] || 'text-gray-600 bg-gray-50';
	};

	const getSeverityLabel = (severity: string) => {
		const labelMap: { [key: string]: string } = {
			HIGH: '높음',
			MEDIUM: '중간',
			LOW: '낮음',
		};
		return labelMap[severity] || severity;
	};

	// 상태 색상 매핑
	const getStatusColor = (status: string) => {
		const colorMap: { [key: string]: string } = {
			OPEN: 'text-red-600 bg-red-50',
			INVESTIGATING: 'text-yellow-600 bg-yellow-50',
			RESOLVED: 'text-blue-600 bg-blue-50',
			CLOSED: 'text-green-600 bg-green-50',
		};
		return colorMap[status] || 'text-gray-600 bg-gray-50';
	};

	const getStatusLabel = (status: string) => {
		const labelMap: { [key: string]: string } = {
			OPEN: '신규',
			INVESTIGATING: '조사중',
			RESOLVED: '해결됨',
			CLOSED: '종료',
		};
		return labelMap[status] || status;
	};

	// 불량 처리 이력 관련 함수들
	const handleAddAction = () => {
		setEditingAction(null);
		setIsActionModalOpen(true);
	};

	const handleEditAction = () => {
		const selectedRowIds = Array.from(selectedRows);
		if (selectedRowIds.length > 0) {
			// 선택된 행의 인덱스를 사용하여 실제 데이터 찾기
			const selectedIndex = parseInt(selectedRowIds[0]);
			const selectedAction = defectActionData[selectedIndex];
			
			if (selectedAction) {
				setEditingAction(selectedAction);
				setIsActionModalOpen(true);
			}
		}
	};

	const handleDeleteAction = () => {
		const selectedRowIds = Array.from(selectedRows);
		if (selectedRowIds.length > 0) {
			// 선택된 행의 인덱스를 사용하여 실제 데이터 찾기
			const selectedIndex = parseInt(selectedRowIds[0]);
			const selectedAction = defectActionData[selectedIndex];
			
			if (selectedAction) {
				setDeletingAction(selectedAction);
				setOpenDeleteConfirm(true);
			}
		}
	};

	const handleDeleteConfirm = () => {
		if (deletingAction) {
			removeDefectAction.mutate([deletingAction.id]);
			setDeletingAction(null);
			setOpenDeleteConfirm(false);
		}
	};

	const handleCloseModal = () => {
		setIsActionModalOpen(false);
		setEditingAction(null);
	};

	// 로딩 상태 처리
	if (defectRecordListResponse?.isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="text-lg">불량 정보를 불러오는 중...</div>
			</div>
		);
	}

	// 에러 상태 처리
	if (defectRecordListResponse?.error || !defectInfo) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="text-lg text-red-600">
					불량 정보를 불러올 수 없습니다. {defectRecordListResponse?.error?.message}
				</div>
			</div>
		);
	}

	return (
		<>
			<DeleteConfirmDialog
				isOpen={openDeleteConfirm}
				onOpenChange={setOpenDeleteConfirm}
				onConfirm={handleDeleteConfirm}
				title="불량 처리 이력 삭제"
				description={`"${deletingAction?.actionTaken}" 처리 이력을 삭제하시겠습니까?`}
			/>

			<div className="max-w-full mx-auto p-4 h-full flex flex-col">
				<div className="flex justify-between items-center gap-2 mb-3">
				<RadixButton
					className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
					onClick={() => navigate(-1)}
				>
					<ArrowLeft size={16} className="text-muted-foreground" />
					{t('tabs.actions.back')}
				</RadixButton>

				{/* <div className="flex gap-2">
					<RadixIconButton
						className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
						onClick={() =>
							navigate(
								`/production/defects/status/${defectId}/edit`
							)
						}
					>
						<Edit size={16} />
						불량 처리 이력 등록
					</RadixIconButton>
				</div> */}
			</div>

			{/* 불량 기본 정보 */}
			<div className="bg-white rounded-lg border p-6 mb-6">
				<h2 className="text-lg font-semibold mb-4 flex items-center">
					<AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
					불량 기본 정보
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							불량 코드
						</h3>
						<p className="text-lg font-semibold text-gray-900">
							{defectInfo.defectCode}
						</p>
					</div>
					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							제품 정보
						</h3>
						<p className="text-sm text-gray-700">
							{defectInfo.itemNumber}
						</p>
						<p className="text-base font-medium text-gray-900">
							{defectInfo.itemName}
						</p>
					</div>
					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							불량 유형
						</h3>
						<span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
							{defectInfo.defectType}
						</span>
					</div>
					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							심각도
						</h3>
						<span
							className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(defectInfo.severity)}`}
						>
							{getSeverityLabel(defectInfo.severity)}
						</span>
					</div>
					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							상태
						</h3>
						<span
							className={`px-3 py-1 rounded-full text-sm ${getStatusColor(defectInfo.status)}`}
						>
							{getStatusLabel(defectInfo.status)}
						</span>
					</div>
					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							신고일
						</h3>
						<p className="text-base text-gray-900 flex items-center">
							<Calendar className="mr-1 h-4 w-4 text-gray-500" />
							{defectInfo.reportDate}
						</p>
					</div>
					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							신고자
						</h3>
						<p className="text-base text-gray-900 flex items-center">
							<User className="mr-1 h-4 w-4 text-gray-500" />
							{defectInfo.reportedBy}
						</p>
					</div>
					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							담당자
						</h3>
						<p className="text-base text-gray-900 flex items-center">
							<User className="mr-1 h-4 w-4 text-gray-500" />
							{defectInfo.assignedTo}
						</p>
					</div>
					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							완료예정일
						</h3>
						<p className="text-base text-gray-900 flex items-center">
							<Clock className="mr-1 h-4 w-4 text-gray-500" />
							{defectInfo.dueDate}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
					{/* <div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							관련 로트
						</h3>
						<div className="space-y-1">
							{defectInfo.relatedLotNumbers?.map((lot, index) => (
								<span
									key={index}
									className="block text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded"
								>
									{lot}
								</span>
							))}
						</div>
					</div> */}
					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							영향 수량
						</h3>
						<p className="text-lg font-semibold text-red-600">
							{defectInfo.affectedQuantity?.toLocaleString()}개
						</p>
					</div>
					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							예상 손실
						</h3>
						<p className="text-lg font-semibold text-red-600">
							{defectInfo.expectedLossCurrency}{defectInfo.estimatedCost?.toLocaleString()}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							불량 상세 설명
						</h3>
						<p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg min-h-12">
							{defectInfo.defectDescription}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							근본 원인
						</h3>
						<p className="text-base text-gray-900 bg-orange-50 p-3 rounded-lg min-h-12">
							{defectInfo.rootCause}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-600 mb-2">
							조치 내용
						</h3>
						<p className="text-base text-gray-900 bg-green-50 p-3 rounded-lg min-h-12">
							{defectInfo.actionPlanDescription}
						</p>
					</div>
				</div>

				
			</div>

			{/* 불량 추이 차트 */}
			{/* <div className="bg-white rounded-lg border p-6 mb-6">
				<h2 className="text-lg font-semibold mb-4">
					최근 불량 발생 추이 (해당 제품)
				</h2>
				<EchartComponent
					options={createDefectTrendChart()}
					height="300px"
				/>
			</div> */}

			{/* 불량 처리 이력 */}
			<div className="bg-white rounded-lg border">
				<DatatableComponent
					table={table}
					tableTitle="불량 처리 이력"
					columns={defectActionColumns}
					data={defectActionData}
					rowCount={defectActionData.length}
					selectedRows={selectedRows}
					enableSingleSelect={true}
					toggleRowSelection={toggleRowSelection}
					useSearch={false}
					usePageNation={false}
					useSummary={false}
					searchSlot={
						<SearchSlotComponent
							endSlot={
								<ActionButtonsComponent
									useEdit={true}
									useRemove={true}
									useCreate={true}
									create={handleAddAction}
									edit={handleEditAction}
									remove={handleDeleteAction}
									visibleText={false}
								/>
							}
						/>
					}
				/>
			</div>

				{/* 불량 처리 이력 추가/수정 모달 */}
				<DraggableDialog
					open={isActionModalOpen}
					onOpenChange={setIsActionModalOpen}
					title={editingAction ? '불량 처리 이력 수정' : '불량 처리 이력 추가'}
					content={
						<ProductionQualityDefectActionsRegisterModal
							isOpen={isActionModalOpen}
							onClose={handleCloseModal}
							defectRecordId={defectRecordId}
							editingAction={editingAction}
							status={defectInfo.status as DefectStatus}
						/>
					}
				/>
			</div>
		</>
	);
};

export default ProductionQualityDefectsDetailPage;
