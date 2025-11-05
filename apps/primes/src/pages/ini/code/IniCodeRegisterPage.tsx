import { useState, useMemo, useRef, useEffect } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';

import { useCode } from '@primes/hooks';
import {
	Code,
	CodeGroup,
	createCodePayload,
	updateCodePayload,
} from '@primes/types/code';
import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
} from '@radix-ui/components';
import { useTranslation } from '@repo/i18n';

interface IniCodeRegisterPageProps {
	onClose?: () => void;
	parentCode?: CodeGroup;
	codeGroupData?: CodeGroup[];
	codeHanndleModal: 'create' | 'update' | null;
	selectedCode?: Code | null;
}

export const IniCodeRegisterPage: React.FC<IniCodeRegisterPageProps> = ({
	onClose,
	codeGroupData,
	parentCode,
	codeHanndleModal,
	selectedCode,
}) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, any>
	> | null>(null);
	const { create, update } = useCode();
	const { t } = useTranslation('dataTable');

	const formSchema: FormField[] = [
		{
			name: 'codeGroupId',
			label: t('columns.parentId'),
			type: 'codeGroupId',
			required: true,
			disabled: true,
			placeholder: '코드 그룹 코드',
		},
		// {
		// 	name: 'codeValue',
		// 	label: t('columns.codeValue'),
		// 	type: 'text',
		// 	placeholder: t('columns.codeValue'),
		// 	required: true,
		// 	maxLength: 3,
		// },
		{
			name: 'codeName',
			label: t('columns.codeName'),
			type: 'text',
			placeholder: t('columns.codeName'),
			required: true,
			maxLength: 100,
		},
		{
			name: 'description',
			label: t('columns.description'),
			type: 'text',
			placeholder: t('columns.description'),
			required: false,
		},
	];
	const handleCancel = () => {
		onClose && onClose();
	};

	const handleSubmit = async (data: Record<string, unknown>) => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			if (codeHanndleModal === 'create') {
				const payload: createCodePayload = {
					codeGroupId: Number(data.codeGroupId),
					// codeValue: data.codeValue as string,
					codeName: data.codeName as string,
					description: data.description as string,
				};
				await create.mutate({ data: payload });
			} else if (codeHanndleModal === 'update' && selectedCode) {
				const id = selectedCode.id;
				const payload: updateCodePayload = {
					codeGroupId: selectedCode.codeGroupId,
					// codeValue: data.codeValue as string,
					codeName: data.codeName as string,
					description: data.description as string,
				};
				await update.mutate({ id: id, data: payload });
			}
			handleCancel();
		} catch (error) {
			console.error('등록 실패:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	const codeOptions = useMemo(() => {
		return codeGroupData?.map((code) => ({
			label: code.groupName,
			value: code.id?.toString(),
		}));
	}, [codeGroupData]);

	useEffect(() => {
		if (formMethods && parentCode?.id) {
			formMethods.setValue('codeGroupId', parentCode.id);
		}
	}, [parentCode, formMethods]);

	useEffect(() => {
		if (codeHanndleModal === 'update' && selectedCode) {
			formMethods?.reset(selectedCode);
		}
	}, [codeHanndleModal, formMethods, selectedCode]);

	const ParentCodeSelect: React.FC<{
		placeholder?: string;
		onChange?: (value: string) => void;
		disabled?: boolean;
	}> = ({ placeholder, onChange, disabled }) => {
		const selectedValue = parentCode?.id?.toString();
		return (
			<RadixSelect
				disabled={disabled}
				placeholder={placeholder}
				onValueChange={onChange}
				value={selectedValue?.toString()}
			>
				<RadixSelectGroup>
					{codeOptions?.map((option) => (
						<RadixSelectItem
							key={option.value}
							value={option.value}
						>
							{option.label}
						</RadixSelectItem>
					))}
				</RadixSelectGroup>
			</RadixSelect>
		);
	};
	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={formSchema}
				otherTypeElements={{
					codeGroupId: ParentCodeSelect,
				}}
				onFormReady={handleFormReady}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default IniCodeRegisterPage;
