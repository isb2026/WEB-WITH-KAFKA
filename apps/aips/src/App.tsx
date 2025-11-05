import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import MainLayout from '@aips/layouts/MainLayout';
import DashboardPage from '@aips/pages/DashboardPage';
import { aipsRoutes } from '@aips/routes/aipsRoute';

const App: React.FC = () => {
	return (
		<div className="min-h-screen bg-background">
			<Routes>
				<Route path="/" element={<MainLayout />}>
					{/* 기본 경로를 대시보드로 리다이렉트 */}
					<Route index element={<DashboardPage />} />

					{/* 동적으로 모든 AIPS 라우트 생성 */}
					{aipsRoutes.map((route, index) => (
						<Route key={index} path={route.path}>
							{route.children?.map((child, childIndex) => (
								<Route
									key={childIndex}
									path={child.path}
									element={child.element}
								/>
							))}
						</Route>
					))}
				</Route>

				{/* 404 페이지 */}
				<Route
					path="*"
					element={<div>페이지를 찾을 수 없습니다.</div>}
				/>
			</Routes>

			{/* Toast 알림 */}
			<Toaster
				position="top-right"
				richColors
				closeButton
				duration={4000}
			/>
		</div>
	);
};

export default App;
