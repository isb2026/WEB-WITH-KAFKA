import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import { Package, GitBranch, Route, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import { ProductMasterPage } from '@aips/pages/master-data/product-master';
import { BomManagementPage } from '@aips/pages/master-data/bom-management';
import { ProcessRoutingPage } from '@aips/pages/master-data/process-routing';
import { DraggableDialog } from '@repo/radix-ui/components';

interface TabNavigationProps {
	activetab?: string;
}

const MasterDataTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'product'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aips/master-data/product-master')) {
			setCurrentTab('product');
		} else if (pathname.includes('/aips/master-data/bom-management')) {
			setCurrentTab('bom');
		} else if (pathname.includes('/aips/master-data/process-routing')) {
			setCurrentTab('routing');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'product',
			icon: <Package size={16} />,
			label: '제품 마스터',
			to: '/aips/master-data/product-master',
			content: <ProductMasterPage />,
		},
		{
			id: 'bom',
			icon: <GitBranch size={16} />,
			label: 'BOM 관리',
			to: '/aips/master-data/bom-management',
			content: <BomManagementPage />,
		},
		{
			id: 'routing',
			icon: <Route size={16} />,
			label: '공정 라우팅',
			to: '/aips/master-data/process-routing',
			content: <ProcessRoutingPage />,
		},
	];

	// Register button as button slot
	const RegisterButton = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => setOpenModal(true)}
				>
					<Plus size={16} />
					{t('tabs.actions.register')}
				</RadixIconButton>
			</div>
		);
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={`기준정보 ${t('tabs.actions.register')}`}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							새로운 기준정보를 등록합니다.
						</p>
						<div className="mt-4 flex justify-end gap-2">
							<RadixIconButton
								onClick={() => setOpenModal(false)}
								className="px-4 py-2 border rounded-lg"
							>
								닫기
							</RadixIconButton>
						</div>
					</div>
				}
			/>
			<TabLayout
				title="기준정보 관리"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RegisterButton />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MasterDataTabNavigation;
