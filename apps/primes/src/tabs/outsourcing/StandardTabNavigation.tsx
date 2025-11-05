import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useLocation, useNavigate } from 'react-router-dom';
import { TabItem } from '@primes/templates/TabTemplate';
import TabLayout from '@primes/layouts/TabLayout';
import { OutsourcingVendorsListPage } from '@primes/pages/outsourcing/standard/OutsourcingVendorsListPage';
import { OutsourcingProcessListPage } from '@primes/pages/outsourcing/standard/OutsourcingProcessListPage';
import { Building2, DollarSign, Plus } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { OutsourcingVendorRegisterPage } from '@primes/pages/outsourcing/standard/OutsourcingVendorRegisterPage';
import { OutsourcingProcessRegisterPage } from '@primes/pages/outsourcing/standard/OutsourcingProcessRegisterPage';

interface StandardTabNavigationProps {
	activetab?: string;
}

const StandardTabNavigation: React.FC<StandardTabNavigationProps> = ({
	activetab,
}) => {
	const { t: tCommon } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'vendors'
	);
	const [openRegisterModal, setOpenRegisterModal] = useState<boolean>(false);
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/outsourcing/standard/vendors')) {
			setCurrentTab('vendors');
		} else if (pathname.includes('/outsourcing/standard/process')) {
			setCurrentTab('process-price');
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'vendors',
			icon: <Building2 size={16} />,
			label: tCommon('tabs.labels.outsourcingVendors'),
			to: '/outsourcing/standard/vendors/list',
			content: <OutsourcingVendorsListPage />,
		},
		{
			id: 'process-price',
			icon: <DollarSign size={16} />,
			label: tCommon('tabs.labels.outsourcingProcessPrice'),
			to: '/outsourcing/standard/process/list',
			content: <OutsourcingProcessListPage />,
		},
	];

	// 등록 버튼 컴포넌트
	const RegisterButton = () => {
		const handleRegister = () => {
			setOpenRegisterModal(true);
		};

		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={handleRegister}
				>
					<Plus size={16} />
					{tCommon('pages.outsourcing.register')}
				</RadixIconButton>
			</div>
		);
	};

	// 등록 모달 컨텐츠
	const getRegisterModalContent = () => {
		const handleSuccess = () => {
			setOpenRegisterModal(false);
			// TODO: 목록 새로고침 로직 추가
		};

		const handleClose = () => {
			setOpenRegisterModal(false);
		};

		switch (currentTab) {
			case 'vendors':
				return (
					<OutsourcingVendorRegisterPage
						onClose={handleClose}
						onSuccess={handleSuccess}
					/>
				);
			case 'process-price':
				return (
					<OutsourcingProcessRegisterPage
						onClose={handleClose}
						onSuccess={handleSuccess}
					/>
				);
			default:
				return <div>협력업체 등록</div>;
		}
	};

	const getModalTitle = () => {
		switch (currentTab) {
			case 'vendors':
				return '협력업체 등록';
			case 'process-price':
				return '제품공정별 단가 등록';
			default:
				return '등록';
		}
	};

	return (
		<>
			<DraggableDialog
				open={openRegisterModal}
				onOpenChange={setOpenRegisterModal}
				title={getModalTitle()}
				content={getRegisterModalContent()}
			/>
			
			<TabLayout
				title={tCommon('tabs.titles.outsourcingStandard')}
				tabs={tabs}
				defaultValue={currentTab}
				onValueChange={setCurrentTab}
				buttonSlot={<RegisterButton />}
			/>
		</>
	);
};

export default StandardTabNavigation;
