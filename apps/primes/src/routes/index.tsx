import { createBrowserRouter } from 'react-router-dom';
import {
	Login,
	SignUp,
	Dashboard,
	SearchDialogTest,
	SearchModalTestPage,
	DashboardLayout,
	NotFoundTemplate,
	DataTablesNetTest,
	SplitterTestPage,
	DiagramEditorTest,
	DynamicForm,
	CodeSelectComponent,
	TestGanttPage,
	TransactionStatementTestPage,
} from './lazyRoutes';

import { FormField } from '@primes/components/form/DynamicFormComponent';
import { iniRoutes } from './iniRoute';
import { SalesRoutes } from './salesRoute';
import { ProductionRoutes } from './ProductionRoute';
import { PurchaseRoutes } from './PurchaseRoute';
import { MoldRoutes } from './MoldRoute';
import { MachineRoutes } from './MachineRoute';
import { QualityRoutes } from './QualityRoute';
import { outsourcingRoutes } from './OutsourcingRoute';

const vendorFormSchema: FormField[] = [
	{
		name: 'compCode',
		label: '거래처 코드',
		type: 'text',
		placeholder: '거래처 코드를 입력하세요',
		required: true,
	},
	{
		name: 'type',
		label: '거래처 타입',
		type: 'select',
		required: true,
		options: [
			{ label: 'LCC', value: 'LCC' },
			{ label: '거래처', value: '거래처' },
			{ label: '공통', value: '공통' },
		],
	},
	{
		name: 'licence',
		label: '사업자 등록번호',
		type: 'text',
		placeholder: '000-00-00000',
		pattern: /^\d{3}-\d{2}-\d{5}$/,
		formatMessage: '형식: 000-00-00000',
		required: true,
		mask: '999-99-99999',
	},
	{
		name: 'description',
		label: '설명',
		type: 'textarea',
		placeholder: '입력해주세요',
	},
	{
		name: 'agreement',
		label: '약관 동의',
		type: 'checkbox',
		required: true,
	},
	{
		name: 'gender',
		label: '성별',
		type: 'radio',
		required: true,
		options: [
			{ label: '남성', value: 'male' },
			{ label: '여성', value: 'female' },
		],
	},
	{
		name: 'birthDate',
		label: '생년월일',
		type: 'date',
		required: true,
	},
	{
		name: 'contractMonth',
		label: '계약 월',
		type: 'dateMonth',
		required: true,
	},
	{
		name: 'code',
		label: '코드선택',
		type: 'codeSelect',
		fieldKey: 'codename',
		required: true,
	},
];

const routes = [
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/signup',
		element: <SignUp />,
	},
	{
		path: '/',
		element: <DashboardLayout />,
		children: [
			{
				index: true,
				element: <Dashboard />,
			},
			// THIS IS A TEST ROUTE TO TEST SOME PAGES
			{
				path: 'search-test',
				element: <SearchDialogTest />,
			},
			{
				path: 'search-modal-test',
				element: <SearchModalTestPage />,
			},
			{
				path: 'datatables-test',
				element: <DataTablesNetTest />,
			},
			{
				path: 'form-test',
				element: (
					<div className="p-3">
						<DynamicForm
							fields={vendorFormSchema}
							onSubmit={(data: any) => {
								console.log(data);
							}}
							otherTypeElements={{
								codeSelect: CodeSelectComponent,
							}}
						/>
					</div>
				),
			},
			{
				path: 'splitter-test',
				element: <SplitterTestPage />,
			},
			{
				path: 'diagram-editor-test',
				element: <DiagramEditorTest />,
			},
			{
				path: 'gantt-test',
				element: <TestGanttPage />,
			},
			{
				path: 'transaction-statement-test',
				element: <TransactionStatementTestPage />,
			},
			...iniRoutes,
			...SalesRoutes,
			...ProductionRoutes,
			...PurchaseRoutes,
			...QualityRoutes,
			...outsourcingRoutes,
			...MoldRoutes,
			...MachineRoutes,
			{
				path: '*',
				element: <NotFoundTemplate />,
			},
		],
	},
];

export const router = createBrowserRouter(routes);

export default routes;
