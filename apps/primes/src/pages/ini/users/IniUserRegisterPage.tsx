import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { useUsers } from '@primes/hooks';
import { User } from '@primes/types/users';
import { UseFormReturn } from 'react-hook-form';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';

interface IniUserRegisterPageProps {
	onClose?: () => void;
	userData?: User;
	onFormReady?: (methods: UseFormReturn<Record<string, unknown>>) => void;
}

export const IniUserRegisterPage = ({
	onClose,
	userData,
	onFormReady,
}: IniUserRegisterPageProps) => {
	const { t } = useTranslation('dataTable');
	const { create, update } = useUsers({ page: 0, size: 30 });
	const editMode: boolean = !!userData;
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [showPasswordField, setShowPasswordField] = useState<boolean>(false);
	const [formSchemaFinal, setFormSchemaFinal] = useState<FormField[]>([]);

	const otherTypeElements = useMemo(
		() => ({
			department: CodeSelectComponent,
			partLevel: CodeSelectComponent,
			partPosition: CodeSelectComponent,
		}),
		[]
	);

	const formSchema = useMemo(
		() => [
			// 1. ID (required)
			{
				name: 'username',
				label: t('columns.username'),
				type: 'text',
				placeholder: '아이디를 입력해주세요',
				required: true,
			},
			// 2. Password (required)
			{
				name: 'password',
				label: t('columns.password'),
				type: 'password',
				placeholder: '비밀번호를 입력해주세요',
				required: true,
			},
			// 3. Name (required)
			{
				name: 'name',
				label: t('columns.name'),
				type: 'text',
				placeholder: '이름을 입력해주세요',
				required: true,
			},
			// 4. Email (required)
			{
				name: 'email',
				label: t('columns.email'),
				type: 'email',
				placeholder: '이메일을 입력해주세요',
				required: true,
			},
			// 5. Mobile Phone (required)
			{
				name: 'mobileTel',
				label: t('columns.mobileTel'),
				type: 'text',
				placeholder: '전화번호를 입력해주세요 (예: 010-1234-5678)',
				mask: '999-9999-9999',
				required: true,
			},
			// 6. Date of Hire
			{
				name: 'inDate',
				label: t('columns.hireDate'),
				type: 'date',
				placeholder: '입사일을 입력해주세요',
			},
			// 7. Department
			{
				name: 'department',
				label: t('columns.department'),
				type: 'department',
				placeholder: '부서를 선택해주세요',
				fieldKey: 'COM-001',
				valueKey: 'codeValue',
				labelKey: 'codeName',
			},
			// 8. Position
			{
				name: 'partPosition',
				label: t('columns.partPosition'),
				type: 'partPosition',
				placeholder: '직책을 선택해주세요',
				fieldKey: 'COM-002',
				valueKey: 'codeValue',
				labelKey: 'codeName',
			},
			// 9. Date of Birth
			{
				name: 'birthDate',
				label: t('columns.birthDate'),
				type: 'date',
				placeholder: '생년월일을 입력해주세요',
			},
			// 10. Address
			{
				name: 'zipcode',
				label: t('columns.zipcode'),
				type: 'text',
				placeholder: '우편번호를 입력해주세요',
			},
			{
				name: 'addressMaster',
				label: t('columns.address'),
				type: 'text',
				placeholder: '주소를 입력해주세요',
			},
			{
				name: 'addressDetail',
				label: t('columns.addressDetail'),
				type: 'text',
				placeholder: '상세주소를 입력해주세요',
			},
			// 11. Employment Status (Current/Retired)
			{
				name: 'employmentStatus',
				label: t('columns.employmentStatus'),
				type: 'select',
				placeholder: '고용상태를 선택해주세요',
				options: [
					{ value: 'CURRENT', label: '재직' },
					{ value: 'RETIRED', label: '퇴직' },
				],
			},
			// 12. Date of Resignation
			{
				name: 'outDate',
				label: t('columns.userOutDate'),
				type: 'date',
				placeholder: '퇴사일을 입력해주세요',
			},
			// Additional field: Part Level (직급)
			// {
			// 	name: 'partLevel',
			// 	label: t('columns.partLevel'),
			// 	type: 'partLevel',
			// 	placeholder: '직급을 선택해주세요',
			// 	fieldKey: 'COM-003',
			// 	valueKey: 'codeValue',
			// 	labelKey: 'codeName',
			// },
		],
		[t]
	);

	// editMode와 showPasswordField에 따라 formSchema를 가공
	useEffect(() => {
		let processedSchema = [...formSchema];

		if (editMode && !showPasswordField) {
			// 편집 모드이고 비밀번호 필드를 숨길 때
			processedSchema = processedSchema.filter(
				(field) =>
					field.name !== 'password' && field.name !== 'username'
			);
		} else if (editMode && showPasswordField) {
			// 편집 모드이고 비밀번호 필드를 표시할 때
			const passwordField = processedSchema.find(
				(field) => field.name === 'password'
			);
			if (passwordField) {
				passwordField.placeholder = '새 비밀번호를 입력해주세요';
			}
		}

		setFormSchemaFinal(processedSchema);
	}, [editMode, showPasswordField, formSchema]);

	const handleSubmit = async (data: Record<string, unknown>) => {
		if (isSubmitting) return;

		// 편집 모드에서 비밀번호가 변경되지 않은 경우 password 필드 제거
		if (editMode && !showPasswordField && data.password) {
			const { password, ...dataWithoutPassword } = data;
			data = dataWithoutPassword;
		}

		if (editMode && userData) {
			const username: string = userData?.username as string;
			update.mutate({
				username: username,
				data: data as Partial<User>,
			});
			setIsSubmitting(false);
		} else {
			try {
				await create.mutate({ tenantId: 10001, ...data });
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
			{editMode && !showPasswordField && (
				<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
					<div className="flex items-center justify-between">
						<span className="text-sm text-blue-700">
							비밀번호는 보안상 표시되지 않습니다.
						</span>
						<button
							type="button"
							onClick={() => {
								alert('비밀번호 초기화 준비중');
							}}
							className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							비밀번호 변경
						</button>
					</div>
				</div>
			)}

			<DynamicForm
				fields={formSchemaFinal}
				onFormReady={onFormReady}
				onSubmit={handleSubmit}
				otherTypeElements={otherTypeElements}
			/>
		</div>
	);
};
