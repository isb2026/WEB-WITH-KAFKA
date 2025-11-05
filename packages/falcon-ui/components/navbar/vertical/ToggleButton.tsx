import React from 'react';
import { Button, OverlayTrigger, Tooltip, TooltipProps } from 'react-bootstrap';
import { useAppContext } from '../../../providers/AppProvider';

const renderTooltip = (props: TooltipProps) => (
	<Tooltip style={{ position: 'fixed' }} id="button-tooltip" {...props}>
		Toggle Navigation
	</Tooltip>
);

export const ToggleButton: React.FC = () => {
	const {
		config: { isNavbarVerticalCollapsed, isFluid, isRTL },
		setConfig,
	} = useAppContext();

	const handleClick = (): void => {
		document
			.getElementsByTagName('html')[0]
			.classList.toggle('navbar-vertical-collapsed');
		setConfig('isNavbarVerticalCollapsed', !isNavbarVerticalCollapsed);
	};

	const placement: 'right' | 'left' | 'bottom' = isFluid
		? isRTL
			? 'bottom'
			: 'right'
		: isRTL
			? 'bottom'
			: 'left';

	return (
		<OverlayTrigger placement={placement} overlay={renderTooltip}>
			<div className="toggle-icon-wrapper">
				<Button
					variant="link"
					className="navbar-toggler-humburger-icon navbar-vertical-toggle"
					id="toggleNavigationTooltip"
					onClick={handleClick}
				>
					<span className="navbar-toggle-icon">
						<span className="toggle-line" />
					</span>
				</Button>
			</div>
		</OverlayTrigger>
	);
};
