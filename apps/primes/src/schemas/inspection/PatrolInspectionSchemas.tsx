import { FormField } from '@primes/components/form/DynamicFormComponent';
import { useTranslation } from '@repo/i18n';

export const useInspectionPatrolFormSchema = (): FormField[] => {
	const { t } = useTranslation('common');

	return [

		{
			name: 'checkingName',
			label: t('pages.form.checkingName'),
			type: 'text',
			placeholder: t('pages.form.checkingNamePlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'orderNo',
			label: t('pages.form.orderNo'),
			type: 'number',
			placeholder: t('pages.form.orderNoPlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'standard',
			label: t('pages.form.standard'),
			type: 'number',
			placeholder: t('pages.form.standardPlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'standardUnit',
			label: t('pages.form.standardUnit'),
			type: 'select',
			placeholder: t('pages.form.standardUnitPlaceholder'),
			required: false,
			disabled: false,
			options: [
				{ value: 'mm', label: '밀리미터' },
				{ value: 'cm', label: '센티미터' },
				{ value: 'm', label: '미터' },
				{ value: 'kg', label: '킬로그램' },
				{ value: 'g', label: '그램' },
				{ value: '°C', label: '섭씨' },
				{ value: '°F', label: '화씨' },
				{ value: 'pcs', label: '개수' },
				{ value: '%', label: '퍼센트' }
			]
		},
		{
			name: 'checkPeriod',
			label: t('pages.form.checkPeriod'),
			type: 'select',
			placeholder: t('pages.form.checkPeriodPlaceholder'),
			required: false,
			disabled: false,
			options: [
				{ value: 'DAILY', label: '일간' },
				{ value: 'WEEKLY', label: '주간' },
				{ value: 'MONTHLY', label: '월간' },
				{ value: 'QUARTERLY', label: '분기' },
				{ value: 'YEARLY', label: '연간' },
				{ value: 'ON_DEMAND', label: '수시' }
			]
		},
		{
			name: 'sampleQuantity',
			label: t('pages.form.sampleQuantity'),
			type: 'number',
			placeholder: t('pages.form.sampleQuantityPlaceholder'),
			required: true,
			disabled: false,
			defaultValue: 1,
		},
		{
			name: 'checkingFormulaId',
			label: t('pages.form.checkingFormulaId'),
			type: 'number',
			placeholder: t('pages.form.checkingFormulaIdPlaceholder'),
			required: false,
			disabled: false,
		},
	];
};
