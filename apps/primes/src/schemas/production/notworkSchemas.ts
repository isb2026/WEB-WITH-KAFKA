/**
 * Notwork Master-Detail Schemas
 * Master: 비작업 Master 관리
 * Detail: 비작업 상세 관리
 */

import { FormField } from '@primes/components/form/DynamicFormComponent';
import { SearchField } from '@primes/components/common/search/SearchSlot';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';

// ========== MASTER SCHEMAS ==========

// Master DataTable 타입 (Swagger 기반 업데이트)
export interface NotworkMasterDataTableType {
	id: number;
	workDate?: string;
	machineId?: number;
	machineCode?: string;
	machineName?: string;
	jobType?: string;
	totalNotworkMinute?: number;
	description?: string;
	[key: string]: unknown;
}

// Master Form Schema (Swagger 기반 업데이트)
export const notworkMasterFormSchema: FormField[] = [
	{
		name: 'workDate',
		label: '작업일자',
		type: 'date',
		required: true,
		placeholder: '작업일자를 선택하세요',
	},
	{
		name: 'machineId',
		label: '장비 ID',
		type: 'number',
		placeholder: '장비 ID를 입력하세요',
	},
	{
		name: 'machineCode',
		label: '장비코드',
		type: 'notworkMachineCodeSelect',
		fieldKey: 'machineCode',
		placeholder: '장비코드를 선택하세요',
	},
	{
		name: 'machineName',
		label: '장비명',
		type: 'notworkMachineNameSelect',
		fieldKey: 'machineName',
		placeholder: '장비명을 선택하세요',
	},
	{
		name: 'jobType',
		label: '작업유형',
		type: 'text',
		placeholder: '작업유형을 입력하세요',
	},
	{
		name: 'totalNotworkMinute',
		label: '총 비가동 시간(분)',
		type: 'number',
		placeholder: '총 비가동 시간을 입력하세요',
	},
	{
		name: 'description',
		label: '설명',
		type: 'textarea',
		placeholder: '설명을 입력하세요',
	},
];

// Master Search Fields (Swagger 기반 업데이트)
export const notworkMasterSearchFields: SearchField[] = [
	{
		name: 'workDate',
		label: '작업일자',
		type: 'date',
		placeholder: '작업일자 검색',
	},
	{
		name: 'machineCode',
		label: '장비코드',
		type: 'text',
		placeholder: '장비코드 검색',
	},
	{
		name: 'machineName',
		label: '장비명',
		type: 'text',
		placeholder: '장비명 검색',
	},
	{
		name: 'jobType',
		label: '작업유형',
		type: 'text',
		placeholder: '작업유형 검색',
	},
	{
		name: 'startDate',
		label: '시작일자',
		type: 'date',
		placeholder: '시작일자 검색',
	},
	{
		name: 'endDate',
		label: '종료일자',
		type: 'date',
		placeholder: '종료일자 검색',
	},
];

// Master Table Columns (Swagger 기반 업데이트)
export const notworkMasterColumns: ColumnConfig<NotworkMasterDataTableType>[] =
	[
		{
			accessorKey: 'id',
			header: 'ID',
			size: 80,
		},
		{
			accessorKey: 'workDate',
			header: '작업일자',
			size: 120,
		},
		{
			accessorKey: 'machineCode',
			header: '장비코드',
			size: 120,
		},
		{
			accessorKey: 'machineName',
			header: '장비명',
			size: 150,
		},
		{
			accessorKey: 'jobType',
			header: '작업유형',
			size: 100,
		},
		{
			accessorKey: 'totalNotworkMinute',
			header: '총 비가동 시간(분)',
			size: 150,
		},
		{
			accessorKey: 'description',
			header: '설명',
			size: 200,
		},
	];

// ========== DETAIL SCHEMAS ==========

// Detail DataTable 타입 (Swagger 기반 업데이트)
export interface NotworkDetailDataTableType {
	id: number;
	notworkMasterId?: number;
	itemNo?: string;
	progressNo?: string;
	commandNo?: string;
	workCode?: string;
	notworkMinute?: number;
	startTime?: string;
	endTime?: string;
	notworkCode?: string;
	notworkName?: string;
	notworkReasonCode?: string;
	notworkReasonName?: string;
	contents?: string;
	worker?: string;
	[key: string]: unknown;
}

// Detail Form Schema
export const notworkDetailFormSchema: FormField[] = [
	{
		name: 'itemNo',
		label: '품목번호',
		type: 'text',
		placeholder: '품목번호를 입력하세요',
	},
	{
		name: 'progressNo',
		label: '공정번호',
		type: 'text',
		placeholder: '공정번호를 입력하세요',
	},
	{
		name: 'commandNo',
		label: '지시번호',
		type: 'text',
		placeholder: '지시번호를 입력하세요',
	},
	{
		name: 'workCode',
		label: '작업코드',
		type: 'text',
		placeholder: '작업코드를 입력하세요',
	},
	{
		name: 'notworkMinute',
		label: '비작업 시간(분)',
		type: 'number',
		placeholder: '비작업 시간을 입력하세요',
	},
	{
		name: 'startTime',
		label: '시작시간',
		type: 'datetime-local',
		placeholder: '시작시간을 선택하세요',
	},
	{
		name: 'endTime',
		label: '종료시간',
		type: 'datetime-local',
		placeholder: '종료시간을 선택하세요',
	},
	{
		name: 'notworkCode',
		label: '비가동 코드',
		type: 'notworkCodeSelect',
		fieldKey: 'notworkCode',
		placeholder: '비가동 코드를 선택하세요',
	},
	{
		name: 'notworkName',
		label: '비가동명',
		type: 'notworkNameSelect',
		fieldKey: 'notworkName',
		placeholder: '비가동명을 선택하세요',
	},
	{
		name: 'notworkReasonCode',
		label: '비가동 사유코드',
		type: 'notworkReasonCodeSelect',
		fieldKey: 'notworkReasonCode',
		placeholder: '비가동 사유코드를 선택하세요',
	},
	{
		name: 'notworkReasonName',
		label: '비가동 사유명',
		type: 'text',
		placeholder: '비가동 사유명을 입력하세요',
	},
	{
		name: 'contents',
		label: '내용',
		type: 'textarea',
		placeholder: '내용을 입력하세요',
	},
	{
		name: 'worker',
		label: '작업자',
		type: 'text',
		placeholder: '작업자를 입력하세요',
	},
];

// Detail Search Fields
export const notworkDetailSearchFields: SearchField[] = [
	{
		name: 'workCode',
		label: '작업코드',
		type: 'text',
		placeholder: '작업코드 검색',
	},
	{
		name: 'commandNo',
		label: '지시번호',
		type: 'text',
		placeholder: '지시번호 검색',
	},
	{
		name: 'notworkCode',
		label: '비작업 코드',
		type: 'text',
		placeholder: '비작업 코드 검색',
	},
	{
		name: 'workBy',
		label: '작업자',
		type: 'text',
		placeholder: '작업자 검색',
	},
	{
		name: 'workDate',
		label: '작업일자',
		type: 'date',
		placeholder: '작업일자 선택',
	},
];

// Detail Table Columns
export const notworkDetailColumns: ColumnConfig<NotworkDetailDataTableType>[] =
	[
		{
			accessorKey: 'id',
			header: 'ID',
			size: 80,
		},
		{
			accessorKey: 'itemNo',
			header: '품목번호',
			size: 120,
		},
		{
			accessorKey: 'progressNo',
			header: '공정번호',
			size: 100,
		},
		{
			accessorKey: 'commandNo',
			header: '지시번호',
			size: 120,
		},
		{
			accessorKey: 'workCode',
			header: '작업코드',
			size: 100,
		},
		{
			accessorKey: 'notworkMinute',
			header: '비작업 시간(분)',
			size: 120,
		},
		{
			accessorKey: 'startTime',
			header: '시작시간',
			size: 150,
		},
		{
			accessorKey: 'endTime',
			header: '종료시간',
			size: 150,
		},
		{
			accessorKey: 'notworkCode',
			header: '비작업 코드',
			size: 120,
		},
		{
			accessorKey: 'notworkName',
			header: '비가동명',
			size: 150,
		},
		{
			accessorKey: 'notworkReasonCode',
			header: '비가동 사유코드',
			size: 130,
		},
		{
			accessorKey: 'notworkReasonName',
			header: '비가동 사유명',
			size: 150,
		},
		{
			accessorKey: 'contents',
			header: '내용',
			size: 200,
		},
		{
			accessorKey: 'worker',
			header: '작업자',
			size: 100,
		},
	];
