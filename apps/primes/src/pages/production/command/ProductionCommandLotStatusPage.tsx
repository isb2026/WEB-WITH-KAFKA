import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';
import {
	DraggableDialog,
	RadixIconButton,
} from '@repo/radix-ui/components';
import { useLotColumns } from '@primes/schemas/production/lotSchemas';
import { useLotListQuery } from '@primes/hooks/production/useLot';
import { useWorkingListQuery } from '@primes/hooks/production';
import { Lot } from '@primes/types/production/lot';
import { Printer, Download } from 'lucide-react';
import { ProductionCommandMovePaper } from './components/ProductionCommandMovePaper';
import { printPNG } from '@primes/utils/print';
import { downloadPNG } from '@primes/utils/download';
import { ProductionLotListPagePannel } from '@primes/pages/production/command/pannel/ProductionLotListPagePannel';

const PAGE_SIZE = 30;

export const ProductionCommandLotStatusPage: React.FC = () => {
	// const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	// State
	const [page, setPage] = useState<number>(0);
	const [selectedLotId, setSelectedLotId] = useState<number | undefined>();
	const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openPannel, setOpenPannel] = useState<boolean>(false);
	const [movePaperData, setMovePaperData] = useState<{
		lotData: {
			lotNo: string;
			itemName: string;
			itemSpec: string;
			workOrderQuantity: string;
			chargingQuantity: string;
			rawMaterial: string;
			heatNo: string;
			rawMaterialCode: string;
			incomingWeight: string;
		};
		processSteps: Array<{
			sequence: number;
			processName: string;
			equipment: string;
			workQuantity: number;
			workWeight: number;
			workDate: string;
			worker: string;
			qualityCheck: string;
		}>;
	} | null>(null);

	// LOT 데이터 조회
	const { data: lotList } = useLotListQuery({
		page: page,
		size: PAGE_SIZE,
		searchRequest: {},
	});

	// Working 데이터 조회 (선택된 LOT ID로 필터링)
	const { data: workingList } = useWorkingListQuery({
		page: 0,
		size: 1000,
		searchRequest: selectedLotId ? { lotId: selectedLotId } : { lotId: 0 },
	});

	// 컬럼 정의
	const lotColumns = useLotColumns();

	// 커스텀 컬럼 정의 (lotNo에 클릭 이벤트 추가)
	const customColumns = useMemo(() => {
		const baseColumns = lotColumns;
		return baseColumns.map((column) => {
			if (column.accessorKey === 'lotNo') {
				return {
					...column,
					cell: ({ getValue, row }: { getValue: () => string; row: { original: Lot } }) => {
						const value = getValue();
						return (
							<div className="cursor-pointer">
								<p
									className="text-Colors-Brand-600 hover:text-Colors-Brand-700 font-medium hover:underline focus:outline-none focus:underline"
									onClick={() => {
										handleOpenPannelRef.current?.(row.original);
									}}
								>
									{value || '-'}
								</p>
							</div>
						);
					},
				};
			}
			return column;
		});
	}, [lotColumns]);

	// Table pagination handler
	const onPageChange = useCallback(
		(pagination: { pageIndex: number }) => {
			setPage(pagination.pageIndex);
		},
		[]
	);

	// LOT 데이터 처리
	const [lotData, setLotData] = useState<Lot[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);

	useEffect(() => {
		const response = lotList;

		if (response?.data?.content) {
			setLotData(response.data.content);
			setTotalElements(response.data.totalElements || 0);
			setPageCount(response.data.totalPages || 0);
		} else if (response?.content) {
			setLotData(response.content);
			setTotalElements(response.totalElements || 0);
			setPageCount(response.totalPages || 0);
		} else if (Array.isArray(response?.data)) {
			setLotData(response.data);
			setTotalElements(response.data.length);
			setPageCount(Math.ceil(response.data.length / PAGE_SIZE));
		}
	}, [lotList]);

	// LOT Table
	const {
		table,
		selectedRows: selectedRowsFromTable,
		toggleRowSelection,
	} = useDataTable(
		lotData,
		customColumns,
		PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);


	// 선택된 LOT 변경 처리
	useEffect(() => {
		if (selectedRowsFromTable.size > 0) {
			const selectedRowIndex = Array.from(selectedRowsFromTable)[0];
			const rowIndex = parseInt(selectedRowIndex as string);

			if (
				!isNaN(rowIndex) &&
				rowIndex >= 0 &&
				rowIndex < lotData.length
			) {
				const selectedRow = lotData[rowIndex];
				if (selectedRow && selectedRow.id) {
					setSelectedLot(selectedRow);
					setSelectedLotId(selectedRow.id);
					setSelectedRows(new Set([selectedRowIndex]));
				}
			}
		} else {
			setSelectedLot(null);
			setSelectedLotId(undefined);
			setSelectedRows(new Set());
		}
	}, [selectedRowsFromTable, lotData]);

	// 패널 핸들러
	const handleClosePannel = useCallback(() => {
		setOpenPannel(false);
		setSelectedLot(null);
		setSelectedLotId(undefined);
		// 패널 닫을 때 선택된 행 상태 초기화
		toggleRowSelection('all');
	}, [toggleRowSelection]);

	const handleOpenPannel = useCallback(
		(lot: Lot) => {
			if (openPannel && selectedLot?.id === lot.id) {
				handleClosePannel();
			} else {
				setSelectedLot(lot);
				setSelectedLotId(lot.id);
				setOpenPannel(true);
			}
		},
		[openPannel, selectedLot, handleClosePannel]
	);

	// ref에 함수 할당
	const handleClosePannelRef = useRef<() => void>();
	const handleOpenPannelRef = useRef<(lot: Lot) => void>();
	handleClosePannelRef.current = handleClosePannel;
	handleOpenPannelRef.current = handleOpenPannel;

	// Print button handler
	const handlePrint = useCallback(() => {
		// Check if a row is selected
		if (!selectedLot || !selectedLotId) {
			// Show a toast to inform user to select a row first
			toast.warning('LOT를 선택한 후 인쇄해주세요.');
			return;
		}
		setOpenModal(true);
	}, [selectedLot, selectedLotId]);

	// Generate move paper data from real API data
	const generateMovePaperData = useCallback(() => {
		// Use selected lot data
		const lot = selectedLot;

		const lotDataForPaper = {
			lotNo: lot?.lotNo || "",
			itemName: lot?.itemName || "",
			itemSpec: lot?.itemSpec || "",
			workOrderQuantity: lot?.lotAmount?.toString() || "",
			chargingQuantity: lot?.lotAmount?.toString() + " " + (lot?.lotUnit || "EA") || "",
			rawMaterial: lot?.itemName || "",
			heatNo: "",
			rawMaterialCode: lot?.itemNumber || "",
			incomingWeight: lot?.lotWeight?.toString() || ""
		};

		// Generate process steps from lot data
		const processSteps = [];
		
		// Add basic process step
		processSteps.push({
			sequence: 1,
			processName: "LOT 처리",
			equipment: "",
			workQuantity: lot?.lotAmount || 0,
			workWeight: lot?.lotWeight || 0.00,
			workDate: lot?.createdAt ? new Date(lot.createdAt).toLocaleDateString('ko-KR', {
				year: '2-digit',
				month: '2-digit',
				day: '2-digit'
			}).replace(/\./g, '-') : "",
			worker: lot?.createdBy || "",
			qualityCheck: ""
		});

		setMovePaperData({
			lotData: lotDataForPaper,
			processSteps: processSteps
		});
	}, [selectedLot, selectedLotId]);

	// Generate move paper data when modal opens or data changes
	useEffect(() => {
		if (openModal) {
			generateMovePaperData();
		}
	}, [openModal, generateMovePaperData]);

	// Handle print from modal
	const handleModalPrint = useCallback(async () => {
		try {
			const doc = document.getElementById('production-command-move-paper');
			if (doc) {
				await printPNG(doc, 'Production Command Move Paper');
			}
		} catch (error) {
			console.error('Error printing PNG:', error);
		}
	}, []);

	// Handle download from modal
	const handleModalDownload = useCallback(async () => {
		try {
			const doc = document.getElementById('production-command-move-paper');
			if (doc) {
				const filename = `production-command-move-paper-${new Date().toISOString().split('T')[0]}.png`;
				await downloadPNG(doc, filename);
			}
		} catch (error) {
			console.error('Error downloading PNG:', error);
		}
	}, []);

	// InfoGrid를 위한 키 정의
	// const CommandInfoGridKeys = [
	// 	{ key: 'commandNo', label: t('columns.commandNo') },
	// 	{ key: 'itemNumber', label: t('columns.itemNumber') },
	// 	{ key: 'itemName', label: t('columns.itemName') },
	// 	{ key: 'itemSpec', label: t('columns.itemSpec') },
	// 	{ key: 'progressName', label: t('columns.progressName') },
	// 	{ key: 'commandAmount', label: t('columns.commandAmount') },
	// 	{ key: 'unit', label: t('columns.unit') },
	// 	{ key: 'status', label: t('columns.status') },
	// 	{ key: 'startDate', label: t('columns.startDate') },
	// 	{ key: 'endDate', label: t('columns.endDate') },
	// ];

	return (
		<>
			<PageTemplate
				firstChildWidth="30%"
				splitterSizes={[30, 70]}
				splitterMinSize={[450, 550]}
				splitterGutterSize={8}
			>
				<div className="border rounded-lg overflow-hidden">
					<DatatableComponent
						table={table}
						columns={customColumns}
						data={lotData}
						tableTitle={tCommon('pages.lot.list')}
						rowCount={totalElements}
						useSearch={true}
						enableSingleSelect={true}
						usePageNation={true}
						selectedRows={selectedRows}
						toggleRowSelection={toggleRowSelection}
						actionButtons={
							<button
								onClick={handlePrint}
								className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
							>
								<Printer className="w-4 h-4" />
							</button>
						}
					/>
				</div>
				{openPannel && selectedLot && (
					<ProductionLotListPagePannel
						lots={[selectedLot]}
						workings={workingList?.content || []}
						onClose={handleClosePannel}
					/>
				)}
			</PageTemplate>

			{/* Move Paper Modal */}
		<DraggableDialog
			open={openModal}
			onOpenChange={setOpenModal}
			title="공정 이동표"
			content={
				<div className="p-4 relative">
					{/* Move Paper Content */}
					{movePaperData && (
						<ProductionCommandMovePaper
							lotData={movePaperData.lotData}
							processSteps={movePaperData.processSteps}
							companyName="로트추적시스템"
						/>
					)}

					{/* Action Buttons - Bottom Right */}
					<div className="flex gap-2 justify-end mt-4">
						<RadixIconButton
							className="bg-[#6A53B1FF] hover:bg-[#8270C2FF] disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center transition-colors"
							onClick={handleModalPrint}
						>
							<Printer size={16} />
							Print
						</RadixIconButton>
						<RadixIconButton
							className="bg-[#6A53B1FF] hover:bg-[#8270C2FF] disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center transition-colors"
							onClick={handleModalDownload}
						>
							<Download size={16} />
							Download
						</RadixIconButton>
					</div>
			</div>
			}
		/>
		</>
	);
};

export default ProductionCommandLotStatusPage;
