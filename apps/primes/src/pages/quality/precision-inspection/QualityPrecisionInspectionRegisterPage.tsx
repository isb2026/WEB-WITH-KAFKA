import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTemplate from '@primes/templates/PageTemplate';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { ArrowLeft, Search } from 'lucide-react';
import { RadixButton, RadixIconButton } from '@repo/radix-ui/components';
import FormComponent from '@primes/components/form/FormComponent';
import type { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

type TableCellContext<TData, TValue> = {
	getValue: () => TValue;
	row: { original: TData };
};

interface PrecisionMaster {
	productCode: string;
	equipmentCode: string;
	inspectionDate: string;
	inspectorName: string;
	featureSet: string;
	notes?: string;
}

interface PrecisionItem {
	id: number;
	featureName: string;
	nominal: number;
	tolerance: string; // e.g., ±0.05, ≤0.02
	unit: string; // mm, etc.
	isRequired: boolean;
	measured?: number | '';
	deviation?: number; // measured - nominal (abs for one-sided)
	result?: 'OK' | 'WARN' | 'NG';
}

const QualityPrecisionInspectionRegisterPage: React.FC = () => {
	const navigate = useNavigate();

	const [master, setMaster] = useState<PrecisionMaster>({
		productCode: '',
		equipmentCode: '',
		inspectionDate: new Date().toISOString().split('T')[0],
		inspectorName: '',
		featureSet: '',
	});

	const [items, setItems] = useState<PrecisionItem[]>([]);
	const [loadingItems, setLoadingItems] = useState(false);

	const handleSearchProduct = (code: string) => {
		if (!code.trim()) return;
		setLoadingItems(true);
		setTimeout(() => {
			// mock features from product
			const mock: PrecisionItem[] = [
				{
					id: 1,
					featureName: '직경',
					nominal: 24.8,
					tolerance: '±0.05',
					unit: 'mm',
					isRequired: true,
				},
				{
					id: 2,
					featureName: '원주도',
					nominal: 0.0,
					tolerance: '≤0.02',
					unit: 'mm',
					isRequired: true,
				},
				{
					id: 3,
					featureName: '평면도',
					nominal: 0.0,
					tolerance: '≤0.01',
					unit: 'mm',
					isRequired: false,
				},
			];
			setMaster((prev) => ({
				...prev,
				productCode: code,
				featureSet: '기본 특성 세트',
			}));
			setItems(mock);
			setLoadingItems(false);
			toast.success('제품 정보와 정밀검사 항목을 불러왔습니다.');
		}, 700);
	};

	const handleSearchEquipment = (code: string) => {
		if (!code.trim()) return;
		setMaster((prev) => ({ ...prev, equipmentCode: code }));
		toast.success('장비가 설정되었습니다.');
	};

	const evaluateResult = (
		item: PrecisionItem,
		measured: number
	): { deviation: number; result: 'OK' | 'WARN' | 'NG' } => {
		const tol = item.tolerance;
		if (tol.includes('±')) {
			const t = parseFloat(tol.replace('±', ''));
			const dev = Math.abs(measured - item.nominal);
			if (dev > t) return { deviation: dev, result: 'NG' };
			if (dev > t * 0.8) return { deviation: dev, result: 'WARN' };
			return { deviation: dev, result: 'OK' };
		}
		if (tol.includes('≤')) {
			const max = parseFloat(tol.replace('≤', ''));
			const dev = Math.abs(measured - item.nominal);
			if (measured > max) return { deviation: dev, result: 'NG' };
			if (measured > max * 0.9) return { deviation: dev, result: 'WARN' };
			return { deviation: dev, result: 'OK' };
		}
		return { deviation: Math.abs(measured - item.nominal), result: 'OK' };
	};

	const onChangeMeasured = useCallback((id: number, value: string) => {
		setItems((prev) =>
			prev.map((it) => {
				if (it.id !== id) return it;
				if (value === '')
					return {
						...it,
						measured: '',
						deviation: undefined,
						result: undefined,
					};
				const num = parseFloat(value);
				if (Number.isNaN(num))
					return {
						...it,
						measured: value as unknown as number,
						deviation: undefined,
						result: undefined,
					};
				const evalRes = evaluateResult(it, num);
				return {
					...it,
					measured: num,
					deviation: evalRes.deviation,
					result: evalRes.result,
				};
			})
		);
	}, []);

	const MeasuredCell: React.FC<{ item: PrecisionItem }> = ({ item }) => (
		<input
			type="number"
			step="0.001"
			value={item.measured === undefined ? '' : item.measured}
			onChange={(e) => onChangeMeasured(item.id, e.target.value)}
			onFocus={(e) => e.target.select()}
			className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 focus:border-transparent"
			placeholder="측정값"
		/>
	);

	const columns = useMemo(
		() => [
			{ accessorKey: 'featureName', header: '특성', size: 180 },
			{ accessorKey: 'nominal', header: '기준값', size: 90 },
			{ accessorKey: 'tolerance', header: '허용차', size: 90 },
			{ accessorKey: 'unit', header: '단위', size: 70 },
			{
				accessorKey: 'measured',
				header: '측정값',
				size: 120,
				cell: (info: TableCellContext<PrecisionItem, unknown>) => (
					<MeasuredCell item={info.row.original} />
				),
			},
			{ accessorKey: 'deviation', header: '편차', size: 80 },
			{
				accessorKey: 'result',
				header: '결과',
				size: 80,
				cell: (
					info: TableCellContext<
						PrecisionItem,
						PrecisionItem['result']
					>
				) => {
					const res = info.getValue();
					if (!res) return <span className="text-gray-400">-</span>;
					const cls =
						res === 'OK'
							? 'bg-green-50 text-green-700'
							: res === 'WARN'
								? 'bg-yellow-50 text-yellow-700'
								: 'bg-red-50 text-red-700';
					return (
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}
						>
							{res}
						</span>
					);
				},
			},
		],
		[onChangeMeasured]
	);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		items,
		columns,
		10,
		0,
		0,
		items.length
	);

	// top actions
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const onFormReady = (m: UseFormReturn<Record<string, unknown>>) =>
		(formMethodsRef.current = m);
	const handleSaveMaster = () =>
		formMethodsRef.current?.handleSubmit((data) => {
			const next: PrecisionMaster = {
				productCode: String(data.productCode || ''),
				equipmentCode: String(data.equipmentCode || ''),
				inspectionDate: String(data.inspectionDate || ''),
				inspectorName: String(data.inspectorName || ''),
				featureSet: String(data.featureSet || ''),
				notes: data.notes ? String(data.notes) : undefined,
			};
			setMaster(next);
			toast.success('기본 정보가 저장되었습니다.');
		})();
	const handleResetMaster = () => {
		formMethodsRef.current?.reset();
		setMaster({
			productCode: '',
			equipmentCode: '',
			inspectionDate: new Date().toISOString().split('T')[0],
			inspectorName: '',
			featureSet: '',
		});
		setItems([]);
	};

	const handleSubmitAll = () => {
		if (!master.productCode || !master.equipmentCode) {
			toast.error('제품코드와 장비코드를 입력/조회해주세요.');
			return;
		}
		if (items.length === 0) {
			toast.error('검사 항목이 없습니다. 제품을 먼저 조회해주세요.');
			return;
		}
		const missing = items.filter(
			(it) =>
				it.isRequired &&
				(it.measured === undefined || it.measured === '')
		);
		if (missing.length > 0) {
			toast.error(
				`필수 특성의 측정값을 입력해주세요: ${missing.map((m) => m.featureName).join(', ')}`
			);
			return;
		}
		console.log('정밀검사 등록 데이터:', { master, items });
		toast.success('정밀검사가 등록되었습니다.');
		const id = Date.now();
		navigate(`/quality/precision-inspection/${id}`);
	};

	const masterFields = [
		{
			name: 'productCode',
			label: '제품코드',
			type: 'inputButton',
			placeholder: '예: SHAFT-205',
			buttonText: '조회',
			buttonIcon: <Search size={16} />,
			buttonDisabled: loadingItems,
			onButtonClick: (val: string) => handleSearchProduct(val),
		},
		{
			name: 'equipmentCode',
			label: '장비코드',
			type: 'inputButton',
			placeholder: '예: CMM-002',
			buttonText: '설정',
			buttonIcon: <Search size={16} />,
			buttonDisabled: false,
			onButtonClick: (val: string) => handleSearchEquipment(val),
		},
		{
			name: 'inspectionDate',
			label: '검사일자',
			type: 'date',
			required: true,
			defaultValue: master.inspectionDate,
		},
		{
			name: 'inspectorName',
			label: '검사자',
			type: 'text',
			required: true,
		},
		{
			name: 'featureSet',
			label: '특성 세트',
			type: 'text',
			placeholder: '예: 기본 특성 세트',
			disabled: true,
		},
		{
			name: 'notes',
			label: '비고',
			type: 'textarea',
			placeholder: '추가 메모',
		},
	];

	return (
		<div className="max-w-full mx-auto p-4 h-full flex flex-col">
			<h1 className="text-xl font-bold mt-2 mb-3">정밀검사 등록</h1>

			<div className="flex justify-between items-center gap-2 mb-6">
				<RadixIconButton
					className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
					onClick={() =>
						navigate('/quality/precision-inspection/list')
					}
				>
					<ArrowLeft size={16} /> 뒤로가기
				</RadixIconButton>
			</div>

			<PageTemplate
				firstChildWidth="38%"
				splitterSizes={[38, 62]}
				splitterMinSize={[360, 560]}
				splitterGutterSize={8}
			>
				{/* 좌측: 기본 정보 */}
				<div className="border rounded-lg h-full overflow-hidden">
					<FormComponent
						title="기본 정보"
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
										handleSubmitAll();
									}}
								>
									저장
								</RadixButton>
							</div>
						}
					>
						<div className="p-4">
							<DynamicForm
								fields={masterFields}
								onFormReady={onFormReady}
								visibleSaveButton={false}
							/>
						</div>
					</FormComponent>
				</div>

				{/* 우측: 특성 측정 테이블 */}
				<div className="border rounded-lg h-full overflow-hidden">
					<div className="p-4 border-b">
						<div className="flex justify-between items-center">
							<h2 className="text-lg font-semibold">특성 측정</h2>
							{loadingItems && (
								<div className="text-sm text-blue-600 flex items-center gap-2">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
									항목 로딩중...
								</div>
							)}
						</div>
					</div>

					<div className="h-[calc(100%-100px)] overflow-auto">
						{items.length === 0 ? (
							<div className="flex items-center justify-center h-full text-gray-500">
								<div className="text-center">
									<p>제품코드를 조회하여</p>
									<p>정밀검사 특성을 불러와주세요</p>
								</div>
							</div>
						) : (
							<DatatableComponent
								table={table}
								columns={columns}
								data={items}
								tableTitle=""
								rowCount={items.length}
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

export default QualityPrecisionInspectionRegisterPage;
