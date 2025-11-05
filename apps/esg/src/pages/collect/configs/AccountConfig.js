export const masterGridColumns = [
	{
		header: '구분',
		name: 'name',
	},
];

export const masterGridOptions = {
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
		useCascadingCheckbox: true,
	},
};

export const detailGridColumns = [
	{
		header: 'DataType',
		name: 'data_type',
		width: 250,
		align: 'left',
	},
	{
		header: 'Scope',
		name: 'scope',
		align: 'left',
	},
	{
		header: 'Category',
		name: 'category',
		align: 'left',
	},
	{
		header: 'Account Style Name',
		name: 'account_style_name',
		align: 'left',
	},
	{
		header: 'Account Style Caption',
		name: 'ccount_style_caption',
		align: 'left',
	},
];

export const detailGridOptions = {
	columnOptions: {
		resizable: true,
	},
	rowHeaders: ['checkbox'],
	header: {
		height: 40,
	},
};

export const formConfigs = [
	{
		layoutType: 'group',
		title: 'Category 정보',
		fields: [
			{
				name: 'group',
				label: '계열사명',
				labelWidth: 120,
				type: 'select',
				props: {
					required: true,
					placeholder: '선택해주세요',
					options: [
						{
							label: 'Group A',
							value: 'Group A',
						},
					],
				},
				span: 6,
			},
			{
				name: 'location',
				label: '사업장명',
				labelWidth: 120,
				type: 'select',
				props: {
					required: true,
					placeholder: '선택해주세요',
					options: [
						{
							label: 'Location A',
							value: 'Location A',
						},
						{
							label: 'Location B',
							value: 'Location B',
						},
					],
				},
				span: 6,
			},
			{
				name: 'account',
				label: 'Account 명칭',
				type: 'text',
				labelWidth: 120,
				props: {
					required: true,
					placeholder: '입력해주세요.',
				},
				span: 12,
			},
		],
	},
	{
		layoutType: 'group',
		title: 'Account 정보',
		fields: [
			{
				name: 'address',
				label: '주소',
				type: 'text',
				labelWidth: 120,
				props: {
					required: true,
					placeholder: '입력해주세요.',
				},
				span: 12,
			},
			{
				name: 'manager',
				label: '담당자',
				type: 'text',
				labelWidth: 120,
				props: {
					required: true,
					placeholder: '입력해주세요.',
				},
				span: 12,
			},
			{
				name: 'email',
				label: '담당자 메일',
				type: 'email',
				labelWidth: 120,
				props: {
					placeholder: '입력해주세요.',
				},
				span: 12,
			},
			{
				name: 'tel',
				label: '연락처',
				type: 'email',
				labelWidth: 120,
				props: {
					placeholder: '입력해주세요.',
				},
				span: 12,
			},
			{
				name: 'latitude',
				label: '위도',
				type: 'number',
				labelWidth: 120,
				props: {
					placeholder: '입력해주세요.',
				},
				span: 6,
			},
			{
				name: 'hardness',
				label: '경도',
				type: 'number',
				labelWidth: 120,
				props: {
					placeholder: '입력해주세요.',
				},
				span: 6,
			},
		],
	},
];
