import { MenuType } from '@aips/types/menus';

export const PlanningServiceMenus: MenuType = {
    label: 'menuGroup.planning',
    icon: 'Calendar',
    children: [
        {
            name: 'menu.planning_master',
            to: '/planning/master/list',
            icon: 'CalendarDays',
        },
        {
            name: 'menu.planning_capacity',
            to: '/planning/capacity/list',
            icon: 'Gauge',
        },
        {
            name: 'menu.planning_material',
            to: '/planning/material/list',
            icon: 'Package2',
        },
        {
            name: 'menu.planning_optimization',
            to: '/planning/optimization/list',
            icon: 'Zap',
        },
    ],
};

export const planningRoutes = [
    {
        path: '/planning/master',
        children: [
            {
                path: 'list',
                element: <div>마스터 생산계획 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/planning/capacity',
        children: [
            {
                path: 'list',
                element: <div>생산능력 계획 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/planning/material',
        children: [
            {
                path: 'list',
                element: <div>자재소요 계획 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/planning/optimization',
        children: [
            {
                path: 'list',
                element: <div>계획 최적화 (준비 중)</div>,
            },
        ],
    },
];