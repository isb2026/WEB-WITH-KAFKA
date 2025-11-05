import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, TableProperties } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { MachineMachinePartRelationListPage } from '@primes/pages/machine/machine-part-relation/MachineMachinePartRelationListPage'
import { MachineMachinePartRelationRegisterPage } from '@primes/pages/machine/machine-part-relation/MachineMachinePartRelationRegisterPage'
import { useTranslation } from '@repo/i18n';
import type { MachinePartRelation } from '@primes/types/machine';

interface TabNavigationProps {
	activetab?: string;
}

const MachinePartRelationTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [editMode, setEditMode] = useState<'create' | 'edit'>('create');
	const [editingItem, setEditingItem] = useState<MachinePartRelation | null>(null);
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/machine/machine-part-relation/list')) {
			setCurrentTab('list');
		}
	}, [location.pathname]);

	// Modal 관련 핸들러
	const handleOpenRegisterModal = () => {
		setEditMode('create');
		setEditingItem(null);
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setEditingItem(null);
	};

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <TableProperties size={16} />,
			label: t('tabs.titles.machinePartRelation'),
			to: '/machine/machine-part-relation/list',
			content: <MachineMachinePartRelationListPage />,
		},
	];

	const RegisterButton = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={handleOpenRegisterModal}
				>
					<Plus size={16} />
					{t('tabs.actions.register') || '설비 부품 관계 등록'}
				</RadixIconButton>
			</div>
		);
	};

	const SetActionButton = (tab: string) => {
		switch (tab) {
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
					editMode === 'edit'
						? t('pages.machinePartRelation.edit') 
						: t('pages.machinePartRelation.register')
				}
				content={
					<MachineMachinePartRelationRegisterPage
						mode={editMode === 'edit' ? 'update' : 'create'}
						selectedMachinePartRelation={editingItem}
						onClose={handleCloseModal}
					/>
				}
			/>
			<TabLayout
				title={t('tabs.titles.machinePartRelation')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MachinePartRelationTabNavigation;
