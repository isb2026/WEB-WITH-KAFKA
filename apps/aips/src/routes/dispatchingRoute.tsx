import { MenuType } from '@aips/types/menus';

export const DispatchingServiceMenus: MenuType = {
    label: 'menuGroup.dispatching',
    icon: 'Send',
    children: [
        {
            name: 'menu.dispatching_workorder',
            to: '/dispatching/workorder/list',
            icon: 'ClipboardList',
        },
        {
            name: 'menu.dispatching_priority',
            to: '/dispatching/priority/list',
            icon: 'ArrowUp',
        },
        {
            name: 'menu.dispatching_status',
            to: '/dispatching/status/list',
            icon: 'Activity',
        },
        {
            name: 'menu.dispatching_integration',
            to: '/dispatching/integration/list',
            icon: 'Link',
        },
    ],
};

export const dispatchingRoutes = [
    {
        path: '/dispatching/workorder',
        children: [
            {
                path: 'list',
                element: <div>작업지시 연동 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/dispatching/priority',
        children: [
            {
                path: 'list',
                element: <div>우선순위 관리 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/dispatching/status',
        children: [
            {
                path: 'list',
                element: <div>작업 상태 관리 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/dispatching/integration',
        children: [
            {
                path: 'list',
                element: <div>시스템 연동 관리 (준비 중)</div>,
            },
        ],
    },
];