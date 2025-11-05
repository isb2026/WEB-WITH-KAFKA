import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { DeliveryDetail } from '@primes/types/sales/deliveryDetail';

export type DataTableDataType = {
	tenantId: number;        
	isUse: boolean;          
	isDelete: boolean;       
	createdAt: string;       
	createdBy: string;       
	updatedAt: string;       
	updatedBy: string;       
	id: number;              
	deliveryMasterId: number;
	itemId: number;          
	itemNo: number;          
	itemNumber: string;      
	itemName: string;        
	itemSpec: string;        
	deliveryUnit: string;    
	deliveryAmount: number;  
	currencyUnit: string;    
	unitPrice: number;       
	netPrice: number;        
	vat: number;             
	grossPrice: number;      
	memo: string;            
	deliveryMaster: any[];
};

// Form schema for adding new delivery details
export const deliveryDetailFormSchema: FormField[] = [
	{
		name: 'itemSelect',
		label: '품번/품명(규격)',
		type: 'select',
		placeholder: '품번 또는 품명(규격)을 선택해주세요',
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
		label: '제품규격',
		type: 'hidden',
		defaultValue: '',
		disabled: true,
		readOnly: true,
	},
	{
		name: 'deliveryUnit',
		label: '납품 단위',
		type: 'text',
		placeholder: '납품단위를 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'deliveryAmount',
		label: '납품 수량',
		type: 'text',
		placeholder: '납품수량을 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'currencyUnit',
		label: '통화단위',
		type: 'select',
		options: [
			{ label: 'USD', value: 'USD' },
			{ label: 'KRW', value: 'KRW' },
		],
		required: true,
		disabled: false,
		defaultValue: 'USD',
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
	{
		name: 'memo',
		label: '메모',
		type: 'text',
		placeholder: '메모를 입력해주세요',
		required: false,
		disabled: false,
	},
];

// Edit form schema for editing delivery details
export const deliveryDetailEditFormSchema: FormField[] = [
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
		label: '제품규격',
		type: 'text',
		defaultValue: '',
		disabled: true,
		readOnly: true,
	},
	{
		name: 'deliveryUnit',
		label: '납품 단위',
		type: 'text',
		placeholder: '납품단위를 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'deliveryAmount',
		label: '납품 수량',
		type: 'text',
		placeholder: '납품수량을 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'currencyUnit',
		label: '통화단위',
		type: 'select',
		options: [
			{ label: 'USD', value: 'USD' },
			{ label: 'KRW', value: 'KRW' },
		],
		required: true,
		disabled: false,
		defaultValue: 'USD',
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
	{
		name: 'memo',
		label: '메모',
		type: 'text',
		placeholder: '메모를 입력해주세요',
		required: false,
		disabled: false,
	},
];

// Data table columns configuration  
export const deliveryDetailColumns: ColumnConfig<DeliveryDetail>[] = [
	{
		accessorKey: 'itemNumber',
		header: '품번',
		size: 120,
		minSize: 100,
	},
	{
		accessorKey: 'itemName',
		header: '품명',
		size: 180,
		minSize: 140,
	},
	{
		accessorKey: 'itemSpec',
		header: '제품규격',
		size: 120,
		minSize: 100,
	},
	{
		accessorKey: 'deliveryAmount',
		header: '납품수량',
		size: 100,
		minSize: 80,
		enableSummary: true,
		cell: ({ getValue }: any) => {
			const value = getValue();
			return value ? value.toLocaleString() : '';
		},
	},
	{
		accessorKey: 'deliveryUnit',
		header: '납품단위',
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
		header: '총금액',
		size: 120,
		minSize: 100,
		enableSummary: true,
		cell: ({ getValue }: any) => {
			const value = getValue();
			return value ? value.toLocaleString() : '';
		},
	},
	{
		accessorKey: 'currencyUnit',
		header: '통화단위',
		size: 100,
		minSize: 80,
	},
	{
		accessorKey: 'memo',
		header: '메모',
		size: 150,
		minSize: 120,
	},
];
