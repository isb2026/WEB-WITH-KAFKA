import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { Table, FileText, Plus, Package, BarChart3, Truck } from 'lucide-react';
import { RadixIconButton, DraggableDialog } from '@repo/radix-ui/components';

// Register Page imports
import { ProductionMaterialOutgoingRegisterPage } from '@primes/pages/production/material-outgoing/ProductionMaterialOutgoingRegisterPage';
import { ProductionMaterialRequestRegisterPage } from '@primes/pages/production/material-request/ProductionMaterialRequestRegisterPage';

// Page imports
import { ProductionMaterialOutgoingListPage } from '@primes/pages/production/material-outgoing/ProductionMaterialOutgoingListPage';
import { ProductionMaterialRequestListPage } from '@primes/pages/production/material-request/ProductionMaterialRequestListPage';
import { ProductionMaterialAnalysisPage } from '@primes/pages/production/material/ProductionMaterialAnalysisPage';

interface MaterialManagementTabNavigationProps {
	activetab?: string;
}

const MaterialManagementTabNavigation: React.FC<
	MaterialManagementTabNavigationProps
> = ({ activetab }) => {
	const { t } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'request'
	);
	const [openModal, setOpenModal] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/production/material/outgoing/outgoing-list')) {
			setCurrentTab('outgoing');
		} else if (pathname.includes('/production/material/request/request-list')) {
			setCurrentTab('request');
		} else if (pathname.includes('/production/material/analysis')) {
			setCurrentTab('analysis');
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'request',
			icon: <Package size={16} />,
			label: t('tabs.labels.materialInputRequest'),
			to: '/production/material/request/request-list',
			content: <ProductionMaterialRequestListPage />,
		},
		{
			id: 'outgoing',
			icon: <Truck size={16} />,
			label: t('tabs.labels.materialOutgoing'),
			to: '/production/material/outgoing/outgoing-list',
			content: <ProductionMaterialOutgoingListPage />,
		},
		{
			id: 'analysis',
			icon: <BarChart3 size={16} />,
			label: t('tabs.labels.materialAnalysis'),
			to: '/production/material/analysis',
			content: <ProductionMaterialAnalysisPage />,
		},
	];

	const RegisterButton = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() =>
						currentTab === 'outgoing'
							? navigate('/production/material/outgoing/register')
							: currentTab === 'request'
								? setOpenModal(true)
								: null
					}
				>
					<Plus size={16} />
					{currentTab === 'outgoing'
						? t('tabs.actions.materialOutgoingRegister')
						: currentTab === 'request'
							? t('tabs.actions.materialRequestRegister')
							: t('tabs.actions.register')}
				</RadixIconButton>
			</div>
		);
	};

	const SetActionButton = (tab: string) => {
		switch (tab) {
			case 'analysis':
				return null; // 분석 탭에서는 등록 버튼 비활성화
			default:
				return <RegisterButton />;
		}
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={
					currentTab === 'outgoing'
						? t('tabs.dialogs.materialOutgoingRegister')
						: currentTab === 'request'
							? t('tabs.dialogs.materialRequestRegister')
							: t('tabs.dialogs.register')
				}
				content={
					<ProductionMaterialRequestRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				}
			/>
			<TabLayout
				title={t('tabs.titles.materialManagement')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MaterialManagementTabNavigation;
