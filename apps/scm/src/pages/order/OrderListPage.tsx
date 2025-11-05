import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DatatableComponent } from '@scm/components';
import {
	OutsourcingOrderMaster,
	OrderStatus,
	Priority,
} from '@scm/types/order';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

// 임시 데이터 (실제로는 API에서 가져올 예정)
const mockOrders: OutsourcingOrderMaster[] = [
	{
		id: '1',
		orderNumber: 'ORD-2024-001',
		customerName: '삼성전자',
		customerCode: 'SAMSUNG',
		orderDate: new Date('2024-01-15'),
		dueDate: new Date('2024-02-15'),
		status: OrderStatus.RECEIVED,
		priority: Priority.HIGH,
		totalAmount: 15000000,
		currency: 'KRW',
		memo: '긴급 주문',
		createdAt: new Date('2024-01-15'),
		updatedAt: new Date('2024-01-15'),
	},
	{
		id: '2',
		orderNumber: 'ORD-2024-002',
		customerName: 'LG전자',
		customerCode: 'LG',
		orderDate: new Date('2024-01-16'),
		dueDate: new Date('2024-02-20'),
		status: OrderStatus.MATERIAL_CHECK,
		priority: Priority.MEDIUM,
		totalAmount: 8500000,
		currency: 'KRW',
		memo: '일반 주문',
		createdAt: new Date('2024-01-16'),
		updatedAt: new Date('2024-01-16'),
	},
	{
		id: '3',
		orderNumber: 'ORD-2024-003',
		customerName: '현대자동차',
		customerCode: 'HYUNDAI',
		orderDate: new Date('2024-01-17'),
		dueDate: new Date('2024-02-25'),
		status: OrderStatus.WORK_ORDER,
		priority: Priority.HIGH,
		totalAmount: 22000000,
		currency: 'KRW',
		memo: '신규 모델 부품',
		createdAt: new Date('2024-01-17'),
		updatedAt: new Date('2024-01-17'),
	},
	{
		id: '4',
		orderNumber: 'ORD-2024-004',
		customerName: '기아자동차',
		customerCode: 'KIA',
		orderDate: new Date('2024-01-18'),
		dueDate: new Date('2024-02-28'),
		status: OrderStatus.IN_PROGRESS,
		priority: Priority.MEDIUM,
		totalAmount: 18000000,
		currency: 'KRW',
		memo: '엔진 부품 가공',
		createdAt: new Date('2024-01-18'),
		updatedAt: new Date('2024-01-18'),
	},
	{
		id: '5',
		orderNumber: 'ORD-2024-005',
		customerName: '포드코리아',
		customerCode: 'FORD',
		orderDate: new Date('2024-01-19'),
		dueDate: new Date('2024-03-01'),
		status: OrderStatus.QUALITY_CHECK,
		priority: Priority.LOW,
		totalAmount: 12000000,
		currency: 'KRW',
		memo: '브레이크 패드',
		createdAt: new Date('2024-01-19'),
		updatedAt: new Date('2024-01-19'),
	},
	{
		id: '6',
		orderNumber: 'ORD-2024-006',
		customerName: 'BMW코리아',
		customerCode: 'BMW',
		orderDate: new Date('2024-01-20'),
		dueDate: new Date('2024-03-05'),
		status: OrderStatus.COMPLETED,
		priority: Priority.HIGH,
		totalAmount: 35000000,
		currency: 'KRW',
		memo: '고급 차체 부품',
		createdAt: new Date('2024-01-20'),
		updatedAt: new Date('2024-01-20'),
	},
	{
		id: '7',
		orderNumber: 'ORD-2024-007',
		customerName: '벤츠코리아',
		customerCode: 'MERCEDES',
		orderDate: new Date('2024-01-21'),
		dueDate: new Date('2024-03-10'),
		status: OrderStatus.SHIPPED,
		priority: Priority.URGENT,
		totalAmount: 45000000,
		currency: 'KRW',
		memo: '프리미엄 부품',
		createdAt: new Date('2024-01-21'),
		updatedAt: new Date('2024-01-21'),
	},
	{
		id: '8',
		orderNumber: 'ORD-2024-008',
		customerName: '아우디코리아',
		customerCode: 'AUDI',
		orderDate: new Date('2024-01-22'),
		dueDate: new Date('2024-03-15'),
		status: OrderStatus.DELIVERED,
		priority: Priority.MEDIUM,
		totalAmount: 28000000,
		currency: 'KRW',
		memo: '전자 제어 부품',
		createdAt: new Date('2024-01-22'),
		updatedAt: new Date('2024-01-22'),
	},
];

export const OrderListPage: React.FC = () => {
	const [orders, setOrders] = useState<OutsourcingOrderMaster[]>(mockOrders);
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

	const toggleRowSelection = (rowId: string) => {
		const newSelectedRows = new Set(selectedRows);
		if (newSelectedRows.has(rowId)) {
			newSelectedRows.delete(rowId);
		} else {
			newSelectedRows.clear();
			newSelectedRows.add(rowId);
		}
		setSelectedRows(newSelectedRows);
	};

	// 주문 마스터 테이블 컬럼 정의
	const orderMasterColumns: ColumnDef<OutsourcingOrderMaster>[] = [
		{
			accessorKey: 'orderNumber',
			header: '주문번호',
			size: 150,
		},
		{
			accessorKey: 'customerName',
			header: '발주업체',
			size: 120,
		},
		{
			accessorKey: 'orderDate',
			header: '주문일자',
			size: 100,
			cell: ({ getValue }) => {
				const date = getValue() as Date;
				return date.toLocaleDateString('ko-KR');
			},
		},
		{
			accessorKey: 'dueDate',
			header: '납기일자',
			size: 100,
			cell: ({ getValue }) => {
				const date = getValue() as Date;
				return date.toLocaleDateString('ko-KR');
			},
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 100,
			cell: ({ getValue }) => {
				const status = getValue() as OrderStatus;
				const statusMap: Record<OrderStatus, string> = {
					[OrderStatus.RECEIVED]: '접수',
					[OrderStatus.MATERIAL_CHECK]: '소재확인',
					[OrderStatus.WORK_ORDER]: '작업지시',
					[OrderStatus.IN_PROGRESS]: '진행중',
					[OrderStatus.QUALITY_CHECK]: '품질검사',
					[OrderStatus.COMPLETED]: '완료',
					[OrderStatus.SHIPPED]: '출하',
					[OrderStatus.DELIVERED]: '배송완료',
				};
				return statusMap[status] || status;
			},
		},
		{
			accessorKey: 'priority',
			header: '우선순위',
			size: 80,
			cell: ({ getValue }) => {
				const priority = getValue() as Priority;
				const priorityMap: Record<Priority, string> = {
					[Priority.LOW]: '낮음',
					[Priority.MEDIUM]: '보통',
					[Priority.HIGH]: '높음',
					[Priority.URGENT]: '긴급',
				};
				return priorityMap[priority] || priority;
			},
		},
		{
			accessorKey: 'totalAmount',
			header: '총 금액',
			size: 100,
			cell: ({ getValue }) => {
				const amount = getValue() as number;
				return amount.toLocaleString('ko-KR') + '원';
			},
		},
	];

	// 액션 버튼들
	const actionButtons = (
		<div className="flex gap-2">
			{/* 주문 접수 - 강조된 Primary 버튼 */}
			<button
				onClick={() => {
					// 주문 접수 페이지로 이동
					window.location.href = '/order/receive';
				}}
				className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
			>
				<Plus size={16} />
				주문 접수
			</button>

			{/* 상세 보기 - Outline 스타일 */}
			<button
				onClick={() => {
					if (selectedRows.size === 1) {
						const selectedId = Array.from(selectedRows)[0];
						// 상세 보기 로직 (모달 또는 페이지 이동)
						console.log('상세 보기:', selectedId);
					}
				}}
				disabled={selectedRows.size !== 1}
				className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
			>
				<Eye size={14} />
				상세 보기
			</button>

			{/* 수정 - Outline 스타일 */}
			<button
				onClick={() => {
					if (selectedRows.size === 1) {
						const selectedId = Array.from(selectedRows)[0];
						// 수정 로직 (모달 또는 페이지 이동)
						console.log('수정:', selectedId);
					}
				}}
				disabled={selectedRows.size !== 1}
				className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
			>
				<Edit size={14} />
				수정
			</button>

			{/* 삭제 - Outline 스타일 */}
			<button
				onClick={() => {
					if (selectedRows.size > 0) {
						const selectedIds = Array.from(selectedRows);
						// 삭제 확인 로직
						if (
							confirm(
								`선택된 ${selectedIds.length}개 항목을 삭제하시겠습니까?`
							)
						) {
							console.log('삭제:', selectedIds);
						}
					}
				}}
				disabled={selectedRows.size === 0}
				className="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
			>
				<Trash2 size={14} />
				삭제
			</button>
		</div>
	);

	return (
		<div className="w-full h-full">
			<div className="border rounded-lg w-full h-full">
				<DatatableComponent
					data={orders}
					columns={orderMasterColumns}
					tableTitle="주문 목록"
					rowCount={orders.length}
					useSearch={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					actionButtons={actionButtons}
					defaultPageSize={10}
					headerOffset="200px"
					enableSingleSelect={true}
				/>
			</div>
		</div>
	);
};

export default OrderListPage;
