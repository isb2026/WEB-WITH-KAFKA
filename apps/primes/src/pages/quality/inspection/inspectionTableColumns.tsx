import { useMemo } from 'react';
import { useTranslation } from '@repo/i18n';

export const useInspectionTableColumns = () => {
	const { t } = useTranslation('dataTable');

	return useMemo(() => [
		{
			accessorKey: 'checkingName',
			header: t('columns.checkingName'),
			size: 150,
		},
		{
			accessorKey: 'standard',
			header: t('columns.checkStandard'),
			size: 150,
		},
		{
			accessorKey: 'standardUnit',
			header: t('columns.standardUnit'),
			size: 120,
		},
		{
			accessorKey: 'maxValue',
			header: t('columns.upperLimit'),
			size: 80,
			cell: ({ row }: { row: any }) => {
				return <div>{row.original.meta?.maxValue || '-'}</div>;
			},
		},
		{
			accessorKey: 'minValue',
			header: t('columns.lowerLimit'),
			size: 80,
			cell: ({ row }: { row: any }) => {
				return <div>{row.original.meta?.minValue || '-'}</div>;
			},
		},
		{
			accessorKey: 'tolerance',
			header: t('columns.tolerance'),
			size: 80,
			cell: ({ row }: { row: any }) => {
				return <div>{row.original.meta?.tolerance || '-'}</div>;
			},
		},
		{
			accessorKey: 'sampleQuantity',
			header: t('columns.sampleQuantity'),
			size: 80,
		},
		{
			accessorKey: 'checkPeriod',
			header: t('columns.checkPeriod'),
			size: 150,
		},
		{
			accessorKey: 'referenceNote',
			header: t('columns.precautions'),
			size: 150,
			cell: ({ row }: { row: any }) => {
				return <div>{row.original.meta?.referenceNote || '-'}</div>;
			},
		},
	], [t]);
}; 