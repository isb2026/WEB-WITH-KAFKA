import React, { useMemo, useState, useEffect } from 'react';
import { SelectFieldComponent, SelectFieldProps } from '@moornmo/components';
import { useAccountStyleField } from '@esg/hooks/accountStyle/useAccountStyleFieldQuery';
import { useAccountStyleListQuery } from '@esg/hooks/accountStyle/useAccountStyleListQuery';

export interface AccountStyleSelectProps extends SelectFieldProps {
	name: string;
	value: any;
	onChange: (value: any) => void;
	fieldName: string;
	disabled?: boolean;
	placeholder?: string;
	setter?: (name: string, value: any) => void;
}

export const AccountStyleSelect: React.FC<AccountStyleSelectProps> = ({
	name = 'caption',
	value,
	onChange,
	fieldName,
	disabled = false,
	placeholder = '선택해주세요.',
	setter,
	// props
}) => {
	const [selectedAccountStyleId, setSelectedAccountStyleId] = useState<number>(0);
	const fieldData = useAccountStyleField(fieldName);
	const accountStyle = useAccountStyleListQuery({ page: 0, size: 1, searchRequest: { id: selectedAccountStyleId } });

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

	useEffect(() => {
		if (accountStyle.data?.content && setter) {
			const dataType = accountStyle.data.content[0]?.dataType;
			if (dataType) {
				setter('unit', dataType.uom);
				setter('ghgScope', dataType.ghgScope);
			}
		}
	}, [accountStyle.data]);

	return (
		<SelectFieldComponent
			name={name}
			value={value}
			options={options}
			onChange={(e) => {
				onChange(e.target.value);
				setSelectedAccountStyleId(Number(e.target.value));
			}}
			disabled={disabled}
			placeholder={placeholder}
		/>
	);
};
