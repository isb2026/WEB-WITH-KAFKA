import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { ArrowLeft } from 'lucide-react';
import { RadixIconButton, RadixButton } from '@radix-ui/components';
import { toast } from 'sonner';
import type { UseFormReturn } from 'react-hook-form';
import { useCheckingHeads } from '@primes/hooks/qms/checkingHead/useCheckingHeads';
import { useCheckingSamples } from '@primes/hooks/qms/checkingSample/useCheckingSamples';
import type { CheckingHeadData } from '@primes/types/qms/checkingHead';
import type { CheckingSampleData } from '@primes/types/qms/checkingSample';
import { ChoiceSelectInput } from '../qmsConponent';

// ============================================================================
// 타입 정의
// ============================================================================
interface InspectionMaster {
	[key: string]: unknown;
	workOrderNo?: string;
	itemCode: string;
	itemNumber: string;
	itemName: string;
	lotNumber: string;
	inspectionType: string;
	inspectionDate: string;
	inspectorName?: string;
	notes?: string;
	progressName?: string;
}

interface InspectionItem {
	id: number;
	itemName: string;
	standardValue: number | string;
	tolerance: string;
	unit: string;
	isRequired: boolean;
	sortOrder: number;
	measuredValues: { [key: string]: number | string };
	result?: 'OK' | 'NG' | 'WARNING';
	specType?: string;
	sampleQuantity?: number;
	checkingSampleId?: number; // 실제 DB의 CheckingSample ID
	meta?: {
		maxValue?: number;
		minValue?: number;
		tolerance?: number;
		referenceNote?: string;
		sampleQuantity?: number;
		checkPeriod?: number;
		rangeMin?: number;
		rangeMax?: number;
		[key: string]: any;
	};
}

// ============================================================================
// 상수 정의
// ============================================================================
const INSPECTION_TYPE = 'INCOMING';
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 0;

// ============================================================================
// 유틸리티 함수
// ============================================================================
const extractToleranceFromMeta = (meta: any): string => {
	if (!meta) return '±0.1';
	
	if (meta.maxValue && meta.minValue) {
		return `${String(meta.minValue)}~${String(meta.maxValue)}`;
	} else if (meta.maxValue) {
		return `≤${String(meta.maxValue)}`;
	} else if (meta.minValue) {
		return `≥${String(meta.minValue)}`;
	} else if (meta.tolerance) {
		return String(meta.tolerance);
	}
	
	return '±0.1';
};

const calculateResults = (item: InspectionItem, measuredValues: { [key: string]: number | string }) => {
	const sampleQuantity = item.sampleQuantity || 1;
	
	// 입력되지 않은 값이 있는지 확인
	for (let i = 1; i <= sampleQuantity; i++) {
		const sampleValue = measuredValues[`sample${i}`];
		if (!sampleValue || sampleValue.toString().trim() === '') {
			return {
				sampleResults: [],
				overallResult: 'NG' as const
			};
		}
	}

	// 현재 항목의 샘플 값들만 추출
	const values = [];
	for (let i = 1; i <= sampleQuantity; i++) {
		const sampleValue = measuredValues[`sample${i}`];
		if (sampleValue !== '' && sampleValue !== undefined) {
			values.push(sampleValue);
		}
	}

	if (values.length === 0) {
		return {
			sampleResults: [],
			overallResult: undefined
		};
	}

	const results = values.map(value => {
		const measuredValue = parseFloat(value.toString());
		const standardValue = parseFloat(item.standardValue.toString()) || 0;
		const specType = item.specType?.toUpperCase();

		let result: 'OK' | 'NG' = 'NG';

		switch (specType) {
			case 'CHOICE':
				if (item.meta?.maxValue !== undefined) {
					result = measuredValue === 1 ? 'OK' : 'NG';
				} else if (item.meta?.minValue !== undefined) {
					result = measuredValue === 0 ? 'NG' : 'OK';
				}
				break;

			case 'TOLERANCE':
				if (item.meta?.tolerance !== undefined) {
					const tolerance = item.meta.tolerance;
					const diff = Math.abs(measuredValue - standardValue);
					result = diff <= tolerance ? 'OK' : 'NG';
				}
				break;

			case 'ONE_SIDED':
				if (item.meta?.minValue !== undefined) {
					result = measuredValue >= item.meta.minValue ? 'OK' : 'NG';
				} else if (item.meta?.maxValue !== undefined) {
					result = measuredValue <= item.meta.maxValue ? 'OK' : 'NG';
				}
				break;

			case 'RANGE':
				const rangeMin = item.meta?.minValue;
				const rangeMax = item.meta?.maxValue;
				if (rangeMin !== undefined && rangeMax !== undefined) {
					const val = measuredValue;
					result = val >= rangeMin && val <= rangeMax ? 'OK' : 'NG';
				}
				break;

			case 'REFERENCE':
				result = 'OK';
				break;

			default:
				// 기본 tolerance 로직
				if (item.tolerance.includes('±')) {
					const toleranceValue = parseFloat(item.tolerance.replace('±', ''));
					const diff = Math.abs(measuredValue - standardValue);
					result = diff <= toleranceValue ? 'OK' : 'NG';
				} else if (item.tolerance.includes('≤')) {
					const maxValue = parseFloat(item.tolerance.replace('≤', ''));
					result = measuredValue <= maxValue ? 'OK' : 'NG';
				} else if (item.tolerance.includes('≥')) {
					const minValue = parseFloat(item.tolerance.replace('≥', ''));
					result = measuredValue >= minValue ? 'OK' : 'NG';
				}
				break;
		}

		return result;
	});
	
	// 모든 시료가 합격일 때만 전체 합격
	return {
		sampleResults: results,
		overallResult: results.every(r => r === 'OK') ? 'OK' as const : 
					  results.some(r => r === 'NG') ? 'NG' as const : 'WARNING' as const
	};
};

// ============================================================================
// 메인 컴포넌트
// ============================================================================
const QualityIncomingInspectionEditPage: React.FC = (): JSX.Element => {
	// ========================================================================
	// 기본 훅 및 번역
	// ========================================================================
	const { t } = useTranslation('common');
	const { t: tDatatable } = useTranslation('dataTable');
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	// ========================================================================
	// 상태 관리
	// ========================================================================
	const [masterData, setMasterData] = useState<InspectionMaster>({
		workOrderNo: '',
		itemCode: '',
		itemNumber: '',
		itemName: '',
		lotNumber: '',
		inspectionType: INSPECTION_TYPE,
		inspectionDate: '',
		inspectorName: '',
		notes: '',
		progressName: ''
	});

	const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [checkingHeadData, setCheckingHeadData] = useState<CheckingHeadData | null>(null);

	// ========================================================================
	// API 훅
	// ========================================================================
	const { update: updateCheckingHead } = useCheckingHeads({});
	const { list: checkingHeadsList } = useCheckingHeads({
		page: 0,
		size: 1,
		searchRequest: { id: Number(id) }
	});

	const { update: updateCheckingSample } = useCheckingSamples({});

	// ========================================================================
	// 폼 참조
	// ========================================================================
	const formMethodsRef = useRef<UseFormReturn<Record<string, unknown>> | null>(null);

	// ========================================================================
	// 데이터 로드
	// ========================================================================
	useEffect(() => {
		if (!id || !Number(id) || !checkingHeadsList.data) return;
		
		const headData = checkingHeadsList.data.content?.[0];
		if (!headData) {
			toast.error('검사 데이터를 찾을 수 없습니다.');
			navigate('/quality/incoming-inspection/list');
			return;
		}

		setCheckingHeadData(headData);

		// Head 데이터 설정
		const meta = headData.meta as any || {};
		setMasterData({
			workOrderNo: headData.targetCode || '',
			itemCode: meta.itemNumber || '',
			itemNumber: meta.itemNumber || '',
			itemName: meta.itemName || '',
			lotNumber: headData.targetCode || '',
			inspectionType: headData.inspectionType || INSPECTION_TYPE,
			inspectionDate: `${meta.inspectionDate || ''}T${meta.inspectionTime || ''}`,
			inspectorName: meta.inspectorName || '',
			notes: meta.notes || '',
			progressName: meta.progressName || ''
		});

		// CheckingSample 데이터를 InspectionItem으로 변환
		const samples = headData.checkingSamples || [];
		const itemsMap = new Map<string, InspectionItem>();

		samples.forEach((sample: CheckingSampleData, index: number) => {
			const itemName = sample.checkingName;
			
			if (!itemsMap.has(itemName)) {
				// meta 파싱
				let parsedMeta = {};
				try {
					parsedMeta = sample.meta ? JSON.parse(sample.meta) : {};
				} catch (e) {
					console.warn('Failed to parse meta:', sample.meta);
				}

				itemsMap.set(itemName, {
					id: index + 1,
					itemName: itemName,
					standardValue: sample.standard || '',
					tolerance: extractToleranceFromMeta(parsedMeta),
					unit: sample.standardUnit || '',
					isRequired: true,
					sortOrder: sample.orderNo || index + 1,
					measuredValues: {},
					specType: (parsedMeta as any)?.specType || '',
					meta: parsedMeta,
					sampleQuantity: 1, // 기본값, 실제 샘플 수에 따라 조정
					checkingSampleId: sample.id
				});
			}

			const item = itemsMap.get(itemName)!;
			item.measuredValues[`sample${sample.sampleIndex}`] = sample.measuredValue || 0;
			
			// 최대 샘플 수량 업데이트
			const maxSampleIndex = Math.max(
				item.sampleQuantity || 1,
				sample.sampleIndex || 1
			);
			item.sampleQuantity = maxSampleIndex;
		});

		// 결과 계산
		const itemsArray = Array.from(itemsMap.values()).map(item => {
			const results = calculateResults(item, item.measuredValues);
			return {
				...item,
				result: results.overallResult
			};
		});

		setInspectionItems(itemsArray);
		setIsLoading(false);
	}, [id, checkingHeadsList.data, navigate]);

	// ========================================================================
	// 이벤트 핸들러 - 측정값 관리
	// ========================================================================
	const handleMeasuredValueChange = useCallback((itemId: number, sampleIndex: number, value: string) => {
		setInspectionItems((prev) =>
			prev.map((item) => {
				if (item.id !== itemId) return item;

				const newMeasuredValues = {
					...item.measuredValues,
					[`sample${sampleIndex}`]: value
				};

				// 모든 샘플의 결과 계산
				const results = calculateResults(item, newMeasuredValues);
				
				return { 
					...item, 
					measuredValues: newMeasuredValues,
					result: results.overallResult 
				};
			})
		);
	}, []);

	// ========================================================================
	// 이벤트 핸들러 - 폼 관리
	// ========================================================================
	const handleFormReady = useCallback((methods: UseFormReturn<Record<string, unknown>>) => {
		formMethodsRef.current = methods;
	}, []);

	const handleSave = useCallback(async () => {
		if (!checkingHeadData || !formMethodsRef.current) return;

		try {
			// 폼 데이터 가져오기
			const formData = formMethodsRef.current.getValues() as Record<string, any>;
			
			// 필수 필드 검증
			if (!formData.inspectionDate) {
				toast.error('검사일자를 입력해주세요.');
				return;
			}
			
			if (!formData.inspectorName?.trim()) {
				toast.error('검사자명을 입력해주세요.');
				return;
			}
			
			// 전체 결과 계산
			const allResultsOK = inspectionItems.length > 0 && 
				inspectionItems.every(item => item.result === 'OK');

			// 기존 meta 데이터 업데이트
			const existingMeta = checkingHeadData.meta as any || {};
			const inspectionDateTime = formData.inspectionDate ? formData.inspectionDate.split('T') : ['', ''];
			
			const updatedMeta = {
				...existingMeta,
				inspectionDate: inspectionDateTime[0] || existingMeta.inspectionDate,
				inspectionTime: inspectionDateTime[1] || existingMeta.inspectionTime,
				inspectorName: formData.inspectorName || existingMeta.inspectorName,
				notes: formData.notes || existingMeta.notes || ''
			};

			// CheckingHead 업데이터 - meta 정보 포함
			const updateHeadData = {
				isUse: checkingHeadData.isUse,
				inspectionType: checkingHeadData.inspectionType,
				targetId: checkingHeadData.targetId,
				targetCode: checkingHeadData.targetCode,
				checkingName: checkingHeadData.checkingName,
				isPass: allResultsOK,
				meta: JSON.stringify(updatedMeta)
			};

			await updateCheckingHead.mutateAsync({
				id: checkingHeadData.id,
				data: updateHeadData
			});

			// CheckingSample 업데이트 - 각 샘플별로 개별 업데이트
			const updatePromises: Promise<any>[] = [];
			
			inspectionItems.forEach((item) => {
				if (item.specType === 'REFERENCE') return;
				
				const sampleQuantity = item.sampleQuantity || 1;
				
				for (let i = 1; i <= sampleQuantity; i++) {
					const sampleValue = item.measuredValues[`sample${i}`];
					if (sampleValue !== '' && sampleValue !== undefined) {
						
						// 해당 샘플의 결과 계산
						const results = calculateResults(item, { [`sample${i}`]: sampleValue });
						const isPass = results.sampleResults[0] === 'OK';

						// 해당 샘플 찾기
						const originalSample = checkingHeadData.checkingSamples?.find(
							sample => sample.checkingName === item.itemName && sample.sampleIndex === i
						);

						if (originalSample) {
							const updateSampleData = {
								isUse: originalSample.isUse,
								inspectionType: originalSample.inspectionType,
								targetId: originalSample.targetId,
								targetCode: originalSample.targetCode,
								checkingName: originalSample.checkingName,
								isPass: isPass,
								checkingFormulaId: originalSample.checkingFormulaId,
								formula: originalSample.formula,
								meta: originalSample.meta
							};

							updatePromises.push(updateCheckingSample.mutateAsync({
								id: originalSample.id,
								data: updateSampleData
							}));
						}
					}
				}
			});

			if (updatePromises.length > 0) {
				await Promise.all(updatePromises);
			}
			
			toast.success('검사 데이터가 성공적으로 저장되었습니다.');
			navigate('/quality/incoming-inspection/list');
			
		} catch (error) {
			console.error('저장 실패:', error);
			toast.error('저장에 실패했습니다.');
		}
	}, [checkingHeadData, inspectionItems, updateCheckingHead, updateCheckingSample, navigate]);

	const handleBack = useCallback(() => {
		navigate('/quality/incoming-inspection/list');
	}, [navigate]);

	// ========================================================================
	// 컴포넌트 및 설정
	// ========================================================================
	const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

	const MeasuredValueInput = useMemo(() => React.memo(({ 
		item, 
		sampleIndex, 
		onValueChange,
		onTabNext
	}: { 
		item: InspectionItem; 
		sampleIndex: number; 
		onValueChange: (value: string) => void;
		onTabNext?: () => void;
	}) => {
		const [localValue, setLocalValue] = useState(item.measuredValues?.[`sample${sampleIndex}`] || '');

		const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
			setLocalValue(e.target.value);
		}, []);

		const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
			onValueChange(e.target.value);
		}, [onValueChange]);

		const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
			e.target.select();
		}, []);

		const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Tab') {
				e.preventDefault();
				e.stopPropagation();
				onValueChange(e.currentTarget.value);
				if (onTabNext) {
					setTimeout(() => {
						onTabNext();
					}, 0);
				}
			}
		}, [onValueChange, onTabNext]);

		useEffect(() => {
			setLocalValue(item.measuredValues?.[`sample${sampleIndex}`] || '');
		}, [item.measuredValues, sampleIndex]);

		return (
			<input
				ref={(el) => {
					inputRefs.current[`${item.id}-sample${sampleIndex}`] = el;
				}}
				key={`${item.id}-sample${sampleIndex}`}
				type="number"
				step="0.01"
				value={localValue}
				onChange={handleChange}
				onBlur={handleBlur}
				onFocus={handleFocus}
				onKeyDown={handleKeyDown}
				tabIndex={0}
				className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 focus:border-transparent"
				placeholder={t('inspection.inspectionItems.measuredValue')}
			/>
		);
	}), [t]);

	const itemColumns = useMemo(() => {
		const baseColumns = [
			{
				accessorKey: 'itemName',
				header: tDatatable('columns.itemName'),
				size: 180,
			},
			{
				accessorKey: 'standardValue',
				header: tDatatable('columns.standard'),
				size: 100,
			},
			{
				accessorKey: 'unit',
				header: tDatatable('columns.unit'),
				size: 50,
			},
			{
				accessorKey: 'maxValue',
				header: tDatatable('columns.maxValue'),
				size: 80,
				cell: ({ row }: { row: any }) => (
					<div>{row.original.meta?.maxValue || '-'}</div>
				),
			},
			{
				accessorKey: 'minValue',
				header: tDatatable('columns.minValue'),
				size: 80,
				cell: ({ row }: { row: any }) => (
					<div>{row.original.meta?.minValue || '-'}</div>
				),
			},
			{
				accessorKey: 'tolerance',
				header: tDatatable('columns.tolerance'),
				size: 80,
				cell: ({ row }: { row: any }) => (
					<div>{row.original.meta?.tolerance || '-'}</div>
				),
			},
			{
				accessorKey: 'isRequired',
				header: t('inspection.inspectionItems.required'),
				size: 60,
				cell: ({ getValue }: { getValue: () => any }) => {
					const isRequired = getValue();
					return (
						<span className={`px-2 py-1 rounded text-xs ${
							isRequired ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
						}`}>
							{isRequired ? t('inspection.inspectionItems.required') : t('common.cancel')}
						</span>
					);
				},
			},
		];
		
		const maxSampleQuantity = Math.max(...inspectionItems.map(item => item.sampleQuantity || 1));
		
		const sampleColumns = Array.from({ length: maxSampleQuantity }, (_, index) => ({
			accessorKey: `sample${index + 1}`,
			header: tDatatable('columns.sample') + (index + 1),
			size: 120,
			cell: ({ row }: { row: any }) => {
				const item = row.original;
				const quantity = item.sampleQuantity || 1;
				const sampleIndex = index + 1;
				
				if (sampleIndex > quantity) {
					return (
						<div className="w-full px-2 py-1 text-sm text-gray-500 text-center">
							-
						</div>
					);
				}
				
				if (item.specType === 'REFERENCE') {
					return (
						<div className="w-full px-2 py-1 text-sm text-gray-500 text-center">
							-
						</div>
					);
				}
				
				if (item.specType === 'CHOICE') {
					return (
						<ChoiceSelectInput 
							item={item} 
							sampleIndex={sampleIndex}
							onValueChange={(value) => handleMeasuredValueChange(item.id, sampleIndex, value)}
						/>
					);
				}
				
				const handleTabNext = () => {
					const currentRowIndex = inspectionItems.findIndex(inspItem => inspItem.id === item.id);
					const nextSampleIndex = sampleIndex + 1;
					
					if (nextSampleIndex <= quantity) {
						const nextInput = inputRefs.current[`${item.id}-sample${nextSampleIndex}`];
						if (nextInput) {
							nextInput.focus();
							return;
						}
					}
					
					if (currentRowIndex < inspectionItems.length - 1) {
						const nextItem = inspectionItems[currentRowIndex + 1];
						if (nextItem && nextItem.sampleQuantity && nextItem.sampleQuantity > 0) {
							const nextInput = inputRefs.current[`${nextItem.id}-sample1`];
							if (nextInput) {
								nextInput.focus();
								return;
							}
						}
					}
					
					if (inspectionItems.length > 0) {
						const firstItem = inspectionItems[0];
						if (firstItem && firstItem.sampleQuantity && firstItem.sampleQuantity > 0) {
							const firstInput = inputRefs.current[`${firstItem.id}-sample1`];
							if (firstInput) {
								firstInput.focus();
							}
						}
					}
				};
				
				return (
					<MeasuredValueInput 
						item={item} 
						sampleIndex={sampleIndex}
						onValueChange={(value) => handleMeasuredValueChange(item.id, sampleIndex, value)}
						onTabNext={handleTabNext}
					/>
				);
			},
		}));
		
		const resultColumn = {
			accessorKey: 'result',
			header: t('inspection.inspectionItems.result'),
			size: 80,
			cell: ({ row }: { row: any }) => {
				const result = row.original.result;
				if (!result) return <span className="text-gray-400">-</span>;

				const resultColorMap: Record<string, string> = {
					OK: 'text-green-600 bg-green-50',
					WARNING: 'text-yellow-600 bg-yellow-50',
					NG: 'text-red-600 bg-red-50',
				};
				const resultColor = resultColorMap[result] || 'text-gray-600 bg-gray-50';

				return (
					<span className={`px-2 py-1 rounded text-xs font-medium ${resultColor}`}>
						{result}
					</span>
				);
			},
		};
		
		const referenceColumn = {
			accessorKey: 'referenceNote',
			header: tDatatable('columns.precautions'),
			size: 150,
			cell: ({ row }: { row: any }) => (
				<div>{row.original.meta?.referenceNote || '-'}</div>
			),
		};
		
		return [...baseColumns, ...sampleColumns, resultColumn, referenceColumn];
	}, [inspectionItems, t, MeasuredValueInput, handleMeasuredValueChange]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		inspectionItems,
		itemColumns,
		DEFAULT_PAGE_SIZE,
		DEFAULT_PAGE,
		0,
		inspectionItems.length
	);

	const masterFormFields = useMemo(() => [
		{
			name: 'workOrderNo',
			label: t('inspection.form.workOrderNoLabel'),
			type: 'text',
			disabled: true, // readonly
		},
		{
			name: 'lotNumber',
			label: t('inspection.form.lotNumberLabel'),
			type: 'text',
			disabled: true, // readonly
		},
		{
			name: 'itemNumber',
			label: t('inspection.form.itemNumberLabel'),
			type: 'text',
			disabled: true, // readonly
		},
		{
			name: 'itemName',
			label: t('inspection.form.itemNameLabel'),
			type: 'text',
			disabled: true, // readonly
		},
		{
			name: 'progressName',
			label: t('inspection.form.progressLabel'),
			type: 'text',
			disabled: true, // readonly
		},
		// inspectionType 필드 제거 (숨김)
		{
			name: 'inspectionDate',
			label: t('inspection.form.inspectionDateLabel'),
			type: 'datetime',
			required: true,
			disabled: false, // 수정 가능
		},
		{
			name: 'inspectorName',
			label: t('inspection.form.inspectorNameLabel'),
			type: 'text',
			required: true,
			disabled: false, // 수정 가능
		},
		{
			name: 'notes',
			label: t('inspection.form.notesLabel'),
			type: 'textarea',
			placeholder: t('inspection.form.notesPlaceholder'),
			disabled: false, // 수정 가능
		},
	], [t]);

	// ========================================================================
	// 이펙트
	// ========================================================================
	useEffect(() => {
		if (formMethodsRef.current && masterData.itemName) {
			formMethodsRef.current.reset(masterData);
		}
	}, [masterData]);

	// 컴포넌트 언마운트 시 ref 정리
	useEffect(() => {
		return () => {
			inputRefs.current = {};
		};
	}, []);

	// ========================================================================
	// 렌더링
	// ========================================================================
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-Colors-Brand-600 mx-auto mb-4"></div>
					<p>{t('inspection.messages.loading')}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-full mx-auto p-4 h-full flex flex-col">
			<div className="flex justify-between items-center gap-2 mb-6">
				<RadixIconButton
					className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
					onClick={handleBack}
					tabIndex={-1}
				>
					<ArrowLeft size={16} className="text-muted-foreground" />
					{t('tabs.actions.back')}
				</RadixIconButton>

				<div className="flex items-center gap-2.5">
					<RadixButton
						className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700"
						onClick={handleSave}
						tabIndex={-1}
					>
						{t('inspection.actions.save')}
					</RadixButton>
				</div>
			</div>

			<PageTemplate
				firstChildWidth="30%"
				splitterSizes={[35, 65]}
				splitterMinSize={[400, 600]}
				splitterGutterSize={8}
			>
				{/* 왼쪽: 검사 기본 정보 (일부 수정 가능) */}
				<div className="border rounded-lg h-full overflow-auto">
					<div className="p-4 border-b">
						<h2 className="text-lg font-semibold">{t('inspection.form.title')}</h2>
					</div>
					<div className="p-4">
						<DynamicForm
							key="quality-incoming-inspection-edit-form"
							fields={masterFormFields}
							onSubmit={() => {}}
							onFormReady={handleFormReady}
							initialData={masterData ? ({ ...masterData } as Record<string, unknown>) : undefined}
							visibleSaveButton={false}
						/>
					</div>
				</div>

				{/* 오른쪽: 검사 항목 관리 (수정 가능) */}
				<div className="border rounded-lg h-full overflow-hidden">
					<div className="p-4 border-b">
						<div className="flex justify-between items-center">
							<h2 className="text-lg font-semibold">
								{t('inspection.inspectionItems.title')}
								{inspectionItems.length > 0 && (
									<span className="ml-2 text-sm text-gray-500">
										({inspectionItems.length}개)
									</span>
								)}
							</h2>
						</div>
					</div>

					<div className="h-[calc(100%-100px)] overflow-auto">
						{inspectionItems.length === 0 ? (
							<div className="flex items-center justify-center h-full text-gray-500">
								<div className="text-center">
									<p>검사 항목이 없습니다.</p>
								</div>
							</div>
						) : (
							<DatatableComponent
								key={`inspection-items-${inspectionItems.length}`}
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

export default QualityIncomingInspectionEditPage; 