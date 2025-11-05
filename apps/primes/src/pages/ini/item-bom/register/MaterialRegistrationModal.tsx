import React, { useState, useMemo } from 'react';
import {
	DraggableDialog,
	ComboBox,
	ComboBoxItem,
} from '@repo/radix-ui/components';
import { ItemProgressSelectComponent } from '@primes/components/customSelect/ItemProgressSelectComponent';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';
import { MbomCreateRequest, RootItemTreeDto } from '@primes/types/ini/mbom';
import { useProgress } from '@primes/hooks/init/progress/useProgress';
import { useCodeFieldQuery } from '@primes/hooks/init/code/useCodeFieldQuery';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface MaterialRegistrationModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedRootItem: RootItemTreeDto | null;
	productOptions: { label: string; value: string }[];
	onSubmit: (data: MbomCreateRequest) => Promise<void>;
}

export const MaterialRegistrationModal: React.FC<
	MaterialRegistrationModalProps
> = ({ isOpen, onClose, selectedRootItem, productOptions, onSubmit }) => {
	const [formData, setFormData] = useState({
		parentProgressId: '', // 투입공정 선택
		itemId: '', // 제품 선택
		itemProgressId: '', // 제품 공정
		inputNum: 1, // 투입량
		inputUnitCode: '', // 투입단위 코드 (codeValue)
		inputUnit: '', // 투입단위 명 (codeName)
	});

	// 선택된 투입품의 공정 조회
	const [selectedItemId, setSelectedItemId] = useState<string>('');
	const { list: materialProgressData } = useProgress({
		page: 0,
		size: 100,
		searchRequest: {
			itemId: selectedItemId ? Number(selectedItemId) : undefined,
		},
		enabled: !!selectedItemId,
	});

	// 투입단위 코드 데이터 조회 (PRD-006)
	const { data: unitCodeData } = useCodeFieldQuery('PRD-006');

	// 부모제품의 공정 옵션 생성
	const parentProcessOptions = useMemo(() => {
		if (!selectedRootItem?.processTree) return [];

		return selectedRootItem.processTree.map((process) => ({
			label: process.progressTypeName
				? `${process.progressOrder}. ${process.progressName} (${process.progressTypeName})`
				: `${process.progressOrder}. ${process.progressName}`,
			value: process.progressId.toString(),
		}));
	}, [selectedRootItem]);

	// 폼 초기화
	const resetForm = () => {
		setFormData({
			parentProgressId: '',
			itemId: '',
			itemProgressId: '',
			inputNum: 1,
			inputUnitCode: '',
			inputUnit: '',
		});
		setSelectedItemId('');
	};

	// 모달 닫기 핸들러
	const handleClose = () => {
		resetForm();
		onClose();
	};

	// 투입품 선택 핸들러
	const handleItemSelection = (item: ComboBoxItem | null) => {
		const itemId = item?.value || '';
		setSelectedItemId(itemId);
		setFormData((prev) => ({ ...prev, itemId }));
	};

	// 부모공정 선택 핸들러
	const handleParentProcessSelection = (item: ComboBoxItem | null) => {
		const processId = item?.value || '';
		setFormData((prev) => ({ ...prev, parentProgressId: processId }));
	};

	// 투입품공정 선택 핸들러
	const handleItemProgressSelection = (progressId: string) => {
		setFormData((prev) => ({ ...prev, itemProgressId: progressId }));
	};

	// 투입단위 선택 핸들러 (CodeSelectComponent에서 codeValue와 codeName 처리)
	const handleUnitSelection = (codeValue: string) => {
		// CodeSelectComponent는 onChange에서 codeValue만 반환하므로
		// unitCodeData에서 해당 codeValue의 codeName을 찾아서 설정
		if (codeValue && unitCodeData) {
			const selectedUnit = unitCodeData.find(
				(unit: { codeValue: string; codeName: string }) =>
					unit.codeValue === codeValue
			);
			setFormData((prev) => ({
				...prev,
				inputUnitCode: codeValue,
				inputUnit: selectedUnit?.codeName || codeValue, // codeName이 없으면 codeValue 사용
			}));
		} else {
			// 선택 해제된 경우
			setFormData((prev) => ({
				...prev,
				inputUnitCode: '',
				inputUnit: '',
			}));
		}
	};

	// 폼 제출 핸들러
	const handleSubmit = async () => {
		try {
			// 필수 필드 검증 (순서 변경에 따라 수정)
			if (!formData.parentProgressId) {
				toast.error('투입공정을 선택해주세요.');
				return;
			}
			if (!formData.itemId) {
				toast.error('제품을 선택해주세요.');
				return;
			}
			if (!formData.itemProgressId) {
				toast.error('제품 공정을 선택해주세요.');
				return;
			}
			if (!formData.inputNum || formData.inputNum <= 0) {
				toast.error('투입량을 올바르게 입력해주세요.');
				return;
			}
			if (!formData.inputUnitCode) {
				toast.error('투입단위를 선택해주세요.');
				return;
			}

			const createRequest: MbomCreateRequest = {
				parentItemId: selectedRootItem?.rootItemId || null,
				itemId: Number(formData.itemId),
				isRoot: false,
				parentProgressId: Number(formData.parentProgressId),
				inputNum: formData.inputNum,
				itemProgressId: formData.itemProgressId
					? Number(formData.itemProgressId)
					: undefined,
				inputUnitCode: formData.inputUnitCode,
				inputUnit: formData.inputUnit,
			};

			await onSubmit(createRequest);
			handleClose();
		} catch (error) {
			console.error('투입품 등록 실패:', error);
			toast.error('투입품 등록 중 오류가 발생했습니다.');
		}
	};

	return (
		<DraggableDialog
			open={isOpen}
			onOpenChange={handleClose}
			title="투입품 등록"
			content={
				<div className="space-y-6 p-1">
					{/* 선택된 부모제품 정보 표시 */}
					{selectedRootItem && (
						<div className="bg-gray-50 p-4 rounded-lg border">
							<h4 className="font-medium text-gray-800 mb-2">
								선택된 부모제품
							</h4>
							<div className="space-y-1">
								<p className="text-sm text-gray-700 font-medium">
									{selectedRootItem.productInfo?.itemCode} -{' '}
									{selectedRootItem.productInfo?.itemName}
								</p>
								<p className="text-xs text-gray-500">
									총 공정수:{' '}
									{selectedRootItem.totalProcessCount}개 | 총
									투입품수:{' '}
									{selectedRootItem.totalInputItemCount}개
								</p>
							</div>
						</div>
					)}

					{/* 1. 투입공정 선택 */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							투입공정 선택{' '}
							<span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<ComboBox
								items={parentProcessOptions}
								value={
									parentProcessOptions.find(
										(opt) =>
											opt.value ===
											formData.parentProgressId
									) || null
								}
								onChange={handleParentProcessSelection}
								placeholder="투입될 공정을 선택하세요"
								className="w-full min-h-[42px]"
								disabled={
									!selectedRootItem ||
									parentProcessOptions.length === 0
								}
							/>
						</div>
						{!selectedRootItem && (
							<p className="text-xs text-gray-500 mt-1">
								완제품을 먼저 선택해주세요.
							</p>
						)}
					</div>

					{/* 2. 제품 선택 */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							제품 선택 <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<ComboBox
								items={productOptions}
								value={
									productOptions.find(
										(opt) => opt.value === formData.itemId
									) || null
								}
								onChange={handleItemSelection}
								placeholder="제품을 선택하세요"
								className="w-full min-h-[42px]"
							/>
						</div>
					</div>

					{/* 3. 제품 공정 선택 (ItemProgressSelectComponent 활용) */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							제품 공정 선택{' '}
							<span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<ItemProgressSelectComponent
								fieldKey="progressName"
								valueKey="id"
								labelKey="progressName"
								itemId={
									selectedItemId
										? Number(selectedItemId)
										: undefined
								}
								value={formData.itemProgressId || null}
								onChange={handleItemProgressSelection}
								placeholder="제품의 어느 공정까지 완료되어야 하는지 선택하세요"
								disabled={!selectedItemId}
								className="w-full"
							/>
						</div>
						{!selectedItemId && (
							<p className="text-xs text-gray-500 mt-1">
								제품을 먼저 선택해주세요.
							</p>
						)}
						{selectedItemId && materialProgressData?.isLoading && (
							<p className="text-xs text-blue-600 mt-1">
								제품의 공정 정보를 불러오는 중...
							</p>
						)}
					</div>

					{/* 4. 투입량 */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							투입량 <span className="text-red-500">*</span>
						</label>
						<input
							type="number"
							min="0.01"
							step="0.01"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							value={formData.inputNum}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									inputNum: Number(e.target.value),
								}))
							}
							placeholder="투입량을 입력하세요"
							required
						/>
					</div>

					{/* 5. 투입단위 (CodeSelectComponent 활용) */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							투입단위 <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<CodeSelectComponent
								fieldKey="PRD-006"
								valueKey="codeValue"
								labelKey="codeName"
								value={formData.inputUnitCode || ''}
								onChange={handleUnitSelection}
								placeholder="투입단위를 선택하세요"
								className="w-full"
							/>
						</div>
						<div className="mt-2 text-xs text-gray-500 space-y-1">
							{formData.inputUnitCode && (
								<p>
									선택된 단위 코드:{' '}
									<span className="font-mono">
										{formData.inputUnitCode}
									</span>
								</p>
							)}
							{formData.inputUnit && (
								<p>
									선택된 단위명:{' '}
									<span className="font-medium">
										{formData.inputUnit}
									</span>
								</p>
							)}
						</div>
					</div>

					{/* 등록 버튼 */}
					<div className="flex justify-end gap-3 pt-6 border-t">
						<button
							type="button"
							onClick={handleClose}
							className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
						>
							취소
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							className="bg-Colors-Brand-700 text-white hover:bg-Colors-Brand-800 flex items-center gap-2 px-6 py-2 rounded-md transition-colors font-medium"
						>
							저장
						</button>
					</div>
				</div>
			}
		/>
	);
};
