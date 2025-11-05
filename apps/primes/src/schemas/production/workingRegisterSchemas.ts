import { FormField } from '@primes/components/form/DynamicFormComponent';
import { useTranslation } from '@repo/i18n';

// Command, WorkingMaster 목록 컬럼 정의
export const workingRegisterColumns = () => {
    const { t } = useTranslation('dataTable');

    return [
		{
			name: 'commandId',
			label: t('columns.commandId'),
			type: 'hidden',
			required: false,
		},
		{
			name: 'commandNo',
			label: t('columns.commandNo'),
			type: 'commandNo',
			placeholder: t('columns.commandNo'),
			required: false,
		},
		{
			name: 'workCode',
			label: t('columns.workCode'),
			type: 'workCodeSelect',
			placeholder: t('columns.workCode'),
		},
		{
			name: 'progressId',
			label: t('columns.progressName'),
			type: 'progressSelect',
			placeholder: t('columns.progressName'),
			required: false,
		},
		{
			name: 'workBy',
			label: t('columns.workBy'),
			type: 'userSelect',
			placeholder: t('columns.workBy'),
			disabled: true,
		},
		{
			name: 'workDate',
			label: t('columns.workDate'),
			type: 'date',
			disabled: true,
		},
		{
			name: 'standardTime',
			label: t('columns.standardTime'),
			type: 'text',
			pattern: /^\d+$/,
			placeholder: t('columns.standardTime'),
			disabled: true,
		},
		{
			name: 'shift',
			label: t('columns.shift'),
			type: 'text',
			placeholder: t('columns.shift'),
			disabled: true,
		},
    ]
};

// WorkingDetail 목록 컬럼 정의
export const workingDetailRegisterColumns = () => {
    const { t } = useTranslation('dataTable');

    return [
		{
			accessorKey: 'machineId',
			header: t('columns.machineName'),
			size: 120,
		},
		{
			accessorKey: 'workAmount',
			header: t('columns.workAmount'),
			size: 100,
		},
		{
			accessorKey: 'workWeight',
			header: t('columns.workWeight'),
			size: 100,
		},
		{
			accessorKey: 'workUnit',
			header: t('columns.workUnit'),
			size: 100,
		},
		{
			accessorKey: 'jobType',
			header: t('columns.jobType'),
			size: 120,
		},

		{
			accessorKey: 'startTime',
			header: t('columns.startTime'),
			size: 120,
		},
		{
			accessorKey: 'endTime',
			header: t('columns.endTime'),
			size: 120,
		},
		{
			accessorKey: 'badStatusCode',
			header: t('columns.badStatusCode'),
			size: 120,
		},
		{
			accessorKey: 'badReasonCode',
			header: t('columns.badReasonCode'),
			size: 120,
		}
	]
};

// WorkingDetail Form Schema
export const workingDetailFormSchema = (options?: { 
	isOutsourcing?: boolean; 
	isDefective?: boolean; 
}) => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'commandId',
			label: t('columns.commandId'),
			type: 'hidden',
			required: false,
		},
		{
			name: 'progressName',
			label: t('columns.progressName'),
			type: 'text',
			placeholder: t('columns.progressName') + '을(를) 입력하세요',
			disabled: true,
		},
		{
			name: 'machineId',
			label: t('columns.machineName'),
			type: 'machineSelect',
			placeholder: t('columns.machineName') + '을(를) 선택하세요',
			required: false,
		},
		{
			name: 'workAmount',
			label: t('columns.workAmount'),
			type: 'text',
			pattern: /^\d+$/,
			placeholder: t('columns.workAmount') + '을(를) 입력하세요',
			required: false,
		},
		{
			name: 'workWeight',
			label: t('columns.workWeight'),
			type: 'text',
			pattern: /^\d+$/,
			placeholder: t('columns.workWeight') + '을(를) 입력하세요',
			required: false,
		},
		{
			name: 'workUnit',
			label: t('columns.workUnit'),
			type: 'select',
			options: [
				{ label: 'KG', value: 'KG' },
				{ label: 'EA', value: 'EA' },
			],
			placeholder: t('columns.workUnit') + '을(를) 선택하세요',
			required: false,
		},
		{
			name: 'jobType',
			label: t('columns.jobType'),
			type: 'codeSelect',
			fieldKey: 'PDC-004',
			placeholder: t('columns.jobType') + '을(를) 선택하세요',
			required: false,
		},
	] as FormField[];
};
