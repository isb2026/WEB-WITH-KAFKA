import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RadixButton } from '@repo/radix-ui/components';

import { useTranslation } from '@repo/i18n';
import { MoldOrderDetailDto } from '@primes/types/mold';
import { useUpdateMoldOrderDetail } from '@primes/hooks/mold/mold-order/useUpdateMoldOrderDetail';
import { useCreateMoldOrderDetail } from '@primes/hooks/mold/mold-order/useCreateMoldOrderDetail';
import { useQueryClient } from '@tanstack/react-query';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';
import { MoldMasterSelectComponent } from '@primes/components/customSelect/MoldMasterSelectComponent';

interface MoldOrderDetailEditFormProps {
	detail: MoldOrderDetailDto | null;
	moldOrderMasterId?: number; // 마스터 ID 추가
	onClose: () => void;
	onSuccess?: () => void;
}

export const MoldOrderDetailEditForm: React.FC<
	MoldOrderDetailEditFormProps
> = ({ detail, moldOrderMasterId, onClose, onSuccess }) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	// 초기 폼 데이터를 메모이제이션으로 최적화
	const initialFormData = useMemo(() => {
		if (detail) {
			return {
				moldMasterId: detail.moldMasterId || 0,
				num: detail.num || 0,
				orderPrice: detail.orderPrice || 0,
				orderAmount: detail.orderAmount || 0,
				vendorId: detail.vendorId || 0,
				vendorName: detail.vendorName || '',
			};
		}
		return {
			moldMasterId: 0,
			num: 0,
			orderPrice: 0,
			orderAmount: 0,
			vendorId: 0,
			vendorName: '',
		};
	}, [detail]);

	const [formData, setFormData] =
		useState<Partial<MoldOrderDetailDto>>(initialFormData);

	const updateMoldOrderDetail = useUpdateMoldOrderDetail();
	const createMoldOrderDetail = useCreateMoldOrderDetail(0, 30);
	const queryClient = useQueryClient();

	// detail 변경 시 폼 데이터 초기화 (한 번만 실행)
	useEffect(() => {
		setFormData(initialFormData);
	}, [initialFormData]);

	// 수량과 가격으로 금액 자동 계산 (메모이제이션 사용)
	const calculatedOrderAmount = useMemo(() => {
		return (formData.num || 0) * (formData.orderPrice || 0);
	}, [formData.num, formData.orderPrice]);

	// 계산된 금액이 변경될 때만 업데이트
	useEffect(() => {
		if (formData.orderAmount !== calculatedOrderAmount) {
			setFormData((prev) => ({
				...prev,
				orderAmount: calculatedOrderAmount,
			}));
		}
	}, [calculatedOrderAmount, formData.orderAmount]);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (detail?.id) {
				// 수정 모드
				const updateRequest = {
					orderMonth: detail.orderMonth,
					accountMonth: detail.accountMonth,
					itemId: detail.itemId,
					inDate: detail.inDate,
					moldOrderMasterId: detail.moldOrderMasterId,
					moldMasterId: formData.moldMasterId || detail.moldMasterId,
					progressId: detail.progressId,
					inMonth: detail.inMonth,
					num: formData.num || detail.num,
					orderPrice: formData.orderPrice || detail.orderPrice,
					isIn: detail.isIn,
					orderAmount: formData.orderAmount || detail.orderAmount,
					vendorId: formData.vendorId || detail.vendorId,
					vendorName: formData.vendorName || detail.vendorName,
				};

				updateMoldOrderDetail.mutate({
					id: detail.id,
					data: updateRequest,
				});
			} else {
				// 생성 모드
				if (!moldOrderMasterId) {
					console.error('moldOrderMasterId is required for creation');
					return;
				}

				const createRequest = {
					orderMonth: new Date()
						.toISOString()
						.slice(0, 7)
						.replace('-', ''), // 현재 월 (YYYYMM)
					accountMonth: new Date()
						.toISOString()
						.slice(0, 7)
						.replace('-', ''), // 현재 월 (YYYYMM)
					itemId: 1, // 기본값 1
					inDate: new Date().toISOString().split('T')[0], // 현재 날짜 (YYYY-MM-DD)
					moldOrderMasterId: moldOrderMasterId, // props로 받은 마스터 ID
					moldMasterId: formData.moldMasterId || 1, // 폼에서 입력받은 값 사용, 기본값 1
					progressId: 1, // 기본값 1
					inMonth: new Date()
						.toISOString()
						.slice(0, 7)
						.replace('-', ''), // 현재 월 (YYYYMM)
					num: formData.num || 1, // 기본값 1
					orderPrice: formData.orderPrice || 0,
					isIn: false, // 입고 상태 false로 설정
					orderAmount: formData.orderAmount || 0,
					vendorId: formData.vendorId || 1, // 폼에서 선택한 vendorId 사용
					vendorName: formData.vendorName || '', // 폼에서 입력받은 vendorName 사용
				};

				createMoldOrderDetail.mutate([createRequest]);
			}
		},
		[
			detail,
			formData,
			moldOrderMasterId,
			updateMoldOrderDetail,
			createMoldOrderDetail,
		]
	);

	const handleClose = useCallback(() => {
		if (
			!updateMoldOrderDetail.isPending &&
			!createMoldOrderDetail.isPending
		) {
			onClose();
		}
	}, [
		updateMoldOrderDetail.isPending,
		createMoldOrderDetail.isPending,
		onClose,
	]);

	// 수정 성공 시 모달 닫기
	useEffect(() => {
		if (updateMoldOrderDetail.isSuccess) {
			// 단순화된 쿼리 키로 무효화
			if (moldOrderMasterId) {
				// 해당 masterId와 관련된 모든 쿼리 무효화
				queryClient.invalidateQueries({
					queryKey: ['mold-order-detail-by-master'],
					predicate: (query) => {
						// 쿼리 키에 masterId가 포함된 모든 쿼리 무효화
						const queryKey = query.queryKey as string[];
						const result = (
							queryKey.length > 1 &&
							queryKey[1] &&
							queryKey[1]
								.toString()
								.startsWith(moldOrderMasterId.toString())
						);
						return Boolean(result);
					},
				});
			}

			onSuccess?.();
			onClose();
		}
	}, [
		updateMoldOrderDetail.isSuccess,
		onSuccess,
		onClose,
		queryClient,
		moldOrderMasterId,
	]);

	// 생성 성공 시 모달 닫기
	useEffect(() => {
		if (createMoldOrderDetail.isSuccess) {
			// 단순화된 쿼리 키로 무효화
			if (moldOrderMasterId) {
				// 해당 masterId와 관련된 모든 쿼리 무효화
				queryClient.invalidateQueries({
					queryKey: ['mold-order-detail-by-master'],
					predicate: (query) => {
						// 쿼리 키에 masterId가 포함된 모든 쿼리 무효화
						const queryKey = query.queryKey as string[];
						const result = (
							queryKey.length > 1 &&
							queryKey[1] &&
							queryKey[1]
								.toString()
								.startsWith(moldOrderMasterId.toString())
						);
						return Boolean(result);
					},
				});
			}

			onSuccess?.();
			onClose();
		}
	}, [
		createMoldOrderDetail.isSuccess,
		onSuccess,
		onClose,
		queryClient,
		moldOrderMasterId,
	]);

	// detail이 null이면 빈 폼을 표시 (생성 모드)
	// detail이 있으면 기존 데이터로 폼을 채움 (수정 모드)

	return (
		<div className="w-full max-w-4xl mx-auto">
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Form Fields */}
				<div className="space-y-4">
					{/* 기본 정보 그룹 */}
					<div className="grid grid-cols-2 gap-5">
						{/* 금형 마스터 선택 */}
						<div className="mb-2">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								{tCommon('pages.mold.mold')}
							</label>
							<MoldMasterSelectComponent
								placeholder="금형을 선택해주세요"
								value={formData.moldMasterId?.toString() || ''}
								onChange={(value) => {
									setFormData((prev) => ({
										...prev,
										moldMasterId: value
											? parseInt(value)
											: 0,
									}));
								}}
								disabled={
									updateMoldOrderDetail.isPending ||
									createMoldOrderDetail.isPending
								}
								className="w-full"
								fieldKey="moldName"
								valueKey="id"
								labelKey="moldName"
							/>
						</div>
						{/* 거래처 선택 */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								{t('columns.vendor')}
							</label>
							<VendorSelectComponent
								placeholder="거래처를 선택해주세요"
								value={formData.vendorId?.toString() || ''}
								onChange={(value, label) => {
									setFormData((prev) => ({
										...prev,
										vendorId: value ? parseInt(value) : 0,
										vendorName: label || '',
									}));
								}}
								disabled={
									updateMoldOrderDetail.isPending ||
									createMoldOrderDetail.isPending
								}
								className="w-full"
							/>
						</div>
					</div>

					{/* 발주 정보 그룹 */}
					<div>
						<div className="flex items-center mb-3">
							<h3 className="text-base font-semibold text-gray-800 mr-3">
								발주 정보
							</h3>
							<div className="flex-1 border-b border-gray-300"></div>
						</div>
						<div className="grid grid-cols-3 gap-4">
							{/* 수량 */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									{t('columns.num')}
								</label>
								<input
									type="text"
									value={formData.num || ''}
									onChange={(e) => {
										const value = e.target.value.replace(
											/[^0-9]/g,
											''
										);
										setFormData((prev) => ({
											...prev,
											num: parseInt(value) || 0,
										}));
									}}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									disabled={
										updateMoldOrderDetail.isPending ||
										createMoldOrderDetail.isPending
									}
									placeholder="숫자만 입력"
								/>
							</div>
							{/* 발주 가격 */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									{t('columns.orderPrice')}
								</label>
								<input
									type="text"
									value={formData.orderPrice || ''}
									onChange={(e) => {
										const value = e.target.value.replace(
											/[^0-9]/g,
											''
										);
										setFormData((prev) => ({
											...prev,
											orderPrice: parseInt(value) || 0,
										}));
									}}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									disabled={
										updateMoldOrderDetail.isPending ||
										createMoldOrderDetail.isPending
									}
									placeholder="숫자만 입력"
								/>
							</div>
							{/* 주문 금액 */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									{t('columns.orderAmount')}
								</label>
								<input
									type="number"
									value={formData.orderAmount || 0}
									className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
									disabled={true}
									readOnly
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 pt-6 border-t">
					<RadixButton
						type="button"
						onClick={handleClose}
						disabled={
							updateMoldOrderDetail.isPending ||
							createMoldOrderDetail.isPending
						}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						{tCommon('cancel')}
					</RadixButton>
					<RadixButton
						type="submit"
						disabled={
							updateMoldOrderDetail.isPending ||
							createMoldOrderDetail.isPending
						}
						className="px-4 py-2 text-sm font-medium text-white bg-Colors-Brand-600 border border-transparent rounded-md hover:bg-Colors-Brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-Colors-Brand-500"
					>
						{updateMoldOrderDetail.isPending ||
						createMoldOrderDetail.isPending
							? tCommon('saving')
							: tCommon('save')}
					</RadixButton>
				</div>
			</form>
		</div>
	);
};
