import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from '@aips/components/common/AppSidebar';
import Header from '@aips/components/header/Header';

const MainLayout: React.FC = () => {
	return (
		<div className="min-h-screen h-screen bg-background flex flex-col">
			<div className="flex-shrink-0">
				<Header />
			</div>

			<div className="flex flex-1 h-full overflow-hidden">
				<div className="flex-shrink-0 transition-all duration-300 ease-in-out">
					<AppSidebar />
				</div>

				<div className="flex-1 h-full overflow-auto transition-all duration-300 ease-in-out">
					<main className="bg-Colors-Gray-(light-mode)-25 min-h-full">
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	);
};

export default MainLayout;
