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
	title,
	tabs,
	defaultValue,
	onValueChange,
	className = '',
	buttonSlot,
}) => {
	return (
		<div className={`max-w-full max-h-full mx-auto p-4 ${className}`}>
			<h2 className="text-xl font-bold mb-2">{title}</h2>
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
