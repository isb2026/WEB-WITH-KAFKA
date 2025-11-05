import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@repo/radix-ui/hook';

import { MoldInstanceDto } from '@primes/types/mold';
import { useTranslation } from '@i18n/index';

export const moldInstanceSearchFields = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'moldInstanceCode',
			label: t('columns.instanceCode'),
			type: 'text',
			placeholder: '인스턴스 코드를 입력하세요',
		},
		{
			name: 'moldCode',
			label: t('columns.moldCode'),
			type: 'text',
			placeholder: '금형 코드를 입력하세요',
		},
		{
			name: 'moldInstanceName',
			label: t('columns.instanceName'),
			type: 'text',
			placeholder: '인스턴스명을 입력하세요',
		},
		{
			name: 'moldInstanceNumber',
			label: t('columns.instanceNumber'),
			type: 'text',
			placeholder: '인스턴스 번호를 입력하세요',
		},
		{
			name: 'moldInstanceStandard',
			label: t('columns.instanceStandard'),
			type: 'text',
			placeholder: '인스턴스 규격을 입력하세요',
		},
		{
			name: 'grade',
			label: t('columns.grade'),
			type: 'text',
			placeholder: '등급을 입력하세요',
		},
		{
			name: 'moldLife',
			label: t('columns.moldLife'),
			type: 'number',
			placeholder: '금형 수명을 입력하세요',
		},
		{
			name: 'series',
			label: t('columns.series'),
			type: 'number',
			placeholder: '시리즈를 입력하세요',
		},
		{
			name: 'progTypeCode',
			label: t('columns.progressTypeCode'),
			type: 'text',
			placeholder: '공정 코드를 입력하세요',
		},
		{
			name: 'itemId',
			label: t('columns.itemId'),
			type: 'number',
			placeholder: '품목 ID를 입력하세요',
		},
		{ name: 'inDate', label: '입고일', type: 'date' },
		{
			name: 'keepPlace',
			label: t('columns.keepPlace'),
			type: 'text',
			placeholder: '보관 장소를 입력하세요',
		},
		{
			name: 'isUse',
			label: t('columns.isUse'),
			type: 'select',
			options: [
				{ label: '사용', value: 'true' },
				{ label: '미사용', value: 'false' },
			],
		},
	] as FormField[];
};

export const moldInstanceColumns = () => {
	const { t } = useTranslation('dataTable');
	
	return [
		{
			accessorKey: 'moldCode',
			header: t('columns.moldCode'),
			size: 100,
		},
		{
			accessorKey: 'moldInstanceCode',
			header: t('columns.instanceCode'),
			size: 120,
		},
		{
			accessorKey: 'moldInstanceName',
			header: t('columns.instanceName'),
			size: 150,
		},
		{
			accessorKey: 'moldInstanceStandard',
			header: t('columns.instanceStandard'),
			size: 150,
		},
		{
			accessorKey: 'grade',
			header: t('columns.grade'),
			size: 100,
		},
		{
			accessorKey: 'currentStock',
			header: t('columns.currentStock'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'currentCount',
			header: t('columns.currentCount'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'isManage',
			header: t('columns.isManage'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? t('columns.lifeManagement') : t('columns.amountManagement');
			},
		},
		{
			accessorKey: 'isUse',
			header: t('columns.isUse'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '사용' : '미사용';
			},
		},
		{
			accessorKey: 'inDate',
			header: t('columns.inDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'maxCount',
			header: t('columns.maxCount'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'keepPlace',
			header: t('columns.keepPlace'),
			size: 100,
		},
		{
			accessorKey: 'isEnd',
			header: t('columns.isEnd'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? 'Y' : 'N';
			},
		}
	]
};

export const moldInstanceQuickSearchFields = () => {
	const { t } = useTranslation('dataTable');

	return [
		{ key: 'moldInstanceCode', value: t('columns.instanceCode'), active: true },
		{ key: 'moldInstanceName', value: t('columns.instanceName'), active: false },
		{ key: 'moldCode', value: t('columns.moldCode'), active: false },
		{ key: 'grade', value: t('columns.grade'), active: false },
	]
};