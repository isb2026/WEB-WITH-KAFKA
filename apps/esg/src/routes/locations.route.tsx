import { lazy, Suspense } from 'react';
import { Menustype } from '../types/menus';
import LoadingFallback from '../components/common/LoadingFallback';

// Lazy load location pages
const CompanyPage = lazy(() => import('@esg/pages/locations/CompanyPage').then(module => ({ default: module.CompanyPage })));
const WorkPlacePage = lazy(() => import('@esg/pages/locations/WorkPlacePage').then(module => ({ default: module.WorkPlacePage })));
const CompanyManagerPage = lazy(() => import('@esg/pages/locations/CompanyManagerPage').then(module => ({ default: module.CompanyManagerPage })));
const CompanyGroupPage = lazy(() => import('@esg/pages/locations/CompanyGroupPage').then(module => ({ default: module.CompanyGroupPage })));
const DataRequestPage = lazy(() => import('@esg/pages/locations/DataRequestPage').then(module => ({ default: module.DataRequestPage })));

export const LocationPath = {
	group: 'group',
	company: 'company',
	location: 'location',
	workplace: 'workplace',
	charger: 'charger',
	tags: 'tags',
	dataRequest: 'data-request',
};

export const LocationNavPath: Menustype[] = [
	{
		label: 'company',
		children: [
			{
				name: 'group',
				icon: 'building',
				to: `${LocationPath.group}`,
				exact: true,
			},
			{
				name: 'company',
				icon: 'building',
				to: `${LocationPath.group}/${LocationPath.company}`,
			},
			{
				name: 'workplace',
				icon: 'building',
				to: `${LocationPath.group}/${LocationPath.workplace}`,
			},
			{
				name: 'charger',
				icon: 'user',
				to: `${LocationPath.group}/${LocationPath.charger}`,
			},
			{
				name: 'data_request',
				icon: 'envelope',
				to: `${LocationPath.group}/${LocationPath.dataRequest}`,
			},
		],
	},
];

export const LocationRoute = {
	path: LocationPath.group,
	children: [
		{
			index: true,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<CompanyGroupPage />
				</Suspense>
			),
		},
		{
			path: LocationPath.company,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<CompanyPage />
				</Suspense>
			),
		},
		{
			path: LocationPath.workplace,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<WorkPlacePage />
				</Suspense>
			),
		},
		{
			path: LocationPath.charger,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<CompanyManagerPage />
				</Suspense>
			),
		},
		{
			path: LocationPath.dataRequest,
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<DataRequestPage />
				</Suspense>
			),
		},
	],
};
