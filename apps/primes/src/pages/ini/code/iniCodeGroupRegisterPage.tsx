import { useState, useMemo, useRef, useEffect } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';

import { useCode } from '@primes/hooks';
import {
	CodeGroup,
	createCodeGroupPayload,
	updateCodeGroupPayload,
} from '@primes/types/code';
import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
} from '@radix-ui/components';
import { useTranslation } from '@repo/i18n';

interface IniCodeGroupRegisterPageProps {
	onClose?: () => void;
	parentCode?: CodeGroup;
	codeData?: CodeGroup[];
	codeGroupHanndleModal: 'create' | 'update' | null;
	selectedCodeGroup?: CodeGroup | null;
	enableParentSelection?: boolean; // New prop to enable parent selection
}

export const IniCodeGroupRegisterPage: React.FC<
	IniCodeGroupRegisterPageProps
> = ({
	onClose,
	codeData,
	parentCode,
	codeGroupHanndleModal,
	selectedCodeGroup,
	enableParentSelection = false,
}) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, any>
	> | null>(null);
	const { createCodeGroup, updateCodeGroup } = useCode();
	const { t } = useTranslation('dataTable');

	const formSchema: FormField[] = [
		{
			name: 'parentId',
			label: t('columns.parentId'),
			type: 'parentId',
			required: false, // Make optional to allow root groups
			disabled: !enableParentSelection, // Enable when enableParentSelection is true
			placeholder: '부모 그룹 선택 (비워두면 루트 그룹)',
		},
		{
			name: 'groupCode',
			label: t('columns.groupCode'),
			type: 'text',
			placeholder: 'Group Code',
			required: true,
			maxLength: 3,
		},
		{
			name: 'groupName',
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

	const handleSubmit = async (data: Record<string, unknown>, event?: React.BaseSyntheticEvent) => {
		// Prevent event propagation to parent form
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			if (codeGroupHanndleModal === 'create') {
				// Use parentCode.id if available, otherwise use form data
				const parentId = parentCode?.id || (data.parentId ? Number(data.parentId) : undefined);
				
				const payload: createCodeGroupPayload = {
					...(parentId && { parentId }), // Only include parentId if it exists
					groupCode: data.groupCode as string,
					groupName: data.groupName as string,
					description: data.description as string,
					isRoot: parentId ? 0 : 1, // 0 if has parent, 1 if root
				};
				await createCodeGroup.mutate({ data: payload });
			} else if (
				codeGroupHanndleModal === 'update' &&
				selectedCodeGroup
			) {
				const id = selectedCodeGroup.id;
				const payload: updateCodeGroupPayload = {
					isUse: selectedCodeGroup.isUse ? 1 : 0,
					parentId: Number(data.parentId),
					isRoot: Number(selectedCodeGroup.isRoot),
					groupCode: data.groupCode as string,
					groupName: data.groupName as string,
					description: data.description as string,
				};
				await updateCodeGroup.mutate({ id: id, data: payload });
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
		return codeData?.map((code) => ({
			label: code.groupName,
			value: code.id?.toString(),
		}));
	}, [codeData]);

	useEffect(() => {
		if (formMethods && parentCode?.id) {
			formMethods.setValue('parentId', parentCode.id);
		}
	}, [parentCode, formMethods]);

	useEffect(() => {
		if (codeGroupHanndleModal === 'update' && selectedCodeGroup && formMethods) {
			formMethods.setValue('parentId', selectedCodeGroup.parentId);
			formMethods.setValue('groupCode', selectedCodeGroup.groupCode);
			formMethods.setValue('groupName', selectedCodeGroup.groupName);
			formMethods.setValue('description', selectedCodeGroup.description || '');
		}
	}, [codeGroupHanndleModal, formMethods, selectedCodeGroup]);

	const rootCodeSelect: React.FC<{
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
					parentId: rootCodeSelect,
				}}
				onFormReady={handleFormReady}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default IniCodeGroupRegisterPage;
