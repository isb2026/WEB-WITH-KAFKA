import { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	History,
	Clock,
	User,
	Edit3,
	CheckCircle,
	XCircle,
} from 'lucide-react';
import { orderChangeHistoryData } from '../dummy-data/orderChangeHistoryData';
import { RadixSelect, RadixSelectItem } from '@radix-ui/components';

interface OrderChangeHistory {
	id: number;
	orderNumber: string;
	productName: string;
	customerName: string;
	changeType:
		| 'quantity'
		| 'due_date'
		| 'specification'
		| 'cancellation'
		| 'addition';
	oldValue: string;
	newValue: string;
	changeReason: string;
	changedBy: string;
	changedAt: string;
	status: 'pending' | 'approved' | 'rejected';
	approver?: string;
	approvedAt?: string;
	notes?: string;
}

export const OrderChangeHistoryPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<OrderChangeHistory[]>([]);
	const [filterType, setFilterType] = useState<string>('all');
	const [filterStatus, setFilterStatus] = useState<string>('all');

	useEffect(() => {
		setData(orderChangeHistoryData as OrderChangeHistory[]);
	}, []);

	const getChangeTypeIcon = (type: string) => {
		switch (type) {
			case 'quantity':
				return <Edit3 className="h-4 w-4 text-blue-600" />;
			case 'due_date':
				return <Clock className="h-4 w-4 text-yellow-600" />;
			case 'specification':
				return <Edit3 className="h-4 w-4 text-purple-600" />;
			case 'cancellation':
				return <XCircle className="h-4 w-4 text-red-600" />;
			case 'addition':
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			default:
				return <Edit3 className="h-4 w-4 text-gray-600" />;
		}
	};

	const getChangeTypeText = (type: string) => {
		switch (type) {
			case 'quantity':
				return '수량 변경';
			case 'due_date':
				return '납기일 변경';
			case 'specification':
				return '사양 변경';
			case 'cancellation':
				return '주문 취소';
			case 'addition':
				return '주문 추가';
			default:
				return type;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'approved':
				return 'bg-green-100 text-green-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending':
				return '대기중';
			case 'approved':
				return '승인됨';
			case 'rejected':
				return '거부됨';
			default:
				return status;
		}
	};

	const filteredData = data.filter((item) => {
		const typeMatch =
			filterType === 'all' || item.changeType === filterType;
		const statusMatch =
			filterStatus === 'all' || item.status === filterStatus;
		return typeMatch && statusMatch;
	});

	return (
		<div className="space-y-6">
			{/* 요약 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border shadow-sm">
					<div className="flex items-center">
						<div className="p-2 bg-blue-100 rounded-lg">
							<History className="h-6 w-6 text-blue-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								총 변경 건수
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data.length}
							</p>
						</div>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border shadow-sm">
					<div className="flex items-center">
						<div className="p-2 bg-yellow-100 rounded-lg">
							<Clock className="h-6 w-6 text-yellow-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								승인 대기
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'pending'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border shadow-sm">
					<div className="flex items-center">
						<div className="p-2 bg-green-100 rounded-lg">
							<CheckCircle className="h-6 w-6 text-green-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								승인됨
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'approved'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border shadow-sm">
					<div className="flex items-center">
						<div className="p-2 bg-red-100 rounded-lg">
							<XCircle className="h-6 w-6 text-red-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								거부됨
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'rejected'
									).length
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 타임라인 */}
			<div className="rounded-lg border overflow-hidden">
				<div className="flex justify-between px-4 py-4 border-b bg-gray-50">
					<h3 className="text-lg font-semibold text-gray-900">
						변경 이력 타임라인
					</h3>

					{/* 필터 */}
					<div className="flex gap-4">
						<div>
							<RadixSelect
								value={filterType}
								onValueChange={setFilterType}
								placeholder="변경 유형 선택"
								className="w-40"
							>
								<RadixSelectItem value="all">
									전체
								</RadixSelectItem>
								<RadixSelectItem value="quantity">
									수량 변경
								</RadixSelectItem>
								<RadixSelectItem value="due_date">
									납기일 변경
								</RadixSelectItem>
								<RadixSelectItem value="specification">
									사양 변경
								</RadixSelectItem>
								<RadixSelectItem value="cancellation">
									주문 취소
								</RadixSelectItem>
								<RadixSelectItem value="addition">
									주문 추가
								</RadixSelectItem>
							</RadixSelect>
						</div>
						<div>
							<RadixSelect
								value={filterStatus}
								onValueChange={setFilterStatus}
								placeholder="상태 선택"
								className="w-32"
							>
								<RadixSelectItem value="all">
									전체
								</RadixSelectItem>
								<RadixSelectItem value="pending">
									대기중
								</RadixSelectItem>
								<RadixSelectItem value="approved">
									승인됨
								</RadixSelectItem>
								<RadixSelectItem value="rejected">
									거부됨
								</RadixSelectItem>
							</RadixSelect>
						</div>
					</div>
				</div>

				<div className="overflow-y-auto" style={{ height: '62vh' }}>
					<div className="space-y-4">
						{filteredData.map((item, index) => (
							<div key={item.id} className="relative">
								{/* 타임라인 라인 */}
								{index < filteredData.length - 1 && (
									<div className="absolute left-6 top-8 w-0.5 h-16 bg-gray-200"></div>
								)}

								{/* 타임라인 포인트 */}
								<div className="absolute left-4 top-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center">
									{getChangeTypeIcon(item.changeType)}
								</div>

								{/* 컨텐츠 */}
								<div className="ml-12">
									<div className="bg-gray-50 rounded-lg p-4">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<h4 className="text-sm font-medium text-gray-900">
														{item.orderNumber} -{' '}
														{item.productName}
													</h4>
													<span
														className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
													>
														{getStatusText(
															item.status
														)}
													</span>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
													<div>
														<p className="text-gray-600">
															고객명:{' '}
															{item.customerName}
														</p>
														<p className="text-gray-600">
															변경 유형:{' '}
															{getChangeTypeText(
																item.changeType
															)}
														</p>
														<p className="text-gray-600">
															변경 사유:{' '}
															{item.changeReason}
														</p>
													</div>
													<div>
														<p className="text-gray-600">
															이전 값:{' '}
															{item.oldValue}
														</p>
														<p className="text-gray-600">
															새 값:{' '}
															{item.newValue}
														</p>
														{item.notes && (
															<p className="text-gray-600">
																비고:{' '}
																{item.notes}
															</p>
														)}
													</div>
												</div>

												<div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
													<div className="flex items-center gap-1">
														<User size={12} />
														변경자: {item.changedBy}
													</div>
													<div className="flex items-center gap-1">
														<Clock size={12} />
														변경일:{' '}
														{new Date(
															item.changedAt
														).toLocaleString(
															'ko-KR'
														)}
													</div>
													{item.approver && (
														<div className="flex items-center gap-1">
															<User size={12} />
															승인자:{' '}
															{item.approver}
														</div>
													)}
													{item.approvedAt && (
														<div className="flex items-center gap-1">
															<Clock size={12} />
															승인일:{' '}
															{new Date(
																item.approvedAt
															).toLocaleString(
																'ko-KR'
															)}
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderChangeHistoryPage;
