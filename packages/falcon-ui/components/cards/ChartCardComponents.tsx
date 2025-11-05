import React from 'react';
import { EchartComponent, EchartComponentProps } from '@repo/echart/components';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { SubtleBadge, Flex, SubtleBadgeProps } from '../common';
import classNames from 'classnames';

export interface ChartCardProps {
	title?: string;
	tooltip?: string;
	valueTxt: string;
	badge?: {
		bg?: SubtleBadgeProps['bg'];
		pill?: SubtleBadgeProps['pill'];
		badgeTxt?: string;
	};
	chartOptions: EchartComponentProps['options'];
	chartStyles?: EchartComponentProps['styles'];
	chartData?: any[];
}

export const ChartCardComponent: React.FC<ChartCardProps> = ({
	title,
	tooltip,
	valueTxt,
	badge,
	chartOptions,
	chartStyles,
}) => {
	return (
		<Card className="h-md-100">
			{title && (
				<Card.Header>
					<OverlayTrigger
						placement="top"
						overlay={<Tooltip id="tooltip-top">{tooltip}</Tooltip>}
					>
						<Card.Title className="mb-0">{title}</Card.Title>
					</OverlayTrigger>
				</Card.Header>
			)}
			<Card.Body as={Flex} alignItems="end" justifyContent="between">
				<div>
					<h3 className={classNames('mb-1 text-700 fw-normal lh-1')}>
						{valueTxt}
					</h3>
					{badge && (
						<SubtleBadge
							bg={badge.bg}
							pill={badge.pill}
							className="ms-2"
						>
							{badge.badgeTxt}
						</SubtleBadge>
					)}
				</div>
				<EchartComponent
					options={chartOptions}
					styles={{ width: '8.5rem', height: 60 }}
				/>
			</Card.Body>
		</Card>
	);
};
