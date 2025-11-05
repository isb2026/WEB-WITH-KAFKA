import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import { useLot } from '@primes/hooks/production';
import { LotMaster, UpdateLotPayload } from '@primes/types/production';
import { UseFormReturn } from 'react-hook-form';
import { lotFormSchema } from '@primes/schemas/production';

interface ProductionLotRegisterPageProps {
	onClose?: () => void;
	data?: LotMaster;
	onFormReady?: (methods: UseFormReturn<Record<string, unknown>>) => void;
}

export const ProductionLotRegisterPage = ({
	onClose,
	data: lotData,
	onFormReady,
}: ProductionLotRegisterPageProps) => {
	const { t } = useTranslation('dataTable');
	const { create, update } = useLot({ page: 0, size: 30 });
	const editMode: boolean = !!lotData;
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const handleSubmit = async (data: Record<string, unknown>) => {
		if (isSubmitting) return;

		if (editMode && lotData) {
			const id: number = lotData?.id as number;
			update.mutate({
				id: id,
				data: { ...data, id } as UpdateLotPayload,
			});
			setIsSubmitting(false);
		} else {
			try {
				await create.mutate(data as any);
				console.log('onClose');
				onClose && onClose();
			} catch (error) {
				console.error('등록 실패:', error);
			} finally {
				setIsSubmitting(false);
			}
		}
		if (onClose) {
			onClose();
		}
	};

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={lotFormSchema}
				onFormReady={onFormReady}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default ProductionLotRegisterPage;