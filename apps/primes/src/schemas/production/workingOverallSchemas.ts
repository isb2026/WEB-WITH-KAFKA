import { FormField } from '@primes/components/form/DynamicFormComponent';
import { useTranslation } from '@repo/i18n';

// Working 목록 컬럼 정의
export const getWorkingOverallColumns = (users: any[] = []) => {
    const { t } = useTranslation('dataTable');

    return [
        {
            accessorKey: 'workCode',
            header: t('columns.workCode'),
            size: 120,
            align: 'center',
        },
        {
            accessorKey: 'workDate',
            header: t('columns.workDate'),
            size: 120,
            cell: ({ getValue }: { getValue: () => any }) => {
                const value = getValue();
                return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
            },
            align: 'center',
        },
        {
            accessorKey: 'workBy',
            header: t('columns.workBy'),
            size: 120,
            align: 'center',
            cell: ({ getValue }: { getValue: () => any }) => {
                const userId = getValue();
                if (!userId) return '-';
                
                // userId로 사용자 이름 찾기
                const user = Array.isArray(users) ? users.find((u: any) => u.id?.toString() === userId?.toString()) : null;
                return user?.name || userId;
            },
        },
        {
            accessorKey: 'standardTime',
            header: t('columns.standardTime'),
            size: 120,
            align: 'right',
        },
        {
            accessorKey: 'workHour',
            header: t('columns.workHour'),
            size: 120,
            align: 'right',
        },
        {
            accessorKey: 'shift',
            header: t('columns.shift'),
            size: 120,
            cell: ({ getValue }: { getValue: () => any }) => {
                const value = getValue();
                return value || '-';
            },
            align: 'center',
        },
        {
            accessorKey: 'startTime',
            header: t('columns.startTime'),
            size: 120,
            cell: ({ getValue }: { getValue: () => any }) => {
                const value = getValue();
                return value ? new Date(value).toLocaleTimeString('ko-KR') : '-';
            },
        },
        {
            accessorKey: 'endTime',
            header: t('columns.endTime'),
            size: 120,
            cell: ({ getValue }: { getValue: () => any }) => {
                const value = getValue();
                return value ? new Date(value).toLocaleTimeString('ko-KR') : '-';
            },
        },
    ]
};

export const workingOverallSearchFields= (): FormField[] => {
    const { t } = useTranslation('dataTable');

    return [
        {
            name: 'workCode',
            label: t('columns.workCode'),
            type: 'text',
            placeholder: t('search.workCodePlaceholder'),
        },
        {
            name: 'workBy',
            label: t('columns.workBy'),
            type: 'userSelect',
            placeholder: t('search.workByPlaceholder'),
        },
        {
            name: 'workDate',
            label: t('columns.workDate'),
            type: 'date',
        },
        {
            name: 'shift',
            label: t('columns.shift'),
            type: 'codeSelect',
            fieldKey: 'PDC-005',
            placeholder: t('search.shiftPlaceholder'),
        },
    ]
};