import { AccountStyleSelect } from './../../../components/forms/selects/AccountStyleSelect';
import { GroupConfig } from '@repo/moornmo-ui/types';
import { BasicToastoGridProps } from '@repo/toasto/components/grid';

export const masterGridColumns: BasicToastoGridProps['columns'] = [
	{
		header: '-',
		name: 'name',
	},
	// {
	// 	header: '그룹타입',
	// 	name: 'group_type',
	// },
	// {
	// 	header: '사업장명',
	// 	name: 'company_name',
	// },
];

export const masterGridOptions: BasicToastoGridProps['gridOptions'] = {
	columnOptions: {
		resizable: true,
		filterable: true,
	},
	rowHeaders: ['checkbox'],
	header: {
		height: 40,
	},
	treeColumnOptions: {
		name: 'name',
		useIcon: true,
		useCascadingCheckbox: false,
	},
};

export const detailGridColumns: BasicToastoGridProps['columns'] = [
	{
		header: '관리항목명',
		name: 'name',
		width: 200,
		align: 'center',
		className: 'clickable-cell',
	},
	{
		header: '입력단위',
		name: 'unit',
		width: 80,
		align: 'center',
	},
	{
		header: '관리항목 Style',
		name: 'account_style_name',
		width: 300,
		align: 'left',
	},
	{
		header: 'Scope',
		name: 'scope',
		width: 100,
		align: 'center',
	},
	{
		header: '미터기 연동 여부',
		name: 'useMeter',
		align: 'center',
		width: 100,
	},
	{
		header: '담당자',
		name: 'chargerName',
		align: 'center',
		width: 120,
	},
	{
		header: '담당자 부서',
		name: 'chargerDepartment',
		align: 'center',
		width: 120,
	},
	{
		header: '생성자',
		name: 'createdBy',
		align: 'center',
		width: 100,
	},
	{
		header: '생성 일시',
		name: 'createdAt',
		align: 'right',
		width: 150,
	},
	{
		header: '마지막 수정자',
		name: 'updatedBy',
		align: 'center',
		width: 100,
	},
	{
		header: '마지막 일시',
		name: 'updatedAt',
		align: 'right',
		width: 150,
	},
];

export const detailGridOptions: BasicToastoGridProps['gridOptions'] = {
	columnOptions: {
		resizable: true,
	},
	rowHeaders: ['checkbox', 'rowNum'],
	header: {
		height: 40,
	},
};

export const formConfigs: GroupConfig[] = [
	{
		layoutType: 'group',
		title: '관리항목 정보',
		fields: [
			{
				name: 'companyId',
				label: '사업장명',
				labelWidth: 120,
				type: 'companySelect',
				props: {
					required: true,
					placeholder: '선택해주세요.',
					fieldName: 'name',
				},
				span: 12,
			},
			{
				name: 'name',
				label: '관리항목명',
				labelWidth: 120,
				type: 'text',
				props: {
					required: true,
					placeholder: '입력해주세요',
					fieldName: 'name',
				},
				span: 12,
			},
			{
				name: 'accountStyleId',
				label: '관리항목 Style',
				labelWidth: 120,
				type: 'accountStyleSelect',
				props: {
					required: true,
					placeholder: '선택해주세요',
					options: [],
					fieldName: 'caption',
				},
				span: 12,
			},
			{
				name: 'unit',
				label: '입력 단위',
				labelWidth: 120,
				type: 'text',
				props: {
					required: true,
					disabled: true,
					placeholder: '입력해주세요',
				},
				span: 12,
			},
			{
				name: 'ghgScope',
				label: 'Scope 구분',
				labelWidth: 120,
				type: 'text',
				props: {
					required: true,
					disabled: true,
					placeholder: '입력해주세요',
				},
				span: 12,
			},
			{
				name: 'chargerId',
				label: '담당자',
				labelWidth: 120,
				type: 'chargerSelect',
				props: {
					required: false,
					placeholder: '담당자를 선택하세요',
				},
				span: 12,
			},
		],
	},
];

export const masterGridDataSample: any[] = [
	{
		name: 'Classification Group',
		is_group: true,
		_children: [
			{
				name: '무른모',
				is_group: true,
				group_id: 1,
				_children: [
					{
						name: '무른모 본사',
						id: 1,
						is_group: false,
					},
					{
						name: '무른모 송도',
						id: 2,
						is_group: false,
					},
				],
			},
		],
	},
	{
		name: 'Locations by Region',
		is_group: true,
		_children: [
			{
				name: '인천',
				is_group: true,
				group_id: 2,
				_children: [
					{
						name: '무른모',
						id: 1,
						is_group: false,
					},
				],
			},
			{
				name: '서울',
				is_group: true,
				group_id: 3,
				_children: [
					{
						name: '무른모 서울지사',
						id: 1,
						is_group: false,
					},
				],
			},
		],
	},
];

export const detailGridDataSample: any[] = [
	{
		account_name: '무른모 차량A',
		account_style_name: 'Universal - S2 - Refrigerants - R422B - lbs',
		account_style_caption: 'Refrigerants',
		use_meter: 'N',
		create_user: '관리자',
		create_dt: '2025-05-01 14:00:00',
	},
	{
		account_name: '무른모 차량B',
		account_style_name: 'Universal - S2 - Refrigerants - R422B - lbs',
		account_style_caption: 'Refrigerants',
		use_meter: 'N',
		create_user: '관리자',
		create_dt: '2025-05-01 14:00:00',
	},
	{
		account_name: '무른모 설비A',
		account_style_name: 'Universal - S1 - Refrigerants - R424A - lbs',
		account_style_caption: 'Refrigerants',
		use_meter: 'N',
		create_user: '관리자',
		create_dt: '2025-05-01 14:00:00',
	},
	{
		account_name: '무른모 설비B',
		account_style_name: 'Universal - S1 - Refrigerants - R424A - lbs',
		account_style_caption: 'Refrigerants',
		use_meter: 'N',
		create_user: '관리자',
		create_dt: '2025-05-01 14:00:00',
	},
];
