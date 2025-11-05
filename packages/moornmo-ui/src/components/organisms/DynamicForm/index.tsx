import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { Form, Row, Col, Card } from 'react-bootstrap';
import { Button, Box } from '@mui/material';
import { GroupConfig, FieldConfig } from '@moornmo/types';
import { getValidationError } from '@moornmo/utils';
import { getFormattedDate } from '@repo/utils';
import { FieldRenderer } from './FieldRenderer';
import classNames from 'classnames';

export interface DynamicFormRef {
	getFormData: () => Record<string, any>;
	setFormData: (newData: Record<string, any>) => void;
	setFormError: (key: string, payload: any) => void;
	onValidation: () => FieldErrors;
	isFormValid: () => boolean;
}

export interface DynamicFormComponentProps {
	title?: string;
	subtitle?: string;
	config: GroupConfig[];
	initialValues?: Record<string, any>;
	cols?: number;
	onFileUpload?: (fieldName: string, file: File) => void;
	onSave?: () => void;
	onClose?: () => void;
	otherTypeElements?: Record<string, React.ElementType>;
	forceFullRow?: boolean;
	formStyle?: string;
	t?: (key: string) => string;
}

export const DynamicFormComponent = forwardRef<
	DynamicFormRef,
	DynamicFormComponentProps
>((props, ref) => {
	const {
		title,
		subtitle,
		config,
		initialValues = {},
		cols = 12,
		onFileUpload,
		onSave,
		onClose,
		otherTypeElements = {},
		formStyle,
		t,
	} = props;
	const {
		register,
		reset,
		setError,
		clearErrors,
		setValue,
		watch,
		formState: { errors, isValid, isSubmitted },
	} = useForm({
		defaultValues: initialValues,
		mode: 'onChange',
	});

	useImperativeHandle(
		ref,
		() => ({
			getFormData: () => watch(),
			setFormData: (newData) => reset({ ...watch(), ...newData }),
			setFormError: (key, payload) => setError(key, payload),
			onValidation: () => {
				config.forEach((group) =>
					group.fields.forEach((field) => {
						if (field.props?.validation) {
							const result = getValidationError(
								field,
								field.name ? watch(field.name) : null,
								watch()
							);
							if (result?.message && field.name)
								setError(field.name, result);
							else clearErrors(field.name);
						}
					})
				);
				return errors;
			},
			isFormValid: () => isValid && Object.keys(errors).length === 0,
		}),
		[]
	);

	const getDefaultValue = (props: any, name: string, format: string) => {
		const { is_default } = props || {};
		const initialValue = initialValues[name];
		if (!is_default) return initialValue || '';
		return initialValue || getFormattedDate(format);
	};

	// useEffect(() => {
	// 	reset(initialValues);
	// }, [initialValues, reset]);

	return (
		<Card className="shadow-none">
			{(title || subtitle) && (
				<div className="px-4 pt-3">
					{title && (
						<Card.Title className={subtitle ? 'mb-2' : 'mb-4'}>
							{title}
						</Card.Title>
					)}
					{subtitle && (
						<Card.Subtitle className="mb-4">
							{subtitle}
						</Card.Subtitle>
					)}
				</div>
			)}
			<Form className={classNames('px-3', formStyle)}>
				{config.map((group, groupIdx) => (
					<div key={groupIdx} className="px-2 pb-3">
						{group.title && (
							<h5 className="mb-3 fs-9 fw-bold">{group.title}</h5>
						)}
						<Row>
							{group.fields.map(
								(field: FieldConfig, idx: number) => (
									<Col
										key={idx}
										xs={12}
										md={
											props.forceFullRow
												? 12
												: field.span || 12 / cols
										}
										className="mb-3"
									>
										<Form.Group
											className={classNames('d-flex', {
												'align-items-center':
													field.type != 'postCode',
												'align-items-start':
													field.type == 'postCode',
											})}
											style={{
												gap: 8,
												justifyContent: 'space-between',
											}}
										>
											<Form.Label
												className={classNames('my-0', {
													required:
														field.props?.required,
													'mt-2':
														field.type ==
														'postCode',
												})}
												style={{
													width:
														field.labelWidth || 75,
												}}
											>
												{field.label}
											</Form.Label>
											<div style={{ flexGrow: 1 }}>
												<FieldRenderer
													type={field.type}
													name={field.name || ''}
													props={field.props || {}}
													register={register}
													watch={watch}
													setValue={setValue}
													errors={errors}
													getDefaultValue={
														getDefaultValue
													}
													onFileUpload={onFileUpload}
													otherTypeElements={
														otherTypeElements
													}
												/>
											</div>
										</Form.Group>
									</Col>
								)
							)}
						</Row>
					</div>
				))}
			</Form>
			{(onSave || onClose) && (
				<Box
					sx={{
						display: 'flex',
						gap: 1,
						justifyContent: 'flex-end',
						p: 2,
					}}
				>
					{onClose && (
						<Button
							variant="contained"
							color="inherit"
							onClick={onClose}
							sx={{
								backgroundColor: 'grey.300',
								color: 'text.secondary',
								'&:hover': {
									backgroundColor: 'grey.400',
								},
							}}
						>
							{t ? t('close') : '닫기'}
						</Button>
					)}
					{onSave && (
						<Button
							variant="contained"
							color="primary"
							disabled={!isValid}
							onClick={onSave}
							sx={{
								backgroundColor: isValid
									? 'primary.main'
									: 'grey.300',
								color: isValid ? 'white' : 'text.disabled',
								'&:hover': {
									backgroundColor: isValid
										? 'primary.dark'
										: 'grey.300',
								},
							}}
						>
							{t ? t('save') : '저장'}
						</Button>
					)}
				</Box>
			)}
		</Card>
	);
});
