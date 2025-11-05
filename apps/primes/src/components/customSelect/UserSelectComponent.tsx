import React, { useMemo } from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { User } from '@primes/types/users';
import { useUsers } from '@primes/hooks/users/useUsers';

interface UserSelectProps {
	placeholder?: string;
	onChange?: (value: string) => void;
	onUserIdChange?: (userId: number) => void;
	onUserDataChange?: (userData: {
		userId: number;
		username?: string;
		name?: string;
		department?: string;
	}) => void;
	className?: string;
	value?: string | number | null;
	disabled?: boolean;
	showUserName?: boolean;
	error?: boolean;
	// 검색 조건
	searchParams?: Partial<{
		department?: string;
		partLevel?: string;
		partPosition?: string;
	}>;
}

type Option = ComboBoxItem & {
	userId: number;
	username?: string;
	name?: string;
	department?: string;
	raw: User;
};

export const UserSelectComponent: React.FC<UserSelectProps> = ({
	placeholder = '사용자를 선택하세요',
	onChange,
	onUserIdChange,
	onUserDataChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled = false,
	showUserName = false,
	error = false,
	searchParams, // do NOT default to {} – keeps reference stable
}) => {
	// Build a stable request object
	const searchRequest = useMemo(
		() => ({
			...(searchParams ?? {}),
		}),
		[searchParams]
	);

	// 사용자 데이터
	const { list } = useUsers({
		page: 0,
		size: 100,
		searchRequest,
	});

	const { data: response, isLoading } = list;

	// Normalize response to array
	const data = useMemo<User[]>(() => {
		if (!response) return [];
		if (Array.isArray(response)) return response as User[];
		if (response.content && Array.isArray(response.content)) {
			return response.content as User[];
		}
		return [];
	}, [response]);

	// Build options with userId as the actual value
	const options = useMemo<Option[]>(() => {
		return data.map((user) => {
			let label = user.name || '';
			if (showUserName && user.username) {
				label = `${label} [ ${user.username} ]`;
			}

			return {
				label: label || `User ${user.id}`,
				value: user.id?.toString() || '', // 실제 ID를 value로 사용
				userId: user.id || 0, // undefined인 경우 0으로 기본값 설정
				username: user.username,
				name: user.name,
				department: user.department,
				raw: user,
			};
		});
	}, [data, showUserName]);

	// Derive selected from form value (userId) + options
	const selectedItem: ComboBoxItem | null = useMemo(() => {
		const v = value?.toString() ?? '';
		if (!v) return null;
		// Match by userId string
		const byId = options.find((o) => o.value === v);
		if (byId) return byId;

		// Fallback: if someone passes an id by mistake, try matching by id
		const asId = Number(v);
		if (!Number.isNaN(asId)) {
			const byIdNum = options.find((o) => o.userId === asId);
			if (byIdNum) return byIdNum;
		}
		return null;
	}, [value, options]);

	const handleChange = (item: ComboBoxItem | null) => {
		if (!item) {
			onChange?.('');
			// Clear callbacks are not called when item is null
			return;
		}

		// RHF field will be userId
		onChange?.(item.value);

		const selectedOption = options.find((opt) => opt.value === item.value);

		if (selectedOption) {
			if (onUserIdChange) {
				onUserIdChange(selectedOption.userId);
			}
			if (onUserDataChange) {
				onUserDataChange({
					userId: selectedOption.userId,
					username: selectedOption.username,
					name: selectedOption.name,
					department: selectedOption.department,
				});
			}
		}
	};

	return (
		<div className={className}>
			<ComboBox
				items={options}
				value={selectedItem}
				onChange={handleChange}
				placeholder={isLoading ? '로딩 중...' : placeholder}
				disabled={disabled || isLoading}
				error={error}
			/>
		</div>
	);
};

export default UserSelectComponent;
