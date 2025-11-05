export const getTranslatedVendorConfigs = (t: (key: string) => string) => [
	{
		layoutType: 'group',
		title: t('modal.form_title'),
		fields: [
			{
				name: 'compCode',
				label: t('fields.company_code'),
				type: 'text',
				props: {
					required: true,
					placeholder: t('placeholders.enter_company_code'),
				},
				span: 6,
			},
			{
				name: 'compName',
				label: t('fields.company_name'),
				type: 'text',
				props: {
					required: true,
					placeholder: t('placeholders.enter_company_name'),
				},
				span: 6,
			},
			{
				name: 'ceoName',
				label: t('fields.ceo_name'),
				type: 'text',
				props: {
					required: true,
					placeholder: t('placeholders.enter_ceo_name'),
				},
				span: 6,
			},
			{
				name: 'compType',
				label: t('fields.business_type'),
				type: 'text',
				props: {
					placeholder: t('placeholders.enter_business_type'),
				},
				span: 6,
			},
			{
				name: 'licenseNo',
				label: t('fields.license_number'),
				type: 'text',
				props: {
					required: true,
					placeholder: t('placeholders.enter_license_number'),
				},
				span: 6,
			},
			{
				name: 'telNumber',
				label: t('fields.phone'),
				type: 'text',
				props: {
					placeholder: t('placeholders.enter_phone'),
				},
				span: 6,
			},
			{
				name: 'faxNumber',
				label: t('fields.fax'),
				type: 'text',
				props: {
					placeholder: t('placeholders.enter_fax'),
				},
				span: 6,
			},
			{
				name: 'compEmail',
				label: t('fields.email'),
				type: 'text',
				props: {
					placeholder: t('placeholders.enter_email'),
				},
				span: 6,
			},
			{
				name: 'zipCode',
				label: t('fields.zip_code'),
				type: 'text',
				props: {
					placeholder: t('placeholders.enter_zip_code'),
				},
				span: 6,
			},
			{
				name: 'addressMst',
				label: t('fields.address'),
				type: 'text',
				props: {
					placeholder: t('placeholders.enter_address'),
				},
				span: 12,
			},
			{
				name: 'addressDtl',
				label: t('fields.detail_address'),
				type: 'text',
				props: {
					placeholder: t('placeholders.enter_detail_address'),
				},
				span: 12,
			},
			{
				name: 'useState',
				label: t('fields.use_state'),
				type: 'toggle',
				props: {},
				span: 6,
			},
		],
	},
];

export const getTranslatedVendorColumns = (t: (key: string) => string) => [
	{ header: t('columns.id'), name: 'id', align: 'center' as const, width: 80 },
	{ header: t('columns.company_code'), name: 'compCode', width: 120 },
	{ header: t('columns.company_name'), name: 'compName', width: 150 },
	{ header: t('columns.ceo_name'), name: 'ceoName', width: 120 },
	{ header: t('columns.business_type'), name: 'compType', width: 100 },
	{ header: t('columns.license_number'), name: 'licenseNo', width: 130 },
	{ header: t('columns.phone'), name: 'telNumber', width: 120 },
	{ header: t('columns.fax'), name: 'faxNumber', width: 120 },
	{ header: t('columns.email'), name: 'compEmail', width: 150 },
	{ header: t('columns.zip_code'), name: 'zipCode', width: 100 },
	{ header: t('columns.address'), name: 'addressMst', width: 200 },
	{ header: t('columns.detail_address'), name: 'addressDtl', width: 200 },
	{
		header: t('columns.use_state'),
		name: 'useState',
		width: 100,
	},
];

export const getTranslatedVendorSearchOptions = (t: (key: string) => string) => [
	{
		name: 'compName',
		label: t('search.company_name'),
		type: 'text',
		props: {
			placeholder: t('placeholders.enter_company_name'),
		},
		span: 12,
	},
	{
		name: 'compCode',
		label: t('search.company_code'),
		type: 'text',
		props: {
			placeholder: t('placeholders.enter_company_code'),
		},
		span: 12,
	},
	{
		name: 'ceoName',
		label: t('search.ceo_name'),
		type: 'text',
		props: {
			placeholder: t('placeholders.enter_ceo_name'),
		},
		span: 12,
	},
	{
		name: 'compType',
		label: t('search.business_type'),
		type: 'text',
		props: {
			placeholder: t('placeholders.enter_business_type'),
		},
		span: 12,
	},
	{
		name: 'licenseNo',
		label: t('search.license_number'),
		type: 'text',
		props: {
			placeholder: t('placeholders.enter_license_number'),
		},
		span: 12,
	},
];

export const getTranslatedQuickSearchConfigs = (t: (key: string) => string) => [
	{ name: t('search.company_name'), key: 'compName' },
	{ name: t('search.company_code'), key: 'compCode' },
	{ name: t('search.ceo_name'), key: 'ceoName' },
	{ name: t('search.license_number'), key: 'licenseNo' },
]; 