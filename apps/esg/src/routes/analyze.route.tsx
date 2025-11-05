import { lazy, Suspense } from 'react';
import { Menustype } from '../types/menus';
import LoadingFallback from '../components/common/LoadingFallback';

// Lazy load analyze pages
const DefaultDashboard = lazy(() =>
	import('@esg/pages/dashboards/DefaultDashboard').then((module) => ({
		default: module.DefaultDashboard,
	}))
);
const MeterDefaultDashboard = lazy(() =>
	import('@esg/pages/dashboards/MeterDashboard/MeterDefaultDashbard').then(
		(module) => ({ default: module.MeterDefaultDashboard })
	)
);
const EmissionsDashboardPage = lazy(() =>
	import('@esg/pages/analyze/EmissionsDashboardPage').then((module) => ({
		default: module.EmissionsDashboardPage,
	}))
);
const GroupEmissionsComparisonPage = lazy(() =>
	import('@esg/pages/analyze/GroupEmissionsComparisonPage').then(
		(module) => ({
			default: module.GroupEmissionsComparisonPage,
		})
	)
);

export const AnalyzePath = {
	analyze: 'analyze',
	location: 'location',
	account: 'account',
	meter: 'meter',
	emissions: 'emissions',
	groupComparison: 'group-comparison',
};

export const AnalyzeNavPath: Menustype[] = [
	{
		label: 'analyze',
		children: [
			{
				name: 'analyze_company',
				icon: 'chart-line',
				to: `${AnalyzePath.analyze}/${AnalyzePath.location}`,
			},
			{
				name: 'analyze_meter',
				icon: 'chart-line',
				to: `${AnalyzePath.analyze}/${AnalyzePath.meter}`,
			},
			{
				name: 'analyze_emissions',
				icon: 'chart-line',
				to: `${AnalyzePath.analyze}/${AnalyzePath.emissions}`,
			},
			{
				name: 'analyze_group_comparison',
				icon: 'chart-line',
				to: `${AnalyzePath.analyze}/${AnalyzePath.groupComparison}`,
			},
		],
	},
];

export const AnalyzeRoute = {
	path: AnalyzePath.analyze,
	children: [
		{
			path: AnalyzePath.location,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<DefaultDashboard />
				</Suspense>
			),
		},
		{
			path: AnalyzePath.meter,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<MeterDefaultDashboard />
				</Suspense>
			),
		},
		{
			path: AnalyzePath.emissions,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<EmissionsDashboardPage />
				</Suspense>
			),
		},
		{
			path: AnalyzePath.groupComparison,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<GroupEmissionsComparisonPage />
				</Suspense>
			),
		},
	],
};
