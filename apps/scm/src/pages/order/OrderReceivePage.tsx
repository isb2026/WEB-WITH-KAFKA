import React, { useState } from 'react';
import { DynamicForm, FormField } from '@scm/components';
import { Priority, OrderStatus } from '@scm/types/order';
import { Plus, Trash2 } from 'lucide-react';

interface OrderReceivePageProps {
	onClose?: () => void;
	onSuccess?: (data: any) => void;
}

export const OrderReceivePage: React.FC<OrderReceivePageProps> = ({
	onClose,
	onSuccess,
}) => {
	const [orderDetails, setOrderDetails] = useState<any[]>([
		{
			materialName: '',
			materialSpec: '',
			quantity: '',
			unit: '',
			unitPrice: '',
			processType: '',
			processSpec: '',
		},
	]);

	// 주문 마스터 폼 필드
	const masterFormFields: FormField[] = [
		{
			name: 'customerName',
			label: '발주업체명',
			type: 'text',
			required: true,
			placeholder: '발주업체명을 입력하세요',
		},
		{
			name: 'customerCode',
			label: '업체코드',
			type: 'text',
			placeholder: '업체코드를 입력하세요',
		},
		{
			name: 'orderDate',
			label: '주문일자',
			type: 'date',
			required: true,
			defaultValue: new Date().toISOString().split('T')[0],
		},
		{
			name: 'dueDate',
			label: '납기일자',
			type: 'date',
			required: true,
		},
		{
			name: 'priority',
			label: '우선순위',
			type: 'select',
			required: true,
			options: [
				{ label: '낮음', value: Priority.LOW },
				{ label: '보통', value: Priority.MEDIUM },
				{ label: '높음', value: Priority.HIGH },
				{ label: '긴급', value: Priority.URGENT },
			],
		},
		{
			name: 'currency',
			label: '통화',
			type: 'select',
			required: true,
			options: [
				{ label: '원화 (KRW)', value: 'KRW' },
				{ label: '달러 (USD)', value: 'USD' },
				{ label: '엔화 (JPY)', value: 'JPY' },
			],
			defaultValue: 'KRW',
		},
		{
			name: 'memo',
			label: '메모',
			type: 'textarea',
			placeholder: '주문 관련 메모를 입력하세요',
			rows: 3,
		},
	];

	// 주문 상세 폼 필드 (템플릿)
	const getDetailFormFields = (index: number): FormField[] => [
		{
			name: `materialName_${index}`,
			label: '소재명',
			type: 'text',
			required: true,
			placeholder: '소재명을 입력하세요',
		},
		{
			name: `materialSpec_${index}`,
			label: '소재 규격',
			type: 'text',
			required: true,
			placeholder: '소재 규격을 입력하세요',
		},
		{
			name: `quantity_${index}`,
			label: '수량',
			type: 'number',
			required: true,
			placeholder: '수량을 입력하세요',
		},
		{
			name: `unit_${index}`,
			label: '단위',
			type: 'select',
			required: true,
			options: [
				{ label: '개', value: '개' },
				{ label: 'EA', value: 'EA' },
				{ label: 'kg', value: 'kg' },
				{ label: 'm', value: 'm' },
				{ label: 'mm', value: 'mm' },
			],
		},
		{
			name: `unitPrice_${index}`,
			label: '단가',
			type: 'number',
			required: true,
			placeholder: '단가를 입력하세요',
		},
		{
			name: `processType_${index}`,
			label: '가공 유형',
			type: 'select',
			required: true,
			options: [
				{ label: '절삭가공', value: '절삭가공' },
				{ label: '성형가공', value: '성형가공' },
				{ label: '조립', value: '조립' },
				{ label: '도장', value: '도장' },
				{ label: '열처리', value: '열처리' },
			],
		},
		{
			name: `processSpec_${index}`,
			label: '가공 사양',
			type: 'textarea',
			placeholder: '가공 사양을 입력하세요',
			rows: 2,
		},
	];

	// 상세 항목 추가
	const addOrderDetail = () => {
		setOrderDetails([
			...orderDetails,
			{
				materialName: '',
				materialSpec: '',
				quantity: '',
				unit: '',
				unitPrice: '',
				processType: '',
				processSpec: '',
			},
		]);
	};

	// 상세 항목 삭제
	const removeOrderDetail = (index: number) => {
		if (orderDetails.length > 1) {
			setOrderDetails(orderDetails.filter((_, i) => i !== index));
		}
	};

	// 폼 제출 처리
	const handleSubmit = (data: Record<string, unknown>) => {
		console.log('주문 접수 데이터:', data);

		// 상세 데이터 정리
		const details = orderDetails.map((_, index) => ({
			materialName: data[`materialName_${index}`],
			materialSpec: data[`materialSpec_${index}`],
			quantity: data[`quantity_${index}`],
			unit: data[`unit_${index}`],
			unitPrice: data[`unitPrice_${index}`],
			processType: data[`processType_${index}`],
			processSpec: data[`processSpec_${index}`],
		}));

		const orderData = {
			...data,
			details,
			status: OrderStatus.RECEIVED,
		};

		if (onSuccess) {
			onSuccess(orderData);
		}
	};

	return (
		<div className="max-w-6xl mx-auto p-6 bg-white">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">주문 접수</h1>
				<p className="text-gray-600 mt-2">
					새로운 외주 주문을 접수합니다.
				</p>
			</div>

			{/* 주문 마스터 정보 */}
			<div className="mb-8">
				<h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
					주문 기본 정보
				</h2>
				<DynamicForm
					fields={masterFormFields}
					onSubmit={handleSubmit}
					submitButtonText=""
					visibleSaveButton={false}
				/>
			</div>

			{/* 주문 상세 정보 */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4 border-b pb-2">
					<h2 className="text-lg font-semibold text-gray-800">
						주문 상세 정보
					</h2>
					<button
						onClick={addOrderDetail}
						className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
					>
						<Plus size={14} />
						상세 추가
					</button>
				</div>

				{orderDetails.map((_, index) => (
					<div
						key={index}
						className="border rounded-lg p-4 mb-4 bg-gray-50"
					>
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-md font-medium text-gray-700">
								상세 항목 {index + 1}
							</h3>
							{orderDetails.length > 1 && (
								<button
									onClick={() => removeOrderDetail(index)}
									className="p-1 text-red-600 hover:text-red-800 transition-colors"
								>
									<Trash2 size={14} />
								</button>
							)}
						</div>
						<DynamicForm
							fields={getDetailFormFields(index)}
							onSubmit={() => {}}
							submitButtonText=""
							visibleSaveButton={false}
						/>
					</div>
				))}
			</div>

			{/* 하단 액션 버튼 */}
			<div className="flex justify-end gap-3 pt-6 border-t">
				<button
					onClick={onClose}
					className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
				>
					취소
				</button>
				<button
					onClick={() => {
						// 전체 폼 데이터 수집 및 제출
						const formData = new FormData();
						// 실제 구현에서는 폼 데이터를 수집하여 제출
						handleSubmit({});
					}}
					className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
				>
					주문 접수
				</button>
			</div>
		</div>
	);
};

export default OrderReceivePage;
