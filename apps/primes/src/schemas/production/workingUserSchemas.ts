/**
 * Working User Schemas - SinglePage 패턴
 * 작업자 관리
 */

import { FormField } from '@primes/components/form/DynamicFormComponent';
import { SearchField } from '@primes/components/common/search/SearchSlot';
import { ColumnConfig } from '@repo/radix-ui/hook';

// DataTable 타입
export interface WorkingUserDataTableType {
	id: number;
	workingMasterId: number;
	userNo: string;
	workerName: string;
	gongsu: number;
}

// Form Schema
export const workingUserFormSchema: FormField[] = [
	{
		name: 'workingMasterId',
		label: '작업 Master ID',
		type: 'number',
		required: true,
		placeholder: '작업 Master ID를 입력하세요',
	},
	{
		name: 'userNo',
		label: '사용자 번호',
		type: 'text',
		placeholder: '사용자 번호를 입력하세요',
	},
	{
		name: 'workerName',
		label: '작업자명',
		type: 'text',
		placeholder: '작업자명을 입력하세요',
	},
	{
		name: 'gongsu',
		label: '공수',
		type: 'number',
		placeholder: '공수를 입력하세요',
	},
];

// Search Fields
export const workingUserSearchFields: SearchField[] = [
	{
		name: 'workingMasterId',
		label: '작업 Master ID',
		type: 'text',
		placeholder: '작업 Master ID 검색',
	},
	{
		name: 'userNo',
		label: '사용자 번호',
		type: 'text',
		placeholder: '사용자 번호 검색',
	},
	{
		name: 'workerName',
		label: '작업자명',
		type: 'text',
		placeholder: '작업자명 검색',
	},
];

// Table Columns
export const workingUserColumns: ColumnConfig<WorkingUserDataTableType>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		size: 80,
	},
	{
		accessorKey: 'workingMasterId',
		header: '작업 Master ID',
		size: 150,
	},
	{
		accessorKey: 'userNo',
		header: '사용자 번호',
		size: 120,
	},
	{
		accessorKey: 'workerName',
		header: '작업자명',
		size: 120,
	},
	{
		accessorKey: 'gongsu',
		header: '공수',
		size: 100,
	},
];
