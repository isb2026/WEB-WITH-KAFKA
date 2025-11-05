import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import { Monitor, FileText, Activity } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import ApsKpiDashboardPage from '@aips/pages/aps/monitoring/ApsKpiDashboardPage';
import ApsWorkOrdersPage from '@aips/pages/aps/monitoring/ApsWorkOrdersPage';
import ApsMachineStatusPage from '@aips/pages/aps/monitoring/ApsMachineStatusPage';

interface TabNavigationProps {
	activetab?: string;
}

const MonitoringTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'kpi');
	const [refreshInterval, setRefreshInterval] = useState<number>(5000);
	const location = useLocation();
	const { t } = useTranslation('common');
	const { t: tMenu } = useTranslation('menu');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aps/monitoring/kpi')) {
			setCurrentTab('kpi');
		} else if (pathname.includes('/aps/monitoring/orders')) {
			setCurrentTab('orders');
		} else if (pathname.includes('/aps/monitoring/machines')) {
			setCurrentTab('machines');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'kpi',
			icon: <Activity size={16} />,
			label: tMenu('menu.aps_monitoring_dashboard'),
			to: '/aps/monitoring/kpi',
			content: <ApsKpiDashboardPage refreshInterval={refreshInterval} />,
		},
		{
			id: 'orders',
			icon: <FileText size={16} />,
			label: tMenu('menu.aps_monitoring_orders'),
			to: '/aps/monitoring/orders',
			content: <ApsWorkOrdersPage refreshInterval={refreshInterval} />,
		},
		{
			id: 'machines',
			icon: <Monitor size={16} />,
			label: tMenu('menu.aps_monitoring_machines'),
			to: '/aps/monitoring/machines',
			content: <ApsMachineStatusPage refreshInterval={refreshInterval} />,
		},
	];

	// Refresh interval selector as button slot (similar to prediction time range)
	const RefreshIntervalSelector = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				{([1000, 5000, 10000, 30000] as const).map((interval) => (
					<RadixIconButton
						key={interval}
						onClick={() => setRefreshInterval(interval)}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							refreshInterval === interval
								? 'bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						{interval === 1000
							? '1s'
							: interval === 5000
								? '5s'
								: interval === 10000
									? '10s'
									: '30s'}
					</RadixIconButton>
				))}
			</div>
		);
	};

	return (
		<>
			<TabLayout
				title="Production Monitoring"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RefreshIntervalSelector />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MonitoringTabNavigation;
