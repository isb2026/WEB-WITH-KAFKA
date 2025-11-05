import { useState, useEffect, useRef, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DraggableDialog } from '@radix-ui/components';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';
import { useLotWithConditions } from '@primes/hooks/production/useLot';
import { useCreateWorkingInLot, useUpdateWorkingInLot } from '@primes/hooks/production/useWorkingInLot';
import { WorkingInLotCreateRequest, WorkingInLotUpdateRequest } from '@primes/types/production';
import { CheckCircle, Circle, Package, Calendar, Scale, Hash, Plus, X } from 'lucide-react';

// 로트별 투입 정보 타입 정의
interface LotInputInfo {
	useAmount: number;
	useWeight: number;
	inputDate: string;
}

// 선택된 로트 데이터 타입 정의
interface SelectedLotData {
	lotId: string;
	lotNo: string;
	itemId: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	restAmount: number;
	restWeight: number;
	lotUnit: string;
	inputInfo: LotInputInfo;
}

interface MaterialOutgoingAddModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedCommandData?: any;
	lotSearchArray?: { itemId: number; itemProgressId: number } | null;
	onSuccess?: () => void;
	// 수정 기능 추가
	isEditMode?: boolean;
	editData?: any;
	// 배치 모드 추가
	isBatchMode?: boolean;
}

export const MaterialOutgoingAddModal: React.FC<MaterialOutgoingAddModalProps> = ({
	open,
	onOpenChange,
	selectedCommandData,
	lotSearchArray = null,
	onSuccess,
	// 수정 관련 props
	isEditMode = false,
	editData = null,
	// 배치 모드 추가
	isBatchMode = false,
}) => {
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<Record<string, unknown>> | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<Record<string, unknown>> | null>(null);
	const localInputRefs = useRef<Record<string, { useAmount: number; useWeight: number; inputDate: string }>>({});

	// WorkingInLot 생성 mutation 훅
	const createWorkingInLotMutation = useCreateWorkingInLot();
	// 수정용 mutation 추가
	const updateWorkingInLotMutation = useUpdateWorkingInLot();
	
	// LOT 조건부 검색 훅 사용
	const [lotSearchConditions, setLotSearchConditions] = useState<any>(null);
	const { list: lotSearchList } = useLotWithConditions({
		searchRequest: useMemo(() => {
			if (isEditMode && editData?.inLotNo) {
				return {
					lotNo: editData.inLotNo
				};
			} else if (lotSearchArray) {
				return {
					progressId: lotSearchArray.itemProgressId,
					itemId: lotSearchArray.itemId
				};
			}
			return {};
		}, [isEditMode, editData?.inLotNo, lotSearchArray]),
		page: 0,
		size: 100
	});

	// ===== 1단계: 상태 관리 시스템 =====
	// 선택된 로트들을 관리하는 상태 (로트 ID를 키로 사용)
	const [selectedLots, setSelectedLots] = useState<Record<string, SelectedLotData>>({});
	
	// 선택된 로트의 투입 정보를 관리하는 상태
	const [lotInputInfos, setLotInputInfos] = useState<Record<string, LotInputInfo>>({});
	
	// 배치 모드 상태
	const [isBatchModeActive, setIsBatchModeActive] = useState(isBatchMode);

	// 모달이 열릴 때마다 선택된 로트 초기화
	useEffect(() => {
		if (open) {
			setSelectedLots({});
			setLotInputInfos({});
		}
	}, [open]);

	// 모달이 열릴 때마다 LOT 데이터 새로고침
	useEffect(() => {
		if (open && lotSearchConditions) {
			lotSearchList.refetch?.();
		}
	}, [open, lotSearchConditions, lotSearchList]);

	// LOT 옵션 생성 함수 - 실제 API 데이터 기반
	const generateLotOptions = useMemo(() => {
		if (lotSearchList.data?.content && Array.isArray(lotSearchList.data?.content) && lotSearchList.data?.content.length > 0) {
			return lotSearchList.data?.content.map((lot: any) => ({
				label: lot.lotNo + ' (' + lot.itemNumber + ' / ' + lot.itemName + ')',
				value: lot.lotNo,
				// 추가 데이터를 옵션에 포함
				itemId: lot.itemId,
				itemNumber: lot.itemNumber,
				itemName: lot.itemName,
				itemSpec: lot.itemSpec,
			}));
		} else {
			return [];
		}
	}, [lotSearchList.data?.content]);

	// 로트 선택 핸들러 (배치 모드용)
	const handleLotSelect = (lotId: string, lotData: any) => {
		const lotNo = lotData.lotNo;
		
		setSelectedLots(prev => ({
			...prev,
			[lotId]: {
				lotId,
				lotNo,
				itemId: lotData.itemId,
				itemNumber: lotData.itemNumber,
				itemName: lotData.itemName,
				itemSpec: lotData.itemSpec,
				restAmount: lotData.restAmount || 0,
				restWeight: lotData.restWeight || 0,
				lotUnit: lotData.lotUnit || '',
				inputInfo: {
					useAmount: 0,
					useWeight: 0,
					inputDate: new Date().toISOString().split('T')[0]
				}
			}
		}));
		
		// 투입 정보 초기화
		setLotInputInfos(prev => ({
			...prev,
			[lotId]: {
				useAmount: 0,
				useWeight: 0,
				inputDate: new Date().toISOString().split('T')[0]
			}
		}));
	};

	// 로트 투입 정보 업데이트 핸들러
	const handleLotInputInfoUpdate = (lotId: string, field: keyof LotInputInfo, value: string | number) => {
		setLotInputInfos(prev => ({
			...prev,
			[lotId]: {
				...prev[lotId],
				[field]: value
			}
		}));
	};

	// 로트 선택 해제 핸들러
	const handleLotDeselect = (lotId: string) => {
		setSelectedLots(prev => {
			const newSelectedLots = { ...prev };
			delete newSelectedLots[lotId];
			return newSelectedLots;
		});
		
		setLotInputInfos(prev => {
			const newLotInputInfos = { ...prev };
			delete newLotInputInfos[lotId];
			return newLotInputInfos;
		});
	};

	// 전체 선택/해제 핸들러
	const handleSelectAll = () => {
		if (lotSearchList.data?.content) {
			lotSearchList.data.content.forEach((lot: any) => {
				if (!selectedLots[lot.id]) {
					handleLotSelect(lot.id, lot);
				}
			});
		}
	};

	const handleDeselectAll = () => {
		setSelectedLots({});
		setLotInputInfos({});
	};

	// LOT 선택 시 item 정보 자동 바인딩 - watch를 useEffect 내부에서 사용
	useEffect(() => {
		if (!formMethods || !lotSearchList.data?.content || isBatchModeActive) {
			return;
		}
		
		// watch 구독 설정
		const subscription = formMethods.watch((value, { name, type }) => {
			if (name === 'lotNo' && value.lotNo) {
				// 선택된 lot 데이터 찾기
				const selectedLot = lotSearchList.data?.content.find((lot: any) => lot.lotNo === value.lotNo);
				
				if (selectedLot) {
					// 폼에 item 정보 바인딩
					formMethods.setValue('itemId', selectedLot.itemId, { 
						shouldValidate: true, 
						shouldDirty: true 
					});
					formMethods.setValue('itemNumber', selectedLot.itemNumber, { 
						shouldValidate: true, 
						shouldDirty: true 
					});
					formMethods.setValue('itemName', selectedLot.itemName, { 
						shouldValidate: true, 
						shouldDirty: true 
					});
					formMethods.setValue('restAmount', selectedLot.restAmount, { 
						shouldValidate: true, 
						shouldDirty: true 
					});
					formMethods.setValue('restWeight', selectedLot.restWeight, { 
						shouldValidate: true, 
						shouldDirty: true 
					});
					formMethods.setValue('lotUnit', selectedLot.lotUnit, { 
						shouldValidate: true, 
						shouldDirty: true 
					});
				}
			}
		});

		// cleanup 함수에서 구독 해제
		return () => {
			subscription.unsubscribe();
		};
	}, [formMethods, lotSearchList.data?.content, isBatchModeActive]);

	// 폼 초기값 설정
	useEffect(() => {
		if (isEditMode && editData && formMethods) {
			formMethods.reset({
				lotNo: editData.inLotNo,
				itemId: editData.itemId,
				itemNumber: editData.itemNumber,
				itemName: editData.itemName,
				restAmount: editData.restAmount || 0, // 기본값 추가
				restWeight: editData.restWeight || 0, // 기본값 추가
				useAmount: editData.useAmount,
				useWeight: editData.useWeight,
				inputDate: editData.inputDate,
				lotUnit: editData.lotUnit,
			});
		}
	}, [isEditMode, editData, formMethods]);

	// lotSearchList에서 해당 LOT의 최신 잔량 정보로 업데이트
	useEffect(() => {
		if (isEditMode && editData && lotSearchList.data?.content && formMethods) {
			const selectedLot = lotSearchList.data.content.find(
				(lot: any) => lot.lotNo === editData.inLotNo
			);
			
			if (selectedLot) {
				// 최신 잔량 정보로 업데이트
				formMethods.setValue('restAmount', selectedLot.restAmount || 0);
				formMethods.setValue('restWeight', selectedLot.restWeight || 0);
			}
		}
	}, [isEditMode, editData, lotSearchList.data?.content, formMethods]);

	// 동적 폼 스키마 생성
	const materialOutgoingDetailFormSchema = useMemo(() => [
		{
			name: 'lotNo',
			label: 'LOT 번호',
			type: isEditMode ? 'text' : 'select', // 수정 모드에서는 select 대신 text
			readOnly: isEditMode, // 수정 모드에서는 readonly
			placeholder: isEditMode ? '수정 불가' : 'LOT 번호를 선택하세요',
			required: true,
			options: generateLotOptions, // lotSearchArray 기반 옵션
			value: editData?.inLotNo,
		},
		{
			name: 'itemId',
			label: '아이템 ID',
			type: 'hidden',
			placeholder: '',
			required: true,
		},
		{
			name: 'itemNumber',
			label: '품번',
			type: 'text',
			readOnly: true,
			placeholder: 'LOT 선택 시 자동 입력됩니다',
		},
		{
			name: 'itemName',
			label: '품명',
			type: 'text',
			readOnly: true,
			placeholder: 'LOT 선택 시 자동 입력됩니다',
		},
		{
			name: 'restAmount',
			label: '로트잔량',
			type: 'text',
			readOnly: true,
			placeholder: 'LOT 선택 시 자동 입력됩니다',
		},
		{
			name: 'restWeight',
			label: '로트잔중량',
			type: 'text',
			readOnly: true,
			placeholder: 'LOT 선택 시 자동 입력됩니다',
		},
		{
			name: 'useAmount',
			label: '투입수량',
			type: 'number',
			placeholder: '투입수량을 입력하세요',
			required: true,
		},
		{
			name: 'useWeight',
			label: '투입중량',
			type: 'number',
			placeholder: '투입중량을 입력하세요',
			required: false,
		},
		{
			name: 'inputDate',
			label: '투입일자',
			type: 'date',
			placeholder: '투입일자를 선택하세요',
			required: true,
		},
		{
			name: 'lotUnit',
			label: '투입단위',
			type: 'hidden',
		},
	], [isEditMode, generateLotOptions]);

	const handleFormReady = (methods: UseFormReturn<Record<string, unknown>>) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	// 배치 투입 처리 (새로운 함수)
	const handleBatchInput = async () => {
		if (!selectedCommandData) {
			toast.error('작업지시를 선택해주세요.');
			return;
		}

		const selectedLotData = Object.values(selectedLots).filter(lot => lot.lotId);
		if (selectedLotData.length === 0) {
			toast.error('투입할 로트를 선택해주세요.');
			return;
		}

		try {
			// 각 로트별로 투입 요청 생성
			const inputRequests = selectedLotData.map(lotData => {
				const inputInfo = lotInputInfos[lotData.lotId];
				
				// 유효성 검사
				if (inputInfo.useAmount > lotData.restAmount) {
					throw new Error(`${lotData.lotNo}: 남은 로트 수량보다 투입수량이 큽니다.`);
				}
				if (inputInfo.useWeight > lotData.restWeight) {
					throw new Error(`${lotData.lotNo}: 남은 로트 중량보다 투입중량이 큽니다.`);
				}

				return {
					commandId: selectedCommandData?.commandId || null,
					commandNo: selectedCommandData?.commandNo || '',
					// lotMasterId: selectedCommandData?.lot.id || null,
					// lotNo: selectedCommandData?.lot.lotNo || '',
					itemId: selectedCommandData.itemId,
					itemNo: selectedCommandData.itemNo || 0,
					itemNumber: selectedCommandData.itemNumber || '',
					itemName: selectedCommandData.itemName || '',
					itemSpec: selectedCommandData.itemSpec || '',
					progressId: selectedCommandData?.progressId || null,
					inLotMasterId: lotData.lotId,
					inLotNo: lotData.lotNo,
					lotUnit: lotData.lotUnit,
					jobType: '',
					useAmount: inputInfo.useAmount,
					useWeight: inputInfo.useWeight,
					inputDate: inputInfo.inputDate,
				} as unknown as WorkingInLotCreateRequest;
			});

			// 모든 투입 요청을 병렬로 처리
			await createWorkingInLotMutation.mutateAsync(inputRequests);
			
			onOpenChange(false);
			toast.success(`${selectedLotData.length}개 로트 투입이 완료되었습니다.`);
			
			// 투입 성공 후 데이터 새로고침
			onSuccess?.();
		} catch (error) {
			console.error('Error inputting lots:', error);
			toast.error(error instanceof Error ? error.message : '로트 투입 중 오류가 발생했습니다.');
		}
	};

	// working_in_lot 테이블에 저장할 데이터 생성
	const handleDetailFormSubmit = async (data: Record<string, unknown>) => {
		if (isEditMode) {
			// 수정 로직
			const updateData: WorkingInLotUpdateRequest = {
				id: editData.id,
				useAmount: parseInt(data.useAmount as string) || 0,
				useWeight: parseFloat(data.useWeight as string) || 0,
				inputDate: data.inputDate as string || new Date().toISOString().split('T')[0],
			};

			//restAmount 값보다 useAmount 값이 크면 toast.error 띄우고 return
			if (parseInt(data.restAmount as string) + parseInt(editData.useAmount as string) < parseInt(data.useAmount as string)) {
				toast.error('남은 로트 수량보다 투입수량이 큽니다.');
				return;
			}
			if (parseFloat(data.restWeight as string) + parseFloat(editData.useWeight as string) < parseFloat(data.useWeight as string)) {
				toast.error('남은 로트 중량보다 투입중량이 큽니다.');
				return;
			}
			
			try {
				await updateWorkingInLotMutation.mutateAsync([updateData]);
				toast.success('자재투입 데이터가 수정되었습니다.');
				onOpenChange(false);
				if (onSuccess) onSuccess();
			} catch (error) {
				toast.error('자재투입 데이터 수정에 실패했습니다.');
			}
		} else {
			// 기존 추가 로직
			// 선택된 LOT 데이터 찾기
			const selectedLotNo = data.lotNo as string;
			const selectedLot = lotSearchList.data?.content.find((lot: any) => lot.lotNo === selectedLotNo);
			
			if (!selectedLot) {
				toast.error('선택된 LOT 데이터를 찾을 수 없습니다.');
				return;
			}

			//restAmount 값보다 useAmount 값이 크면 toast.error 띄우고 return
			if (parseInt(selectedLot.restAmount as string) < parseInt(data.useAmount as string)) {
				toast.error('남은 로트 수량보다 투입수량이 큽니다.');
				return;
			}
			if (parseInt(selectedLot.restWeight as string) < parseInt(data.useWeight as string)) {
				toast.error('남은 로트 중량보다 투입중량이 큽니다.');
				return;
			}

			// working_in_lot 테이블 구조에 맞는 데이터 생성
			const workingInLotData: WorkingInLotCreateRequest = {
				// working_buffer_id: null, // TODO: working_buffer와 연결 필요
				commandId: selectedCommandData?.commandId || null, // 왼쪽 폼에서 선택한 작업지시의 공정 ID
				commandNo: selectedCommandData?.commandNo || '', // 왼쪽 폼에서 선택한 작업지시의 공정번호
				lotMasterId: selectedCommandData?.lot.id || null, // 모달에서 선택한 LOT의 공정 ID
				lotNo: selectedCommandData?.lot.lotNo || '', // 왼쪽 폼에서 선택한 작업지시의 LOT_NO
				itemId: selectedCommandData.itemId, // 선택한 LOT의 제품 ID
				itemNo: selectedCommandData.itemNo || 0, // 선택한 LOT의 아이템번호
				itemNumber: selectedCommandData.itemNumber || '', // 선택한 LOT의 품번
				itemName: selectedCommandData.itemName || '', // 선택한 LOT의 품명
				itemSpec: selectedCommandData.itemSpec || '', // 선택한 LOT의 제품규격
				progressId: selectedCommandData?.progressId || null, // 왼쪽 폼에서 선택한 공정 ID
				inLotMasterId: selectedLot.id || null, // 모달에서 선택한 LOT의 공정 ID
				inLotNo: selectedLotNo, // 모달에서 선택한 LOT_NO (투입 LOT_NO)
				lotUnit: data.lotUnit as string || '', // 모달에서 선택한 LOT_UNIT
				jobType : '', // TODO: 작업결과타입 설정 필요
				useAmount: parseInt(data.useAmount as string) || 0, // 투입수량
				useWeight: parseFloat(data.useWeight as string) || 0, // 투입중량
				inputDate: data.inputDate as string || new Date().toISOString().split('T')[0], // 투입일자
			};

			try {
				// 실제 API 호출
				const result = await createWorkingInLotMutation.mutateAsync([workingInLotData]);
				toast.success('자재투입 데이터가 저장되었습니다.');
				
				// 성공 시 모달 닫기 및 폼 리셋
				onOpenChange(false);
				if (formMethods) {
					formMethods.reset();
				}
				
				// 성공 콜백 호출
				if (onSuccess) {
					onSuccess();
				}
			} catch (error) {
				toast.error('자재투입 데이터 저장에 실패했습니다.');
				return; // 에러 발생 시 모달을 닫지 않음
			}
		}
	};

	const handleModalClose = (open: boolean) => {
		onOpenChange(open);
		if (!open && formMethods) {
			formMethods.reset();
		}
	};

	// 제목 동적 변경
	const modalTitle = isEditMode 
		? tCommon('pages.production.materialOutgoing.modify')
		: tCommon('pages.production.materialOutgoing.add');
	
	const submitButtonText = isEditMode 
		? tCommon('pages.form.modify')
		: tCommon('pages.form.save');

	// ===== 2단계: 로트 리스트 UI 컴포넌트 (개선된 버전) =====
	const LotCard = ({ lot }: { lot: any }) => {
		const isSelected = !!selectedLots[lot.id];
		const inputInfo = lotInputInfos[lot.id];
		return (
			<div className={`border rounded-lg p-4 transition-all duration-200 ${
				isSelected 
					? 'bg-Colors-Brand-50 border-Colors-Brand-300 shadow-md' 
					: 'bg-white border-gray-200 hover:border-Colors-Brand-200 hover:shadow-sm'
			}`}>
				{/* 로트 헤더 정보 */}
				<div className="flex items-center justify-between mb-3">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<Package className="w-4 h-4 text-Colors-Brand-600" />
							<h4 className="font-semibold text-gray-800 text-lg">
								{lot.lotNo}
							</h4>
							{isSelected && (
								<CheckCircle className="w-5 h-5 text-Colors-Brand-600" />
							)}
						</div>
						<div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
							<div className="flex items-center gap-2">
								<div className="font-medium text-Colors-Brand-700 w-20">품번</div> 
								<div className="w-full">{lot.itemNumber}</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="font-medium text-Colors-Brand-700 w-20">품명</div> 
								<div className="w-full">{lot.itemName}</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="font-medium text-Colors-Brand-700 w-20">규격</div> 
								<div className="w-full">{lot.itemSpec || 'N/A'}</div>
							</div>
						</div>
						<div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
							<div className="flex items-center gap-2">
								<div className="font-medium text-Colors-Brand-700 w-20">잔량</div> 
								<div className="w-full text-lg font-semibold text-Colors-Brand-800">{lot.restAmount}</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="font-medium text-Colors-Brand-700 w-20">잔중량</div> 
								<div className="w-full text-lg font-semibold text-Colors-Brand-800">{lot.restWeight}</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="font-medium text-Colors-Brand-700 w-20">단위</div> 
								<div className="w-full">{lot.lotUnit || 'N/A'}</div>
							</div>
						</div>
					</div>
					{/* <div className="text-right">
						<div className="text-sm text-Colors-Brand-700 mb-1 font-medium">잔량 정보</div>
						<div className="text-lg font-semibold text-Colors-Brand-800">
							{lot.restAmount} {lot.lotUnit}
						</div>
						<div className="text-sm text-gray-600">
							중량: {lot.restWeight}kg
						</div>
					</div> */}
				</div>
				
				{/* 선택/해제 버튼 - 같은 위치에 배치 */}
				<div className="mt-4">
					{isSelected ? (
						<div className="space-y-4">
							{/* 선택 해제 버튼 */}
							<div className="flex justify-between items-center">
								<button
									type="button"
									className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2 shadow-sm"
									onClick={() => handleLotDeselect(lot.id)}
								>
									<X className="w-4 h-4" />
									선택 해제
								</button>
								<div className="text-sm text-Colors-Brand-600 font-medium flex items-center gap-1">
									<CheckCircle className="w-4 h-4" />
									투입 정보 입력됨
								</div>
							</div>
							
							{/* 투입 정보 입력 폼 */}
							<div className="bg-Colors-Brand-25 rounded-lg p-4 space-y-4 border border-Colors-Brand-100">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{/* 투입수량 */}
									<div>
										<label className="block text-sm font-medium text-Colors-Brand-700 mb-2 flex items-center gap-2">
											<Hash className="w-4 h-4" />
											투입수량
										</label>
										<div className="relative">
											<input
												type="number"
												defaultValue={inputInfo?.useAmount || 0}
												onChange={(e) => {
													const value = parseInt(e.target.value) || 0;
													if (!localInputRefs.current[lot.id]) {
														localInputRefs.current[lot.id] = { ...inputInfo };
													}
													localInputRefs.current[lot.id].useAmount = value;
												}}
												onBlur={() => handleLotInputInfoUpdate(lot.id, 'useAmount', localInputRefs.current[lot.id].useAmount)}
												className="w-full px-3 py-2 text-sm border border-Colors-Brand-200 rounded-lg focus:ring-2 focus:ring-Colors-Brand-500 focus:border-Colors-Brand-500 transition-colors"
												placeholder="투입수량"
												min="0"
												max={lot.restAmount}
											/>
										</div>
										{inputInfo.useAmount > lot.restAmount && (
											<p className="text-xs text-red-600 mt-1 flex items-center gap-1">
												<X className="w-3 h-3" />
												잔량 초과 (잔량: {lot.restAmount})
											</p>
										)}
									</div>
									
									{/* 투입중량 */}
									<div>
										<label className="block text-sm font-medium text-Colors-Brand-700 mb-2 flex items-center gap-2">
											<Scale className="w-4 h-4" />
											투입중량
										</label>
										<div className="relative">
											<input
												type="number"
												defaultValue={inputInfo?.useWeight || 0}
												onChange={(e) => {
													console.log('localInputRefs', localInputRefs);
													const value = parseFloat(e.target.value) || 0;
													if (!localInputRefs.current[lot.id]) {
														localInputRefs.current[lot.id] = { ...inputInfo };
													}
													localInputRefs.current[lot.id].useWeight = value;
												}}
												onBlur={() => handleLotInputInfoUpdate(lot.id, 'useWeight', localInputRefs.current[lot.id].useWeight)}
												className="w-full px-3 py-2 text-sm border border-Colors-Brand-200 rounded-lg focus:ring-2 focus:ring-Colors-Brand-500 focus:border-Colors-Brand-500 transition-colors"
												placeholder="투입중량"
												min="0"
												max={lot.restWeight}
												step="0.01"
											/>
										</div>
										{inputInfo.useWeight > lot.restWeight && (
											<p className="text-xs text-red-600 mt-1 flex items-center gap-1">
												<X className="w-3 h-3" />
												잔중량 초과 (잔중량: {lot.restWeight}kg)
											</p>
										)}
									</div>
									
									{/* 투입일자 */}
									<div>
										<label className="block text-sm font-medium text-Colors-Brand-700 mb-2 flex items-center gap-2">
											<Calendar className="w-4 h-4" />
											투입일자
										</label>
										<input
											type="date"
											defaultValue={inputInfo?.inputDate || new Date().toISOString().split('T')[0]}
											onChange={(e) => (localInputRefs.current[lot.id].inputDate = e.target.value)}
											onBlur={() => handleLotInputInfoUpdate(lot.id, 'inputDate', localInputRefs.current[lot.id].inputDate)}
											className="w-full px-3 py-2 text-sm border border-Colors-Brand-200 rounded-lg focus:ring-2 focus:ring-Colors-Brand-500 focus:border-Colors-Brand-500 transition-colors"
										/>
									</div>
								</div>
							</div>
						</div>
					) : (
						<button
							type="button"
							className="w-full px-4 py-2 text-sm font-medium text-white bg-Colors-Brand-600 rounded-lg hover:bg-Colors-Brand-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
							onClick={() => handleLotSelect(lot.id, lot)}
						>
							<Plus className="w-4 h-4" />
							로트 선택
						</button>
					)}
				</div>
			</div>
		);
	};

	// 배치 모드 UI 렌더링
	if (isBatchModeActive) {
		return (
			<DraggableDialog
				open={open}
				onOpenChange={handleModalClose}
				title={modalTitle}
				content={
					<div className="w-full max-w-6xl max-h-[90vh] overflow-visible flex flex-col">
						{/* 헤더 - 전체 선택/해제 버튼 */}
						<div className="p-4 border-b border-Colors-Brand-200 bg-Colors-Brand-50">
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-4">
									<h3 className="text-lg font-semibold text-Colors-Brand-800">
										로트 선택 및 투입 정보 입력
									</h3>
								</div>
								<div className="flex gap-2">
									<button
										type="button"
										className="px-4 py-2 text-sm font-medium text-Colors-Brand-700 bg-Colors-Brand-100 rounded-lg hover:bg-Colors-Brand-200 transition-colors duration-200 flex items-center gap-2 border border-Colors-Brand-200"
										onClick={handleSelectAll}
									>
										<CheckCircle className="w-4 h-4" />
										전체 선택
									</button>
									<button
										type="button"
										className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2 border border-gray-200"
										onClick={handleDeselectAll}
									>
										<X className="w-4 h-4" />
										전체 해제
									</button>
								</div>
							</div>
						</div>

						{/* 로트 리스트 */}
						<div className="flex-1 p-4 overflow-y-auto">
							{lotSearchList.data?.content && lotSearchList.data.content.length > 0 ? (
								<div className="space-y-4">
									{lotSearchList.data.content.map((lot: any) => (
										<LotCard key={lot.id} lot={lot} />
									))}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center h-64 text-gray-500">
									<Package className="w-12 h-12 text-Colors-Brand-300 mb-4" />
									<p className="text-lg font-medium text-Colors-Brand-600">검색된 로트가 없습니다</p>
									<p className="text-sm text-gray-500">다른 검색 조건을 시도해보세요</p>
								</div>
							)}
						</div>

						{/* 하단 버튼 */}
						<div className="p-4 border-t border-Colors-Brand-200 bg-Colors-Brand-50">
							<div className="flex justify-between items-center">
								<div className="text-sm text-Colors-Brand-600">
									선택된 로트: <span className="font-semibold text-Colors-Brand-700">{Object.keys(selectedLots).length}개</span>
								</div>
								<button
									type="button"
									className={`px-6 py-3 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-Colors-Brand-500 transition-all duration-200 ${
										Object.keys(selectedLots).length === 0
											? 'bg-gray-400 cursor-not-allowed'
											: 'bg-Colors-Brand-600 hover:bg-Colors-Brand-700 shadow-md hover:shadow-lg'
									}`}
									onClick={handleBatchInput}
									disabled={Object.keys(selectedLots).length === 0}
								>
									배치 투입 ({Object.keys(selectedLots).length}개)
								</button>
							</div>
						</div>
					</div>
				}
			/>
		);
	}

	// 기존 단일 모드 UI
	return (
		<DraggableDialog
			open={open}
			onOpenChange={handleModalClose}
			title={modalTitle}
			content={
				<DynamicForm
					onFormReady={handleFormReady}
					fields={materialOutgoingDetailFormSchema}
					onSubmit={handleDetailFormSubmit}
					submitButtonText={submitButtonText}
					visibleSaveButton={true}
				/>
			}
		/>
	);
};

export default MaterialOutgoingAddModal;