import { useState, useCallback, useEffect } from 'react';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { useWorkingDetailListQuery } from '@primes/hooks/production/useWorkingDetailListQuery';
import { useUsers } from '@primes/hooks/users/useUsers';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import {
	CodeSelectComponent,
	UserSelectComponent,
} from '@primes/components/customSelect';
import {
	getWorkingDetailColumns,
	workingDetailSearchFields,
} from '@primes/schemas/production/workingDetailSchemas';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { DraggableDialog } from '@repo/radix-ui/components';

const PAGE_SIZE = 30;

export const ProductionWorkingListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	const [page, setPage] = useState(0);
	const [searchRequest, setSearchRequest] = useState({});
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState<any>(null);

	// API Hook 사용 - Working Detail List
	const list = useWorkingDetailListQuery({
		searchRequest,
		page,
		size: PAGE_SIZE,
	});

	// 사용자 데이터 가져오기 (workBy 변환용)
	const { list: userList } = useUsers({ page: 0, size: 1000 });
	const users = userList.data?.content || userList.data || [];

	// 컬럼 정의
	const columns = getWorkingDetailColumns(users);
	const searchFields = workingDetailSearchFields();

	// 페이지 변경 핸들러
	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	// 검색 핸들러
	const handleSearch = useCallback((filters: any) => {
		setSearchRequest(filters);
		setPage(0); // 검색 시 첫 페이지로 이동
	}, []);

	// 데이터 테이블 Hook
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		list.data?.content || [],
		columns,
		PAGE_SIZE,
		list.data?.totalPages || 0,
		page,
		list.data?.totalElements || 0,
		onPageChange
	);

	return (
		<PageTemplate firstChildWidth="30%" className="border rounded-lg">
			<DatatableComponent
				table={table}
				columns={columns}
				data={list.data?.content || []}
				tableTitle={tCommon('pages.titles.workingList')}
				rowCount={list.data?.totalElements || 0}
				useSearch={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
				searchSlot={
					<SearchSlotComponent
						onSearch={handleSearch}
						fields={searchFields}
						otherTypeElements={{
							userSelect: (props: any) => {
								return (
									<UserSelectComponent
										{...props}
										searchParams={{
											department: 'COM-001-003',
										}}
									/>
								);
							},
							codeSelect: CodeSelectComponent,
						}}
					/>
				}
			/>
		</PageTemplate>
	);
};

export default ProductionWorkingListPage;
