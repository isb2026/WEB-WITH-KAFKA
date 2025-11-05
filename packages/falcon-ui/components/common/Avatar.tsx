// src/components/common/Avatar.tsx
import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { isIterableArray } from '@repo/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Flex } from './Flex';

export type AvatarSize = 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

export interface AvatarProps {
	/** One of the predefined sizes */
	size?: AvatarSize;
	/** Border radius style (e.g. 'circle', 'lg', etc.) */
	rounded?: string;
	/** Image URL or array of URLs for composite avatar */
	src?: string;
	/** User name (used to generate initials) */
	name?: string;
	/** Fallback emoji */
	emoji?: string;
	/** Additional class for the wrapper */
	className?: string;
	/** Additional class for the media element */
	mediaClass?: string;
	/** If true, use full name instead of initials */
	isExact?: boolean;
	/** FontAwesome icon to show instead of image/text */
	icon?: IconProp;
}

export const Avatar: FC<AvatarProps> = ({
	size = 'xl',
	rounded = 'circle',
	src = '',
	name,
	emoji = '😊',
	className,
	mediaClass,
	isExact = false,
	icon,
}) => {
	const wrapperClasses = classNames('avatar', `avatar-${size}`, className);
	const mediaClasses = classNames(
		rounded ? `rounded-${rounded}` : 'rounded',
		mediaClass
	);

	const renderAvatar = (): ReactNode => {
		if (src) {
			if (isIterableArray(src)) {
				return (
					<div
						className={classNames(
							mediaClasses,
							'overflow-hidden',
							'h-100',
							'd-flex'
						)}
					>
						<div className="w-50 border-right">
							<img src={src[0]} alt="" />
						</div>
						<div className="w-50 d-flex flex-column">
							<img
								src={src[1]}
								alt=""
								className="h-50 border-bottom"
							/>
							<img src={src[2]} alt="" className="h-50" />
						</div>
					</div>
				);
			}
			return <img className={mediaClasses} src={src} alt="" />;
		}

		if (name) {
			const initials = isExact
				? name
				: (name.match(/\b\w/g) || []).join('');
			return (
				<div className={classNames('avatar-name', mediaClasses)}>
					<span>{initials}</span>
				</div>
			);
		}

		if (icon) {
			return (
				<Flex className={classNames('avatar-name', mediaClasses)}>
					<FontAwesomeIcon icon={icon} />
				</Flex>
			);
		}

		return (
			<div className={classNames('avatar-emoji', mediaClasses)}>
				<span role="img" aria-label="Emoji">
					{emoji}
				</span>
			</div>
		);
	};

	return <div className={wrapperClasses}>{renderAvatar()}</div>;
};

export interface AvatarGroupProps {
	children: ReactNode;
	/** Additional class for the group */
	className?: string;
	/** Denser styling when true */
	dense?: boolean;
}

export const AvatarGroup: FC<AvatarGroupProps> = ({
	children,
	className,
	dense = false,
}) => {
	return (
		<div
			className={classNames(className, 'avatar-group', {
				'avatar-group-dense': dense,
			})}
		>
			{children}
		</div>
	);
};

export default Avatar;
