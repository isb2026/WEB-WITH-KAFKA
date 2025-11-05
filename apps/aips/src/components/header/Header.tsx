// components/Header.tsx
import React, { useState } from 'react';

// import Aside from '../AccordionAside';

import {
	RadixHeader,
	RadixAvatarRoot,
	RadixAvatarImage,
	RadixAvatarFallback,
	RadixIconButton,
	DynamicIconButton,
} from '@repo/radix-ui/components';
import {
	Zap,
	Settings,
	HelpCircle,
	LogOut,
	QrCode,
	MessageSquare,
	Laptop,
	Headphones,
	Info,
	Phone,
	BookOpen,
	FileText,
	MessageSquareDashed,
	Rocket,
	ShieldAlert,
	Sparkles,
	AlertCircle,
	Send,
	MessageCircle,
	Mail,
	MessageCircleQuestion,
	BadgeAlert,
	Smartphone,
	Bell,
	BookOpenCheck,
	Search,
	Users,
	UserPlus,
	BadgeHelp,
	Box,
	MessageCircleMore,
	Layers2,
	House,
	User,
	Menu,
	Table2,
	Layout,
	Brush,
	ChartBarStacked,
} from 'lucide-react';
import { HeaderDropdownIcon } from './HeaderDropdownIcon';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '@primes/hooks';
import { useAuth } from '@primes/hooks/users/useAuthQuery';
import MoornmoLogo from './MoornmoLogo';

import { useTranslation } from '@repo/i18n';
import Tooltip from '../common/Tooltip';
import { Drawer } from '../drawer';
import SiteSettings from '../common/SiteSettings';

const Header: React.FC = () => {
	const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
	const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
	const [sidebarMode, setSidebarMode] = useState(1);
	const { isMobile, isTablet } = useResponsive();
	const navigate = useNavigate();
	const { logout } = useAuth();
	const { t } = useTranslation('common');

	const handleModeChange = (mode: number) => {
		setSidebarMode(mode);
	};

	return (
		<>
			<RadixHeader className="w-full bg-background h-[70px] flex items-center border-b px-3 justify-between">
				{/* Left side */}
				<div className="flex items-center gap-2 h-full">
					{(isMobile || isTablet) && (
						<DynamicIconButton
							onClick={() => setSidebarDrawerOpen(true)}
						>
							<Menu size={20} className="mx-2" color="gray" />
						</DynamicIconButton>
					)}
					<MoornmoLogo />
				</div>

				{/* Right side */}
				<div className="h-full flex items-center gap-3 md:gap-4">
					{/* QR Code Dropdown - Hide on mobile */}
					{!isMobile && (
						<HeaderDropdownIcon
							icon={<Search size={20} color="gray" />}
							label={t('header.search')}
							items={[
								{
									label: t('header.installWithQR'),
									icon: <Smartphone size={16} color="gray" />,
								},
								{
									label: t('header.qrLoginGuide'),
									icon: <BookOpen size={16} color="gray" />,
								},
							]}
						/>
					)}

					{/* Notifications Dropdown */}
					<HeaderDropdownIcon
						icon={<Bell size={20} color="gray" />}
						label={t('header.notifications')}
						items={[
							{
								label: t('header.systemMaintenance'),
								icon: <AlertCircle size={16} color="gray" />,
							},
							{
								label: t('header.newFeatureUpdate'),
								icon: <Sparkles size={16} color="gray" />,
							},
							{
								label: t('header.securityAlert'),
								icon: <ShieldAlert size={16} color="gray" />,
							},
						]}
					/>

					{/* Settings Icon */}
					{!isMobile && (
						<DynamicIconButton
							onClick={() => setSettingsDrawerOpen(true)}
						>
							<Tooltip label={t('header.settings')} side="bottom">
								<Settings size={20} color="gray" />
							</Tooltip>
						</DynamicIconButton>
					)}

					{/* User Avatar Dropdown */}
					<HeaderDropdownIcon
						icon={
							<RadixAvatarRoot className="flex size-10 select-none items-center justify-center overflow-hidden rounded-full bg-muted">
								<RadixAvatarImage
									className="h-full w-full object-cover"
									src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
									alt="User"
								/>
								<RadixAvatarFallback className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-sm font-medium">
									OR
								</RadixAvatarFallback>
							</RadixAvatarRoot>
						}
						userInfo={{
							name: 'Olivia Rhye',
							email: 'olivia@untitledui.com',
							avatar: (
								<RadixAvatarRoot className="flex size-8 select-none items-center justify-center overflow-hidden rounded-full bg-muted">
									<RadixAvatarImage
										className="h-full w-full object-cover"
										// src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
										alt="User"
									/>
									<RadixAvatarFallback className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-sm font-medium">
										OR
									</RadixAvatarFallback>
								</RadixAvatarRoot>
							),
						}}
						items={[
							{
								label: t('header.profile'),
								icon: (
									<User
										className="text-muted-foreground"
										size={16}
										color="gray"
									/>
								),
								shortcut: '⌘K→P',
							},
							{
								label: t('header.settings'),
								icon: (
									<Settings
										className="text-muted-foreground"
										size={16}
										color="gray"
									/>
								),
								shortcut: '⌘S',
								onClick: () => setSettingsDrawerOpen(true),
							},
							{
								label: t('header.keyboardShortcuts'),
								icon: (
									<Zap
										className="text-muted-foreground"
										size={16}
										color="gray"
									/>
								),
								shortcut: '?',
							},
							{ type: 'separator' },
							{
								label: t('header.companyInfo'),
								icon: (
									<House
										className="text-muted-foreground"
										size={16}
										color="gray"
									/>
								),
								shortcut: '⌘K→C',
							},
							{
								label: t('header.teamManagement'),
								icon: (
									<Users
										className="text-muted-foreground"
										size={16}
										color="gray"
									/>
								),
								shortcut: '⌘K→T',
							},
							{
								label: t('header.inviteTeamMember'),
								icon: (
									<UserPlus
										className="text-muted-foreground"
										size={16}
										color="gray"
									/>
								),
								shortcut: '⌘I',
							},
							{ type: 'separator' },
							{
								label: t('header.search'),
								icon: (
									<Search
										className="text-muted-foreground"
										size={16}
										color="gray"
									/>
								),
							},
							{
								label: t('header.notifications'),
								icon: (
									<Bell
										className="text-muted-foreground"
										size={16}
										color="gray"
									/>
								),
							},
							{ type: 'separator' },
							{
								label: t('header.logout'),
								icon: (
									<LogOut
										className="text-muted-foreground"
										size={16}
										color="gray"
									/>
								),
								shortcut: '^⌥Q',
								onClick: () => logout(),
							},
						]}
					/>
				</div>
			</RadixHeader>

			{/* Settings Drawer */}
			<Drawer
				isOpen={settingsDrawerOpen}
				onClose={() => setSettingsDrawerOpen(false)}
				title={t('header.settings')}
				side="right"
			>
				<SiteSettings
					currentMode={sidebarMode}
					onModeChange={handleModeChange}
				/>
			</Drawer>

			{/* Sidebar Drawer */}
			{/* <Drawer
				isOpen={sidebarDrawerOpen}
				onClose={() => setSidebarDrawerOpen(false)}
				logo={<MoornmoLogo />}
				side="left"
				width="w-auto"
			>
				<Aside sidebarMode={sidebarMode} isDrawer={true} />
			</Drawer> */}
		</>
	);
};

export default Header;
