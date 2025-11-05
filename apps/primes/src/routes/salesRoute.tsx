// Order 관련 import
import { SalesOrderRegisterPage } from '@primes/pages/sales/orders/SalesOrderRegisterPage';
import { SalesOrderEditPage } from '@primes/pages/sales/orders/SalesOrderEditPage';
import { SalesOrderAnalisisPage } from '@primes/pages/sales/orders';
import SalesOrderTabNavigation from '@primes/tabs/sales/OrderTabNavigation';

// Shipment Request 관련 import
import ShippingRequestTabNavigation from '@primes/tabs/sales/ShippingRequestTabNavigation';
import { SalesShippingRequestRegisterPage } from '@primes/pages/sales/shipping-request/SalesShippingRequestRegisterPage';

// Shipment 관련 import
import { SalesShipmentRegisterPage } from '@primes/pages/sales/shipment/SalesShipmentRegisterPage';
import ShipmentTabNavigation from '@primes/tabs/sales/ShipmentTabNavigation';

// Delivery 관련 import
import { SalesDeliveryRegisterPage } from '@primes/pages/sales/delivery/SalesDeliveryRegisterPage';
import DeliveryTabNavigation from '@primes/tabs/sales/DeliveryTabNavigation';

// Estimate 관련 import
import EstimateTabNavigation from '@primes/tabs/sales/EstimateTabNavigation';
import { SalesEstimateRegisterPage } from '@primes/pages/sales/estimate/SalesEstimateRegisterPage';

// Statement 관련 import
import StatementTabNavigation from '@primes/tabs/sales/StatementTabNavigation';
import { SalesStatementRegisterPage } from '@primes/pages/sales/statement/SalesStatementRegisterPage';

// TaxInvoice 관련 import
import TaxInvoiceTabNavigation from '@primes/tabs/sales/TaxInvoiceTabNavigation';
import { SalesTaxInvoiceRegisterPage } from '@primes/pages/sales/tax-invoice/SalesTaxInvoiceRegisterPage';
import SalesTaxInvoiceEditPage from '@primes/pages/sales/tax-invoice/SalesTaxInvoiceEditPage';

import { MenuType } from '@primes/types/menus';
import SalesDeliveryEditPage from '@primes/pages/sales/delivery/SalesDeliveryEditPage';
import SalesShippingRequestEditPage from '@primes/pages/sales/shipping-request/SalesShippingRequestEditPage';
import SalesShipmentEditPage from '@primes/pages/sales/shipment/SalesShipmentEditPage';
import SalesEstimateEditPage from '@primes/pages/sales/estimate/SalesEstimateEditPage';
import SalesStatementEditPage from '@primes/pages/sales/statement/SalesStatementEditPage';

export const SalesServiceMenus: MenuType = {
	label: 'menuGroup.sales',
	desc: 'menuGroup.salesDesc',
	icon: 'Home',
	children: [
		{
			name: 'menu.sales_orders',
			to: '/sales/orders/related-list',
			icon: 'Order',
			children: [
				{
					name: 'menu.sales_orders_related_list',
					to: 'sales/orders/related-list',
					icon: 'Table',
				},
				{
					name: 'menu.sales_orders_list',
					to: 'sales/orders/list',
					icon: 'FileText',
				},
				{
					name: 'menu.sales_orders_analsis',
					to: 'sales/orders/analyze',
					icon: 'PieChart',
				},
				{
					name: 'menu.sales_orders_register',
					to: 'sales/orders/register',
					icon: 'PlusCircle',
				},
			],
		},
		{
			name: 'menu.sales_delivery',
			to: '/sales/delivery/related-list',
			icon: 'Delivery',
			children: [
				{
					name: 'menu.sales_delivery_related_list',
					to: 'sales/delivery/related-list',
					icon: 'Table',
				},
				{
					name: 'menu.sales_delivery_list',
					to: 'sales/delivery/list',
					icon: 'FileText',
				},
				{
					name: 'menu.sales_delivery_analsis',
					to: 'sales/delivery/analyze',
					icon: 'PieChart',
				},
				{
					name: 'menu.sales_delivery_register',
					to: 'sales/delivery/register',
					icon: 'PlusCircle',
				},
			],
		},
		{
			name: 'menu.sales_shipment_request',
			to: '/sales/shipment-request/related-list',
			icon: 'Delivery',
			children: [
				{
					name: 'menu.sales_shipment_request_related_list',
					to: 'sales/shipment-request/related-list',
					icon: 'Table',
				},
				{
					name: 'menu.sales_shipment_request_list',
					to: 'sales/shipment-request/list',
					icon: 'FileText',
				},
				{
					name: 'menu.sales_shipment_request_analsis',
					to: 'sales/shipment-request/analyze',
					icon: 'PieChart',
				},
				{
					name: 'menu.sales_shipment_request_register',
					to: 'sales/shipment-request/register',
					icon: 'PlusCircle',
				},
			],
		},
		{
			name: 'menu.sales_shipment',
			to: '/sales/shipment/related-list',
			icon: 'Delivery',
			children: [
				{
					name: 'menu.sales_shipment_related_list',
					to: 'sales/shipment/related-list',
					icon: 'Table',
				},
				{
					name: 'menu.sales_shipment_list',
					to: 'sales/shipment/list',
					icon: 'FileText',
				},
				{
					name: 'menu.sales_shipment_analsis',
					to: 'sales/shipment/analyze',
					icon: 'PieChart',
				},
				{
					name: 'menu.sales_shipment_register',
					to: 'sales/shipment/register',
					icon: 'PlusCircle',
				},
			],
		},
		{
			name: 'menu.sales_estimate',
			to: '/sales/estimate/related-list',
			icon: 'FileText',
			children: [
				{
					name: 'menu.sales_estimate_related_list',
					to: 'sales/estimate/related-list',
					icon: 'Table',
				},
				{
					name: 'menu.sales_estimate_list',
					to: 'sales/estimate/list',
					icon: 'FileText',
				},
				{
					name: 'menu.sales_estimate_analsis',
					to: 'sales/estimate/analyze',
					icon: 'PieChart',
				},
				{
					name: 'menu.sales_estimate_register',
					to: 'sales/estimate/register',
					icon: 'PlusCircle',
				},
			],
		},
		{
			name: 'menu.sales_statement',
			to: '/sales/statement/related-list',
			icon: 'FileText',
			children: [
				{
					name: 'menu.sales_statement_related_list',
					to: 'sales/statement/related-list',
					icon: 'Table',
				},
				{
					name: 'menu.sales_statement_list',
					to: 'sales/statement/list',
					icon: 'FileText',
				},
				{
					name: 'menu.sales_statement_analsis',
					to: 'sales/statement/analyze',
					icon: 'PieChart',
				},
				{
					name: 'menu.sales_statement_register',
					to: 'sales/statement/register',
					icon: 'PlusCircle',
				},
			],
		},
		{
			name: 'menu.sales_tax_invoice',
			to: '/sales/tax-invoice/related-list',
			icon: 'FileText',
			children: [
				{
					name: 'menu.sales_tax_invoice_related_list',
					to: 'sales/tax-invoice/related-list',
					icon: 'Table',
				},
				{
					name: 'menu.sales_tax_invoice_list',
					to: 'sales/tax-invoice/list',
					icon: 'FileText',
				},
				{
					name: 'menu.sales_tax_invoice_analsis',
					to: 'sales/tax-invoice/analyze',
					icon: 'PieChart',
				},
				{
					name: 'menu.sales_tax_invoice_register',
					to: 'sales/tax-invoice/register',
					icon: 'PlusCircle',
				},
			],
		},
	],
};

export const SalesRoutes = [
	{
		path: '/sales/orders',
		children: [
			{
				path: 'related-list',
				element: <SalesOrderTabNavigation activetab="related-list" />,
			},
			{
				path: 'list',
				element: <SalesOrderTabNavigation activetab="list" />,
			},
			{
				path: 'analyze',
				element: <SalesOrderAnalisisPage />,
			},
			{
				path: 'register',
				element: <SalesOrderRegisterPage />,
			},
			{
				path: ':id',
				element: <SalesOrderEditPage />,
			},
		],
	},
	{
		path: '/sales/delivery',
		children: [
			{
				path: 'related-list',
				element: <DeliveryTabNavigation activetab="related-list" />,
			},
			{
				path: 'list',
				element: <DeliveryTabNavigation activetab="list" />,
			},
			{
				path: 'register',
				element: <SalesDeliveryRegisterPage />,
			},
			{
				path: ':id',
				element: <SalesDeliveryEditPage />,
			},
		],
	},
	{
		path: '/sales/shipment-request',
		children: [
			{
				path: 'related-list',
				element: (
					<ShippingRequestTabNavigation activetab="related-list" />
				),
			},
			{
				path: 'list',
				element: <ShippingRequestTabNavigation activetab="list" />,
			},
			{
				path: 'register',
				element: <SalesShippingRequestRegisterPage />,
			},
			{
				path: ':id',
				element: <SalesShippingRequestEditPage />,
			},
		],
	},
	{
		path: '/sales/shipment',
		children: [
			{
				path: 'related-list',
				element: <ShipmentTabNavigation activetab="related-list" />,
			},
			{
				path: 'list',
				element: <ShipmentTabNavigation activetab="list" />,
			},
			{
				path: 'register',
				element: <SalesShipmentRegisterPage />,
			},
			{
				path: ':id',
				element: <SalesShipmentEditPage />,
			},
		],
	},
	{
		path: '/sales/estimate',
		children: [
			{
				path: 'related-list',
				element: <EstimateTabNavigation activetab="related-list" />,
			},
			{
				path: 'list',
				element: <EstimateTabNavigation activetab="list" />,
			},
			{
				path: 'analyze',
				element: (
					<div className="p-4 text-center text-gray-500">
						분석 페이지 준비 중입니다.
					</div>
				),
			},
			{
				path: 'register',
				element: <SalesEstimateRegisterPage />,
			},
			{
				path: ':id',
				element: <SalesEstimateEditPage />,
			},
		],
	},
	{
		path: '/sales/statement',
		children: [
			{
				path: 'related-list',
				element: <StatementTabNavigation activetab="related-list" />,
			},
			{
				path: 'list',
				element: <StatementTabNavigation activetab="list" />,
			},
			{
				path: 'analyze',
				element: (
					<div className="p-4 text-center text-gray-500">
						분석 페이지 준비 중입니다.
					</div>
				),
			},
			{
				path: 'register',
				element: <SalesStatementRegisterPage />,
			},
			{
				path: ':id',
				element: <SalesStatementEditPage />,
			},
		],
	},
	{
		path: '/sales/tax-invoice',
		children: [
			{
				path: 'related-list',
				element: <TaxInvoiceTabNavigation activetab="related-list" />,
			},
			{
				path: 'list',
				element: <TaxInvoiceTabNavigation activetab="list" />,
			},
			{
				path: 'analyze',
				element: (
					<div className="p-4 text-center text-gray-500">
						분석 페이지 준비 중입니다.
					</div>
				),
			},
			{
				path: 'register',
				element: <SalesTaxInvoiceRegisterPage />,
			},
			{
				path: ':id',
				element: <SalesTaxInvoiceEditPage />,
			},
		],
	},
];
