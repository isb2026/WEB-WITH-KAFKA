import { MenuType } from '@aips/types/menus';

export const SimulationServiceMenus: MenuType = {
    label: 'menuGroup.simulation',
    icon: 'Play',
    children: [
        {
            name: 'menu.simulation_scenario',
            to: '/simulation/scenario/list',
            icon: 'FileText',
        },
        {
            name: 'menu.simulation_whatif',
            to: '/simulation/whatif/list',
            icon: 'HelpCircle',
        },
        {
            name: 'menu.simulation_analysis',
            to: '/simulation/analysis/list',
            icon: 'BarChart3',
        },
        {
            name: 'menu.simulation_comparison',
            to: '/simulation/comparison/list',
            icon: 'GitCompare',
        },
    ],
};

export const simulationRoutes = [
    {
        path: '/simulation/scenario',
        children: [
            {
                path: 'list',
                element: <div>시나리오 관리 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/simulation/whatif',
        children: [
            {
                path: 'list',
                element: <div>What-If 분석 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/simulation/analysis',
        children: [
            {
                path: 'list',
                element: <div>시뮬레이션 분석 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/simulation/comparison',
        children: [
            {
                path: 'list',
                element: <div>시나리오 비교 (준비 중)</div>,
            },
        ],
    },
];