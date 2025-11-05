import { useRef, useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import FormComponent from '@primes/components/form/FormComponent';
import { RadixButton } from '@radix-ui/components';
import { Check, RotateCw } from 'lucide-react';
import { UseMutationResult } from '@tanstack/react-query';
import { useTranslation } from '@repo/i18n';

interface RegisterFormTemplateProps {
	title: string;
	formSchema: FormField[];
	onSuccess?: (res: any) => void;
	onError?: (error: Error) => void;
	onReset?: () => void;
	masterData?: any;
	createMutation?: UseMutationResult<any, Error, any, void>;
	updateMutation?: UseMutationResult<
		any,
		Error,
		{ id: number; data: any },
		void
	>;
	isEditMode?: boolean;
	transformData?: (data: Record<string, unknown>) => any;
	getDefaultValues?: (masterData?: any) => Record<string, unknown>;
}

export const RegisterFormTemplate = (props: RegisterFormTemplateProps) => {
	const { t } = useTranslation('common');
	const {
		title,
		formSchema,
		onSuccess,
		onReset,
		masterData,
		createMutation,
		updateMutation,
		isEditMode = false,
		transformData,
		getDefaultValues,
	} = props;

	const [isCreated, setIsCreated] = useState(false);
	const [currentFormSchema, setCurrentFormSchema] =
		useState<FormField[]>(formSchema);

	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	// Update form schema when masterData changes
	useEffect(() => {
		if (masterData && isEditMode) {
			const updatedSchema = formSchema.map((field) => ({
				...field,
				defaultValue: masterData[field.name] || field.defaultValue,
			}));
			setCurrentFormSchema(updatedSchema);

			// Update form values when masterData is available
			if (formMethodsRef.current && getDefaultValues) {
				const defaultValues = getDefaultValues(masterData);
				formMethodsRef.current.reset(defaultValues);
			}
		} else {
			setCurrentFormSchema(formSchema);
		}
	}, [masterData, isEditMode, formSchema, getDefaultValues]);

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
	};

	const handleResetForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.reset();

			// Reset form fields to default values
			if (getDefaultValues) {
				const defaultValues = getDefaultValues();
				Object.entries(defaultValues).forEach(([key, value]) => {
					formMethodsRef.current?.setValue(key, value);
				});
			}

			setIsCreated(false);
			setCurrentFormSchema((prev) =>
				prev.map((field) => ({
					...field,
					disabled:
						field.name === 'code' || field.name.endsWith('Code')
							? true
							: false,
				}))
			);
			if (onReset) {
				onReset();
			}
		}
	};

	const handleSubmitForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.handleSubmit(handleCreateData)();
		}
	};

	const ActionButtons = () => (
		<div className="flex items-center gap-2.5">
			<RadixButton
				className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white"
				onClick={handleResetForm}
			>
				<RotateCw
					size={16}
					className="text-muted-foreground text-white"
				/>
				{t('pages.form.reset')}
			</RadixButton>
			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					isCreated
						? 'bg-gray-300 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-white'
				}`}
				onClick={handleSubmitForm}
				disabled={isCreated}
			>
				<Check
					size={16}
					className={isCreated ? 'text-gray-400' : 'text-white'}
				/>
				{t('pages.form.save')}
			</RadixButton>
		</div>
	);

	const handleCreateData = (data: Record<string, unknown>) => {
		if (!formMethodsRef.current) return;

		if (isEditMode && updateMutation && masterData) {
			const transformedData = transformData ? transformData(data) : data;
			updateMutation.mutate({
				id: masterData.id ?? 0,
				data: transformedData,
			});
		} else if (createMutation) {
			// Create new record
			const transformedData = transformData ? transformData(data) : data;

			createMutation.mutate(transformedData, {
				onSuccess: (res) => {
					if (onSuccess) {
						onSuccess(res);
					}
					setIsCreated(true);
					setCurrentFormSchema((prev) =>
						prev.map((field) => ({
							...field,
							disabled: true,
						}))
					);
				},
			});
		}
	};

	return (
		<FormComponent title={title} actionButtons={<ActionButtons />}>
			<div className="max-w-full mx-auto">
				<DynamicForm
					onFormReady={handleFormReady}
					fields={currentFormSchema}
					visibleSaveButton={false}
				/>
			</div>
		</FormComponent>
	);
};
