import React, { useState } from 'react';
import { fetchBusinessStatus } from '@moornmo/utils/businessAPI';
import styled from '@emotion/styled';

interface BusinessRegCheckerProps {
  onChange?: (value: string) => void;
  value?: string;
}

const Container = styled.div`
  margin-top: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Input = styled.input<{ hasError?: boolean; isVerified?: boolean }>`
  flex: 1;
  padding: 12px 16px;
  padding-right: ${props => props.isVerified !== undefined ? '40px' : '16px'};
  border: 2px solid ${props => {
    if (props.isVerified === true) return '#52c41a';
    if (props.isVerified === false) return '#ff4d4f';
    if (props.hasError) return '#ff4d4f';
    return '#e6e6e6';
  }};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => {
      if (props.isVerified === true) return '#52c41a';
      if (props.isVerified === false) return '#ff4d4f';
      if (props.hasError) return '#ff4d4f';
      return '#4a90e2';
    }};
    box-shadow: 0 0 0 2px ${props => {
      if (props.isVerified === true) return 'rgba(82, 196, 26, 0.2)';
      if (props.isVerified === false) return 'rgba(255, 77, 79, 0.2)';
      if (props.hasError) return 'rgba(255, 77, 79, 0.2)';
      return 'rgba(74, 144, 226, 0.2)';
    }};
  }

  &::placeholder {
    color: #999;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 140px; // Adjust based on button width + gap
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #666;
  }

  &:focus {
    outline: none;
    color: #666;
  }
`;

const VerificationStatus = styled.div<{ isVerified?: boolean }>`
  position: absolute;
  right: 140px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  display: flex;
  align-items: center;
  color: ${props => {
    if (props.isVerified === true) return '#52c41a';
    if (props.isVerified === false) return '#ff4d4f';
    return 'transparent';
  }};
  cursor: ${props => props.isVerified === false ? 'pointer' : 'default'};
  
  &:hover {
    opacity: ${props => props.isVerified === false ? 0.8 : 1};
  }
`;

const Button = styled.button<{ isLoading?: boolean }>`
  min-width: 120px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: ${props => props.isLoading ? '#87a2c1' : '#4a90e2'};
  color: white;
  font-weight: 500;
  font-size: 16px;
  cursor: ${props => props.isLoading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.isLoading ? '#87a2c1' : '#357abd'};
  }

  &:active {
    transform: ${props => props.isLoading ? 'none' : 'translateY(1px)'};
  }
`;

const Modal = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div<{ isSuccess?: boolean }>`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 90%;
  text-align: center;

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    color: ${props => props.isSuccess ? '#52c41a' : '#ff4d4f'};
  }

  .message {
    font-size: 18px;
    margin-bottom: 24px;
    color: #333;
  }
`;

const ModalButton = styled.button`
  padding: 8px 24px;
  border: none;
  border-radius: 6px;
  background: #4a90e2;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #357abd;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '⚠️';
  }
`;

export const BusinessRegChecker: React.FC<BusinessRegCheckerProps> = ({ onChange, value }) => {
  const [bizNo, setBizNo] = useState(value || "");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined);
  const [modalInfo, setModalInfo] = useState<{ isVisible: boolean; isSuccess: boolean; message: string }>({
    isVisible: false,
    isSuccess: false,
    message: '',
  });

  const handleCheck = async () => {
    if (checking) return;
    
    const cleanNumber = bizNo.replace(/[^0-9]/g, '');
    
    if (!cleanNumber || cleanNumber.length !== 10) {
      setError("10자리 사업자등록번호를 입력하세요.");
      setIsVerified(undefined);
      return;
    }

    setChecking(true);
    setError(null);

    try {
      const res = await fetchBusinessStatus(cleanNumber);
      const status = res?.data?.[0]?.b_stt_cd;
      const businessStatus = res?.data?.[0]?.b_stt;

      const isValid = status === "01";
      setIsVerified(isValid);

      setModalInfo({
        isVisible: true,
        isSuccess: isValid,
        message: isValid 
          ? `유효한 사업자입니다.\n(${businessStatus})`
          : `유효하지 않은 사업자등록번호입니다.\n(${businessStatus || '확인불가'})`,
      });
    } catch (err) {
      console.error('💥 Verification error:', err);
      setError("조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setIsVerified(undefined);
    } finally {
      setChecking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCheck();
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeModal();
  };

  const closeModal = () => {
    setModalInfo(prev => ({ ...prev, isVisible: false }));
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBizNo('');
    setError(null);
    setIsVerified(undefined);
    onChange?.('');
  };

  const formatBizNo = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
  };

  return (
    <Container>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleCheck();
      }}>
        <Label htmlFor="bizNo">사업자등록번호</Label>
        <InputWrapper>
          <Input
            id="bizNo"
            type="text"
            placeholder="000-00-00000"
            value={formatBizNo(bizNo)}
            hasError={!!error}
            isVerified={isVerified}
            onChange={(e) => {
              const newValue = e.target.value;
              setBizNo(newValue);
              setError(null);
              setIsVerified(undefined);
              onChange?.(newValue);
            }}
            onKeyDown={handleKeyDown}
            maxLength={12}
            autoComplete="off"
          />
          <VerificationStatus 
            isVerified={isVerified}
            onClick={isVerified === false ? handleClear : undefined}
            title={isVerified === false ? "입력 지우기" : undefined}
          >
            {isVerified === true && '✓'}
            {isVerified === false && '✕'}
          </VerificationStatus>
          <Button
            type="button"
            disabled={checking}
            isLoading={checking}
            onClick={() => handleCheck()}
          >
            {checking ? '확인 중...' : '번호 확인'}
          </Button>
        </InputWrapper>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>

      {modalInfo.isVisible && (
        <Modal isVisible={true} onClick={closeModal}>
          <ModalContent 
            isSuccess={modalInfo.isSuccess} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="icon">
              {modalInfo.isSuccess ? '✅' : '❌'}
            </div>
            <div className="message">
              {modalInfo.message}
            </div>
            <ModalButton 
              type="button"
              onClick={handleSave}
            >
              저장
            </ModalButton>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}; 