import { useMutation } from '@tanstack/react-query';
import { login, logout } from '@primes/services/users/authService';
import { LoginPayload } from '@primes/types/auth';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '@primes/utils/auth';
import { clearTenantInfo } from '@primes/utils/tokenUtils';

export const useAuth = () => {
	const navigate = useNavigate();

	const loginMutation = useMutation({
		mutationFn: (payload: LoginPayload) => login(payload),
		onSuccess: () => {
			navigate('/');
		},
		onError: (error) => {
			console.error('로그인 실패:', error);
			alert('로그인에 실패했습니다.');
		},
	});

	const handleLogout = async () => {
		clearTokens();
		clearTenantInfo();
		
		try {
			await logout();
		} catch (error) {
			console.error('Logout error:', error);
		}
		
		navigate('/login');
	};

	return {
		login: loginMutation.mutate,
		isLoading: loginMutation.isPending,
		logout: handleLogout,
		isLoggedIn: true, // HttpOnly 쿠키에서는 항상 true로 가정 (실제 인증은 서버에서 처리)
	};
};
