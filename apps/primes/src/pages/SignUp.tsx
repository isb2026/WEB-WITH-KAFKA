import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@repo/radix-ui/components';
import { toast } from 'sonner';
import { PrivacyAgreementStep } from './signup/PrivacyAgreementStep';
import { TenantCreationStep } from './signup/TenantCreationStep';
import { AdminAccountStep } from './signup/AdminAccountStep';
import { CompletionStep } from './signup/CompletionStep';
import { createTenant } from '@primes/services/tenant/tenantService';
import { createUser } from '@primes/services/users/userService';
import logomarkImg from './img/Logomark.png';
import backgroundPattern from './img/Background pattern decorative.png';

export interface SignUpData {
	// 정보처리 동의
	privacyAgreement: boolean;
	privacyPolicyAgreement: boolean;
	marketingAgreement: boolean;
	
	// 테넌트 정보 (API 필드명에 맞춤)
	tenantName: string;
	companyNumber: string; // UI에서는 companyNumber로 유지 (API 전송 시 companyLicense로 변환)
	companyLogo?: string; // 회사 로고 이미지 URL
	
	// 관리자 계정 (API 필드명에 맞춤)
	username: string;
	managerName: string;
	managerEmail: string;
	managerPhone: string;
	managerPassword: string; // 실제 API에는 없지만 회원가입시 필요
	homeTel: string;
	zipcode: string;
	addressMaster: string;
	addressDetail: string;
	
	// API 기본값들
	status: string;
	plan: string;
	startDate: string;
	endDate: string;
	maxUsers: number;
	currentUsers: number;
	storageLimitMb: number;
}

const STEPS = [
	{ id: 'privacy', title: '약관 동의', description: '서비스 이용약관 및 개인정보 처리방침에 동의해주세요' },
	{ id: 'tenant', title: '회사 정보', description: '회사 정보를 입력해주세요' },
	{ id: 'admin', title: '관리자 계정', description: '관리자 계정 정보를 입력해주세요' },
	{ id: 'complete', title: '가입 완료', description: '회원가입이 완료되었습니다' },
];

const SignUp: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [createdTenantId, setCreatedTenantId] = useState<string>('');
	const [signUpData, setSignUpData] = useState<SignUpData>({
		privacyAgreement: false,
		privacyPolicyAgreement: false,
		marketingAgreement: false,
		tenantName: '',
		companyNumber: '',
		companyLogo: '',
		username: '',
		managerName: '',
		managerEmail: '',
		managerPhone: '',
		managerPassword: '',
		homeTel: '',
		zipcode: '',
		addressMaster: '',
		addressDetail: '',
		status: 'active',
		plan: 'basic',
		startDate: new Date().toISOString().split('T')[0], // 오늘 날짜
		endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1년 후
		maxUsers: 10,
		currentUsers: 0,
		storageLimitMb: 1024,
	});
	const [isLoading, setIsLoading] = useState(false);
	
	const navigate = useNavigate();
	const { t } = useTranslation('common');

	// 스크롤 강제 활성화
	useEffect(() => {
		document.body.style.overflow = 'auto';
		document.documentElement.style.overflow = 'auto';
		return () => {
			document.body.style.overflow = '';
			document.documentElement.style.overflow = '';
		};
	}, []);

	const updateSignUpData = (data: Partial<SignUpData>) => {
		setSignUpData(prev => ({ ...prev, ...data }));
	};

	const handleNext = async () => {
		if (currentStep === STEPS.length - 2) {
			// 마지막 단계에서 실제 회원가입 처리
			setIsLoading(true);
			try {
				// 1단계: 테넌트 생성 API 호출
				const tenantData = {
					tenantName: signUpData.tenantName,
					tenantImage: signUpData.companyLogo, // 회사 로고를 tenantImage로 전송
					companyLicense: signUpData.companyNumber, // companyNumber -> companyLicense
					managerName: signUpData.managerName,
					managerEmail: signUpData.managerEmail,
					managerPhone: signUpData.managerPhone,
					status: signUpData.status,
					plan: signUpData.plan,
					startDate: signUpData.startDate,
					endDate: signUpData.endDate,
					maxUsers: signUpData.maxUsers,
					currentUsers: signUpData.currentUsers,
					storageLimitMb: signUpData.storageLimitMb,
				};
				
				// 테넌트 생성 시작 토스트
				toast.loading('테넌트를 생성하고 있습니다...', {
					id: 'tenant-creation',
				});

				const tenantResult = await createTenant(tenantData);

				// 테넌트 생성 성공 토스트
				toast.success('테넌트 생성 완료', {
					id: 'tenant-creation',
					description: `${signUpData.tenantName} 테넌트가 생성되었습니다.`,
					duration: 3000,
				});

				// 테넌트 ID 추출 (API 응답 구조에 따라 조정 필요)
				const tenantId = tenantResult.id || tenantResult.tenantId || tenantResult.data?.id;
				
				if (!tenantId) {
					throw new Error('테넌트 ID를 받을 수 없습니다.');
				}

				// 생성된 테넌트 ID 저장
				setCreatedTenantId(tenantId.toString());

				// 2단계: 회원가입 API 호출 (테넌트 ID 사용)
				const signUpApiData = {
					username: signUpData.username,
					password: signUpData.managerPassword,
					tenantId: tenantId,
					name: signUpData.managerName,
					email: signUpData.managerEmail,
					mobileTel: signUpData.managerPhone,
					homeTel: signUpData.homeTel,
					zipcode: signUpData.zipcode,
					addressMaster: signUpData.addressMaster,
					addressDetail: signUpData.addressDetail,
					inDate: new Date().toISOString().split('T')[0], // 오늘 날짜
					isTenantAdmin: "1" // 테넌트 관리자로 설정
				};

				// 회원가입 시작 토스트
				toast.loading('관리자 계정을 생성하고 있습니다...', {
					id: 'user-signup',
				});

				const signUpResult = await createUser(signUpApiData);

				// 회원가입 성공 토스트
				toast.success('회원가입이 완료되었습니다!', {
					id: 'user-signup',
					description: '테넌트 생성 및 관리자 계정이 성공적으로 생성되었습니다.',
					duration: 4000,
				});
				
				// 성공 시 완료 단계로 이동
				setCurrentStep(currentStep + 1);
			} catch (error) {
				console.error('가입 처리 실패:', error);
				
				// 로딩 토스트 제거
				toast.dismiss('tenant-creation');
				toast.dismiss('user-signup');
				
				// 에러 토스트 표시
				toast.error('회원가입 실패', {
					description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
					duration: 5000,
				});
			} finally {
				setIsLoading(false);
			}
		} else {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrev = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleBackToLogin = () => {
		navigate('/login');
	};

	const canProceed = () => {
		switch (currentStep) {
			case 0: // 약관 동의
				return signUpData.privacyAgreement && signUpData.privacyPolicyAgreement;
			case 1: // 테넌트 정보
				return signUpData.tenantName && signUpData.companyNumber && signUpData.companyLogo;
			case 2: // 관리자 계정
				return signUpData.username && signUpData.managerName && signUpData.managerEmail && signUpData.managerPassword && signUpData.zipcode && signUpData.addressMaster;
			case 3: // 완료
				return true;
			default:
				return false;
		}
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 0:
				return (
					<PrivacyAgreementStep
						data={signUpData}
						onUpdate={updateSignUpData}
					/>
				);
			case 1:
				return (
					<TenantCreationStep
						data={signUpData}
						onUpdate={updateSignUpData}
					/>
				);
			case 2:
				return (
					<AdminAccountStep
						data={signUpData}
						onUpdate={updateSignUpData}
					/>
				);
			case 3:
				return (
					<CompletionStep
						data={signUpData}
						tenantId={createdTenantId}
						onBackToLogin={handleBackToLogin}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div 
			className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100" 
			style={{ minHeight: '100vh', height: 'auto', overflow: 'visible' }}
		>
			<div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-12" style={{ paddingBottom: '100px' }}>
				<div
					className="bg-white rounded-xl shadow-xl p-6 sm:p-8 lg:p-10"
					style={{
						backgroundImage: `url(${backgroundPattern})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center -20px',
						backgroundRepeat: 'no-repeat',
					}}
				>
					{/* Header */}
					<div className="text-center mb-8">
						<div className="w-14 h-20 flex items-center justify-center mx-auto mb-4">
							<img
								src={logomarkImg}
								alt="logo"
								className="w-10 h-10"
							/>
						</div>
						<h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
							회원가입
						</h2>
						<p className="text-sm text-gray-500 mt-3 sm:mt-5">
							{STEPS[currentStep].description}
						</p>
					</div>

					{/* Progress Steps */}
					<div className="mb-8">
						<div className="flex items-center justify-between mb-4">
							{STEPS.map((step, index) => (
								<div key={step.id} className="flex items-center">
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
											index < currentStep
												? 'bg-green-500 text-white'
												: index === currentStep
												? 'bg-purple-600 text-white'
												: 'bg-gray-200 text-gray-500'
										}`}
									>
										{index < currentStep ? (
											<Check className="w-4 h-4" />
										) : (
											index + 1
										)}
									</div>
									{index < STEPS.length - 1 && (
										<div
											className={`h-0.5 w-16 mx-2 ${
												index < currentStep
													? 'bg-green-500'
													: 'bg-gray-200'
											}`}
										/>
									)}
								</div>
							))}
						</div>
						<div className="text-center">
							<h3 className="text-lg font-semibold text-gray-800">
								{STEPS[currentStep].title}
							</h3>
						</div>
					</div>

					{/* Step Content */}
					<div className="mb-8">
						{renderStepContent()}
					</div>

					{/* Navigation Buttons */}
					{currentStep < STEPS.length - 1 && (
						<div className="flex justify-between">
							<Button
								type="button"
								onClick={currentStep === 0 ? handleBackToLogin : handlePrev}
								className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
								style={{ 
									transition: 'background-color 0.25s ease-in-out, color 0.25s ease-in-out' 
								}}
							>
								<ArrowLeft className="w-4 h-4" />
								{currentStep === 0 ? '로그인으로' : '이전'}
							</Button>
							
							<Button
								type="button"
								onClick={handleNext}
								disabled={!canProceed() || isLoading}
								className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
									canProceed() && !isLoading
										? 'bg-purple-600 text-white hover:bg-purple-700'
										: 'bg-gray-300 text-gray-500 cursor-not-allowed'
								}`}
								style={{ 
									transition: 'background-color 0.25s ease-in-out, color 0.25s ease-in-out' 
								}}
							>
								{isLoading ? (
									'처리 중...'
								) : currentStep === STEPS.length - 2 ? (
									'가입 완료'
								) : (
									<>
										다음
										<ArrowRight className="w-4 h-4" />
									</>
								)}
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SignUp;
