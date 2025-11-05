import { BasicToastoGridProps } from '@repo/toasto/components/grid';

export const gridOptions: BasicToastoGridProps['gridOptions'] = {
	columnOption: {
		resizeable: true,
	},
	rowHeaders: ['rowNum'],
	header: {
		height: 40,
	},
	// treeColumnOptions: {
	// 	name: 'group_name',
	// 	useIcon: true,
	// 	useCascadingCheckbox: true,
	// },
};

export const columns: BasicToastoGridProps['columns'] = [
	{ header: '회계년월', name: 'accountMonth', width: 120 },
	{ header: '회사', name: 'companyName', width: 200 },
	{ header: '관리항목 ', name: 'accountName', width: 200 },
	{ header: '관리항목 스타일', name: 'accountStyleName' },
	{ header: '상태', name: 'status', width: 120 },
];

export const modalGridColumns: BasicToastoGridProps['columns'] = [
	{
		header: '관리항목명',
		name: 'name',
		width: 200,
		align: 'center',
	},
	{
		header: '단위',
		name: 'unit',
		width: 100,
		align: 'center',
	},
	{
		header: '관리항목 담당자',
		name: 'accountManager',
		width: 150,
		align: 'center',
	},
	{
		header: '관리항목 Style',
		name: 'account_style_name',
		align: 'center',
		width: 300,
	},
	{
		header: '미터기 연동 여부',
		name: 'useMeter',
		align: 'center',
		width: 100,
	},
];
