import { useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';

interface IniProgressRouteRegisterPageProps {
	onClose?: () => void;
}

interface IniProgressRouteRegisterData {
	[key: string]: any;
}

export const IniProgressRouteRegisterPage: React.FC<
	IniProgressRouteRegisterPageProps
> = ({ onClose }) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const formSchema: FormField[] = [
		{
			name: 'accountYear',
			label: 'accountYear',
			type: 'number',

			required: false,
		},
		{
			name: 'compNo',
			label: 'compNo',
			type: 'number',

			required: false,
		},
		{
			name: 'itemNo',
			label: 'itemNo',
			type: 'number',

			required: false,
		},
		{
			name: 'machineNo',
			label: 'machineNo',
			type: 'number',

			required: false,
		},
		{
			name: 'progressNo',
			label: 'progressNo',
			type: 'number',

			required: false,
		},
	];

	const handleSubmit = async (data: IniProgressRouteRegisterData) => {
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

export default IniProgressRouteRegisterPage;
