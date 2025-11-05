import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTemplate from '@primes/templates/PageTemplate';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { EchartComponent } from '@repo/echart/components';
import { RadixIconButton, RadixButton } from '@repo/radix-ui/components';
import { ArrowLeft, FileCheck2, RotateCwSquare } from 'lucide-react';
import { toast } from 'sonner';
import FormComponent from '@primes/components/form/FormComponent';
import type { UseFormReturn } from 'react-hook-form';
import { RotateCw, Check } from 'lucide-react';
import Tooltip from '@primes/components/common/Tooltip';

interface CertificateMasterForm {
	templateId: string;
	language: 'ko' | 'en';
	format: 'PDF' | 'HTML';
	startDate: string;
	endDate: string;
	targetType: 'equipment' | 'product' | 'order' | 'lot';
	targetCode: string;
	issuer: string;
	department: string;
	includeCharts: boolean;
	notes?: string;
}

interface InspectionRecord {
	id: number;
	inspectionDate: string;
	inspectionType:
		| 'patrol'
		| 'self'
		| 'outgoing'
		| 'final'
		| 'periodic'
		| 'precision'
		| 'equipmentDaily';
	equipmentCode: string;
	result: 'pass' | 'fail' | 'conditional';
	score: number;
	defectsFound: number;
}

const QualityCertificateGeneratePage: React.FC = () => {
	const navigate = useNavigate();

	const [masterData, setMasterData] = useState<CertificateMasterForm>({
		templateId: 'default',
		language: 'ko',
		format: 'PDF',
		startDate: new Date().toISOString().split('T')[0],
		endDate: new Date().toISOString().split('T')[0],
		targetType: 'equipment',
		targetCode: '',
		issuer: '',
		department: '',
		includeCharts: true,
	});

	// 검사내역(목업) & 선택상태
	const [inspectionRecords, setInspectionRecords] = useState<
		InspectionRecord[]
	>([]);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);

	const computeStatsFrom = (records: InspectionRecord[]) => {
		const total = records.length;
		if (total === 0)
			return {
				totalInspections: 0,
				passRate: 0,
				failCount: 0,
				warningCount: 0,
			};
		const failCount = records.filter((r) => r.result === 'fail').length;
		const warningCount = records.filter(
			(r) => r.result === 'conditional'
		).length;
		const passCount = records.filter((r) => r.result === 'pass').length;
		const passRate = Math.round((passCount / total) * 100 * 10) / 10;
		return { totalInspections: total, passRate, failCount, warningCount };
	};

	const selectedRecords = useMemo(
		() =>
			selectedIds.length > 0
				? inspectionRecords.filter((r) => selectedIds.includes(r.id))
				: inspectionRecords,
		[inspectionRecords, selectedIds]
	);

	const previewStats = computeStatsFrom(selectedRecords);

	const createPreviewChart = () => {
		return {
			tooltip: { trigger: 'item' as const },
			series: [
				{
					name: '결과 분포',
					type: 'pie',
					radius: ['40%', '70%'],
					avoidLabelOverlap: false,
					label: { show: false, position: 'center' as const },
					emphasis: {
						label: { show: true, fontSize: 14, fontWeight: 'bold' },
					},
					labelLine: { show: false },
					data: [
						{
							value: Math.round(
								(previewStats.passRate / 100) *
									previewStats.totalInspections
							),
							name: '합격',
						},
						{ value: previewStats.warningCount, name: '경고' },
						{ value: previewStats.failCount, name: '불합격' },
					],
				},
			],
		};
	};

	const handleLoadInspections = () => {
		// API 연동 전 목업: 검사유형/기간 기준으로 6건 생성
		const baseType = masterData.targetType; // 대상 유형과 무관, 예제용
		const type: InspectionRecord['inspectionType'] = 'periodic';
		const mock: InspectionRecord[] = [
			{
				id: 1,
				inspectionDate: masterData.startDate,
				inspectionType: type,
				equipmentCode: 'EQP-1001',
				result: 'pass',
				score: 96,
				defectsFound: 0,
			},
			{
				id: 2,
				inspectionDate: masterData.startDate,
				inspectionType: type,
				equipmentCode: 'EQP-1002',
				result: 'conditional',
				score: 84,
				defectsFound: 1,
			},
			{
				id: 3,
				inspectionDate: masterData.endDate,
				inspectionType: type,
				equipmentCode: 'EQP-1003',
				result: 'pass',
				score: 91,
				defectsFound: 0,
			},
			{
				id: 4,
				inspectionDate: masterData.endDate,
				inspectionType: type,
				equipmentCode: 'EQP-1004',
				result: 'fail',
				score: 72,
				defectsFound: 3,
			},
			{
				id: 5,
				inspectionDate: masterData.endDate,
				inspectionType: type,
				equipmentCode: 'EQP-1005',
				result: 'pass',
				score: 95,
				defectsFound: 0,
			},
			{
				id: 6,
				inspectionDate: masterData.endDate,
				inspectionType: type,
				equipmentCode: 'EQP-1006',
				result: 'pass',
				score: 90,
				defectsFound: 0,
			},
		];
		setInspectionRecords(mock);
		setSelectedIds([]);
		toast.success('검사내역을 불러왔습니다.');
	};

	const toggleSelect = (id: number) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	};

	const masterFormFields = [
		{
			name: 'templateId',
			label: '템플릿',
			type: 'select',
			required: true,
			options: [
				{ label: '기본 템플릿', value: 'default' },
				{ label: '영문 템플릿', value: 'en-default' },
			],
		},
		{
			name: 'inspectionType',
			label: '검사유형',
			type: 'select',
			required: true,
			options: [
				{ label: '순회검사', value: 'patrol' },
				{ label: '자주검사', value: 'self' },
				{ label: '출하검사', value: 'outgoing' },
				{ label: '최종검사', value: 'final' },
				{ label: '정기검사', value: 'periodic' },
				{ label: '정밀검사', value: 'precision' },
				{ label: '설비일상점검', value: 'equipmentDaily' },
			],
		},
		{
			name: 'language',
			label: '언어',
			type: 'select',
			required: true,
			options: [
				{ label: '한국어', value: 'ko' },
				{ label: 'English', value: 'en' },
			],
		},
		{
			name: 'format',
			label: '형식',
			type: 'select',
			required: true,
			options: [
				{ label: 'PDF', value: 'PDF' },
				{ label: 'HTML', value: 'HTML' },
			],
		},
		{ name: 'startDate', label: '시작일', type: 'date', required: true },
		{ name: 'endDate', label: '종료일', type: 'date', required: true },
		{
			name: 'targetType',
			label: '대상유형',
			type: 'select',
			required: true,
			options: [
				{ label: '설비', value: 'equipment' },
				{ label: '제품', value: 'product' },
				{ label: '작업지시', value: 'order' },
				{ label: 'LOT', value: 'lot' },
			],
		},
		{
			name: 'targetCode',
			label: '대상코드',
			type: 'text',
			required: true,
			placeholder: '예: INJ-001 / SP-CASE-001 ...',
		},
		{ name: 'issuer', label: '발행자', type: 'text', required: true },
		{ name: 'department', label: '부서', type: 'text', required: true },
		{ name: 'includeCharts', label: '차트 포함', type: 'checkbox' },
		{
			name: 'notes',
			label: '비고',
			type: 'textarea',
			placeholder: '추가 메모',
		},
	];

	const handleMasterSubmit = (data: Record<string, unknown>) => {
		const next: CertificateMasterForm = {
			templateId: String(data.templateId || 'default'),
			// 검사유형(수입검사 제외) 선택값 저장 (문자열 그대로 유지)
			language: String(
				data.language || 'ko'
			) as CertificateMasterForm['language'],
			format: String(
				data.format || 'PDF'
			) as CertificateMasterForm['format'],
			startDate: String(data.startDate || ''),
			endDate: String(data.endDate || ''),
			targetType: String(
				data.targetType || 'equipment'
			) as CertificateMasterForm['targetType'],
			targetCode: String(data.targetCode || ''),
			issuer: String(data.issuer || ''),
			department: String(data.department || ''),
			includeCharts: Boolean(data.includeCharts || false),
			notes: data.notes ? String(data.notes) : undefined,
		};
		setMasterData(next);
		toast.success('발행 정보가 저장되었습니다.');
	};

	const handleGenerate = () => {
		if (!masterData.targetCode || !masterData.issuer) {
			toast.error('대상코드와 발행자를 입력해주세요.');
			return;
		}
		if (inspectionRecords.length === 0) {
			toast.error('검사내역을 먼저 불러오세요.');
			return;
		}
		// 실제 발행 API 연동 전까지 목업 처리
		const included =
			selectedRecords.length > 0 ? selectedRecords : inspectionRecords;
		console.log('성적서 발행 요청 데이터:', { masterData, included });
		toast.success('성적서가 발행(모의)되었습니다.');
		const newId = Date.now();
		navigate(`/quality/certificate/${newId}`);
	};

	// Form methods for top action buttons
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
	};
	const handleSaveMaster = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.handleSubmit(handleMasterSubmit)();
		}
	};
	const handleResetMaster = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.reset();
		}
	};

	return (
		<div className="max-w-full mx-auto p-4 h-full flex flex-col">
			<h1 className="text-xl font-bold mt-2 mb-3">성적서 생성</h1>
			<div className="flex justify-between items-center gap-2 mb-6">
				<RadixIconButton
					className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
					onClick={() => navigate('/quality/certificate/list')}
				>
					<ArrowLeft size={16} />
					뒤로가기
				</RadixIconButton>
				<button
					onClick={handleGenerate}
					className="bg-Colors-Brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-Colors-Brand-800 transition-colors flex items-center gap-2"
				>
					<FileCheck2 size={16} /> 발행
				</button>
			</div>

			<PageTemplate
				firstChildWidth="38%"
				splitterSizes={[30, 70]}
				splitterMinSize={[310, 550]}
				splitterGutterSize={8}
			>
				{/* 좌측: 발행 정보 */}
				<div className="border rounded-lg h-full overflow-hidden">
					<FormComponent
						title="발행 정보"
						actionButtons={
							<div className="flex items-center gap-2">
								<Tooltip label="초기화" side="bottom">
									<RadixButton
										className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-white hover:bg-gray-50"
										onClick={handleResetMaster}
									>
										<RotateCw
											size={16}
											className={'text-gray-400'}
										/>
									</RadixButton>
								</Tooltip>

								<Tooltip
									label="검사내역 불러오기"
									side="bottom"
								>
									<RadixButton
										className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-white hover:bg-gray-50"
										onClick={handleLoadInspections}
									>
										<RotateCwSquare
											size={16}
											className={'text-gray-400'}
										/>
									</RadixButton>
								</Tooltip>

								<Tooltip label="저장" side="bottom">
									<RadixButton
										className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700"
										onClick={handleSaveMaster}
									>
										<Check
											size={16}
											className={'text-white'}
										/>
									</RadixButton>
								</Tooltip>
							</div>
						}
					>
						<DynamicForm
							fields={masterFormFields}
							initialData={
								masterData as unknown as Record<string, unknown>
							}
							onSubmit={handleMasterSubmit}
							onFormReady={handleFormReady}
							visibleSaveButton={false}
						/>
					</FormComponent>
				</div>

				{/* 우측: 미리보기 */}
				<div className="border rounded-lg h-full overflow-auto">
					<div className="p-4 border-b">
						<h2 className="text-lg font-semibold">미리보기</h2>
					</div>
					<div className="p-4 space-y-4">
						{/* 검사내역 테이블(간단) */}
						<div className="bg-white rounded-lg shadow p-4">
							<div className="flex items-center justify-between mb-3">
								<h3 className="text-base font-semibold">
									검사내역
								</h3>
								<span className="text-sm text-gray-500">
									{inspectionRecords.length}건
								</span>
							</div>
							<div className="overflow-auto">
								<table className="min-w-full text-sm">
									<thead>
										<tr className="text-left text-gray-600 border-b">
											<th className="py-2 pr-3">선택</th>
											<th className="py-2 pr-3">
												검사일
											</th>
											<th className="py-2 pr-3">
												설비코드
											</th>
											<th className="py-2 pr-3">결과</th>
											<th className="py-2 pr-3">점수</th>
											<th className="py-2 pr-0">결함</th>
										</tr>
									</thead>
									<tbody>
										{inspectionRecords.map((r) => (
											<tr
												key={r.id}
												className="border-b last:border-0"
											>
												<td className="py-2 pr-3">
													<input
														type="checkbox"
														checked={selectedIds.includes(
															r.id
														)}
														onChange={() =>
															toggleSelect(r.id)
														}
													/>
												</td>
												<td className="py-2 pr-3">
													{r.inspectionDate}
												</td>
												<td className="py-2 pr-3">
													{r.equipmentCode}
												</td>
												<td className="py-2 pr-3">
													{r.result}
												</td>
												<td className="py-2 pr-3">
													{r.score}
												</td>
												<td className="py-2 pr-0">
													{r.defectsFound}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						{/* KPI */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div className="bg-white rounded-lg shadow p-4">
								<p className="text-sm text-gray-600">총 검사</p>
								<p className="text-2xl font-bold">
									{previewStats.totalInspections}건
								</p>
							</div>
							<div className="bg-white rounded-lg shadow p-4">
								<p className="text-sm text-gray-600">합격률</p>
								<p className="text-2xl font-bold text-green-600">
									{previewStats.passRate}%
								</p>
							</div>
							<div className="bg-white rounded-lg shadow p-4">
								<p className="text-sm text-gray-600">경고</p>
								<p className="text-2xl font-bold text-yellow-600">
									{previewStats.warningCount}건
								</p>
							</div>
							<div className="bg-white rounded-lg shadow p-4">
								<p className="text-sm text-gray-600">불합격</p>
								<p className="text-2xl font-bold text-red-600">
									{previewStats.failCount}건
								</p>
							</div>
						</div>

						{/* 차트 */}
						{masterData.includeCharts && (
							<div className="bg-white rounded-lg shadow p-4">
								<EchartComponent
									options={createPreviewChart()}
									height="320px"
								/>
							</div>
						)}

						{/* 템플릿 미리보기 (간소화) */}
						<div className="bg-white rounded-lg shadow p-6">
							<h3 className="text-base font-semibold mb-4">
								성적서 미리보기 (모의)
							</h3>
							<div className="text-sm text-gray-700 space-y-1">
								<p>템플릿: {masterData.templateId}</p>
								<p>
									기간: {masterData.startDate} ~{' '}
									{masterData.endDate}
								</p>
								<p>
									대상: {masterData.targetType} /{' '}
									{masterData.targetCode || '-'}
								</p>
								<p>발행자: {masterData.issuer || '-'}</p>
								<p>부서: {masterData.department || '-'}</p>
								{masterData.notes && (
									<p>비고: {masterData.notes}</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</PageTemplate>
		</div>
	);
};

export default QualityCertificateGeneratePage;
