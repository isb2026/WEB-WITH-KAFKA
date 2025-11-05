import React, { useState, useEffect } from 'react';
import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
} from '@repo/radix-ui/components';
import { useNotworkMasterFieldQuery } from '@primes/hooks/production';

interface NotworkMasterSelectComponentProps {
	fieldKey?: string; // Field API에서 사용할 필드명
	valueKey?: string; // 응답에서 value로 사용할 키 (기본: 'id')
	labelKey?: string; // 응답에서 label로 사용할 키 (기본: 'value')
	value?: string | null;
	onChange?: (value: string) => void;
	disabled?: boolean;
	placeholder?: string;
}

export const NotworkMasterSelectComponent: React.FC<
	NotworkMasterSelectComponentProps
> = ({
	fieldKey = 'machineName',
	valueKey = 'id',
	labelKey = 'value',
	value = '',
	onChange,
	disabled = false,
	placeholder = '비가동 Master를 선택하세요',
}) => {
	const { data, isLoading, error } = useNotworkMasterFieldQuery(fieldKey);
	const [options, setOptions] = useState<
		Array<{ label: string; value: string }>
	>([]);

	useEffect(() => {
		if (data && Array.isArray(data)) {
			setOptions(
				data.map((item: any) => ({
					label: item[labelKey]?.toString() || '',
					value: item[valueKey]?.toString() || '',
				}))
			);
		}
	}, [data, valueKey, labelKey]);

	if (error) {
		return (
			<RadixSelect
				value=""
				disabled={true}
				placeholder="데이터 로드 실패"
			>
				<RadixSelectGroup>
					<RadixSelectItem value="error">
						데이터 로드 실패
					</RadixSelectItem>
				</RadixSelectGroup>
			</RadixSelect>
		);
	}

	return (
		<RadixSelect
			value={value ?? ''}
			onValueChange={onChange}
			placeholder={isLoading ? '로딩 중...' : placeholder}
			disabled={disabled || isLoading}
		>
			<RadixSelectGroup>
				{options.length === 0 && !isLoading ? (
					<RadixSelectItem value="no-options" disabled>
						옵션이 없습니다
					</RadixSelectItem>
				) : (
					options.map((option, index) => (
						<RadixSelectItem key={index} value={option.value}>
							{option.label}
						</RadixSelectItem>
					))
				)}
			</RadixSelectGroup>
		</RadixSelect>
	);
};
