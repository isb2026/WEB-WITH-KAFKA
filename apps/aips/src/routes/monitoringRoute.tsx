import { MenuType } from '@aips/types/menus';

export const MonitoringServiceMenus: MenuType = {
    label: 'menuGroup.monitoring',
    icon: 'Monitor',
    children: [
        {
            name: 'menu.monitoring_dashboard',
            to: '/monitoring/dashboard/list',
            icon: 'LayoutDashboard',
        },
        {
            name: 'menu.monitoring_kpi',
            to: '/monitoring/kpi/list',
            icon: 'Target',
        },
        {
            name: 'menu.monitoring_alert',
            to: '/monitoring/alert/list',
            icon: 'Bell',
        },
        {
            name: 'menu.monitoring_report',
            to: '/monitoring/report/list',
            icon: 'FileBarChart',
        },
    ],
};

export const monitoringRoutes = [
    {
        path: '/monitoring/dashboard',
        children: [
            {
                path: 'list',
                element: <div>실시간 대시보드 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/monitoring/kpi',
        children: [
            {
                path: 'list',
                element: <div>KPI 모니터링 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/monitoring/alert',
        children: [
            {
                path: 'list',
                element: <div>알림 관리 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/monitoring/report',
        children: [
            {
                path: 'list',
                element: <div>리포트 관리 (준비 중)</div>,
            },
        ],
    },
];