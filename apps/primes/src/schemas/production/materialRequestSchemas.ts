import { FormField } from '@primes/components/form/DynamicFormComponent';

// 자재요청 데이터 테이블 타입
export type MaterialRequestDataTableType = {
	id: number;
	requestCode?: string;
	planCode?: string;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	requestAmt?: number;
	requestUnit?: string;
	requestUnitName?: string;
	requestDate?: string;
};

// 자재요청 등록/수정 Form Schema (dataTable columns 기반)
export const materialRequestFormSchema: FormField[] = [
	{
		name: 'requestCode',
		label: 'requestCode', // dataTable.columns.requestCode
		type: 'text',
		placeholder: 'requestCode', // label과 동일
		required: true,
	},
	{
		name: 'planCode',
		label: 'planCode', // dataTable.columns.planCode
		type: 'text',
		placeholder: 'planCode', // label과 동일
		required: false,
	},
	{
		name: 'itemNo',
		label: 'itemNo', // dataTable.columns.itemNo
		type: 'number',
		placeholder: 'itemNo', // label과 동일
		required: true,
	},
	{
		name: 'itemNumber',
		label: 'itemNumber', // dataTable.columns.itemNumber
		type: 'text',
		placeholder: 'itemNumber', // label과 동일
		required: false,
	},
	{
		name: 'itemName',
		label: 'itemName', // dataTable.columns.itemName
		type: 'text',
		placeholder: 'itemName', // label과 동일
		required: true,
	},
	{
		name: 'itemSpec',
		label: 'itemSpec', // dataTable.columns.itemSpec
		type: 'text',
		placeholder: 'itemSpec', // label과 동일
		required: false,
	},
	{
		name: 'requestAmt',
		label: 'requestAmt', // dataTable.columns.requestAmt
		type: 'number',
		placeholder: 'requestAmt', // label과 동일
		required: true,
	},
	{
		name: 'requestUnit',
		label: 'requestUnit', // dataTable.columns.requestUnit
		type: 'text',
		placeholder: 'requestUnit', // label과 동일
		required: false,
	},
	{
		name: 'requestUnitName',
		label: 'requestUnitName', // dataTable.columns.requestUnitName
		type: 'text',
		placeholder: 'requestUnitName', // label과 동일
		required: false,
	},
	{
		name: 'requestDate',
		label: 'requestDate', // dataTable.columns.requestDate
		type: 'date',
		placeholder: 'requestDate', // label과 동일
		required: true,
	},
];

// 자재요청 검색 필드 (dataTable columns 기반)
export const materialRequestSearchFields: FormField[] = [
	{
		name: 'requestCode',
		label: 'requestCode', // dataTable.columns.requestCode
		type: 'text',
		placeholder: 'requestCode', // label과 동일
		required: false,
	},
	{
		name: 'planCode',
		label: 'planCode', // dataTable.columns.planCode
		type: 'text',
		placeholder: 'planCode', // label과 동일
		required: false,
	},
	{
		name: 'itemName',
		label: 'itemName', // dataTable.columns.itemName
		type: 'text',
		placeholder: 'itemName', // label과 동일
		required: false,
	},
	{
		name: 'requestDate',
		label: 'requestDate', // dataTable.columns.requestDate
		type: 'date',
		placeholder: 'requestDate', // label과 동일
		required: false,
	},
];
