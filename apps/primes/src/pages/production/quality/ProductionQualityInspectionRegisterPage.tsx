import React, { useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { ArrowLeft, Plus, Trash2, Search } from 'lucide-react';
import { RadixIconButton, RadixButton } from '@radix-ui/components';
import { toast } from 'sonner';
import type { UseFormReturn } from 'react-hook-form';

// 검사 마스터 정보 타입
interface InspectionMaster {
	workOrderNo: string;
	productCode: string;
	productName: string;
	lotNumber: string;
	inspectionType: string;
	inspectorName: string;
	inspectionDate: string;
	notes?: string;
}

// 검사 세부 항목 타입
interface InspectionItem {
	id: number;
	itemName: string;
	standardValue: number | string;
	tolerance: string;
	unit: string;
	isRequired: boolean;
	sortOrder: number;
	measuredValue?: number | string; // 측정값 입력 필드
	result?: 'OK' | 'NG' | 'WARNING'; // 자동 계산된 결과
}

const ProductionQualityInspectionRegisterPage: React.FC = () => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();

	const [masterData, setMasterData] = useState<InspectionMaster>({
		workOrderNo: '',
		productCode: '',
		productName: '',
		lotNumber: '',
		inspectionType: '자주검사',
		inspectorName: '',
		inspectionDate: new Date().toISOString().split('T')[0],
	});

	const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>(
		[]
	);
	const [isLoadingItems, setIsLoadingItems] = useState(false);

	// 작업지시번호/LOT번호로 제품 정보 조회
	const handleWorkOrderSearch = async (workOrderNo: string) => {
		if (!workOrderNo) return;

		setIsLoadingItems(true);
		try {
			// TODO: 실제 API 호출
			// const response = await getWorkOrderInfo(workOrderNo);

			// 임시 데이터 시뮬레이션
			setTimeout(() => {
				const mockProductInfo = {
					productCode: 'SP-CASE-001',
					productName: '갤럭시 S24 프로텍터 케이스',
					lotNumber: `LOT-${workOrderNo}-001`,
				};

				const mockInspectionItems: InspectionItem[] = [
					{
						id: 1,
						itemName: '전체 길이',
						standardValue: 158.5,
						tolerance: '±0.2',
						unit: 'mm',
						isRequired: true,
						sortOrder: 1,
					},
					{
						id: 2,
						itemName: '전체 너비',
						standardValue: 76.2,
						tolerance: '±0.2',
						unit: 'mm',
						isRequired: true,
						sortOrder: 2,
					},
					{
						id: 3,
						itemName: '두께',
						standardValue: 1.8,
						tolerance: '±0.1',
						unit: 'mm',
						isRequired: true,
						sortOrder: 3,
					},
					{
						id: 4,
						itemName: '카메라 홀 직경',
						standardValue: 12.5,
						tolerance: '±0.05',
						unit: 'mm',
						isRequired: true,
						sortOrder: 4,
					},
					{
						id: 5,
						itemName: '표면 거칠기',
						standardValue: 0.8,
						tolerance: '≤1.0',
						unit: 'Ra',
						isRequired: false,
						sortOrder: 5,
					},
					{
						id: 6,
						itemName: '충격 강도',
						standardValue: 2.5,
						tolerance: '≥2.0',
						unit: 'J',
						isRequired: true,
						sortOrder: 6,
					},
					{
						id: 7,
						itemName: '투명도',
						standardValue: 95,
						tolerance: '≥90',
						unit: '%',
						isRequired: false,
						sortOrder: 7,
					},
				];

				setMasterData((prev) => ({
					...prev,
					workOrderNo,
					...mockProductInfo,
				}));
				setInspectionItems(mockInspectionItems);
				setIsLoadingItems(false);
				toast.success('제품 정보와 검사항목을 불러왔습니다.');
			}, 1000);
		} catch (error) {
			console.error('작업지시 조회 실패:', error);
			toast.error('작업지시 정보를 불러오는데 실패했습니다.');
			setIsLoadingItems(false);
		}
	};

	// LOT번호로 제품 정보 조회
	const handleLotSearch = async (lotNumber: string) => {
		if (!lotNumber) return;

		setIsLoadingItems(true);
		try {
			// TODO: 실제 API 호출
			setTimeout(() => {
				const mockProductInfo = {
					productCode: 'AUTO-GEAR-205',
					productName: '변속기 기어 샤프트',
					workOrderNo: 'WO-240125-002',
				};

				const mockInspectionItems: InspectionItem[] = [
					{
						id: 1,
						itemName: '샤프트 직경',
						standardValue: 24.8,
						tolerance: '±0.05',
						unit: 'mm',
						isRequired: true,
						sortOrder: 1,
					},
					{
						id: 2,
						itemName: '길이',
						standardValue: 120.0,
						tolerance: '±0.1',
						unit: 'mm',
						isRequired: true,
						sortOrder: 2,
					},
					{
						id: 3,
						itemName: '경도',
						standardValue: 58,
						tolerance: '±3',
						unit: 'HRC',
						isRequired: true,
						sortOrder: 3,
					},
					{
						id: 4,
						itemName: '표면 거칠기',
						standardValue: 0.4,
						tolerance: '≤0.8',
						unit: 'Ra',
						isRequired: false,
						sortOrder: 4,
					},
					{
						id: 5,
						itemName: '원주도',
						standardValue: 0.01,
						tolerance: '≤0.02',
						unit: 'mm',
						isRequired: true,
						sortOrder: 5,
					},
				];

				setMasterData((prev) => ({
					...prev,
					lotNumber,
					...mockProductInfo,
				}));
				setInspectionItems(mockInspectionItems);
				setIsLoadingItems(false);
				toast.success('제품 정보와 검사항목을 불러왔습니다.');
			}, 1000);
		} catch (error) {
			console.error('LOT 조회 실패:', error);
			toast.error('LOT 정보를 불러오는데 실패했습니다.');
			setIsLoadingItems(false);
		}
	};

	// 마스터 정보 폼 필드
	const masterFormFields = [
		{
			name: 'workOrderNo',
			label: '작업지시번호',
			type: 'inputButton',
			placeholder: '예: WO-240125-001',
			buttonText: '조회',
			buttonIcon: <Search size={16} />,
			buttonDisabled: isLoadingItems,
			onButtonClick: (value: string) => {
				if (value.trim()) {
					handleWorkOrderSearch(value.trim());
				}
			},
		},
		{
			name: 'lotNumber',
			label: '로트번호',
			type: 'inputButton',
			placeholder: '예: LOT-240125-002',
			buttonText: '조회',
			buttonIcon: <Search size={16} />,
			buttonDisabled: isLoadingItems,
			onButtonClick: (value: string) => {
				if (value.trim()) {
					handleLotSearch(value.trim());
				}
			},
		},
		{
			name: 'productCode',
			label: '제품코드',
			type: 'text',
			disabled: true,
		},
		{
			name: 'productName',
			label: '제품명',
			type: 'text',
			disabled: true,
		},
		{
			name: 'inspectionType',
			label: '검사유형',
			type: 'select',
			required: true,
			options: [
				{ label: '자주검사', value: '자주검사' },
				{ label: '정기검사', value: '정기검사' },
				{ label: '특별검사', value: '특별검사' },
			],
		},
		{
			name: 'inspectorName',
			label: '검사자',
			type: 'text',
			required: true,
			placeholder: '검사자명을 입력하세요',
		},
		{
			name: 'inspectionDate',
			label: '검사일자',
			type: 'date',
			required: true,
		},
		{
			name: 'notes',
			label: '비고',
			type: 'textarea',
			placeholder: '추가 정보를 입력하세요',
		},
	];

	// 측정값 입력 및 결과 계산
	const handleMeasuredValueChange = useCallback(
		(itemId: number, value: string) => {
			setInspectionItems((prev) =>
				prev.map((item) => {
					if (item.id !== itemId) return item;

					// 빈 값인 경우 바로 설정하고 결과 초기화
					if (value === '') {
						return {
							...item,
							measuredValue: '',
							result: undefined,
						};
					}

					const measuredValue = parseFloat(value);
					const standardValue =
						parseFloat(item.standardValue.toString()) || 0;

					// 숫자가 아닌 경우 값만 설정하고 결과는 초기화
					if (isNaN(measuredValue)) {
						return {
							...item,
							measuredValue: value,
							result: undefined,
						};
					}

					// 결과 계산 로직 (개선된 버전)
					let result: 'OK' | 'NG' | 'WARNING' = 'OK';

					// 허용차에 따른 결과 계산
					if (item.tolerance.includes('±')) {
						// 양방향 허용차 (예: ±0.2)
						const toleranceValue = parseFloat(
							item.tolerance.replace('±', '')
						);
						const diff = Math.abs(measuredValue - standardValue);

						if (diff > toleranceValue) {
							result = 'NG';
						} else if (diff > toleranceValue * 0.8) {
							result = 'WARNING';
						}
					} else if (item.tolerance.includes('≤')) {
						// 최대값 허용차 (예: ≤1.0)
						const maxValue = parseFloat(
							item.tolerance.replace('≤', '')
						);
						if (measuredValue > maxValue) {
							result = 'NG';
						} else if (measuredValue > maxValue * 0.9) {
							result = 'WARNING';
						}
					} else if (item.tolerance.includes('≥')) {
						// 최소값 허용차 (예: ≥2.0)
						const minValue = parseFloat(
							item.tolerance.replace('≥', '')
						);
						if (measuredValue < minValue) {
							result = 'NG';
						} else if (measuredValue < minValue * 1.1) {
							result = 'WARNING';
						}
					}

					return {
						...item,
						measuredValue: value,
						result,
					};
				})
			);
		},
		[]
	);

	// 측정값 입력 컴포넌트 (focus 문제 해결을 위해 분리)
	const MeasuredValueInput = React.memo(
		({ item }: { item: InspectionItem }) => {
			return (
				<input
					type="number"
					step="0.01"
					value={item.measuredValue || ''}
					onChange={(e) => {
						const newValue = e.target.value;
						handleMeasuredValueChange(item.id, newValue);
					}}
					onFocus={(e) => e.target.select()}
					className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 focus:border-transparent"
					placeholder="측정값 입력"
				/>
			);
		}
	);

	// 검사 항목 테이블 컬럼
	const itemColumns = useMemo(
		() => [
			{
				accessorKey: 'itemName',
				header: '검사 항목명',
				size: 180,
			},
			{
				accessorKey: 'standardValue',
				header: '기준값',
				size: 100,
			},
			{
				accessorKey: 'tolerance',
				header: '허용차',
				size: 100,
			},
			{
				accessorKey: 'unit',
				header: '단위',
				size: 60,
			},
			{
				accessorKey: 'measuredValue',
				header: '측정값',
				size: 120,
				cell: ({ row }: { row: any }) => {
					const item = row.original;
					return <MeasuredValueInput item={item} />;
				},
			},
			{
				accessorKey: 'result',
				header: '결과',
				size: 80,
				cell: ({ row }: { row: any }) => {
					const result = row.original.result;
					if (!result)
						return <span className="text-gray-400">-</span>;

					const resultColorMap: Record<string, string> = {
						OK: 'text-green-600 bg-green-50',
						WARNING: 'text-yellow-600 bg-yellow-50',
						NG: 'text-red-600 bg-red-50',
					};
					const resultColor =
						resultColorMap[result] || 'text-gray-600 bg-gray-50';

					return (
						<span
							className={`px-2 py-1 rounded text-xs font-medium ${resultColor}`}
						>
							{result}
						</span>
					);
				},
			},
			{
				accessorKey: 'isRequired',
				header: '필수',
				size: 60,
				cell: ({ getValue }: { getValue: () => any }) => {
					const isRequired = getValue();
					return (
						<span
							className={`px-2 py-1 rounded text-xs ${
								isRequired
									? 'bg-red-100 text-red-800'
									: 'bg-gray-100 text-gray-800'
							}`}
						>
							{isRequired ? '필수' : '선택'}
						</span>
					);
				},
			},
		],
		[]
	);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		inspectionItems,
		itemColumns,
		10,
		0,
		0,
		inspectionItems.length
	);

	const handleMasterSubmit = (data: Record<string, unknown>) => {
		const masterData: InspectionMaster = {
			workOrderNo: String(data.workOrderNo || ''),
			productCode: String(data.productCode || ''),
			productName: String(data.productName || ''),
			lotNumber: String(data.lotNumber || ''),
			inspectionType: String(data.inspectionType || ''),
			inspectorName: String(data.inspectorName || ''),
			inspectionDate: String(data.inspectionDate || ''),
			notes: data.notes ? String(data.notes) : undefined,
		};
		setMasterData(masterData);
		toast.success('검사 기본 정보가 저장되었습니다.');
	};

	// 테스트용 샘플 데이터 자동 입력
	const fillSampleData = () => {
		const updatedItems = inspectionItems.map((item) => {
			const baseValue = parseFloat(item.standardValue.toString());
			let sampleValue: number;

			// 기준값 기준으로 랜덤하게 OK, WARNING, NG 값 생성
			const rand = Math.random();

			if (item.tolerance.includes('±')) {
				const tolerance = parseFloat(item.tolerance.replace('±', ''));
				if (rand < 0.6) {
					// 60% 확률로 OK 범위
					sampleValue =
						baseValue + (Math.random() - 0.5) * tolerance * 0.7;
				} else if (rand < 0.85) {
					// 25% 확률로 WARNING 범위
					sampleValue =
						baseValue + (Math.random() - 0.5) * tolerance * 0.9;
				} else {
					// 15% 확률로 NG 범위
					sampleValue =
						baseValue + (Math.random() - 0.5) * tolerance * 1.2;
				}
			} else if (item.tolerance.includes('≤')) {
				const maxValue = parseFloat(item.tolerance.replace('≤', ''));
				if (rand < 0.7) {
					sampleValue = Math.random() * maxValue * 0.8;
				} else if (rand < 0.9) {
					sampleValue = maxValue * 0.95;
				} else {
					sampleValue = maxValue * 1.1;
				}
			} else if (item.tolerance.includes('≥')) {
				const minValue = parseFloat(item.tolerance.replace('≥', ''));
				if (rand < 0.7) {
					sampleValue = minValue * (1 + Math.random() * 0.2);
				} else if (rand < 0.9) {
					sampleValue = minValue * 1.05;
				} else {
					sampleValue = minValue * 0.9;
				}
			} else {
				sampleValue = baseValue;
			}

			// 소수점 자리수 맞추기
			const decimals = item.unit === 'mm' ? 2 : item.unit === '%' ? 1 : 2;
			const formattedValue = sampleValue.toFixed(decimals);

			// 결과 계산
			let result: 'OK' | 'NG' | 'WARNING' = 'OK';

			if (item.tolerance.includes('±')) {
				const toleranceValue = parseFloat(
					item.tolerance.replace('±', '')
				);
				const diff = Math.abs(sampleValue - baseValue);
				if (diff > toleranceValue) {
					result = 'NG';
				} else if (diff > toleranceValue * 0.8) {
					result = 'WARNING';
				}
			} else if (item.tolerance.includes('≤')) {
				const maxValue = parseFloat(item.tolerance.replace('≤', ''));
				if (sampleValue > maxValue) {
					result = 'NG';
				} else if (sampleValue > maxValue * 0.9) {
					result = 'WARNING';
				}
			} else if (item.tolerance.includes('≥')) {
				const minValue = parseFloat(item.tolerance.replace('≥', ''));
				if (sampleValue < minValue) {
					result = 'NG';
				} else if (sampleValue < minValue * 1.1) {
					result = 'WARNING';
				}
			}

			return {
				...item,
				measuredValue: formattedValue,
				result,
			};
		});

		setInspectionItems(updatedItems);

		toast.success('샘플 측정값이 입력되었습니다.');
	};

	// 측정값 초기화
	const clearMeasuredValues = () => {
		const clearedItems = inspectionItems.map((item) => ({
			...item,
			measuredValue: undefined,
			result: undefined,
		}));
		setInspectionItems(clearedItems);
		toast.success('측정값이 초기화되었습니다.');
	};

	const handleSaveInspection = () => {
		if (!masterData.workOrderNo && !masterData.lotNumber) {
			toast.error('작업지시번호 또는 로트번호를 먼저 조회해주세요.');
			return;
		}

		if (inspectionItems.length === 0) {
			toast.error(
				'검사 항목이 없습니다. 작업지시번호/로트번호를 조회해주세요.'
			);
			return;
		}

		// 필수 항목 측정값 체크
		const missingRequired = inspectionItems.filter(
			(item) =>
				item.isRequired &&
				(!item.measuredValue || item.measuredValue === '')
		);

		if (missingRequired.length > 0) {
			toast.error(
				`필수 검사항목의 측정값을 입력해주세요: ${missingRequired.map((item) => item.itemName).join(', ')}`
			);
			return;
		}

		// TODO: 실제 API 호출
		const inspectionData = {
			master: masterData,
			items: inspectionItems,
		};

		console.log('검사 등록 데이터:', inspectionData);
		toast.success('자주검사가 등록되었습니다.');

		// 검사 상세 페이지로 이동 (임시 ID 사용)
		const newInspectionId = Date.now();
		navigate(`/production/quality/inspection/${newInspectionId}`);
	};

	// Top action: save/reset master
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
		setMasterData({
			workOrderNo: '',
			productCode: '',
			productName: '',
			lotNumber: '',
			inspectionType: '자주검사',
			inspectorName: '',
			inspectionDate: new Date().toISOString().split('T')[0],
		});
		setInspectionItems([]);
	};

	const handleBack = () => {
		navigate('/production/quality/inspection');
	};

	return (
		<div className="max-w-full mx-auto p-4 h-full flex flex-col">
			<h1 className="text-xl font-bold mt-2 mb-3">자주검사 등록</h1>

			<div className="flex justify-between items-center gap-2 mb-6">
				<RadixIconButton
					className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
					onClick={handleBack}
				>
					<ArrowLeft size={16} className="text-muted-foreground" />
					{t('tabs.actions.back')}
				</RadixIconButton>

				<div className="flex items-center gap-2.5">
					<RadixButton
						className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-white hover:bg-gray-50"
						onClick={handleResetMaster}
					>
						초기화
					</RadixButton>
					<RadixButton
						className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700"
						onClick={() => {
							handleSaveMaster();
							handleSaveInspection();
						}}
					>
						저장
					</RadixButton>
				</div>
			</div>

			<PageTemplate
				firstChildWidth="30%"
				splitterSizes={[35, 65]}
				splitterMinSize={[400, 600]}
				splitterGutterSize={8}
			>
				{/* 왼쪽: 검사 기본 정보 */}
				<div className="border rounded-lg h-full overflow-auto">
					<div className="p-4 border-b">
						<h2 className="text-lg font-semibold">
							검사 기본 정보
						</h2>
					</div>
					<div className="p-4">
						<DynamicForm
							fields={masterFormFields}
							onSubmit={handleMasterSubmit}
							onFormReady={handleFormReady}
							initialData={
								masterData
									? ({ ...masterData } as Record<
											string,
											unknown
										>)
									: undefined
							}
							visibleSaveButton={false}
						/>
					</div>
				</div>

				{/* 오른쪽: 검사 항목 관리 */}
				<div className="border rounded-lg h-full overflow-hidden">
					<div className="p-4 border-b">
						<div className="flex justify-between items-center">
							<h2 className="text-lg font-semibold">
								검사 항목
								{inspectionItems.length > 0 && (
									<span className="ml-2 text-sm text-gray-500">
										({inspectionItems.length}개)
									</span>
								)}
							</h2>
							<div className="flex items-center gap-2">
								{isLoadingItems && (
									<div className="text-sm text-blue-600 flex items-center gap-2">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
										검사항목 로딩중...
									</div>
								)}
								{inspectionItems.length > 0 && (
									<>
										<button
											onClick={fillSampleData}
											className="px-3 py-1 text-xs bg-Colors-Brand-50 hover:bg-Colors-Brand-100 text-Colors-Brand-700 rounded border transition-colors"
											title="테스트용 샘플 데이터 자동 입력"
										>
											샘플 입력
										</button>
										<button
											onClick={clearMeasuredValues}
											className="px-3 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded border transition-colors"
											title="측정값 초기화"
										>
											초기화
										</button>
									</>
								)}
							</div>
						</div>
					</div>

					<div className="h-[calc(100%-100px)] overflow-auto">
						{inspectionItems.length === 0 ? (
							<div className="flex items-center justify-center h-full text-gray-500">
								<div className="text-center">
									<p>작업지시번호 또는 로트번호를 입력하여</p>
									<p>검사항목을 불러와주세요</p>
								</div>
							</div>
						) : (
							<DatatableComponent
								table={table}
								columns={itemColumns}
								data={inspectionItems}
								tableTitle=""
								rowCount={inspectionItems.length}
								selectedRows={selectedRows}
								toggleRowSelection={toggleRowSelection}
								classNames={{
									container: 'border-0',
								}}
							/>
						)}
					</div>
				</div>
			</PageTemplate>
		</div>
	);
};

export default ProductionQualityInspectionRegisterPage;
