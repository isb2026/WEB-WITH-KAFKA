import React, { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useTranslation } from '@repo/i18n';

import { PageTemplate } from '@primes/templates';
import { SplitterComponent } from '@primes/components/common/Splitter';
import { DraggableDialog, RadixButton, RadixBadge } from '@radix-ui/components';
import {
	useMoldOrderMaster,
	useMoldOrderDetailByMasterId,
	useMoldOrderIngoing,
} from '@primes/hooks';
import { Plus, ArrowLeft, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { useCreateMoldOrderIngoing } from '@primes/hooks';
import {
	MoldOrderMasterDto,
	MoldOrderDetailDto,
	MoldOrderIngoingDto,
	MoldOrderIngoingCreateRequest,
	MoldOrderMasterSearchRequest,
} from '@primes/types/mold';
import { toast } from 'sonner';
import Tooltip from '@primes/components/common/Tooltip';

interface MoldIngoingRegisterPageProps {}

export const MoldIngoingRegisterPage: React.FC<
	MoldIngoingRegisterPageProps
> = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const navigate = useNavigate();

	// Form schema for mold incoming registration
	const moldIncomingFormSchema = [
		{
			name: 'inDate',
			label: t('columns.inDate') || '입고일자',
			type: 'date',
			placeholder: t('placeholders.enterInDate') || 'Enter incoming date',
			required: true,
		},
		{
			name: 'inNum',
			label: t('columns.inNum') || '입고수량',
			type: 'number',
			placeholder:
				t('placeholders.enterInNum') || 'Enter incoming quantity',
			required: true,
			min: 0,
			max: 65535,
		},
		{
			name: 'inPrice',
			label: t('columns.inPrice') || '입고단가',
			type: 'number',
			placeholder:
				t('placeholders.enterInPrice') || 'Enter incoming unit price',
			required: true,
			min: 0,
		},
		{
			name: 'inAmount',
			label: t('columns.inAmount') || '입고금액',
			type: 'number',
			placeholder:
				t('placeholders.enterInAmount') || 'Enter incoming amount',
			disabled: true,
		},
		{
			name: 'placeName',
			label: t('columns.placeName') || '입고장소',
			type: 'text',
			placeholder:
				t('placeholders.enterPlaceName') ||
				'Enter place name (e.g., Lack-001-001)',
			required: true,
		},
		{
			name: 'isDev',
			label: t('columns.isDev') || '개발금형 여부',
			type: 'select',
			options: [
				{ value: 'false', label: '양산' },
				{ value: 'true', label: '개발' },
			],
			defaultValue: 'false',
		},
		{
			name: 'isChange',
			label: t('columns.isChange') || '설변여부',
			type: 'select',
			options: [
				{ value: 'false', label: '일반' },
				{ value: 'true', label: '설변' },
			],
			defaultValue: 'false',
		},
		{
			name: 'auditBy',
			label: t('columns.auditBy') || '품질검사자',
			type: 'text',
			placeholder: t('placeholders.enterAuditBy') || 'Enter auditor name',
			maxLength: 10,
		},
		{
			name: 'auditDate',
			label: t('columns.auditDate') || '품질검사일자',
			type: 'date',
			placeholder: t('placeholders.enterAuditDate') || 'Enter audit date',
		},
		{
			name: 'isPass',
			label: t('columns.isPass') || '품질검사 합격여부',
			type: 'select',
			options: [
				{ value: 'false', label: '불합격' },
				{ value: 'true', label: '합격' },
			],
			defaultValue: 'false',
		},
		{
			name: 'moldSheetImg',
			label: t('columns.moldSheetImg') || '금형 성적서 이미지',
			type: 'text',
			placeholder:
				t('placeholders.enterMoldSheetImg') ||
				'Enter image filename (e.g., report.jpg)',
			maxLength: 50,
		},
	];

	// State management
	const [selectedMasterId, setSelectedMasterId] = useState<number | null>(
		null
	);
	const [selectedDetailId, setSelectedDetailId] = useState<number | null>(
		null
	);
	const [isIncomingModalOpen, setIsIncomingModalOpen] = useState(false);
	const [isAddRowModalOpen, setIsAddRowModalOpen] = useState(false);
	const [masterPage, setMasterPage] = useState<number>(0);
	const [masterData, setMasterData] = useState<MoldOrderMasterDto[]>([]);
	const [masterTotalElements, setMasterTotalElements] = useState<number>(0);
	const [masterPageCount, setMasterPageCount] = useState<number>(0);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [searchRequest] = useState<MoldOrderMasterSearchRequest>({});

	// Incoming records state
	const [incomingData, setIncomingData] = useState<MoldOrderIngoingDto[]>([]);

	// Detail data state
	const [detailData, setDetailData] = useState<MoldOrderDetailDto[]>([]);

	const DEFAULT_PAGE_SIZE = 30;

	// API 호출 - get master records
	const {
		list: { data: masterApiData, refetch },
	} = useMoldOrderMaster({
		searchRequest,
		page: masterPage,
		size: DEFAULT_PAGE_SIZE,
	});

	// API 호출 - get detail records by master ID
	const { data: detailApiData } = useMoldOrderDetailByMasterId(
		selectedMasterId || 0,
		0,
		DEFAULT_PAGE_SIZE
	);

	// API 호출 - get incoming records by detail ID
	const {
		list: { data: incomingApiData, refetch: refetchIncoming },
	} = useMoldOrderIngoing({
		searchRequest: { moldOrderDetailId: selectedDetailId || 0 },
		page: 0,
		size: 10,
	});

	// Mold ingoing hooks
	const createMoldIngoing = useCreateMoldOrderIngoing(0, 30);

	// Get detailed master information from the list data
	const selectedMasterDetail = selectedMasterId
		? masterData.find((item) => item.id === selectedMasterId)
		: null;

	// Master data processing
	useEffect(() => {
		if (masterApiData) {
			// Handle legacy format: {data: [...]}
			if (masterApiData.data && Array.isArray(masterApiData.data)) {
				setMasterData(masterApiData.data);
				setMasterTotalElements(masterApiData.data.length);
				setMasterPageCount(
					Math.ceil(masterApiData.data.length / DEFAULT_PAGE_SIZE)
				);
			}
			// Handle direct array format
			else if (Array.isArray(masterApiData)) {
				setMasterData(masterApiData);
				setMasterTotalElements(masterApiData.length);
				setMasterPageCount(
					Math.ceil(masterApiData.length / DEFAULT_PAGE_SIZE)
				);
			}
		} else {
			setMasterData([]);
			setMasterTotalElements(0);
			setMasterPageCount(0);
		}
	}, [masterApiData]);

	// Detail data processing
	useEffect(() => {
		if (detailApiData) {
			// Handle Spring Boot Pageable format
			if (detailApiData.content && Array.isArray(detailApiData.content)) {
				setDetailData(detailApiData.content);
			}
			// Handle legacy format: {data: [...]}
			else if (detailApiData.data && Array.isArray(detailApiData.data)) {
				setDetailData(detailApiData.data);
			}
			// Handle dataList format
			else if (
				detailApiData.dataList &&
				Array.isArray(detailApiData.dataList)
			) {
				setDetailData(detailApiData.dataList);
			}
			// Handle direct array format
			else if (Array.isArray(detailApiData)) {
				setDetailData(detailApiData);
			}
		} else {
			setDetailData([]);
		}
		// Reset detail selection when master changes
		setSelectedDetailId(null);
	}, [detailApiData]);

	// Incoming data processing
	useEffect(() => {
		console.log('=== Incoming API Data Debug ===');
		console.log('Incoming API Data received:', incomingApiData);
		console.log('Selected Detail ID:', selectedDetailId);

		if (incomingApiData) {
			if (incomingApiData.data && Array.isArray(incomingApiData.data)) {
				// CommonResponseListMoldOrderIngoingDto 응답 처리
				console.log(
					'Processing incomingApiData.data:',
					incomingApiData.data
				);
				setIncomingData(incomingApiData.data);
			} else if (
				(incomingApiData as any).content &&
				Array.isArray((incomingApiData as any).content)
			) {
				// Spring Boot Pageable 응답 처리
				console.log(
					'Processing Spring Boot Pageable response:',
					(incomingApiData as any).content
				);
				setIncomingData((incomingApiData as any).content);
			} else if (Array.isArray(incomingApiData)) {
				// 배열 형태의 응답 처리
				console.log('Processing direct array:', incomingApiData);
				setIncomingData(incomingApiData);
			} else {
				// 기타 응답 구조 처리
				console.log(
					'Unknown response structure, trying to extract data...'
				);
				const extractedData = (incomingApiData.data ||
					incomingApiData) as any;
				if (Array.isArray(extractedData)) {
					console.log('Extracted array data:', extractedData);
					setIncomingData(extractedData);
				} else {
					console.log('Could not extract array data from response');
					setIncomingData([]);
				}
			}
		} else {
			console.log('No incoming API data received');
			setIncomingData([]);
		}
	}, [incomingApiData, selectedDetailId]);

	// Handle form submission for new ingoing
	const handleSubmit = (formData: Record<string, unknown>) => {
		// Use selectedDetailId directly
		if (!selectedDetailId) {
			toast.error('발주 상세를 선택해주세요.');
			return;
		}

		// Calculate inAmount if inNum and inPrice are provided
		const inNum = Number(formData.inNum) || 0;
		const inPrice = Number(formData.inPrice) || 0;
		const inAmount = inNum * inPrice;

		// Generate current date strings
		const currentDate = new Date();
		const accountMonth = currentDate
			.toISOString()
			.slice(0, 7)
			.replace('-', '');
		const inMonth = formData.inDate
			? new Date(formData.inDate as string)
					.toISOString()
					.slice(0, 7)
					.replace('-', '')
			: accountMonth;

		const payload: MoldOrderIngoingCreateRequest = {
			moldOrderDetailId: selectedDetailId,
			accountMonth: accountMonth,
			inDate: formData.inDate
				? new Date(formData.inDate as string)
				: new Date(),
			inMonth: inMonth,
			inNum: inNum,
			inPrice: inPrice,
			inAmount: inAmount,
			placeName: (formData.placeName as string) || '',
			isDev: formData.isDev === 'true' || formData.isDev === true,
			isChange:
				formData.isChange === 'true' || formData.isChange === true,
			auditBy: (formData.auditBy as string) || '',
			auditDate: formData.auditDate
				? new Date(formData.auditDate as string)
				: null,
			isPass: formData.isPass === 'true' || formData.isPass === true,
			moldSheetImg: (formData.moldSheetImg as string) || '',
		};

		console.log('Submitting payload:', payload);

		createMoldIngoing.mutate(
			{ dataList: [payload] },
			{
				onSuccess: () => {
					toast.success('입고등록이 완료되었습니다.');
					setIsIncomingModalOpen(false);
					// Refresh the incoming data and master data
					refetchIncoming();
					refetch();
				},
				onError: (error) => {
					toast.error('입고등록 중 오류가 발생했습니다.');
					console.error('Error creating mold ingoing:', error);
				},
			}
		);
	};

	// Handle delete confirmation
	const handleDeleteConfirm = () => {
		toast.success('삭제가 완료되었습니다.');
		setDeleteDialogOpen(false);
		refetch();
	};

	// Handle reset
	const handleReset = () => {
		setSelectedMasterId(null);
		setSelectedDetailId(null);
		setMasterData([]);
	};

	// Master table columns (from MoldOrderRelatedListPage)
	const masterTableColumns = [
		{
			accessorKey: 'orderCode',
			header: t('columns.orderCode'),
			size: 100,
		},
		{
			accessorKey: 'orderDate',
			header: t('columns.orderDate'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'isEnd',
			header: t('columns.isEnd'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return (
					<RadixBadge
						color={value ? 'green' : 'blue'}
						className="text-xs"
					>
						{value ? '완료' : '진행중'}
					</RadixBadge>
				);
			},
		},
		{
			accessorKey: 'moldType',
			header: t('columns.moldType'),
			size: 80,
		},
		{
			accessorKey: 'inType',
			header: t('columns.inType'),
			size: 100,
		},
	];

	// Detail table columns - showing order detail fields
	const detailTableColumns = [
		{
			accessorKey: 'moldMaster.moldCode',
			header: t('columns.moldCode'),
			size: 120,
			cell: ({ row }: { row: any }) => {
				const moldMaster = row.original?.moldMaster;
				return moldMaster?.moldCode || '-';
			},
		},
		{
			accessorKey: 'moldMaster.moldName',
			header: t('columns.moldName'),
			size: 150,
			cell: ({ row }: { row: any }) => {
				const moldMaster = row.original?.moldMaster;
				return moldMaster?.moldName || '-';
			},
		},
		{
			accessorKey: 'moldMaster.moldStandard',
			header: t('columns.moldStandard'),
			size: 150,
			cell: ({ row }: { row: any }) => {
				const moldMaster = row.original?.moldMaster;
				return moldMaster?.moldStandard || '-';
			},
		},
		{
			accessorKey: 'vendorName',
			header: t('columns.vendor'),
			size: 120,
		},
		{
			accessorKey: 'num',
			header: t('columns.num'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'inNum',
			header: t('columns.inNum'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'orderPrice',
			header: t('columns.orderPrice'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'orderAmount',
			header: t('columns.orderAmount'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'isIn',
			header: t('columns.isIn'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return (
					<RadixBadge
						color={value ? 'green' : 'orange'}
						className="text-xs"
					>
						{value ? '입고완료' : '미입고'}
					</RadixBadge>
				);
			},
		},
	];

	// Incoming records table columns
	const incomingTableColumns = [
		{
			accessorKey: 'inDate',
			header: t('columns.inDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'inNum',
			header: t('columns.inNum'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'inPrice',
			header: t('columns.inPrice'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'inAmount',
			header: t('columns.inAmount'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'isPass',
			header: t('columns.isPass'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return (
					<RadixBadge
						color={value ? 'green' : 'red'}
						className="text-xs"
					>
						{value ? '합격' : '불합격'}
					</RadixBadge>
				);
			},
		},
		{
			accessorKey: 'auditBy',
			header: t('columns.auditBy'),
			size: 100,
		},
	];

	// Master table hook
	const {
		table: masterTable,
		selectedRows: masterSelectedRows,
		toggleRowSelection: toggleMasterRowSelection,
	} = useDataTable(
		masterData,
		masterTableColumns,
		DEFAULT_PAGE_SIZE,
		masterPageCount,
		masterPage,
		masterTotalElements,
		(pagination: { pageIndex: number }) =>
			setMasterPage(pagination.pageIndex)
	);

	// Detail table hook
	const {
		table: detailTable,
		selectedRows: detailSelectedRows,
		toggleRowSelection: toggleDetailRowSelection,
	} = useDataTable(
		detailData,
		detailTableColumns,
		30,
		1,
		0,
		detailData.length,
		() => {}
	);

	// Incoming records table hook
	const {
		table: incomingTable,
		selectedRows: incomingSelectedRows,
		toggleRowSelection: toggleIncomingRowSelection,
	} = useDataTable(
		incomingData,
		incomingTableColumns,
		10,
		1,
		0,
		incomingData.length,
		() => {}
	);

	// Check if detail row is selected
	const isDetailRowSelected = selectedDetailId !== null;

	// Debug logging - moved after hook initialization
	useEffect(() => {
		console.log('Selected Master ID:', selectedMasterId);
		console.log('Selected Detail ID:', selectedDetailId);
		console.log('Selected Master Detail:', selectedMasterDetail);
		console.log('Master Data Length:', masterData.length);
		console.log('Detail Data Length:', detailData.length);
		console.log('Incoming Data Length:', incomingData.length);
		console.log('Master Selected Rows:', masterSelectedRows);
		console.log('Detail Selected Rows:', detailSelectedRows);
		console.log('First few master data items:', masterData.slice(0, 3));
	}, [
		selectedMasterId,
		selectedDetailId,
		selectedMasterDetail,
		masterData.length,
		detailData.length,
		incomingData.length,
		masterSelectedRows,
		detailSelectedRows,
	]);

	// Debug detail table data
	useEffect(() => {
		console.log('Detail table data:', detailData);
		console.log('Detail table columns:', detailTableColumns);
		console.log('Detail table row count:', detailData.length);
	}, [detailData, detailTableColumns]);

	// Handle master row selection changes
	useEffect(() => {
		const handleRowSelect = (ids: string[]) => {
			console.log('Master row selection changed. IDs:', ids);
			console.log('Available master data:', masterData);
			console.log('Master selected rows Set:', masterSelectedRows);

			if (ids.length > 0) {
				// The IDs are array indices, not actual IDs
				const rowIndex = parseInt(ids[0]);
				if (
					!isNaN(rowIndex) &&
					rowIndex >= 0 &&
					rowIndex < masterData.length
				) {
					const selectedData = masterData[rowIndex];
					console.log('Found selected data:', selectedData);
					setSelectedMasterId(selectedData?.id || null);
				} else {
					console.log('Invalid row index:', rowIndex);
					setSelectedMasterId(null);
				}
			} else {
				console.log('No rows selected, clearing selection');
				setSelectedMasterId(null);
			}
		};

		const selectedData = Array.from(masterSelectedRows);
		handleRowSelect(selectedData);
	}, [masterSelectedRows, masterData]);

	// Handle detail row selection changes
	useEffect(() => {
		const handleDetailRowSelect = (ids: string[]) => {
			console.log('Detail row selection changed. IDs:', ids);
			console.log('Available detail data:', detailData);
			console.log('Detail selected rows Set:', detailSelectedRows);

			if (ids.length > 0) {
				// The IDs are array indices, not actual IDs
				const rowIndex = parseInt(ids[0]);
				if (
					!isNaN(rowIndex) &&
					rowIndex >= 0 &&
					rowIndex < detailData.length
				) {
					const selectedDetailData = detailData[rowIndex];
					console.log(
						'Found selected detail data:',
						selectedDetailData
					);
					setSelectedDetailId(selectedDetailData?.id || null);
				} else {
					console.log('Invalid detail row index:', rowIndex);
					setSelectedDetailId(null);
				}
			} else {
				console.log('No detail rows selected, clearing selection');
				setSelectedDetailId(null);
			}
		};

		const selectedDetailData = Array.from(detailSelectedRows);
		handleDetailRowSelect(selectedDetailData);
	}, [detailSelectedRows, detailData]);

	return (
		<>
			<div className="max-w-full mx-auto p-4 h-full flex flex-col">
				<div className="flex justify-between items-center gap-2 mb-3">
					<RadixButton
						className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
						onClick={() => navigate('/mold/orders/ingoing-list')}
					>
						<ArrowLeft
							size={16}
							className="text-muted-foreground"
						/>
						{tCommon('pages.mold.ingoing.backToIngoing')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					{/* Left Panel - Master Records List */}
					<div className="border rounded-lg overflow-hidden">
						<DatatableComponent
							table={masterTable}
							columns={masterTableColumns}
							data={masterData}
							tableTitle={tCommon(
								'pages.mold.orders.list',
								'금형 발주 현황'
							)}
							rowCount={masterTotalElements}
							defaultPageSize={30}
							actionButtons={
								<div className="flex gap-1.5">
									<Tooltip
										label={tCommon(
											'pages.form.reset',
											'초기화'
										)}
										side="bottom"
									>
										<RadixButton
											className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white"
											onClick={handleReset}
										>
											<RotateCw
												size={16}
												className="muted-foreground text-white"
											/>
										</RadixButton>
									</Tooltip>
								</div>
							}
							useSearch={false}
							toggleRowSelection={toggleMasterRowSelection}
							selectedRows={masterSelectedRows}
							enableSingleSelect={true}
						/>
					</div>

					{/* Right Panel - Split into two tables */}
					<div className="h-full">
						<SplitterComponent
							direction="vertical"
							sizes={[40, 60]}
							minSize={[200, 300]}
							gutterSize={4}
							height="100%"
						>
							{/* Top Panel - Order Details */}
							<div className="border rounded-lg overflow-hidden">
								<DatatableComponent
									table={detailTable}
									columns={detailTableColumns}
									data={detailData}
									tableTitle={tCommon(
										'pages.mold.orders.details.title',
										'발주 상세 정보'
									)}
									rowCount={detailData.length}
									useSearch={false}
									toggleRowSelection={
										toggleDetailRowSelection
									}
									selectedRows={detailSelectedRows}
									enableSingleSelect={true}
								/>
							</div>

							{/* Bottom Panel - Incoming Records */}
							<div className="border rounded-lg overflow-hidden">
								<DatatableComponent
									table={incomingTable}
									columns={incomingTableColumns}
									data={incomingData}
									tableTitle={tCommon(
										'pages.mold.ingoing.records.title',
										'입고 내역'
									)}
									rowCount={incomingData.length}
									useSearch={false}
									usePageNation={false}
									selectedRows={incomingSelectedRows}
									toggleRowSelection={
										toggleIncomingRowSelection
									}
									enableSingleSelect={true}
									actionButtons={
										<div className="flex items-center gap-2.5">
											<RadixButton
												className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white ${
													!isDetailRowSelected
														? 'bg-gray-200 text-gray-400 cursor-not-allowed'
														: ''
												}`}
												onClick={() =>
													isDetailRowSelected
														? setIsIncomingModalOpen(
																true
															)
														: undefined
												}
												disabled={!isDetailRowSelected}
											>
												<Plus
													size={16}
													className={
														!isDetailRowSelected
															? 'text-gray-400'
															: 'text-white'
													}
												/>
												{tCommon(
													'common.register',
													'입고등록'
												)}
											</RadixButton>
										</div>
									}
								/>
							</div>
						</SplitterComponent>
					</div>
				</PageTemplate>
			</div>

			{/* Incoming Modal */}
			<DraggableDialog
				open={isIncomingModalOpen}
				onOpenChange={(open: boolean) => {
					setIsIncomingModalOpen(open);
				}}
				title={`입고 등록`}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							// Initialize form with default values
							if (methods) {
								// Set current date as default
								const today = new Date()
									.toISOString()
									.split('T')[0];
								methods.setValue('inDate', today);
								methods.setValue('inNum', '');
								methods.setValue('inPrice', '');
								methods.setValue('inAmount', '');
								methods.setValue('placeName', '');
								methods.setValue('isDev', 'false');
								methods.setValue('isChange', 'false');
								methods.setValue('auditBy', '');
								methods.setValue('auditDate', '');
								methods.setValue('isPass', 'false');
								methods.setValue('moldSheetImg', '');

								// Watch for inNum and inPrice changes to calculate inAmount
								const subscription = methods.watch(
									(value, { name }) => {
										if (
											name === 'inNum' ||
											name === 'inPrice'
										) {
											const inNum =
												Number(value.inNum) || 0;
											const inPrice =
												Number(value.inPrice) || 0;
											const inAmount = inNum * inPrice;
											methods.setValue(
												'inAmount',
												inAmount.toString()
											);
										}
									}
								);

								// Return cleanup function
								return () => subscription.unsubscribe();
							}
							// Return undefined if methods is not available
							return undefined;
						}}
						fields={moldIncomingFormSchema}
						onSubmit={handleSubmit}
						submitButtonText="입고등록"
						visibleSaveButton={true}
					/>
				}
			/>

			{/* Add Row Modal */}
			<DraggableDialog
				open={isAddRowModalOpen}
				onOpenChange={(open: boolean) => {
					setIsAddRowModalOpen(open);
				}}
				title="새 입고 기록 추가"
				content={
					<DynamicForm
						onFormReady={(methods) => {
							// Initialize form with default values
							const today = new Date()
								.toISOString()
								.split('T')[0];
							methods.setValue('inDate', today);
							methods.setValue('inNum', '');
							methods.setValue('inPrice', '');
							methods.setValue('inAmount', '');
							methods.setValue('placeName', '');
							methods.setValue('isDev', 'false');
							methods.setValue('isChange', 'false');
							methods.setValue('auditBy', '');
							methods.setValue('auditDate', '');
							methods.setValue('isPass', 'false');
							methods.setValue('moldSheetImg', '');

							// Watch for inNum and inPrice changes to calculate inAmount
							const subscription = methods.watch(
								(value, { name }) => {
									if (
										name === 'inNum' ||
										name === 'inPrice'
									) {
										const inNum = Number(value.inNum) || 0;
										const inPrice =
											Number(value.inPrice) || 0;
										const inAmount = inNum * inPrice;
										methods.setValue(
											'inAmount',
											inAmount.toString()
										);
									}
								}
							);

							return () => subscription.unsubscribe();
						}}
						fields={moldIncomingFormSchema}
						onSubmit={(formData) => {
							// Handle add row submission
							toast.success('새 입고 기록이 추가되었습니다.');
							setIsAddRowModalOpen(false);
						}}
						submitButtonText="추가"
						visibleSaveButton={true}
					/>
				}
			/>

			{/* Delete Confirmation Dialog */}
			<DeleteConfirmDialog
				isOpen={deleteDialogOpen}
				onOpenChange={(open) => setDeleteDialogOpen(open)}
				onConfirm={handleDeleteConfirm}
				isDeleting={false}
				title="입고 기록 삭제"
				description="선택한 입고 기록을 삭제하시겠습니까?"
			/>
		</>
	);
};

export default MoldIngoingRegisterPage;
