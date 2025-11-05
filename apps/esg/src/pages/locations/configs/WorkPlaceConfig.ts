import { GroupConfig } from '@repo/moornmo-ui/types';
import { BasicToastoGridProps } from '@repo/toasto/components/grid';

export const gridOptions: BasicToastoGridProps['gridOptions'] = {
	columnOption: {
		resizeable: true,
	},
	rowHeaders: ['rowNum', 'checkbox'],
	singleCheck: true,
	header: {
		height: 40,
	},
	treeColumnOptions: {
		name: 'company_name',
		useIcon: true,
		useCascadingCheckbox: false,
	},
};

export const columns: BasicToastoGridProps['columns'] = [
	{
		header: '사업장명',
		name: 'name',
		align: 'center',
		width: 200,
	},
	{
		header: '우편번호',
		name: 'postcode',
		align: 'center',
		width: 100,
	},
	{
		header: '사업장 주소',
		name: 'address',
		width: 300,
	},
	{
		header: '사업장 상세 주소',
		name: 'addressDetail',
		width: 200,
	},
	{
		header: '생성일시',
		name: 'createdAt',
		align: 'right',
		width: 200,
	},
	{
		header: '생성자',
		name: 'createdBy',
		align: 'center',
		width: 200,
	},
	{
		header: '마지막 수정 일시',
		name: 'updatedAt',
		align: 'right',
		width: 200,
	},
	{
		header: '마지막 수정자',
		name: 'updatedBy',
		align: 'center',
		width: 200,
	},
];

export const modalFormConfigs: GroupConfig[] = [
	{
		layoutType: 'group',
		title: '기본 정보',
		fields: [
			{
				name: 'name',
				label: '사업장명',
				labelWidth: 120,
				type: 'text',
				props: {
					placeholder: '사업장명을 입력해 주세요',
				},
				span: 12,
			},
			{
				name: 'address',
				label: '주소',
				labelWidth: 120,
				type: 'postCode',
				props: {
					placeholder: '사업장 주소를 입력해 주세요',
					valueKey: {
						zipCode: 'postcode',
						roadAddress: 'address',
						detailAddress: 'addressDetail',
					},
				},
				span: 12,
			},
		],
	},
];
