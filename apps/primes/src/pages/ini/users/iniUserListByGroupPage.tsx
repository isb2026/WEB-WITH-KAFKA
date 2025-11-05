import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { User } from '@primes/types/users';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { Building2, Users, UserCheck, UserX } from 'lucide-react';
import { useCodeFieldQuery } from '@primes/hooks/init/code';
import { useUsers } from '@primes/hooks';
import { createEquipmentProgressBarOption } from '@primes/components/charts/EquipmentEfficiencyChart';

interface DepartmentGroup {
	departmentCode: string;
	departmentName: string;
	totalUsers: number;
	activeUsers: number;
	inactiveUsers: number;
	users: User[];
}

const PAGE_SIZE = 30;

export const IniUserListByGroupPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	// const { t: tCommon } = useTranslation('common');

	const [departmentGroups, setDepartmentGroups] = useState<DepartmentGroup[]>(
		[]
	);
	const [detailTableData, setDetailTableData] = useState<User[]>([]);
	const [detailTablePage, setDetailTablePage] = useState<number>(0);
	const [detailTablePageCount, setDetailTablePageCount] = useState<number>(0);
	const [detailTableTotalElements, setDetailTableTotalElements] =
		useState<number>(0);

	const [selectedDepartmentGroup, setSelectedDepartmentGroup] = useState<
		any | null
	>(null);

	const { data: departmentList } = useCodeFieldQuery('COM-001');
	const { list } = useUsers({
		page: 0,
		size: PAGE_SIZE,
		searchRequest: {
			department: selectedDepartmentGroup?.codeValue,
		},
	});

	// Master Table Columns
	const MasterTableColumns = [
		{
			accessorKey: 'codeName',
			header: t('columns.departmentName'),
			size: 150,
		},

		{
			accessorKey: 'description',
			header: t('columns.description'),
			size: 120,
			enableSummary: true,
		},
	];

	// Detail Table Columns (사용자 목록)
	const DetailTableColumns = [
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
			size: 150,
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
			accessorKey: 'inDate',
			header: t('columns.userInDate'),
			size: 120,
		},
		{
			accessorKey: 'isUse',
			header: t('columns.isUse'),
			size: 100,
		},
	];

	// Master table data table hook
	const {
		table: masterTable,
		toggleRowSelection: toggleMasterRowSelection,
		selectedRows: selectedMasterRows,
	} = useDataTable(
		departmentGroups,
		MasterTableColumns,
		PAGE_SIZE,
		0,
		0,
		0,
		() => {}
	);

	// Detail table data table hook - 안전한 초기화
	const {
		table: detailTable,
		toggleRowSelection: toggleDetailRowSelection,
		selectedRows: selectedDetailRows,
	} = useDataTable(
		detailTableData,
		DetailTableColumns,
		PAGE_SIZE,
		detailTablePageCount,
		detailTablePage,
		detailTableTotalElements,
		(pageination: { pageIndex: number }) => {
			setDetailTablePage(pageination.pageIndex);
		} // 빈 함수
	);

	useEffect(() => {
		if (departmentList) {
			setDepartmentGroups(departmentList);
		}
	}, [departmentList]);

	useEffect(() => {
		if (selectedMasterRows.size > 0) {
			const selectedRowIndex = Array.from(selectedMasterRows)[0];
			const rowIndex = parseInt(selectedRowIndex);
			if (rowIndex >= 0 && rowIndex < departmentGroups.length) {
				console.log(departmentGroups[rowIndex]);
				setSelectedDepartmentGroup(departmentGroups[rowIndex]);
			}
		}
	}, [selectedMasterRows]);

	useEffect(() => {
		if (list?.data?.content && selectedDepartmentGroup) {
			setDetailTableData(list.data.content);
			setDetailTablePageCount(list.data.totalPages);
			setDetailTableTotalElements(list.data.totalElements);
		}
	}, [list?.data, selectedDepartmentGroup]);

	// 전체 통계
	// const totalStats = {
	// 	totalUsers: 0,
	// 	activeUsers: 0,
	// 	inactiveUsers: 0,
	// 	totalDepartments: 0,
	// };

	return (
		<div className="space-y-6 h-full">
			{/* 전체 통계 카드 */}
			{/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white rounded-lg border p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								전체 사용자
							</p>
							<p className="text-2xl font-bold">
								{totalStats.totalUsers}
							</p>
						</div>
						<Users className="h-8 w-8 text-gray-500" />
					</div>
					<p className="text-xs text-gray-500 mt-1">
						총 {totalStats.totalDepartments}개 부서
					</p>
				</div>

				<div className="bg-white rounded-lg border p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								활성 사용자
							</p>
							<p className="text-2xl font-bold text-gray-700">
								{totalStats.activeUsers}
							</p>
						</div>
						<UserCheck className="h-8 w-8 text-gray-500" />
					</div>
					<p className="text-xs text-gray-500 mt-1">
						{totalStats.totalUsers > 0
							? Math.round(
									(totalStats.activeUsers /
										totalStats.totalUsers) *
										100
								)
							: 0}
						% 비율
					</p>
				</div>

				<div className="bg-white rounded-lg border p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								비활성 사용자
							</p>
							<p className="text-2xl font-bold text-gray-700">
								{totalStats.inactiveUsers}
							</p>
						</div>
						<UserX className="h-8 w-8 text-gray-500" />
					</div>
					<p className="text-xs text-gray-500 mt-1">
						{totalStats.totalUsers > 0
							? Math.round(
									(totalStats.inactiveUsers /
										totalStats.totalUsers) *
										100
								)
							: 0}
						% 비율
					</p>
				</div>

				<div className="bg-white rounded-lg border p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								부서 수
							</p>
							<p className="text-2xl font-bold text-gray-700">
								{totalStats.totalDepartments}
							</p>
						</div>
						<Building2 className="h-8 w-8 text-gray-500" />
					</div>
					<p className="text-xs text-gray-500 mt-1">
						부서별 사용자 분포
					</p>
				</div>
			</div> */}

			{/* Master-Detail 구조 */}
			<PageTemplate
				firstChildWidth="30%"
				splitterSizes={[30, 70]}
				splitterMinSize={[430, 800]}
				splitterGutterSize={6}
			>
				{/* Master: 부서 그룹 목록 */}
				<div className="border rounded-lg flex-1">
					<DatatableComponent
						table={masterTable}
						columns={MasterTableColumns}
						data={departmentGroups}
						tableTitle="부서별 그룹"
						rowCount={0}
						useSearch={true}
						toggleRowSelection={toggleMasterRowSelection}
						enableSingleSelect
						usePageNation={true}
						selectedRows={selectedMasterRows}
					/>
				</div>

				{/* Detail: 선택된 부서 상세 정보 */}
				<div className="flex flex-col gap-4 h-full">
					{/* 사용자 목록 Datatable */}
					<div className="border rounded-lg flex-1">
						<DatatableComponent
							table={detailTable}
							columns={DetailTableColumns}
							data={detailTableData}
							tableTitle="사용자 목록"
							rowCount={detailTableTotalElements}
							useSearch={true}
							usePageNation={true}
							selectedRows={selectedDetailRows}
							toggleRowSelection={toggleDetailRowSelection}
						/>
					</div>
				</div>
			</PageTemplate>
		</div>
	);
};
