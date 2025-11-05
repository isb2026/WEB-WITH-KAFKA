import React, { useState } from 'react';
import { RadixIconButton, RadixSelect } from '@radix-ui/components';
import {
	Send,
	RefreshCw,
	CheckCircle,
	XCircle,
	Clock,
	AlertCircle,
	Check,
} from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { ProcessedColumnDef } from '@repo/radix-ui/hook';

interface MesIntegrationLog {
	id: string;
	workOrderNumber: string;
	productName: string;
	machineName: string;
	sendDate: string;
	sendTime: string;
	status: 'success' | 'failed' | 'pending' | 'retry';
	responseMessage: string;
	retryCount: number;
	lastRetryDate?: string;
	mesSystem: string;
	operator: string;
	notes?: string;
}

const MesWorkOrderSendPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString().split('T')[0]
	);

	// Mock data
	const mockData: MesIntegrationLog[] = [
		{
			id: '1',
			workOrderNumber: 'WO-2024-001',
			productName: '제품 A',
			machineName: '조립 설비 A',
			sendDate: '2024-01-15',
			sendTime: '08:00:00',
			status: 'success',
			responseMessage: '전송 성공',
			retryCount: 0,
			mesSystem: 'MES-A',
			operator: '김철수',
			notes: '정상 전송',
		},
		{
			id: '2',
			workOrderNumber: 'WO-2024-002',
			productName: '제품 B',
			machineName: '도장 설비 B',
			sendDate: '2024-01-15',
			sendTime: '09:00:00',
			status: 'success',
			responseMessage: '전송 성공',
			retryCount: 0,
			mesSystem: 'MES-A',
			operator: '이영희',
			notes: '정상 전송',
		},
		{
			id: '3',
			workOrderNumber: 'WO-2024-003',
			productName: '제품 C',
			machineName: '검사 설비 C',
			sendDate: '2024-01-15',
			sendTime: '10:00:00',
			status: 'failed',
			responseMessage: '연결 오류',
			retryCount: 2,
			lastRetryDate: '2024-01-15 10:15:00',
			mesSystem: 'MES-B',
			operator: '박민수',
			notes: '네트워크 연결 문제',
		},
		{
			id: '4',
			workOrderNumber: 'WO-2024-004',
			productName: '제품 D',
			machineName: '포장 설비 D',
			sendDate: '2024-01-15',
			sendTime: '11:00:00',
			status: 'pending',
			responseMessage: '대기 중',
			retryCount: 0,
			mesSystem: 'MES-A',
			operator: '김철수',
			notes: '전송 대기',
		},
		{
			id: '5',
			workOrderNumber: 'WO-2024-005',
			productName: '제품 E',
			machineName: '가공 설비 E',
			sendDate: '2024-01-15',
			sendTime: '12:00:00',
			status: 'retry',
			responseMessage: '재시도 중',
			retryCount: 1,
			lastRetryDate: '2024-01-15 12:05:00',
			mesSystem: 'MES-B',
			operator: '이영희',
			notes: '일시적 오류로 재시도',
		},
	];

	const columns: ProcessedColumnDef<MesIntegrationLog, any>[] = [
		{
			accessorKey: 'workOrderNumber',
			header: '작업지시 번호',
			size: 150,
		},
		{
			accessorKey: 'productName',
			header: '제품명',
			size: 150,
		},
		{
			accessorKey: 'machineName',
			header: '설비명',
			size: 150,
		},
		{
			accessorKey: 'sendDate',
			header: '전송일',
			size: 120,
		},
		{
			accessorKey: 'sendTime',
			header: '전송시간',
			size: 120,
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 120,
			cell: ({ row }: any) => {
				const status = row.original.status;
				const statusConfig = {
					success: {
						label: '성공',
						className: 'bg-green-100 text-green-800',
						icon: CheckCircle,
					},
					failed: {
						label: '실패',
						className: 'bg-red-100 text-red-800',
						icon: XCircle,
					},
					pending: {
						label: '대기',
						className: 'bg-yellow-100 text-yellow-800',
						icon: Clock,
					},
					retry: {
						label: '재시도',
						className: 'bg-orange-100 text-orange-800',
						icon: RefreshCw,
					},
				};
				// @ts-ignore
				const config = statusConfig[status];
				const Icon = config.icon;
				return (
					<div className="flex items-center gap-2">
						<Icon
							size={16}
							className={config.className
								.replace('bg-', 'text-')
								.replace('-100', '-600')}
						/>
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
						>
							{config.label}
						</span>
					</div>
				);
			},
		},
		{
			accessorKey: 'responseMessage',
			header: '응답 메시지',
			size: 200,
		},
		{
			accessorKey: 'retryCount',
			header: '재시도 횟수',
			size: 120,
			cell: ({ row }: any) => (
				<span
					className={
						row.original.retryCount > 0
							? 'text-orange-600 font-medium'
							: 'text-gray-600'
					}
				>
					{row.original.retryCount}
				</span>
			),
		},
		{
			accessorKey: 'mesSystem',
			header: 'MES 시스템',
			size: 120,
		},
		{
			accessorKey: 'operator',
			header: '작업자',
			size: 120,
		},
		{
			accessorKey: 'notes',
			header: '비고',
			size: 200,
		},
		{
			id: 'actions',
			header: '작업',
			size: 120,
			cell: ({ row }: any) => (
				<div className="flex gap-2">
					{row.original.status === 'failed' && (
						<RadixIconButton
							onClick={() => handleRetry(row.original.id)}
							className="p-1 text-orange-600 hover:bg-orange-50 rounded"
							title="재시도"
						>
							<RefreshCw size={16} />
						</RadixIconButton>
					)}
					{row.original.status === 'pending' && (
						<RadixIconButton
							onClick={() => handleSend(row.original.id)}
							className="p-1 text-blue-600 hover:bg-blue-50 rounded"
							title="전송"
						>
							<Send size={16} />
						</RadixIconButton>
					)}
				</div>
			),
		},
	];

	const DEFAULT_PAGE_SIZE = 30;
	const pageCount = Math.ceil(mockData.length / DEFAULT_PAGE_SIZE);

	const {
		table,
		selectedRows: tableSelectedRows,
		toggleRowSelection,
	} = useDataTable(
		mockData,
		columns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		0,
		mockData.length,
		() => {}
	);

	const handleRetry = (id: string) => {
		if (window.confirm('재시도하시겠습니까?')) {
			// 실제로는 API 호출
			console.log('Retry integration:', id);
		}
	};

	const handleSend = (id: string) => {
		if (window.confirm('지금 전송하시겠습니까?')) {
			// 실제로는 API 호출
			console.log('Send integration:', id);
		}
	};

	const handleRefresh = () => {
		// 실제로는 데이터 새로고침
		console.log('Refresh integration logs');
	};

	const handleBulkRetry = () => {
		if (selectedRows.size === 0) {
			alert('선택된 항목이 없습니다.');
			return;
		}
		if (
			window.confirm(
				`선택된 ${selectedRows.size}개 항목을 재시도하시겠습니까?`
			)
		) {
			// 실제로는 API 호출
			console.log('Bulk retry:', Array.from(selectedRows));
		}
	};

	const handleBulkSend = () => {
		if (selectedRows.size === 0) {
			alert('선택된 항목이 없습니다.');
			return;
		}
		if (
			window.confirm(
				`선택된 ${selectedRows.size}개 항목을 전송하시겠습니까?`
			)
		) {
			// 실제로는 API 호출
			console.log('Bulk send:', Array.from(selectedRows));
		}
	};

	// Filter data based on selection
	const filteredData = mockData.filter((item) => {
		if (selectedStatus !== 'all' && item.status !== selectedStatus)
			return false;
		if (selectedDate && item.sendDate !== selectedDate) return false;
		return true;
	});

	// Summary statistics
	const summaryStats = {
		total: mockData.length,
		success: mockData.filter((item) => item.status === 'success').length,
		failed: mockData.filter((item) => item.status === 'failed').length,
		pending: mockData.filter((item) => item.status === 'pending').length,
		retry: mockData.filter((item) => item.status === 'retry').length,
	};

	return (
		<div className="space-y-4">
			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								전체
							</p>
							<p className="text-2xl font-bold text-gray-800">
								{summaryStats.total}
							</p>
						</div>
						<Send size={24} className="text-gray-600" />
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								성공
							</p>
							<p className="text-2xl font-bold text-green-600">
								{summaryStats.success}
							</p>
						</div>
						<CheckCircle size={24} className="text-green-600" />
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								실패
							</p>
							<p className="text-2xl font-bold text-red-600">
								{summaryStats.failed}
							</p>
						</div>
						<XCircle size={24} className="text-red-600" />
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								대기
							</p>
							<p className="text-2xl font-bold text-yellow-600">
								{summaryStats.pending}
							</p>
						</div>
						<Clock size={24} className="text-yellow-600" />
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								재시도
							</p>
							<p className="text-2xl font-bold text-orange-600">
								{summaryStats.retry}
							</p>
						</div>
						<RefreshCw size={24} className="text-orange-600" />
					</div>
				</div>
			</div>

			{/* Data Table */}
			<div className="bg-white rounded-lg border">
				<DatatableComponent
					table={table}
					columns={columns}
					data={filteredData}
					toggleRowSelection={toggleRowSelection}
					selectedRows={tableSelectedRows}
					tableTitle="MES 연동 로그"
					rowCount={filteredData.length}
					useSearch={true}
					usePageNation={true}
					actionButtons={
						<div className="flex gap-2">
							<RadixIconButton
								onClick={handleRefresh}
								className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border hover:bg-gray-50"
							>
								<RefreshCw size={16} />
								새로고침
							</RadixIconButton>

							<RadixIconButton
								onClick={handleRefresh}
								className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border hover:bg-gray-50"
							>
								<Check size={16} />
								연동 상태 확인
							</RadixIconButton>

							<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
								<AlertCircle size={16} />
								오류 분석
							</RadixIconButton>
						</div>
					}
					headerOffset="310px"
				/>
			</div>
		</div>
	);
};

export default MesWorkOrderSendPage;
