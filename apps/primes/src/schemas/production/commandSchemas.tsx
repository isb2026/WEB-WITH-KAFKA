import { FormField } from '@primes/components/form/DynamicFormComponent';
import { useTranslation } from '@repo/i18n';

// 작업 지시 등록/수정 Form Schema
export const useCommandFormSchema = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'commandNo',
			label: t('columns.commandNo'),
			type: 'text',
			placeholder: t('columns.commandNo') + '을(를) 선택하세요',
			disabled: true,
		},
		{
			name: 'planId',
			label: t('columns.planCode'),
			type: 'planSelect',
			placeholder: t('columns.planCode') + '을(를) 선택하세요',
			required: false,
		},
		{
			name: 'planCode',
			label: t('columns.planCode'),
			type: 'hidden',
			required: false,
		},
		{
			name: 'accountMon',
			label: t('columns.accountMon'),
			type: 'dateMonth',
			placeholder: t('columns.accountMon') + '을(를) 선택하세요',
			required: true,
		},
		{
			name: 'itemId',
			label: t('columns.item'),
			type: 'itemId',
			placeholder: t('columns.item') + '을(를) 선택하세요',
			required: true,
			displayFields: ['itemName', 'itemNumber', 'itemSpec'],
			displayTemplate: '{itemName} [{itemNumber}] - {itemSpec}',
		},
		{
			name: 'commandAmount',
			label: t('columns.commandAmount'),
			type: 'text',
			pattern: /^[0-9]+$/,
			placeholder: t('columns.commandAmount') + '을(를) 입력하세요',
			required: true,
		},
		// {
		// 	name: 'status',
		// 	label: t('columns.commandStatus'),
		// 	type: 'codeSelect',
		// 	placeholder: t('columns.commandStatus') + '을(를) 선택하세요',
		// 	fieldKey: 'PDC-003',
		// 	required: false,
		// },
		{
			name: 'startDate',
			label: t('columns.startDate'),
			type: 'datetime',
			placeholder: t('columns.startDate') + '을(를) 선택하세요',
			required: true,
		},
		{
			name: 'endDate',
			label: t('columns.endDate'),
			type: 'datetime',
			placeholder: t('columns.endDate') + '을(를) 선택하세요',
			required: false,
		},
		{
			name: 'isClose',
			label: t('columns.isClose'),
			type: 'isClose',
			placeholder: t('columns.isClose') + '을(를) 입력하세요',
			defaultValue: false,
			required: true,
		},
		{
			name: 'commandProgress',
			label: 'Command Progress',
			type: 'hidden',
			required: false,
		},
		{
			name: 'progressList',
			label: 'Progress List',
			type: 'hidden',
			required: false,
		},
		{
			name: 'progressId',
			label: 'Progress ID',
			type: 'hidden',
			required: false,
		},
		{
			name: 'progressCode',
			label: 'Progress Code',
			type: 'hidden',
			required: false,
		},
		{
			name: 'progressName',
			label: 'Progress Name',
			type: 'hidden',
			required: false,
		},
		{
			name: 'progressOrder',
			label: 'Progress Order',
			type: 'hidden',
			required: false,
		},
		{
			name: 'isOutsourcing',
			label: 'Is Outsourcing',
			type: 'hidden',
			required: false,
		},
		{
			name: 'unitTypeCode',
			label: 'Unit Type Code',
			type: 'hidden',
			required: false,
		},
		{
			name: 'unitTypeName',
			label: 'Unit Type Name',
			type: 'hidden',
			required: false,
		},
		{
			name: 'unitWeight',
			label: 'Unit Weight',
			type: 'hidden',
			required: false,
		},
	] as FormField[];
};

// command 검색 필드
export const commandSearchFields = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'accountMon',
			label: t('columns.accountMon'),
			type: 'dateMonth',
			placeholder: t('columns.accountMon') + '을(를) 선택하세요',
		},
		{
			name: 'commandNo',
			label: t('columns.commandNo'),
			type: 'text',
			placeholder: t('columns.commandNo') + '을(를) 입력하세요',
		},
		{
			name: 'itemNumber',
			label: t('columns.itemNumber'),
			type: 'text',
			placeholder: t('columns.itemNumber') + '을(를) 입력하세요',
		},
		{
			name: 'status',
			label: t('columns.commandStatus'),
			type: 'text',
			placeholder: t('columns.commandStatus') + '을(를) 선택하세요',
		},
	] as FormField[];
};

// V2 페이지용 검색 필드
export const commandV2SearchFields = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'accountMon',
			label: t('columns.accountMon'),
			type: 'dateMonth',
		},
		{
			name: 'commandNo',
			label: t('columns.commandNo'),
			type: 'text',
		},
		{
			name: 'itemName',
			label: t('columns.itemName'),
			type: 'text',
		},
	];
};

// 작업 지시 테이블 컬럼
export const useCommandColumns = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'accountMon',
			header: t('columns.accountMon'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'commandNo',
			header: t('columns.commandNo'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'itemNo',
			header: t('columns.itemNo'),
			size: 100,
			align: 'center',
		},
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'itemName',
			header: t('columns.itemName'),
			size: 150,
			align: 'left',
		},
		{
			accessorKey: 'itemSpec',
			header: t('columns.itemSpec'),
			size: 150,
			align: 'left',
		},
		{
			accessorKey: 'progressName',
			header: t('columns.progressName'),
			size: 100,
			align: 'center',
		},
		{
			accessorKey: 'isOutsourcing',
			header: t('columns.isOutsourcing'),
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						외주
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						사내
					</span>
				);
			},
		},
		{
			accessorKey: 'commandAmount',
			header: t('columns.commandAmount'),
			size: 100,
			cell: ({ getValue }: { getValue: () => number | null }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
			align: 'right',
		},
		// {
		// 	accessorKey: 'statusValue',
		// 	header: t('columns.commandStatus'),
		// 	size: 100,
		// 	align: 'center',
		// },
		{
			accessorKey: 'unit',
			header: t('columns.unit'),
			size: 100,
			align: 'center',
		},
		{
			accessorKey: 'startDate',
			header: t('columns.startDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => string | null }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString() : '-';
			},
			align: 'center',
		},
		{
			accessorKey: 'endDate',
			header: t('columns.endDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => string | null }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString() : '-';
			},
			align: 'center',
		},
		{
			accessorKey: 'startTime',
			header: t('columns.startTime'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'endTime',
			header: t('columns.endTime'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'isClose',
			header: t('columns.isClose'),
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						마감됨
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						마감되지 않음
					</span>
				);
			},
		},
	];
};

// 작업지시현황_v2 master 컬럼
export const useCommandLeftColumns = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'commandNo',
			header: t('columns.commandNo'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'accountMon',
			header: t('columns.accountMon'),
			size: 120,
			align: 'center',
		},
	];
};

// 작업지시현황_v2 detail 컬럼 (Command 데이터)
export const useCommandRightColumns = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'commandNo',
			header: t('columns.commandNo'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'progressName',
			header: t('columns.progressName'),
			size: 150,
			align: 'left',
		},
		{
			accessorKey: 'progressTypeCode',
			header: t('columns.progressTypeCode'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'progressOrder',
			header: t('columns.progressOrder'),
			size: 100,
			align: 'center',
		},
		{
			accessorKey: 'isOutsourcing',
			header: t('columns.isOutsourcing'),
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						외주
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						사내
					</span>
				);
			},
		},
		{
			accessorKey: 'commandAmount',
			header: t('columns.commandAmount'),
			size: 120,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number | null }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'unit',
			header: t('columns.unit'),
			size: 80,
			align: 'center',
		},
		{
			accessorKey: 'startDate',
			header: t('columns.startDate'),
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => string | null }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString() : '-';
			},
		},
		{
			accessorKey: 'endDate',
			header: t('columns.endDate'),
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => string | null }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString() : '-';
			},
		},
		{
			accessorKey: 'statusValue',
			header: t('columns.commandStatus'),
			size: 100,
			align: 'center',
		},
	];
};

// 작업 지시 테이블 컬럼
export const commandLotStatusColumns = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'commandNo',
			header: t('columns.commandNo'),
			size: 150,
		},
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 120,
		},
		{
			accessorKey: 'itemName',
			header: t('columns.itemName'),
			size: 150,
		},
		{
			accessorKey: 'itemSpec',
			header: t('columns.itemSpec'),
			size: 150,
		},
		{
			accessorKey: 'commandAmount',
			header: t('columns.commandAmount'),
			size: 100,
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue();
				return value ? (value as number).toLocaleString() : '-';
			},
			align: 'right',
		},
		{
			accessorKey: 'statusValue',
			header: t('columns.commandStatus'),
			size: 100,
			align: 'center',
		},
	];
};
