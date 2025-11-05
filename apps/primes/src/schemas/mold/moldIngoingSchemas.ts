import { ColumnConfig } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { MoldOrderIngoingDto } from '@primes/types/mold';

// Data table columns configuration with translations
export const useMoldIngoingColumns = (): ColumnConfig<MoldOrderIngoingDto>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'accountMonth',
			header: t('columns.accountMonth'),
			size: 120,
		},
		{
			accessorKey: 'inDate',
			header: t('columns.inDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'inMonth',
			header: t('columns.inMonth'),
			size: 120,
		},
		{
			accessorKey: 'inNum',
			header: t('columns.inNum'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'inPrice',
			header: t('columns.inPrice'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'inAmount',
			header: t('columns.inAmount'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'isDev',
			header: t('columns.isDev'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '개발' : '양산';
			},
		},
		{
			accessorKey: 'isChange',
			header: t('columns.isChange'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '설변' : '일반';
			},
		},
		{
			accessorKey: 'auditBy',
			header: t('columns.auditBy'),
			size: 120,
		},
		{
			accessorKey: 'auditDate',
			header: t('columns.auditDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'isPass',
			header: t('columns.isPass'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '합격' : '불합격';
			},
		},
		{
			accessorKey: 'isUse',
			header: t('columns.isUse'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '사용' : '미사용';
			},
		},
		{
			accessorKey: 'createdBy',
			header: t('columns.createdBy'),
			size: 120,
		},
		{
			accessorKey: 'createdAt',
			header: t('columns.createdAt'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
	];
};
