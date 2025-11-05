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
		header: '미터기 명',
		name: 'meter_name',
		align: 'center',
		width: 150,
	},
	{
		header: 'Service Point',
		name: 'service_point',
		width: 150,
	},
	{
		header: 'Serial Number',
		name: 'serial_number',
		align: 'center',
		width: 120,
	},
	{
		header: '연동데이터',
		name: 'component',
		width: 100,
	},
	{
		header: '관리항목명',
		name: 'account_name',
		width: 200,
		align: 'center',
	},
	{
		header: '관리항목 Style',
		name: 'account_style_name',
		width: 250,
		align: 'center',
	},
	{
		header: '설치 일자',
		name: 'installed_on',
		align: 'center',
		width: 100,
	},
	{
		header: '교체 일자',
		name: 'replaced_on',
		width: 100,
	},
	{
		header: '메모',
		name: 'memo',
		width: 200,
	},
];

export const detailGridOptions: BasicToastoGridProps['gridOptions'] = {
	columnOptions: {
		resizable: true,
	},
	rowHeaders: ['checkbox'],
	header: {
		height: 40,
	},
};

export const formConfigs: GroupConfig[] = [
	{
		layoutType: 'group',
		title: '미터기 정보',
		fields: [
			{
				name: 'meter_name',
				label: '미터기 명',
				labelWidth: 120,
				type: 'text',
				props: {
					required: true,
					placeholder: '선택해주세요.',
				},
				span: 12,
			},
			{
				name: 'service_point',
				label: 'Service Point',
				labelWidth: 120,
				type: 'text',
				props: {
					required: true,
					placeholder: '입력해주세요',
				},
				span: 12,
			},
			{
				name: 'serial_number',
				label: 'Serial Number',
				labelWidth: 120,
				type: 'text',
				props: {
					required: true,
					placeholder: '선택해주세요',
				},
				span: 12,
			},
			{
				name: 'component',
				label: '연동데이터',
				labelWidth: 120,
				type: 'select',
				props: {
					required: true,
					placeholder: '선택해주세요',
					options: [
						{
							label: '한전',
							value: '한전',
						},
						{
							label: '수도',
							value: '수도',
						},
						{
							label: '가스',
							value: '가스',
						},
					],
				},
				span: 12,
			},
			{
				label: '관리항목',
				labelWidth: 120,
				type: 'select',
				props: {
					required: true,
					placeholder: '선택해주세요',
					options: [],
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
