// components/Header.tsx
import React, { useState } from 'react';

import { Drawer } from '../../drawer';
import Aside from '../AccordionAside';

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
	Receipt,
} from 'lucide-react';
import { HeaderDropdownIcon } from './HeaderDropdownIcon';
import SiteSettings from '../SiteSettings';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '@primes/hooks';
import { useAuth } from '@primes/hooks/users/useAuthQuery';
import MoornmoLogo from './MoornmoLogo';
import Tooltip from '../Tooltip';
import { useTranslation } from '@repo/i18n';
import { useDevMode } from '@primes/contexts/DevModeContext';
import SolutionSelect from '../SolutionSelect';
import { MenuType, ServiceType } from '@primes/types/menus';
import { Services } from '@primes/routes/menu';

import Breadcrumbs from '../Breadcrumbs';

interface HeaderProps {
	sidebarMode: number;
	onModeChange: (mode: number) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarMode, onModeChange }) => {
	const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
	const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);

	const { isMobile, isTablet } = useResponsive();
	const navigate = useNavigate();
	const { logout } = useAuth();
	const { t } = useTranslation('common');
	const {
		isDevMode,
		useLocalEndpoints,
		toggleEndpoints,
		currentEndpointMode,
	} = useDevMode();

	const POP_URL =
		import.meta.env.VITE_POP_ADDRESS || 'https://pop.primes-cloud.co.kr';

	const handleOpenPop = () => {
		// open in a new tab, safely
		window.open(POP_URL, '_blank', 'noopener,noreferrer');
	};

	const services = Services;
	const [selectedService, setSelectedService] = useState<ServiceType>(
		services[0]
	);

	const getFirstMenuRoute = (menu: MenuType): string | null => {
		if (!menu.children || menu.children.length === 0) return null;
		const first = menu.children[0];
		if (first && 'to' in first && first.to) {
			return first.to.startsWith('/') ? first.to : `/${first.to}`;
		}
		return null;
	};

	const handleMenuClick = (menu: MenuType) => {
		const firstRoute = getFirstMenuRoute(menu);
		if (firstRoute) navigate(firstRoute);
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
					<SolutionSelect
						services={services}
						selectedService={selectedService}
						onServiceChange={setSelectedService}
						onMenuClick={handleMenuClick}
					/>

					<Breadcrumbs />

					{/* 개발 모드 표시 및 엔드포인트 토글 */}
					{isDevMode && (
						<div className="flex items-center gap-2">
							<div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium border border-green-200">
								🔧 DEV MODE
							</div>
							<button
								onClick={toggleEndpoints}
								className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
									useLocalEndpoints
										? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
										: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'
								}`}
								title={`현재: ${currentEndpointMode === 'local' ? '로컬' : '서버'} 엔드포인트`}
							>
								{currentEndpointMode === 'local'
									? '🏠 LOCAL'
									: '🌐 SERVER'}
							</button>
						</div>
					)}
				</div>

				{/* Right side */}
				<div className="h-full flex items-center gap-3 md:gap-4">
					{/* Menu Dropdown */}
					{!isMobile && (
						<HeaderDropdownIcon
							icon={<BookOpenCheck size={20} color="gray" />}
							label={t('header.testPagesNavigation')}
							items={[
								{
									label: t('header.searchDialogTest'),
									icon: <Search size={16} />,
									onClick: () => navigate('/search-test'),
								},
								{
									label: t('header.searchModalTest'),
									icon: <Search size={16} />,
									onClick: () =>
										navigate('/search-modal-test'),
								},
								{
									label: t('header.dataTablesNetTest'),
									icon: <Table2 size={16} />,
									onClick: () => navigate('/datatables-test'),
								},
								{
									label: t('header.formTest'),
									icon: <Table2 size={16} />,
									onClick: () => navigate('/form-test'),
								},
								{
									label: t('header.splitterTest'),
									icon: <Layout size={16} />,
									onClick: () => navigate('/splitter-test'),
								},
								{
									label: 'Diagram Editor',
									icon: <Brush size={16} />,
									onClick: () =>
										navigate('/diagram-editor-test'),
								},
								{
									label: 'Gantt Charts',
									icon: <ChartBarStacked size={16} />,
									onClick: () => navigate('/gantt-test'),
								},
								{
									label: 'Billings',
									icon: <Receipt size={16} />,
									onClick: () =>
										navigate('/transaction-statement-test'),
								},
							]}
						/>
					)}

					{/* Label Estimate Button - Hide on mobile */}
					{!isMobile && (
						<RadixIconButton className="border flex gap-2 px-3 py-2 rounded-lg font-medium text-sm items-center">
							<Zap
								className="text-muted-foreground"
								size={16}
								color="gray"
							/>
							{t('header.labelEstimate')}
						</RadixIconButton>
					)}

					{/* QR Code Dropdown - Hide on mobile */}
					{!isMobile && (
						<Tooltip label="바코드 모드로 이동" side="bottom">
							<DynamicIconButton
								onClick={handleOpenPop}
								aria-label="Open POP"
							>
								<QrCode size={20} color="gray" />
							</DynamicIconButton>
						</Tooltip>
					)}

					{/* Message Dropdown */}
					<HeaderDropdownIcon
						icon={<MessageSquare size={20} color="gray" />}
						label={t('header.message')}
						items={[
							{
								label: t('header.newMessage'),
								icon: <Mail size={16} color="gray" />,
							},
							{
								label: t('header.sentMessages'),
								icon: <Send size={16} color="gray" />,
							},
							{
								label: t('header.openChat'),
								icon: <MessageCircle size={16} color="gray" />,
							},
						]}
					/>

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

					{/* Megaphone Dropdown - Hide on mobile */}
					{!isMobile && (
						<HeaderDropdownIcon
							icon={<Info size={22} color="gray" />}
							label={t('header.announcements')}
							items={[
								{
									label: t('header.serviceChangeNotice'),
									icon: <BadgeAlert size={16} color="gray" />,
								},
								{
									label: t('header.updateNews'),
									icon: <Rocket size={16} color="gray" />,
								},
							]}
						/>
					)}

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

					{/* Laptop Dropdown - Hide on mobile */}
					{!isMobile && (
						<HeaderDropdownIcon
							icon={<Laptop size={20} color="gray" />}
							items={[
								{
									label: t('header.helpCenter'),
									icon: <HelpCircle size={16} color="gray" />,
								},
								{
									label: t('header.sendFeedback'),
									icon: (
										<MessageSquareDashed
											size={16}
											color="gray"
										/>
									),
								},
								{
									label: t('header.documentLibrary'),
									icon: <FileText size={16} color="gray" />,
								},
							]}
						/>
					)}

					{/* Headphones Dropdown - Hide on mobile */}
					{!isMobile && (
						<HeaderDropdownIcon
							icon={<Headphones size={20} color="gray" />}
							items={[
								{
									label: t('header.connectSupport'),
									icon: <Phone size={16} color="gray" />,
								},
								{
									label: t('header.faq'),
									icon: <BookOpen size={16} color="gray" />,
								},
								{
									label: t('header.oneOnOneInquiry'),
									icon: (
										<MessageCircleQuestion
											size={16}
											color="gray"
										/>
									),
								},
							]}
						/>
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
								label: t('header.barcodeMode'),
								icon: (
									<Layers2
										className="text-muted-foreground"
										size={16}
										color="gray"
									/>
								),
								onClick: () => handleOpenPop(),
							},
							{
								label: t('header.remoteSupport'),
								icon: (
									<MessageCircleMore
										className="text-muted-foreground"
										size={16}
										color="gray"
									/>
								),
							},
							{
								label: t('header.customerCenter'),
								icon: (
									<BadgeHelp
										className="text-muted-foreground"
										size={16}
										color="gray"
									/>
								),
							},
							{
								label: t('header.labelEstimate'),
								icon: (
									<Box
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
					onModeChange={onModeChange}
				/>
			</Drawer>

			{/* Sidebar Drawer */}
			<Drawer
				isOpen={sidebarDrawerOpen}
				onClose={() => setSidebarDrawerOpen(false)}
				logo={<MoornmoLogo />}
				side="left"
				width="w-auto"
			>
				<Aside sidebarMode={sidebarMode} isDrawer={true} />
			</Drawer>
		</>
	);
};

export default Header;
