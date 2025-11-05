import { useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';

interface MoldLocationRegisterPageProps {
	onClose?: () => void;
}

interface MoldLocationRegisterData {
	[key: string]: any;
}

export const MoldLocationRegisterPage: React.FC<
	MoldLocationRegisterPageProps
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

	const handleSubmit = async (data: MoldLocationRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			// TODO: API 호출 로직 구현
			onClose && onClose();
		} catch (error) {
			// Error handling will be implemented with actual API
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

export default MoldLocationRegisterPage;
