import React, { useState, useEffect, useCallback } from 'react';
import { RadixTextInput, Button } from '@repo/radix-ui/components';
import { Eye, EyeOff, Check, X, Loader2, Search } from 'lucide-react';
import { SignUpData } from '../SignUp';

// Daum 우편번호 서비스 타입 정의
declare global {
	interface Window {
		daum: {
			Postcode: new (options: {
				oncomplete: (data: {
					zonecode: string;
					address: string;
					addressType: string;
					bname: string;
					buildingName: string;
				}) => void;
				width?: string;
				height?: string;
			}) => {
				open: () => void;
			};
		};
	}
}

interface AdminAccountStepProps {
	data: SignUpData;
	onUpdate: (data: Partial<SignUpData>) => void;
	onUsernameValidationChange?: (isValid: boolean) => void;
}

export const AdminAccountStep: React.FC<AdminAccountStepProps> = ({
	data,
	onUpdate,
	onUsernameValidationChange,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [usernameCheckResult, setUsernameCheckResult] = useState<{
		isAvailable: boolean;
		message: string;
	} | null>(null);

	// Username 유효성 검사
	const usernameValidation = {
		length: data.username.length >= 5 && data.username.length <= 50,
		format: /^[a-zA-Z0-9@._-]+$/.test(data.username),
		noDoubleDash: !data.username.includes('--'),
	};

	const isUsernameValid = Object.values(usernameValidation).every(Boolean);

	// Username 중복 체크 API 호출
	const checkUsernameAvailability = useCallback(async (username: string, tenantId: number) => {
		if (!username || !isUsernameValid) {
			setUsernameCheckResult(null);
			return;
		}

		setIsCheckingUsername(true);
		setUsernameCheckResult(null);

		try {
			const response = await fetch(
				`https://api.orcamaas.com/user/auth/check-username?tenantId=${tenantId}&username=${encodeURIComponent(username)}`,
				{
					method: 'GET',
					headers: {
						'accept': '*/*',
					},
				}
			);

			if (response.ok) {
				const result = await response.json();
				setUsernameCheckResult({
					isAvailable: result.available !== false, // API 응답 구조에 따라 조정 필요
					message: result.available !== false ? '사용 가능한 사용자명입니다.' : '이미 사용 중인 사용자명입니다.',
				});
			} else {
				const errorText = await response.text();
				let errorMessage = '사용자명 확인 중 오류가 발생했습니다.';
				
				try {
					const errorData = JSON.parse(errorText);
					if (errorData.message) {
						errorMessage = errorData.message;
					}
				} catch (e) {
					// JSON 파싱 실패 시 기본 메시지 사용
				}

				setUsernameCheckResult({
					isAvailable: false,
					message: errorMessage,
				});
			}
		} catch (error) {
			console.error('Username check error:', error);
			setUsernameCheckResult({
				isAvailable: false,
				message: '네트워크 오류가 발생했습니다.',
			});
		} finally {
			setIsCheckingUsername(false);
		}
	}, [isUsernameValid]);

	// Username 변경 시 debounced API 호출
	useEffect(() => {
		if (!data.username || !isUsernameValid) {
			setUsernameCheckResult(null);
			return;
		}

		const timeoutId = setTimeout(() => {
			// 임시로 tenantId를 10001로 설정 (실제로는 부모 컴포넌트에서 전달받아야 함)
			checkUsernameAvailability(data.username, 10001);
		}, 500); // 500ms 디바운스

		return () => clearTimeout(timeoutId);
	}, [data.username, checkUsernameAvailability]);

	// Username 전체 유효성 상태를 부모에게 전달
	useEffect(() => {
		const isFullyValid = isUsernameValid && usernameCheckResult?.isAvailable === true;
		onUsernameValidationChange?.(isFullyValid);
	}, [isUsernameValid, usernameCheckResult, onUsernameValidationChange]);

	// Daum 우편번호 서비스 스크립트 로드
	useEffect(() => {
		const script = document.createElement('script');
		script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
		script.async = true;
		document.head.appendChild(script);

		return () => {
			// 컴포넌트 언마운트 시 스크립트 제거
			const existingScript = document.querySelector('script[src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"]');
			if (existingScript) {
				document.head.removeChild(existingScript);
			}
		};
	}, []);

	// 주소 검색 함수
	const handleAddressSearch = useCallback(() => {
		if (!window.daum) {
			alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
			return;
		}

		new window.daum.Postcode({
			oncomplete: (data) => {
				// 선택된 주소 정보를 폼에 반영
				onUpdate({
					zipcode: data.zonecode,
					addressMaster: data.address,
				});
				
				// 상세주소 입력 필드로 포커스 이동
				const detailAddressInput = document.getElementById('address-detail') as HTMLInputElement;
				if (detailAddressInput) {
					detailAddressInput.focus();
				}
			},
			width: '100%',
			height: '400px',
		}).open();
	}, [onUpdate]);

	// 비밀번호 유효성 검사
	const passwordValidation = {
		length: data.managerPassword.length >= 12 && data.managerPassword.length <= 64,
		uppercase: /[A-Z]/.test(data.managerPassword),
		lowercase: /[a-z]/.test(data.managerPassword),
		number: /\d/.test(data.managerPassword),
	};

	const isPasswordValid = Object.values(passwordValidation).every(Boolean);
	const passwordsMatch = data.managerPassword === confirmPassword && confirmPassword !== '';

	// 이메일 유효성 검사
	const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.managerEmail);

	// 전화번호 포맷팅
	const formatPhoneNumber = (value: string) => {
		const numbers = value.replace(/[^\d]/g, '');
		
		if (numbers.length <= 3) {
			return numbers;
		} else if (numbers.length <= 7) {
			return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
		} else {
			return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
		}
	};

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formatted = formatPhoneNumber(e.target.value);
		onUpdate({ managerPhone: formatted });
	};

	return (
		<div className="space-y-6">
			<div className="text-center mb-6">
				<h3 className="text-xl font-semibold text-gray-800 mb-2">
					관리자 계정을 생성하세요
				</h3>
				<p className="text-sm text-gray-600">
					테넌트의 최고 관리자 계정 정보를 입력해주세요
				</p>
			</div>

			{/* 계정 ID */}
			<div>
				<label
					htmlFor="username"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					아이디 <span className="text-red-500">*</span>
				</label>
				<div className="relative">
					<RadixTextInput
						id="username"
						type="text"
						value={data.username}
						onChange={(e) => onUpdate({ username: e.target.value })}
						placeholder="로그인에 사용할 ID를 입력하세요"
						className={`w-full h-12 px-4 pr-12 border transition-all bg-white text-sm shadow-sm placeholder-gray-400 ${
							data.username && (!isUsernameValid || (usernameCheckResult && !usernameCheckResult.isAvailable))
								? 'border-red-300 focus:border-red-500 focus:ring-red-100'
								: data.username && usernameCheckResult && usernameCheckResult.isAvailable
								? 'border-green-300 focus:border-green-500 focus:ring-green-100'
								: 'border-gray-300 focus:border-purple-600 focus:ring-purple-100'
						}`}
						style={{
							height: '48px',
							borderRadius: '12px',
						}}
						required
					/>
					{/* 상태 아이콘 */}
					<div className="absolute inset-y-0 right-0 flex items-center pr-3">
						{isCheckingUsername ? (
							<Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
						) : data.username && isUsernameValid && usernameCheckResult ? (
							usernameCheckResult.isAvailable ? (
								<Check className="w-4 h-4 text-green-500" />
							) : (
								<X className="w-4 h-4 text-red-500" />
							)
						) : null}
					</div>
				</div>
				<div className="mt-2 text-xs">
					<p className="text-gray-500 mb-1">
						영문 대/소문자, 숫자, 특수문자(@, ., -, _) 허용 (5~50자)
					</p>
					{data.username && (
						<div className="space-y-1">
							<div className={`flex items-center gap-2 ${usernameValidation.length ? 'text-green-600' : 'text-red-500'}`}>
								{usernameValidation.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
								<span>5~50자 길이</span>
							</div>
							<div className={`flex items-center gap-2 ${usernameValidation.format ? 'text-green-600' : 'text-red-500'}`}>
								{usernameValidation.format ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
								<span>영문, 숫자, 허용된 특수문자만 사용</span>
							</div>
							<div className={`flex items-center gap-2 ${usernameValidation.noDoubleDash ? 'text-green-600' : 'text-red-500'}`}>
								{usernameValidation.noDoubleDash ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
								<span>연속된 하이픈(--) 사용 불가</span>
							</div>
						</div>
					)}
					
					{/* 중복 체크 결과 */}
					{data.username && isUsernameValid && usernameCheckResult && (
						<div className={`mt-2 flex items-center gap-2 text-xs ${
							usernameCheckResult.isAvailable ? 'text-green-600' : 'text-red-500'
						}`}>
							{usernameCheckResult.isAvailable ? (
								<Check className="w-3 h-3" />
							) : (
								<X className="w-3 h-3" />
							)}
							<span>{usernameCheckResult.message}</span>
						</div>
					)}
				</div>
			</div>

			{/* 비밀번호 */}
			<div>
				<label
					htmlFor="admin-password"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					비밀번호 <span className="text-red-500">*</span>
				</label>
				<div className="relative">
					<RadixTextInput
						id="admin-password"
						type={showPassword ? 'text' : 'password'}
					value={data.managerPassword}
					onChange={(e) => onUpdate({ managerPassword: e.target.value })}
						placeholder="비밀번호를 입력하세요"
						className={`w-full h-12 px-4 pr-12 border transition-all bg-white text-sm shadow-sm placeholder-gray-400 ${
							data.managerPassword && !isPasswordValid
								? 'border-red-300 focus:border-red-500 focus:ring-red-100'
								: 'border-gray-300 focus:border-purple-600 focus:ring-purple-100'
						}`}
						style={{
							height: '48px',
							borderRadius: '12px',
						}}
						required
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition"
					>
						{showPassword ? (
							<EyeOff className="h-5 w-5 text-gray-400" />
						) : (
							<Eye className="h-5 w-5 text-gray-400" />
						)}
					</button>
				</div>

				{/* 비밀번호 요구사항 */}
				{data.managerPassword && (
					<div className="mt-3 space-y-2">
						<p className="text-xs text-gray-600 mb-2">비밀번호 요구사항:</p>
						<div className="grid grid-cols-1 gap-1 text-xs">
							<div className={`flex items-center gap-2 ${passwordValidation.length ? 'text-green-600' : 'text-gray-500'}`}>
								{passwordValidation.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
								12~64자 길이
							</div>
							<div className={`flex items-center gap-2 ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
								{passwordValidation.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
								대문자 포함
							</div>
							<div className={`flex items-center gap-2 ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
								{passwordValidation.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
								소문자 포함
							</div>
							<div className={`flex items-center gap-2 ${passwordValidation.number ? 'text-green-600' : 'text-gray-500'}`}>
								{passwordValidation.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
								숫자 포함
							</div>
						</div>
					</div>
				)}
			</div>

			{/* 비밀번호 확인 */}
			<div>
				<label
					htmlFor="confirm-password"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					비밀번호 확인 <span className="text-red-500">*</span>
				</label>
				<div className="relative">
					<RadixTextInput
						id="confirm-password"
						type={showConfirmPassword ? 'text' : 'password'}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="비밀번호를 다시 입력하세요"
						className={`w-full h-12 px-4 pr-12 border transition-all bg-white text-sm shadow-sm placeholder-gray-400 ${
							confirmPassword && !passwordsMatch
								? 'border-red-300 focus:border-red-500 focus:ring-red-100'
								: confirmPassword && passwordsMatch
								? 'border-green-300 focus:border-green-500 focus:ring-green-100'
								: 'border-gray-300 focus:border-purple-600 focus:ring-purple-100'
						}`}
						style={{
							height: '48px',
							borderRadius: '12px',
						}}
						required
					/>
					<button
						type="button"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition"
					>
						{showConfirmPassword ? (
							<EyeOff className="h-5 w-5 text-gray-400" />
						) : (
							<Eye className="h-5 w-5 text-gray-400" />
						)}
					</button>
				</div>
				{confirmPassword && !passwordsMatch && (
					<p className="text-xs text-red-500 mt-1">
						비밀번호가 일치하지 않습니다
					</p>
				)}
				{confirmPassword && passwordsMatch && (
					<p className="text-xs text-green-500 mt-1">
						비밀번호가 일치합니다
					</p>
				)}
			</div>

			{/* 관리자 이름 */}
			<div>
				<label
					htmlFor="admin-name"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					관리자 이름 <span className="text-red-500">*</span>
				</label>
				<RadixTextInput
					id="admin-name"
					type="text"
					value={data.managerName}
					onChange={(e) => onUpdate({ managerName: e.target.value })}
					placeholder="관리자 이름을 입력하세요"
					className="w-full h-12 px-4 border border-gray-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all bg-white text-sm shadow-sm placeholder-gray-400"
					style={{
						height: '48px',
						borderRadius: '12px',
					}}
					required
				/>
			</div>

			{/* 이메일 */}
			<div>
				<label
					htmlFor="admin-email"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					이메일 주소 <span className="text-red-500">*</span>
				</label>
				<RadixTextInput
					id="admin-email"
					type="email"
					value={data.managerEmail}
					onChange={(e) => onUpdate({ managerEmail: e.target.value })}
					placeholder="admin@company.com"
					className={`w-full h-12 px-4 border transition-all bg-white text-sm shadow-sm placeholder-gray-400 ${
						data.managerEmail && !isEmailValid
							? 'border-red-300 focus:border-red-500 focus:ring-red-100'
							: 'border-gray-300 focus:border-purple-600 focus:ring-purple-100'
					}`}
					style={{
						height: '48px',
						borderRadius: '12px',
					}}
					required
				/>
				{data.managerEmail && !isEmailValid && (
					<p className="text-xs text-red-500 mt-1">
						올바른 이메일 형식을 입력해주세요
					</p>
				)}
			</div>

			{/* 전화번호 */}
			<div>
				<label
					htmlFor="admin-phone"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					전화번호 <span className="text-red-500">*</span>
				</label>
				<RadixTextInput
					id="admin-phone"
					type="tel"
					value={data.managerPhone}
					onChange={handlePhoneChange}
					placeholder="010-0000-0000"
					maxLength={13}
					className="w-full h-12 px-4 border border-gray-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all bg-white text-sm shadow-sm placeholder-gray-400"
					style={{
						height: '48px',
						borderRadius: '12px',
					}}
					required
				/>
			</div>

			{/* 집 전화번호 */}
			<div>
				<label
					htmlFor="home-tel"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					집 전화번호
				</label>
				<RadixTextInput
					id="home-tel"
					type="tel"
					value={data.homeTel}
					onChange={(e) => onUpdate({ homeTel: e.target.value })}
					placeholder="02-123-4567"
					className="w-full h-12 px-4 border border-gray-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all bg-white text-sm shadow-sm placeholder-gray-400"
					style={{
						height: '48px',
						borderRadius: '12px',
					}}
				/>
			</div>

			{/* 우편번호 및 주소 검색 */}
			<div>
				<label
					htmlFor="zipcode"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					우편번호 <span className="text-red-500">*</span>
				</label>
				<div className="flex gap-2">
					<RadixTextInput
						id="zipcode"
						type="text"
						value={data.zipcode}
						onChange={(e) => onUpdate({ zipcode: e.target.value })}
						placeholder="12345"
						maxLength={5}
						readOnly
						className="flex-1 h-12 px-4 border border-gray-300 bg-gray-50 text-sm shadow-sm placeholder-gray-400 cursor-pointer"
						style={{
							height: '48px',
							borderRadius: '12px',
						}}
						onClick={handleAddressSearch}
						required
					/>
					<Button
						type="button"
						onClick={handleAddressSearch}
						className="h-12 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 flex items-center gap-2 whitespace-nowrap"
						style={{
							height: '48px',
							borderRadius: '12px',
						}}
					>
						<Search className="w-4 h-4" />
						주소 검색
					</Button>
				</div>
				<p className="text-xs text-gray-500 mt-1">
					주소 검색 버튼을 클릭하여 우편번호와 주소를 자동으로 입력하세요
				</p>
			</div>

			{/* 주소 */}
			<div>
				<label
					htmlFor="address-master"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					주소 <span className="text-red-500">*</span>
				</label>
				<RadixTextInput
					id="address-master"
					type="text"
					value={data.addressMaster}
					onChange={(e) => onUpdate({ addressMaster: e.target.value })}
					placeholder="주소 검색을 통해 자동으로 입력됩니다"
					readOnly
					className="w-full h-12 px-4 border border-gray-300 bg-gray-50 text-sm shadow-sm placeholder-gray-400 cursor-pointer"
					style={{
						height: '48px',
						borderRadius: '12px',
					}}
					onClick={handleAddressSearch}
					required
				/>
			</div>

			{/* 상세주소 */}
			<div>
				<label
					htmlFor="address-detail"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					상세주소
				</label>
				<RadixTextInput
					id="address-detail"
					type="text"
					value={data.addressDetail}
					onChange={(e) => onUpdate({ addressDetail: e.target.value })}
					placeholder="101동 202호"
					className="w-full h-12 px-4 border border-gray-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all bg-white text-sm shadow-sm placeholder-gray-400"
					style={{
						height: '48px',
						borderRadius: '12px',
					}}
				/>
			</div>

			{/* 안내 메시지 */}
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg
							className="h-5 w-5 text-yellow-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-yellow-800">
							관리자 계정 안내
						</h3>
						<div className="mt-2 text-sm text-yellow-700">
							<p>
								생성되는 관리자 계정은 테넌트의 모든 권한을 가지게 됩니다.
								보안을 위해 강력한 비밀번호를 설정해주세요.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
