import React from 'react';
import { useDataTable } from '@repo/radix-ui/hook';
import { DatatableComponent } from '@primes/components/datatable/DatatableComponent';
import { useTranslation } from '@repo/i18n';
import { useWorkingInLotListQuery } from '@primes/hooks/production/useWorkingInLot';
import type { WorkingInLotDto } from '@primes/types/production';

interface ItemInputInfoProps {
	selectedCommand?: any;
	selectedProgressId?: number;
	className?: string;
}

export const ItemInputInfo: React.FC<ItemInputInfoProps> = ({
	selectedCommand,
	selectedProgressId,
	className = '',
}) => {
	const { t } = useTranslation('common');

	// 자재 투입 정보 컬럼 정의 (WorkingInLotDto 기반)
	const columns = [
		{
			accessorKey: 'lotNo',
			header: 'LOT번호',
			size: 120,
		},
		{
			accessorKey: 'itemNumber',
			header: '품번',
			size: 120,
		},
		{
			accessorKey: 'itemName',
			header: '품명',
			size: 150,
		},
		{
			accessorKey: 'itemSpec',
			header: '규격',
			size: 120,
		},
		{
			accessorKey: 'useAmount',
			header: '투입수량',
			size: 100,
		},
		{
			accessorKey: 'lotUnit',
			header: '단위',
			size: 80,
		},
		{
			accessorKey: 'useWeight',
			header: '투입중량',
			size: 100,
		},
		{
			accessorKey: 'inputDate',
			header: '투입일시',
			size: 120,
		},
		{
			accessorKey: 'createdBy',
			header: '투입자',
			size: 100,
		},
	];

	// 작업지시번호와 공정ID가 모두 있을 때만 자재투입 데이터 조회
	const shouldFetchData = selectedCommand?.id && selectedProgressId;

	const searchRequest = shouldFetchData
		? {
				commandId: selectedCommand.id,
				progressId: selectedProgressId,
			}
		: undefined;

	console.log('=== ItemInputInfo 자재투입 데이터 조회 ===');
	console.log('selectedCommand:', selectedCommand);
	console.log('selectedProgressId:', selectedProgressId);
	console.log('shouldFetchData:', shouldFetchData);
	console.log('searchRequest:', searchRequest);

	const {
		data: workingInLotData,
		isLoading,
		error,
	} = useWorkingInLotListQuery({
		searchRequest,
		page: 0,
		size: 100,
	});

	console.log('자재투입 데이터 조회 결과:', {
		workingInLotData,
		isLoading,
		error,
	});

	// 데이터 변환 (WorkingInLotDto -> 테이블 표시용)
	const tableData =
		workingInLotData?.content?.map((item: WorkingInLotDto) => ({
			id: item.id,
			lotNo: item.lotNo,
			itemNumber: item.itemNumber,
			itemName: item.itemName,
			itemSpec: item.itemSpec,
			useAmount: item.useAmount,
			lotUnit: item.lotUnit,
			useWeight: item.useWeight,
			inputDate: item.inputDate,
			createdBy: item.createdBy,
		})) || [];

	// useDataTable 훅 사용
	const { table } = useDataTable(
		tableData,
		columns,
		10, // pageSize
		Math.ceil(tableData.length / 10), // totalPages
		0, // currentPage
		tableData.length, // totalCount
		() => {} // onPageChange
	);

	const toggleRowSelection = (rowId: string) => {
		// 자재 선택 로직 (필요시 구현)
		console.log('자재 선택:', rowId);
	};

	const selectedRows = new Set<string>();

	// 로딩 상태
	if (isLoading) {
		return (
			<div
				className={`bg-white rounded-lg border h-full flex items-center justify-center ${className}`}
			>
				<div className="text-gray-500">
					자재 투입 정보를 불러오는 중...
				</div>
			</div>
		);
	}

	// 에러 상태
	if (error) {
		return (
			<div
				className={`bg-white rounded-lg border h-full flex items-center justify-center ${className}`}
			>
				<div className="text-red-500">
					자재 투입 정보를 불러오는데 실패했습니다.
				</div>
			</div>
		);
	}

	// 작업지시가 선택되지 않은 경우
	if (!selectedCommand) {
		return (
			<div
				className={`bg-white rounded-lg border h-full flex items-center justify-center ${className}`}
			>
				<div className="text-gray-500">
					작업지시를 선택하면 자재 투입 정보가 표시됩니다.
				</div>
			</div>
		);
	}

	// 공정이 선택되지 않은 경우
	if (!selectedProgressId) {
		return (
			<div
				className={`bg-white rounded-lg border h-full flex items-center justify-center ${className}`}
			>
				<div className="text-gray-500">
					공정을 선택하면 자재 투입 정보가 표시됩니다.
				</div>
			</div>
		);
	}

	return (
		<div className={`bg-white rounded-lg border h-full ${className}`}>
			<DatatableComponent
				table={table}
				columns={columns}
				data={tableData}
				tableTitle="자재 투입 정보"
				rowCount={tableData.length}
				toggleRowSelection={toggleRowSelection}
				selectedRows={selectedRows}
				usePageNation={false}
				useSearch={false}
				enableSingleSelect={false}
				classNames={{
					container: 'h-full',
				}}
			/>
		</div>
	);
};

export default ItemInputInfo;
