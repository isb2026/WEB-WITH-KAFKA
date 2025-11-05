import React from 'react';

import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';
import { ItemDto } from '@primes/types/item';

export const InspectionItemPatrolColumns = (): ColumnConfig<ItemDto>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'itemName',
			header: t('columns.itemName'),
			size: 180,
		},
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 120,
		},
		{
			accessorKey: 'itemSpec',
			header: t('columns.itemSpec'),
			size: 150,
		},
	];
};
