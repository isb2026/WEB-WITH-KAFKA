import React, { useState, useEffect } from 'react';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
} from '@repo/radix-ui/components';
import { PlanMaster } from '@primes/types/production';
import { OrderMaster } from '@primes/types/sales';

// 작업지시 데이터 임시 타입 (API 연동 시 실제 타입으로 대체)
interface WorkOrderData {
	id: number;
	workOrderCode: string;
	quantity: number;
	status: string;
	itemName?: string;
	startDate?: string;
	endDate?: string;
}

export const ProductionPlanStatusPage: React.FC = () => {
	const [selectedPlan, setSelectedPlan] = useState<PlanMaster | null>(null);
	const [selectedMasterRows, setSelectedMasterRows] = useState<Set<string>>(
		new Set()
	);

	// 임시 계획 목록 데이터 (나중에 API 연동으로 대체)
	const planListData: PlanMaster[] = [
		{
			id: 1,
			accountMon: '2024-01',
			planCode: 'PLAN-001',
			itemNo: 1001,
			planQuantity: 1000,
			planType: '일반',
			vendorOrderCode: 'ORD-001',
			status: '진행중',
			itemUnit: 'EA',
		},
		{
			id: 2,
			accountMon: '2024-01',
			planCode: 'PLAN-002',
			itemNo: 1002,
			planQuantity: 2000,
			planType: '긴급',
			vendorOrderCode: 'ORD-002',
			status: '대기',
			itemUnit: 'EA',
		},
		{
			id: 3,
			accountMon: '2024-01',
			planCode: 'PLAN-003',
			itemNo: 1003,
			planQuantity: 1500,
			planType: '일반',
			vendorOrderCode: 'ORD-003',
			status: '완료',
			itemUnit: 'EA',
		},
	];

	// 임시 수주 정보 데이터 (나중에 API 연동으로 대체)
	const orderData: OrderMaster | null = selectedPlan?.vendorOrderCode
		? {
				id: 1,
				orderCode: selectedPlan.vendorOrderCode,
				orderType: '일반',
				vendorNo: 1001,
				vendorName: '거래처A',
				orderDate: '2024-01-01',
				deliveryLocationCode: 1,
				deliveryLocation: '본사',
				requestDate: '2024-01-10',
				currencyUnit: 'KRW',
				isApproval: false,
				approvalBy: '',
				approvalAt: '',
				isClose: false,
				closeBy: '',
				closeAt: '',
				isUse: true,
				isDelete: false,
				createdAt: '2024-01-01T00:00:00',
				createdBy: '관리자',
				updatedAt: '2024-01-01T00:00:00',
				updatedBy: '관리자',
				tenantId: 1,
				orderDetails: [],
			}
		: null;

	// 임시 작업지시 목록 데이터 (나중에 API 연동으로 대체)
	const workOrderData: WorkOrderData[] = selectedPlan
		? [
				{
					id: 1,
					workOrderCode: 'WO-001',
					quantity: 100,
					status: '진행중',
					itemName: '제품A',
					startDate: '2024-01-15',
					endDate: '2024-01-20',
				},
				{
					id: 2,
					workOrderCode: 'WO-002',
					quantity: 200,
					status: '완료',
					itemName: '제품A',
					startDate: '2024-01-10',
					endDate: '2024-01-14',
				},
				{
					id: 3,
					workOrderCode: 'WO-003',
					quantity: 150,
					status: '대기',
					itemName: '제품A',
					startDate: '2024-01-25',
					endDate: '2024-01-30',
				},
			]
		: [];

	// 계획 목록 컬럼 정의
	const planColumns = [
		{
			accessorKey: 'planCode',
			header: '계획코드',
			size: 120,
		},
		{
			accessorKey: 'itemNo',
			header: '품목번호',
			size: 100,
		},
		{
			accessorKey: 'planQuantity',
			header: '계획수량',
			size: 100,
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as number;
				return `${value?.toLocaleString() || 0}`;
			},
		},
		{
			accessorKey: 'planType',
			header: '계획유형',
			size: 80,
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 80,
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const status = getValue() as string;
				const statusColors = {
					완료: 'bg-green-100 text-green-800',
					진행중: 'bg-blue-100 text-blue-800',
					대기: 'bg-yellow-100 text-yellow-800',
				};
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${
							statusColors[status as keyof typeof statusColors] ||
							'bg-gray-100 text-gray-800'
						}`}
					>
						{status}
					</span>
				);
			},
		},
	];

	// 작업지시 목록 컬럼 정의
	const workOrderColumns = [
		{
			accessorKey: 'workOrderCode',
			header: '작업지시코드',
			size: 140,
		},
		{
			accessorKey: 'itemName',
			header: '품목명',
			size: 120,
		},
		{
			accessorKey: 'quantity',
			header: '수량',
			size: 80,
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as number;
				return `${value?.toLocaleString() || 0}`;
			},
		},
		{
			accessorKey: 'startDate',
			header: '시작일',
			size: 100,
		},
		{
			accessorKey: 'endDate',
			header: '종료일',
			size: 100,
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 80,
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const status = getValue() as string;
				const statusColors = {
					완료: 'bg-green-100 text-green-800',
					진행중: 'bg-blue-100 text-blue-800',
					대기: 'bg-yellow-100 text-yellow-800',
				};
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${
							statusColors[status as keyof typeof statusColors] ||
							'bg-gray-100 text-gray-800'
						}`}
					>
						{status}
					</span>
				);
			},
		},
	];

	// useDataTable 훅 사용 (기존 패턴과 동일)
	const {
		table: masterTable,
		toggleRowSelection: toggleMasterRowSelection,
		selectedRows: selectedMasterRowsFromTable,
	} = useDataTable(
		planListData,
		planColumns,
		planListData.length,
		1,
		0,
		planListData.length,
		() => {}
	);

	const {
		table: detailTable,
		toggleRowSelection: toggleDetailRowSelection,
		selectedRows: selectedDetailRows,
	} = useDataTable(
		workOrderData,
		workOrderColumns,
		workOrderData.length,
		1,
		0,
		workOrderData.length,
		() => {}
	);

	// Master row selection 처리 (기존 패턴과 동일)
	useEffect(() => {
		if (selectedMasterRowsFromTable.size > 0) {
			const selectedRowIndex = Array.from(selectedMasterRowsFromTable)[0];
			const rowIndex = parseInt(selectedRowIndex as string);
			if (
				!isNaN(rowIndex) &&
				rowIndex >= 0 &&
				rowIndex < planListData.length
			) {
				const selectedRow = planListData[rowIndex];
				if (selectedRow && selectedRow.id) {
					setSelectedPlan(selectedRow);
					setSelectedMasterRows(selectedMasterRowsFromTable);
				}
			}
		} else {
			setSelectedPlan(null);
			setSelectedMasterRows(new Set());
		}
	}, [selectedMasterRowsFromTable]);

	// 계획정보 InfoGrid 키 정의
	const PlanInfoGridKeys = [
		{ key: 'planCode', label: '계획코드' },
		{ key: 'accountMon', label: '회계년월' },
		{ key: 'itemNo', label: '품목번호' },
		{ key: 'planQuantity', label: '계획수량' },
		{ key: 'planType', label: '계획유형' },
		{ key: 'status', label: '상태' },
		{ key: 'itemUnit', label: '단위' },
		{ key: 'customOrderCode', label: '수주코드' },
	];

	// 수주정보 InfoGrid 키 정의
	const OrderInfoGridKeys = [
		{ key: 'orderCode', label: '수주코드' },
		{ key: 'vendorName', label: '거래처명' },
		{ key: 'requestDate', label: '요청일자' },
		{ key: 'accountYear', label: '회계년도' },
		{ key: 'createdBy', label: '생성자' },
		{ key: 'createdAt', label: '생성일시' },
	];

	// 선택된 계획의 정보 (InfoGrid용 data 객체)
	const selectedPlanData = selectedPlan || {};

	return (
		<PageTemplate
			firstChildWidth="30%"
			splitterSizes={[30, 70]}
			splitterMinSize={[430, 800]}
			splitterGutterSize={6}
		>
			{/* 좌측: Master Table (계획 목록) */}
			<div className="border rounded-lg">
				<DatatableComponent
					table={masterTable}
					columns={planColumns}
					data={planListData}
					tableTitle="계획 목록"
					rowCount={planListData.length}
					selectedRows={selectedMasterRows}
					toggleRowSelection={toggleMasterRowSelection}
					enableSingleSelect
				/>
			</div>

			{/* 우측: Detail Section */}
			<div className="flex flex-col gap-2">
				<div className="border rounded-lg">
					<RadixTabsRoot defaultValue="planInfo">
						<RadixTabsList className="inline-flex h-10 items-center w-full justify-start border-b">
							<RadixTabsTrigger
								value="planInfo"
								className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
							>
								계획정보
							</RadixTabsTrigger>
							<RadixTabsTrigger
								value="orderInfo"
								className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
							>
								수주정보
							</RadixTabsTrigger>
						</RadixTabsList>
						<RadixTabsContent value="planInfo">
							<InfoGrid
								columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 h-full"
								classNames={{
									container: 'rounded shadow-sm',
									item: 'flex gap-2 items-center p-2',
									label: 'text-gray-700 text-sm',
									value: 'font-bold text-sm',
								}}
								data={selectedPlan ? selectedPlanData : {}}
								keys={PlanInfoGridKeys}
							/>
						</RadixTabsContent>
						<RadixTabsContent value="orderInfo">
							{orderData ? (
								<InfoGrid
									columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 h-full"
									classNames={{
										container: 'rounded shadow-sm',
										item: 'flex gap-2 items-center p-2',
										label: 'text-gray-700 text-sm',
										value: 'font-bold text-sm',
									}}
									data={
										orderData as unknown as Record<
											string,
											unknown
										>
									}
									keys={OrderInfoGridKeys}
								/>
							) : (
								<div className="text-center py-8 text-gray-500">
									수주정보가 없습니다
								</div>
							)}
						</RadixTabsContent>
					</RadixTabsRoot>
				</div>

				{/* 작업지시 목록 */}
				<div className="border rounded-lg">
					<DatatableComponent
						table={detailTable}
						columns={workOrderColumns}
						data={workOrderData}
						tableTitle="작업지시 목록"
						rowCount={workOrderData.length}
						selectedRows={selectedDetailRows}
						toggleRowSelection={toggleDetailRowSelection}
						headerOffset="360px"
					/>
				</div>
			</div>
		</PageTemplate>
	);
};
