import { FormField } from '@primes/components/form/DynamicFormComponent';
import { useTranslation } from '@repo/i18n';

export const useInspectionPeriodicFormSchema = (): FormField[] => {
	const { t } = useTranslation('common');

	return [
		{
			name: 'itemName',
			label: t('pages.form.itemName'),
			type: 'text',
			placeholder: t('pages.form.itemNamePlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'inspectionCriteria',
			label: t('pages.form.inspectionCriteria'),
			type: 'text',
			placeholder: t('pages.form.inspectionCriteriaPlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'specification',
			label: t('pages.form.specification'),
			type: 'text',
			placeholder: t('pages.form.specificationPlaceholder'),
			required: false,
			disabled: false,
		},
		{
			name: 'upperLimit',
			label: t('pages.form.upperLimit'),
			type: 'text',
			placeholder: t('pages.form.upperLimitPlaceholder'),
			required: false,
			disabled: false,
		},
		{
			name: 'lowerLimit',
			label: t('pages.form.lowerLimit'),
			type: 'text',
			placeholder: t('pages.form.lowerLimitPlaceholder'),
			required: false,
			disabled: false,
		},
		{
			name: 'inspectionCount',
			label: t('pages.form.inspectionCount'),
			type: 'text',
			placeholder: t('pages.form.inspectionCountPlaceholder'),
			required: false,
			disabled: false,
		},
		{
			name: 'judgmentCriteria',
			label: t('pages.form.judgmentCriteria'),
			type: 'text',
			placeholder: t('pages.form.judgmentCriteriaPlaceholder'),
			required: false,
			disabled: false,
		},
		{
			name: 'precautions',
			label: t('pages.form.precautions'),
			type: 'textarea',
			placeholder: t('pages.form.precautionsPlaceholder'),
			required: false,
			disabled: false,
		},
		{
			name: 'inspectionEquipment',
			label: t('pages.form.inspectionEquipment'),
			type: 'text',
			placeholder: t('pages.form.inspectionEquipmentPlaceholder'),
			required: false,
			disabled: false,
		},
	];
};
