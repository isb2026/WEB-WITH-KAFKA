import React from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { useMoldMasterFieldQuery } from '@primes/hooks/mold/mold-master/useMoldMasterFieldQuery';

interface MoldMasterSelectProps {
	fieldKey?: string;
	valueKey?: string;
	labelKey?: string;
	value?: string | null;
	onChange?: (value: string) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
}

interface FieldOption {
	id: number | string;
	value: string;
	moldName?: string;
	moldCode?: string;
	[key: string]: any; // 다른 필드들도 허용
}

export const MoldMasterSelectComponent: React.FC<MoldMasterSelectProps> =
	React.memo(
		({
			fieldKey = 'moldCode',
			valueKey = 'id',
			labelKey = 'value',
			placeholder,
			onChange,
			className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
			value = '',
			disabled,
		}) => {
			const { data, isLoading, error } =
				useMoldMasterFieldQuery(fieldKey);

			// 옵션 데이터를 메모이제이션으로 최적화
			const options = React.useMemo(() => {
				if (!data || !Array.isArray(data)) return [];

				return data.map((item: FieldOption) => {
					const labelValue =
						item[labelKey] ||
						item.value ||
						item.moldName ||
						item.moldCode ||
						'';
					const valueValue = item[valueKey] || item.id || '';
					return {
						label: labelValue.toString(),
						value: valueValue.toString(),
					};
				});
			}, [data, valueKey, labelKey]);

			const defaultPlaceholder = React.useMemo(
				() => placeholder || '금형을 선택하세요',
				[placeholder]
			);

			// onChange 핸들러를 메모이제이션으로 최적화
			const handleValueChange = React.useCallback(
				(item: ComboBoxItem | null) => {
					onChange?.(item?.value || '');
				},
				[onChange]
			);

			// 현재 선택된 아이템을 찾는 함수
			const selectedItem = React.useMemo(() => {
				if (!value) return null;
				return options.find((option) => option.value === value) || null;
			}, [value, options]);

			// Handle error state
			if (error) {
				return (
					<div className={className}>
						<ComboBox
							items={[]}
							value={null}
							onChange={() => {}}
							placeholder="금형 조회 중 오류가 발생했습니다"
							disabled={true}
						/>
					</div>
				);
			}

			return (
				<div className={className}>
					<ComboBox
						items={options}
						value={selectedItem}
						onChange={handleValueChange}
						placeholder={
							isLoading ? '로딩 중...' : defaultPlaceholder
						}
						disabled={disabled || isLoading}
					/>
				</div>
			);
		}
	);
