import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import type { DefectStatus, DefectSeverity } from '@primes/types/production/defectTypes';

// DefectRecord 데이터 테이블 타입
export type DefectRecordDataTableType = {
	id: number;
	defectCode: string;
	productCode: string;
	productName?: string;
	defectType?: string;
	defectTypeCode?: string;
	defectReason?: string;
	defectReasonCode?: string;
	defectDescription?: string;
	defectQuantity?: number;
	expectedLoss?: number;
	expectedLossCurrency?: string;
	reportDate?: string;
	reportedBy?: string;
	severity?: DefectSeverity;
	status: DefectStatus;
	assignedTo?: string;
	dueDate?: string;
	actionPlanDescription?: string;
};

// DefectAction 데이터 테이블 타입
export type DefectActionDataTableType = {
	id: number;
	defectRecordId: number;
	actionDate?: string;
	actionPlanDescription: string;
	actionBy?: string;
};

// DefectRecord 등록/수정 Form Schema
export const defectRecordFormSchema: FormField[] = [
	{
		name: 'defectCode',
		label: '불량코드',
		type: 'text',
		required: true,
		placeholder: '불량코드를 입력하세요',
		maxLength: 30,
	},
	{
		name: 'productCode',
		label: '제품코드',
		type: 'text',
		required: true,
		placeholder: '제품코드를 입력하세요',
		maxLength: 50,
	},
	{
		name: 'productName',
		label: '제품명',
		type: 'text',
		placeholder: '제품명을 입력하세요',
		maxLength: 200,
	},
	{
		name: 'defectType',
		label: '불량 유형',
		type: 'codeSelect',
		fieldKey: 'QTY-001',
		valueKey: 'codeName',
		labelKey: 'codeName',
		placeholder: '불량 유형을 선택하세요',
	},
	{
		name: 'defectReason',
		label: '불량 사유',
		type: 'codeSelect',
		fieldKey: 'QTY-002',
		valueKey: 'codeName',
		labelKey: 'codeName',
		placeholder: '불량 사유를 선택하세요',
	},
	{
		name: 'defectDescription',
		label: '불량 내용',
		type: 'textarea',
		placeholder: '불량 내용을 입력하세요',
		rows: 3,
	},
	{
		name: 'defectQuantity',
		label: '불량 수량',
		type: 'number',
		placeholder: '불량 수량을 입력하세요',
	},
	{
		name: 'expectedLoss',
		label: '예상 손실 금액',
		type: 'number',
		placeholder: '예상 손실 금액을 입력하세요',
	},
	{
		name: 'expectedLossCurrency',
		label: '화폐 단위',
		type: 'select',
		options: [
			{ label: '원(KRW)', value: 'KRW' },
			{ label: '달러(USD)', value: 'USD' },
			{ label: '엔(JPY)', value: 'JPY' },
			{ label: '유로(EUR)', value: 'EUR' },
		],
		defaultValue: 'KRW',
	},
	{
		name: 'reportDate',
		label: '신고일',
		type: 'date',
		placeholder: '신고일을 선택하세요',
	},
	{
		name: 'reportedBy',
		label: '신고자',
		type: 'text',
		placeholder: '신고자를 입력하세요',
		maxLength: 50,
	},
	{
		name: 'severity',
		label: '심각도',
		type: 'select',
		options: [
			{ label: '높음', value: 'HIGH' },
			{ label: '중간', value: 'MEDIUM' },
			{ label: '낮음', value: 'LOW' },
		],
		defaultValue: 'MEDIUM',
	},
	{
		name: 'status',
		label: '상태',
		type: 'select',
		required: true,
		options: [
			{ label: '신규', value: 'OPEN' },
			{ label: '조사중', value: 'INVESTIGATING' },
			{ label: '해결됨', value: 'RESOLVED' },
			{ label: '종료', value: 'CLOSED' },
		],
		defaultValue: 'OPEN',
	},
	{
		name: 'assignedTo',
		label: '담당자',
		type: 'text',
		placeholder: '담당자를 입력하세요',
		maxLength: 50,
	},
	{
		name: 'dueDate',
		label: '완료예정일',
		type: 'date',
		placeholder: '완료예정일을 선택하세요',
	},
	{
		name: 'actionPlanDescription',
		label: '조치내용',
		type: 'textarea',
		placeholder: '조치내용을 입력하세요',
		rows: 3,
	},
];

// DefectAction 등록/수정 Form Schema
export const defectActionFormSchema: FormField[] = [
	{
		name: 'defectRecordId',
		label: '불량 기록 ID',
		type: 'number',
		required: true,
		placeholder: '불량 기록 ID를 입력하세요',
	},
	{
		name: 'actionPlanDescription',
		label: '조치내용',
		type: 'textarea',
		required: true,
		placeholder: '조치내용을 입력하세요',
		rows: 4,
	},
	{
		name: 'actionDate',
		label: '조치일자',
		type: 'date',
		placeholder: '조치일자를 선택하세요',
	},
	{
		name: 'actionBy',
		label: '조치 담당자',
		type: 'text',
		placeholder: '조치 담당자를 입력하세요',
		maxLength: 50,
	},
];

// DefectRecord 검색 Form Schema
export const defectRecordSearchSchema: FormField[] = [
	{
		name: 'defectCode',
		label: '불량코드',
		type: 'text',
		placeholder: '불량코드를 입력하세요',
	},
	{
		name: 'productCode',
		label: '제품코드',
		type: 'text',
		placeholder: '제품코드를 입력하세요',
	},
	{
		name: 'productName',
		label: '제품명',
		type: 'text',
		placeholder: '제품명을 입력하세요',
	},
	{
		name: 'defectType',
		label: '불량 유형',
		type: 'codeSelect',
		fieldKey: 'QTY-001',
		valueKey: 'codeName',
		labelKey: 'codeName',
		placeholder: '불량 유형을 선택하세요',
	},
	{
		name: 'defectReason',
		label: '불량 사유',
		type: 'codeSelect',
		fieldKey: 'QTY-002',
		valueKey: 'codeName',
		labelKey: 'codeName',
		placeholder: '불량 사유를 선택하세요',
	},
	{
		name: 'reportDateStart',
		label: '신고일 시작',
		type: 'date',
		placeholder: '시작일을 선택하세요',
	},
	{
		name: 'reportDateEnd',
		label: '신고일 종료',
		type: 'date',
		placeholder: '종료일을 선택하세요',
	},
	{
		name: 'reportedBy',
		label: '신고자',
		type: 'text',
		placeholder: '신고자를 입력하세요',
	},
	{
		name: 'severity',
		label: '심각도',
		type: 'select',
		options: [
			{ label: '높음', value: 'HIGH' },
			{ label: '중간', value: 'MEDIUM' },
			{ label: '낮음', value: 'LOW' },
		],
		placeholder: '심각도를 선택하세요',
	},
	{
		name: 'status',
		label: '상태',
		type: 'select',
		options: [
			{ label: '신규', value: 'OPEN' },
			{ label: '조사중', value: 'INVESTIGATING' },
			{ label: '해결됨', value: 'RESOLVED' },
			{ label: '종료', value: 'CLOSED' },
		],
		placeholder: '상태를 선택하세요',
	},
	{
		name: 'assignedTo',
		label: '담당자',
		type: 'text',
		placeholder: '담당자를 입력하세요',
	},
];

// DefectAction 검색 Form Schema
export const defectActionSearchSchema: FormField[] = [
	{
		name: 'defectRecordId',
		label: '불량 기록 ID',
		type: 'number',
		placeholder: '불량 기록 ID를 입력하세요',
	},
	{
		name: 'actionDateStart',
		label: '조치일자 시작',
		type: 'date',
		placeholder: '시작일을 선택하세요',
	},
	{
		name: 'actionDateEnd',
		label: '조치일자 종료',
		type: 'date',
		placeholder: '종료일을 선택하세요',
	},
	{
		name: 'actionPlanDescription',
		label: '조치내용',
		type: 'text',
		placeholder: '조치내용을 입력하세요',
	},
	{
		name: 'actionBy',
		label: '조치 담당자',
		type: 'text',
		placeholder: '조치 담당자를 입력하세요',
	},
];

// 데이터 테이블 컬럼 설정
export const defectRecordColumns: ColumnConfig<DefectRecordDataTableType>[] = [
	{
		accessorKey: 'defectCode',
		header: '불량코드',
		size: 120,
	},
	{
		accessorKey: 'productCode',
		header: '제품코드',
		size: 120,
	},
	{
		accessorKey: 'productName',
		header: '제품명',
		size: 150,
	},
	{
		accessorKey: 'defectType',
		header: '불량 유형',
		size: 100,
	},
	{
		accessorKey: 'defectReason',
		header: '불량 사유',
		size: 100,
	},
	{
		accessorKey: 'severity',
		header: '심각도',
		size: 80,
	},
	{
		accessorKey: 'status',
		header: '상태',
		size: 80,
	},
	{
		accessorKey: 'reportDate',
		header: '신고일',
		size: 100,
	},
	{
		accessorKey: 'reportedBy',
		header: '신고자',
		size: 100,
	},
	{
		accessorKey: 'assignedTo',
		header: '담당자',
		size: 100,
	},
];

export const defectActionColumns: ColumnConfig<DefectActionDataTableType>[] = [
	{
		accessorKey: 'defectRecordId',
		header: '불량 기록 ID',
		size: 120,
	},
	{
		accessorKey: 'actionDate',
		header: '조치일자',
		size: 100,
	},
	{
		accessorKey: 'actionPlanDescription',
		header: '조치내용',
		size: 200,
	},
	{
		accessorKey: 'actionBy',
		header: '조치 담당자',
		size: 100,
	},
]; 