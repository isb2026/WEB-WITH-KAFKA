import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@repo/i18n';
import { useLot } from '@primes/hooks/production/useLot';
import { useCommandProgress } from '@primes/hooks/production/commandProgress/useCommandProgress';
import { CommandProgressSearchRequest } from '@primes/types/production/commandProgressTypes';

interface LotSearchInputProps {
  onLotFound: (lotData: any) => void;
  onLotNotFound?: () => void;
  loadProgressData?: boolean; // 공정 데이터를 불러올지 여부
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const LotSearchInput: React.FC<LotSearchInputProps> = ({
  onLotFound,
  onLotNotFound,
  loadProgressData = false,
  placeholder = '예: LOT-240125-002',
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

  const [lotSearchRequest, setLotSearchRequest] = useState<{ lotNo: string } | null>(null);
  const { list: lotList } = useLot({
    searchRequest: lotSearchRequest || { lotNo: '0' },
    page: 0,
    size: 1
  });

  // CommandProgress 관련 상태 및 훅
  const [commandProgressSearchRequest, setCommandProgressSearchRequest] = useState<CommandProgressSearchRequest | null>(null);
  const { list: commandProgressList } = useCommandProgress({
    searchRequest: commandProgressSearchRequest || { commandId: 0 },
    page: 0,
    size: 100
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (isControlled && controlledOnChange) {
      controlledOnChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  }, [isControlled, controlledOnChange]);

  const handleSearch = useCallback(async () => {
    const lotNumber = inputValue?.trim();
    
    if (!lotNumber) {
      toast.error(t('inspection.toast.lotRequired'));
      return;
    }

    setIsSearching(true);
    
    try {
      setLotSearchRequest({ lotNo: lotNumber });
      const lotResponse = await lotList.refetch();
      const lotData = lotResponse.data?.content || [];
      
      if (lotData.length === 0) {
        toast.error(`LOT 번호 '${lotNumber}'를 찾을 수 없습니다.`);
        if (onLotNotFound) {
          onLotNotFound();
        }
        return;
      }

      const lotInfo = lotData[0];
      toast.success('LOT 정보를 찾았습니다.');

      let finalLotInfo = lotInfo;

      // 공정 데이터를 불러올지 확인
      if (loadProgressData && lotInfo.commandId) {
        try {
          setCommandProgressSearchRequest({ commandId: lotInfo.commandId });
          const progressResponse = await commandProgressList.refetch();
          const progressData = progressResponse.data?.data?.content || [];
          finalLotInfo = { ...finalLotInfo, progressData };
        } catch (progressError) {
          console.error('공정 데이터 조회 오류:', progressError);
          // 공정 데이터 조회 실패해도 기본 정보는 전달
        }
      }
      
      onLotFound(finalLotInfo);
      
    } catch (error) {
      console.error('LOT 검색 오류:', error);
      toast.error('LOT 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  }, [inputValue, lotList, onLotFound, onLotNotFound, t, loadProgressData, commandProgressList]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

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

export default LotSearchInput; 