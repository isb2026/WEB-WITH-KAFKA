import React, { ReactNode, HTMLAttributes } from 'react';
import classNames from 'classnames';
import Background from './Background';
import { Container } from 'react-bootstrap';

type PositionType =
	| string
	| {
			x: string;
			y: string;
	  };

interface SectionProps extends HTMLAttributes<HTMLElement> {
	fluid?: boolean;
	bg?: string;
	image?: string;
	overlay?: boolean | string;
	position?: PositionType;
	video?: any[]; // 명확한 타입이 있다면 수정 가능
	bgClassName?: string;
	className?: string;
	children?: ReactNode;
}

const Section: React.FC<SectionProps> = ({
	fluid = false,
	bg,
	image,
	overlay,
	position,
	video,
	bgClassName,
	className,
	children,
	...rest
}) => {
	const bgProps: any = { image, overlay, position, video };
	if (bgClassName) {
		bgProps.className = bgClassName;
	}

	return (
		<section
			className={classNames({ [`bg-${bg}`]: bg }, className)}
			{...rest}
		>
			{image && <Background {...bgProps} />}
			<Container fluid={fluid}>{children}</Container>
		</section>
	);
};

export default Section;
