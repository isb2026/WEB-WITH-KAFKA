import styled from 'styled-components';
import Split, { SplitProps } from 'react-split';
import {
	Form,
	Modal as BootstrapModal,
	Button as BootstrapButton,
} from 'react-bootstrap';

interface StyledSplitProps extends SplitProps {
	width?: string;
	height?: string;
	containerWidth?: number;
	containerHeight?: number;
	split: 'vertical' | 'horizontal';
	overflow: string;
}

interface SideModalContainerProps {
	open: boolean;
}

interface StyledContainerProps {
	width?: string;
}

export const StyledSplit = styled(Split)<StyledSplitProps>`
	display: flex;
	width: ${({ width }) => width ?? '100%'};
	height: ${({ height }) => height ?? '100%'};
	flex-direction: ${({ split }) => (split === 'vertical' ? 'column' : 'row')};
	overflow: ${({ overflow }) => (overflow ? overflow : 'auto')};

	/* gutter(분할선) 스타일 정의 */
	.gutter {
		background-color: #ddd;
		background-clip: padding-box;
		position: relative;
		transition: background-color 0.2s ease;

		&::after {
			content: '';
			position: absolute;
			z-index: 16;
			background-color: #ffff;
			border-radius: 4px;
			border: 1px solid #ddd;
			transition: background-color 0.2s ease;
		}

		&:hover {
			background-color: #65a7ff;
			&::after {
				background-color: #65a7ff;
				border: 2px solid #65a7ff;
			}
		}
	}

	.gutter-horizontal {
		width: 4px;
		height: 100%;
		cursor: col-resize;

		&::after {
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 12px;
			height: 32px;
		}
	}

	.gutter-vertical {
		height: 4px;
		width: calc(100% - 20px);
		cursor: row-resize;

		&::after {
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 32px;
			height: 12px;
		}
	}
`;

export const StyledSpacer = styled.div`
	flex-grow: 1; // 남은 공간을 모두 차지
	width: 100%;
`;

export const StyledContainer = styled.div<StyledContainerProps>`
	display: flex;
	flex-direction: column;
	width: ${({ width }) => width || '100%'};
	height: 100%;
`;

export const StyledCustomSwitch = styled(Form.Check)`
	.form-check-input {
		height: 20px; /* 높이를 키움 */
		width: 40px; /* 너비를 키움 */
	}
	.form-check-label {
		font-size: 1.2rem; /* 텍스트 크기 조정 */
	}
`;

export const StyledCardContainer = styled.div`
	border-bottom: 1px solid #1976d2;
	padding-bottom: 10px;
	margin-bottom: 20px;
`;

export const StyledGroupContainer = styled.div`
	margin-bottom: 1rem;
	&:not(:first-child) {
		border-top: 1px solid #1976d2;
		margin-top: 1rem;
		padding: 1rem 0;
	}
`;

export const ModalContainer = styled(BootstrapModal)`
	.modal-content {
		max-height: 75vh;
		overflow: hidden;
	}

	.modal-body {
		overflow-y: auto;
		height: 100%;
	}
`;

export const ModalHeader = styled(BootstrapModal.Header)`
	background: #1976d2;
	display: flex;
	justify-content: space-between;

	& > * {
		color: #fff !important;
		font-size: 18px;
		font-weight: bold;
	}
`;

export const ModalTitle = styled(BootstrapModal.Title)`
	margin: 0;
`;

export const SideModalContainer = styled.div<SideModalContainerProps>`
	position: absolute;
	top: 0;
	right: 0;
	width: 30%;
	height: 100%;
	background-color: #fff;
	transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(120%)')};
	border-radius: 5px;
	transition: transform 0.3s ease-in-out;

	display: flex;
	flex-direction: column;
`;

export const ModalBody = BootstrapModal.Body;

export const ModalFooter = BootstrapModal.Footer;
