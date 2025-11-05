import { GroupConfig } from '@repo/moornmo-ui/types';
import { BasicToastoGridProps } from '@repo/toasto/components/grid';

export const accountGridOptions: BasicToastoGridProps['gridOptions'] = {
	columnOptions: {
		resizable: true,
	},
	singleCheck: true,
	rowHeaders: ['checkbox'],
	header: {
		height: 40,
	},
};
export const accountGridColumns: BasicToastoGridProps['columns'] = [
	{
		header: '관리항목명',
		name: 'name',
		width: 200,
		align: 'center',
	},
	{
		header: '관리항목 Style',
		name: 'account_style_name',
		width: 350,
		align: 'center',
	},
	{
		header: '미터기 연동 여부',
		name: 'useMeter',
		align: 'center',
		width: 100,
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
		width: 100,
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
		width: 100,
	},
];

export const recordGridOptions: BasicToastoGridProps['gridOptions'] = {
	columnOptions: {
		frozenCount: 2, // 관리항목명, 단위 컬럼 고정
		resizable: true,
	},
	scrollX: true, // 가로 스크롤 활성화 (월별 컬럼이 많아서)
	scrollY: true, // 세로 스크롤 활성화
	bodyHeight: 'fitToParent', // 부모 높이에 맞춤
	editingEvent: 'click', // 클릭으로 편집 시작
	rowHeaders: ['rowNum'], // 행 번호만 표시 (체크박스 제거)
	header: {
		height: 80,
		complexColumns: [
			{
				header: '기본 정보',
				name: 'basic',
				childNames: ['accountName', 'unit'],
			},
			{
				header: '월별 사용량',
				name: 'monthly',
				childNames: [
					'jan',
					'feb',
					'mar',
					'apr',
					'may',
					'jun',
					'jul',
					'aug',
					'sep',
					'oct',
					'nov',
					'dec',
				],
			},
			{
				header: '집계',
				name: 'summary',
				childNames: ['total'],
			},

		],
	},
	freeze: {
		columns: 2,
	},
};

export const recordGridColumns: BasicToastoGridProps['columns'] = [
	{
		name: 'accountName',
		header: '관리항목명',
		align: 'center',
		width: 200,
		className: 'clickable-cell text-primary',
		formatter: ({ value }) => `📋 ${value}`,
	},
	{
		name: 'unit',
		header: '단위',
		align: 'center',
		width: 80,
	},
	{
		name: 'jan',
		header: '1월',
		align: 'right',
		width: 100,
		editor: 'text',
		validation: {
			dataType: 'number',
			min: 0,
		},
		formatter: ({ value }) => (value ? Number(value).toLocaleString() : ''),
	},
	{
		name: 'feb',
		header: '2월',
		align: 'right',
		width: 100,
		editor: 'text',
		validation: {
			dataType: 'number',
			min: 0,
		},
		formatter: ({ value }) => (value ? Number(value).toLocaleString() : ''),
	},
	{
		name: 'mar',
		header: '3월',
		align: 'right',
		width: 100,
		editor: 'text',
		validation: {
			dataType: 'number',
			min: 0,
		},
		formatter: ({ value }) => (value ? Number(value).toLocaleString() : ''),
	},
	{
		name: 'apr',
		header: '4월',
		align: 'right',
		width: 100,
		editor: 'text',
		validation: {
			dataType: 'number',
			min: 0,
		},
		formatter: ({ value }) => (value ? Number(value).toLocaleString() : ''),
	},
	{
		name: 'may',
		header: '5월',
		align: 'right',
		width: 100,
		editor: 'text',
		validation: {
			dataType: 'number',
			min: 0,
		},
		formatter: ({ value }) => (value ? Number(value).toLocaleString() : ''),
	},
	{
		name: 'jun',
		header: '6월',
		align: 'right',
		width: 100,
		editor: 'text',
		validation: {
			dataType: 'number',
			min: 0,
		},
		formatter: ({ value }) => (value ? Number(value).toLocaleString() : ''),
	},
	{
		name: 'jul',
		header: '7월',
		align: 'right',
		width: 100,
		editor: 'text',
		validation: {
			dataType: 'number',
			min: 0,
		},
		formatter: ({ value }) => (value ? Number(value).toLocaleString() : ''),
	},
	{
		name: 'aug',
		header: '8월',
		align: 'right',
		width: 100,
		editor: 'text',
		validation: {
			dataType: 'number',
			min: 0,
		},
		formatter: ({ value }) => (value ? Number(value).toLocaleString() : ''),
	},
	{
		name: 'sep',
		header: '9월',
		align: 'right',
		width: 100,
		editor: 'text',
		validation: {
			dataType: 'number',
			min: 0,
		},
		formatter: ({ value }) => (value ? Number(value).toLocaleString() : ''),
	},
	{
		name: 'oct',
		header: '10월',
		align: 'right',
		width: 100,
		editor: 'text',
		validation: {
			dataType: 'number',
			min: 0,
		},
		formatter: ({ value }) => (value ? Number(value).toLocaleString() : ''),
	},
	{
		name: 'nov',
		header: '11월',
		align: 'right',
		width: 100,
		editor: 'text',
		validation: {
			dataType: 'number',
			min: 0,
		},
		formatter: ({ value }) => (value ? Number(value).toLocaleString() : ''),
	},
	{
		name: 'dec',
		header: '12월',
		align: 'right',
		width: 100,
		editor: 'text',
		validation: {
			dataType: 'number',
			min: 0,
		},
		formatter: ({ value }) => (value ? Number(value).toLocaleString() : ''),
	},
	{
		name: 'total',
		header: '합계',
		align: 'right',
		width: 120,
		className: 'total-column',
		formatter: ({ value }) =>
			value ? Number(value).toLocaleString() : '0',
		// 합계는 편집 불가 (자동 계산)
	},

];

export const formConfigs: GroupConfig[] = [
	{
		layoutType: 'group',
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
				name: 'accountId',
				label: '관리항목명',
				labelWidth: 120,
				type: 'accountSelect',
				props: {
					required: true,
					placeholder: '선택해주세요',
					fieldName: 'name',
					refererName: 'companyId',
				},
				span: 12,
			},
			{
				name: 'accountMonth',
				label: '회계년월',
				labelWidth: 120,
				type: 'yearMonth',
				props: {
					required: true,
					placeholder: '선택해주세요',
				},
				span: 12,
			},
			{
				name: 'quantity',
				label: '사용량',
				labelWidth: 120,
				type: 'number',
				props: {
					required: true,
					placeholder: '선택해주세요',
				},
				span: 12,
			},
			{
				name: 'reference',
				label: '참조',
				labelWidth: 120,
				type: 'text',
				props: {
					placeholder: '입력해주세요',
				},
				span: 12,
			},

			{
				name: 'invoiceMemo',
				label: '메모',
				labelWidth: 120,
				type: 'textarea',
				props: {
					placeholder: '입력해주세요',
				},
				span: 12,
			},
		],
	},
];
