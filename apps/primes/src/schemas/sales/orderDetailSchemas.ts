import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { OrderDetail } from '@primes/types/sales/orderDetail';


export type DataTableDataType = {
	id: number;
	itemNumber: string;
	requestDate: string;
	itemName: string;
	orderNumber: number;
	orderUnit: string;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	isProdCmd: boolean;
};

// Form schema for adding new order details
export const orderDetailFormSchema: FormField[] = [
	{
		name: 'itemSelect',
		label: '품번/품명',
		type: 'select',
		placeholder: '품번 또는 품명을 선택해주세요',
		required: true,
		disabled: false,
		options: [], // 동적으로 설정됨
	},
	{
		name: 'itemId',
		label: 'Item ID',
		type: 'hidden',
		defaultValue: '',
	},
	{
		name: 'itemNo',
		label: 'Item No',
		type: 'hidden',
		defaultValue: '',
		disabled: true,
	},
	{
		name: 'itemNumber',
		label: '품번',
		type: 'hidden',
		defaultValue: '',
		disabled: true,
		readOnly: true,
	},
	{
		name: 'itemName',
		label: '품명',
		type: 'hidden',
		defaultValue: '',
		disabled: true,
		readOnly: true,
	},
	{
		name: 'itemSpec',
		label: '규격',
		type: 'hidden',
		defaultValue: '',
		disabled: true,
		readOnly: true,
	},
	{
		name: 'requestDate',
		label: '납기일자',
		type: 'date',
		placeholder: '납기일자를 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'orderNumber',
		label: '주문 수량',
		type: 'text',
		placeholder: '주문수량를 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'orderUnit',
		label: '주문 단위',
		type: 'text',
		placeholder: '주문수량를 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'unitPrice',
		label: '단가',
		type: 'text',
		required: true,
		defaultValue: null,
		disabled: false,
	},
	{
		name: 'netPrice',
		label: '공급가액',
		type: 'text',
		required: true,
		disabled: false,
	},
	{
		name: 'grossPrice',
		label: '총금액',
		type: 'text',
		required: true,
		disabled: true,
	},
];

// Edit form schema for editing order details
export const orderDetailEditFormSchema: FormField[] = [
	{
		name: 'itemId',
		label: 'Item ID',
		type: 'hidden',
		defaultValue: '',
		disabled: true,
	},
	{
		name: 'itemNo',
		label: 'Item No',
		type: 'hidden',
		defaultValue: '',
		disabled: true,
	},
	{
		name: 'itemNumber',
		label: '품번',
		type: 'text',
		defaultValue: '',
		disabled: true,
		readOnly: true,
	},
	{
		name: 'itemName',
		label: '품명',
		type: 'text',
		defaultValue: '',
		disabled: true,
		readOnly: true,
	},
	{
		name: 'itemSpec',
		label: '규격',
		type: 'text',
		defaultValue: '',
		disabled: true,
		readOnly: true,
	},
	{
		name: 'requestDate',
		label: '납기일자',
		type: 'date',
		placeholder: '납기일자를 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'orderNumber',
		label: '주문 수량',
		type: 'text',
		placeholder: '주문수량를 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'orderUnit',
		label: '주문 단위',
		type: 'text',
		placeholder: '주문수량를 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'unitPrice',
		label: '단가',
		type: 'text',
		required: true,
		defaultValue: null,
		disabled: false,
	},
	{
		name: 'netPrice',
		label: '공급가액',
		type: 'text',
		required: true,
		disabled: false,
	},
	{
		name: 'grossPrice',
		label: '총금액',
		type: 'text',
		required: true,
		disabled: true,
	},
];

// Data table columns configuration
export const orderDetailColumns: ColumnConfig<OrderDetail>[] = [
	{
		accessorKey: 'itemNumber',
		header: '품번',
		size: 120,
		minSize: 100,
	},
	{
		accessorKey: 'itemName',
		header: '품명/규격',
		size: 180,
		minSize: 140,
	},
	{
		accessorKey: 'orderNumber',
		header: '주문량',
		size: 120,
		minSize: 100,
		enableSummary: true,
		cell: ({ getValue }: any) => {
			const value = getValue();
			return value ? value.toLocaleString() : '';
		},
	},
	{
		accessorKey: 'orderUnit',
		header: '주문단위',
		size: 100,
		minSize: 80,
	},
	{
		accessorKey: 'unitPrice',
		header: '단가',
		size: 120,
		minSize: 100,
		enableSummary: true,
		cell: ({ getValue }: any) => {
			const value = getValue();
			return value ? value.toLocaleString() : '';
		},
	},
	{
		accessorKey: 'netPrice',
		header: '공급가액',
		size: 120,
		minSize: 100,
		enableSummary: true,
		cell: ({ getValue }: any) => {
			const value = getValue();
			return value ? value.toLocaleString() : '';
		},
	},
	{
		accessorKey: 'grossPrice',
		header: '총주문금액',
		size: 120,
		minSize: 100,
		enableSummary: true,
		cell: ({ getValue }: any) => {
			const value = getValue();
			return value ? value.toLocaleString() : '';
		},
	},
	{
		accessorKey: 'requestDate',
		header: '납기일자',
		size: 120,
		minSize: 100,
	},
];
