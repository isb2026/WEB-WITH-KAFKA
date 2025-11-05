import React, { ReactNode } from 'react';
import { TabTemplate, TabItem } from '../templates/TabTemplate';

interface TabLayoutProps {
	title: string;
	tabs: TabItem[];
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	className?: string;
	buttonSlot?: ReactNode;
}

const TabLayout: React.FC<TabLayoutProps> = ({
	tabs,
	defaultValue,
	onValueChange,
	className = '',
	buttonSlot,
}) => {
	return (
		<div className={`w-full h-full mx-auto p-4 ${className}`}>
			<TabTemplate
				tabs={tabs}
				defaultValue={defaultValue}
				onValueChange={(tab: string) => {
					if (onValueChange) {
						onValueChange(tab);
					}
				}}
			>
				{buttonSlot}
			</TabTemplate>
		</div>
	);
};

export default TabLayout;
