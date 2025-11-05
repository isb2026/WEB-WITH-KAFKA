import React from 'react';
import classNames from 'classnames';
export type statusType =
	| 'success'
	| 'warning'
	| 'danger'
	| 'info'
	| 'primary'
	| 'secondary';

export interface SubtleBadgeProps {
	bg?: statusType;
	pill?: boolean;
	children: React.ReactNode;
	className?: string;
}

export const SubtleBadge: React.FC<SubtleBadgeProps> = ({
	bg = 'primary',
	pill,
	children,
	className,
}) => {
	return (
		<div
			className={classNames(className, `badge badge-subtle-${bg?bg:'primary'}`, {
				'rounded-pill': pill,
			})}
		>
			{children}
		</div>
	);
};
