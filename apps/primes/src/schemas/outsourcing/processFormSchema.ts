import { FormField } from '@primes/components/form/DynamicFormComponent';
import { useTranslation } from '@repo/i18n';

// 외주 제품공정별 단가 등록 Form Schema (dataTable 네임스페이스 사용)
export const outsourcingProcessFormSchema = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'itemId',
			label: t('columns.itemName'),
			type: 'itemSelect',
			placeholder: '제품을 선택하세요',
			required: true,
			disabled: false,
		},
		{
			name: 'processId',
			label: t('columns.processName'),
			type: 'processSelect',
			placeholder: '공정을 선택하세요',
			required: true,
			disabled: false,
		},
		{
			name: 'vendorName',
			label: t('columns.compName'),
			type: 'vendorSelect',
			placeholder: '협력업체를 선택하세요',
			required: true,
			disabled: false,
		},
		{
			name: 'unitPrice',
			label: t('columns.unitPrice'),
			type: 'number',
			placeholder: t('placeholders.unitPricePlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'unit',
			label: t('columns.itemUnit'),
			type: 'select',
			placeholder: t('placeholders.itemUnitPlaceholder'),
			required: true,
			disabled: false,
			defaultValue: 'EA',
			options: [
				{ label: 'EA', value: 'EA' },
				{ label: 'SET', value: 'SET' },
				{ label: 'KG', value: 'KG' },
				{ label: 'M', value: 'M' },
			],
		},
		{
			name: 'leadTime',
			label: '리드타임 (일)',
			type: 'text',
			pattern: /^\d+$/,
			placeholder: '리드타임을 입력하세요',
			required: false,
			disabled: false,
		},
		{
			name: 'minOrderQty',
			label: '최소주문량',
			type: 'text',
			pattern: /^\d+$/,
			placeholder: '최소주문량을 입력하세요',
			required: false,
			disabled: false,
		},
		{
			name: 'memo',
			label: t('columns.memo'),
			type: 'textarea',
			placeholder: t('placeholders.memoPlaceholder'),
			required: false,
			disabled: false,
			rows: 3,
		},
	];
};
