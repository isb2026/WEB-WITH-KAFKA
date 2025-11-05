import React, { useState } from 'react';
import { RadixCheckboxRoot, RadixCheckboxIndicator } from '@repo/radix-ui/components';
import { SignUpData } from '../SignUp';

interface PrivacyAgreementStepProps {
	data: SignUpData;
	onUpdate: (data: Partial<SignUpData>) => void;
}

export const PrivacyAgreementStep: React.FC<PrivacyAgreementStepProps> = ({
	data,
	onUpdate,
}) => {
	// 전체 동의 처리
	const handleAllAgreement = (checked: boolean) => {
		onUpdate({ 
			privacyAgreement: checked,
			privacyPolicyAgreement: checked,
			marketingAgreement: checked 
		});
	};

	// 개별 약관 동의 처리
	const handlePrivacyAgreement = (checked: boolean) => {
		onUpdate({ privacyAgreement: checked });
	};

	const handlePrivacyPolicyAgreement = (checked: boolean) => {
		onUpdate({ privacyPolicyAgreement: checked });
	};

	const handleMarketingAgreement = (checked: boolean) => {
		onUpdate({ marketingAgreement: checked });
	};

	// 모든 필수 약관에 동의했는지 확인
	const allRequiredAgreed = data.privacyAgreement && data.privacyPolicyAgreement;
	const allAgreed = allRequiredAgreed && data.marketingAgreement;

	return (
		<div className="space-y-6">
			{/* 전체 동의 */}
			<div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
				<div className="flex items-center gap-3">
					<RadixCheckboxRoot
						id="all-agreement"
						checked={allAgreed}
						onCheckedChange={handleAllAgreement}
						className="peer h-6 w-6 shrink-0 rounded-md border-2 border-purple-400 bg-white focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm flex items-center justify-center"
						style={
							{
								'--tw-ring-color': '#6A53B1',
								'--tw-border-opacity': '1',
							} as React.CSSProperties
						}
					>
						<RadixCheckboxIndicator>
							<svg
								className="w-5 h-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={3}
								strokeLinecap="round"
								strokeLinejoin="round"
								style={{ color: '#6A53B1' }}
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						</RadixCheckboxIndicator>
					</RadixCheckboxRoot>
					<label
						htmlFor="all-agreement"
						className="text-lg font-semibold text-purple-800 cursor-pointer"
					>
						전체 약관에 동의합니다
					</label>
				</div>
			</div>

			{/* 서비스 이용약관 */}
			<div className="border rounded-lg p-4">
				<h4 className="text-lg font-semibold text-gray-800 mb-3">
					서비스 이용약관 (필수)
				</h4>
				<div className="bg-gray-50 rounded p-4 h-48 overflow-y-scroll border text-sm text-gray-600 mb-4" style={{ scrollbarWidth: 'thin' }}>
					<p className="mb-3 font-semibold text-gray-800">제1조 (목적)</p>
					<p className="mb-3">
						이 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 이용자간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
					</p>
					
					<p className="mb-3 font-semibold text-gray-800">제2조 (정의)</p>
					<p className="mb-2">
						1. "서비스"라 함은 회사가 제공하는 모든 서비스를 의미합니다.
					</p>
					<p className="mb-2">
						2. "이용자"라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
					</p>
					<p className="mb-2">
						3. "회원"이라 함은 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
					</p>
					<p className="mb-2">
						4. "비회원"이라 함은 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.
					</p>
					
					<p className="mb-3 mt-4 font-semibold text-gray-800">제3조 (약관의 효력 및 변경)</p>
					<p className="mb-2">
						1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.
					</p>
					<p className="mb-2">
						2. 회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력을 발생합니다.
					</p>
					<p className="mb-2">
						3. 이용자가 변경된 약관에 동의하지 않는 경우, 이용자는 서비스 이용을 중단하고 탈퇴할 수 있습니다.
					</p>
					
					<p className="mb-3 mt-4 font-semibold text-gray-800">제4조 (서비스의 제공 및 변경)</p>
					<p className="mb-2">
						1. 회사는 다음과 같은 업무를 수행합니다.
					</p>
					<p className="mb-2 ml-4">
						- 서비스 제공 및 관련 업무
					</p>
					<p className="mb-2 ml-4">
						- 기타 회사가 정하는 업무
					</p>
					<p className="mb-2">
						2. 회사는 운영상, 기술상의 필요에 따라 제공하고 있는 전부 또는 일부 서비스를 변경할 수 있습니다.
					</p>
					
					<p className="mb-3 mt-4 font-semibold text-gray-800">제5조 (서비스의 중단)</p>
					<p className="mb-2">
						1. 회사는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
					</p>
					<p className="mb-2">
						2. 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상하지 않습니다.
					</p>
					
					<p className="mb-3 mt-4 font-semibold text-gray-800">제6조 (회원가입)</p>
					<p className="mb-2">
						1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
					</p>
					<p className="mb-2">
						2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각호에 해당하지 않는 한 회원으로 등록합니다.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<RadixCheckboxRoot
						id="privacy-agreement"
						checked={data.privacyAgreement}
						onCheckedChange={handlePrivacyAgreement}
						className="peer h-5 w-5 shrink-0 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm flex items-center justify-center"
						style={
							{
								'--tw-ring-color': '#6A53B1',
								'--tw-border-opacity': '1',
							} as React.CSSProperties
						}
					>
						<RadixCheckboxIndicator>
							<svg
								className="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={3}
								strokeLinecap="round"
								strokeLinejoin="round"
								style={{ color: '#6A53B1' }}
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						</RadixCheckboxIndicator>
					</RadixCheckboxRoot>
					<label
						htmlFor="privacy-agreement"
						className="text-sm font-medium text-gray-700 cursor-pointer"
					>
						서비스 이용약관에 동의합니다 (필수)
					</label>
				</div>
			</div>

			{/* 개인정보 처리방침 */}
			<div className="border rounded-lg p-4">
				<h4 className="text-lg font-semibold text-gray-800 mb-3">
					개인정보 처리방침 (필수)
				</h4>
				<div className="bg-gray-50 rounded p-4 h-48 overflow-y-scroll border text-sm text-gray-600 mb-4" style={{ scrollbarWidth: 'thin' }}>
					<p className="mb-3 font-semibold text-gray-800">1. 개인정보의 처리 목적</p>
					<p className="mb-3">
						회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
					</p>
					<p className="mb-2 ml-4">
						- 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증
					</p>
					<p className="mb-2 ml-4">
						- 서비스 제공 및 계약의 이행, 요금정산
					</p>
					<p className="mb-2 ml-4">
						- 고객 서비스 이용에 관한 통지·CS업무
					</p>
					<p className="mb-2 ml-4">
						- 부정이용 방지 및 비인가 사용 방지
					</p>
					
					<p className="mb-3 mt-4 font-semibold text-gray-800">2. 개인정보의 처리 및 보유기간</p>
					<p className="mb-3">
						회사는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보 보유·이용기간 또는 법령에 따른 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
					</p>
					<p className="mb-2 ml-4">
						- 회원 탈퇴 시까지 (단, 관계법령에 보존근거가 있는 경우 해당 기간 보존)
					</p>
					<p className="mb-2 ml-4">
						- 계약 또는 청약철회 등에 관한 기록: 5년
					</p>
					<p className="mb-2 ml-4">
						- 대금결제 및 재화 등의 공급에 관한 기록: 5년
					</p>
					<p className="mb-2 ml-4">
						- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
					</p>
					
					<p className="mb-3 mt-4 font-semibold text-gray-800">3. 개인정보의 제3자 제공</p>
					<p className="mb-3">
						회사는 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한 범위 내에서 처리하며, 정보주체의 사전 동의 없이는 본래의 목적 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.
					</p>
					
					<p className="mb-3 mt-4 font-semibold text-gray-800">4. 개인정보처리의 위탁</p>
					<p className="mb-3">
						회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
					</p>
					<p className="mb-2 ml-4">
						- 위탁받는 자: 클라우드 서비스 제공업체
					</p>
					<p className="mb-2 ml-4">
						- 위탁하는 업무의 내용: 시스템 운영 및 관리
					</p>
					
					<p className="mb-3 mt-4 font-semibold text-gray-800">5. 정보주체의 권리·의무 및 행사방법</p>
					<p className="mb-3">
						정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
					</p>
					<p className="mb-2 ml-4">
						- 개인정보 처리정지 요구
					</p>
					<p className="mb-2 ml-4">
						- 개인정보 열람요구
					</p>
					<p className="mb-2 ml-4">
						- 개인정보 정정·삭제요구
					</p>
					<p className="mb-2 ml-4">
						- 개인정보 처리정지 요구
					</p>
				</div>
				<div className="flex items-center gap-3">
					<RadixCheckboxRoot
						id="privacy-policy"
						checked={data.privacyPolicyAgreement}
						onCheckedChange={handlePrivacyPolicyAgreement}
						className="peer h-5 w-5 shrink-0 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm flex items-center justify-center"
						style={
							{
								'--tw-ring-color': '#6A53B1',
								'--tw-border-opacity': '1',
							} as React.CSSProperties
						}
					>
						<RadixCheckboxIndicator>
							<svg
								className="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={3}
								strokeLinecap="round"
								strokeLinejoin="round"
								style={{ color: '#6A53B1' }}
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						</RadixCheckboxIndicator>
					</RadixCheckboxRoot>
					<label
						htmlFor="privacy-policy"
						className="text-sm font-medium text-gray-700 cursor-pointer"
					>
						개인정보 처리방침에 동의합니다 (필수)
					</label>
				</div>
			</div>

			{/* 마케팅 정보 수신 동의 */}
			<div className="border rounded-lg p-4">
				<h4 className="text-lg font-semibold text-gray-800 mb-3">
					마케팅 정보 수신 동의 (선택)
				</h4>
				<div className="bg-gray-50 rounded p-4 text-sm text-gray-600 mb-4">
					<p className="mb-2">
						서비스와 관련된 신규 서비스 안내, 이벤트 정보, 혜택 안내 등의 마케팅 정보를 이메일, SMS 등으로 받아보실 수 있습니다.
					</p>
					<p className="text-xs text-gray-500">
						※ 마케팅 정보 수신에 동의하지 않아도 서비스 이용에는 제한이 없습니다.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<RadixCheckboxRoot
						id="marketing-agreement"
						checked={data.marketingAgreement}
						onCheckedChange={handleMarketingAgreement}
						className="peer h-5 w-5 shrink-0 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm flex items-center justify-center"
						style={
							{
								'--tw-ring-color': '#6A53B1',
								'--tw-border-opacity': '1',
							} as React.CSSProperties
						}
					>
						<RadixCheckboxIndicator>
							<svg
								className="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={3}
								strokeLinecap="round"
								strokeLinejoin="round"
								style={{ color: '#6A53B1' }}
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						</RadixCheckboxIndicator>
					</RadixCheckboxRoot>
					<label
						htmlFor="marketing-agreement"
						className="text-sm font-medium text-gray-700 cursor-pointer"
					>
						마케팅 정보 수신에 동의합니다 (선택)
					</label>
				</div>
			</div>
		</div>
	);
};
