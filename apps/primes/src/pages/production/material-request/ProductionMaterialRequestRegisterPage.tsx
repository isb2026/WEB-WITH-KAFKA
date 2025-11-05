import { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { materialRequestFormSchema } from '@primes/schemas/production/materialRequestSchemas';

interface ProductionMaterialRequestRegisterPageProps {
	onClose?: () => void;
}

interface ProductionMaterialRequestRegisterData {
	[key: string]: any;
}

export const ProductionMaterialRequestRegisterPage: React.FC<
	ProductionMaterialRequestRegisterPageProps
> = ({ onClose }) => {
	const { t } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	// 번역된 폼 스키마 생성 (dataTable namespace 사용)
	const formSchema: FormField[] = materialRequestFormSchema.map((field) => ({
		...field,
		label: tDataTable(`columns.${field.label}` as any) || field.label,
		placeholder:
			tDataTable(`columns.${field.placeholder}` as any) ||
			field.placeholder ||
			'',
	}));

	const handleSubmit = async (
		data: ProductionMaterialRequestRegisterData
	) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			// API payload 구조에 맞게 데이터 정리 (cleanedParams 패턴)
			const {
				requestCode,
				planCode,
				itemNo,
				itemNumber,
				itemName,
				itemSpec,
				requestAmt,
				requestUnit,
				requestUnitName,
				requestDate,
			} = data;

			const cleanedParams = {
				requestCode,
				planCode,
				itemNo: Number(itemNo),
				itemNumber,
				itemName,
				itemSpec,
				requestAmt: Number(requestAmt),
				requestUnit,
				requestUnitName,
				requestDate,
			};

			// TODO: API 호출 로직 구현
			console.log('자재요청 등록 데이터:', cleanedParams);
			console.log('자재요청 등록이 완료되었습니다.');
			onClose && onClose();
		} catch (error) {
			console.error('자재요청 등록 실패:', error);
			console.error('자재요청 등록 중 오류가 발생했습니다.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm fields={formSchema} onSubmit={handleSubmit} />
		</div>
	);
};

export default ProductionMaterialRequestRegisterPage;
