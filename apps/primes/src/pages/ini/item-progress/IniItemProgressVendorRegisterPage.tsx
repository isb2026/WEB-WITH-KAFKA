import { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useProgress } from '@primes/hooks';
import { VendorSelectComponent } from '@primes/components/customSelect';
import { BinaryToggleComponent } from '@primes/components/customSelect';
import { RadixButton } from '@repo/radix-ui/components';
import { InfoGrid } from '@primes/components/common/InfoGrid';

interface IniItemProgressVendorRegisterPageProps {
	onClose?: () => void;
	itemId: string | number;
	productName?: string;
}

interface ProgressVendorData {
	id: number;
	progressName: string;
	progressOrder: number;
	isOutsourcing: boolean;
	vendorId?: number;
	unitCost?: number;
	currentVendorName?: string;
}

export const IniItemProgressVendorRegisterPage: React.FC<
	IniItemProgressVendorRegisterPageProps
> = ({ onClose, itemId, productName }) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [progressList, setProgressList] = useState<ProgressVendorData[]>([]);
	const [modifiedProgresses, setModifiedProgresses] = useState<Map<number, Partial<ProgressVendorData>>>(new Map());
	
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	
	// 공정 목록 조회
	const { list, update } = useProgress({
		page: 0,
		size: 100, // 모든 공정을 가져오기 위해 큰 사이즈 설정
		searchRequest: {
			itemId: Number(itemId),
		},
	});

	// 공정 목록 데이터 가공
	useEffect(() => {
		if (list.data?.content) {
			const processedData = list.data.content.map((item: any) => ({
				id: item.id,
				progressName: item.progressName,
				progressOrder: item.progressOrder,
				isOutsourcing: item.isOutsourcing,
				vendorId: item.vendorId,
				unitCost: item.unitCost,
				currentVendorName: item.vendor?.compName || '',
			}));
			setProgressList(processedData);
		}
	}, [list.data]);

	// 공정별 외주 여부 변경 핸들러
	const handleOutsourcingChange = (progressId: number, isOutsourcing: string) => {
		const isOutsourcingBool = isOutsourcing === 'true';
		setModifiedProgresses(prev => {
			const newMap = new Map(prev);
			const existing = newMap.get(progressId) || {};
			newMap.set(progressId, {
				...existing,
				isOutsourcing: isOutsourcingBool,
				// 외주가 아닌 경우 벤더 정보 제거
				...(isOutsourcingBool ? {} : { vendorId: undefined }),
			});
			return newMap;
		});
	};

	// 공정별 벤더 변경 핸들러
	const handleVendorChange = (progressId: number, vendorId: string) => {
		setModifiedProgresses(prev => {
			const newMap = new Map(prev);
			const existing = newMap.get(progressId) || {};
			newMap.set(progressId, {
				...existing,
				vendorId: vendorId ? Number(vendorId) : undefined,
			});
			return newMap;
		});
	};

	// 공정별 단가 변경 핸들러
	const handleUnitCostChange = (progressId: number, unitCost: string) => {
		setModifiedProgresses(prev => {
			const newMap = new Map(prev);
			const existing = newMap.get(progressId) || {};
			newMap.set(progressId, {
				...existing,
				unitCost: unitCost ? Number(unitCost) : undefined,
			});
			return newMap;
		});
	};

	// 현재 공정의 값 가져오기 (수정된 값 우선)
	const getCurrentValue = (progressId: number, field: keyof ProgressVendorData) => {
		const modified = modifiedProgresses.get(progressId);
		const original = progressList.find(p => p.id === progressId);
		
		if (modified && modified[field] !== undefined) {
			return modified[field];
		}
		return original?.[field];
	};

	// 저장 핸들러
	const handleSave = async () => {
		if (isSubmitting || modifiedProgresses.size === 0) return;

		setIsSubmitting(true);
		try {
			// 수정된 공정들을 순차적으로 업데이트
			const updatePromises = Array.from(modifiedProgresses.entries()).map(([progressId, changes]) => {
				const original = progressList.find(p => p.id === progressId);
				if (!original) return Promise.resolve();

				const updateData = {
					isUse: true,
					accountYear: new Date().getFullYear(),
					itemId: Number(itemId),
					progressOrder: original.progressOrder,
					progressName: original.progressName,
					isOutsourcing: changes.isOutsourcing ?? original.isOutsourcing,
					vendorId: changes.vendorId ?? original.vendorId,
					unitCost: changes.unitCost ?? original.unitCost,
				};

				return update.mutateAsync({
					id: progressId,
					data: updateData,
				});
			});

			await Promise.all(updatePromises);
			
			onClose && onClose();
		} catch (error) {
			// 오류 처리는 React Query에서 자동으로 처리됨
		} finally {
			setIsSubmitting(false);
		}
	};

	// 취소 핸들러
	const handleCancel = () => {
		setModifiedProgresses(new Map());
		onClose && onClose();
	};

	// 제품 정보 표시용 데이터
	const productInfo = [
		{ label: tCommon('제품 ID'), value: itemId },
		{ label: tCommon('제품명'), value: productName || '-' },
		{ label: tCommon('공정 수'), value: progressList.length.toString() },
	];

	if (list.isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="text-lg">{tCommon('로딩 중...')}</div>
			</div>
		);
	}

	if (progressList.length === 0) {
		return (
			<div className="max-w-full mx-auto p-6">
							<div className="mb-6">
				<InfoGrid items={productInfo} columns="3" />
			</div>
				<div className="text-center py-8">
					<div className="text-lg text-gray-500 mb-4">
						{tCommon('등록된 공정이 없습니다.')}
					</div>
					<div className="text-sm text-gray-400">
						{tCommon('먼저 공정을 등록해주세요.')}
					</div>
				</div>
				<div className="flex justify-end gap-2 mt-6">
					<RadixButton variant="outline" onClick={handleCancel}>
						{tCommon('닫기')}
					</RadixButton>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-full mx-auto p-6">
			{/* 제품 정보 */}
			<div className="mb-6">
				<h2 className="text-lg font-semibold mb-4">{tCommon('제품 정보')}</h2>
				<InfoGrid items={productInfo} columns="3" />
			</div>

			{/* 공정-벤더 연결 폼 */}
			<div className="mb-6">
				<h2 className="text-lg font-semibold mb-4">{tCommon('공정별 벤더 설정')}</h2>
				<div className="space-y-4">
					{progressList
						.sort((a, b) => a.progressOrder - b.progressOrder)
						.map((progress) => {
							const currentIsOutsourcing = getCurrentValue(progress.id, 'isOutsourcing') as boolean;
							const currentVendorId = getCurrentValue(progress.id, 'vendorId') as number | undefined;
							const currentUnitCost = getCurrentValue(progress.id, 'unitCost') as number | undefined;

							return (
								<div
									key={progress.id}
									className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
								>
									<div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
										{/* 공정 정보 */}
										<div className="md:col-span-1">
											<div className="font-medium text-sm text-gray-600 dark:text-gray-300">
												{t('columns.progressOrder')}: {progress.progressOrder}
											</div>
											<div className="font-semibold">
												{progress.progressName}
											</div>
										</div>

										{/* 외주 여부 */}
										<div className="md:col-span-1">
											<label className="block text-sm font-medium mb-1">
												{t('columns.isOutsourcing')}
											</label>
											<BinaryToggleComponent
												value={currentIsOutsourcing ? 'true' : 'false'}
												onChange={(value: string) => handleOutsourcingChange(progress.id, value)}
												falseLabel="사내공정"
												trueLabel="외주"
											/>
										</div>

										{/* 벤더 선택 */}
										<div className="md:col-span-1">
											<label className="block text-sm font-medium mb-1">
												{t('columns.progressVendor')}
											</label>
											<VendorSelectComponent
												value={currentVendorId?.toString() || ''}
												onChange={(value: string | null) => handleVendorChange(progress.id, value || '')}
												disabled={!currentIsOutsourcing}
												placeholder={currentIsOutsourcing ? '벤더를 선택하세요' : '사내공정'}
											/>
										</div>

										{/* 단가 */}
										<div className="md:col-span-1">
											<label className="block text-sm font-medium mb-1">
												{t('columns.unitCost')}
											</label>
											<input
												type="number"
												value={currentUnitCost || ''}
												onChange={(e) => handleUnitCostChange(progress.id, e.target.value)}
												placeholder="단가 입력"
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
											/>
										</div>

										{/* 현재 상태 */}
										<div className="md:col-span-1">
											<div className="text-xs text-gray-500">
												<div>현재: {progress.currentVendorName || '미설정'}</div>
												<div>단가: {progress.unitCost ? `${progress.unitCost.toLocaleString()}원` : '미설정'}</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</div>

			{/* 액션 버튼 */}
			<div className="flex justify-end gap-2">
				<RadixButton variant="outline" onClick={handleCancel}>
					{tCommon('취소')}
				</RadixButton>
				<RadixButton 
					onClick={handleSave}
					disabled={isSubmitting || modifiedProgresses.size === 0}
				>
					{isSubmitting ? tCommon('저장 중...') : tCommon('저장')}
				</RadixButton>
			</div>

			{/* 변경 사항 요약 */}
			{modifiedProgresses.size > 0 && (
				<div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
					<div className="text-sm text-blue-700 dark:text-blue-300">
						{modifiedProgresses.size}개 공정의 설정이 변경되었습니다.
					</div>
				</div>
			)}
		</div>
	);
};

export default IniItemProgressVendorRegisterPage; 