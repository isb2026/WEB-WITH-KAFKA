import React from 'react';
import { TabTemplate } from '@primes/templates';
import { useTranslation } from '@repo/i18n';
import { OutsourcingProcessListPage } from '@primes/pages/outsourcing/standard/OutsourcingProcessListPage';

interface OutsourcingProcessTabNavigationProps {
	activetab?: string;
}

const OutsourcingProcessTabNavigation: React.FC<
	OutsourcingProcessTabNavigationProps
> = ({ activetab = 'list' }) => {
	const { t } = useTranslation('menu');

	const tabs = [
		{
			id: 'list',
			label: t('outsourcing_process_price'),
			content: <OutsourcingProcessListPage />,
		},
	];

	return (
		<TabTemplate
			tabs={tabs}
			defaultValue={activetab}
		/>
	);
};

export default OutsourcingProcessTabNavigation;