import { FormField } from '@primes/components/form/DynamicFormComponent';
import { useTranslation } from '@repo/i18n';

// 외주 협력업체 등록 Form Schema (dataTable 네임스페이스 사용)
export const outsourcingVendorFormSchema = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'compName',
			label: t('columns.companyName'),
			type: 'vendorSelect',
			placeholder: t('placeholders.companyNamePlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'compType',
			label: t('columns.compType'),
			type: 'select',
			placeholder: t('placeholders.compTypePlaceholder'),
			required: true,
			disabled: false,
			options: [
				{ label: '외주가공업체', value: 'outsourcing' },
				{ label: '용접전문업체', value: 'welding' },
				{ label: '표면처리업체', value: 'surface' },
			],
		},
		{
			name: 'representative',
			label: t('columns.ceoName'),
			type: 'text',
			placeholder: t('placeholders.ceoNamePlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'manager',
			label: t('columns.contactName'),
			type: 'text',
			placeholder: t('placeholders.contactNamePlaceholder'),
			required: false,
			disabled: false,
		},
		{
			name: 'qualityGrade',
			label: '품질등급',
			type: 'select',
			placeholder: '품질등급을 선택하세요',
			required: false,
			disabled: false,
			options: [
				{ label: 'A등급', value: 'A' },
				{ label: 'B등급', value: 'B' },
				{ label: 'C등급', value: 'C' },
			],
		},
		{
			name: 'phone',
			label: t('columns.telNumber'),
			type: 'tel',
			pattern: /^\d{2,3}-\d{3,4}-\d{4}$/,
			placeholder: t('placeholders.telNumberPlaceholder'),
			required: false,
			disabled: false,
			maskAutoDetect: true,
		},
		{
			name: 'email',
			label: t('columns.compEmail'),
			type: 'email',
			placeholder: t('placeholders.compEmailPlaceholder'),
			required: false,
			disabled: false,
		},
		{
			name: 'address',
			label: t('columns.address'),
			type: 'text',
			placeholder: t('placeholders.addressPlaceholder'),
			required: false,
			disabled: false,
		},
		{
			name: 'addressDetail',
			label: t('columns.addressDetail'),
			type: 'text',
			placeholder: t('placeholders.addressDetailPlaceholder'),
			required: false,
			disabled: false,
		},
		{
			name: 'specialties',
			label: '전문분야',
			type: 'select',
			placeholder: t('placeholders.specialtiesPlaceholder'),
			required: false,
			disabled: false,
			options: [
				{ label: '정밀가공', value: 'precision' },
				{ label: '선반가공', value: 'lathe' },
				{ label: '용접', value: 'welding' },
				{ label: '제관', value: 'fabrication' },
				{ label: '코팅', value: 'coating' },
				{ label: '도장', value: 'painting' },
			],
		},
	];
};
