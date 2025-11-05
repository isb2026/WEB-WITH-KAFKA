import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useTerminal } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { DraggableDialog } from '@repo/radix-ui/components';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { IniTerminalRegisterPage } from './IniTerminalRegisterPage';
import { Terminal } from '@primes/types/terminal';
import { toast } from 'sonner';

interface IniTerminalListData {
	id: number;
	name?: string;
	code?: string;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: any;
}

export const IniTerminalListPage: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<IniTerminalListData[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const { t: tCommon } = useTranslation('common');
	const { t } = useTranslation('dataTable');
	const DEFAULT_PAGE_SIZE = 30;
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [selectedTerminal, setSelectedTerminal] = useState<IniTerminalListData | null>(
		null
	);
	const [searchParams, setSearchParams] = useState<any>({});

	const tableColumns = [
		{
			accessorKey: 'terminalCode',
			header: t('columns.terminalCode'),
			size: 120,
		},
		{
			accessorKey: 'terminalName',
			header: t('columns.terminalName'),
			size: 150,
		},
		{
			accessorKey: 'description',
			header: t('columns.description'),
			size: 200,
		},
		{
			accessorKey: 'imageUrl',
			header: t('columns.imageUrl'),
			size: 50,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value : '-';
			},
		},
		{
			accessorKey: 'isUse',
			header: t('columns.isUse'),
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? 'Y' : 'N';
			},
			align: 'center',
			size: 50,
		},
	];

	const searchFields = [
		{
			name: 'terminalCode',
			label: t('columns.terminalCode'),
			type: 'text',
			placeholder: '터미널 코드로 검색',
		},
		{
			name: 'terminalName',
			label: t('columns.terminalName'),
			type: 'text',
			placeholder: '터미널명으로 검색',
		},
		{
			name: 'description',
			label: t('columns.description'),
			type: 'text',
			placeholder: '설명으로 검색',
		},
		{
			name: 'isUse',
			label: t('columns.isUse'),
			type: 'select',
			placeholder: '사용 여부 선택',
			options: [
				{ value: 'true', label: '사용' },
				{ value: 'false', label: '미사용' },
			],
		},
	];

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// API 호출
	const { list: apiData, remove } = useTerminal({
		page: page,
		size: DEFAULT_PAGE_SIZE,
		searchRequest: searchParams,
	});

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		tableColumns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	const handleEdit = () => {
		if (selectedTerminal) {
			setOpenModal(true);
		} else {
			toast.warning('단말기를 선택해주세요.');
		}
	};

	const handleRemove = () => {
		if (selectedTerminal) {
			setOpenDeleteDialog(true);
		} else {
			toast.warning('삭제하실 단말기를 선택해주세요.');
		}
	};

	const handleDeleteConfirm = () => {
		if (selectedTerminal) {
			// Pass the ID directly, the hook will convert it to array [id]
			remove.mutate(selectedTerminal.id);
			setOpenDeleteDialog(false);
		}
	};

	useEffect(() => {
		const response = apiData.data;

		if (response?.content) {
			// 페이지네이션 응답 처리
			setData(response.content);
			setTotalElements(response.totalElements || 0);
			setPageCount(response.totalPages || 0);
		} else if (Array.isArray(apiData)) {
			// 배열 형태의 응답 처리
			setData(apiData);
			setTotalElements(apiData.length);
			setPageCount(Math.ceil(apiData.length / DEFAULT_PAGE_SIZE));
		}
	}, [apiData.data]);

	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedRow: IniTerminalListData = data[rowIndex];
			setSelectedTerminal(selectedRow);
		} else {
			setSelectedTerminal(null);
		}
	}, [selectedRows]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={`${tCommon('tabs.titles.terminal')} ${tCommon('tabs.actions.register')}`}
				content={
					<IniTerminalRegisterPage
						onClose={() => setOpenModal(false)}
						mode={'update'}
						selectedTerminal={selectedTerminal || undefined}
					/>
				}
			/>
			<DeleteConfirmDialog
				isOpen={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
				onConfirm={handleDeleteConfirm}
				isDeleting={remove.isPending}
				title="터미널 삭제"
				description={`선택한 터미널 '${selectedTerminal?.terminalName || selectedTerminal?.terminalCode}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>
			<PageTemplate firstChildWidth="30%" className="border rounded-lg">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle={tCommon('pages.titles.terminalList')}
					rowCount={totalElements}
					useSearch={true}
					selectedRows={selectedRows}
					enableSingleSelect={true}
					toggleRowSelection={toggleRowSelection}
					searchSlot={
						<SearchSlotComponent
							fields={searchFields}
							endSlot={
								<ActionButtonsComponent
									useEdit
									useRemove
									edit={handleEdit}
									remove={handleRemove}
								/>
							}
							onSearch={(searchParams) => {
								setSearchParams(searchParams);
								setPage(0); // 검색 시 첫 페이지로 이동
							}}
						/>
					}
				/>
			</PageTemplate>
		</>
	);
};

export default IniTerminalListPage;
