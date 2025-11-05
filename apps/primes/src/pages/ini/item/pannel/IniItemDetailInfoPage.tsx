import React from 'react';
import { Item } from '@primes/types/item';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import { useTranslation } from '@repo/i18n';

interface IniItemDetailInfoPageProps {
	item?: Item;
}

export const IniItemDetailInfoPage: React.FC<IniItemDetailInfoPageProps> = ({
	item,
}) => {
	const { t } = useTranslation('dataTable');
	const itemInfoKeys = [
		{ key: 'itemNumber', label: t('columns.itemNumber') },
		{ key: 'itemName', label: t('columns.itemName') },
		{ key: 'itemSpec', label: t('columns.itemSpec') },
		{ key: 'itemModel', label: t('columns.itemModel') },
		{ key: 'itemType1Value', label: t('columns.itemType1') },
		{ key: 'itemType2Value', label: t('columns.itemType2') },
		{ key: 'itemType3Value', label: t('columns.itemType3') },
		{ key: 'itemUnit', label: t('columns.itemUnit') },
		{ key: 'lotSizeValue', label: t('columns.lotSize') },
		{ key: 'optimalInventoryQty', label: t('columns.optimalInventoryQty') },
		{ key: 'safetyInventoryQty', label: t('columns.safetyInventoryQty') },
		{ key: 'isUse', label: t('columns.isUse') },
		{
			key: 'systemInfo',
			label: t('columns.registerInfo'),
			template: '[{createdBy}] {createdAt}',
		},
		{
			key: 'updateInfo',
			label: t('columns.updateInfo'),
			template: '[{updatedBy}] {updatedAt}',
		},
	];
	return (
		<InfoGrid
			columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
			classNames={{
				container: 'rounded shadow-sm h-full',
				item: 'flex gap-2 items-center p-2',
				label: 'text-gray-700 text-sm',
				value: 'font-bold text-xs',
			}}
			maxHeight="100%"
			data={item as any}
			keys={itemInfoKeys}
			systemFields={['systemInfo', 'updateInfo']}
			systemColumns="grid-cols-2"
		/>
	);
};
