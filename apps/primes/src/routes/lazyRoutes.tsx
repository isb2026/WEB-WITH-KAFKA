import { lazy, Suspense } from 'react';

// 🎯 Loading Fallback Component
const LoadingFallback = () => (
	<div className="flex items-center justify-center min-h-96">
		<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
	</div>
);

// 🎯 Suspense Wrapper
export const withSuspense = (Component: React.ComponentType<any>) => {
	return (props: any) => (
		<Suspense fallback={<LoadingFallback />}>
			<Component {...props} />
		</Suspense>
	);
};

// ================================
// 🏢 INI Domain - Lazy Loaded
// ================================
const LazyUsersTabNavigation = lazy(
	() => import('@primes/tabs/ini/UsersTabNavigation')
);
const LazyVendorTabNavigation = lazy(
	() => import('@primes/tabs/ini/VendorTabNavigation')
);
const LazyCodesTabNavigation = lazy(
	() => import('@primes/tabs/ini/CodesTabNavigation')
);
const LazyItemTabNavigation = lazy(
	() => import('@primes/tabs/ini/ItemTabNavigation')
);
const LazyTerminalTabNavigation = lazy(
	() => import('@primes/tabs/ini/TerminalTabNavigation')
);
const LazyBomTabNavigation = lazy(
	() => import('@primes/tabs/ini/BomTabNavigation')
);
const LazyIniProgressListPage = lazy(() =>
	import('@primes/pages/ini/item-progress/IniItemProgressListPage').then(
		(m) => ({ default: m.IniProgressListPage })
	)
);

// ================================
// 💰 SALES Domain - Lazy Loaded
// ================================
const LazySalesOrderTabNavigation = lazy(
	() => import('@primes/tabs/sales/OrderTabNavigation')
);
const LazyShippingRequestTabNavigation = lazy(
	() => import('@primes/tabs/sales/ShippingRequestTabNavigation')
);
const LazyShipmentTabNavigation = lazy(
	() => import('@primes/tabs/sales/ShipmentTabNavigation')
);
const LazyDeliveryTabNavigation = lazy(
	() => import('@primes/tabs/sales/DeliveryTabNavigation')
);
const LazyEstimateTabNavigation = lazy(
	() => import('@primes/tabs/sales/EstimateTabNavigation')
);
const LazyStatementTabNavigation = lazy(
	() => import('@primes/tabs/sales/StatementTabNavigation')
);
const LazyTaxInvoiceTabNavigation = lazy(
	() => import('@primes/tabs/sales/TaxInvoiceTabNavigation')
);

// ================================
// 🏭 PRODUCTION Domain - Lazy Loaded
// ================================
const LazyProductionWorkingTabNavigation = lazy(
	() => import('@primes/tabs/production/ProductionWorkingTabNavigation')
);
const LazyCommandTabNavigation = lazy(
	() => import('@primes/tabs/production/CommandTabNavigation')
);
// const LazyProductionLotTabNavigation = lazy(
// 	() => import('@primes/tabs/production/ProductionLotTabNavigation')
// );

// ================================
// 🛒 PURCHASE Domain - Lazy Loaded
// ================================
const LazyPurchaseTabNavigation = lazy(
	() => import('@primes/tabs/purchase/PurchaseTabNavigation')
);
const LazyIncomingTabNavigation = lazy(
	() => import('@primes/tabs/purchase/IncomingTabNavigation')
);

// ================================
// 🏗️ MOLD Domain - Lazy Loaded
// ================================
const LazyMoldTabNavigation = lazy(
	() => import('@primes/tabs/mold/MoldTabNavigation')
);
const LazyMoldOrderTabNavigation = lazy(
	() => import('@primes/tabs/mold/MoldOrderTabNavigation')
);
const LazyMoldIncomingPage = lazy(
	() => import('@primes/pages/mold/mold-incoming/MoldIncomingPage')
);
const LazyMoldIngoingListPage = lazy(
	() => import('@primes/pages/mold/mold-ingoing/MoldIngoingListPage')
);
const LazyMoldIngoingRegisterPage = lazy(
	() => import('@primes/pages/mold/mold-ingoing/MoldIngoingRegisterPage')
);

// ================================
// ⚙️ MACHINE Domain - Lazy Loaded
// ================================
const LazyMachineTabNavigation = lazy(
	() => import('@primes/tabs/machine/MachineTabNavigation')
);
const LazyMachineRepairTabNavigation = lazy(
	() => import('@primes/tabs/machine/MachineRepairTabNavigation')
);

// ================================
// 📄 Core Pages - Lazy Loaded
// ================================
const LazyLogin = lazy(() => import('../pages/Login'));
const LazySignUp = lazy(() => import('../pages/SignUp'));
const LazyDashboard = lazy(() => import('../pages/Dashboard'));
const LazyDashboardLayout = lazy(() => import('../layouts/DashboradLayout'));
const LazyNotFoundTemplate = lazy(
	() => import('../templates/NotFoundTemplate')
);

// 🧪 Test Pages
const LazySearchDialogTest = lazy(() =>
	import('../pages/test/SearchDialogTest').then((m) => ({
		default: m.SearchDialogTest,
	}))
);
const LazySearchModalTestPage = lazy(
	() => import('../pages/test/SearchModalTest')
);
const LazyDataTablesNetTest = lazy(
	() => import('@primes/pages/test/DataTablesNetTest')
);
const LazySplitterTestPage = lazy(
	() => import('@primes/pages/test/SplitterTestPage')
);
const LazyDiagramEditorTest = lazy(
	() => import('@primes/pages/test/DiagramEditorTest')
);

const LazyTestGanttPage = lazy(
	() => import('@primes/pages/test/TestGanttPage')
);
const LazyTransactionStatementTestPage = lazy(
	() => import('@primes/pages/test/TransactionStatementTest')
);

// 🔧 Form Components
const LazyDynamicForm = lazy(() =>
	import('@primes/components/form/DynamicFormComponent').then((m) => ({
		default: m.DynamicForm,
	}))
);
const LazyCodeSelectComponent = lazy(() =>
	import('@primes/components/customSelect/CodeSelectComponent').then((m) => ({
		default: m.CodeSelectComponent,
	}))
);

// ================================
// 🎯 Exported Components with Suspense
// ================================

// Core
export const Login = withSuspense(LazyLogin);
export const SignUp = withSuspense(LazySignUp);
export const Dashboard = withSuspense(LazyDashboard);
export const DashboardLayout = withSuspense(LazyDashboardLayout);
export const NotFoundTemplate = withSuspense(LazyNotFoundTemplate);

// Test Pages
export const SearchDialogTest = withSuspense(LazySearchDialogTest);
export const SearchModalTestPage = withSuspense(LazySearchModalTestPage);
export const DataTablesNetTest = withSuspense(LazyDataTablesNetTest);
export const SplitterTestPage = withSuspense(LazySplitterTestPage);
export const DiagramEditorTest = withSuspense(LazyDiagramEditorTest);
export const TestGanttPage = withSuspense(LazyTestGanttPage);
export const TransactionStatementTestPage = withSuspense(
	LazyTransactionStatementTestPage
);

// Form Components
export const DynamicForm = withSuspense(LazyDynamicForm);
export const CodeSelectComponent = withSuspense(LazyCodeSelectComponent);

// INI Domain
export const UsersTabNavigation = withSuspense(LazyUsersTabNavigation);
export const VendorTabNavigation = withSuspense(LazyVendorTabNavigation);
export const CodesTabNavigation = withSuspense(LazyCodesTabNavigation);
export const ItemTabNavigation = withSuspense(LazyItemTabNavigation);
export const TerminalTabNavigation = withSuspense(LazyTerminalTabNavigation);
export const BomTabNavigation = withSuspense(LazyBomTabNavigation);
export const IniProgressListPage = withSuspense(LazyIniProgressListPage);

// Sales Domain
export const SalesOrderTabNavigation = withSuspense(
	LazySalesOrderTabNavigation
);
export const ShippingRequestTabNavigation = withSuspense(
	LazyShippingRequestTabNavigation
);
export const ShipmentTabNavigation = withSuspense(LazyShipmentTabNavigation);
export const DeliveryTabNavigation = withSuspense(LazyDeliveryTabNavigation);
export const EstimateTabNavigation = withSuspense(LazyEstimateTabNavigation);
export const StatementTabNavigation = withSuspense(LazyStatementTabNavigation);
export const TaxInvoiceTabNavigation = withSuspense(
	LazyTaxInvoiceTabNavigation
);

// Production Domain
export const ProductionWorkingTabNavigation = withSuspense(
	LazyProductionWorkingTabNavigation
);
export const CommandTabNavigation = withSuspense(LazyCommandTabNavigation);
// export const ProductionLotTabNavigation = withSuspense(
// 	LazyProductionLotTabNavigation
// );

// Purchase Domain
export const PurchaseTabNavigation = withSuspense(LazyPurchaseTabNavigation);
export const IncomingTabNavigation = withSuspense(LazyIncomingTabNavigation);

// Mold Domain
export const MoldTabNavigation = withSuspense(LazyMoldTabNavigation);
export const MoldOrderTabNavigation = withSuspense(LazyMoldOrderTabNavigation);
export const MoldIncomingPage = withSuspense(LazyMoldIncomingPage);
export const MoldIngoingListPage = withSuspense(LazyMoldIngoingListPage);
export const MoldIngoingRegisterPage = withSuspense(
	LazyMoldIngoingRegisterPage
);

// Machine Domain
export const MachineTabNavigation = withSuspense(LazyMachineTabNavigation);
export const MachineRepairTabNavigation = withSuspense(
	LazyMachineRepairTabNavigation
);
