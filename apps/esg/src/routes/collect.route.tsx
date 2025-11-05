import { lazy, Suspense } from 'react';
import { Menustype } from '../types/menus';
import LoadingFallback from '../components/common/LoadingFallback';

// Lazy load collect pages
const AccountPage = lazy(() => import('@esg/pages/collect/AccountPage').then(module => ({ default: module.AccountPage })));
const RecordPage = lazy(() => import('@esg/pages/collect/RecordPage').then(module => ({ default: module.RecordPage })));
const MeterPage = lazy(() => import('@esg/pages/collect/MeterPage').then(module => ({ default: module.MeterPage })));

export const CollectPath = {
	collects: 'collects',
	accounts: 'accounts',
	records: 'records',
	recordsTree: 'records-tree',
	meter: 'meter',
};

export const CollectNavPath: Menustype[] = [
	{
		label: 'collect',
		children: [
			{
				name: 'account',
				icon: 'folder-plus',
				to: `${CollectPath.collects}/${CollectPath.accounts}`,
			},
			{
				name: 'record',
				icon: 'folder-plus',
				to: `${CollectPath.collects}/${CollectPath.records}`,
			},
			{
				name: 'meter',
				icon: 'bolt',
				to: `${CollectPath.collects}/${CollectPath.meter}`,
			},
		],
	},
];

export const ColloectRoute = {
	path: CollectPath.collects,
	children: [
		{
			path: CollectPath.accounts,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<AccountPage />
				</Suspense>
			),
		},
		{
			path: `${CollectPath.accounts}/:id`,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<AccountPage />
				</Suspense>
			),
		},
		{
			path: CollectPath.records,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<RecordPage />
				</Suspense>
			),
		},
		{
			path: CollectPath.meter,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<MeterPage />
				</Suspense>
			),
		},
	],
};
