import React, { useMemo, useState, useEffect } from 'react';
import { SelectFieldComponent, SelectFieldProps } from '@moornmo/components';
// import {
// 	UseFormRegister,
// 	UseFormWatch,
// 	UseFormSetValue,
// } from 'react-hook-form';
// import { FieldErrors } from 'react-hook-form';
import { useCompanyField } from '@esg/hooks/company/useCompanyField';
import { GetFieldDataPayload } from '@esg/types/company';

export interface CompanySelectProps extends SelectFieldProps {
	name: string;
	value: any;
	onChange: (value: any) => void;
	fieldName: string;
	disabled?: boolean;
	placeholder?: string;
	filter?: GetFieldDataPayload;
	label?: string;
}

export const CompanySelect: React.FC<CompanySelectProps> = ({
	name = 'CompanyId',
	value,
	onChange,
	fieldName,
	filter,
	disabled = false,
	placeholder = '선택해주세요.',
	label,
}) => {
	const fieldData = useCompanyField(fieldName, filter ? filter : {});

	const options = useMemo(() => {
		if (fieldData.data) {
			return fieldData.data.map((field: any) => {
				return {
					label: field.value,
					value: field.id,
				};
			});
		} else {
			return [];
		}
	}, [fieldData.data]);

	return (
		<SelectFieldComponent
			name={name}
			value={value}
			options={options}
			onChange={(e) => onChange(e.target.value)}
			disabled={disabled}
			placeholder={placeholder}
			label={label}
		/>
	);
};
