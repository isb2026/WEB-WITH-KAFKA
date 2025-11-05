import React, { useState, useEffect } from 'react';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
} from '@repo/radix-ui/components';
import { useResponsive } from '@primes/hooks';
import { useNavigate } from 'react-router-dom';

export interface TabItem {
	id: string;
	label: string;
	content?: React.ReactNode;
	disabled?: boolean;
	icon?: React.ReactNode;
	to?: string; // 경로 추가
}

export interface TabTemplateProps {
	tabs: TabItem[];
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	className?: string;
	tabsListClassName?: string;
	tabsTriggerClassName?: string;
	tabsContentClassName?: string;
	children?: React.ReactNode;
	orientation?: 'horizontal' | 'vertical';
}

export const TabTemplate: React.FC<TabTemplateProps> = ({
	tabs,
	defaultValue,
	onValueChange,
	className = '',
	tabsListClassName = '',
	tabsTriggerClassName = '',
	tabsContentClassName = '',
	children,
	orientation = 'horizontal',
}) => {
	const [currentTab, setCurrentTab] = useState<string>(
		defaultValue || tabs[0]?.id
	);
	const { isMobile } = useResponsive();
	const navigate = useNavigate(); // useNavigate 훅 사용

	const handleTabClick = (to?: string) => {
		if (to) {
			navigate(to); // 경로로 이동
		}
	};

	// 탭을 클릭할 때마다 상태 업데이트
	const handleTabChange = (tabId: string) => {
		setCurrentTab(tabId);
		if (onValueChange) {
			onValueChange(tabId);
		}
	};

	useEffect(() => {
		// 경로 변경 시 자동으로 탭 상태 변경
		if (defaultValue) {
			setCurrentTab(defaultValue);
		}
	}, [defaultValue]);

	return (
		<RadixTabsRoot
			value={currentTab} // 현재 탭 상태를 value로 관리
			onValueChange={handleTabChange}
			orientation={orientation}
			className={`w-full h-full flex flex-col ${className}`}
		>
			<RadixTabsList
				className={`inline-flex gap-1 h-10 items-center w-full justify-start${
					orientation === 'vertical' ? 'flex-col h-auto' : ''
				} ${tabsListClassName}`}
			>
				{tabs.map((tab) => (
					<RadixTabsTrigger
						key={tab.id}
						value={tab.id}
						disabled={tab.disabled}
						className={`inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F] ${tabsTriggerClassName}`}
						onClick={() => handleTabClick(tab.to)} // 탭 클릭 시 경로로 이동
					>
						{tab.icon && (
							<span className="text-base">{tab.icon}</span>
						)}
						{!isMobile && tab.label}
					</RadixTabsTrigger>
				))}
				{children}
			</RadixTabsList>

			{tabs.map((tab) => (
				<RadixTabsContent
					key={tab.id}
					value={tab.id}
					className={`mt-2 flex-1 overflow-y-hidden [&>*]:overflow-y-auto  ring-offset-background focus-visible:outline-none  ${tabsContentClassName}`}
				>
					{tab.content}
				</RadixTabsContent>
			))}
		</RadixTabsRoot>
	);
};

export default TabTemplate;
