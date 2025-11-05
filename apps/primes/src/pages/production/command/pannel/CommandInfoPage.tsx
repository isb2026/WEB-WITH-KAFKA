import React from 'react';
import { Command } from '@primes/types/production/command';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import { useTranslation } from '@repo/i18n';

interface CommandInfoPageProps {
	command?: Command;
}

export const CommandInfoPage: React.FC<CommandInfoPageProps> = ({
	command,
}) => {
	const { t } = useTranslation('dataTable');
	const commandInfoKeys = [
		{ key: 'commandNo', label: t('columns.commandNo') },
		{ key: 'itemNumber', label: t('columns.itemNumber') },
		{ key: 'itemName', label: t('columns.itemName') },
		{ key: 'itemSpec', label: t('columns.itemSpec') },
		{ key: 'progressName', label: t('columns.progressName') },
		{ key: 'unitWeight', label: t('columns.unitWeight') },
		{ key: 'isOutsourcing', label: t('columns.isOutsourcing') },
		{ key: 'commandAmount', label: t('columns.commandAmount') },
		{ key: 'unit', label: t('columns.unit') },
		{ key: 'statusValue', label: t('columns.commandStatus') },
		{ key: 'startDate', label: t('columns.startDate') },
		{ key: 'endDate', label: t('columns.endDate') },
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
			data={command as any}
			keys={commandInfoKeys}
			systemFields={['systemInfo', 'updateInfo']}
			systemColumns="grid-cols-2"
		/>
	);
};