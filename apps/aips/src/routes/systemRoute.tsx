import { MenuType } from '@aips/types/menus';

export const SystemServiceMenus: MenuType = {
    label: 'menuGroup.system',
    icon: 'Settings',
    children: [
        {
            name: 'menu.system_user',
            to: '/system/user/list',
            icon: 'Users',
        },
        {
            name: 'menu.system_role',
            to: '/system/role/list',
            icon: 'Shield',
        },
        {
            name: 'menu.system_config',
            to: '/system/config/list',
            icon: 'Cog',
        },
        {
            name: 'menu.system_log',
            to: '/system/log/list',
            icon: 'FileText',
        },
        {
            name: 'menu.system_backup',
            to: '/system/backup/list',
            icon: 'Database',
        },
    ],
};

export const systemRoutes = [
    {
        path: '/system/user',
        children: [
            {
                path: 'list',
                element: <div>사용자 관리 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/system/role',
        children: [
            {
                path: 'list',
                element: <div>권한 관리 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/system/config',
        children: [
            {
                path: 'list',
                element: <div>시스템 설정 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/system/log',
        children: [
            {
                path: 'list',
                element: <div>로그 관리 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/system/backup',
        children: [
            {
                path: 'list',
                element: <div>백업 관리 (준비 중)</div>,
            },
        ],
    },
];