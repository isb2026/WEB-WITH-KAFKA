import React, { useState } from 'react';
import {
	Button,
	RadixTextInput,
	RadixCheckboxRoot,
	RadixCheckboxIndicator,
} from '@repo/radix-ui/components';
import { Eye, EyeOff, Lock, User, Mail } from 'lucide-react';

const Login1: React.FC = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		// This is just for presentation - no actual login logic
		console.log('Login button clicked');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Login Form Card */}
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
							<Lock className="h-8 w-8 text-white" />
						</div>
						<h2 className="text-3xl font-bold text-gray-900 mb-2">
							Welcome back
						</h2>
						<p className="text-gray-600">
							Sign in to your account to continue
						</p>
					</div>

					{/* Login Form */}
					<form className="space-y-6 h-full" onSubmit={handleLogin}>
						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-semibold text-gray-700 mb-2"
							>
								Email address
							</label>
							<RadixTextInput
								id="email"
								type="email"
								placeholder="Enter your email"
								className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/90 hover:border-gray-300"
								required
							/>
						</div>

						{/* Password Field */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-semibold text-gray-700 mb-2"
							>
								Password
							</label>
							<RadixTextInput
								id="password"
								type={showPassword ? 'text' : 'password'}
								placeholder="Enter your password"
								className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/90 hover:border-gray-300"
								required
							/>
						</div>

						{/* Remember Me & Forgot Password */}
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<RadixCheckboxRoot
									id="remember-me"
									checked={rememberMe}
									onCheckedChange={(checked) =>
										setRememberMe(checked as boolean)
									}
									className="h-5 w-5 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-blue-400 flex items-center justify-center"
								>
									<RadixCheckboxIndicator className="flex items-center justify-center">
										✓
									</RadixCheckboxIndicator>
								</RadixCheckboxRoot>
								<label
									htmlFor="remember-me"
									className="text-sm text-gray-700 font-medium"
								>
									Remember me
								</label>
							</div>

							<div className="text-sm">
								<a
									href="#"
									className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
								>
									Forgot password?
								</a>
							</div>
						</div>

						{/* Login Button */}
						<div className="flex justify-center">
							<Button
								type="submit"
								className="!w-64 !h-12 !bg-purple-700 !text-white !font-bold !rounded-xl !shadow-lg !focus:outline-none !focus:ring-4 !focus:ring-purple-300 !flex !items-center !justify-center !text-lg"
							>
								Sign in
							</Button>
						</div>

						{/* Divider */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Or continue with
								</span>
							</div>
						</div>

						{/* Social Login Buttons */}
						<div className="grid grid-cols-2 gap-3">
							<Button
								type="button"
								className="h-12 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
							>
								<svg
									className="w-5 h-5 mr-2"
									viewBox="0 0 24 24"
								>
									<path
										fill="#4285F4"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="#34A853"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="#FBBC05"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="#EA4335"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								Google
							</Button>
							<Button
								type="button"
								className="h-12 bg-black text-white rounded-xl font-medium"
							>
								<svg
									className="w-5 h-5 mr-2"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
								</svg>
								Twitter
							</Button>
						</div>

						{/* Sign Up Link */}
						<div className="text-center">
							<p className="text-sm text-gray-600">
								Don't have an account?{' '}
								<a
									href="#"
									className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
								>
									Sign up
								</a>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login1;
