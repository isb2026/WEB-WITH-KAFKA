import React, { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';

import { DraggableDialog, RadixButton } from '@radix-ui/components';
// Use new dedicated hook for mold instance input records
import { useMoldInstanceInputRecords } from '@primes/hooks/mold/mold-instance/useMoldInstanceInputRecords';
import { useInputMoldInstances } from '@primes/hooks/mold/mold-instance/useInputMoldInstances';
import { useCollectMoldInstances } from '@primes/hooks/mold/mold-instance/useCollectMoldInstances';
import { getMoldInstanceById } from '@primes/services/mold/moldInstanceService';
import { useCommand } from '@primes/hooks/production/useCommand';
import { Plus, ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { MoldInstanceSelectComponent } from '@primes/components/customSelect';
import {
	MoldInoutInformationDto,
	MoldInoutInformationCreateRequest,
	MoldInstanceInputRequest,
	MoldInstanceCollectRequest,
	MoldInstanceDto,
} from '@primes/types/mold';
import { Command } from '@primes/types/production/command';
import { toast } from 'sonner';

interface MoldInputRetrieveRegisterPageProps {
	onClose?: () => void;
	selectedInoutInformation?: MoldInoutInformationDto;
	isEditMode?: boolean;
	onSuccess?: () => void;
}

export const MoldInputRetrieveRegisterPage: React.FC<MoldInputRetrieveRegisterPageProps> = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const navigate = useNavigate();

	// Form schema for mold retrieve registration - 금형 선택
	const moldInoutFormSchema = [
		{
			name: 'moldInstanceId',
			label: '금형 선택',
			type: 'moldInstanceSelect',
			placeholder: '회수할 금형을 선택하세요',
			required: true,
		},
	];

	// Form schema for mold input registration - 투입 정보
	const moldInputFormSchema = [
		{
			name: 'moldInstanceIds',
			label: '투입할 금형들',
			type: 'moldInstanceSelect',
			placeholder: '투입할 금형들을 선택하세요',
			required: true,
			multiple: true,
		},
		{
			name: 'moldLocationId',
			label: '금형 위치 ID',
			type: 'number',
			placeholder: '금형 위치 ID를 입력하세요',
			required: true,
			defaultValue: 1,
		},
		{
			name: 'inputDate',
			label: '투입 일자',
			type: 'date',
			required: true,
			defaultValue: new Date().toISOString().split('T')[0],
		},
		{
			name: 'outMachineId',
			label: '설비 ID',
			type: 'number',
			placeholder: '설비 ID를 입력하세요',
			required: true,
			defaultValue: 100,
		},
		{
			name: 'outMachineName',
			label: '설비명',
			type: 'text',
			placeholder: '설비명을 입력하세요',
			required: true,
			defaultValue: '사출기-001',
		},
		{
			name: 'outCommandNo',
			label: '작업지시번호',
			type: 'text',
			placeholder: '작업지시번호를 입력하세요',
			required: true,
		},
		{
			name: 'outItemId',
			label: '품목 ID',
			type: 'number',
			placeholder: '품목 ID를 입력하세요',
			required: true,
			defaultValue: 200,
		},
		{
			name: 'outItemNo',
			label: '품목 번호',
			type: 'number',
			placeholder: '품목 번호를 입력하세요',
			required: true,
			defaultValue: 1,
		},
		{
			name: 'outItemName',
			label: '품목명',
			type: 'text',
			placeholder: '품목명을 입력하세요',
			required: true,
			defaultValue: '플라스틱 부품 A',
		},
		{
			name: 'outProgressId',
			label: '공정 ID',
			type: 'number',
			placeholder: '공정 ID를 입력하세요',
			required: true,
			defaultValue: 300,
		},
		{
			name: 'outProgressName',
			label: '공정명',
			type: 'text',
			placeholder: '공정명을 입력하세요',
			required: true,
			defaultValue: '사출성형',
		},
		{
			name: 'stock',
			label: '재고',
			type: 'number',
			placeholder: '재고를 입력하세요',
			required: true,
			defaultValue: 1,
		},
	];

	// State management
	const [selectedCommandId, setSelectedCommandId] = useState<number | null>(
		null
	);
	const [isInoutModalOpen, setIsInoutModalOpen] = useState(false);
	const [isInputModalOpen, setIsInputModalOpen] = useState(false);
	const [commandPage, setCommandPage] = useState<number>(0);
	const [recordsPage, setRecordsPage] = useState<number>(0);

	// Production Command data from API
	const [commandData, setCommandData] = useState<Command[]>([]);
	const [commandTotalElements, setCommandTotalElements] = useState<number>(0);
	const [commandPageCount, setCommandPageCount] = useState<number>(0);

	const [inoutData, setInoutData] = useState<MoldInstanceDto[]>([]);

	// Add row feature states
	const [triggerAddRow, setTriggerAddRow] = useState(false);
	const [triggerClearAddRow, setTriggerClearAddRow] = useState(false);
	const [addRowData, setAddRowData] = useState<Record<string, unknown>[]>([]);

	// 새창 등록으로 추가된 항목들을 별도로 관리
	const [newlyAddedItems, setNewlyAddedItems] = useState<
		MoldInstanceDto[]
	>([]);

	const DEFAULT_PAGE_SIZE = 30;
	const RECORDS_PAGE_SIZE = 10;

	// API 호출 - get mold instances filtered by selected command (right table)
	// inputCommandId로 투입된 금형 인스턴스들을 조회
	const {
		data: recordsApiData,
		isLoading: recordsLoading,
		error: recordsError,
		refetch: refetchRecords,
		records: moldInstanceRecords,
		totalElements: recordsTotalElements,
		totalPages: recordsPageCount,
	} = useMoldInstanceInputRecords({
		inputCommandId: selectedCommandId || undefined,
		page: recordsPage,
		size: RECORDS_PAGE_SIZE,
	});

	// Mold instance hooks for input/collect operations
	
	// 새로운 투입/회수 hooks
	const inputMoldInstances = useInputMoldInstances();
	const collectMoldInstances = useCollectMoldInstances();

	// Production Command API 호출
	const {
		list: { data: commandApiData },
	} = useCommand({
		searchRequest: {},
		page: commandPage,
		size: DEFAULT_PAGE_SIZE,
	});

	// Command data processing
	useEffect(() => {
		if (commandApiData) {
			if (
				commandApiData.data &&
				commandApiData.data.content &&
				Array.isArray(commandApiData.data.content)
			) {
				setCommandData(commandApiData.data.content);
				setCommandTotalElements(commandApiData.data.totalElements);
				setCommandPageCount(commandApiData.data.totalPages);
			} else if (Array.isArray(commandApiData)) {
				setCommandData(commandApiData);
				setCommandTotalElements(commandApiData.length);
				setCommandPageCount(
					Math.ceil(commandApiData.length / DEFAULT_PAGE_SIZE)
				);
			} else {
				const extractedData = (commandApiData.data ||
					commandApiData) as any;
				if (Array.isArray(extractedData)) {
					setCommandData(extractedData);
					setCommandTotalElements(extractedData.length);
					setCommandPageCount(
						Math.ceil(extractedData.length / DEFAULT_PAGE_SIZE)
					);
				} else {
					setCommandData([]);
					setCommandTotalElements(0);
					setCommandPageCount(0);
				}
			}
		}
	}, [commandApiData]);

	// Records data processing - mold instances
	useEffect(() => {
		// 새로운 hook에서 직접 records를 가져옴
		const combinedRecords = [...moldInstanceRecords, ...newlyAddedItems];
		setInoutData(combinedRecords);
	}, [moldInstanceRecords, newlyAddedItems]);

	// Command table columns (작업지시 목록)
	const commandColumns = [
		{
			accessorKey: 'commandNo',
			header: t('columns.commandNo') || '작업지시번호',
			size: 100,
		},
		{
			accessorKey: 'product',
			header: t('columns.item') || '제품',
			size: 350,
			cell: ({ row }: { row: any }) => {
				const data = row.original;
				const itemName = data.itemName || '';
				const itemNumber = data.itemNumber || '';
				const itemSpec = data.itemSpec || '';

				// 제품명 - 품번 - 규격 형태로 조합
				const parts = [itemName, itemNumber, itemSpec].filter(
					(part) => part && part.trim() !== ''
				);
				return parts.length > 0 ? parts.join(' - ') : '-';
			},
		},
		{
			accessorKey: 'progressName',
			header: t('columns.progressName') || '공정',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'machineName',
			header: t('columns.machineName') || '설비',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
	];

	// Mold inout records table columns (금형 입출고 현황)
	const recordsColumns = [
		{
			accessorKey: 'moldInstanceName',
			header: '실금형',
			size: 200,
			cell: ({ row }: { row: any }) => {
				const data = row.original;
				return data.moldInstance?.moldInstanceName || data.moldInstanceName || '-';
			},
		},
		{
			accessorKey: 'stock',
			header: '재고',
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'inOutDate',
			header: '투입일자',
			size: 120,
			cell: ({ row }: { row: any }) => {
				const value = row.original.inOutDate;
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'grade',
			header: '등급',
			size: 80,
			cell: ({ row }: { row: any }) => {
				const data = row.original;
				return data.moldInstance?.grade || data.grade || '-';
			},
		},
		{
			accessorKey: 'currentCount',
			header: '현재타수',
			size: 100,
			cell: ({ row }: { row: any }) => {
				const data = row.original;
				const currentCount = data.moldInstance?.currentCount || data.currentCount;
				return currentCount ? currentCount.toLocaleString() : '-';
			},
		},
	];

	// Command table handlers
	const onCommandPageChange = (pagination: { pageIndex: number }) => {
		setCommandPage(pagination.pageIndex);
	};

	const {
		table: commandTable,
		toggleRowSelection: toggleCommandRowSelection,
		selectedRows: selectedCommandRows,
	} = useDataTable(
		commandData,
		commandColumns,
		DEFAULT_PAGE_SIZE,
		commandPageCount,
		commandPage,
		commandTotalElements,
		onCommandPageChange
	);

	// Records table handlers
	const onRecordsPageChange = (pagination: { pageIndex: number }) => {
		setRecordsPage(pagination.pageIndex);
	};

	const {
		table: recordsTable,
		toggleRowSelection: toggleRecordsRowSelection,
		selectedRows: selectedRecordsRows,
	} = useDataTable(
		inoutData,
		recordsColumns,
		RECORDS_PAGE_SIZE,
		recordsPageCount,
		recordsPage,
		recordsTotalElements,
		onRecordsPageChange
	);

	// Handle command row selection
	useEffect(() => {
		if (selectedCommandRows.size > 0) {
			const selectedRowIndex = Array.from(selectedCommandRows)[0] as string;
			const selectedCommand = commandData[parseInt(selectedRowIndex)];
			if (selectedCommand) {
				setSelectedCommandId(selectedCommand.id);
			}
		} else {
			setSelectedCommandId(null);
		}
	}, [selectedCommandRows, commandData]);

	// Handle mold inout form submission (회수)
	const handleMoldInoutSubmit = async (formData: any) => {
		if (!selectedCommandId) {
			toast.error('작업지시를 먼저 선택해주세요.');
			return;
		}

		try {
			// 새로운 회수 API 사용 - 단순히 moldInstanceId 배열만 전송
			const moldInstanceIds: MoldInstanceCollectRequest = [formData.moldInstanceId];
			
			await collectMoldInstances.mutateAsync(moldInstanceIds);
			
			setIsInoutModalOpen(false);
			refetchRecords();
		} catch (error) {
			console.error('Error collecting mold instances:', error);
			toast.error('금형 회수 중 오류가 발생했습니다.');
		}
	};

	// Handle mold input form submission (투입)
	const handleMoldInputSubmit = async (formData: any) => {
		if (!selectedCommandId) {
			toast.error('작업지시를 먼저 선택해주세요.');
			return;
		}

		try {
			// 새로운 투입 API 사용
			const inputRequest: MoldInstanceInputRequest = {
				moldInstanceIds: Array.isArray(formData.moldInstanceIds) 
					? formData.moldInstanceIds 
					: [formData.moldInstanceIds],
				moldLocationId: formData.moldLocationId,
				inputDate: formData.inputDate,
				outMachineId: formData.outMachineId,
				outMachineName: formData.outMachineName,
				outCommandId: selectedCommandId,
				outCommandNo: formData.outCommandNo,
				outItemId: formData.outItemId,
				outItemNo: formData.outItemNo,
				outItemName: formData.outItemName,
				outProgressId: formData.outProgressId,
				outProgressName: formData.outProgressName,
				stock: formData.stock,
			};
			
			await inputMoldInstances.mutateAsync(inputRequest);
			
			setIsInputModalOpen(false);
			refetchRecords();
		} catch (error) {
			console.error('Error inputting mold instances:', error);
			toast.error('금형 투입 중 오류가 발생했습니다.');
		}
	};

	// Handle collect selected records - 새로운 회수 API 사용
	const handleCollectSelected = async () => {
		if (selectedRecordsRows.size === 0) {
			toast.error('회수할 항목을 선택해주세요.');
			return;
		}

		if (!selectedCommandId) {
			toast.error('작업지시를 먼저 선택해주세요.');
			return;
		}

		try {
			const selectedIndices = Array.from(selectedRecordsRows).map(row => parseInt(row as string));
			const selectedItems = selectedIndices.map(index => inoutData[index]);

			// 새로운 회수 API 사용 - moldInstanceId 배열만 전송
			const moldInstanceIds: MoldInstanceCollectRequest = selectedItems
				.filter(item => item.id)
				.map(item => Number(item.id));

			if (moldInstanceIds.length === 0) {
				toast.error('회수할 금형 인스턴스가 없습니다.');
				return;
			}

			await collectMoldInstances.mutateAsync(moldInstanceIds);
			
			// 회수된 항목들을 그리드에서 제거
			const collectedIds = new Set(moldInstanceIds);
			setInoutData(prev => prev.filter(item => !collectedIds.has(Number(item.id))));
			
			// 선택 상태 초기화
			selectedRecordsRows.clear();
			
			// 데이터 새로고침 (서버에서 최신 상태 반영)
			refetchRecords();
			
			toast.success(`${moldInstanceIds.length}개 금형이 회수되었습니다.`);
		} catch (error) {
			console.error('Error collecting selected items:', error);
			toast.error('금형 회수 중 오류가 발생했습니다.');
		}
	};

	return (
		<>
			<div className="max-w-full mx-auto p-4 h-full flex flex-col">
				<div className="flex justify-between items-center gap-2 mb-3">
					<RadixButton
						className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
						onClick={() => navigate('/mold/inout/list')}
					>
						<ArrowLeft
							size={16}
							className="text-muted-foreground"
						/>
						{tCommon('pages.mold.inout.backToInout', '목록으로')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="50%"
					splitterSizes={[50, 50]}
					splitterMinSize={[400, 400]}
					splitterGutterSize={8}
				>
					{/* Left Panel - Command Records List */}
					<div className="border rounded-lg overflow-hidden">
						<DatatableComponent
							table={commandTable}
							columns={commandColumns}
							data={commandData}
							tableTitle={tCommon(
								'pages.production.command.list',
								'작업지시 목록'
							)}
							rowCount={commandTotalElements}
							defaultPageSize={30}
							useSearch={false}
							toggleRowSelection={toggleCommandRowSelection}
							selectedRows={selectedCommandRows}
							enableSingleSelect={true}
						/>
					</div>

					{/* Right Panel - Mold Inout Records */}
					<div className="border rounded-lg overflow-hidden">
						<DatatableComponent
							table={recordsTable}
							columns={recordsColumns}
							data={inoutData}
							tableTitle="회수 대상 금형"
							rowCount={recordsTotalElements}
							defaultPageSize={10}
							useSearch={false}
							toggleRowSelection={toggleRecordsRowSelection}
							selectedRows={selectedRecordsRows}
							enableSingleSelect={false}
							actionButtons={
								<div className="flex gap-2">
									<RadixButton
										className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
											!selectedCommandId ||
											selectedRecordsRows.size === 0
												? 'cursor-not-allowed bg-gray-200 text-gray-400'
												: 'bg-red-600 text-white hover:bg-red-700'
										}`}
										disabled={
											!selectedCommandId ||
											selectedRecordsRows.size === 0
										}
										onClick={handleCollectSelected}
									>
										<Trash2
											size={16}
											className={
												!selectedCommandId ||
												selectedRecordsRows.size === 0
													? 'text-gray-400'
													: 'text-white'
											}
										/>
										{tCommon('pages.actions.collect', '회수')}
									</RadixButton>
								</div>
							}
						/>
					</div>
				</PageTemplate>
			</div>

			{/* Inout Modal */}
			<DraggableDialog
				open={isInoutModalOpen}
				onOpenChange={(open: boolean) => {
					setIsInoutModalOpen(open);
				}}
				title={`금형회수 등록`}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							if (methods) {
								// 금형 선택 필드만 초기화
								methods.setValue('moldInstanceId', '');
							}
							return undefined;
						}}
						fields={moldInoutFormSchema}
						onSubmit={handleMoldInoutSubmit}
						submitButtonText="저장"
						visibleSaveButton={true}
						otherTypeElements={{
							moldInstanceSelect: MoldInstanceSelectComponent,
						}}
					/>
				}
			/>

			{/* Input Modal */}
			<DraggableDialog
				open={isInputModalOpen}
				onOpenChange={(open: boolean) => {
					setIsInputModalOpen(open);
				}}
				title={`금형투입 등록`}
				content={
					<DynamicForm
						onFormReady={(methods) => {
							if (methods) {
								// 기본값들 설정
								methods.setValue('moldLocationId', 1);
								methods.setValue('inputDate', new Date().toISOString().split('T')[0]);
								methods.setValue('outMachineId', 100);
								methods.setValue('outMachineName', '사출기-001');
								methods.setValue('outItemId', 200);
								methods.setValue('outItemNo', 1);
								methods.setValue('outItemName', '플라스틱 부품 A');
								methods.setValue('outProgressId', 300);
								methods.setValue('outProgressName', '사출성형');
								methods.setValue('stock', 1);
							}
							return undefined;
						}}
						fields={moldInputFormSchema}
						onSubmit={handleMoldInputSubmit}
						submitButtonText="투입"
						visibleSaveButton={true}
						otherTypeElements={{
							moldInstanceSelect: (props: any) => (
								<MoldInstanceSelectComponent 
									{...props} 
									searchParams={{ isInput: true }}
								/>
							),
						}}
					/>
				}
			/>
		</>
	);
};

export default MoldInputRetrieveRegisterPage;
