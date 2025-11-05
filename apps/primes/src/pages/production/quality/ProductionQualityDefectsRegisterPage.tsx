import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';
import { useCreateDefectRecord } from '@primes/hooks/production/defectRecord/useCreateDefectRecord';
import { useUpdateDefectRecord } from '@primes/hooks/production/defectRecord/useUpdateDefectRecord';
import { useDefectRecords } from '@primes/hooks/production/defectRecord/useDefectRecord';
import { useItems } from '@primes/hooks/init/useItems';
import { mapDefectRecordToCreateRequest, mapDefectRecordDtoToDefectRecord,DefectStatus,DefectSeverity } from '@primes/types/production/defectTypes';
import type { DefectRecordCreateRequest, DefectRecordUpdateRequest } from '@primes/types/production/defectTypes';
import type { ItemDto } from '@primes/types/item';
import { getCodeFieldName } from '@primes/services/init/codeService';
import LotSearchInput from '@primes/components/common/search/LotSearchInput';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface DefectRegisterData {
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
	defectQuantity?: number;
	expectedLoss?: number;
	expectedLossCurrency?: string;
	reportDate: string;
	reportedBy: string;
	severity: DefectSeverity;
	status: DefectStatus;
	assignedTo: string;
	dueDate: string;
	actionPlanDescription?: string;
	lotNo?: string;
	itemProgressId?: number;
	progressName?: string;
}

interface ProductionQualityDefectsRegisterPageProps {
	mode?: 'create' | 'edit';
	data?: Partial<DefectRegisterData>;
	defectRecordId?: number; // 수정 모드일 때 사용
	onClose?: () => void;
	onSave?: (data: DefectRegisterData) => void;
}

const ProductionQualityDefectsRegisterPage: React.FC<
	ProductionQualityDefectsRegisterPageProps
> = ({ mode = 'create', data, defectRecordId, onClose, onSave }) => {
	const { t } = useTranslation('common');
	const queryClient = useQueryClient();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [progressOptions, setProgressOptions] = useState<Array<{label: string, value: string, progressName?: string}>>([]);

	// API 훅 사용
	const createDefectRecordMutation = useCreateDefectRecord();
	const updateDefectRecordMutation = useUpdateDefectRecord();
	const { list: existingDefectRecordQuery } = useDefectRecords(
		{
			searchRequest: {
				id: defectRecordId || 0,
			},
		}
	);
	const { data: existingDefectRecord } = existingDefectRecordQuery;
	
	// 제품 목록 조회
	const { data: itemsResponse, isLoading: isLoadingItems } = useItems({
		searchRequest: {},
		size: 100,
	});


	// 불량코드 자동 생성
	const generateDefectCode = () => {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
		return `DEF-${year}${month}${day}-${time}`;
	};

	const handleLotSearch = useCallback(async (data: any): Promise<void> => {
		console.log('LOT 검색 데이터:', data);
		if (!data.lotNo) return;
		
		try {
			// 폼 메소드가 준비되었는지 확인
			if (formMethods) {
				// LOT 번호 설정
				if (data.lotNo) formMethods.setValue('lotNo', data.lotNo);
				
				// 제품 정보 설정
				if (data.itemId) formMethods.setValue('itemId', data.itemId);
				if (data.itemNo) formMethods.setValue('itemNo', data.itemNo);
				if (data.itemNumber) formMethods.setValue('itemNumber', data.itemNumber);
				if (data.itemName) formMethods.setValue('itemName', data.itemName);
				
				console.log('제품 정보 설정 완료:', {
					lotNo: data.lotNo,
					itemId: data.itemId,
					itemNo: data.itemNo,
					itemNumber: data.itemNumber,
					itemName: data.itemName
				});
			}
			
			// 공정 옵션 설정
			if (data.progressList && Array.isArray(data.progressList)) {
				const options = data.progressList.map((progress: any) => ({
					label: progress.progressName || progress.name || `공정 ${progress.id}`,
					value: progress.progressId || progress.id,
					progressName: progress.progressName || progress.name
				}));
				setProgressOptions(options);
				console.log('공정 옵션 설정:', options);
			}
			
			toast.success('LOT 정보를 불러왔습니다.');
		} catch (error) {
			console.error('LOT 검색 오류:', error);
			toast.error('LOT 정보를 불러오는데 실패했습니다.');
		}
	}, [formMethods]);

	const handleLotNotFound = () => {
		console.log('작지번호 검색 결과 없음');
	};

	// 폼 필드 정의
	const formFields: FormField[] = [
		// === 기본 정보 (필수) ===
		{
			name: 'defectCode',
			label: '불량코드',
			type: 'text',
			required: true,
			placeholder: '불량코드 (자동생성)',
			disabled: mode === 'edit', // 수정 시에는 변경 불가
		},
		{
			name: 'LotSearchInput',
			label: 'LOT-NO',
			type: 'custom',
			component: (
				<LotSearchInput
					onLotFound={handleLotSearch}
					onLotNotFound={handleLotNotFound}
					loadProgressData={true}
					placeholder="예: 2501010001-001"
				/>
			),
		},
		{
			name: 'itemProgressId',
			label: '공정 선택',
			type: 'select',
			required: false,
			placeholder: '공정을 선택하세요',
			options: progressOptions,
		},
		{
			name: 'status',
			label: '상태',
			type: 'select' as const,
			required: true,
			options: [
				{ label: '신규', value: 'OPEN' },
				{ label: '조사중', value: 'INVESTIGATING' },
				{ label: '해결됨', value: 'RESOLVED' },
				{ label: '종료', value: 'CLOSED' },
			],
		},
		// === 제품 정보 ===
		{
			name: 'itemNumber',
			label: '제품번호',
			type:  'text' ,
			required: true,
			placeholder:  '제품번호',
			readOnly: true, // 수정 시에는 읽기 전용
		},
		{
			name: 'itemName',
			label: '제품명',
			type: 'text',
			required: true,
			placeholder: '제품명',
			readOnly: true, // 자동으로 설정되므로 읽기 전용
		},
		// 숨겨진 아이템 관련 필드들
		{
			name: 'itemId',
			label: 'Item ID',
			type: 'hidden',
		},
		{
			name: 'itemNo',
			label: 'Item No',
			type: 'hidden',
		},
		{
			name: 'lotNo',
			label: 'LOT NO',
			type: 'hidden',
		},
		{
			name: 'progressName',
			label: 'Progress Name',
			type: 'hidden',
		},
		
		// === 불량 상세 정보 ===
		{
			name: 'defectType',
			label: '불량 유형',
			type: 'codeSelect',
			required: true,
			fieldKey: 'QTY-001',
			valueKey: 'codeName', // label을 value로 사용
			labelKey: 'codeName', // label도 codeName 사용
		},
		{
			name: 'defectTypeCode',
			label: '불량 유형 코드',
			type: 'hidden',
		},
		{
			name: 'defectReason',
			label: '불량 사유',
			type: 'codeSelect',
			required: true,
			fieldKey: 'QTY-002',
			valueKey: 'codeName', // label을 value로 사용
			labelKey: 'codeName', // label도 codeName 사용
		},
		{
			name: 'defectReasonCode',
			label: '불량 원인 코드',
			type: 'hidden',
		},
		{
			name: 'severity',
			label: '심각도',
			type: 'select',
			required: false,
			options: [
				{ label: '높음', value: 'HIGH' },
				{ label: '중간', value: 'MEDIUM' },
				{ label: '낮음', value: 'LOW' },
			],
		},
		{
			name: 'defectDescription',
			label: '불량 내용',
			type: 'textarea',
			required: false,
			placeholder: '불량 내용을 기술하세요',
			rows: 2,
		},
		
		// === 수량 및 손실 정보 ===
		{
			name: 'defectQuantity',
			label: '불량 수량',
			type: 'number',
			placeholder: '불량 수량을 입력하세요',
		},
		{
			name: 'expectedLoss',
			label: '예상 손실 금액',
			type: 'number',
			placeholder: '예상 손실 금액을 입력하세요',
		},
		{
			name: 'expectedLossCurrency',
			label: '화폐 단위',
			type: 'select',
			options: [
				{ label: '원(KRW)', value: 'KRW' },
				{ label: '달러(USD)', value: 'USD' },
				{ label: '엔(JPY)', value: 'JPY' },
				{ label: '유로(EUR)', value: 'EUR' },
			],
		},
		
		// === 처리 정보 ===
		{
			name: 'reportedBy',
			label: '신고자',
			type: 'text',
			placeholder: '신고자명을 입력하세요',
		},
		{
			name: 'reportDate',
			label: '신고일',
			type: 'date',
		},
		{
			name: 'assignedTo',
			label: '담당자',
			type: 'text',
			placeholder: '담당자를 지정하세요',
		},
		{
			name: 'dueDate',
			label: '완료예정일',
			type: 'date',
			placeholder: '완료예정일을 선택하세요',
		},
		{
			name: 'actionPlanDescription',
			label: '조치내용',
			type: 'textarea' as const,
			placeholder: '취한 조치사항을 입력하세요',
			rows: 3,
		}
	];

	const handleSubmit = async (data: Record<string, unknown>) => {
		if (isSubmitting) return;

		setIsSubmitting(true);
		try {
			// 데이터 검증 및 변환
			const defectData: DefectRegisterData = {
				defectCode: String(data.defectCode || ''),
				itemId: Number(data.itemId || 0),
				itemNo: Number(data.itemNo || 0),
				itemNumber: String(data.itemNumber || ''),
				itemName: String(data.itemName || ''),
				defectType: String(data.defectType || ''),
				defectTypeCode: data.defectTypeCode ? String(data.defectTypeCode) : undefined,
				defectReason: String(data.defectReason || ''),
				defectReasonCode: data.defectReasonCode ? String(data.defectReasonCode) : undefined,
				defectDescription: String(data.defectDescription || ''),
				defectQuantity: data.defectQuantity ? Number(data.defectQuantity) : undefined,
				expectedLoss: data.expectedLoss ? Number(data.expectedLoss) : undefined,
				expectedLossCurrency: data.expectedLossCurrency ? String(data.expectedLossCurrency) : undefined,
				reportDate: String(data.reportDate || ''),
				reportedBy: String(data.reportedBy || ''),
				severity: (data.severity as DefectSeverity) || 'MEDIUM',
				status: String(data.status || 'OPEN') as DefectStatus,
				assignedTo: String(data.assignedTo || ''),
				dueDate: String(data.dueDate || ''),
				actionPlanDescription: data.actionPlanDescription ? String(data.actionPlanDescription) : undefined,
				lotNo: data.lotNo ? String(data.lotNo) : undefined,
				itemProgressId: data.itemProgressId ? Number(data.itemProgressId) : undefined,
				progressName: data.progressName ? String(data.progressName) : undefined,
			};

			// API 호출
			if (mode === 'create') {
				// 생성 모드: 상태를 'OPEN'으로 고정
				defectData.status = 'OPEN';
				const createRequest: DefectRecordCreateRequest = mapDefectRecordToCreateRequest(defectData);

				await createDefectRecordMutation.mutateAsync([createRequest]);
			} else if (mode === 'edit' && defectRecordId) {
				// 수정 모드: 사용자가 선택한 상태 사용
				const updateRequest: DefectRecordUpdateRequest = mapDefectRecordToCreateRequest(defectData);
				await updateDefectRecordMutation.mutateAsync({ id: defectRecordId, data: updateRequest });
			}

			// 쿼리 무효화로 데이터 새로고침
			await queryClient.invalidateQueries({
				queryKey: ['defectRecords']
			});

			// 성공 메시지
			toast.success(mode === 'create' ? '불량 기록이 등록되었습니다.' : '불량 기록이 수정되었습니다.');

			// 콜백 호출
			if (onSave) {
				onSave(defectData);
			}

			// 모달 닫기
			if (onClose) {
				onClose();
			}
		} catch (error) {
			console.error('불량 신고 저장 오류:', error);
			alert('저장 중 오류가 발생했습니다.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	// 제품 선택 시 관련 필드 자동 설정을 위한 watch
	useEffect(() => {
		if (formMethods) {
			const subscription = formMethods.watch((value, { name }): void => {
				console.log('필드 변경 감지:', name, value);
				if (name === 'itemNumber' && value.itemNumber) {
					console.log('제품번호 선택됨:', value.itemNumber);
					const selectedItem = itemsResponse?.content?.find((item: ItemDto) => item.itemNumber === value.itemNumber);
					console.log('선택된 제품:', selectedItem);
					if (selectedItem) {
						// 아이템 관련 필드들 모두 설정
						formMethods.setValue('itemId', selectedItem.id);
						formMethods.setValue('itemNo', selectedItem.itemNo);
						formMethods.setValue('itemName', selectedItem.itemName);
						console.log('제품 정보 설정 완료:', {
							itemId: selectedItem.id,
							itemNo: selectedItem.itemNo,
							itemName: selectedItem.itemName
						});
					}
				}
				
				// 공정 선택 시 공정명 설정
				if (name === 'itemProgressId' && value.itemProgressId) {
					const selectedProgress = progressOptions.find(option => option.value === value.itemProgressId);
					if (selectedProgress && selectedProgress.progressName) {
						formMethods.setValue('progressName', selectedProgress.progressName);
						console.log('공정명 설정:', selectedProgress.progressName);
					}
				}
			});
			
			// cleanup 함수에서 구독 해제
			subscription.unsubscribe();
			return;
		}
	}, [formMethods, itemsResponse, progressOptions]);

	// CodeSelect 필드 변경 감지 및 코드 필드 업데이트
	useEffect(() => {
		if (formMethods) {
			const subscription = formMethods.watch(async (value, { name }): Promise<void> => {
				// defectType 변경 시 해당하는 codeValue를 찾아서 defectTypeCode에 저장
				if (name === 'defectType' && value.defectType) {
					try {
						// QTY-001 코드 데이터를 가져와서 선택된 codeName에 해당하는 codeValue 찾기
						const codeData = await getCodeFieldName('QTY-001');
						const selectedCode = codeData.find((item: any) => item.codeName === value.defectType);
						if (selectedCode) {
							formMethods.setValue('defectTypeCode', selectedCode.codeValue);
						}
					} catch (error) {
						console.error('defectType 코드 조회 오류:', error);
					}
				}
				
				// defectReason 변경 시 해당하는 codeValue를 찾아서 defectReasonCode에 저장
				if (name === 'defectReason' && value.defectReason) {
					try {
						// QTY-002 코드 데이터를 가져와서 선택된 codeName에 해당하는 codeValue 찾기
						const codeData = await getCodeFieldName('QTY-002');
						const selectedCode = codeData.find((item: any) => item.codeName === value.defectReason);
						if (selectedCode) {
							formMethods.setValue('defectReasonCode', selectedCode.codeValue);
						}
					} catch (error) {
						console.error('defectReason 코드 조회 오류:', error);
					}
				}
			});
			
			// cleanup 함수에서 구독 해제
			subscription.unsubscribe();
			return;
		}
	}, [formMethods]);

	useEffect(() => {
		if (formMethods) {
			if (mode === 'edit') {
				// 수정 모드: API에서 로드된 데이터가 있으면 사용, 없으면 props로 전달된 data 사용
				const formData = existingDefectRecord?.data?.content?.[0]
					? mapDefectRecordDtoToDefectRecord(existingDefectRecord.data.content[0] as any)
					: data;
				
				if (formData) {
					formMethods.reset(formData as Record<string, unknown>);
				}
			} else if (mode === 'create') {
				// 생성 모드: 불량코드 자동 생성 및 기본값 설정
				const today = new Date().toISOString().split('T')[0];
				formMethods.reset({
					defectCode: generateDefectCode(),
					reportDate: today,
					severity: 'MEDIUM',
					status: 'OPEN',
					expectedLossCurrency: 'KRW', // 기본 화폐 단위
				});
			}
		}
	}, [mode, data, formMethods, existingDefectRecord]);

	// 로딩 상태 처리
	if (isLoadingItems) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">
						{isLoadingItems ? '제품 목록을 불러오는 중...' : '불량 기록을 불러오는 중...'}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-h-[80vh] overflow-y-auto">
			<div className="p-4">
				<DynamicForm
					fields={formFields.map((field) => ({
						...field,
						disabled: isSubmitting || createDefectRecordMutation.isPending || updateDefectRecordMutation.isPending,
					}))}
					onSubmit={handleSubmit}
					onFormReady={handleFormReady}
					submitButtonText={
						isSubmitting || createDefectRecordMutation.isPending || updateDefectRecordMutation.isPending
							? '저장 중...'
							: mode === 'create'
								? '등록'
								: '수정'
					}
					visibleSaveButton={true}
				/>
			</div>
		</div>
	);
};

export default ProductionQualityDefectsRegisterPage;
