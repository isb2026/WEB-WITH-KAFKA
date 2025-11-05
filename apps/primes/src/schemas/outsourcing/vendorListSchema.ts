import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';

// 외주 협력업체 타입 정의
export interface OutsourcingVendor {
	id: number;
	compCode: string;
	compName: string;
	compType: string;
	compTypeName?: string;
	representative: string;
	manager?: string;
	phone?: string;
	email?: string;
	address?: string;
	addressDetail?: string;
	specialties: string;
	specialtiesName?: string;
	qualityGrade: string;
	isActive: boolean;
}

// 외주 협력업체 목록 컬럼 정의
export const OutsourcingVendorListColumns = (): ColumnConfig<OutsourcingVendor>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'compCode',
			header: t('columns.compCode'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'compName',
			header: t('columns.companyName'),
			size: 200,
			align: 'left',
		},
		{
			accessorKey: 'compTypeName',
			header: t('columns.compType'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'representative',
			header: t('columns.ceoName'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'manager',
			header: t('columns.contactName'),
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => any }) => getValue() || '-',
		},
		{
			accessorKey: 'phone',
			header: t('columns.telNumber'),
			size: 130,
			align: 'center',
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'email',
			header: t('columns.compEmail'),
			size: 180,
			align: 'left',
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'address',
			header: t('columns.address'),
			size: 180,
			align: 'left',
		},
		{
			accessorKey: 'addressDetail',
			header: t('columns.addressDetail'),
			size: 180,
			align: 'left',
		},
		{
			accessorKey: 'specialtiesName',
			header: '전문분야',
			size: 200,
			align: 'left',
		},
		{
			accessorKey: 'qualityGrade',
			header: '품질등급',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => string }) => {
				const grade = getValue();
				return grade ? `${grade}등급` : '-';
			},
		},
		{
			accessorKey: 'isActive',
			header: t('columns.isUse'),
			size: 80,
			align: 'center',
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? '활성' : '비활성';
			},
		},
	];
};

// 외주 협력업체 검색 필드 정의
export const OutsourcingVendorSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'vendorName',
			label: t('columns.companyName'),
			type: 'text',
			placeholder: t('columns.companyName') + '으로 검색',
			required: false,
		},
		{
			name: 'vendorCode',
			label: t('columns.compCode'),
			type: 'text',
			placeholder: t('columns.compCode') + '으로 검색',
			required: false,
		},
		{
			name: 'vendorType',
			label: t('columns.compType'),
			type: 'select',
			placeholder: t('columns.compType') + '을 선택하세요',
			required: false,
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
			placeholder: t('columns.ceoName') + '으로 검색',
			required: false,
		},
	];
};
