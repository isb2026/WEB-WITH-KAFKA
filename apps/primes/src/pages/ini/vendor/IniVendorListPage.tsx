import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useCodeFieldQuery, useVendor } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { toast } from 'sonner';
import { Code } from '@primes/types/code';
import { VendorDto } from '@primes/types/vendor';
import { DraggableDialog } from '@repo/radix-ui/components';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { IniVendorRegisterPage } from '@primes/pages/ini/vendor/IniVendorRegisterPage';
import { IniVendorListPagePannel } from './pannel/iniVendroListPagePannel';

export const IniVendorListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<VendorDto[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [selectedVendor, setSelectedVendor] = useState<VendorDto | null>(
		null
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const { data: codeFieldData } = useCodeFieldQuery('COM-006');
	const DEFAULT_PAGE_SIZE = 30;
	const [isOpen, setIsOpen] = useState(false);
	const [searchParams, setSearchParams] = useState<any>({});

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	const tableColumns = [
		{
			accessorKey: 'compCode',
			header: t('columns.compCode'),
			size: 120,
			cell: ({
				getValue,
				row,
			}: {
				getValue: () => string;
				row: { original: VendorDto };
			}) => {
				const value = getValue();
				return (
					<p
						className={`text-Colors-Brand-600 hover:text-Colors-Brand-700 hover:underline focus:outline-none focus:underline cursor-pointer ${
							selectedVendor?.id === row.original.id && isOpen
								? 'font-bold'
								: 'font-medium'
						}`}
						onClick={() => {
							if (
								selectedVendor?.id === row.original.id &&
								isOpen
							) {
								setIsOpen(false);
								setSelectedVendor(null);
							} else {
								// 다른 데이터이거나 패널이 닫혀있으면 새로 선택하고 열기
								setSelectedVendor(row.original);
								setIsOpen(true);
							}
						}}
					>
						{value ? value.toLocaleString() : '-'}
					</p>
				);
			},
		},
		// {
		// 	accessorKey: 'compTypeName',
		// 	header: t('columns.compType'),
		// 	size: 150,
		// },
		{
			accessorKey: 'compName',
			header: t('columns.compName'),
			size: 150,
		},
		{
			accessorKey: 'licenseNo',
			header: t('columns.licenseNo'),
			size: 150,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'ceoName',
			header: t('columns.ceoName'),
			size: 150,
		},
		{
			accessorKey: 'compEmail',
			header: t('columns.compEmail'),
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value ? value : '-';
			},
			size: 200,
		},
		{
			accessorKey: 'telNumber',
			header: t('columns.telNumber'),
			size: 130,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'faxNumber',
			header: t('columns.faxNumber'),
			size: 150,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'zipCode',
			header: t('columns.zipcode'),
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value ? value : '-';
			},
			size: 120,
		},
		{
			accessorKey: 'addressMst',
			header: t('columns.address'),
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value ? value : '-';
			},
			size: 250,
		},
		{
			accessorKey: 'addressDtl',
			header: t('columns.addressDetail'),
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value ? value : '-';
			},
			size: 250,
		},
		{
			accessorKey: 'isUse',
			header: t('columns.isUse'),
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? 'Y' : 'N';
			},
			size: 120,
		},
	];

	// 검색 필드 설정
	const searchFields = [
		{
			name: 'compName',
			label: t('columns.compName'),
			type: 'text',
			placeholder: '거래처명으로 검색',
		},
		{
			name: 'licenseNo',
			label: t('columns.licenseNo'),
			type: 'text',
			placeholder: '사업자등록번호로 검색',
		},
		{
			name: 'ceoName',
			label: t('columns.ceoName'),
			type: 'text',
			placeholder: '대표자명으로 검색',
		},
		{
			name: 'compCode',
			label: t('columns.compCode'),
			type: 'text',
			placeholder: '거래처코드로 검색',
		},
		{
			name: 'compType',
			label: t('columns.compType'),
			type: 'select',
			placeholder: '거래처유형 선택',
		},
		{
			name: 'telNumber',
			label: t('columns.telNumber'),
			type: 'text',
			placeholder: '전화번호로 검색',
		},
	];

	// // API 호출
	const { list: apiData, remove } = useVendor({
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
		if (selectedVendor !== null && selectedVendor !== undefined) {
			setOpenModal(true);
		} else {
			toast.warning('거래처를 선택해주세요.');
		}
	};

	const updatedVendor = () => {
		setOpenModal(false);
		const selectedRowIndex = Array.from(selectedRows)[0];
		toggleRowSelection(selectedRowIndex);
		setSelectedVendor(null);
	};

	const handleDelete = () => {
		if (selectedVendor !== null && selectedVendor !== undefined) {
			setOpenDeleteDialog(true);
		} else {
			toast.warning('삭제하실 거래처를 선택해주세요.');
		}
	};

	// 거래처 추가 버튼 컴포넌트
	const AddButton = () => (
		<ActionButtonsComponent
			useCreate={true}
			create={() => {
				setSelectedVendor(null);
				setOpenModal(true);
			}}
			visibleText={false}
			classNames={{
				container: 'ml-2',
			}}
		/>
	);

	const handleDeleteConfirm = () => {
		if (selectedVendor) {
			remove.mutate(selectedVendor.id);
			setOpenDeleteDialog(false);
		}
	};

	// 우측 패널 닫기 함수 (애니메이션과 함께)
	const handleClose = () => {
		setTimeout(() => {
			setIsOpen(false); // 실제로 숨김
		}, 200); // 애니메이션 시간과 동일
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
			const selectedRow: VendorDto = data[rowIndex];
			setSelectedVendor(selectedRow);
		} else {
			setSelectedVendor(null);
		}
	}, [selectedRows, data]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title="거래처 관리 수정"
				content={
					<IniVendorRegisterPage
						mode="edit"
						vendorData={selectedVendor}
						initialData={selectedVendor}
						onClose={updatedVendor}
					/>
				}
			/>
			<DeleteConfirmDialog
				isOpen={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
				onConfirm={handleDeleteConfirm}
				isDeleting={remove.isPending}
				title="거래처 삭제"
				description={`선택한 거래처 '${selectedVendor?.compName}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			<div className="max-w-full mx-auto h-full flex flex-col">
				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[40, 60]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					<div className="border rounded-lg overflow-auto">
						<DatatableComponent
							table={table}
							columns={tableColumns}
							data={data}
							tableTitle="거래처 목록"
							rowCount={totalElements}
							useSearch={true}
							enableSingleSelect={true}
							selectedRows={selectedRows}
							toggleRowSelection={toggleRowSelection}
							searchSlot={
								<SearchSlotComponent
									fields={searchFields}
									endSlot={
										<div className="flex items-center gap-2">
											<ActionButtonsComponent
												useEdit={true}
												useRemove={true}
												edit={handleEdit}
												remove={handleDelete}
												visibleText={false}
											/>
										</div>
									}
									onSearch={(searchParams) => {
										setSearchParams(searchParams);
										setPage(0); // 검색 시 첫 페이지로 이동
									}}
								/>
							}
						/>
					</div>
					{isOpen && selectedVendor && (
						<IniVendorListPagePannel
							vendor={selectedVendor}
							onClose={handleClose}
						/>
					)}
				</PageTemplate>
			</div>
		</>
	);
};

export default IniVendorListPage;
