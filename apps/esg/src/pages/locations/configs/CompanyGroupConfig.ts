import { GroupConfig } from '@repo/moornmo-ui/types';
import { BasicToastoGridProps } from '@repo/toasto/components/grid';
const formatValue = (value: any) => ((value ?? value === 0) ? value : '-');

export const formConfigs: GroupConfig[] = [
	{
		layoutType: 'group',
		title: '기본 정보',
		fields: [
			{
				name: 'name',
				label: '사업자명',
				labelWidth: 120,
				type: 'text',
				props: {
					disabled: true,
					placeholder: '사업자명을 입력해 주세요',
				},
				span: 12,
			},
			{
				name: 'license',
				label: '사업자 등록번호',
				labelWidth: 120,
				type: 'text',
				props: {
					disabled: true,
					placeholder: '사업자 등록번호를 입력해 주세요',
				},
				span: 12,
			},
			{
				name: 'companyType',
				label: '사업자 구분',
				labelWidth: 120,
				type: 'select',
				props: {
					placeholder: '사업자 구분을 입력해 주세요',
					disabled: true,
					options: [
						{
							label: '사업자',
							value: 'COMPANY',
						},
						{
							label: '사업자',
							value: 'WORKPLACE',
						},
						{
							label: '그룹',
							value: 'GROUP',
						},
					],
				},
				span: 12,
			},
			{
				name: 'parentId',
				label: '상위 사업자',
				labelWidth: 120,
				type: 'companyName',
				props: {
					placeholder: '상위 사업자을 입력해 주세요',
					disabled: true,
					fieldName: 'name',
				},
				span: 12,
			},
			{
				name: 'businessItem',
				label: '업종',
				labelWidth: 120,
				type: 'text',
				props: {
					placeholder: '업종을 입력해 주세요',
					disabled: true,
				},
				span: 12,
			},
			{
				name: 'businessType',
				label: '업태',
				labelWidth: 120,
				type: 'text',
				props: {
					placeholder: '업태를 입력해 주세요',
					disabled: true,
				},
				span: 12,
			},
			{
				name: 'reportPercent',
				label: '보고서 비율',
				labelWidth: 120,
				type: 'text',
				props: {
					placeholder: '보고서 비율을 입력해 주세요',
					disabled: true,
				},
				span: 12,
			},
		],
	},
	{
		layoutType: 'group',
		title: '주소정보',
		fields: [
			{
				name: 'postcode',
				label: '우편번호',
				labelWidth: 120,
				type: 'text',
				props: {
					disabled: true,
					placeholder: '사업자 주소를 입력해 주세요',
				},
				span: 12,
			},
			{
				name: 'address',
				label: '주소',
				labelWidth: 120,
				type: 'text',
				props: {
					disabled: true,
					placeholder: '사업자 주소를 입력해 주세요',
				},
				span: 12,
			},
			{
				name: 'addressDetail',
				label: '상세주소',
				labelWidth: 120,
				type: 'text',
				props: {
					placeholder: '상세주소를 입력해 주세요',
					disabled: true,
				},
				span: 12,
			},
		],
	},
	{
		layoutType: 'group',
		title: '승인정보',
		fields: [
			{
				name: 'approvedCharger',
				label: '승인 담당자',
				labelWidth: 120,
				type: 'text',
				props: {
					disabled: true,
				},
				span: 12,
			},
		],
	},
];

export const columns: any = [
	{
		name: 'groupName',
		header: 'Group Name',
		width: 180,
		align: 'center',
		formatter: ({ value }: any) => formatValue(value),
	},
	{
		name: 'type',
		header: 'Type',
		width: 150,
		align: 'center',
		formatter: ({ value }: any) => {
			if (value === null || value === undefined || value === '') return '-';
			const text = typeof value === 'string' ? value : String(value);
			return text.charAt(0).toUpperCase() + text.slice(1);
		},
	},
	{
		name: 'description',
		header: 'Description',
		align: 'left',
		formatter: ({ value }: any) => formatValue(value),
	},
	{
		name: 'reportPercent',
		header: 'Report Percent',
		width: 120,
		align: 'center',
		formatter: ({ value }: any) => formatValue(value),
	},
	{
		name: 'isOpenToPublic',
		header: 'Public',
		width: 60,
		align: 'center',
		formatter: ({ value }: any) =>
			value === true ? 'Yes' : value === false ? 'No' : '-',
	},
	{
		name: 'createdAt',
		header: 'Created Time',
		width: 180,
		align: 'center',
		formatter: ({ value }: any) => formatValue(value),
	},
	{
		name: 'updatedAt',
		header: 'Updated Time',
		width: 180,
		align: 'center',
		formatter: ({ value }: any) => formatValue(value),
	},
];

export const gridOptions: BasicToastoGridProps['gridOptions'] = {
	rowHeaders: ['checkbox'],
	singleCheck: true,
	header: {
		height: 40,
	},
	treeColumnOptions: {
		name: 'groupName',
		useCascadingCheckbox: true,
		initialExpand: true,
	},
};

export const modalFormConfigs: GroupConfig[] = [
	{
		layoutType: 'group',
		title: '그룹 정보',
		fields: [
			{
				name: 'groupName',
				label: '그룹명:',
				labelWidth: 120,
				type: 'text',
				props: {
					placeholder: '그룹명을 입력해 주세요',
				},
				span: 12,
			},
			{
				name: 'type',
				label: '그룹유형',
				labelWidth: 120,
				type: 'select',
				props: {
					placeholder: '유형을 선택해주세요',
					options: [
						{
							label: 'Classification Group',
							value: 'Classification',
						},
						{ label: 'Portfolio Group', value: 'Portfolio' },
					],
				},
				span: 12,
			},
			{
				name: 'parentId',
				label: '소속',
				labelWidth: 120,
				type: 'groupSelect',
				props: {
					placeholder: '선택해 주세요',
					fieldName: 'groupName',
					required: true,
					validation: {
						validate: (value: any) => {
							if (value === null || value === undefined || value === '') {
								return {
									type: 'required',
									message: '소속을 선택해주세요',
								};
							}
							return true;
						},
					},
				},
				span: 12,
			},
			{
				name: 'description',
				label: '설명',
				labelWidth: 120,
				type: 'textarea',
				props: {
					placeholder: '설명을 입력해 주세요',
				},
				span: 12,
			},
			{
				name: 'reportPercent',
				label: '보고서 비율',
				labelWidth: 120,
				type: 'number',
				props: {
					placeholder: '보고서 비율을 입력해 주세요',
					min: 0,
					max: 100,
					validation: {
						validate: (value: number) => {
							if (value < 0)
								return {
									type: 'min',
									message:
										'보고서 비율은 0보다 작을 수 없습니다',
								};
							if (value > 100)
								return {
									type: 'max',
									message:
										'보고서 비율은 100보다 클 수 없습니다',
								};
							return true;
						},
					},
				},
				span: 12,
			},
			{
				name: 'isOpenToPublic',
				label: '공개 여부',
				labelWidth: 120,
				type: 'select',
				props: {
					placeholder: '선택해주세요',
					options: [
						{ label: '아니요', value: false },
						{ label: '예', value: true },
					],
				},
				span: 12,
			},
		],
	},
];
