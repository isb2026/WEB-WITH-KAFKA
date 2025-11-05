import React, { useState, useMemo, useEffect } from 'react';
import {
	DraggableDialog,
	ComboBox,
	ComboBoxItem,
} from '@repo/radix-ui/components';
import { ItemProgressSelectComponent } from '@primes/components/customSelect/ItemProgressSelectComponent';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';
import { MbomUpdateRequest, RootItemTreeDto } from '@primes/types/ini/mbom';
import { useProgress } from '@primes/hooks/init/progress/useProgress';
import { useCodeFieldQuery } from '@primes/hooks/init/code/useCodeFieldQuery';
import { BomDetailItem } from '../panels/BomDetailPanel';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

interface MaterialEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedRootItem: RootItemTreeDto | null;
	selectedItems: BomDetailItem[];
	productOptions: { label: string; value: string }[];
	onSubmit: (items: { id: number; data: MbomUpdateRequest }[]) => Promise<void>;
}

export const MaterialEditModal: React.FC<MaterialEditModalProps> = ({
	isOpen,
	onClose,
	selectedRootItem,
	selectedItems,
	productOptions,
	onSubmit,
}) => {
	// 첫 번째 선택된 아이템을 기준으로 초기값 설정
	const firstItem = selectedItems[0];
	
	const [formData, setFormData] = useState({
		parentProgressId: '',
		itemId: '',
		itemProgressId: '',
		inputNum: 0,
		inputUnitCode: '',
		inputUnit: '',
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
			label: `${process.progressOrder}. ${process.progressName} (${process.progressTypeName || ''})`,
			value: process.progressId.toString(),
		}));
	}, [selectedRootItem]);

	// 선택된 아이템들의 정보 표시
	const selectedItemsInfo = useMemo(() => {
		if (selectedItems.length === 0) return null;
		
		if (selectedItems.length === 1) {
			return {
				title: '선택된 투입품',
				subtitle: `${firstItem.itemCode} - ${firstItem.itemName}`,
				details: `투입량: ${firstItem.inputNum} ${firstItem.inputUnit}`,
			};
		} else {
			return {
				title: '선택된 투입품들',
				subtitle: `${selectedItems.length}개 투입품 일괄 수정`,
				details: selectedItems.map(item => `${item.itemCode} - ${item.itemName}`).join(', '),
			};
		}
	}, [selectedItems, firstItem]);

	// 폼 초기화 (첫 번째 선택된 아이템 기준)
	useEffect(() => {
		if (firstItem && isOpen) {
			setFormData({
				parentProgressId: '', // 수정 시에는 새로 선택
				itemId: firstItem.itemId.toString(),
				itemProgressId: '', // 수정 시에는 새로 선택
				inputNum: firstItem.inputNum,
				inputUnitCode: '', // 수정 시에는 새로 선택
				inputUnit: firstItem.inputUnit,
			});
			setSelectedItemId(firstItem.itemId.toString());
		}
	}, [firstItem, isOpen]);

	// 폼 초기화
	const resetForm = () => {
		setFormData({
			parentProgressId: '',
			itemId: '',
			itemProgressId: '',
			inputNum: 0,
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

	// 부모공정 선택 핸들러
	const handleParentProcessSelection = (item: ComboBoxItem | null) => {
		const processId = item?.value || '';
		setFormData((prev) => ({ ...prev, parentProgressId: processId }));
	};

	// 투입품공정 선택 핸들러
	const handleItemProgressSelection = (progressId: string) => {
		setFormData((prev) => ({ ...prev, itemProgressId: progressId }));
	};

	// 투입단위 선택 핸들러
	const handleUnitSelection = (codeValue: string) => {
		if (codeValue && unitCodeData) {
			const selectedUnit = unitCodeData.find(
				(unit: { codeValue: string; codeName: string }) =>
					unit.codeValue === codeValue
			);
			setFormData((prev) => ({
				...prev,
				inputUnitCode: codeValue,
				inputUnit: selectedUnit?.codeName || codeValue,
			}));
		} else {
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
			// 필수 필드 검증
			if (!formData.parentProgressId) {
				toast.error('투입공정을 선택해주세요.');
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

			// 선택된 모든 아이템에 대해 수정 요청 생성
			const updateRequests = selectedItems.map(item => ({
				id: item.id,
				data: {
					parentProgressId: Number(formData.parentProgressId),
					itemProgressId: Number(formData.itemProgressId),
					inputNum: formData.inputNum,
					inputUnitCode: formData.inputUnitCode,
					inputUnit: formData.inputUnit,
				} as MbomUpdateRequest,
			}));

			await onSubmit(updateRequests);
			handleClose();
		} catch (error) {
			console.error('투입품 수정 실패:', error);
			toast.error('투입품 수정 중 오류가 발생했습니다.');
		}
	};

	return (
		<DraggableDialog
			open={isOpen}
			onOpenChange={handleClose}
			title="투입품 수정"
			content={
				<div className="space-y-6 p-1">
					{/* 선택된 투입품 정보 표시 */}
					{selectedItemsInfo && (
						<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
							<h4 className="font-medium text-orange-800 mb-2">
								{selectedItemsInfo.title}
							</h4>
							<div className="space-y-1">
								<p className="text-sm text-orange-700 font-medium">
									{selectedItemsInfo.subtitle}
								</p>
								<p className="text-xs text-orange-600 break-all">
									{selectedItemsInfo.details}
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
					</div>

					{/* 2. 제품 공정 선택 */}
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
					</div>

					{/* 3. 투입량 */}
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
						{selectedItems.length > 1 && (
							<p className="text-xs text-orange-600 mt-1">
								선택된 {selectedItems.length}개 투입품의 투입량이 모두 동일하게 변경됩니다.
							</p>
						)}
					</div>

					{/* 4. 투입단위 */}
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

					{/* 수정 버튼 */}
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
							className="bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2 px-6 py-2 rounded-md transition-colors font-medium"
						>
							<Edit size={16} />
							투입품 수정 ({selectedItems.length}개)
						</button>
					</div>
				</div>
			}
		/>
	);
};
