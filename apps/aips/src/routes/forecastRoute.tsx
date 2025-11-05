import { MenuType } from '@aips/types/menus';

export const ForecastServiceMenus: MenuType = {
    label: 'menuGroup.forecast',
    icon: 'TrendingUp',
    children: [
        {
            name: 'menu.forecast_demand',
            to: '/forecast/demand/list',
            icon: 'BarChart3',
        },
        {
            name: 'menu.forecast_sales',
            to: '/forecast/sales/list',
            icon: 'LineChart',
        },
        {
            name: 'menu.forecast_model',
            to: '/forecast/model/list',
            icon: 'Brain',
        },
        {
            name: 'menu.forecast_accuracy',
            to: '/forecast/accuracy/list',
            icon: 'Target',
        },
    ],
};

export const forecastRoutes = [
    {
        path: '/forecast/demand',
        children: [
            {
                path: 'list',
                element: <div>수요 예측 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/forecast/sales',
        children: [
            {
                path: 'list',
                element: <div>판매 예측 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/forecast/model',
        children: [
            {
                path: 'list',
                element: <div>예측 모델 관리 (준비 중)</div>,
            },
        ],
    },
    {
        path: '/forecast/accuracy',
        children: [
            {
                path: 'list',
                element: <div>예측 정확도 분석 (준비 중)</div>,
            },
        ],
    },
];