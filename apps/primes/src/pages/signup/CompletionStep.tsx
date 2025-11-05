import React, { useState } from 'react';
import { Button } from '@repo/radix-ui/components';
import { CheckCircle, ArrowRight, Copy, Check } from 'lucide-react';
import { SignUpData } from '../SignUp';

interface CompletionStepProps {
	data: SignUpData;
	tenantId: string;
	onBackToLogin: () => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
	data,
	tenantId,
	onBackToLogin,
}) => {
	const [copied, setCopied] = useState(false);

	const handleCopyTenantId = async () => {
		try {
			await navigator.clipboard.writeText(tenantId);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy tenant ID:', err);
		}
	};
	return (
		<div className="text-center space-y-6">
			{/* 성공 아이콘 */}
			<div className="flex justify-center">
				<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
					<CheckCircle className="w-12 h-12 text-green-500" />
				</div>
			</div>

			{/* 완료 메시지 */}
			<div>
				<h3 className="text-2xl font-bold text-gray-800 mb-2">
					회원가입이 완료되었습니다!
				</h3>
				<p className="text-gray-600">
					{data.tenantName}의 테넌트가 성공적으로 생성되었습니다.
				</p>
			</div>

			{/* 회사코드 안내 */}
			<div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
				<h4 className="text-lg font-semibold text-purple-800 mb-3 text-center">
					🏢 회사코드 (중요!)
				</h4>
				<div className="bg-white rounded-lg p-4 border border-purple-200">
					<div className="flex items-center justify-between">
						<div className="text-left">
							<p className="text-sm text-gray-600 mb-1">로그인 시 사용할 회사코드</p>
							<p className="text-2xl font-bold text-purple-600 font-mono">{tenantId}</p>
						</div>
						<Button
							type="button"
							onClick={handleCopyTenantId}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
								copied 
									? 'bg-green-500 text-white' 
									: 'bg-purple-600 text-white hover:bg-purple-700'
							}`}
						>
							{copied ? (
								<>
									<Check className="w-4 h-4" />
									복사됨
								</>
							) : (
								<>
									<Copy className="w-4 h-4" />
									복사
								</>
							)}
						</Button>
					</div>
				</div>
				<div className="mt-3 text-sm text-purple-700 text-center">
					<p className="font-medium">⚠️ 이 코드를 반드시 기록해두세요!</p>
					<p>로그인 시 회사코드 입력란에 이 번호를 입력해야 합니다.</p>
				</div>
			</div>

			{/* 생성된 정보 요약 */}
			<div className="bg-gray-50 rounded-lg p-6 text-left">
				<h4 className="text-lg font-semibold text-gray-800 mb-4">
					생성된 정보
				</h4>
				<div className="space-y-3">
					<div className="flex justify-between">
						<span className="text-gray-600">회사명:</span>
						<span className="font-medium text-gray-800">{data.tenantName}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">사업자등록번호:</span>
						<span className="font-medium text-gray-800">{data.companyNumber}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">관리자 이메일:</span>
						<span className="font-medium text-gray-800">{data.managerEmail}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">관리자 이름:</span>
						<span className="font-medium text-gray-800">{data.managerName}</span>
					</div>
				</div>
			</div>

			{/* 다음 단계 안내 */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<h4 className="text-sm font-medium text-blue-800 mb-2">
					다음 단계
				</h4>
				<div className="text-sm text-blue-700 space-y-1">
					<p>1. 위의 <strong>회사코드({tenantId})</strong>를 기록하세요</p>
					<p>2. 로그인 페이지에서 회사코드를 입력하세요</p>
					<p>3. 관리자 계정으로 로그인하세요</p>
					<p>4. 회사 설정을 완료하고 직원들을 초대하세요</p>
				</div>
			</div>

			{/* 이메일 인증 안내 */}
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg
							className="h-5 w-5 text-yellow-400"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M3 4a1 1 0 011-1h12a1 1 0 011 1v1.586l-4.293 4.293a1 1 0 01-1.414 0L7 6.586V4zm0 2.414V16a1 1 0 001 1h12a1 1 0 001-1V6.414l-4.293 4.293A3 3 0 018.707 10.707L4 6.414z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<div className="ml-3 text-left">
						<h3 className="text-sm font-medium text-yellow-800">
							이메일 인증 필요
						</h3>
						<div className="mt-1 text-sm text-yellow-700">
							<p>
								{data.managerEmail}로 인증 이메일이 발송되었습니다.
								이메일 인증을 완료한 후 로그인해주세요.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 로그인 버튼 */}
			<div className="pt-4">
				<Button
					onClick={onBackToLogin}
					className="w-full h-12 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 flex items-center justify-center text-lg gap-2 transition-colors"
				>
					로그인 페이지로 이동
					<ArrowRight className="w-5 h-5" />
				</Button>
			</div>

			{/* 고객지원 안내 */}
			<div className="text-sm text-gray-500">
				<p>
					문의사항이 있으시면{' '}
					<a
						href="mailto:support@company.com"
						className="text-purple-600 hover:text-purple-700 underline"
					>
						support@company.com
					</a>
					으로 연락주세요.
				</p>
			</div>
		</div>
	);
};
