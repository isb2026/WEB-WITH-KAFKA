import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@repo/radix-ui/hook';
import { MoldBomMasterDto, MoldBomDetailDto, MoldBomDetailSearchResponse } from '@primes/types/mold';

// MoldBomMaster 검색 필드
export const moldBomMasterSearchFields: FormField[] = [
	{ name: 'id', label: 'ID', type: 'number' },
	{ name: 'itemId', label: '품목 ID', type: 'number' },
	{ name: 'progressId', label: '공정 ID', type: 'number' },
	{ name: 'progressTypeCode', label: '공정 타입 코드', type: 'text' },
	{ name: 'machineId', label: '설비 ID', type: 'number' },
	{ name: 'machineName', label: '설비명', type: 'text' },
	{ name: 'createdBy', label: '생성자', type: 'text' },
	{ name: 'createdAtStart', label: '생성일 시작', type: 'date' },
	{ name: 'createdAtEnd', label: '생성일 종료', type: 'date' },
	{ name: 'updatedBy', label: '수정자', type: 'text' },
	{ name: 'updatedAtStart', label: '수정일 시작', type: 'date' },
	{ name: 'updatedAtEnd', label: '수정일 종료', type: 'date' },
];

// MoldBomDetail 검색 필드
export const moldBomDetailSearchFields: FormField[] = [
	{ name: 'id', label: 'ID', type: 'number' },
	{ name: 'moldBomMasterId', label: 'MoldBomMaster ID', type: 'number' },
	{ name: 'parentId', label: '부모 ID', type: 'number' },
	{ name: 'isRoot', label: '루트 여부', type: 'select', options: [
		{ label: '루트', value: 'true' },
		{ label: '하위', value: 'false' },
	]},
	{ name: 'moldMasterId', label: 'MoldMaster ID', type: 'number' },
	{ name: 'isManage', label: '관리 여부', type: 'select', options: [
		{ label: '관리', value: 'true' },
		{ label: '미관리', value: 'false' },
	]},
	{ name: 'createdBy', label: '생성자', type: 'text' },
	{ name: 'createdAtStart', label: '생성일 시작', type: 'date' },
	{ name: 'createdAtEnd', label: '생성일 종료', type: 'date' },
	{ name: 'updatedBy', label: '수정자', type: 'text' },
	{ name: 'updatedAtStart', label: '수정일 시작', type: 'date' },
	{ name: 'updatedAtEnd', label: '수정일 종료', type: 'date' },
];

// MoldBomDetail 폼 필드 정의 (Modal용)
export const moldBomDetailFormSchema: FormField[] = [
	{
		name: 'moldMasterSelect',
		label: '금형 마스터',
		type: 'moldMasterSelect',
		required: true,
		placeholder: '금형 마스터를 선택하세요',
	},
	{
		name: 'num',
		label: '투입수량',
		type: 'text',
		required: true,
		placeholder: '투입수량을 입력하세요',
	},
	{
		name: 'isManage',
		label: '수명관리 여부',
		type: 'select',
		options: [
			{ label: '수명관리', value: 'true' },
			{ label: '수량관리', value: 'false' },
		],
		defaultValue: 'true',
	},
	{
		name: 'leftSer',
		label: 'Left Ser',
		type: 'number',
		defaultValue: 0,
	},
	{
		name: 'rightSer',
		label: 'Right Ser',
		type: 'number',
		defaultValue: 0,
	},
	{
		name: 'subOrder',
		label: 'Sub Order',
		type: 'number',
		defaultValue: 0,
	},
];

// MoldBomDetail 테이블 컬럼 정의 (RegisterPage용)
export const moldBomDetailRegisterColumns: ColumnConfig<MoldBomDetailDto>[] = [
	{
		accessorKey: 'moldTypeName',
		header: '금형타입명',
		size: 100,
	},
	{
		accessorKey: 'moldMasterId',
		header: '금형코드',
		size: 120,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.moldCode;
			return value || '-';
		},
	},
	{
		accessorKey: 'moldMasterId',
		header: '금형명',
		size: 150,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.moldName;
			return value || '-';
		},
	},
	{
		accessorKey: 'moldMasterId',
		header: '금형규격',
		size: 150,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.moldStandard;
			return value || '-';
		},
	},
	{
		accessorKey: 'moldMasterId',
		header: '수명',
		size: 100,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.lifeCycle;
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'moldMasterId',
		header: '금형가격',
		size: 120,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.moldPrice;
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'moldMasterId',
		header: '안전재고',
		size: 100,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.safeStock;
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'moldMasterId',
		header: '보관장소',
		size: 120,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.keepPlace;
			return value || '-';
		},
	},
	{
		accessorKey: 'num',
		header: '수량',
		size: 80,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'isManage',
		header: '관리여부',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? '수명관리' : '수량관리';
		},
	},
];

// MoldBomMaster 테이블 컬럼 정의 (RelatedListPage용)
export const moldBomMasterRelatedColumns: ColumnConfig<MoldBomMasterDto>[] = [
	{
		accessorKey: 'itemName',
		header: '품명',
		size: 150,
	},
	{
		accessorKey: 'itemNumber',
		header: '품번',
		size: 120,
	},
	{
		accessorKey: 'itemSpec',
		header: '품목규격',
		size: 150,
	},
	{
		accessorKey: 'progressTypeCode',
		header: '공정타입코드',
		size: 120,
	},
	{
		accessorKey: 'machineName',
		header: '설비명',
		size: 120,
	},
	{
		accessorKey: 'createdAt',
		header: '생성일',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value
				? new Date(value).toLocaleDateString('ko-KR')
				: '-';
		},
	},
];

// MoldBomDetail 테이블 컬럼 정의 (RelatedListPage용)
export const moldBomDetailRelatedColumns: ColumnConfig<MoldBomDetailDto>[] = [
	{
		accessorKey: 'moldTypeName',
		header: '금형타입명',
		size: 100,
	},
	{
		accessorKey: 'moldMasterId',
		header: '금형코드',
		size: 120,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.moldCode;
			return value || '-';
		},
	},
	{
		accessorKey: 'moldMasterId',
		header: '금형명',
		size: 150,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.moldName;
			return value || '-';
		},
	},
	{
		accessorKey: 'moldMasterId',
		header: '금형규격',
		size: 150,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.moldStandard;
			return value || '-';
		},
	},
	{
		accessorKey: 'moldMasterId',
		header: '수명',
		size: 100,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.lifeCycle;
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'moldMasterId',
		header: '금형가격',
		size: 120,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.moldPrice;
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'moldMasterId',
		header: '안전재고',
		size: 100,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.safeStock;
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'moldMasterId',
		header: '보관장소',
		size: 120,
		cell: ({ row }: { row: any }) => {
			const value = row.original.moldMaster?.keepPlace;
			return value || '-';
		},
	},
	{
		accessorKey: 'num',
		header: '투입수량',
		size: 80,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'isManage',
		header: '관리여부',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? '수명관리' : '수량관리';
		},
	},
];

// MoldBomMaster 테이블 컬럼 정의
export const moldBomMasterColumns: ColumnConfig<MoldBomMasterDto>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		size: 80,
	},
	{
		accessorKey: 'itemNo',
		header: '품목 번호',
		size: 100,
	},
	{
		accessorKey: 'itemNumber',
		header: '품번',
		size: 120,
	},
	{
		accessorKey: 'itemName',
		header: '품명',
		size: 200,
	},
	{
		accessorKey: 'itemSpec',
		header: '규격',
		size: 150,
	},
	{
		accessorKey: 'progressId',
		header: '공정 ID',
		size: 100,
	},
	{
		accessorKey: 'progressTypeCode',
		header: '공정 타입',
		size: 120,
	},
	{
		accessorKey: 'machineId',
		header: '설비 ID',
		size: 100,
	},
	{
		accessorKey: 'machineName',
		header: '설비명',
		size: 120,
	},
	{
		accessorKey: 'moldBomDetail',
		header: 'BOM 상세 수',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const details = getValue();
			return details?.length || 0;
		},
	},
	{
		accessorKey: 'createdBy',
		header: '생성자',
		size: 100,
	},
	{
		accessorKey: 'createdAt',
		header: '생성일',
		size: 120,
	},
	{
		accessorKey: 'updatedBy',
		header: '수정자',
		size: 100,
	},
	{
		accessorKey: 'updatedAt',
		header: '수정일',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
		},
	},
];

// MoldBomDetail 테이블 컬럼 정의
export const moldBomDetailColumns: ColumnConfig<MoldBomDetailDto>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		size: 80,
	},
	{
		accessorKey: 'moldBomMasterId',
		header: 'MoldBomMaster ID',
		size: 150,
	},
	{
		accessorKey: 'parentId',
		header: '부모 ID',
		size: 100,
	},
	{
		accessorKey: 'isRoot',
		header: '루트 여부',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const isRoot = getValue();
			return isRoot ? '루트' : '하위';
		},
	},
	{
		accessorKey: 'moldMasterId',
		header: 'MoldMaster ID',
		size: 150,
	},
	{
		accessorKey: 'num',
		header: '투입수량',
		size: 80,
	},
	{
		accessorKey: 'isManage',
		header: '수명관리 여부',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const isManage = getValue();
			return isManage ? '수명관리' : '수량관리';
		},
	},
	{
		accessorKey: 'leftSer',
		header: '왼쪽 시리얼',
		size: 120,
	},
	{
		accessorKey: 'rightSer',
		header: '오른쪽 시리얼',
		size: 120,
	},
	{
		accessorKey: 'subOrder',
		header: '서브 순서',
		size: 100,
	},
	{
		accessorKey: 'createdBy',
		header: '생성자',
		size: 100,
	},
	{
		accessorKey: 'createdAt',
		header: '생성일',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
		},
	},
	{
		accessorKey: 'updatedBy',
		header: '수정자',
		size: 100,
	},
	{
		accessorKey: 'updatedAt',
		header: '수정일',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
		},
	},
];

// MoldBomMaster 빠른 검색 필드
export const moldBomMasterQuickSearchFields = [
	{ key: 'itemName', value: '품명', active: true },
	{ key: 'itemNumber', value: '품번', active: false },
	{ key: 'machineName', value: '설비명', active: false },
	{ key: 'progressTypeCode', value: '공정 타입', active: false },
];

// MoldBomDetail 빠른 검색 필드
export const moldBomDetailQuickSearchFields = [
	{ key: 'moldBomMasterId', value: 'MoldBomMaster ID', active: true },
	{ key: 'parentId', value: '부모 ID', active: false },
	{ key: 'moldMasterId', value: 'MoldMaster ID', active: false },
];