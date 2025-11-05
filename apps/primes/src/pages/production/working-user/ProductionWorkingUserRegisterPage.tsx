import { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { useWorkingUser } from '@primes/hooks/production';
import { WorkingUser } from '@primes/types/production';
import { UseFormReturn } from 'react-hook-form';
import { workingUserFormSchema } from '@primes/schemas/production';

interface ProductionWorkingUserRegisterPageProps {
	onClose?: () => void;
	data?: WorkingUser;
	onFormReady?: (methods: UseFormReturn<Record<string, unknown>>) => void;
}

export const ProductionWorkingUserRegisterPage = ({
	onClose,
	data: workingUserData,
	onFormReady,
}: ProductionWorkingUserRegisterPageProps) => {
	const { t } = useTranslation('dataTable');
	const { create, update } = useWorkingUser({ page: 0, size: 30 });
	const editMode: boolean = !!workingUserData;
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const handleSubmit = async (data: Record<string, unknown>) => {
		if (isSubmitting) return;
		setIsSubmitting(true);

		try {
			if (editMode && workingUserData) {
				const id: number = workingUserData?.id as number;
				await update.mutate({
					id: id,
					data: data as Partial<WorkingUser>,
				});
			} else {
				await create.mutate(data);
				onClose && onClose();
			}
		} catch (error) {
			console.error('저장 실패:', error);
		} finally {
			setIsSubmitting(false);
		}

		if (onClose) {
			onClose();
		}
	};

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={workingUserFormSchema}
				onFormReady={onFormReady}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};
