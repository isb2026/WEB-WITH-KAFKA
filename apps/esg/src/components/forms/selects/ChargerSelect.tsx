import React, { useEffect } from 'react';
import { SelectFieldComponent, SelectFieldProps } from '@moornmo/components';
import { useChargerByCompanyQuery } from '@esg/hooks/charger';

export interface ChargerSelectProps extends SelectFieldProps {
	name: string;
	value: any;
	onChange: (value: any) => void;
	companyId?: string;
	watch?: any; // DynamicForm에서 전달되는 watch 함수
	disabled?: boolean;
	placeholder?: string;
}

export const ChargerSelect: React.FC<ChargerSelectProps> = ({
	name,
	value,
	onChange,
	companyId,
	watch,
	disabled = false,
	placeholder = '담당자를 선택하세요',
	...restProps
}) => {
	// watch 함수로 companyId 가져오기 (우선순위: watch > props)
	const watchedCompanyId = watch ? watch('companyId') : null;
	const effectiveCompanyId = watchedCompanyId || companyId;

	// React Query hook 사용
	const {
		data: chargers,
		isLoading,
		error,
		isError,
	} = useChargerByCompanyQuery(effectiveCompanyId, !!effectiveCompanyId);

	// 담당자 옵션 생성
	const options = React.useMemo(() => {
		if (!chargers || !Array.isArray(chargers)) {
			return [];
		}

		return chargers.map((charger) => ({
			label: `${charger.name}(${charger.department || '미지정'})`,
			value: charger.id?.toString() || charger.username, // ID를 우선 사용, 없으면 username
		}));
	}, [chargers]);

	// 회사가 변경되면 선택된 담당자 초기화
	useEffect(() => {
		if (value && !effectiveCompanyId) {
			onChange('');
		}
	}, [effectiveCompanyId, value, onChange]);

	const dynamicPlaceholder = () => {
		if (!effectiveCompanyId) {
			return '먼저 사업장을 선택하세요';
		}
		if (isLoading) {
			return '담당자 목록을 불러오는 중...';
		}
		if (isError) {
			return '담당자 목록 조회 실패';
		}
		if (options.length === 0) {
			return '등록된 담당자가 없습니다';
		}
		return placeholder;
	};

	return (
		<SelectFieldComponent
			name={name}
			value={value}
			options={options}
			onChange={(e) => onChange(e.target.value)}
			disabled={disabled || isLoading || !effectiveCompanyId}
			placeholder={dynamicPlaceholder()}
			label="담당자"
			{...restProps}
		/>
	);
};
