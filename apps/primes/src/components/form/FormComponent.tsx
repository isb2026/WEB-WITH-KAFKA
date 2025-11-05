import React from 'react';

interface FormComponentProps {
	title?: string;
	actionButtons?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}

export const FormComponent: React.FC<FormComponentProps> = ({
	title,
	actionButtons,
	children,
	className = '',
}) => {
	return (
		<div
			className={`flex flex-col h-full rounded-md overflow-visible ${className}`}
		>
			{/* Header with title and action buttons */}

			<div className="flex justify-between items-center w-full px-4 py-3 border-b bg-white sticky top-0 z-10">
				{title && (
					<h2 className="text-base font-bold truncate">{title}</h2>
				)}
				{actionButtons && (
					<div className="flex gap-2">{actionButtons}</div>
				)}
			</div>

			{/* Form content */}
			<div className="flex-1 px-4 py-4 overflow-auto h-full">
				{children}
			</div>
		</div>
	);
};

export default FormComponent;
