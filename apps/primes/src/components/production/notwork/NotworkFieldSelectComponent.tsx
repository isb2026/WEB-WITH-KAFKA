import React, { useState, useEffect } from 'react';
import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
} from '@repo/radix-ui/components';
import {
	useNotworkMasterFieldQuery,
	useNotworkDetailFieldQuery,
} from '@primes/hooks/production';

interface NotworkFieldSelectComponentProps {
	fieldKey: string; // Field API에서 사용할 필드명 (필수)
	type: 'master' | 'detail'; // Master 또는 Detail Field API 선택
	valueKey?: string; // 응답에서 value로 사용할 키 (기본: 'id')
	labelKey?: string; // 응답에서 label로 사용할 키 (기본: 'value')
	value?: string | null;
	onChange?: (value: string) => void;
	disabled?: boolean;
	placeholder?: string;
}

export const NotworkFieldSelectComponent: React.FC<
	NotworkFieldSelectComponentProps
> = ({
	fieldKey,
	type = 'master',
	valueKey = 'id',
	labelKey = 'value',
	value = '',
	onChange,
	disabled = false,
	placeholder = '옵션을 선택하세요',
}) => {
	// 타입에 따라 적절한 Hook 사용
	const masterQuery = useNotworkMasterFieldQuery(fieldKey, type === 'master');
	const detailQuery = useNotworkDetailFieldQuery(fieldKey, type === 'detail');

	const { data, isLoading, error } =
		type === 'master' ? masterQuery : detailQuery;
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

// 편의를 위한 Wrapper 컴포넌트들
export const NotworkMasterFieldSelect: React.FC<
	Omit<NotworkFieldSelectComponentProps, 'type'>
> = (props) => <NotworkFieldSelectComponent {...props} type="master" />;

export const NotworkDetailFieldSelect: React.FC<
	Omit<NotworkFieldSelectComponentProps, 'type'>
> = (props) => <NotworkFieldSelectComponent {...props} type="detail" />;
