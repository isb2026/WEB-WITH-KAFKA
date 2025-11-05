export const formConfigs = [
	{
		layoutType: 'group',
		title: '입고 정보',
		fields: [
			{
				name: 'estimate_code',
				label: '입고코드',
				labelWidth: 80,
				type: 'text',
				props: {
					placeholder: '자동부여됩니다.',
					disabled: true,
				},
				span: 12,
			},
			{
				name: 'vendor_name',
				label: '업체명',
				labelWidth: 80,
				type: 'select',
				props: {
					required: true,
					placeholder: '선택해주세요.',
					options: [
						{
							label: 'Vendor1',
							value: 'Vendor1',
						},
						{
							label: 'Vendor2',
							value: 'Vendor2',
						},
						{
							label: 'Vendor3',
							value: 'Vendor3',
						},
						{
							label: 'Vendor4',
							value: 'Vendor4',
						},
						{
							label: 'Vendor5',
							value: 'Vendor5',
						},
						{
							label: 'Vendor6',
							value: 'Vendor6',
						},
						{
							label: 'Vendor7',
							value: 'Vendor7',
						},
						{
							label: 'Vendor8',
							value: 'Vendor8',
						},
						{
							label: 'Vendor9',
							value: 'Vendor9',
						},
						{
							label: 'Vendor10',
							value: 'Vendor10',
						},
					],
				},
				span: 12,
			},
			{
				name: 'tax_date',
				label: '의뢰일자',
				labelWidth: 80,
				type: 'date',
				props: {
					is_default: true,
				},
				span: 12,
			},
		],
	},
];
