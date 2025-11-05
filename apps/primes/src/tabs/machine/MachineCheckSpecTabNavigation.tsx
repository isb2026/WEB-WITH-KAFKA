import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, TableProperties } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { MachineMachineCheckSpecListPage } from '@primes/pages/machine/machine-check-spec/MachineMachineCheckSpecListPage';
import { MachineMachineCheckSpecRegisterPage } from '@primes/pages/machine/machine-check-spec/MachineMachineCheckSpecRegisterPage';
import { useTranslation } from '@repo/i18n';
import type { MachineCheckSpec } from '@primes/types/machine/machineCheckSpec';

interface TabNavigationProps {
	activetab?: string;
}

const MachineCheckSpecTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [editMode, setEditMode] = useState<'create' | 'edit'>('create');
	const [editingItem, setEditingItem] = useState<MachineCheckSpec | null>(
		null
	);
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/machine/machine-check-spec/list')) {
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
			label: t('tabs.labels.list') || '현황',
			to: '/machine/machine-check-spec/list',
			content: <MachineMachineCheckSpecListPage />,
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
					{t('tabs.actions.register') || '등록'}
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
						? t('tabs.dialogs.edit') || '기계 검사 기준 수정'
						: t('tabs.dialogs.register') || '기계 검사 기준 등록'
				}
				content={
					<MachineMachineCheckSpecRegisterPage
						mode={editMode}
						data={editingItem || undefined}
						onClose={handleCloseModal}
					/>
				}
			/>
			<TabLayout
				title={
					t('tabs.titles.machineCheckSpecManagement') ||
					'기계 검사 기준 관리'
				}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MachineCheckSpecTabNavigation;
