import styled from 'styled-components';
interface StyledGridContainerProps {
	$minHeight?: string | null;
}

export const Container = styled.div`
	min-height: 100%;
	height: 100%;
`;

export const StyledGridContainer = styled.div<StyledGridContainerProps>`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;

	// min-height: ${({ $minHeight }) => $minHeight ?? '680px'};
	// max-height: calc(100% - 60px);
`;
export const GridDiv = styled.div`
	flex: 1 1 auto;
	overflow: hidden;
	max-height: 100%;

	.tui-grid-container {
		font-family: Arial, sans-serif;
		height: 100%;
	}
	.tui-grid-content-area {
		height: 100%;
	}
	// .tui-grid-show-lside-area {
	// 	padding-left: 10px !important;
	// 	// background: #fff;
	// }
`;

export const GridHeader = styled.div`
	display: flex;
	width: 100%;
	gap: 10px;
	justify-content: space-between;
`;

export const ActionButtions = styled.div`
	display: flex;
	gap: 10px;
`;

export const PageNationContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	background: #fff;
	border-radius: 5px;
	flex-shrink: 0;
`;

export const PageSizeContainer = styled.div`
	position: absolute;
	top: 50%;
	right: 20px;
	display: flex;
	gap: 10px;
	align-items: center;
	transform: translateY(-50%);
	min-height: 10px;
`;
