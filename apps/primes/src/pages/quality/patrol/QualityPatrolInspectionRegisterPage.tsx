import React, {
	useRef,
	useState,
	useCallback,
	useMemo,
	useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { ArrowLeft, Search } from 'lucide-react';
import { RadixIconButton, RadixButton } from '@radix-ui/components';
import { toast } from 'sonner';
import type { UseFormReturn } from 'react-hook-form';
import { useCommand } from '@primes/hooks/production/useCommand';
import { CommandSearchRequest } from '@primes/types/production/command';
import { useCheckingSpecListQuery } from '@primes/hooks/qms/checkingSpec/useCheckingSpecListQuery';
import {
	CheckingSpecData,
	CheckingSpecSearchRequest,
} from '@primes/types/qms/checkingSpec';
import { ItemProgressSearchRequest } from '@primes/types/progress';
import { useProgress } from '@primes/hooks/init/progress/useProgress';
import { ItemProgressDto } from '@primes/types/progress';
import { useLot } from '@primes/hooks/production/useLot';
import { useCheckingHeads } from '@primes/hooks/qms/checkingHead/useCheckingHeads';
import type { CreateCheckingHeadPayload } from '@primes/types/qms/checkingHead';
import { useCheckingSamples } from '@primes/hooks/qms/checkingSample/useCheckingSamples';
import type { CreateCheckingSamplePayload } from '@primes/types/qms/checkingSample';
import { ChoiceSelectInput } from '../qmsConponent';

// ============================================================================
// 타입 정의
// ============================================================================
interface InspectionMaster {
	workOrderNo?: string;
	itemCode: string;
	itemNumber: string;
	itemName: string;
	lotNumber: string;
	inspectionType: string;
	inspectionDate: string;
	inspectorName?: string;
	notes?: string;
	progressOptions?: { value: string; label: string; progressId: number }[];
	itemId?: number;
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

interface Meta {
	itemId: number;
	itemNumber: string;
	itemName: string;
	progressId: number;
	progressName: string;
	notes?: string;
	inspectionDate: string;
	inspectionTime: string;
	inspectorName: string;
}

// ============================================================================
// 상수 정의
// ============================================================================
const INSPECTION_TYPE = 'PATROL';
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 0;

// ============================================================================
// 유틸리티 함수
// ============================================================================
const getCurrentLocalDateTime = (): string => {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	return `${year}-${month}-${day}T${hours}:${minutes}`;
};

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

const initializeMeasuredValues = (
	sampleQuantity: number = 1
): { [key: string]: number } => {
	const measuredValues: { [key: string]: number } = {};
	for (let i = 1; i <= sampleQuantity; i++) {
		measuredValues[`sample${i}`] = 0;
	}
	return measuredValues;
};

const calculateResults = (
	item: InspectionItem,
	measuredValues: { [key: string]: number | string }
) => {
	const sampleQuantity = item.sampleQuantity || 1;

	// 입력되지 않은 값이 있는지 확인
	for (let i = 1; i <= sampleQuantity; i++) {
		const sampleValue = measuredValues[`sample${i}`];
		if (!sampleValue || sampleValue.toString().trim() === '') {
			return {
				sampleResults: [],
				overallResult: 'NG' as const,
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
			overallResult: undefined,
		};
	}

	const results = values.map((value) => {
		const measuredValue = parseFloat(value.toString());
		const standardValue = parseFloat(item.standardValue.toString()) || 0;
		const specType = item.specType?.toUpperCase();

		let result: 'OK' | 'NG' = 'NG';

		switch (specType) {
			case 'CHOICE':
				// maxValue가 있으면 1일 때 OK, minValue가 있으면 0일 때 NG
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
					const toleranceValue = parseFloat(
						item.tolerance.replace('±', '')
					);
					const diff = Math.abs(measuredValue - standardValue);
					result = diff <= toleranceValue ? 'OK' : 'NG';
				} else if (item.tolerance.includes('≤')) {
					const maxValue = parseFloat(
						item.tolerance.replace('≤', '')
					);
					result = measuredValue <= maxValue ? 'OK' : 'NG';
				} else if (item.tolerance.includes('≥')) {
					const minValue = parseFloat(
						item.tolerance.replace('≥', '')
					);
					result = measuredValue >= minValue ? 'OK' : 'NG';
				}
				break;
		}

		return result;
	});

	// 모든 시료가 합격일 때만 전체 합격
	return {
		sampleResults: results,
		overallResult: results.every((r) => r === 'OK')
			? ('OK' as const)
			: results.some((r) => r === 'NG')
				? ('NG' as const)
				: ('WARNING' as const),
	};
};

// ============================================================================
// 메인 컴포넌트
// ============================================================================
const QualityPatrolInspectionRegisterPage: React.FC = (): JSX.Element => {
	// ========================================================================
	// 기본 훅 및 번역
	// ========================================================================
	const { t } = useTranslation('common');
	const { t: tDatatable } = useTranslation('dataTable');
	const navigate = useNavigate();

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
		inspectionDate: getCurrentLocalDateTime(),
	});

	const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>(
		[]
	);
	const [isLoadingItems, setIsLoadingItems] = useState(false);
	const [selectedProgressId, setSelectedProgressId] = useState<number | null>(
		null
	);
	const [isInitialized, setIsInitialized] = useState(false);

	// ========================================================================
	// API 훅 및 요청 상태
	// ========================================================================
	const [commandSearchRequest, setCommandSearchRequest] =
		useState<CommandSearchRequest | null>(null);
	const { list: commandList } = useCommand({
		searchRequest: commandSearchRequest || { commandNo: '0' },
		page: DEFAULT_PAGE,
		size: 1,
	});

	const [itemProgressSearchRequest, setItemProgressSearchRequest] =
		useState<ItemProgressSearchRequest | null>(null);
	const { list: itemProgressList } = useProgress({
		searchRequest: itemProgressSearchRequest || { itemId: 0 },
		page: DEFAULT_PAGE,
		size: DEFAULT_PAGE_SIZE,
	});

	const [lotSearchRequest, setLotSearchRequest] = useState<{
		lotNo: string;
	} | null>(null);
	const { list: lotList } = useLot({
		searchRequest: lotSearchRequest || { lotNo: '0' },
		page: DEFAULT_PAGE,
		size: 1,
	});

	const [checkingSpecSearchRequest, setCheckingSpecSearchRequest] =
		useState<CheckingSpecSearchRequest | null>(null);
	const { data: checkingSpecs, refetch: refetchCheckingSpecs } =
		useCheckingSpecListQuery({
			searchRequest: checkingSpecSearchRequest || {
				targetId: 0,
				inspectionType: INSPECTION_TYPE,
			},
		});

	const { create: createCheckingHead } = useCheckingHeads({});
	const { create: createCheckingSample } = useCheckingSamples({});

	// ========================================================================
	// 폼 참조
	// ========================================================================
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	// ========================================================================
	// 이벤트 핸들러 - 데이터 조회
	// ========================================================================
	const handleItemSearch = useCallback(
		async (itemId: number) => {
			if (!itemId) return [];

			try {
				setInspectionItems([]);
				setSelectedProgressId(null);

				setItemProgressSearchRequest({
					itemId,
					isUse: true,
					isOutsourcing: false,
				});

				const itemProgressListData = await itemProgressList.refetch();
				const progressData = itemProgressListData.data?.content || [];

				return progressData.map((progress: ItemProgressDto) => ({
					value: progress.id.toString(),
					label:
						progress.progressName ||
						progress.progressTypeName ||
						`${t('tabs.labels.progress')} ${progress.progressOrder}`,
					progressId: progress.id,
				}));
			} catch (error) {
				toast.error(t('inspection.toast.loadError'));
				return [];
			}
		},
		[itemProgressList, t]
	);

	const handleWorkOrderSearch = useCallback(
		async (workOrderNo: string) => {
			if (!workOrderNo?.trim()) return;

			setIsLoadingItems(true);

			try {
				const currentInspectorName = masterData.inspectorName;

				setMasterData((prev) => ({
					...prev,
					workOrderNo: workOrderNo.trim(),
					itemNumber: '',
					itemName: '',
					lotNumber: '',
					progressOptions: [],
					inspectorName: currentInspectorName,
					inspectionDate: getCurrentLocalDateTime(),
				}));

				setCommandSearchRequest({ commandNo: workOrderNo.trim() });
				const response = await commandList.refetch();
				const commandData = response.data?.content || [];

				if (commandData.length === 0) {
					toast.error(t('inspection.toast.workOrderRequired'));
					return;
				}

				const commandInfo = commandData[0];
				const progressOptions = await handleItemSearch(
					commandInfo.itemId
				);

				setMasterData((prev) => ({
					...prev,
					workOrderNo: commandInfo.commandNo,
					itemNumber: commandInfo.itemNumber || '',
					itemName: commandInfo.itemName || '',
					progressOptions,
					itemId: commandInfo.itemId,
				}));

				setIsInitialized(true);
				toast.success(t('inspection.messages.loadSuccess'));
			} catch (error) {
				toast.error(t('inspection.toast.loadError'));
			} finally {
				setIsLoadingItems(false);
			}
		},
		[commandList, handleItemSearch, t, masterData.inspectorName]
	);

	const handleLotSearch = useCallback(
		async (lotNumber: string) => {
			if (!lotNumber?.trim()) return;

			setIsLoadingItems(true);

			try {
				const currentInspectorName = masterData.inspectorName;

				setMasterData((prev) => ({
					...prev,
					workOrderNo: '',
					itemNumber: '',
					itemName: '',
					lotNumber: lotNumber.trim(),
					progressOptions: [],
					inspectorName: currentInspectorName,
					inspectionDate: getCurrentLocalDateTime(),
				}));

				setLotSearchRequest({ lotNo: lotNumber.trim() });
				const lotResponse = await lotList.refetch();
				const lotData = lotResponse.data?.content || [];

				if (lotData.length === 0) {
					toast.error(t('inspection.toast.lotRequired'));
					return;
				}

				const lotInfo = lotData[0];
				const progressOptions = await handleItemSearch(lotInfo.itemId);

				setMasterData((prev) => ({
					...prev,
					lotNumber,
					itemNumber: lotInfo.itemNumber || '',
					itemName: lotInfo.itemName || '',
					progressOptions,
					itemId: lotInfo.itemId,
				}));

				setIsInitialized(true);
				toast.success(t('inspection.messages.loadSuccess'));
			} catch (error) {
				toast.error(t('inspection.toast.loadError'));
			} finally {
				setIsLoadingItems(false);
			}
		},
		[lotList, handleItemSearch, t, masterData.inspectorName]
	);

	const handleProgressChange = useCallback(
		async (progressId: string) => {
			if (!progressId?.trim()) return;

			const progressIdNum = parseInt(progressId);
			if (isNaN(progressIdNum)) return;

			if (formMethodsRef.current) {
				formMethodsRef.current.setValue('itemProgress', progressId);
			}

			try {
				setCheckingSpecSearchRequest({
					targetId: progressIdNum,
					inspectionType: INSPECTION_TYPE,
					isDelete: false,
					isUse: true,
				});

				const checkingSpecsResponse = await refetchCheckingSpecs();
				const specs = checkingSpecsResponse.data?.content || [];

				if (specs.length > 0) {
					const newInspectionItems: InspectionItem[] = specs.map(
						(spec: CheckingSpecData, index: number) => ({
							id: index + 1,
							itemName: spec.checkingName,
							standardValue: spec.standard,
							tolerance: extractToleranceFromMeta(spec.meta),
							unit: spec.standardUnit,
							isRequired: true,
							sortOrder: spec.orderNo || index + 1,
							measuredValues: initializeMeasuredValues(
								spec.sampleQuantity
							),
							specType: spec.specType,
							meta: spec.meta,
							sampleQuantity: spec.sampleQuantity,
						})
					);

					setInspectionItems(newInspectionItems);
					toast.success(t('inspection.messages.loadProgSuccess'));
				} else {
					setInspectionItems([]);
					toast.warning(t('inspection.messages.noSpecs'));
				}
			} catch (error) {
				toast.error(t('inspection.toast.loadError'));
				setInspectionItems([]);
			}
		},
		[refetchCheckingSpecs, t]
	);

	// ========================================================================
	// 이벤트 핸들러 - 측정값 관리
	// ========================================================================
	const handleMeasuredValueChange = useCallback(
		(itemId: number, sampleIndex: number, value: string) => {
			setInspectionItems((prev) =>
				prev.map((item) => {
					if (item.id !== itemId) return item;

					const newMeasuredValues = {
						...item.measuredValues,
						[`sample${sampleIndex}`]: value,
					};

					// 모든 샘플의 결과 계산
					const results = calculateResults(item, newMeasuredValues);

					return {
						...item,
						measuredValues: newMeasuredValues,
						result: results.overallResult,
					};
				})
			);
		},
		[]
	);

	// ========================================================================
	// 샘플 데이터 관련 함수
	// ========================================================================
	const fillSampleData = useCallback(() => {
		const updatedItems = inspectionItems.map((item) => {
			const sampleQuantity = item.sampleQuantity || 1;
			const newMeasuredValues = initializeMeasuredValues(sampleQuantity);

			for (let i = 1; i <= sampleQuantity; i++) {
				const baseValue = parseFloat(item.standardValue.toString());
				let sampleValue: number | string = baseValue;
				const rand = Math.random();

				if (item.specType === 'TOLERANCE') {
					const tolerance = parseFloat(
						item.meta?.tolerance?.toString() || '0'
					);
					if (rand < 0.6) {
						sampleValue =
							baseValue + (Math.random() - 0.5) * tolerance * 0.7;
					} else if (rand < 0.85) {
						sampleValue =
							baseValue + (Math.random() - 0.5) * tolerance * 0.9;
					} else {
						sampleValue =
							baseValue + (Math.random() - 0.5) * tolerance * 1.2;
					}
				} else if (item.specType === 'ONE_SIDED') {
					if (item.meta?.maxValue) {
						const maxValue = item.meta.maxValue;
						if (rand < 0.7) {
							// maxValue 이하의 안전한 값 (70% 확률)
							sampleValue = Math.random() * maxValue * 0.7;
						} else if (rand < 0.9) {
							// maxValue 근처 값 (20% 확률)
							sampleValue =
								maxValue * 0.9 + Math.random() * maxValue * 0.1;
						} else {
							// maxValue보다 큰 값 (10% 확률) - 테스트용
							sampleValue =
								maxValue + Math.random() * maxValue * 0.1;
						}
					} else if (item.meta?.minValue) {
						const minValue = item.meta.minValue;
						if (rand < 0.7) {
							// minValue 이상의 안전한 값 (70% 확률)
							sampleValue =
								minValue + Math.random() * minValue * 0.3;
						} else if (rand < 0.9) {
							// minValue 근처 값 (20% 확률)
							sampleValue =
								minValue + Math.random() * minValue * 0.1;
						} else {
							// minValue보다 작은 값 (10% 확률) - 테스트용
							sampleValue =
								minValue - Math.random() * minValue * 0.1;
						}
					}
				} else if (item.specType === 'RANGE') {
					const minValue = parseFloat(
						item.meta?.minValue?.toString() || '0'
					);
					const maxValue = parseFloat(
						item.meta?.maxValue?.toString() || '0'
					);

					// minValue와 maxValue가 모두 정의되어 있고 유효한 범위인 경우
					if (
						!isNaN(minValue) &&
						!isNaN(maxValue) &&
						maxValue > minValue
					) {
						const range = maxValue - minValue;

						if (rand < 0.6) {
							// 범위 내에서 안전한 값 (60% 확률)
							const randomFactor = Math.random() * 0.8;
							sampleValue = minValue + randomFactor * range;
						} else if (rand < 0.85) {
							// 범위 경계 근처 값 (25% 확률)
							const randomFactor = Math.random() * 0.95;
							sampleValue = minValue + randomFactor * range;
						} else {
							// 범위를 약간 벗어나는 값 (15% 확률) - 테스트용
							const isAboveMax = Math.random() > 0.5;
							if (isAboveMax) {
								const randomFactor = Math.random() * 0.1;
								sampleValue = maxValue + randomFactor * range;
							} else {
								const randomFactor = Math.random() * 0.1;
								sampleValue = minValue - randomFactor * range;
							}
						}
					} else {
						// 유효하지 않은 범위인 경우 기본값 사용
						sampleValue = baseValue;
					}
				} else if (item.specType === 'CHOICE') {
					// maxValue가 있으면 1, minValue가 있으면 0으로 설정
					if (item.meta?.maxValue !== undefined) {
						sampleValue = '1';
					} else if (item.meta?.minValue !== undefined) {
						sampleValue = '0';
					}
				}

				newMeasuredValues[`sample${i}`] = parseFloat(
					sampleValue.toString()
				);
			}
			const results = calculateResults(item, newMeasuredValues);

			return {
				...item,
				measuredValues: newMeasuredValues,
				result: results.overallResult,
			};
		});

		setInspectionItems(updatedItems);
		toast.success(t('inspection.toast.sampleDataSuccess'));
	}, [inspectionItems, calculateResults, t]);

	const clearMeasuredValues = useCallback(() => {
		const clearedItems = inspectionItems.map((item) => ({
			...item,
			measuredValues: initializeMeasuredValues(item.sampleQuantity || 1),
			result: undefined,
		}));
		setInspectionItems(clearedItems);
		toast.success(t('inspection.toast.clearValuesSuccess'));
	}, [inspectionItems, t]);

	// ========================================================================
	// 이벤트 핸들러 - 폼 관리
	// ========================================================================
	const handleFormReady = useCallback(
		(methods: UseFormReturn<Record<string, unknown>>) => {
			formMethodsRef.current = methods;

			methods.watch((value, { name, type }) => {
				if (name === 'itemProgress' && type === 'change') {
					const progressValue = value.itemProgress;
					if (progressValue && typeof progressValue === 'string') {
						const progressId = parseInt(progressValue);
						setSelectedProgressId(progressId);
						methods.setValue('itemProgress', progressValue);
						handleProgressChange(progressValue);
					}
				}
			});
		},
		[handleProgressChange]
	);

	const handleSaveMaster = useCallback(async () => {
		if (!formMethodsRef.current) return;

		const formData = formMethodsRef.current.getValues() as Record<
			string,
			any
		>;

		if (selectedProgressId) {
			const progressOption = masterData.progressOptions?.find(
				(option) => option.progressId === selectedProgressId
			);
			if (progressOption) {
				formData.itemProgress = progressOption.label;
			}
		}

		// 검증
		if (!formData.workOrderNo && !formData.lotNumber) {
			toast.error(t('inspection.toast.workOrderRequired'));
			return;
		}

		if (!formData.itemProgress) {
			toast.error(t('inspection.toast.progressRequired'));
			return;
		}

		if (!formData.inspectorName) {
			toast.error(t('inspection.toast.inspectorNameRequired'));
			return;
		}

		if (!formData.inspectionDate) {
			toast.error(t('inspection.toast.inspectionDateRequired'));
			return;
		}

		const allResultsOK =
			inspectionItems.length > 0 &&
			inspectionItems.every((item) => item.result === 'OK');

		const inspectionDate = formData.inspectionDate.split('T')[0];
		const inspectionTime = formData.inspectionDate.split('T')[1];

		const meta: Meta = {
			itemId: masterData.itemId || 0,
			itemNumber: formData.itemNumber,
			itemName: formData.itemName,
			progressId: selectedProgressId || 0,
			progressName:
				masterData.progressOptions?.find(
					(option) => option.progressId === selectedProgressId
				)?.label || t('tabs.labels.progress'),
			notes: formData.notes || '',
			inspectorName: formData.inspectorName,
			inspectionDate,
			inspectionTime,
		};

		// 시료 값 입력 검증 (REFERENCE 타입 제외)
		const missingSampleValues: string[] = [];
		inspectionItems.forEach((item) => {
			// REFERENCE 타입은 측정값이 필요하지 않으므로 제외
			if (item.specType === 'REFERENCE') {
				return;
			}

			const sampleQuantity = item.sampleQuantity || 1;
			for (let i = 1; i <= sampleQuantity; i++) {
				const sampleValue = item.measuredValues?.[`sample${i}`];
				if (!sampleValue || sampleValue.toString().trim() === '') {
					missingSampleValues.push(`${item.itemName} - 샘플${i}`);
				}
			}
		});

		if (missingSampleValues.length > 0) {
			toast.error(
				`입력되지 않은 시료 값이 있습니다: ${missingSampleValues.length}개`
			);
			return;
		}

		try {
			const createCheckingHeadPayload: CreateCheckingHeadPayload = {
				inspectionType: INSPECTION_TYPE,
				targetId: selectedProgressId || 0,
				targetCode: String(
					formData.workOrderNo || formData.lotNumber || ''
				),
				checkingName: `PATROL_${String(formData.itemName || 'PRODUCT')}_${masterData.progressOptions?.find((option) => option.progressId === selectedProgressId)?.label || 'PROGRESS'}_${new Date().toISOString().split('T')[0]}`,
				isPass: allResultsOK,
				meta: JSON.parse(JSON.stringify(meta)),
			};

			const checkingHeadResult = await createCheckingHead.mutateAsync([
				createCheckingHeadPayload,
			]);

			if (checkingHeadResult && checkingHeadResult.length > 0) {
				const checkingHeadId = checkingHeadResult[0].id;

				const createCheckingSamplePayloads: CreateCheckingSamplePayload[] =
					[];
				inspectionItems.forEach((item) => {
					// REFERENCE 타입은 측정값이 필요하지 않으므로 제외
					if (item.specType === 'REFERENCE') {
						return;
					}

					const sampleQuantity = item.sampleQuantity || 1;

					// meta 데이터 생성 (specType별로 필요한 값들만 포함)
					const metaData: any = {
						specType: item.specType,
					};

					// specType별로 필요한 값들 추가
					if (
						item.specType === 'TOLERANCE' &&
						item.meta?.tolerance !== undefined
					) {
						metaData.tolerance = item.meta.tolerance;
					} else if (item.specType === 'ONE_SIDED') {
						if (item.meta?.maxValue !== undefined) {
							metaData.maxValue = item.meta.maxValue;
						}
						if (item.meta?.minValue !== undefined) {
							metaData.minValue = item.meta.minValue;
						}
					} else if (item.specType === 'RANGE') {
						if (item.meta?.maxValue !== undefined) {
							metaData.maxValue = item.meta.maxValue;
						}
						if (item.meta?.minValue !== undefined) {
							metaData.minValue = item.meta.minValue;
						}
					} else if (item.specType === 'CHOICE') {
						if (item.meta?.maxValue !== undefined) {
							metaData.maxValue = item.meta.maxValue;
						}
						if (item.meta?.minValue !== undefined) {
							metaData.minValue = item.meta.minValue;
						}
					}

					metaData.specType = item.specType;

					// 실제 샘플 수량만큼만 등록
					for (let i = 1; i <= sampleQuantity; i++) {
						const sampleValue = item.measuredValues[`sample${i}`];
						if (sampleValue !== '' && sampleValue !== undefined) {
							createCheckingSamplePayloads.push({
								checkingHeadId,
								sampleIndex: i,
								measuredValue: parseFloat(
									sampleValue.toString()
								),
								measureUnit: item.unit || '',
								isPass: item.result === 'OK',
								checkingName: item.itemName,
								orderNo: item.sortOrder,
								standard: item.standardValue?.toString() || '',
								standardUnit: item.unit || '',
								meta: JSON.stringify(metaData),
							});
						}
					}
				});

				await createCheckingSample.mutateAsync(
					createCheckingSamplePayloads
				);

				toast.success(t('inspection.toast.saveInspectionSuccess'));
				navigate(`/quality/patrol-inspection/list`);
			}
		} catch (error) {
			toast.error(t('inspection.toast.saveInspectionError'));
		}
	}, [
		inspectionItems,
		selectedProgressId,
		createCheckingHead,
		createCheckingSample,
		navigate,
		masterData.progressOptions,
		masterData.itemId,
		t,
	]);

	const handleResetMaster = useCallback(() => {
		if (formMethodsRef.current) {
			formMethodsRef.current.reset();
		}
		setMasterData({
			workOrderNo: '',
			itemCode: '',
			itemNumber: '',
			itemName: '',
			lotNumber: '',
			inspectorName: masterData.inspectorName,
			inspectionType: INSPECTION_TYPE,
			inspectionDate: getCurrentLocalDateTime(),
			progressOptions: [],
		});
		setInspectionItems([]);
		setSelectedProgressId(null);
		setIsInitialized(false);

		setCommandSearchRequest(null);
		setItemProgressSearchRequest(null);
		setLotSearchRequest(null);
	}, [masterData.inspectorName]);

	const handleBack = useCallback(() => {
		navigate('/quality/patrol-inspection/list');
	}, [navigate]);

	// ========================================================================
	// 컴포넌트 및 설정
	// ========================================================================
	// 모든 입력 필드의 ref를 저장할 배열
	const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

	const MeasuredValueInput = useMemo(
		() =>
			React.memo(
				({
					item,
					sampleIndex,
					onValueChange,
					onTabNext,
				}: {
					item: InspectionItem;
					sampleIndex: number;
					onValueChange: (value: string) => void;
					onTabNext?: () => void;
				}) => {
					const [localValue, setLocalValue] = useState(
						item.measuredValues?.[`sample${sampleIndex}`] || ''
					);

					const handleChange = useCallback(
						(e: React.ChangeEvent<HTMLInputElement>) => {
							setLocalValue(e.target.value);
						},
						[]
					);

					const handleBlur = useCallback(
						(e: React.FocusEvent<HTMLInputElement>) => {
							onValueChange(e.target.value);
						},
						[onValueChange]
					);

					const handleFocus = useCallback(
						(e: React.FocusEvent<HTMLInputElement>) => {
							e.target.select();
						},
						[]
					);

					const handleKeyDown = useCallback(
						(e: React.KeyboardEvent<HTMLInputElement>) => {
							if (e.key === 'Tab') {
								e.preventDefault();
								e.stopPropagation();
								onValueChange(e.currentTarget.value);
								if (onTabNext) {
									// 약간의 지연을 두어 현재 값이 업데이트된 후 다음 필드로 이동
									setTimeout(() => {
										onTabNext();
									}, 0);
								}
							}
						},
						[onValueChange, onTabNext, item.id, sampleIndex]
					);

					// item.measuredValues가 변경될 때 localValue 업데이트
					useEffect(() => {
						setLocalValue(
							item.measuredValues?.[`sample${sampleIndex}`] || ''
						);
					}, [item.measuredValues, sampleIndex]);

					return (
						<input
							ref={(el) => {
								inputRefs.current[
									`${item.id}-sample${sampleIndex}`
								] = el;
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
							placeholder={t(
								'inspection.inspectionItems.measuredValue'
							)}
						/>
					);
				}
			),
		[t]
	);

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
						<span
							className={`px-2 py-1 rounded text-xs ${
								isRequired
									? 'bg-red-100 text-red-800'
									: 'bg-gray-100 text-gray-800'
							}`}
						>
							{isRequired
								? t('inspection.inspectionItems.required')
								: t('common.cancel')}
						</span>
					);
				},
			},
		];

		const maxSampleQuantity = Math.max(
			...inspectionItems.map((item) => item.sampleQuantity || 1)
		);

		const sampleColumns = Array.from(
			{ length: maxSampleQuantity },
			(_, index) => ({
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

					// REFERENCE 타입인 경우 입력 필드를 생성하지 않음
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
								onValueChange={(value) =>
									handleMeasuredValueChange(
										item.id,
										sampleIndex,
										value
									)
								}
							/>
						);
					}

					// Tab 키를 눌렀을 때 다음 입력 필드로 넘어가는 함수
					const handleTabNext = () => {
						const currentRowIndex = inspectionItems.findIndex(
							(inspItem) => inspItem.id === item.id
						);
						const nextSampleIndex = sampleIndex + 1;

						// 같은 항목의 다음 샘플이 있는 경우
						if (nextSampleIndex <= quantity) {
							const nextInput =
								inputRefs.current[
									`${item.id}-sample${nextSampleIndex}`
								];
							if (nextInput) {
								nextInput.focus();
								return;
							}
						}

						// 다음 항목의 첫 번째 샘플로 이동
						if (currentRowIndex < inspectionItems.length - 1) {
							const nextItem =
								inspectionItems[currentRowIndex + 1];
							if (
								nextItem &&
								nextItem.sampleQuantity &&
								nextItem.sampleQuantity > 0
							) {
								const nextInput =
									inputRefs.current[`${nextItem.id}-sample1`];
								if (nextInput) {
									nextInput.focus();
									return;
								}
							}
						}

						// 마지막 항목이면 첫 번째 항목의 첫 번째 샘플로 이동
						if (inspectionItems.length > 0) {
							const firstItem = inspectionItems[0];
							if (
								firstItem &&
								firstItem.sampleQuantity &&
								firstItem.sampleQuantity > 0
							) {
								const firstInput =
									inputRefs.current[
										`${firstItem.id}-sample1`
									];
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
							onValueChange={(value) =>
								handleMeasuredValueChange(
									item.id,
									sampleIndex,
									value
								)
							}
							onTabNext={handleTabNext}
						/>
					);
				},
			})
		);

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
		};

		const referenceColumn = {
			accessorKey: 'referenceNote',
			header: tDatatable('columns.precautions'),
			size: 150,
			cell: ({ row }: { row: any }) => (
				<div>{row.original.meta?.referenceNote || '-'}</div>
			),
		};

		return [
			...baseColumns,
			...sampleColumns,
			resultColumn,
			referenceColumn,
		];
	}, [inspectionItems, t, MeasuredValueInput, handleMeasuredValueChange]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		inspectionItems,
		itemColumns,
		DEFAULT_PAGE_SIZE,
		DEFAULT_PAGE,
		0,
		inspectionItems.length
	);

	const masterFormFields = useMemo(
		() => [
			{
				name: 'workOrderNo',
				label: t('inspection.form.workOrderNoLabel'),
				type: 'inputButton',
				placeholder: '예: WO-240125-001',
				buttonText: t('inspection.actions.search'),
				buttonIcon: <Search size={16} />,
				buttonDisabled: isLoadingItems,
				onButtonClick: handleWorkOrderSearch,
				tabIndex: -1,
			},
			{
				name: 'lotNumber',
				label: t('inspection.form.lotNumberLabel'),
				type: 'inputButton',
				placeholder: '예: LOT-240125-002',
				buttonText: t('inspection.actions.search'),
				buttonIcon: <Search size={16} />,
				buttonDisabled: isLoadingItems,
				onButtonClick: handleLotSearch,
				tabIndex: -1,
			},
			{
				name: 'itemNumber',
				label: t('inspection.form.itemNumberLabel'),
				type: 'text',
				disabled: true,
				tabIndex: -1,
			},
			{
				name: 'itemName',
				label: t('inspection.form.itemNameLabel'),
				type: 'text',
				disabled: true,
				tabIndex: -1,
			},
			{
				name: 'itemProgress',
				label: t('inspection.form.progressLabel'),
				type: 'select',
				disabled: false,
				options: masterData.progressOptions || [],
				onChange: (value: string) => {
					setSelectedProgressId(parseInt(value));
					if (formMethodsRef.current) {
						formMethodsRef.current.setValue('itemProgress', value);
					}
					handleProgressChange(value);
				},
				tabIndex: -1,
			},
			{
				name: 'inspectionDate',
				label: t('inspection.form.inspectionDateLabel'),
				type: 'datetime',
				required: true,
				tabIndex: -1,
			},
			{
				name: 'inspectorName',
				label: t('inspection.form.inspectorNameLabel'),
				type: 'text',
				required: true,
				tabIndex: -1,
			},
			{
				name: 'notes',
				label: t('inspection.form.notesLabel'),
				type: 'textarea',
				placeholder: t('inspection.form.notesPlaceholder'),
				tabIndex: -1,
			},
		],
		[
			masterData.progressOptions,
			isLoadingItems,
			handleWorkOrderSearch,
			handleLotSearch,
			handleProgressChange,
			t,
		]
	);

	// ========================================================================
	// 이펙트
	// ========================================================================
	useEffect(() => {
		if (isInitialized && selectedProgressId && !isLoadingItems) {
			handleProgressChange(selectedProgressId.toString());
		}
	}, [
		selectedProgressId,
		handleProgressChange,
		isLoadingItems,
		isInitialized,
	]);

	useEffect(() => {
		if (formMethodsRef.current && isInitialized) {
			const currentFormData = formMethodsRef.current.getValues();
			const currentInspectorName =
				currentFormData.inspectorName || masterData.inspectorName;
			const currentItemProgress = currentFormData.itemProgress || '';

			formMethodsRef.current.reset({
				workOrderNo: masterData.workOrderNo,
				lotNumber: masterData.lotNumber,
				itemNumber: masterData.itemNumber,
				itemName: masterData.itemName,
				itemProgress: currentItemProgress,
				inspectionDate: getCurrentLocalDateTime(),
				inspectorName: currentInspectorName,
				notes: masterData.notes || '',
			});
		}
	}, [
		masterData.itemNumber,
		masterData.itemName,
		isInitialized,
		masterData.inspectorName,
	]);

	// 컴포넌트 언마운트 시 ref 정리
	useEffect(() => {
		return () => {
			inputRefs.current = {};
		};
	}, []);

	// ========================================================================
	// 렌더링
	// ========================================================================
	return (
		<div className="max-w-full mx-auto p-4 h-full flex flex-col">
			<h1 className="text-xl font-bold mt-2 mb-3">
				{t('inspection.patrol.formTitle')}
			</h1>

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
						className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-white hover:bg-gray-50"
						onClick={handleResetMaster}
						tabIndex={-1}
					>
						{t('inspection.actions.reset')}
					</RadixButton>
					<RadixButton
						className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700"
						onClick={handleSaveMaster}
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
				{/* 왼쪽: 검사 기본 정보 */}
				<div className="border rounded-lg h-full overflow-auto">
					<div className="p-4 border-b">
						<h2 className="text-lg font-semibold">
							{t('inspection.form.title')}
						</h2>
					</div>
					<div className="p-4">
						<DynamicForm
							key="quality-patrol-inspection-form"
							fields={masterFormFields}
							onSubmit={() => {}}
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
								{t('inspection.inspectionItems.title')}
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
										{t('inspection.messages.loading')}
									</div>
								)}
								{inspectionItems.length > 0 && (
									<>
										<button
											onClick={fillSampleData}
											className="px-3 py-1 text-xs bg-Colors-Brand-50 hover:bg-Colors-Brand-100 text-Colors-Brand-700 rounded border transition-colors"
											title={t(
												'inspection.actions.sampleData'
											)}
											tabIndex={-1}
										>
											{t('inspection.actions.sampleData')}
										</button>
										<button
											onClick={clearMeasuredValues}
											className="px-3 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded border transition-colors"
											title={t(
												'inspection.actions.clearValues'
											)}
											tabIndex={-1}
										>
											{t(
												'inspection.actions.clearValues'
											)}
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
									<p>{t('inspection.messages.noItems')}</p>
									<p>{t('inspection.messages.loadItems')}</p>
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

export default QualityPatrolInspectionRegisterPage;
