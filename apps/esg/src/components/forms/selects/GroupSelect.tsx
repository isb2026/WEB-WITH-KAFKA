import React, { useMemo, useState, useEffect } from 'react';
import { SelectFieldComponent, SelectFieldProps } from '@moornmo/components';
import { useGroupField } from '@esg/hooks/group/useGroupField';

export interface GroupSelectProps extends SelectFieldProps {
	name: string;
	value: any;
	onChange: (value: any) => void;
	fieldName: string;
	disabled?: boolean;
	placeholder?: string;
}

export const GroupSelect: React.FC<GroupSelectProps> = ({
	name = 'groupId',
	value,
	onChange,
	fieldName,
	disabled = false,
	placeholder = '선택해주세요.',
}) => {
	const fieldData = useGroupField(fieldName);

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
		/>
	);
};
