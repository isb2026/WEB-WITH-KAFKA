import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
// import { useVendorContact } from '@primes/hooks/init/vendor/useVendorContact';
// import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';
import { useTranslation } from '@repo/i18n';
// import { createVendorContactPayload } from '@primes/types/vendor';

interface IniVendorContactRegisterPageProps {
	onClose?: () => void;
	formRef?: React.RefObject<HTMLFormElement>;
}

export const IniVendorContactRegisterPage = ({
	onClose,
	formRef,
}: IniVendorContactRegisterPageProps) => {
	const { t } = useTranslation('dataTable');
	// const { create } = useVendorContact({ page: 0, size: 30 });

	const vendorContactFormSchema: FormField[] = [
		{
			name: 'contactName',
			label: '담당자명',
			type: 'text',
			placeholder: '담당자명을 입력해주세요',
			formatMessage: '담당자명을 입력해주세요',
			required: true,
		},
		{
			name: 'contactCode',
			label: '담당자 코드',
			type: 'text',
			placeholder: '담당자 코드를 입력하세요',
			required: true,
			maxLength: 6,
		},
		{
			name: 'vendorCode',
			label: '거래처 코드',
			type: 'text',
			placeholder: '거래처 코드를 입력하세요',
			required: true,
			maxLength: 4,
		},
		{
			name: 'department',
			label: '부서',
			type: 'text',
			placeholder: '부서를 입력해주세요',
		},
		{
			name: 'position',
			label: '직책',
			type: 'text',
			placeholder: '직책을 입력해주세요',
		},
		{
			name: 'contactEmail',
			label: '이메일',
			type: 'email',
			placeholder: '이메일을 입력해주세요',
		},
		{
			name: 'contactPhone',
			label: '연락처',
			type: 'tel',
			placeholder: '000-0000-0000',
			pattern: /^\d{2,3}-\d{3,4}-\d{4}$/,
			formatMessage: '형식: 000-0000-0000',
			maskAutoDetect: true,
		},

		{
			name: 'memo',
			label: '메모',
			type: 'textarea',
			placeholder: '메모를 입력해주세요',
			rows: 3,
		},
		{
			name: 'isMainContact',
			label: '주담당자 여부',
			type: 'checkbox',
			placeholder: '주담당자 여부를 선택하세요',
		},
	];

	const handleSubmit = (data: any) => {
		// TODO: DB 연동 후 주석 해제
		// create.mutate(data, {
		// 	onSuccess: () => {
		// 		if (onClose) onClose();
		// 	},
		// });

		console.log('담당자 등록 데이터:', data);
		if (onClose) onClose();
	};

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={vendorContactFormSchema}
				otherTypeElements={{}}
				// onSubmit={handleSubmit} // 상위 버튼으로 제출할 예정이므로 제거
			/>
		</div>
	);
};

export default IniVendorContactRegisterPage;
