import React, { useState } from 'react';
import {
	Button,
	RadixTextInput,
	RadixCheckboxRoot,
	RadixCheckboxIndicator,
} from '@repo/radix-ui/components';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@primes/hooks/users/useAuthQuery';
import { useTranslation } from '@repo/i18n';
import { useNavigate } from 'react-router-dom';
import logomarkImg from './img/Logomark.png';
import backgroundPattern from './img/Background pattern decorative.png';

const Login: React.FC = () => {
	const [password, setPassword] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [tenantId, setTenantId] = useState<string>('');
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const { login } = useAuth();
	const { t } = useTranslation('common');
	const navigate = useNavigate();

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		// This is just for presentation - no actual login logic
		login({ username: username, password: password, tenantId: tenantId });
	};

	return (
		<div className="min-h-screen from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4 py-6 sm:py-12">
			<div className="w-full max-w-md mx-4 sm:mx-0">
				<div
					className="p-6 sm:p-8 lg:p-10"
					style={{
						backgroundImage: `url(${backgroundPattern})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center -20px',
						backgroundRepeat: 'no-repeat',
					}}
				>
					{/* Header */}
					<div className="text-center mb-6 sm:mb-8">
						<div className="w-14 h-20   flex items-center justify-center mx-auto mb-4 ">
							<img
								src={logomarkImg}
								alt="logo"
								className="w-10 h-10"
							/>
						</div>
						<h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
							{t('login.title')}
						</h2>
						<p className="text-sm text-gray-500 mt-3 sm:mt-5">
							{t('login.welcomeMessage')}
						</p>
					</div>

					{/* Login Form */}
					<form
						className="space-y-4 sm:space-y-6 h-full"
						onSubmit={handleLogin}
					>
						{/* Company Code Field */}
						<div>
							<label
								htmlFor="tenantId"
								className="block text-sm font-medium text-gray-700 mb-1 mb-2"
							>
								회사코드
							</label>
							<div className="relative">
								<RadixTextInput
									id="tenantId"
									type="text"
									value={tenantId}
									placeholder="회사코드를 입력하세요"
									className="w-full h-12 px-4 border border-gray-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all bg-white text-sm shadow-sm placeholder-gray-400"
									style={{
										height: '48px',
										borderRadius: '12px',
									}}
									required
									onChange={(e) => {
										setTenantId(e.target.value);
									}}
								/>
							</div>
						</div>

						{/* Username/Email Field */}
						{/* Email Field */}
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-700 mb-1 mb-2"
							>
								{t('login.email')}
							</label>
							<div className="relative">
								<RadixTextInput
									id="id"
									type="text"
									value={username}
									placeholder={t('login.emailPlaceholder')}
									autoComplete="username"
									className="w-full h-12 px-4 border border-gray-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all bg-white text-sm shadow-sm placeholder-gray-400"
									style={{
										height: '48px',
										borderRadius: '12px',
									}}
									required
									onChange={(e) => {
										setUsername(e.target.value);
									}}
								/>
							</div>
						</div>

						{/* Password Field */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-1 mb-2"
							>
								{t('login.password')}
							</label>
							<div className="relative">
								<RadixTextInput
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder={t('login.passwordPlaceholder')}
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
									}}
									autoComplete="current-password"
									endSlot={
										<button
											type="button"
											onClick={() =>
												setShowPassword(!showPassword)
											}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition"
										>
											{showPassword ? (
												<EyeOff className="h-5 w-5 text-gray-400" />
											) : (
												<Eye className="h-5 w-5 text-gray-400" />
											)}
										</button>
									}
									className="w-full h-12 px-4 pr-10 border border-gray-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all bg-white text-sm shadow-sm placeholder-gray-400"
									style={{
										height: '48px',
										borderRadius: '12px',
									}}
									required
								/>
							</div>
						</div>

						{/* Remember Me & Forgot Password */}
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
							<div className="flex items-center gap-3 select-none">
								<RadixCheckboxRoot
									id="remember-me"
									checked={rememberMe}
									onCheckedChange={(checked) =>
										setRememberMe(checked as boolean)
									}
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
									htmlFor="remember-me"
									className="text-sm font-medium text-gray-700 cursor-pointer peer-focus:text-[#6A53B1]"
								>
									{t('login.rememberMe')}
								</label>
							</div>

							<a
								href="#"
								className="text-sm font-medium transition-colors"
								style={{ color: '#6A53B1' }}
							>
								{t('login.forgotPassword')}
							</a>
						</div>

						{/* Login Button */}
						<div className="flex justify-center">
							<Button
								type="submit"
								className="!w-full !h-12 !text-white !font-bold !rounded-xl !shadow-lg !focus:outline-none !focus:ring-4 !focus:ring-purple-300 !flex !items-center !justify-center !text-base sm:!text-lg"
								style={{ backgroundColor: '#6A53B1' }}
							>
								{t('login.signIn')}
							</Button>
						</div>


						{/* Sign Up Link */}
						<div className="text-center pt-2">
							<span className="text-sm text-gray-600">
								{t('login.noAccount')}{' '}
								<button
									type="button"
									onClick={() => navigate('/signup')}
									className="font-medium underline transition-colors hover:opacity-80"
									style={{ color: '#6A53B1' }}
								>
									{t('login.signUp')}
								</button>
							</span>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
