// packages/radix-ui/src/layouts/SidebarLayout.tsx
import React from 'react';

interface SidebarLayoutProps {
	menu: React.ReactNode;
	children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
	menu,
	children,
}) => {
	return (
		<div className="flex min-h-screen">
			<aside className="w-64 bg-gray-100 border-r border-gray-300 p-4">
				{menu}
			</aside>
			<main className="flex-1 p-6 bg-white">{children}</main>
		</div>
	);
};
