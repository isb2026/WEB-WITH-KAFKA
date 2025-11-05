import { lazy, Suspense } from 'react';
import { Menustype } from '../types/menus';
import LoadingFallback from '../components/common/LoadingFallback';

// Lazy load report pages
const ReportsListPage = lazy(() => import('@esg/pages/reports/ReportsList'));
const ReportPage = lazy(() => import('@esg/pages/reports/ReportPage'));

export const ReportPath = {
	report: 'report',
	reportPage: '/report/:reportId',
};

export const ReportNavPath: Menustype[] = [
	{
		label: 'report',
		children: [
			{
				name: 'new_report',
				icon: 'newspaper',
				to: ReportPath.report,
			},
		],
	},
];

export const ReportRoute = {
	path: ReportPath.report,
	children: [
		{
			index: true,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<ReportsListPage />
				</Suspense>
			),
		},
		{
			path: ReportPath.reportPage,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<ReportPage />
				</Suspense>
			),
		},
	],
};
