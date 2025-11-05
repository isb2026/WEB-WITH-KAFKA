import { FieldConfig } from '../types/form';

export const getValidationError = (
	field: FieldConfig,
	value: any,
	formValues: Record<string, any>
) => {
	const { validation } = field.props || {};

	if (!validation) return null;

	if (validation.required && !value) {
		return { type: 'invalid', message: validation.required };
	}

	if (validation.pattern && !validation.pattern.value.test(value)) {
		return { type: 'invalid', message: validation.pattern.message };
	}

	if (validation.customValidation) {
		const result = validation.customValidation(value);
		if (result) return result;
	}

	if (validation.validate) {
		const result = validation.validate(value, formValues);
		if (result !== true) return result;
	}

	return null;
};
