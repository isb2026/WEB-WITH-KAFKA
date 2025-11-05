import React, { useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTemplate from '@primes/templates/PageTemplate';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { ArrowLeft, Search } from 'lucide-react';
import { RadixIconButton, RadixButton } from '@repo/radix-ui/components';
import FormComponent from '@primes/components/form/FormComponent';
import type { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface PeriodicInspectionMaster {
	planName: string;
	equipmentCode: string;
	equipmentName: string;
	inspectionType:
		| '월간정기검사'
		| '분기정기검사'
		| '반기정기검사'
		| '연간정기검사';
	plannedStartDate: string; // 계획 시작
	plannedEndDate: string; // 계획 종료
	inspectorName: string;
	department: string;
	notes?: string;
}

interface PeriodicInspectionItem {
	id: number;
	itemName: string;
	standardValue: number | string;
	tolerance: string; // ±0.2, ≤1.0, ≥2.0
	unit: string; // mm, %, 등
	isRequired: boolean;
	sortOrder: number;
	measuredValue?: number | string;
	result?: 'OK' | 'NG' | 'WARNING';
}

type TableCellContext<TData, TValue> = {
	getValue: () => TValue;
	row: { original: TData };
};

const QualityPeriodicInspectionRegisterPage: React.FC = () => {
	const navigate = useNavigate();

	const [masterData, setMasterData] = useState<PeriodicInspectionMaster>({
		planName: '',
		equipmentCode: '',
		equipmentName: '',
		inspectionType: '월간정기검사',
		plannedStartDate: new Date().toISOString().split('T')[0],
		plannedEndDate: new Date().toISOString().split('T')[0],
		inspectorName: '',
		department: '',
	});

	const [inspectionItems, setInspectionItems] = useState<
		PeriodicInspectionItem[]
	>([]);
	const [isLoadingItems, setIsLoadingItems] = useState(false);

	// 설비 코드/명 조회 → 설비 정보 + 항목 템플릿 로드 (모의)
	const handleEquipmentSearch = async (equipmentCodeOrName: string) => {
		if (!equipmentCodeOrName) return;
		setIsLoadingItems(true);
		try {
			setTimeout(() => {
				const mockEquipment = {
					equipmentCode: 'EQP-1001',
					equipmentName: '사출성형기 #001',
				};

				const mockItems: PeriodicInspectionItem[] = [
					{
						id: 1,
						itemName: '유압시스템 압력',
						standardValue: 150,
						tolerance: '±10',
						unit: 'bar',
						isRequired: true,
						sortOrder: 1,
					},
					{
						id: 2,
						itemName: '안전센서 반응시간',
						standardValue: 0.15,
						tolerance: '≤0.2',
						unit: 's',
						isRequired: true,
						sortOrder: 2,
					},
					{
						id: 3,
						itemName: '소음 레벨',
						standardValue: 65,
						tolerance: '≤70',
						unit: 'dB',
						isRequired: false,
						sortOrder: 3,
					},
				];

				setMasterData((prev) => ({
					...prev,
					...mockEquipment,
				}));
				setInspectionItems(mockItems);
				setIsLoadingItems(false);
				toast.success('설비 정보와 정기검사 항목을 불러왔습니다.');
			}, 800);
		} catch (e) {
			setIsLoadingItems(false);
			toast.error('설비 정보를 불러오는데 실패했습니다.');
		}
	};

	const handleMeasuredValueChange = useCallback(
		(itemId: number, value: string) => {
			setInspectionItems((prev) =>
				prev.map((item) => {
					if (item.id !== itemId) return item;

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

					if (isNaN(measuredValue)) {
						return {
							...item,
							measuredValue: value,
							result: undefined,
						};
					}

					let result: 'OK' | 'NG' | 'WARNING' = 'OK';
					if (item.tolerance.includes('±')) {
						const toleranceValue = parseFloat(
							item.tolerance.replace('±', '')
						);
						const diff = Math.abs(measuredValue - standardValue);
						if (diff > toleranceValue) result = 'NG';
						else if (diff > toleranceValue * 0.8)
							result = 'WARNING';
					} else if (item.tolerance.includes('≤')) {
						const maxValue = parseFloat(
							item.tolerance.replace('≤', '')
						);
						if (measuredValue > maxValue) result = 'NG';
						else if (measuredValue > maxValue * 0.9)
							result = 'WARNING';
					} else if (item.tolerance.includes('≥')) {
						const minValue = parseFloat(
							item.tolerance.replace('≥', '')
						);
						if (measuredValue < minValue) result = 'NG';
						else if (measuredValue < minValue * 1.1)
							result = 'WARNING';
					}

					return { ...item, measuredValue: value, result };
				})
			);
		},
		[]
	);

	const MeasuredValueInput = React.memo(
		({ item }: { item: PeriodicInspectionItem }) => {
			return (
				<input
					type="number"
					step="0.01"
					value={item.measuredValue || ''}
					onChange={(e) =>
						handleMeasuredValueChange(item.id, e.target.value)
					}
					onFocus={(e) => e.target.select()}
					className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 focus:border-transparent"
					placeholder="측정값 입력"
				/>
			);
		}
	);

	const itemColumns = useMemo(
		() => [
			{ accessorKey: 'itemName', header: '검사 항목명', size: 180 },
			{ accessorKey: 'standardValue', header: '기준값', size: 100 },
			{ accessorKey: 'tolerance', header: '허용차', size: 100 },
			{ accessorKey: 'unit', header: '단위', size: 60 },
			{
				accessorKey: 'measuredValue',
				header: '측정값',
				size: 120,
				cell: (
					info: TableCellContext<PeriodicInspectionItem, unknown>
				) => {
					const rowItem = info.row.original;
					return <MeasuredValueInput item={rowItem} />;
				},
			},
			{
				accessorKey: 'result',
				header: '결과',
				size: 80,
				cell: (
					info: TableCellContext<
						PeriodicInspectionItem,
						string | undefined
					>
				) => {
					const result = info.row.original.result;
					if (!result)
						return <span className="text-gray-400">-</span>;
					const color: Record<string, string> = {
						OK: 'text-green-600 bg-green-50',
						WARNING: 'text-yellow-600 bg-yellow-50',
						NG: 'text-red-600 bg-red-50',
					};
					return (
						<span
							className={`px-2 py-1 rounded text-xs font-medium ${color[result] || ''}`}
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
				cell: (
					info: TableCellContext<PeriodicInspectionItem, boolean>
				) => {
					const required = info.getValue();
					return (
						<span
							className={`px-2 py-1 rounded text-xs ${required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
						>
							{required ? '필수' : '선택'}
						</span>
					);
				},
			},
		],
		[handleMeasuredValueChange]
	);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		inspectionItems,
		itemColumns,
		10,
		0,
		0,
		inspectionItems.length
	);

	const masterFormFields = [
		{
			name: 'planName',
			label: '계획 명',
			type: 'text',
			required: true,
		},
		{
			name: 'equipmentCode',
			label: '설비코드',
			type: 'inputButton',
			placeholder: '예: EQP-1001',
			buttonText: '조회',
			buttonIcon: <Search size={16} />,
			buttonDisabled: isLoadingItems,
			onButtonClick: (value: string) => {
				if (value.trim()) handleEquipmentSearch(value.trim());
			},
		},
		{
			name: 'equipmentName',
			label: '설비명',
			type: 'text',
			disabled: true,
		},
		{
			name: 'inspectionType',
			label: '검사유형',
			type: 'select',
			required: true,
			options: [
				{ label: '월간정기검사', value: '월간정기검사' },
				{ label: '분기정기검사', value: '분기정기검사' },
				{ label: '반기정기검사', value: '반기정기검사' },
				{ label: '연간정기검사', value: '연간정기검사' },
			],
		},
		{
			name: 'plannedStartDate',
			label: '검사 시작일',
			type: 'date',
			required: true,
		},
		{
			name: 'plannedEndDate',
			label: '검사 종료일',
			type: 'date',
			required: true,
		},
		{
			name: 'inspectorName',
			label: '검사자',
			type: 'text',
			required: true,
		},
		{
			name: 'department',
			label: '부서',
			type: 'text',
			required: true,
		},
		{
			name: 'notes',
			label: '비고',
			type: 'textarea',
			placeholder: '추가 정보를 입력하세요',
		},
	];

	const handleMasterSubmit = (data: Record<string, unknown>) => {
		const next: PeriodicInspectionMaster = {
			planName: String(data.planName || ''),
			equipmentCode: String(data.equipmentCode || ''),
			equipmentName: String(data.equipmentName || ''),
			inspectionType: String(
				data.inspectionType || '월간정기검사'
			) as PeriodicInspectionMaster['inspectionType'],
			plannedStartDate: String(data.plannedStartDate || ''),
			plannedEndDate: String(data.plannedEndDate || ''),
			inspectorName: String(data.inspectorName || ''),
			department: String(data.department || ''),
			notes: data.notes ? String(data.notes) : undefined,
		};
		setMasterData(next);
		toast.success('정기검사 계획 정보가 저장되었습니다.');
	};

	const handleSaveInspection = () => {
		if (!masterData.planName || !masterData.equipmentCode) {
			toast.error('계획 명과 설비코드를 입력/조회해주세요.');
			return;
		}
		if (inspectionItems.length === 0) {
			toast.error('검사 항목이 없습니다. 설비를 먼저 조회해주세요.');
			return;
		}
		const missingRequired = inspectionItems.filter(
			(item) =>
				item.isRequired &&
				(!item.measuredValue || item.measuredValue === '')
		);
		if (missingRequired.length > 0) {
			toast.error(
				`필수 검사항목의 측정값을 입력해주세요: ${missingRequired
					.map((i) => i.itemName)
					.join(', ')}`
			);
			return;
		}

		const payload = { master: masterData, items: inspectionItems };
		console.log('정기검사 등록 데이터:', payload);
		toast.success('정기검사가 등록되었습니다.');
		const newId = Date.now();
		navigate(`/quality/periodic-inspection/${newId}`);
	};

	const handleBack = () => {
		navigate('/quality/periodic-inspection/list');
	};

	// top action form controls
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
		if (formMethodsRef.current) formMethodsRef.current.reset();
		setMasterData({
			planName: '',
			equipmentCode: '',
			equipmentName: '',
			inspectionType: '월간정기검사',
			plannedStartDate: new Date().toISOString().split('T')[0],
			plannedEndDate: new Date().toISOString().split('T')[0],
			inspectorName: '',
			department: '',
		});
		setInspectionItems([]);
	};

	return (
		<div className="max-w-full mx-auto p-4 h-full flex flex-col">
			<h1 className="text-xl font-bold mt-2 mb-3">정기검사 등록</h1>

			<div className="flex justify-between items-center gap-2 mb-6">
				<RadixIconButton
					className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
					onClick={handleBack}
				>
					<ArrowLeft size={16} className="text-muted-foreground" />
					뒤로가기
				</RadixIconButton>

				{/* 저장/초기화는 좌측 FormComponent 액션버튼으로 이동 */}
			</div>

			<PageTemplate
				firstChildWidth="35%"
				splitterSizes={[35, 65]}
				splitterMinSize={[360, 560]}
				splitterGutterSize={8}
			>
				{/* 좌측: 계획/기본 정보 */}
				<div className="border rounded-lg h-full overflow-hidden">
					<FormComponent
						title="계획 / 기본 정보"
						actionButtons={
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
						}
					>
						<div className="p-4">
							<DynamicForm
								fields={masterFormFields}
								onSubmit={handleMasterSubmit}
								initialData={
									masterData
										? ({ ...masterData } as Record<
												string,
												unknown
											>)
										: undefined
								}
								onFormReady={handleFormReady}
								visibleSaveButton={false}
							/>
						</div>
					</FormComponent>
				</div>

				{/* 우측: 항목별 측정값 입력 */}
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
							</div>
						</div>
					</div>

					<div className="h-[calc(100%-100px)] overflow-auto">
						{inspectionItems.length === 0 ? (
							<div className="flex items-center justify-center h-full text-gray-500">
								<div className="text-center">
									<p>설비코드 또는 설비명을 입력하여</p>
									<p>정기검사 항목을 불러와주세요</p>
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
								classNames={{ container: 'border-0' }}
							/>
						)}
					</div>
				</div>
			</PageTemplate>
		</div>
	);
};

export default QualityPeriodicInspectionRegisterPage;
