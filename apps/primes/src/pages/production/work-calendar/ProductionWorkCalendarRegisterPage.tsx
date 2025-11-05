import { useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';

interface ProductionWorkCalendarRegisterPageProps {
	onClose?: () => void;
}

interface ProductionWorkCalendarRegisterData {
	[key: string]: any;
}

export const ProductionWorkCalendarRegisterPage: React.FC<
	ProductionWorkCalendarRegisterPageProps
> = ({ onClose }) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const formSchema: FormField[] = [
		{
			name: 'dataList',
			label: 'dataList',
			type: 'text',
			placeholder: 'dataList을(를) 입력하세요',
			required: false,
		},
	];

	const handleSubmit = async (data: ProductionWorkCalendarRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			// TODO: API 호출 로직 구현
			console.log('등록 데이터:', data);
			console.log('등록이 완료되었습니다.');
			onClose && onClose();
		} catch (error) {
			console.error('등록 실패:', error);
			console.error('등록 중 오류가 발생했습니다.');
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

export default ProductionWorkCalendarRegisterPage;
