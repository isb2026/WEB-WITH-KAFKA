import React, { useMemo, useState, useEffect } from 'react';
import { SelectFieldComponent, SelectFieldProps } from '@moornmo/components';
// import {
// 	UseFormRegister,
// 	UseFormWatch,
// 	UseFormSetValue,
// } from 'react-hook-form';
// import { FieldErrors } from 'react-hook-form';
import { useAccount } from '@esg/hooks/account/useAccount';

export interface CompanyAccountSelectProps extends SelectFieldProps {
	name: string;
	companyId?: null | number;
	value: any;
	onChange: (value: any) => void;
	fieldName: string;
	disabled?: boolean;
	placeholder?: string;
	watch?: (name: string) => any;
	refererName?: string;
}

export const CompanyAccountSelect: React.FC<CompanyAccountSelectProps> = ({
	name = 'accountId',
	value,
	onChange,
	fieldName,
	disabled = false,
	placeholder = '선택해주세요.',
	companyId = null,
	refererName,
	watch,
}) => {
	const [selectedCompId, setSelectedCompId] = useState<null | number>(null);

	const { list } = useAccount({
		page: 0,
		size: 100,
		companyId: selectedCompId ? selectedCompId : companyId,
	});

	const options = useMemo(() => {
		if (list.data?.content) {
			return list.data.content.map((field: any) => {
				return {
					label: field[fieldName],
					value: field.id,
				};
			});
		} else {
			return [];
		}
	}, [list.data, companyId, selectedCompId]);

	useEffect(() => {
		if (watch && refererName) {
			const refererNameValue = watch(refererName);
			setSelectedCompId(refererNameValue);
		}
	}, [refererName, watch]);

	return (
		<SelectFieldComponent
			name={name}
			value={value}
			options={options}
			onChange={(e) => onChange(e.target.value)}
			disabled={disabled}
			onFocus={(e) => {
				if (watch && refererName) {
					const comp = watch(refererName);
					if (comp) {
						setSelectedCompId(comp);
					}
				}
			}}
			placeholder={placeholder}
		/>
	);
};
