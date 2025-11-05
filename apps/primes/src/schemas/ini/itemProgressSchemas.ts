import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@repo/radix-ui/hook';
import { ItemProgressDto } from '@primes/types/progress';
import { useTranslation } from '@repo/i18n';

export const itemProgressSearchFields: FormField[] = [
	{
		name: 'isUse',
		label: '사용 여부',
		type: 'select',
		options: [
			{ label: '사용', value: 'true' },
			{ label: '미사용', value: 'false' },
		],
		placeholder: '사용 여부를 선택하세요',
	},
	{
		name: 'itemId',
		label: '제품 ID',
		type: 'number',
		placeholder: '제품 ID를 입력하세요',
	},
	{
		name: 'progressName',
		label: '공정명',
		type: 'text',
		placeholder: '공정명을 입력하세요',
	},
	{
		name: 'progressTypeName',
		label: '공정 타입명',
		type: 'text',
		placeholder: '공정 타입명을 입력하세요',
	},
	{
		name: 'isOutsourcing',
		label: '외주 공정 여부',
		type: 'select',
		options: [
			{ label: '내공정', value: 'false' },
			{ label: '외주공정', value: 'true' },
		],
		placeholder: '외주 공정 여부를 선택하세요',
	},
	{
		name: 'unitTypeName',
		label: '단위명',
		type: 'text',
		placeholder: '단위명을 입력하세요',
	},
	{
		name: 'createdAtStart',
		label: '생성일시 시작',
		type: 'datetime',
		placeholder: '생성일시 시작을 선택하세요',
	},
	{
		name: 'createdAtEnd',
		label: '생성일시 종료',
		type: 'datetime',
		placeholder: '생성일시 종료를 선택하세요',
	},
];

export const getItemProgressFormSchema = (
	t?: (key: string) => string
): FormField[] => [
	{
		name: 'progressOrder',
		label: t ? t('columns.progressOrder') : 'Process Sequence',
		type: 'number',
		required: false,
		placeholder: t
			? t('columns.progressOrder')
			: '공정 순서를 입력하세요. 미입력 시 자동으로 순차 입력됩니다.',
	},
	{
		name: 'progressName',
		label: t ? t('columns.progressName') : 'Process Name',
		type: 'text',
		required: false,
		placeholder: t ? t('columns.progressName') : '공정 이름을 입력하세요.',
	},
	{
		name: 'progressTypeCode',
		label: t ? t('columns.progressTypeCode') : 'Process Type Code',
		type: 'progressTypeCode',
		required: false,
		placeholder: t
			? t('columns.progressTypeCode')
			: '공정 코드에서 선택하세요',
		fieldKey: 'PRD-002',
		valueKey: 'codeValue',
		labelKey: 'codeName',
	},
	{
		name: 'progressTypeName',
		label: t ? t('columns.progressTypeName') : 'Process Type Name',
		type: 'hidden',
		required: false,
	},
	{
		name: 'unitWeight',
		label: t ? t('columns.unitWeight') : 'Process Unit Weight (unit)',
		type: 'decimal',
		required: false,
		placeholder: t
			? t('columns.unitWeight')
			: '공정단중을 입력하세요 (예: 1.25)',
		pattern: /^\d+(\.\d{1,2})?$/,
		formatMessage: '소수점 이하 2자리까지 입력 가능합니다 (예: 1.25)',
	},
	{
		name: 'unitTypeCode',
		label: t ? t('columns.unitTypeName') : 'Unit Type Code',
		type: 'unitTypeCode',
		required: false,
		fieldKey: 'PRD-006',
		valueKey: 'codeValue',
		labelKey: 'codeName',
		placeholder: t ? t('columns.unitTypeName') : '단위 코드를 선택하세요',
	},
	{
		name: 'unitTypeName',
		label: t ? t('columns.unitTypeName') : 'Unit Type Name',
		type: 'hidden',
		required: false,
	},
	{
		name: 'defaultCycleTime',
		label: t ? t('columns.defaultCycleTime') : 'Cycle Time',
		type: 'number',
		required: false,
		placeholder: t
			? t('columns.defaultCycleTime')
			: '사이클 타임을 입력하세요 (분)',
	},
	{
		name: 'optimalProgressInventoryQty',
		label: t
			? t('columns.optimalProgressInventoryQty')
			: 'Optimal Inventory',
		type: 'number',
		required: false,
		placeholder: t
			? t('columns.optimalProgressInventoryQty')
			: '적정 재고량을 입력하세요',
	},
	{
		name: 'safetyProgressInventoryQty',
		label: t ? t('columns.safetyProgressInventoryQty') : 'Safety Stock',
		type: 'number',
		required: false,
		placeholder: t
			? t('columns.safetyProgressInventoryQty')
			: '안전 재고량을 입력하세요',
	},
	{
		name: 'keyManagementContents',
		label: t ? t('columns.keyManagementContents') : 'Memo',
		type: 'textarea',
		required: false,
		placeholder: t
			? t('columns.keyManagementContents')
			: '메모를 입력하세요',
		rows: 2, // Compact textarea
	},
	{
		name: 'progressDefaultSpec',
		label: t ? t('columns.progressDefaultSpec') : 'Process Specification',
		type: 'textarea',
		required: false,
		placeholder: t
			? t('columns.progressDefaultSpec')
			: '공정 사양을 입력하세요',
		rows: 2,
	},
	{
		name: 'inspectionRequired',
		label: t ? t('columns.inspectionRequired') : 'Inspection Requirement',
		type: 'radio',
		required: false,
		options: [
			{ label: 'Yes', value: 'true' },
			{ label: 'No', value: 'false' },
		],
		defaultValue: 'false',
	},
];

export const itemProgressColumns: ColumnConfig<ItemProgressDto>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'item',
		header: '제품명',
		cell: ({ row }) => {
			const item = row.original.item;
			return item ? `${item.itemName} [${item.itemNumber}]` : '-';
		},
	},
	{
		accessorKey: 'progressOrder',
		header: '공정 순서',
	},
	{
		accessorKey: 'progressName',
		header: '공정명',
	},
	{
		accessorKey: 'progressTypeName',
		header: '공정 타입명',
	},
	{
		accessorKey: 'isOutsourcing',
		header: '외주 공정 여부',
		cell: ({ getValue }) => {
			const value = getValue() as boolean;
			return value ? '외주공정' : '내공정';
		},
	},
	{
		accessorKey: 'unitWeight',
		header: '공정단중',
		cell: ({ getValue, row }) => {
			const weight = getValue() as number;
			const unitTypeName = row.original.unitTypeName;
			return weight && unitTypeName ? `${weight} ${unitTypeName}` : '-';
		},
	},
	{
		accessorKey: 'unitTypeName',
		header: '단위명',
	},
	{
		accessorKey: 'defaultCycleTime',
		header: '기본 사이클 타임',
		cell: ({ getValue }) => {
			const value = getValue() as number;
			return value ? `${value}분` : '-';
		},
	},
	{
		accessorKey: 'optimalProgressInventoryQty',
		header: '적정 공정 재고 수량',
		cell: ({ getValue }) => {
			const value = getValue() as number;
			return value ? value.toLocaleString('ko-KR') : '-';
		},
	},
	{
		accessorKey: 'safetyProgressInventoryQty',
		header: '안전 공정 재고 수량',
		cell: ({ getValue }) => {
			const value = getValue() as number;
			return value ? value.toLocaleString('ko-KR') : '-';
		},
	},
	{
		accessorKey: 'isUse',
		header: '사용 여부',
		cell: ({ getValue }) => {
			const value = getValue() as boolean;
			return value ? '사용' : '미사용';
		},
	},
	{
		accessorKey: 'createdAt',
		header: '생성일시',
		cell: ({ getValue }) => {
			const value = getValue() as string;
			return value ? new Date(value).toLocaleString('ko-KR') : '-';
		},
	},
	{
		accessorKey: 'updatedAt',
		header: '수정일시',
		cell: ({ getValue }) => {
			const value = getValue() as string;
			return value ? new Date(value).toLocaleString('ko-KR') : '-';
		},
	},
];
