import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@repo/i18n';
import { useCommand } from '@primes/hooks/production/useCommand';
import { CommandSearchRequest } from '@primes/types/production/command';


interface CommandSearchInputProps {
  onCommandFound: (commandData: any) => void;
  onCommandNotFound?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const CommandSearchInput: React.FC<CommandSearchInputProps> = ({
  onCommandFound,
  onCommandNotFound,
  placeholder = '예: WO-240125-001',
  disabled = false,
  className = '',
  value: controlledValue,
  onChange: controlledOnChange
}) => {
	const { t } = useTranslation('common');
	const [internalValue, setInternalValue] = useState('');
	const [isSearching, setIsSearching] = useState(false);

	// 제어 컴포넌트인지 비제어 컴포넌트인지 확인
	const isControlled = controlledValue !== undefined;
	const inputValue = isControlled ? controlledValue : internalValue;

  // ✅ 초기 렌더링 시 API 호출을 방지하기 위해 enabled를 false로 설정
  const [commandSearchRequest, setCommandSearchRequest] = useState<CommandSearchRequest | null>(null);
  const { list: commandList } = useCommand({
    searchRequest: commandSearchRequest || { commandNo: '' },
    page: 0,
    size: 100,
  });



	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;

			if (isControlled && controlledOnChange) {
				controlledOnChange(newValue);
			} else {
				setInternalValue(newValue);
			}
		},
		[isControlled, controlledOnChange]
	);

	const handleSearch = useCallback(async () => {
		const commandNo = inputValue?.trim();

		if (!commandNo) {
			toast.error(t('inspection.toast.commandRequired'));
			return;
		}

		setIsSearching(true);

		try {
			// ✅ 검색 요청 설정 후 API 호출
			const searchRequest = { commandNo: commandNo };
			setCommandSearchRequest(searchRequest);

			// ✅ 상태 업데이트 후 약간의 지연을 두고 API 호출
			await new Promise((resolve) => setTimeout(resolve, 100));

			const response = await commandList.refetch();
			const commandData = response.data?.data?.content || [];

			if (commandData.length === 0) {
				toast.error(
					`작업지시서 번호 '${commandNo}'를 찾을 수 없습니다.`
				);
				if (onCommandNotFound) {
					onCommandNotFound();
				}
				return;
			}

      const commandInfo = commandData[0];
      toast.success('작업지시서를 찾았습니다.');
      
      // onCommandFound는 한 번만 호출
      onCommandFound(commandInfo);
      
    } catch (error) {
      console.error('작업지시서 검색 오류:', error);
      toast.error('작업지시서 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  }, [inputValue, commandList, onCommandFound, onCommandNotFound, t]);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				handleSearch();
			}
		},
		[handleSearch]
	);

	return (
		<div className={`flex gap-2 ${className}`}>
			<input
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				onKeyPress={handleKeyPress}
				placeholder={placeholder}
				disabled={disabled || isSearching}
				className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
			/>
			<button
				type="button"
				onClick={handleSearch}
				disabled={disabled || isSearching || !inputValue?.trim()}
				className="px-4 py-2 bg-Colors-Brand-700 text-white rounded-md hover:bg-Colors-Brand-800 focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
			>
				{isSearching ? (
					<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
				) : (
					<Search size={16} />
				)}
				{t('inspection.actions.search')}
			</button>
		</div>
	);
};

export default CommandSearchInput;
