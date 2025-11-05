import React, { useState, useCallback } from 'react';
import { DatatableComponent } from '@primes/components/datatable/DatatableComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { PageTemplate } from '@primes/templates/PageTemplate';
import { useTranslation } from '@repo/i18n';
import { useDataTable } from '@repo/radix-ui/hook';
import { 
	OutsourcingVendor, 
	OutsourcingVendorListColumns, 
	OutsourcingVendorSearchFields 
} from '@primes/schemas/outsourcing/vendorListSchema';
import { DraggableDialog } from '@radix-ui/components/DraggableDialog';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
// import { OutsourcingVendorListData } from '@primes/schemas/outsourcing';
import { OutsourcingVendorRegisterPage } from './OutsourcingVendorRegisterPage';
import { toast } from 'sonner';

// Mock 데이터 (실제로는 API에서 가져올 데이터)
const mockOutsourcingVendors: OutsourcingVendor[] = [
	{
		id: 1,
		compCode: 'OUT001',
		compName: '(주)만도',
		compType: 'outsourcing',
		compTypeName: '외주가공업체',
		representative: '김철수',
		manager: '이담당',
		phone: '02-1234-5678',
		email: 'contact@precision.co.kr',
		address: '서울시 강남구 테헤란로 123',
		addressDetail: '네모빌딩 456호',
		specialties: 'precision',
		specialtiesName: '정밀가공',
		qualityGrade: 'A',
		isActive: true,
	},
	{
		id: 2,
		compCode: 'OUT002',
		compName: '세아특수강',
		compType: 'welding',
		compTypeName: '용접전문업체',
		representative: '이영희',
		manager: '박담당',
		phone: '031-9876-5432',
		email: 'info@welding.co.kr',
		address: '경기도 성남시 분당구 판교로 456',
		addressDetail: '세모빌딩 789호',
		specialties: 'welding',
		specialtiesName: '용접',
		qualityGrade: 'B',
		isActive: true,
	},
	{
		id: 3,
		compCode: 'OUT003',
		compName: '대호정밀',
		compType: 'surface',
		compTypeName: '표면처리업체',
		representative: '박민수',
		manager: '최담당',
		phone: '041-5555-1234',
		email: 'sales@coating.co.kr',
		address: '충남 천안시 동남구 병천면 123',
		addressDetail: '동그라미공장 1층',
		specialties: 'coating',
		specialtiesName: '코팅',
		qualityGrade: 'A',
		isActive: false,
	},
];

const PAGE_SIZE = 30;

export const OutsourcingVendorsListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	
	const [page, setPage] = useState(0);
	const [searchParams, setSearchParams] = useState({});

	// 컬럼과 검색 필드 정의
	const columns = OutsourcingVendorListColumns();
	const searchFields = OutsourcingVendorSearchFields();
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [selectedOutsourcingVendorData, setSelectedOutsourcingVendorData] =
		useState<OutsourcingVendor | null>(null);

	// 페이지 변경 핸들러
	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	// 검색 핸들러
	const handleSearch = useCallback((filters: any) => {
		setSearchParams(filters);
		setPage(0); // 검색 시 첫 페이지로 이동
	}, []);

	// TODO: 실제 API 연동 시 사용할 데이터
	// const { list: apiData, remove } = useOutsourcingVendor({
	//     searchRequest: searchParams,
	//     page,
	//     size: PAGE_SIZE,
	// });

	// Mock 데이터 (실제 API 연동 전까지 사용)
	const mockData = {
		content: mockOutsourcingVendors,
		totalElements: mockOutsourcingVendors.length,
		totalPages: Math.ceil(mockOutsourcingVendors.length / PAGE_SIZE),
	};

	// 데이터 테이블 Hook
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		mockData.content,
		columns,
		PAGE_SIZE,
		mockData.totalPages,
		page,
		mockData.totalElements,
		onPageChange
	);

	const handleCreate = () => {
		console.log('협력업체 등록');
		// TODO: Service 레이어에서 구현 예정
	};

	const handleEdit = () => {
		if (selectedRows.size === 0) {
			toast.warning('수정할 항목을 선택해주세요.');
			return;
		}
		
		const selectedIndex = Array.from(selectedRows)[0];
		const selectedData = mockData.content[Number(selectedIndex)];
		
		if (selectedData) {
			setSelectedOutsourcingVendorData(selectedData);
			setShowEditModal(true);
		}
	};

	const handleDelete = () => {
		if (selectedRows.size === 0) {
			toast.warning('삭제할 항목을 선택해주세요.');
			return;
		}
		
		const selectedIndex = Array.from(selectedRows)[0];
		const selectedData = mockData.content[Number(selectedIndex)];
		
		if (selectedData) {
			setSelectedOutsourcingVendorData(selectedData);
			setShowDeleteDialog(true);
		}
	};

	const confirmDelete = () => {
		if (!selectedOutsourcingVendorData) return;

		// 성공 처리
		setShowDeleteDialog(false);
		setSelectedOutsourcingVendorData(null);
		toast.success('삭제가 정상적으로 완료되었습니다.');
	};

	return (
		<>
			<PageTemplate>
				<DatatableComponent
					table={table}
					columns={columns}
					data={mockData.content}
					tableTitle={tCommon('tabs.labels.outsourcingVendors')}
					rowCount={mockData.totalElements}
					useSearch={true}
					enableSingleSelect={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					classNames={{
						container: 'border rounded-lg',
					}}
					searchSlot={
						<SearchSlotComponent
							fields={searchFields}
							onSearch={handleSearch}
							endSlot={
								<ActionButtonsComponent
									useCreate={false}
									useEdit={true}
									useRemove={true}
									create={handleCreate}
									edit={handleEdit}
									remove={handleDelete}
									visibleText={false}
								/>
							}
						/>
					}
				/>
			</PageTemplate>

			<DraggableDialog
				open={showEditModal}
				onOpenChange={setShowEditModal}
				title={`${tCommon('tabs.titles.outsourcingVendors')} ${tCommon('edit')}`}
				content={
					<OutsourcingVendorRegisterPage
						vendorData={selectedOutsourcingVendorData}
						isEditMode={true}
						onClose={() => setShowEditModal(false)}
						onSuccess={() => {
							setShowEditModal(false);
							toast.success('수정이 완료되었습니다.');
						}}
					/>
				}
			/>

			<DeleteConfirmDialog
				isOpen={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				onConfirm={confirmDelete}
				isDeleting={false}
				title={tCommon('delete') || '삭제'}
				description={`선택한 거래처 "${selectedOutsourcingVendorData?.compCode || '항목'}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
			/>
		</>
	);
};

export default OutsourcingVendorsListPage;