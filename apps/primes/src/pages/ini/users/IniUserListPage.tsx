import { useState, useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useUsers } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { RadixIconButton } from '@repo/radix-ui/components';
import { Pen, Trash2 } from 'lucide-react';
import { IniUserRegisterPage } from './IniUserRegisterPage';
import { DraggableDialog } from '@repo/radix-ui/components';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';
import { User } from '@primes/types/users';

export const IniUserListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<Record<string, any>> | null>(
		null
	);
	const [page, setPage] = useState(0);
	const [data, setData] = useState([]);
	const [totalElements, setTotalElements] = useState(0);
	const [pageCount, setPageCount] = useState(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [editUserData, setEditingUserData] = useState<User | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, any>
	> | null>(null);
	const [searchParams, setSearchParams] = useState<any>({ isDelete: false });

	const DEFAULT_PAGE_SIZE = 30;

	const tableColumns = [
		{
			accessorKey: 'name',
			header: t('columns.name'),
			size: 120,
		},
		{
			accessorKey: 'username',
			header: t('columns.username'),
			size: 120,
		},
		{
			accessorKey: 'email',
			header: t('columns.email'),
			size: 200,
		},
		{
			accessorKey: 'mobileTel',
			header: t('columns.mobileTel'),
			size: 200,
		},
		{
			accessorKey: 'department',
			header: t('columns.departmentCode'),
			size: 100,
		},
		{
			accessorKey: 'partLevel',
			header: t('columns.partLevel'),
			size: 100,
		},
		{
			accessorKey: 'partPosition',
			header: t('columns.partPosition'),
			size: 100,
		},
		{
			accessorKey: 'zipcode',
			header: t('columns.zipcode'),
			size: 120,
		},
		{
			accessorKey: 'addressMaster',
			header: t('columns.address'),
			size: 150,
		},
		{
			accessorKey: 'addressDetail',
			header: t('columns.addressDetail'),
			size: 250,
		},
		{
			accessorKey: 'inDate',
			header: t('columns.userInDate'),
			size: 150,
		},
		{
			accessorKey: 'outDate',
			header: t('columns.userOutDate'),
			size: 150,
		},
		{
			accessorKey: 'isUse',
			header: t('columns.isUse'),
			size: 100,
		},
	];
	const searchFields = [
		{
			name: 'username',
			label: t('columns.username'),
			type: 'text',
			placeholder: '사용자명으로 검색',
		},
		{
			name: 'name',
			label: t('columns.name'),
			type: 'text',
			placeholder: '이름으로 검색',
		},
		{
			name: 'email',
			label: t('columns.email'),
			type: 'text',
			placeholder: '이메일로 검색',
		},
		{
			name: 'mobileTel',
			label: t('columns.mobileTel'),
			type: 'text',
			placeholder: '휴대폰번호로 검색',
		},
		{
			name: 'department',
			label: t('columns.departmentCode'),
			type: 'select',
			placeholder: '부서 선택',
		},
		{
			name: 'partLevel',
			label: t('columns.partLevel'),
			type: 'select',
			placeholder: '직급 선택',
		},
		{
			name: 'partPosition',
			label: t('columns.partPosition'),
			type: 'select',
			placeholder: '직책 선택',
		},
	];

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	const { list, remove } = useUsers({
		page: page,
		size: DEFAULT_PAGE_SIZE,
		searchRequest: searchParams,
	});
	useEffect(() => {
		if (list.data?.content) {
			setData(list.data.content);
			setTotalElements(list.data.totalElements);
			setPageCount(list.data.totalPages);
		}
	}, [list]);

	useEffect(() => {
		if (formMethods && editUserData) {
			formMethods.reset(editUserData);
		}
	}, [formMethods]);

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	const handleEdit = () => {
		if (editUserData) {
			setOpenModal(true);
		} else {
			toast.warning('사용자를 선택해주세요.');
		}
	};

	const handleDelete = () => {
		if (editUserData) {
			setOpenDeleteDialog(true);
		} else {
			toast.warning('삭제하실 사용자를 선택해주세요.');
		}
	};

	const handleDeleteConfirm = () => {
		if (editUserData) {
			const username = editUserData.username as string;
			remove.mutate(username);
			setOpenDeleteDialog(false);
		}
	};
	const AddButton = () => {
		return (
			<>
				<RadixIconButton
					onClick={handleEdit}
					className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border `}
				>
					<Pen size={16} />
					{tCommon('edit')}
				</RadixIconButton>
				<RadixIconButton
					onClick={handleDelete}
					className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border `}
				>
					<Trash2 size={16} />
					{tCommon('delete')}
				</RadixIconButton>
			</>
		);
	};

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
			const currenrRow: User = data[rowIndex];
			console.log('currenrRow', currenrRow);
			setEditingUserData(currenrRow);
		} else {
			setEditingUserData(null);
		}
	}, [selectedRows]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				title={editUserData ? '사용자 수정' : '사용자 등록'}
				onOpenChange={setOpenModal}
				content={
					<IniUserRegisterPage
						onClose={() => {
							setOpenModal(false);
						}}
						userData={editUserData || undefined}
						onFormReady={handleFormReady}
					/>
				}
			/>
			<DeleteConfirmDialog
				isOpen={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
				onConfirm={handleDeleteConfirm}
				isDeleting={remove.isPending}
				title="사용자 삭제"
				description={`선택한 사용자 '${editUserData?.username}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			<PageTemplate firstChildWidth="30%" className="border rounded-lg">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle={tCommon('pages.titles.userList')}
					rowCount={totalElements}
					useSearch={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					searchSlot={
						<SearchSlotComponent
							fields={searchFields}
							endSlot={<AddButton />}
							onSearch={(searchParams) => {
								setSearchParams(searchParams);
							}}
						/>
					}
				/>
			</PageTemplate>
		</>
	);
};
