import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import {
	Database,
	Download,
	Upload,
	Users,
	Shield,
	FileText,
	Search,
	Filter,
	Settings,
	Save,
	RefreshCw,
	AlertTriangle,
	CheckCircle,
	XCircle,
	Plus,
	Key,
	Eye,
	EyeOff,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import { MasterDataValidationPage } from '@aips/pages/system-admin/master-data-validation';
import { DataBackupRestorePage } from '@aips/pages/system-admin/data-backup-restore';
import { UserAccessManagementPage } from '@aips/pages/system-admin/user-access-management';
import { LogManagementPage } from '@aips/pages/system-admin/log-management';
import { EnvironmentSettingsPage } from '@aips/pages/system-admin/environment-settings';
import { DraggableDialog } from '@repo/radix-ui/components';

interface TabNavigationProps {
	activetab?: string;
}

const SystemAdminTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'master-data-validation'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aips/system-admin/master-data-validation')) {
			setCurrentTab('master-data-validation');
		} else if (
			pathname.includes('/aips/system-admin/data-backup-restore')
		) {
			setCurrentTab('data-backup-restore');
		} else if (
			pathname.includes('/aips/system-admin/user-permission-management')
		) {
			setCurrentTab('user-permission-management');
		} else if (pathname.includes('/aips/system-admin/log-management')) {
			setCurrentTab('log-management');
		} else if (
			pathname.includes('/aips/system-admin/environment-settings')
		) {
			setCurrentTab('environment-settings');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'master-data-validation',
			icon: <Database size={16} />,
			label: 'Master Data Validation',
			to: '/aips/system-admin/master-data-validation',
			content: <MasterDataValidationPage />,
		},
		{
			id: 'data-backup-restore',
			icon: <Download size={16} />,
			label: 'Data Backup/Restore',
			to: '/aips/system-admin/data-backup-restore',
			content: <DataBackupRestorePage />,
		},
		{
			id: 'user-permission-management',
			icon: <Users size={16} />,
			label: 'User Access Management',
			to: '/aips/system-admin/user-permission-management',
			content: <UserAccessManagementPage />,
		},
		{
			id: 'log-management',
			icon: <FileText size={16} />,
			label: 'Log Management',
			to: '/aips/system-admin/log-management',
			content: <LogManagementPage />,
		},
		{
			id: 'environment-settings',
			icon: <Settings size={16} />,
			label: 'Environment Settings',
			to: '/aips/system-admin/environment-settings',
			content: <EnvironmentSettingsPage />,
		},
	];

	// Register button as button slot
	const RegisterButton = () => {
		let extraButtons = null;

		switch (currentTab) {
			case 'master-data-validation':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Database size={16} />
							Validation Report
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<AlertTriangle size={16} />
							Warning Summary
						</RadixIconButton>
					</>
				);
				break;

			case 'data-backup-restore':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Download size={16} />
							Backup Now
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Upload size={16} />
							Restore Data
						</RadixIconButton>
					</>
				);
				break;

			case 'user-permission-management':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Users size={16} />
							User Report
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Shield size={16} />
							Permission Audit
						</RadixIconButton>
					</>
				);
				break;

			case 'log-management':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<FileText size={16} />
							Export Logs
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Search size={16} />
							Advanced Search
						</RadixIconButton>
					</>
				);
				break;

			case 'environment-settings':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Settings size={16} />
							Import Config
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Save size={16} />
							Export Config
						</RadixIconButton>
					</>
				);
				break;

			default:
				extraButtons = null;
		}

		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				{extraButtons}
			</div>
		);
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={`System Administration ${t('tabs.actions.register')}`}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							새로운 시스템 관리 항목을 등록합니다.
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
				title="System Administration"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RegisterButton />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default SystemAdminTabNavigation;
