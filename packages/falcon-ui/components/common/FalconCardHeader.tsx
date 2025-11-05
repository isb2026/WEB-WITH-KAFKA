import React, { ReactNode, ElementType } from 'react';
import { Col, Card, Row } from 'react-bootstrap';
import classNames from 'classnames';

type BreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface TitleProps {
	titleTag?: ElementType;
	className?: string;
	breakPoint?: BreakPoint;
	children: ReactNode;
}

const Title: React.FC<TitleProps> = ({
	titleTag: TitleTag = 'h5',
	className,
	breakPoint,
	children,
}) => (
	<TitleTag
		className={classNames(
			{
				'mb-0': !breakPoint,
				[`mb-${breakPoint}-0`]: !!breakPoint,
			},
			className
		)}
	>
		{children}
	</TitleTag>
);

interface FalconCardHeaderProps {
	title: ReactNode;
	light?: boolean;
	breakPoint?: BreakPoint;
	endEl?: ReactNode;
	titleTag?: ElementType;
	titleClass?: string;
	className?: string;
	children?: ReactNode;
}

export const FalconCardHeader: React.FC<FalconCardHeaderProps> = ({
	title,
	light = false,
	titleTag,
	titleClass,
	className,
	breakPoint,
	endEl,
	children,
}) => (
	<Card.Header
		className={classNames(className, { 'bg-body-tertiary': light })}
	>
		{endEl ? (
			<Row className="align-items-center g-2">
				<Col>
					<Title
						breakPoint={breakPoint}
						titleTag={titleTag}
						className={titleClass}
					>
						{title}
					</Title>
					{children}
				</Col>
				<Col
					{...{ [breakPoint ?? 'xs']: 'auto' }}
					className={`text${breakPoint ? `-${breakPoint}` : ''}-right`}
				>
					{endEl}
				</Col>
			</Row>
		) : (
			<Title
				breakPoint={breakPoint}
				titleTag={titleTag}
				className={titleClass}
			>
				{title}
			</Title>
		)}
	</Card.Header>
);
