import { FormField } from '@primes/components/form/DynamicFormComponent';

// 자재투입 데이터 테이블 타입
export type MaterialOutgoingDataTableType = {
	id: number;
	outgoingCode?: string;
	requestCode?: string;
	planCode?: string;
	itemCode?: string;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	outAmt?: number;
	outUnit?: string;
	outUnitName?: string;
	outDate?: string;
};

// 자재투입 등록/수정 Form Schema (dataTable columns 기반)
export const materialOutgoingFormSchema: FormField[] = [
	{
		name: 'outgoingCode',
		label: 'outgoingCode', // dataTable.columns.outgoingCode
		type: 'text',
		placeholder: 'outgoingCode', // label과 동일
		required: true,
	},
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
		name: 'itemCode',
		label: 'itemCode', // dataTable.columns.itemCode
		type: 'text',
		placeholder: 'itemCode', // label과 동일
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
		name: 'outAmt',
		label: 'outAmt', // dataTable.columns.outAmt
		type: 'number',
		placeholder: 'outAmt', // label과 동일
		required: true,
	},
	{
		name: 'outUnit',
		label: 'outUnit', // dataTable.columns.outUnit
		type: 'text',
		placeholder: 'outUnit', // label과 동일
		required: false,
	},
	{
		name: 'outUnitName',
		label: 'outUnitName', // dataTable.columns.outUnitName
		type: 'text',
		placeholder: 'outUnitName', // label과 동일
		required: false,
	},
	{
		name: 'outDate',
		label: 'outDate', // dataTable.columns.outDate
		type: 'date',
		placeholder: 'outDate', // label과 동일
		required: true,
	},
];

// 자재투입 검색 필드 (dataTable columns 기반)
export const materialOutgoingSearchFields: FormField[] = [
	{
		name: 'outgoingCode',
		label: 'outgoingCode', // dataTable.columns.outgoingCode
		type: 'text',
		placeholder: 'outgoingCode', // label과 동일
		required: false,
	},
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
		name: 'outDate',
		label: 'outDate', // dataTable.columns.outDate
		type: 'date',
		placeholder: 'outDate', // label과 동일
		required: false,
	},
];
