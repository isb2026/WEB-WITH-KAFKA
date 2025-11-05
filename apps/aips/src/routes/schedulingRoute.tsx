import { MenuType } from '@aips/types/menus';

export const SchedulingServiceMenus: MenuType = {
    label: 'menuGroup.scheduling',
    icon: 'Clock',
    children: [
        {
            name: 'menu.scheduling_finite',
            to: '/scheduling/finite/list',
            icon: 'Timer',
        },
        {
            name: 'menu.scheduling_sequence',
            to: '/scheduling/sequence/list',
            icon: 'ArrowUpDown',
        },
        {
            name: 'menu.scheduling_gantt',
            to: '/scheduling/gantt/list',
            icon: 'BarChart4',
        },
        {
            name: 'menu.scheduling_constraint',
            to: '/scheduling/constraint/list',
            icon: 'Lock',
        },
    ],
};

export const schedulingRoutes = [
    {
        path: '/scheduling/finite',
        children: [
            {
                path: 'list',
                element: <div>유한능력 스케줄링 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/scheduling/sequence',
        children: [
            {
                path: 'list',
                element: <div>작업순서 최적화 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/scheduling/gantt',
        children: [
            {
                path: 'list',
                element: <div>간트차트 뷰 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/scheduling/constraint',
        children: [
            {
                path: 'list',
                element: <div>제약조건 관리 (준비 중)</div>,
            },
        ],
    },
];