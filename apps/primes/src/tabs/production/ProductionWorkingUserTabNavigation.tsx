import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { FileText, Plus } from 'lucide-react';
import { RadixIconButton, DraggableDialog } from '@repo/radix-ui/components';
import { ProductionWorkingUserListPage } from '@primes/pages/production/working-user/ProductionWorkingUserListPage';
import { ProductionWorkingUserRegisterPage } from '@primes/pages/production/working-user/ProductionWorkingUserRegisterPage';

interface ProductionWorkingUserTabNavigationProps {
	activetab?: string;
}

const ProductionWorkingUserTabNavigation: React.FC<
	ProductionWorkingUserTabNavigationProps
> = ({ activetab }) => {
	const { t } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/production/working-user/list')) {
			setCurrentTab('list');
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <FileText size={16} />,
			label: t('tabs.labels.overallStatus'), // "현황"
			to: '/production/working-user/list',
			content: <ProductionWorkingUserListPage />,
		},
	];

	const RegisterButton = () => (
		<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
			<RadixIconButton
				className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center"
				onClick={() => setOpenModal(true)}
			>
				<Plus size={16} />
				{t('tabs.actions.register')}
			</RadixIconButton>
		</div>
	);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title="작업자 등록"
				content={
					<ProductionWorkingUserRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				}
			/>
			<TabLayout
				title={t('tabs.titles.workingUserManagement')} // "작업자 관리"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RegisterButton />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default ProductionWorkingUserTabNavigation;
