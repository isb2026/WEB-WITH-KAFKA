import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { CheckCircle, Calculator, Package, Calendar } from 'lucide-react';
import {
	RadixIconButton,
	RadixSelect,
	RadixSelectItem,
} from '@repo/radix-ui/components';
import { atpData } from '../dummy-data/atpData';
import { EchartComponent } from '@repo/echart';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns, ColumnConfig } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface AtpRequest {
	id: number;
	productName: string;
	productCode: string;
	requestedQuantity: number;
	requestedDate: string;
	priority: 'low' | 'medium' | 'high';
	customerName: string;
	status: 'pending' | 'calculated' | 'confirmed';
	createdBy: string;
	createdAt: string;
}

interface AtpResult {
	id: number;
	productName: string;
	productCode: string;
	requestedQuantity: number;
	requestedDate: string;
	availableQuantity: number;
	shortageQuantity: number;
	earliestAvailableDate: string;
	recommendedDate: string;
	notes: string;
}

export const AtpPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [requests, setRequests] = useState<AtpRequest[]>([]);
	const [results, setResults] = useState<AtpResult[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<string>('');
	const [requestedQuantity, setRequestedQuantity] = useState<number>(0);
	const [requestedDate, setRequestedDate] = useState<string>('');
	const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
		'medium'
	);
	const [customerName, setCustomerName] = useState<string>('');
	const [isCalculating, setIsCalculating] = useState<boolean>(false);

	useEffect(() => {
		setRequests(atpData as AtpRequest[]);
	}, []);

	const handleCalculate = async () => {
		if (!selectedProduct || requestedQuantity <= 0 || !requestedDate) {
			alert('모든 필드를 입력해주세요.');
			return;
		}

		setIsCalculating(true);

		// 시뮬레이션을 위한 지연
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// 더 현실적인 ATP 계산 로직
		const baseStock = Math.floor(requestedQuantity * 0.3); // 기본 재고
		const productionCapacity = Math.floor(requestedQuantity * 0.8); // 생산 능력
		const supplierStock = Math.floor(requestedQuantity * 0.4); // 공급업체 재고

		// 우선순위에 따른 가용성 조정
		let priorityMultiplier = 1;
		switch (priority) {
			case 'high':
				priorityMultiplier = 1.2; // 높은 우선순위는 20% 더 많은 자원 할당
				break;
			case 'medium':
				priorityMultiplier = 1.0;
				break;
			case 'low':
				priorityMultiplier = 0.8; // 낮은 우선순위는 20% 적은 자원 할당
				break;
		}

		const totalAvailable = Math.floor(
			(baseStock + productionCapacity + supplierStock) *
				priorityMultiplier
		);
		const availableQty = Math.min(totalAvailable, requestedQuantity);
		const shortageQty = Math.max(0, requestedQuantity - availableQty);

		// 납기일 계산 - 부족 수량에 따라 현실적으로 조정
		const requestedDateObj = new Date(requestedDate);
		let recommendedDate = requestedDateObj;

		if (shortageQty > 0) {
			// 부족 수량이 30% 이상이면 1-2주 연기
			if (shortageQty > requestedQuantity * 0.3) {
				const delayDays = Math.floor(Math.random() * 7) + 7; // 7-14일
				recommendedDate = new Date(
					requestedDateObj.getTime() + delayDays * 24 * 60 * 60 * 1000
				);
			} else {
				// 부족 수량이 적으면 1-3일 연기
				const delayDays = Math.floor(Math.random() * 3) + 1;
				recommendedDate = new Date(
					requestedDateObj.getTime() + delayDays * 24 * 60 * 60 * 1000
				);
			}
		}

		const newResult: AtpResult = {
			id: Date.now(),
			productName: selectedProduct,
			productCode: `PRD-${Math.floor(Math.random() * 1000)}`,
			requestedQuantity,
			requestedDate,
			availableQuantity: availableQty,
			shortageQuantity: shortageQty,
			earliestAvailableDate: new Date(requestedDate)
				.toISOString()
				.split('T')[0],
			recommendedDate: recommendedDate.toISOString().split('T')[0],
			notes:
				shortageQty > 0
					? shortageQty > requestedQuantity * 0.3
						? '재고 부족으로 인한 납기일 연기 필요 (1-2주)'
						: '일부 재고 부족으로 인한 납기일 연기 필요 (1-3일)'
					: '요청일자에 납기 가능',
		};

		setResults((prev) => [newResult, ...prev]);
		setIsCalculating(false);

		// 요청 목록에 추가
		const newRequest: AtpRequest = {
			id: Date.now(),
			productName: selectedProduct,
			productCode: `PRD-${Math.floor(Math.random() * 1000)}`,
			requestedQuantity,
			requestedDate,
			priority,
			customerName: customerName || '고객명 미입력',
			status: 'calculated',
			createdBy: '현재 사용자',
			createdAt: new Date().toISOString(),
		};

		setRequests((prev) => [newRequest, ...prev]);

		// 폼 초기화
		setSelectedProduct('');
		setRequestedQuantity(0);
		setRequestedDate('');
		setPriority('medium');
		setCustomerName('');
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800';
			case 'low':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getPriorityText = (priority: string) => {
		switch (priority) {
			case 'high':
				return '높음';
			case 'medium':
				return '보통';
			case 'low':
				return '낮음';
			default:
				return priority;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'calculated':
				return 'bg-blue-100 text-blue-800';
			case 'confirmed':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending':
				return '대기중';
			case 'calculated':
				return '계산완료';
			case 'confirmed':
				return '확정';
			default:
				return status;
		}
	};

	const products = [
		'스마트폰 케이스',
		'무선 이어폰',
		'USB 충전 케이블',
		'블루투스 스피커',
		'무선 충전기',
	];

	// DataTable columns configuration for requests
	const requestColumns = useMemo<ColumnConfig<AtpRequest>[]>(
		() => [
			{
				accessorKey: 'productName',
				header: '제품명',
				size: 150,
				align: 'left' as const,
			},
			{
				accessorKey: 'requestedQuantity',
				header: '요청 수량',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => {
					const item = row.original as AtpRequest;
					return (
						<div className="text-center">
							{item.requestedQuantity.toLocaleString()}
						</div>
					);
				},
			},
			{
				accessorKey: 'requestedDate',
				header: '요청 납기일',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => {
					const item = row.original as AtpRequest;
					return (
						<div className="text-center">
							{new Date(item.requestedDate).toLocaleDateString(
								'ko-KR'
							)}
						</div>
					);
				},
			},
			{
				accessorKey: 'priority',
				header: '우선순위',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => {
					const item = row.original as AtpRequest;
					return (
						<div className="text-center">
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}
							>
								{getPriorityText(item.priority)}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'customerName',
				header: '고객명',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => {
					const item = row.original as AtpRequest;
					return (
						<div className="text-center">{item.customerName}</div>
					);
				},
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => {
					const item = row.original as AtpRequest;
					return (
						<div className="text-center">
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
							>
								{getStatusText(item.status)}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'createdAt',
				header: '요청일',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => {
					const item = row.original as AtpRequest;
					return (
						<div className="text-center">
							{new Date(item.createdAt).toLocaleDateString(
								'ko-KR'
							)}
						</div>
					);
				},
			},
		],
		[]
	);

	// DataTable columns configuration for results
	const resultColumns = useMemo<ColumnConfig<AtpResult>[]>(
		() => [
			{
				accessorKey: 'productName',
				header: '제품명',
				size: 150,
				align: 'left' as const,
			},
			{
				accessorKey: 'requestedQuantity',
				header: '요청 수량',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => {
					const item = row.original as AtpResult;
					return (
						<div className="text-center">
							{item.requestedQuantity.toLocaleString()}
						</div>
					);
				},
			},
			{
				accessorKey: 'availableQuantity',
				header: '가능 수량',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => {
					const item = row.original as AtpResult;
					return (
						<div className="text-center">
							<span className="text-green-600 font-medium">
								{item.availableQuantity.toLocaleString()}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'shortageQuantity',
				header: '부족 수량',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => {
					const item = row.original as AtpResult;
					return (
						<div className="text-center">
							{item.shortageQuantity > 0 ? (
								<span className="text-red-600 font-medium">
									{item.shortageQuantity.toLocaleString()}
								</span>
							) : (
								<span className="text-green-600">-</span>
							)}
						</div>
					);
				},
			},
			{
				accessorKey: 'recommendedDate',
				header: '권장 납기일',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => {
					const item = row.original as AtpResult;
					return (
						<div className="text-center">
							<span className="font-medium text-blue-600">
								{new Date(
									item.recommendedDate
								).toLocaleDateString('ko-KR')}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'notes',
				header: '비고',
				size: 200,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => {
					const item = row.original as AtpResult;
					return (
						<div className="text-center">
							<span
								className={`px-2 py-1 rounded-full text-xs ${
									item.shortageQuantity > 0
										? 'bg-red-100 text-red-800'
										: 'bg-green-100 text-green-800'
								}`}
							>
								{item.notes}
							</span>
						</div>
					);
				},
			},
		],
		[]
	);

	const processedRequestColumns = useDataTableColumns(requestColumns);
	const processedResultColumns = useDataTableColumns(resultColumns);

	const {
		table: requestTable,
		selectedRows: requestSelectedRows,
		toggleRowSelection: toggleRequestRowSelection,
	} = useDataTable(
		requests,
		processedRequestColumns,
		30,
		0,
		0,
		requests.length,
		undefined
	);

	const {
		table: resultTable,
		selectedRows: resultSelectedRows,
		toggleRowSelection: toggleResultRowSelection,
	} = useDataTable(
		results,
		processedResultColumns,
		30,
		0,
		0,
		results.length,
		undefined
	);

	return (
		<div className="space-y-6">
			{/* 요약 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center">
						<div className="p-2 bg-blue-100 rounded-lg">
							<Calculator className="h-6 w-6 text-blue-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								총 요청 건수
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{requests.length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center">
						<div className="p-2 bg-green-100 rounded-lg">
							<CheckCircle className="h-6 w-6 text-green-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								계산 완료
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									requests.filter(
										(item) => item.status === 'calculated'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center">
						<div className="p-2 bg-yellow-100 rounded-lg">
							<Package className="h-6 w-6 text-yellow-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								평균 요청 수량
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{requests.length > 0
									? Math.round(
											requests.reduce(
												(sum, item) =>
													sum +
													item.requestedQuantity,
												0
											) / requests.length
										)
									: 0}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center">
						<div className="p-2 bg-purple-100 rounded-lg">
							<Calendar className="h-6 w-6 text-purple-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								대기 중
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									requests.filter(
										(item) => item.status === 'pending'
									).length
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* ATP 계산 폼 */}
			<div className="p-4 rounded-lg border">
				<h3 className="text-lg font-semibold text-gray-900 mb-2">
					ATP 계산 요청
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							제품명
						</label>
						<RadixSelect
							value={selectedProduct}
							onValueChange={setSelectedProduct}
							placeholder="제품을 선택하세요"
						>
							{products.map((product) => (
								<RadixSelectItem key={product} value={product}>
									{product}
								</RadixSelectItem>
							))}
						</RadixSelect>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							요청 수량
						</label>
						<input
							type="number"
							value={requestedQuantity}
							onChange={(e) =>
								setRequestedQuantity(
									parseInt(e.target.value) || 0
								)
							}
							className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
							placeholder="수량을 입력하세요"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							요청 납기일
						</label>
						<input
							type="date"
							value={requestedDate}
							onChange={(e) => setRequestedDate(e.target.value)}
							className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							우선순위
						</label>
						<RadixSelect
							value={priority}
							onValueChange={(value: string) =>
								setPriority(value as 'low' | 'medium' | 'high')
							}
						>
							<RadixSelectItem value="low">낮음</RadixSelectItem>
							<RadixSelectItem value="medium">
								보통
							</RadixSelectItem>
							<RadixSelectItem value="high">높음</RadixSelectItem>
						</RadixSelect>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							고객명
						</label>
						<input
							type="text"
							value={customerName}
							onChange={(e) => setCustomerName(e.target.value)}
							className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
							placeholder="고객명을 입력하세요"
						/>
					</div>
					<div className="flex items-end">
						<RadixIconButton
							onClick={handleCalculate}
							disabled={
								isCalculating ||
								!selectedProduct ||
								requestedQuantity <= 0 ||
								!requestedDate
							}
							className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
						>
							{isCalculating ? (
								<>
									<Calculator className="h-4 w-4 animate-spin" />
									계산 중...
								</>
							) : (
								<>
									<Calculator size={16} />
									ATP 계산
								</>
							)}
						</RadixIconButton>
					</div>
				</div>
			</div>

			{/* ATP 계산 결과 */}
			{results.length > 0 && (
				<div className="rounded-lg border overflow-hidden">
					<div className="px-6 py-4 border-b bg-gray-50">
						<h3 className="text-lg font-semibold text-gray-900">
							ATP 계산 결과
						</h3>
						<p className="text-sm text-gray-600 mt-1">
							총 {results.length}건의 ATP 계산이 완료되었습니다
						</p>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
						{/* 차트 */}
						<div className="h-64">
							<EchartComponent
								options={{
									title: {
										text: 'ATP 수량 분포',
										left: 'center',
										textStyle: { fontSize: 14 },
									},
									tooltip: {
										trigger: 'item',
										formatter: '{a} <br/>{b}: {c} ({d}%)',
									},
									legend: {
										orient: 'vertical',
										left: 'left',
										top: 30,
									},
									series: [
										{
											name: '수량 분포',
											type: 'pie',
											radius: '50%',
											data: [
												{
													name: '가능 수량',
													value: results.reduce(
														(sum, r) =>
															sum +
															r.availableQuantity,
														0
													),
													itemStyle: {
														color: '#10B981',
													},
												},
												{
													name: '부족 수량',
													value: results.reduce(
														(sum, r) =>
															sum +
															r.shortageQuantity,
														0
													),
													itemStyle: {
														color: '#EF4444',
													},
												},
											],
										},
									],
								}}
								height="250px"
							/>
						</div>
						{/* 요약 정보 */}
						<div className="space-y-4">
							<div className="bg-blue-50 p-4 rounded-lg">
								<h4 className="font-medium text-blue-900 mb-2">
									전체 요약
								</h4>
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="text-blue-600">
											총 요청 수량:
										</span>
										<div className="font-semibold">
											{results
												.reduce(
													(sum, r) =>
														sum +
														r.requestedQuantity,
													0
												)
												.toLocaleString()}
										</div>
									</div>
									<div>
										<span className="text-blue-600">
											총 가용 수량:
										</span>
										<div className="font-semibold text-green-600">
											{results
												.reduce(
													(sum, r) =>
														sum +
														r.availableQuantity,
													0
												)
												.toLocaleString()}
										</div>
									</div>
									<div>
										<span className="text-blue-600">
											총 부족 수량:
										</span>
										<div className="font-semibold text-red-600">
											{results
												.reduce(
													(sum, r) =>
														sum +
														r.shortageQuantity,
													0
												)
												.toLocaleString()}
										</div>
									</div>
									<div>
										<span className="text-blue-600">
											가용률:
										</span>
										<div className="font-semibold">
											{Math.round(
												(results.reduce(
													(sum, r) =>
														sum +
														r.availableQuantity,
													0
												) /
													results.reduce(
														(sum, r) =>
															sum +
															r.requestedQuantity,
														0
													)) *
													100
											)}
											%
										</div>
									</div>
								</div>
							</div>

							<div className="bg-yellow-50 p-4 rounded-lg">
								<h4 className="font-medium text-yellow-900 mb-2">
									납기 현황
								</h4>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span>요청일 납기 가능:</span>
										<span className="font-semibold text-green-600">
											{
												results.filter(
													(r) =>
														r.shortageQuantity === 0
												).length
											}
											건
										</span>
									</div>
									<div className="flex justify-between">
										<span>납기일 연기 필요:</span>
										<span className="font-semibold text-red-600">
											{
												results.filter(
													(r) =>
														r.shortageQuantity > 0
												).length
											}
											건
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 상세 결과 테이블 */}
					<div className="border-t">
						<DatatableComponent
							data={results}
							table={resultTable}
							columns={resultColumns}
							tableTitle="상세 결과"
							rowCount={results.length}
							useSearch={false}
							usePageNation={false}
							toggleRowSelection={toggleResultRowSelection}
							selectedRows={resultSelectedRows}
							classNames={{ container: 'max-h-[180px]' }}
						/>
					</div>
				</div>
			)}

			{/* 요청 내역 */}
			<div className="rounded-lg border overflow-hidden">
				<DatatableComponent
					data={requests}
					table={requestTable}
					columns={requestColumns}
					tableTitle="ATP 요청 내역"
					rowCount={requests.length}
					useSearch={false}
					usePageNation={false}
					toggleRowSelection={toggleRequestRowSelection}
					selectedRows={requestSelectedRows}
				/>
			</div>
		</div>
	);
};

export default AtpPage;
