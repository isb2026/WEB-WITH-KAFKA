import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { MoldGradeDto } from '@primes/types/mold';

export const moldGradeSearchFields: FormField[] = [
	{
		name: 'grade',
		label: '등급',
		type: 'text',
		placeholder: '등급을 입력하세요',
	},
	{
		name: 'method',
		label: '방법',
		type: 'text',
		placeholder: '방법을 입력하세요',
	},
	{
		name: 'gradeOrder',
		label: '순서',
		type: 'number',
		placeholder: '순서를 입력하세요',
	},
	{
		name: 'min',
		label: '최소값',
		type: 'number',
		placeholder: '최소값을 입력하세요',
	},
	{
		name: 'max',
		label: '최대값',
		type: 'number',
		placeholder: '최대값을 입력하세요',
	},
	{
		name: 'color',
		label: '색상',
		type: 'text',
		placeholder: '색상을 입력하세요',
	},
	{
		name: 'gradeStandard',
		label: '등급 기준',
		type: 'text',
		placeholder: '등급 기준을 입력하세요',
	},
	{
		name: 'regularType',
		label: '정기 유형',
		type: 'text',
		placeholder: '정기 유형을 입력하세요',
	},
	{
		name: 'regularPeriodUnit',
		label: '정기 주기 단위',
		type: 'text',
		placeholder: '정기 주기 단위를 입력하세요',
	},
	{
		name: 'regularPeriod',
		label: '정기 주기',
		type: 'number',
		placeholder: '정기 주기를 입력하세요',
	},
];

export const moldGradeColumns: ColumnConfig<MoldGradeDto>[] = [
	{
		accessorKey: 'grade',
		header: '등급 코드',
		size: 150,
	},
	{
		accessorKey: 'method',
		header: '방법',
		size: 150,
	},
	{
		accessorKey: 'gradeOrder',
		header: '순서',
		size: 150,
	},
	{
		accessorKey: 'min',
		header: '최소값',
		size: 100,
	},
	{
		accessorKey: 'max',
		header: '최대값',
		size: 100,
	},
	{
		accessorKey: 'color',
		header: '색상',
		size: 150,
	},
	{
		accessorKey: 'gradeStandard',
		header: '등급 기준',
		size: 150,
	},
	{
		accessorKey: 'regularType',
		header: '정기 유형',
		size: 150,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value || '-';
		},
	},
	{
		accessorKey: 'regularPeriodUnit',
		header: '정기 주기 단위',
		size: 150,
	},
	{
		accessorKey: 'regularPeriod',
		header: '정기 주기',
		size: 100,
			},
	];

// Data table columns configuration with translations
export const useMoldGradeColumns = (): ColumnConfig<MoldGradeDto>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'grade',
			header: t('columns.grade'),
			size: 150,
		},
		{
			accessorKey: 'method',
			header: t('columns.method'),
			size: 150,
		},
		{
			accessorKey: 'gradeOrder',
			header: t('columns.gradeOrder'),
			size: 150,
		},
		{
			accessorKey: 'min',
			header: t('columns.min'),
			size: 100,
		},
		{
			accessorKey: 'max',
			header: t('columns.max'),
			size: 100,
		},
		{
			accessorKey: 'color',
			header: t('columns.color'),
			size: 150,
		},
		{
			accessorKey: 'gradeStandard',
			header: t('columns.gradeStandard'),
			size: 150,
		},
		{
			accessorKey: 'regularType',
			header: t('columns.regularType'),
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'regularPeriodUnit',
			header: t('columns.regularPeriodUnit'),
			size: 150,
		},
		{
			accessorKey: 'regularPeriod',
			header: t('columns.regularPeriod'),
			size: 100,
		},
	];
};

export const moldGradeQuickSearchFields = [
	{ key: 'grade', value: '등급 코드', active: true },
	{ key: 'method', value: '방법', active: false },
	{ key: 'gradeStandard', value: '등급 기준', active: false },
	{ key: 'color', value: '색상', active: false },
];
