import React from 'react';
import { useAuth } from '@esg/hooks/auth/useAuth';

export const LogoutButton: React.FC = () => {
    const { logout, isLoggingOut } = useAuth();

    return (
        <button
            className="btn btn-outline-secondary btn-sm"
            onClick={logout}
            disabled={isLoggingOut}
        >
            {isLoggingOut ? (
                <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    로그아웃 중...
                </>
            ) : (
                '로그아웃'
            )}
        </button>
    );
};

export default LogoutButton;