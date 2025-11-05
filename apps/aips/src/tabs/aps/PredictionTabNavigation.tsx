import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import { TrendingUp, BarChart3, Package, Activity } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import ApsPredictionStatusPage from '@aips/pages/aps/prediction/ApsPredictionStatusPage';
import ApsDemandForecastPage from '@aips/pages/aps/prediction/ApsDemandForecastPage';
import ApsCapacityForecastPage from '@aips/pages/aps/prediction/ApsCapacityForecastPage';
import ApsInventoryProjectionPage from '@aips/pages/aps/prediction/ApsInventoryProjectionPage';

interface TabNavigationProps {
	activetab?: string;
}

const PredictionTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'status');
	const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
	const location = useLocation();
	const { t } = useTranslation('common');
	const { t: tMenu } = useTranslation('menu');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aps/prediction/status')) {
			setCurrentTab('status');
		} else if (pathname.includes('/aps/prediction/demand')) {
			setCurrentTab('demand');
		} else if (pathname.includes('/aps/prediction/capacity')) {
			setCurrentTab('capacity');
		} else if (pathname.includes('/aps/prediction/inventory')) {
			setCurrentTab('inventory');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'status',
			icon: <Activity size={16} />,
			label: tMenu('menu.aps_prediction_status'),
			to: '/aps/prediction/status',
			content: <ApsPredictionStatusPage timeRange={timeRange} />,
		},
		{
			id: 'demand',
			icon: <TrendingUp size={16} />,
			label: tMenu('menu.aps_prediction_demand'),
			to: '/aps/prediction/demand',
			content: <ApsDemandForecastPage timeRange={timeRange} />,
		},
		{
			id: 'capacity',
			icon: <BarChart3 size={16} />,
			label: tMenu('menu.aps_prediction_capacity'),
			to: '/aps/prediction/capacity',
			content: <ApsCapacityForecastPage timeRange={timeRange} />,
		},
		{
			id: 'inventory',
			icon: <Package size={16} />,
			label: tMenu('menu.aps_prediction_inventory'),
			to: '/aps/prediction/inventory',
			content: <ApsInventoryProjectionPage timeRange={timeRange} />,
		},
	];

	// Time range selector as button slot
	const TimeRangeSelector = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				{(['7d', '30d', '90d'] as const).map((range) => (
					<RadixIconButton
						key={range}
						onClick={() => setTimeRange(range)}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							timeRange === range
								? 'bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						{range === '7d'
							? '7 Days'
							: range === '30d'
								? '30 Days'
								: '90 Days'}
					</RadixIconButton>
				))}
			</div>
		);
	};

	return (
		<>
			<TabLayout
				title={t('tabs.titles.predictionManagement')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<TimeRangeSelector />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default PredictionTabNavigation;
