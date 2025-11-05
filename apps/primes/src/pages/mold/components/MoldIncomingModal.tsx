import React, { useState, useEffect } from 'react';
import { RadixButton } from '@radix-ui/components';
import { X, Package } from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { useCreateMoldOrderIngoing } from '@primes/hooks';
import { toast } from 'sonner';
import {
	MoldOrderDetailDto,
	MoldOrderIngoingCreateRequest,
} from '@primes/types/mold';

interface MoldIncomingModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedDetail: MoldOrderDetailDto | null;
	onSuccess?: () => void;
}

export const MoldIncomingModal: React.FC<MoldIncomingModalProps> = ({
	isOpen,
	onClose,
	selectedDetail,
	onSuccess,
}) => {
	const { t } = useTranslation('common');
	const [incomingData, setIncomingData] = useState<MoldOrderIngoingCreateRequest>({
		moldOrderDetailId: 0,
		accountMonth: '',
		inDate: '',
		inMonth: '',
		inNum: 0,
		inPrice: 0,
		inAmount: 0,
		placeName: '', // Add required field
		isDev: false,
		isChange: false,
		auditBy: '',
		auditDate: '',
		isPass: false,
		moldSheetImg: '',
	});

	const createMoldOrderIngoing = useCreateMoldOrderIngoing(0, 30);

	// Initialize form data when selectedDetail changes
	useEffect(() => {
		if (selectedDetail) {
			const today = new Date();
			const currentMonth = today.toISOString().slice(0, 7); // YYYY-MM format
			const currentDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format

			setIncomingData({
				moldOrderDetailId: selectedDetail.id,
				accountMonth: selectedDetail.accountMonth || currentMonth,
				inDate: currentDate,
				inMonth: currentMonth,
				inNum: selectedDetail.num || 0,
				inPrice: selectedDetail.orderPrice || 0,
				inAmount: (selectedDetail.num || 0) * (selectedDetail.orderPrice || 0),
				placeName: 'Lack-001-001', // Add default place name
				isDev: selectedDetail.isDev || false,
				isChange: selectedDetail.isChange || false,
				auditBy: '',
				auditDate: currentDate,
				isPass: true,
				moldSheetImg: '',
			});
		}
	}, [selectedDetail]);

	const handleInputChange = (field: keyof MoldOrderIngoingCreateRequest, value: any) => {
		setIncomingData(prev => {
			const updated = { ...prev, [field]: value };
			
			// Auto-calculate inAmount when inNum or inPrice changes
			if (field === 'inNum' || field === 'inPrice') {
				updated.inAmount = (updated.inNum || 0) * (updated.inPrice || 0);
			}
			
			return updated;
		});
	};

	const handleSubmit = async () => {
		if (!selectedDetail) return;

		try {
			await createMoldOrderIngoing.mutateAsync({
				dataList: [incomingData]
			});

			toast.success('입고가 성공적으로 등록되었습니다.');
			onSuccess?.();
			onClose();
		} catch (error: any) {
			console.error('입고 등록 실패:', error);
			toast.error(`입고 등록 실패: ${error.message || 'Unknown error'}`);
		}
	};

	const handleCancel = () => {
		onClose();
	};

	if (!isOpen || !selectedDetail) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-2">
						<Package className="w-5 h-5 text-blue-600" />
						<h2 className="text-xl font-semibold">금형 입고 등록</h2>
					</div>
					<RadixButton
						variant="ghost"
						size="sm"
						onClick={handleCancel}
						className="h-8 w-8 p-0"
					>
						<X className="h-4 w-4" />
					</RadixButton>
				</div>

				{/* Order Info */}
				<div className="bg-gray-50 rounded-lg p-4 mb-6">
					<h3 className="font-medium text-gray-900 mb-3">주문 정보</h3>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="text-gray-600">금형 코드:</span>
							<span className="ml-2 font-medium">{selectedDetail.moldMaster?.moldCode || '-'}</span>
						</div>
						<div>
							<span className="text-gray-600">금형명:</span>
							<span className="ml-2 font-medium">{selectedDetail.moldMaster?.moldName || '-'}</span>
						</div>
						<div>
							<span className="text-gray-600">주문 수량:</span>
							<span className="ml-2 font-medium">{selectedDetail.num?.toLocaleString()}</span>
						</div>
						<div>
							<span className="text-gray-600">주문 단가:</span>
							<span className="ml-2 font-medium">{selectedDetail.orderPrice?.toLocaleString()}</span>
						</div>
					</div>
				</div>

				{/* Incoming Form */}
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								입고 수량 *
							</label>
							<input
								type="number"
								value={incomingData.inNum || ''}
								onChange={(e) => handleInputChange('inNum', Number(e.target.value))}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="입고 수량을 입력하세요"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								입고 단가 *
							</label>
							<input
								type="number"
								value={incomingData.inPrice || ''}
								onChange={(e) => handleInputChange('inPrice', Number(e.target.value))}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="입고 단가를 입력하세요"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								입고 금액
							</label>
							<input
								type="text"
								value={incomingData.inAmount?.toLocaleString() || ''}
								readOnly
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								입고 날짜 *
							</label>
							<input
								type="date"
								value={typeof incomingData.inDate === 'string' ? incomingData.inDate : incomingData.inDate?.toISOString().split('T')[0] || ''}
								onChange={(e) => handleInputChange('inDate', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								계정 월
							</label>
							<input
								type="month"
								value={incomingData.accountMonth || ''}
								onChange={(e) => handleInputChange('accountMonth', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								입고 월
							</label>
							<input
								type="month"
								value={incomingData.inMonth || ''}
								onChange={(e) => handleInputChange('inMonth', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								검수자
							</label>
							<input
								type="text"
								value={incomingData.auditBy || ''}
								onChange={(e) => handleInputChange('auditBy', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="검수자명을 입력하세요"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								검수 날짜
							</label>
							<input
								type="date"
								value={typeof incomingData.auditDate === 'string' ? incomingData.auditDate : incomingData.auditDate?.toISOString().split('T')[0] || ''}
								onChange={(e) => handleInputChange('auditDate', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								checked={incomingData.isDev || false}
								onChange={(e) => handleInputChange('isDev', e.target.checked)}
								className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span className="text-sm text-gray-700">개발품</span>
						</label>
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								checked={incomingData.isChange || false}
								onChange={(e) => handleInputChange('isChange', e.target.checked)}
								className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span className="text-sm text-gray-700">변경품</span>
						</label>
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								checked={incomingData.isPass || false}
								onChange={(e) => handleInputChange('isPass', e.target.checked)}
								className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span className="text-sm text-gray-700">검수 통과</span>
						</label>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end gap-3 mt-6 pt-4 border-t">
					<RadixButton
						variant="outline"
						onClick={handleCancel}
						disabled={createMoldOrderIngoing.isPending}
					>
						취소
					</RadixButton>
					<RadixButton
						onClick={handleSubmit}
						disabled={createMoldOrderIngoing.isPending}
						className="bg-blue-600 hover:bg-blue-700 text-white"
					>
						{createMoldOrderIngoing.isPending ? '처리 중...' : '입고 등록'}
					</RadixButton>
				</div>
			</div>
		</div>
	);
};

export default MoldIncomingModal;
