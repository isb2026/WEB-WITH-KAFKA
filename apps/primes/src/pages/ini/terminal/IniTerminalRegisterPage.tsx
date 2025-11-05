import { useState, useRef, useEffect } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from '@repo/i18n';
import { useTerminal } from '@primes/hooks/init/terminal/useTerminal';
import { Terminal } from '@primes/types/terminal';

interface IniTerminalListData {
	id: number;
	name?: string;
	code?: string;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: any;
}

interface IniTerminalRegisterPageProps {
	onClose?: () => void;
	mode?: 'create' | 'update';
	selectedTerminal?: IniTerminalListData;
}

interface IniTerminalRegisterData {
	[key: string]: any;
}

export const IniTerminalRegisterPage: React.FC<
	IniTerminalRegisterPageProps
> = ({ onClose, mode, selectedTerminal }) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, any>
	> | null>(null);

	const { t } = useTranslation('dataTable');
	const { create, update } = useTerminal({
		page: 0,
		size: 30,
	});
	const formSchema: FormField[] = [
		{
			name: 'terminalName',
			label: t('columns.terminalName'),
			type: 'text',
			placeholder: t('columns.terminalName'),
			required: true,
			maxLength: 30,
		},
		{
			name: 'description',
			label: t('columns.description'),
			type: 'textarea',
			placeholder: t('columns.description'),
			required: false,
		},
		// {
		// 	name: 'imageUrl',
		// 	label: t('columns.imageUrl'),
		// 	type: 'fileUpload',
		// 	placeholder: t('columns.imageUrl'),
		// 	required: false,
		// 	maxLength: 100,
		// },
	];

	const handleSubmit = async (data: IniTerminalRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);
		if (mode === 'create') {
			try {
				// TODO: API 호출 로직 구현
				create.mutate(data);
				handleCancel();
			} catch (error) {
				console.error(error);
			} finally {
				setIsSubmitting(false);
			}
		} else if (mode === 'update' && selectedTerminal) {
			console.log('update', data);
			update.mutate({ id: Number(selectedTerminal.id), data });
			handleCancel();
		}
	};

	const handleCancel = () => {
		onClose && onClose();
	};
	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	useEffect(() => {
		if (formMethods && mode === 'update' && selectedTerminal) {
			formMethods.reset(selectedTerminal);
		}
	}, [mode, selectedTerminal, formMethods]);

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={formSchema}
				onSubmit={handleSubmit}
				onFormReady={handleFormReady}
			/>
		</div>
	);
};

export default IniTerminalRegisterPage;
