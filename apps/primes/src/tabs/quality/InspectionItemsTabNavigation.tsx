import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useLocation } from 'react-router-dom';
import {
	RotateCcw,
	Zap,
	Package,
	Truck,
	CheckCircle,
	Wrench,
	Calendar,
	Search,
} from 'lucide-react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';

// Instpection
import QualityInspectionItemsPatrolPage from '@primes/pages/quality/inspection/QualityInspectionItemsPatrolPage';
import QualityInspectionItemsSelfPage from '@primes/pages/quality/inspection/QualityInspectionItemsSelfPage';
import QualityInspectionItemsIncomingPage from '@primes/pages/quality/inspection/QualityInspectionItemsIncomingPage';
import QualityInspectionItemsOutgoingPage from '@primes/pages/quality/inspection/QualityInspectionItemsOutgoingPage';
import QualityInspectionItemsFinalPage from '@primes/pages/quality/inspection/QualityInspectionItemsFinalPage';
import QualityInspectionItemsPeriodicPage from '@primes/pages/quality/inspection/QualityInspectionItemsPeriodicPage';
import QualityInspectionItemsPrecisionPage from '@primes/pages/quality/inspection/QualityInspectionItemsPrecisionPage';
import QualityInspectionItemsMachinePage from '@primes/pages/quality/inspection/QualityInspectionItemsMachinePage';

interface TabNavigationProps {
	activetab?: string;
}

const InspectionItemsTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'patrol');
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/quality/inspection-items/patrol')) {
			setCurrentTab('patrol');
		} else if (pathname.includes('/quality/inspection-items/self')) {
			setCurrentTab('self');
		} else if (pathname.includes('/quality/inspection-items/incoming')) {
			setCurrentTab('incoming');
		} else if (pathname.includes('/quality/inspection-items/outgoing')) {
			setCurrentTab('outgoing');
		} else if (pathname.includes('/quality/inspection-items/final')) {
			setCurrentTab('final');
		} else if (pathname.includes('/quality/inspection-items/machine')) {
			setCurrentTab('machine');
		} else if (pathname.includes('/quality/inspection-items/periodic')) {
			setCurrentTab('periodic');
		} else if (pathname.includes('/quality/inspection-items/precision')) {
			setCurrentTab('precision');
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'patrol',
			icon: <RotateCcw size={16} />,
			label: t('tabs.labels.patrol'),
			to: '/quality/inspection-items/patrol',
			content: <QualityInspectionItemsPatrolPage />,
		},
		{
			id: 'self',
			icon: <Zap size={16} />,
			label: t('tabs.labels.self'),
			to: '/quality/inspection-items/self',
			content: <QualityInspectionItemsSelfPage />,
		},
		{
			id: 'incoming',
			icon: <Package size={16} />,
			label: t('tabs.labels.incoming'),
			to: '/quality/inspection-items/incoming',
			content: <QualityInspectionItemsIncomingPage />,
		},
		{
			id: 'outgoing',
			icon: <Truck size={16} />,
			label: t('tabs.labels.outgoing'),
			to: '/quality/inspection-items/outgoing',
			content: <QualityInspectionItemsOutgoingPage />,
		},
		{
			id: 'final',
			icon: <CheckCircle size={16} />,
			label: t('tabs.labels.final'),
			to: '/quality/inspection-items/final',
			content: <QualityInspectionItemsFinalPage />,
		},
		{
			id: 'machine',
			icon: <Wrench size={16} />,
			label: t('tabs.labels.machine'),
			to: '/quality/inspection-items/machine',
			content: <QualityInspectionItemsMachinePage />,
		},
		{
			id: 'periodic',
			icon: <Calendar size={16} />,
			label: t('tabs.labels.periodic'),
			to: '/quality/inspection-items/periodic',
			content: <QualityInspectionItemsPeriodicPage />,
		},
		{
			id: 'precision',
			icon: <Search size={16} />,
			label: t('tabs.labels.precision'),
			to: '/quality/inspection-items/precision',
			content: <QualityInspectionItemsPrecisionPage />,
		},
	];

	return (
		<TabLayout
			title={t('tabs.titles.inspectionItems')}
			tabs={tabs}
			defaultValue={currentTab}
			onValueChange={setCurrentTab}
		/>
	);
};

export default InspectionItemsTabNavigation;
