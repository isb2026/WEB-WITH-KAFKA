import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@repo/radix-ui/hook';
import { MoldInoutInformationDto, MoldInstanceDto } from '@primes/types/mold';
import { Command } from '@primes/types/production';

export const moldInoutInformationSearchFields: FormField[] = [
	{
		name: 'moldInstanceId',
		label: '실금형 ID',
		type: 'number',
		placeholder: '실금형 ID를 입력하세요',
	},
	{
		name: 'outItemName',
		label: '품목명',
		type: 'text',
		placeholder: '품목명을 입력하세요',
	},
	{
		name: 'outItemNo',
		label: '품목번호',
		type: 'number',
		placeholder: '품목번호를 입력하세요',
	},
	{
		name: 'outMachineName',
		label: '설비명',
		type: 'text',
		placeholder: '설비명을 입력하세요',
	},
	{
		name: 'outCommandNo',
		label: '작업지시번호',
		type: 'text',
		placeholder: '작업지시번호를 입력하세요',
	},
	{
		name: 'outProgressName',
		label: '공정명',
		type: 'text',
		placeholder: '공정명을 입력하세요',
	},
	{ name: 'inOutDate', label: '입출고일', type: 'date' },
	{
		name: 'inoutFlag',
		label: '입출고구분',
		type: 'select',
		options: [
			{ label: '입고', value: 'true' },
			{ label: '출고', value: 'false' },
		],
	},
	{
		name: 'stock',
		label: '재고',
		type: 'number',
		placeholder: '재고를 입력하세요',
	},
	{
		name: 'isUse',
		label: '사용 여부',
		type: 'select',
		options: [
			{ label: '사용', value: 'true' },
			{ label: '미사용', value: 'false' },
		],
	},
	{
		name: 'createBy',
		label: '생성자',
		type: 'text',
		placeholder: '생성자를 입력하세요',
	},
];

export const moldInoutInformationColumns: ColumnConfig<MoldInoutInformationDto>[] =
	[
		{
			accessorKey: 'id',
			header: 'ID',
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'outItemName',
			header: '품목명',
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'outItemNo',
			header: '품목번호',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'outMachineName',
			header: '설비명',
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'outCommandNo',
			header: '작업지시번호',
			size: 130,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'outProgressName',
			header: '공정명',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'inOutDate',
			header: '입출고일',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'inoutFlag',
			header: '입출고구분',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '입고' : '출고';
			},
		},
		{
			accessorKey: 'stock',
			header: '재고',
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'isUse',
			header: '사용여부',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '사용' : '미사용';
			},
		},
		{
			accessorKey: 'createBy',
			header: '생성자',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'createAt',
			header: '생성일시',
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
	];

// Data table columns configuration with translations
export const useMoldInoutInformationColumns =
	(): ColumnConfig<MoldInoutInformationDto>[] => {
		return [
			{
				accessorKey: 'outItemName',
				header: '품목명',
				size: 120,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value || '-';
				},
			},
			{
				accessorKey: 'outMachineName',
				header: '설비명',
				size: 150,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value || '-';
				},
			},
			{
				accessorKey: 'outCommandNo',
				header: '작업지시번호',
				size: 130,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value || '-';
				},
			},
			{
				accessorKey: 'outProgressName',
				header: '공정명',
				size: 100,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value || '-';
				},
			},
			{
				accessorKey: 'inOutDate',
				header: '입출고일',
				size: 120,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value || '-';
				},
			},
			{
				accessorKey: 'inoutFlag',
				header: '입출고구분',
				size: 100,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value ? '입고' : '출고';
				},
			},
			{
				accessorKey: 'stock',
				header: '재고',
				size: 80,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value || '-';
				},
			},
			{
				accessorKey: 'isUse',
				header: '사용여부',
				size: 100,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value ? '사용' : '미사용';
				},
			},
			{
				accessorKey: 'createBy',
				header: '생성자',
				size: 100,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value || '-';
				},
			},
			{
				accessorKey: 'createAt',
				header: '생성일시',
				size: 150,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value || '-';
				},
			},
		];
	};

export const moldInoutInformationQuickSearchFields = [
	{ key: 'outItemName', value: '품목명', active: true },
	{ key: 'outItemNo', value: '품목번호', active: false },
	{ key: 'outMachineName', value: '설비명', active: false },
	{ key: 'outCommandNo', value: '작업지시번호', active: false },
	{ key: 'inOutDate', value: '입출고일', active: false },
];

// Form schema for mold inout registration - 금형 선택
export const moldInoutFormSchema: FormField[] = [
	{
		name: 'moldInstanceId',
		label: '금형 선택',
		type: 'moldInstanceSelect',
		placeholder: '금형을 선택하세요',
		required: true,
	},
];

// Form schema for mold input registration - 투입 정보
export const moldInputFormSchema: FormField[] = [
	{
		name: 'moldInstanceIds',
		label: '투입할 금형들',
		type: 'moldInstanceSelect',
		placeholder: '투입할 금형들을 선택하세요',
		required: true,
	},
	{
		name: 'moldLocationId',
		label: '금형 위치 ID',
		type: 'number',
		placeholder: '금형 위치 ID를 입력하세요',
		required: true,
		defaultValue: 1,
	},
	{
		name: 'inputDate',
		label: '투입 일자',
		type: 'date',
		required: true,
		defaultValue: new Date().toISOString().split('T')[0],
	},
	{
		name: 'outMachineId',
		label: '설비 ID',
		type: 'number',
		placeholder: '설비 ID를 입력하세요',
		required: true,
		defaultValue: 100,
	},
	{
		name: 'outMachineName',
		label: '설비명',
		type: 'text',
		placeholder: '설비명을 입력하세요',
		required: true,
		defaultValue: '사출기-001',
	},
	{
		name: 'outCommandNo',
		label: '작업지시번호',
		type: 'text',
		placeholder: '작업지시번호를 입력하세요',
		required: true,
	},
	{
		name: 'outItemId',
		label: '품목 ID',
		type: 'number',
		placeholder: '품목 ID를 입력하세요',
		required: true,
		defaultValue: 200,
	},
	{
		name: 'outItemNo',
		label: '품목 번호',
		type: 'number',
		placeholder: '품목 번호를 입력하세요',
		required: true,
		defaultValue: 1,
	},
	{
		name: 'outItemName',
		label: '품목명',
		type: 'text',
		placeholder: '품목명을 입력하세요',
		required: true,
		defaultValue: '플라스틱 부품 A',
	},
	{
		name: 'outProgressId',
		label: '공정 ID',
		type: 'number',
		placeholder: '공정 ID를 입력하세요',
		required: true,
		defaultValue: 300,
	},
	{
		name: 'outProgressName',
		label: '공정명',
		type: 'text',
		placeholder: '공정명을 입력하세요',
		required: true,
		defaultValue: '사출성형',
	},
	{
		name: 'stock',
		label: '재고',
		type: 'number',
		placeholder: '재고를 입력하세요',
		required: true,
		defaultValue: 1,
	},
];

// Mold instance records table columns (금형 인스턴스 목록)
export const inoutTableColumns: ColumnConfig<MoldInstanceDto>[] = [
	{
		accessorKey: 'moldInstanceCode',
		header: '금형 코드',
		size: 150,
	},
	{
		accessorKey: 'moldInstanceName',
		header: '금형명',
		size: 200,
	},
	{
		accessorKey: 'keepPlace',
		header: '보관 위치',
		size: 150,
	},
	{
		accessorKey: 'currentStock',
		header: '재고',
		size: 80,
	},
	{
		accessorKey: 'grade',
		header: '등급',
		size: 80,
	},
	{
		accessorKey: 'inDate',
		header: '투입 일자',
		size: 150,
	},
];

// Command table columns (작업지시 목록)
export const commandTableColumns: ColumnConfig<Command>[] = [
	{
		accessorKey: 'commandNo',
		header: '작업지시번호',
		size: 130,
	},
	{
		accessorKey: 'itemName',
		header: '제품',
		size: 300,
		cell: ({ row }: { row: any }) => {
			const data = row.original;
			const itemName = data.itemName || '';
			const itemNumber = data.itemNumber || '';
			const itemSpec = data.itemSpec || '';

			// 제품명 - 품번 - 규격 형태로 조합
			const parts = [itemName, itemNumber, itemSpec].filter(
				(part) => part && part.trim() !== ''
			);
			return parts.length > 0 ? parts.join(' - ') : '-';
		},
	},
	{
		accessorKey: 'progressName',
		header: '공정',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value || '-';
		},
	},
	{
		accessorKey: 'machineName',
		header: '설비',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value || '-';
		},
	},
];
