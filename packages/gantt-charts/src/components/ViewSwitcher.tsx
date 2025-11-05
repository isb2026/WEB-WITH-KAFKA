import React from 'react';
import { ViewMode } from 'gantt-task-react';

type ViewSwitcherProps = {
	isChecked: boolean;
	onViewListChange: (isChecked: boolean) => void;
	onViewModeChange: (viewMode: ViewMode) => void;
	activeView: ViewMode;
};

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
	onViewModeChange,
	onViewListChange,
	isChecked,
	activeView,
}) => {
	const base =
		'border px-4 text-sm py-1 rounded-lg transition-colors duration-200';

	const getBtnClass = (mode: ViewMode) =>
		activeView === mode
			? `${base} bg-Colors-Brand-700  text-white border-Colors-Brand-700 `
			: `${base} bg-white text-gray-700 hover:bg-gray-100`;

	return (
		<div className="flex gap-2 mb-4 items-center">
			<button
				className={getBtnClass(ViewMode.QuarterDay)}
				onClick={() => onViewModeChange(ViewMode.QuarterDay)}
			>
				Quarter of Day
			</button>
			<button
				className={getBtnClass(ViewMode.HalfDay)}
				onClick={() => onViewModeChange(ViewMode.HalfDay)}
			>
				Half of Day
			</button>
			<button
				className={getBtnClass(ViewMode.Day)}
				onClick={() => onViewModeChange(ViewMode.Day)}
			>
				Day
			</button>
			<button
				className={getBtnClass(ViewMode.Week)}
				onClick={() => onViewModeChange(ViewMode.Week)}
			>
				Week
			</button>
			<button
				className={getBtnClass(ViewMode.Month)}
				onClick={() => onViewModeChange(ViewMode.Month)}
			>
				Month
			</button>

			<div>
				<label className="flex items-center gap-1">
					<input
						type="checkbox"
						defaultChecked={isChecked}
						onClick={() => onViewListChange(!isChecked)}
					/>
					<span className="text-sm">Show Data List</span>
				</label>
			</div>
		</div>
	);
};
