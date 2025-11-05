import React from 'react';

interface ValidationMessageProps {
	message?: string;
	className?: string;
	height?: string; // 높이 커스터마이징 가능
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
	message,
	className = '',
	height, // placeholder 방식에서는 사용하지 않음
}) => {
	if (!message) return null;

	return (
		<div
			className={`absolute inset-0 flex items-center pointer-events-none ${className}`}
		>
			<span className="text-red-400 text-sm italic px-3 animate-fadeIn bg-white/80 rounded">
				{message}
			</span>
		</div>
	);
};
