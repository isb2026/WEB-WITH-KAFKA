import { useTranslation } from '@repo/i18n';
import { FormField } from '@primes/components/form/DynamicFormComponent';

// Working Master 타입 정의
export interface WorkingMaster {
	id: number;
	commandId?: number;
	workCode?: string;
	workBy?: string;
	workDate?: string;
	standardTime?: number;
	workHour?: number;
	shift?: string;
	startTime?: string;
	endTime?: string;
	workingDetails?: any[];
	workingUsers?: any[];
}

// Working Detail 타입 정의
export interface WorkingDetail {
	id: number;
	workingMasterId: number;
	workCode?: string;
	commandId?: number;
	commandNo?: string;
	lotNo?: string;
	itemId?: number;
	itemNo?: number;
	progressId?: number;
	progressName?: string;
	lineNo?: string;
	startTime?: string;
	endTime?: string;
	workAmt?: number;
	workUnit?: string;
	boxAmt?: number;
	isClose?: boolean;
	isOutsourcing?: boolean;
	inOut?: string;
	outsourcingVendorId?: number;
	outsourcingVendorName?: string;
	status?: string;
	jobType?: string;
	badStatusCode?: string;
	badReasonCode?: string;
	produceDt?: string;
	workingInLots?: any[];
}

// Working Master 컬럼 정의
export const getWorkingMasterColumns = (users: any[] = []) => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'workCode',
			header: t('columns.workCode'),
			size: 120,
		},
		{
			accessorKey: 'workBy',
			header: t('columns.workBy'),
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const userId = getValue();
				if (!userId) return '-';
				
				// userId로 사용자 이름 찾기
				const user = Array.isArray(users) ? users.find((u: any) => u.id?.toString() === userId?.toString()) : null;
				return user?.name || userId;
			},
		},
		{
			accessorKey: 'workHour',
			header: t('columns.workHour'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '0';
			},
		},
	]
};

// Working Detail 컬럼 정의
export const getWorkingDetailColumns = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'commandNo',
			header: t('columns.commandNo'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'lotNo',
			header: t('columns.lotNo'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'itemName',
			header: t('columns.itemName'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'progressName',
			header: t('columns.progressName'),
			size: 150,
			align: 'left',
		},
		{
			accessorKey: 'machineName',
			header: t('columns.machineName'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'workAmount',
			header: t('columns.workAmount'),
			size: 120,
			align: 'right',
		},
		{
			accessorKey: 'workUnit',
			header: t('columns.workUnit'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'jobType',
			header: t('columns.jobType'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
			align: 'center',
		},
	]
};

// InfoGrid 키 정의
export const getInfoGridKeys = (t: any) => [
	{ key: 'workCode', label: t('columns.workCode') },
	{ key: 'workBy', label: t('columns.workBy') },
	{ key: 'workHour', label: t('columns.workHour') },
	{ key: 'workDate', label: t('columns.workDate') },
	{ key: 'shiftValue', label: t('columns.shift') },
	{ key: 'standardTime', label: t('columns.standardTime') },
	{ key: 'startTime', label: t('columns.workStartTime') },
	{ key: 'endTime', label: t('columns.workEndTime') },
	{ key: 'commandNo', label: t('columns.commandNo') },
];
