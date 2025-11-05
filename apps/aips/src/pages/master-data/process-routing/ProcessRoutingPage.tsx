import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PageTemplate } from '@primes/templates';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { Item } from '@primes/types/item';
import { useTranslation } from '@repo/i18n';
import { Pen, Trash2, Plus } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { Link } from 'react-router-dom';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { processRoutingData } from '../dummy-data/processRoutingData';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';
import { EchartComponent } from '@repo/echart';

export const ProcessRoutingPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<Item[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [editItemData, setEditingItemData] = useState<Item | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const DEFAULT_PAGE_SIZE = 30;

	// Flow Chart 데이터 생성
	const flowChartData = {
		title: {
			text: '공정 라우팅 플로우',
			left: 'center',
			top: 10,
			textStyle: { fontSize: 16, fontWeight: 'bold' },
		},
		tooltip: {
			trigger: 'item',
			formatter: function (params: any) {
				if (params.dataType === 'node') {
					return `${params.name}<br/>기계: ${params.data.machine || 'N/A'}<br/>소요시간: ${params.data.time || 'N/A'}분<br/>처리량: ${params.data.capacity || 'N/A'}개/시간<br/>가동률: ${params.data.efficiency || 'N/A'}%`;
				}
				return params.name;
			},
		},
		series: [
			{
				type: 'graph',
				layout: 'none',
				symbolSize: 70,
				roam: true,
				label: {
					show: true,
					position: 'right',
					fontSize: 14,
					fontWeight: 'bold',
					offset: [10, 0],
					formatter: function (params: any) {
						return (
							params.name +
							'\n' +
							(params.data.time || '') +
							'분/' +
							(params.data.capacity || '') +
							'개'
						);
					},
				},
				edgeLabel: {
					show: false,
				},
				data: [
					{
						name: '원료 투입',
						x: 400,
						y: 80,
						machine: 'Loading Station A',
						time: 12,
						capacity: 300,
						efficiency: 95,
						itemStyle: { color: '#91cc75' },
					},
					{
						name: '1차 가공',
						x: 400,
						y: 250,
						machine: 'CNC Machine A',
						time: 45,
						capacity: 80,
						efficiency: 88,
						itemStyle: { color: '#fac858' },
					},
					{
						name: '열처리',
						x: 400,
						y: 420,
						machine: 'Heat Treatment',
						time: 120,
						capacity: 40,
						efficiency: 92,
						itemStyle: { color: '#ee6666' },
					},
					{
						name: '2차 가공',
						x: 400,
						y: 590,
						machine: 'CNC Machine B',
						time: 60,
						capacity: 60,
						efficiency: 85,
						itemStyle: { color: '#73c0de' },
					},
					{
						name: '표면처리',
						x: 400,
						y: 760,
						machine: 'Surface Coating',
						time: 30,
						capacity: 120,
						efficiency: 90,
						itemStyle: { color: '#3ba272' },
					},
					{
						name: '품질 검사',
						x: 400,
						y: 930,
						machine: 'QC Station',
						time: 25,
						capacity: 150,
						efficiency: 98,
						itemStyle: { color: '#fc8452' },
					},
					{
						name: '포장',
						x: 400,
						y: 1100,
						machine: 'Packaging Line',
						time: 20,
						capacity: 200,
						efficiency: 96,
						itemStyle: { color: '#9a60b4' },
					},
				],
				links: [
					{
						source: '원료 투입',
						target: '1차 가공',
						value: '12분/300개',
						lineStyle: { width: 4, color: '#5470c6' },
					},
					{
						source: '1차 가공',
						target: '열처리',
						value: '45분/80개',
						lineStyle: { width: 4, color: '#5470c6' },
					},
					{
						source: '열처리',
						target: '2차 가공',
						value: '120분/40개',
						lineStyle: { width: 4, color: '#5470c6' },
					},
					{
						source: '2차 가공',
						target: '표면처리',
						value: '60분/60개',
						lineStyle: { width: 4, color: '#5470c6' },
					},
					{
						source: '표면처리',
						target: '품질 검사',
						value: '30분/120개',
						lineStyle: { width: 4, color: '#5470c6' },
					},
					{
						source: '품질 검사',
						target: '포장',
						value: '25분/150개',
						lineStyle: { width: 4, color: '#5470c6' },
					},
				],
				lineStyle: {
					color: '#5470c6',
					curvature: 0.1,
				},
			},
		],
	};

	const tableColumns = [
		{
			accessorKey: 'itemNumber',
			header: '라우팅 코드',
			size: 120,
			cell: ({
				getValue,
				row,
			}: {
				getValue: () => string;
				row: { original: Item };
			}) => {
				const value = getValue();
				const id = row.original.id;
				return (
					<Link
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
						to={`/aips/master-data/process-routing/${id}`}
					>
						{value || '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'itemName',
			header: '라우팅 명',
			size: 200,
			cell: ({
				getValue,
				row,
			}: {
				getValue: () => string;
				row: { original: Item };
			}) => {
				const value = getValue();
				const id = row.original.id;
				return (
					<Link
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
						to={`/aips/master-data/process-routing/${id}`}
					>
						{value || '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'itemType1',
			header: '라우팅 유형',
			size: 120,
		},
	];

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// 더미 remove 함수
	const dummyRemove = {
		mutate: (id: number) => {
			console.log('Delete routing with id:', id);
			toast.success('공정 라우팅이 삭제되었습니다.');
		},
		isPending: false,
	};

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	const handleDeleteConfirm = () => {
		if (editItemData) {
			const id = editItemData.id;
			dummyRemove.mutate(id);
			setOpenDeleteDialog(false);
		}
	};

	// 더미 데이터 설정
	useEffect(() => {
		setData(processRoutingData);
		setTotalElements(processRoutingData.length);
		setPageCount(Math.ceil(processRoutingData.length / DEFAULT_PAGE_SIZE));
	}, []);

	useEffect(() => {
		if (formMethods && editItemData) {
			formMethods.reset(
				editItemData as unknown as Record<string, unknown>
			);
		}
	}, [formMethods]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		tableColumns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currentRow: Item = data[rowIndex];
			setEditingItemData(currentRow);
		} else {
			setEditingItemData(null);
		}
	}, [selectedRows]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={editItemData ? '공정 라우팅 수정' : '공정 라우팅 등록'}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{editItemData
								? '공정 라우팅 정보를 수정합니다.'
								: '새로운 공정 라우팅을 등록합니다.'}
						</p>
						<div className="mt-4 flex justify-end gap-2">
							<RadixIconButton
								onClick={() => setOpenModal(false)}
								className="px-4 py-2 border rounded-lg"
							>
								닫기
							</RadixIconButton>
						</div>
					</div>
				}
			/>
			<DeleteConfirmDialog
				isOpen={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
				onConfirm={handleDeleteConfirm}
				isDeleting={dummyRemove.isPending}
				title="공정 라우팅 삭제"
				description={`선택한 공정 라우팅 '${editItemData?.itemName || editItemData?.itemNumber}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			<div className="space-y-4">
				{/* Table using PageTemplate */}
				<PageTemplate
					firstChildWidth="40%"
					splitterSizes={[40, 60]}
					splitterMinSize={[430, 800]}
					splitterGutterSize={6}
				>
					<div className="border rounded-lg">
						<DatatableComponent
							table={table}
							columns={tableColumns}
							data={data}
							tableTitle="공정 라우팅"
							rowCount={totalElements}
							useSearch={true}
							enableSingleSelect={true}
							selectedRows={selectedRows}
							toggleRowSelection={toggleRowSelection}
							searchSlot={<SearchSlotComponent />}
						/>
					</div>

					{/* Second Child - Flow Chart with full width */}
					<div className="border rounded-lg w-full">
						<EchartComponent
							options={flowChartData}
							height="100%"
						/>
					</div>
				</PageTemplate>
			</div>
		</>
	);
};

export default ProcessRoutingPage;
