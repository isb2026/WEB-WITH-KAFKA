import React, { CSSProperties } from 'react';
import classNames from 'classnames';

type PositionType =
	| string
	| {
			x?: string;
			y?: string;
	  };

interface BackgroundProps {
	image: string;
	overlay?: boolean | string;
	position?: PositionType;
	video?: string[];
	className?: string;
	style?: CSSProperties;
}

const Background: React.FC<BackgroundProps> = ({
	image,
	overlay,
	position,
	video,
	className,
	style,
}) => {
	const bgStyle: CSSProperties = {
		backgroundImage: `url(${image})`,
		...style,
	};

	if (typeof position === 'string') {
		bgStyle.backgroundPosition = position;
	} else if (typeof position === 'object') {
		if (position.x) bgStyle.backgroundPositionX = position.x;
		if (position.y) bgStyle.backgroundPositionY = position.y;
	}

	return (
		<div
			className={classNames(
				'bg-holder',
				{
					overlay: overlay === true,
					[`overlay-${overlay}`]: typeof overlay === 'string',
				},
				className
			)}
			style={bgStyle}
		>
			{video && (
				<video className="bg-video" autoPlay loop muted playsInline>
					{video.map((src, index) => (
						<source
							key={index}
							src={src}
							type={`video/${src.split('.').pop()}`}
						/>
					))}
				</video>
			)}
		</div>
	);
};

export default Background;
