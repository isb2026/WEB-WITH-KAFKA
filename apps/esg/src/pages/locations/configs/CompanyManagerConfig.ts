import { GroupConfig } from '@repo/moornmo-ui/types';
import { BasicToastoGridProps } from '@repo/toasto/components/grid';

export const gridOptions: BasicToastoGridProps['gridOptions'] = {
	columnOption: {
		resizeable: true,
	},
	rowHeaders: ['rowNum', 'checkbox'],
	header: {
		height: 40,
	},
	selectionUnit: 'row',
	bodyHeight: 'auto',
	// Enable single checkbox selection so onRowCheckChange fires
	singleCheck: true,
	// Enable client-side sorting without changing fetch logic
	sort: {
		useClient: true,
		initialState: {
			columnName: 'id',
			ascending: true,
		},
	},
};

export const columns: BasicToastoGridProps['columns'] = [
	{
		header: 'ID',
		name: 'id',
		width: 80,
		align: 'center',
		sortable: true,
	},
	{
		header: '담당자명',
		name: 'name',
		width: 120,
		align: 'center',
		sortable: true,
	},
	{
		header: '사용자 ID',
		name: 'username',
		width: 150,
		align: 'center',
		sortable: true,
	},
	{
		header: '부서',
		name: 'department',
		width: 120,
		align: 'center',
		sortable: true,
	},
	{
		header: '전화번호',
		name: 'phone',
		width: 150,
		align: 'center',
		sortable: true,
	},
	{
		header: '주소',
		name: 'address',
		width: 200,
		align: 'center',
		sortable: true,
	},
];

export const formConfigs: GroupConfig[] = [
	{
		layoutType: 'group',
		title: '담당자 정보',
		fields: [
			{
				name: 'company_name',
				label: '사업장명',
				labelWidth: 120,
				type: 'companySelect',
				props: {
					required: true,
					placeholder: '선택해 주세요',
					fieldName: 'name',
				},
				span: 12,
			},
			{
				name: 'user_name',
				label: '담당자명',
				labelWidth: 120,
				type: 'text',
				props: {
					required: true,
					placeholder: '입력해주세요',
				},
				span: 12,
			},
			{
				name: 'department',
				label: '부서',
				labelWidth: 120,
				type: 'text',
				props: {
					placeholder: '부서명을 입력해주세요',
					required: true,
				},
				span: 12,
			},
			{
				name: 'login_id',
				label: 'ID',
				labelWidth: 120,
				type: 'text',
				props: {
					required: true,
					placeholder: '입력해주세요',
				},
				span: 12,
			},
			{
				name: 'login_password',
				label: 'PW',
				labelWidth: 120,
				type: 'password',
				props: {
					required: true,
					placeholder: '입력해주세요',
				},
				span: 12,
			},
			{
				name: 'user_email',
				label: 'E-mail',
				labelWidth: 120,
				type: 'text',
				props: {
					required: false,
					placeholder: '입력해주세요',
				},
				span: 12,
			},
			{
				name: 'user_phone',
				label: '전화번호',
				labelWidth: 120,
				type: 'text',
				props: {
					required: false,
					placeholder: '입력해주세요',
				},
				span: 12,
			},
		],
	},
];
