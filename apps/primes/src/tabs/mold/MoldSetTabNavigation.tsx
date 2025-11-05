import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, List } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import MoldSetRelatedListPage from '@primes/pages/mold/mold-set/MoldSetRelatedListPage';
import { MoldSetMasterDto } from '@primes/types/mold';

interface TabNavigationProps {
	activetab?: string;
}

const MoldSetTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const { t: tCommon } = useTranslation('common');
	const { t } = useTranslation('dataTable');
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'related-list'
	);

	const location = useLocation();

	// 수정 핸들러
	const handleEditClick = (item: MoldSetMasterDto) => {
		navigate('/mold/set/register', { 
			state: { 
				editMode: true, 
				editData: item 
			} 
		});
	};

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/mold/set/related-list')) {
			setCurrentTab('related-list');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'related-list',
			icon: <List size={16} />,
			label: '제품별 금형 SET 목록',
			to: '/mold/set/related-list',
			content: <MoldSetRelatedListPage onEditClick={handleEditClick} />,
		},
	];

	const RegisteButton = () => {
		const navigate = useNavigate();

		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => navigate('/mold/set/register')}
				>
					<Plus size={16} />
					{t('tabs.register')}
				</RadixIconButton>
			</div>
		);
	};

	const SetActionButton = (tab: string) => {
		switch (tab) {
			default:
				return <RegisteButton />;
		}
	};

	return (
		<>
			<TabLayout
				title="금형 SET 관리"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MoldSetTabNavigation;
