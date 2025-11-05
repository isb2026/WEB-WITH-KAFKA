import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';
import { useCodeFieldQuery } from '@primes/hooks/init/code/useCodeFieldQuery';
import { useOrderMasterFieldQuery } from '@primes/hooks/sales/orderMaster/useOrderMasterFieldQuery';
import { useItemFieldQuery } from '@primes/hooks/init/item/useItemFieldQuery';

export type PlanDataTableType = {
	id: number;
	accountMon: string;
	planCode: string;
	itemNo?: number;
	itemId?: number;
	planQuantity?: number;
	planType?: string;
	vendorOrderCode?: string;
	status?: string;
	itemUnit?: string;
};

// 생산 계획 등록/수정 Form Schema
export const usePlanFormSchema = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'planCode',
			label: t('columns.planCode'),
			type: 'text',
			placeholder: t('columns.planCode') + '을(를) 선택하세요',
			disabled: true,
		},
		{
			name: 'accountMon',
			label: t('columns.accountMon'),
			type: 'dateMonth',
			required: true,
			placeholder: t('columns.accountMon') + '을(를) 선택하세요',
		},
		{
			name: 'itemId',
			label: t('columns.item'),
			type: 'itemSelect',
			placeholder: t('columns.item') + '을(를) 선택하세요',
			required: true,
			displayFields: ['itemName', 'itemNumber', 'itemSpec'],
			displayTemplate: '{itemName} [{itemNumber}] - {itemSpec}',
		},
		{
			name: 'planQuantity',
			label: t('columns.planQuantity'),
			type: 'text',
			pattern: '^[0-9]+$',
			placeholder: t('columns.planQuantity') + '을(를) 입력하세요',
			required: true,
		},
		{
			name: 'planType',
			label: t('columns.planType'),
			type: 'codeSelect',
			required: false,
			fieldKey: 'PDC-002',
			placeholder: t('columns.planType') + '을(를) 선택하세요',
		},
		{
			name: 'vendorOrderCode',
			label: t('columns.vendorOrderCode'),
			type: 'orderCodeSelect',
			required: false,
			placeholder: t('columns.vendorOrderCode') + '을(를) 선택하세요',
		},
		{
			name: 'status',
			label: t('columns.planStatus'),
			type: 'codeSelect',
			required: false,
			fieldKey: 'PDC-001',
			placeholder: t('columns.planStatus') + '을(를) 선택하세요',
		},
		{
			name: 'itemUnit',
			label: t('columns.itemUnit'),
			type: 'text',
			placeholder: t('columns.itemUnit') + '을(를) 입력하세요',
			required: false,
		},
	] as FormField[];
};
// End of Selection

// 생산 계획 검색 필드
export const planSearchFields = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'accountMon',
			label: t('columns.accountMon'),
			type: 'dateMonth',
		},
		{
			name: 'planCode',
			label: t('columns.planCode'),
			type: 'text',
		},
		{
			name: 'planType',
			label: t('columns.planType'),
			type: 'text',
		},
		{
			name: 'status',
			label: t('columns.status'),
			type: 'text',
		},
		{
			name: 'vendorOrderCode',
			label: t('columns.vendorOrderCode'),
			type: 'text',
		},
	] as FormField[];
};

// 생산 계획 테이블 컬럼
export const usePlanColumns = () => {
	const { t } = useTranslation('dataTable');

	const { data: statusCodes } = useCodeFieldQuery('PDC-001');
	const { data: unitCodes } = useCodeFieldQuery('PDC-002');
	const { data: orderMasterData } = useOrderMasterFieldQuery('orderCode');
	const { data: itemData } = useItemFieldQuery('itemName');

	return [
	{
		accessorKey: 'accountMon',
		header: t('columns.accountMon'),
		size: 150,
		align: 'center',
	},
	{
		accessorKey: 'planCode',
		header: t('columns.planCode'),
		size: 120,
		align: 'center',
	},
	{
		accessorKey: 'itemName',
		header: t('columns.itemName'),
		size: 100,
		align: 'center',
	},
	{
		accessorKey: 'itemNumber',
		header: t('columns.itemNumber'),
		size: 100,
		align: 'center',
	},
	{
		accessorKey: 'itemSpec',
		header: t('columns.itemSpec'),
		size: 100,
		align: 'center',
	},
	{
		accessorKey: 'planQuantity',
		header: t('columns.planQuantity'),
		size: 100,
		align: 'right',
		cell: ({ getValue }: { getValue: () => number | null }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'planTypeValue',
		header: t('columns.planType'),
		size: 150,
		align: 'center',
		cell: ({ getValue }: { getValue: () => string | null }) => {
			const value = getValue();
			if (!value) return '-';
			
			const unitCode = unitCodes?.find((code: any) => code.codeValue === value);
			return unitCode?.codeName || value;
		},
	},
	{
		accessorKey: 'vendorOrderCode',
		header: t('columns.vendorOrderCode'),
		size: 120,
		align: 'center',
		cell: ({ getValue }: { getValue: () => string | null }) => {
			const value = getValue();
			const orderMaster = orderMasterData?.find((order: any) => order.id.toString() === value);
			return orderMaster?.value || value || '-';
		},
	},
	{
		accessorKey: 'statusValue',
		header: t('columns.planStatus'),
		size: 150,
		align: 'center',
		cell: ({ getValue }: { getValue: () => string | null }) => {
			const value = getValue();
			if (!value) return '-';

			const statusCode = statusCodes?.find((code: any) => code.codeValue === value);
			return statusCode?.codeName || value;
		},
	},
	{
		accessorKey: 'itemUnit',
		header: t('columns.itemUnit'),
		size: 150,
		align: 'center',
	},
	] as ColumnConfig<PlanDataTableType>[];
};
