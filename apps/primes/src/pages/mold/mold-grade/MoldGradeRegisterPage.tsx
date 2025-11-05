import { useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { useCreateMoldGrade, useUpdateMoldGrade } from '@primes/hooks';
import { MoldGradeDto } from '@primes/types/mold';
import { useTranslation } from '@repo/i18n';

interface MoldGradeRegisterPageProps {
	onClose?: () => void;
	selectedGrade?: MoldGradeDto | null;
	isEditMode?: boolean;
}

interface MoldGradeRegisterData {
	[key: string]: any;
}

export const MoldGradeRegisterPage: React.FC<MoldGradeRegisterPageProps> = ({
	onClose,
	selectedGrade,
	isEditMode = false,
}) => {
	const { t } = useTranslation('dataTable');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const createMoldGrade = useCreateMoldGrade(0, 30);
	const updateMoldGrade = useUpdateMoldGrade();

	const formSchema: FormField[] = [
		{
			name: 'grade',
			label: t('columns.grade') || '등급',
			type: 'text',
			placeholder: t('placeholders.enterGrade') || 'Enter grade',
			required: true,
			defaultValue: isEditMode ? selectedGrade?.grade || '' : '',
		},
		{
			name: 'method',
			label: t('columns.method') || '방법',
			type: 'text',
			placeholder: t('placeholders.enterMethod') || 'Enter method',
			required: true,
			defaultValue: isEditMode ? selectedGrade?.method || '' : '',
		},
		{
			name: 'gradeOrder',
			label: t('columns.gradeOrder') || '순서',
			type: 'number',
			placeholder: t('placeholders.enterGradeOrder') || 'Enter order',
			required: false,
			defaultValue: isEditMode
				? selectedGrade?.gradeOrder?.toString() || ''
				: '',
		},
		{
			name: 'min',
			label: t('columns.min') || '최소값',
			type: 'number',
			placeholder: t('placeholders.enterMinValue') || 'Enter min value',
			required: false,
			defaultValue: isEditMode
				? selectedGrade?.min?.toString() || ''
				: '',
		},
		{
			name: 'max',
			label: t('columns.max') || '최대값',
			type: 'number',
			placeholder: t('placeholders.enterMaxValue') || 'Enter max value',
			required: false,
			defaultValue: isEditMode
				? selectedGrade?.max?.toString() || ''
				: '',
		},
		{
			name: 'color',
			label: t('columns.color') || '색상',
			type: 'text',
			placeholder: t('placeholders.enterColor') || 'Enter color',
			required: false,
			defaultValue: isEditMode ? selectedGrade?.color || '' : '',
		},
		{
			name: 'gradeStandard',
			label: t('columns.gradeStandard') || '등급 기준',
			type: 'text',
			placeholder: t('placeholders.enterGradeStandard') || 'Enter grade standard',
			required: false,
			defaultValue: isEditMode ? selectedGrade?.gradeStandard || '' : '',
		},
		{
			name: 'regularType',
			label: t('columns.regularType') || '정기 유형',
			type: 'text',
			placeholder: t('placeholders.enterRegularType') || 'Enter regular type',
			required: false,
			defaultValue: isEditMode ? selectedGrade?.regularType || '' : '',
		},
		{
			name: 'regularPeriodUnit',
			label: t('columns.regularPeriodUnit') || '정기 주기 단위',
			type: 'text',
			placeholder: t('placeholders.enterRegularPeriodUnit') || 'Enter regular period unit',
			required: false,
			defaultValue: isEditMode
				? selectedGrade?.regularPeriodUnit || ''
				: '',
		},
		{
			name: 'regularPeriod',
			label: t('columns.regularPeriod') || '정기 주기',
			type: 'number',
			placeholder: t('placeholders.enterRegularPeriod') || 'Enter regular period',
			required: false,
			defaultValue: isEditMode
				? selectedGrade?.regularPeriod?.toString() || ''
				: '',
		},
	];

	const handleSubmit = async (data: MoldGradeRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			if (isEditMode && selectedGrade) {
				// Edit mode - use update mutation
				const updateData = {
					grade: data.grade as string,
					method: data.method as string,
					gradeOrder: data.gradeOrder ? Number(data.gradeOrder) : 1, // Fixed to use gradeOrder
					min: data.min ? Number(data.min) : 1000,
					max: data.max ? Number(data.max) : 1000,
					color: data.color || '#FF0000',
					gradeStandard: data.gradeStandard || '샘플값',
					regularType: data.regularType || 'PERIOD',
					regularPeriodUnit: data.regularPeriodUnit || '월',
					regularPeriod: data.regularPeriod
						? Number(data.regularPeriod)
						: 1,
				};

				await updateMoldGrade.mutateAsync({
					id: selectedGrade.id,
					data: updateData,
				});
			} else {
				// Create mode - use create mutation
				const transformedData = {
					grade: data.grade as string,
					method: data.method as string,
					gradeOrder: data.gradeOrder ? Number(data.gradeOrder) : 1, // API example shows 'gradeOrder'
					min: data.min ? Number(data.min) : 1000,
					max: data.max ? Number(data.max) : 1000,
					color: data.color || '#FF0000',
					gradeStandard: data.gradeStandard || '샘플값',
					regularType: data.regularType || 'PERIOD',
					regularPeriodUnit: data.regularPeriodUnit || '월',
					regularPeriod: data.regularPeriod
						? Number(data.regularPeriod)
						: 1,
				};

				await createMoldGrade.mutateAsync(transformedData);
			}
			onClose && onClose();
		} catch (error) {
			// Error handling is done by the mutation hooks
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={formSchema}
				onSubmit={handleSubmit}
				submitButtonText={isEditMode ? '수정' : '등록'}
			/>
		</div>
	);
};

export default MoldGradeRegisterPage;
