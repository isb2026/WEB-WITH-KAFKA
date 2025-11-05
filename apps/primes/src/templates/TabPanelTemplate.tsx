import React from 'react';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
} from '@repo/radix-ui/components';
import { X } from 'lucide-react';

export interface TabItem {
	id: string;
	label: string;
	value: string;
	content: React.ReactNode | ((props: TabContentProps) => React.ReactNode);
	disabled?: boolean;
	icon?: React.ReactNode;
	onSave?: () => void;
	onClose?: () => void;
	useSave?: boolean;
}

export interface TabContentProps {
	tabId: string;
	tabData?: any;
	onAction?: (action: string, data?: any) => void;
}

export interface HeaderConfig {
	title?: string;
	subtitle?: string;
	onClose?: () => void;
	showCloseButton?: boolean;
}

export interface TabPanelTemplateProps {
	isOpen: boolean;
	// onClose: () => void;
	tabs: TabItem[];
	defaultValue?: string;
	isClosing?: boolean;
	className?: string;
	tabData?: Record<string, any>;
	onTabAction?: (tabId: string, action: string, data?: any) => void;
	header?: HeaderConfig;
}

export const TabPanelTemplate: React.FC<TabPanelTemplateProps> = ({
	isOpen,
	// onClose,
	tabs,
	defaultValue,
	isClosing = false,
	className = '',
	tabData = {},
	onTabAction,
	header,
}) => {
	if (!isOpen) return null;

	const handleTabAction = (tabId: string, action: string, data?: any) => {
		onTabAction?.(tabId, action, data);
	};

	const renderTabContent = (tab: TabItem) => {
		console.log('🔍 Rendering Tab:', tab.id, tab.value);

		if (typeof tab.content === 'function') {
			return tab.content({
				tabId: tab.id,
				tabData: tabData[tab.id],
				onAction: (action: string, data?: any) =>
					handleTabAction(tab.id, action, data),
			});
		}
		return tab.content;
	};

	const renderHeader = () => {
		if (!header) return null;

		return (
			<div className="flex items-center justify-between p-3 border-b bg-white">
				<div className="flex flex-col">
					{header.title && (
						<h3 className="font-semibold text-lg">
							{header.title}
						</h3>
					)}
					{header.subtitle && (
						<p className="text-sm text-gray-600">
							{header.subtitle}
						</p>
					)}
				</div>
				{header.showCloseButton && header.onClose && (
					<button
						onClick={header.onClose}
						className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 flex items-center justify-center transition-colors"
						aria-label="패널 닫기"
					>
						<X size={16} className="text-gray-600" />
					</button>
				)}
			</div>
		);
	};

	return (
		<div
			className={`border rounded-lg overflow-hidden h-[calc(100vh-190px)] flex flex-col transition-all duration-300 ease-in-out ${className} ${
				isOpen && !isClosing
					? 'animate-slide-in-right opacity-100'
					: 'animate-slide-out-right opacity-0 pointer-events-none'
			}`}
		>
			{/* 헤더 영역 */}
			{renderHeader()}

			{/* 탭 영역 */}
			<div className="flex-1 min-h-0">
				<RadixTabsRoot
					defaultValue={defaultValue || tabs[0]?.value}
					className={`h-full flex flex-col ${header ? 'border-0' : ''}`}
				>
					<RadixTabsList className="inline-flex h-10 items-center w-full justify-start border-b flex-shrink-0">
						{tabs.map((tab) => (
							<RadixTabsTrigger
								key={tab.id}
								value={tab.value}
								disabled={tab.disabled}
								className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#F5F5F5] min-w-fit lg:w-[100px]"
							>
								{tab.icon && (
									<span className="flex items-center">
										{tab.icon}
									</span>
								)}
								{tab.label}
							</RadixTabsTrigger>
						))}
					</RadixTabsList>

					{tabs.map((tab) => (
						<RadixTabsContent
							key={tab.id}
							value={tab.value}
							className="flex-1 flex flex-col min-h-0 overflow-auto data-[state=active]:flex data-[state=inactive]:hidden"
						>
							{renderTabContent(tab)}
						</RadixTabsContent>
					))}
				</RadixTabsRoot>
			</div>
		</div>
	);
};
