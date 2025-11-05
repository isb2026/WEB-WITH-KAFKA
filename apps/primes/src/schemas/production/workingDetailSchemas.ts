import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';

export type WorkingDetailDataTableType = {
	id: number;
	workCode?: string;
	commandNo?: string;
	lotNo?: string;
	itemNo?: number;
	progressName?: string;
	lineNo?: string;
	startTime?: string;
	endTime?: string;
	workAmt?: number;
	workUnit?: string;
	boxAmt?: number;
	status?: string;
};

// 작업 상세 등록/수정 Form Schema
export const workingDetailFormSchema: FormField[] = [
	{
		name: 'workCode',
		label: '작업 코드',
		type: 'text',
		placeholder: 'WORK-001',
		required: false,
	},
	{
		name: 'commandNo',
		label: '지시 번호',
		type: 'text',
		placeholder: 'CMD-001',
		required: false,
	},
	{
		name: 'lotNo',
		label: 'LOT 번호',
		type: 'text',
		placeholder: 'LOT-001',
		required: false,
	},
	{
		name: 'itemNo',
		label: '품목 번호',
		type: 'number',
		placeholder: '1',
		required: false,
	},
	{
		name: 'progressName',
		label: '공정명',
		type: 'text',
		placeholder: '가공',
		required: false,
	},
	{
		name: 'lineNo',
		label: '라인 번호',
		type: 'text',
		placeholder: 'LINE-001',
		required: false,
	},
	{
		name: 'startTime',
		label: '시작 시간',
		type: 'datetime-local',
		required: false,
	},
	{
		name: 'endTime',
		label: '종료 시간',
		type: 'datetime-local',
		required: false,
	},
	{
		name: 'workAmt',
		label: '작업 수량',
		type: 'number',
		placeholder: '100',
		required: false,
	},
	{
		name: 'workUnit',
		label: '작업 단위',
		type: 'text',
		placeholder: 'EA',
		required: false,
	},
	{
		name: 'boxAmt',
		label: 'BOX 수량',
		type: 'number',
		placeholder: '10',
		required: false,
	},
	{
		name: 'status',
		label: '상태',
		type: 'text',
		placeholder: '진행중',
		required: false,
	},
];

// 작업 상세 테이블 컬럼
export const getWorkingDetailColumns = (users: any[] = []) => {
	return [
		{
			accessorKey: 'id',
			header: 'ID',
			size: 80,
			minSize: 60,
		},
		{
			accessorKey: 'workCode',
			header: '작업 코드',
			size: 120,
		},
		{
			accessorKey: 'commandNo',
			header: '지시 번호',
			size: 120,
		},
		{
			accessorKey: 'lotNo',
			header: 'LOT 번호',
			size: 120,
		},
		{
			accessorKey: 'itemNo',
			header: '품목 번호',
			size: 100,
		},
		{
			accessorKey: 'progressName',
			header: '공정명',
			size: 120,
		},
		{
			accessorKey: 'lineNo',
			header: '라인 번호',
			size: 120,
		},
		{
			accessorKey: 'startTime',
			header: '시작 시간',
			size: 150,
			cell: ({ getValue }: { getValue: () => string | null }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'endTime',
			header: '종료 시간',
			size: 150,
			cell: ({ getValue }: { getValue: () => string | null }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'workAmt',
			header: '작업 수량',
			size: 100,
			cell: ({ getValue }: { getValue: () => number | null }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'workUnit',
			header: '작업 단위',
			size: 100,
		},
		{
			accessorKey: 'boxAmt',
			header: 'BOX 수량',
			size: 100,
			cell: ({ getValue }: { getValue: () => number | null }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 100,
		},
		{
			accessorKey: 'workBy',
			header: '작업자',
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => any }) => {
				const userId = getValue();
				if (!userId) return '-';

				// userId로 사용자 이름 찾기
				const user = Array.isArray(users)
					? users.find(
							(u: any) => u.id?.toString() === userId?.toString()
						)
					: null;
				return user?.name || userId;
			},
		},
	];
};

// Working Detail 검색 필드 정의
export const workingDetailSearchFields = (): FormField[] => {
	return [
		{
			name: 'commandNo',
			label: '작업지시번호',
			type: 'text',
			placeholder: '작업지시번호를 입력하세요',
		},
		{
			name: 'lotNo',
			label: 'LOT번호',
			type: 'text',
			placeholder: 'LOT번호를 입력하세요',
		},
		{
			name: 'itemName',
			label: '품목명',
			type: 'text',
			placeholder: '품목명을 입력하세요',
		},
		{
			name: 'progressName',
			label: '공정명',
			type: 'text',
			placeholder: '공정명을 입력하세요',
		},
		{
			name: 'machineName',
			label: '설비명',
			type: 'text',
			placeholder: '설비명을 입력하세요',
		},
		{
			name: 'workBy',
			label: '작업자',
			type: 'userSelect',
			placeholder: '작업자를 선택하세요',
		},
		{
			name: 'workDate',
			label: '작업일자',
			type: 'date',
			placeholder: '작업일자를 선택하세요',
		},
	];
};
