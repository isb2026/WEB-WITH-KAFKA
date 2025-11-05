import { useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';

interface MoldPriceChangeHistoryRegisterPageProps {
	onClose?: () => void;
}

interface MoldPriceChangeHistoryRegisterData {
	[key: string]: any;
}

export const MoldPriceChangeHistoryRegisterPage: React.FC<
	MoldPriceChangeHistoryRegisterPageProps
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

	const handleSubmit = async (data: MoldPriceChangeHistoryRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			// TODO: API 호출 로직 구현
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

export default MoldPriceChangeHistoryRegisterPage;
