import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { Table, FileText, Plus, Package, BarChart3 } from 'lucide-react';
import { RadixIconButton, DraggableDialog } from '@radix-ui/components';

// Page imports
import { ProductionWorkingMasterDetailPage } from '@primes/pages/production/working/ProductionWorkingMasterDetailPage';
import { ProductionWorkingListPage } from '@primes/pages/production/working/ProductionWorkingListPage';
import { ProductionCommandLotStatusPage } from '@primes/pages/production/command/ProductionCommandLotStatusPage';
import { ProductionWorkingAnalysisPage } from '@primes/pages/production/working/ProductionWorkingAnalysisPage';
import { ProductionWorkingMasterForm } from '@primes/pages/production/working/ProductionWorkingMasterForm';

interface ProductionWorkingTabNavigationProps {
	activetab?: string;
}

const ProductionWorkingTabNavigation: React.FC<
	ProductionWorkingTabNavigationProps
> = ({ activetab }) => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'related-list'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [editMode, setEditMode] = useState<'create' | 'update'>('create');
	const [editingItem, setEditingItem] = useState<any>(null);
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/production/working/related-list')) {
			setCurrentTab('related-list');
		} else if (pathname.includes('/production/working/list')) {
			setCurrentTab('list');
		} else if (pathname.includes('/production/working/analysis')) {
			setCurrentTab('analysis');
		} else if (pathname.includes('/production/command/lot-status')) {
			setCurrentTab('lot-status');
		}
	}, [location.pathname]);

	const handleOpenEditModal = (item: any) => {
		setEditMode('update');
		setEditingItem(item);
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setEditingItem(null);
	};

	const tabs: TabItem[] = [
		{
			id: 'related-list',
			icon: <Table size={16} />,
			label: t('tabs.labels.productionDetailList'),
			to: '/production/working/related-list',
			content: <ProductionWorkingMasterDetailPage onEditClick={handleOpenEditModal} />,
		},
		{
			id: 'list',
			icon: <FileText size={16} />,
			label: t('tabs.labels.productionOverallStatus'),
			to: '/production/working/list',
			content: <ProductionWorkingListPage />,
		},
		{
			id: 'lot-status',
			icon: <Package size={16} />,
			label: t('tabs.labels.productionLotStatus'),
			to: '/production/command/lot-status',
			content: <ProductionCommandLotStatusPage />,
		},
		{
			id: 'analysis',
			icon: <BarChart3 size={16} />,
			label: t('tabs.labels.productionAnalysis'),
			to: '/production/working/analysis',
			content: <ProductionWorkingAnalysisPage />,
		},
	];

	const RegisterButton = () => {
		const navigate = useNavigate();

		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => navigate('/production/working/register')}
				>
					<Plus size={16} />
					{t('tabs.actions.productionRegister')}
				</RadixIconButton>
			</div>
		);
	};

	const SetActionButton = (tab: string) => {
		switch (tab) {
			case 'analysis':
			case 'lot-status':
				return null; // 분석 및 로트현황 탭에서는 등록 버튼 비활성화
			default:
				return <RegisterButton />;
		}
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={`${t('pages.titles.workingMaster')} ${t('edit')}`}
				content={
					<ProductionWorkingMasterForm
						mode="update"
						onClose={handleCloseModal}
						masterData={editingItem}
					/>
				}
			/>

			<TabLayout
				title={t('tabs.titles.productionPerformance')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default ProductionWorkingTabNavigation;
