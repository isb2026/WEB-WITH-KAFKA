import React, { useState, useEffect } from 'react';
import { Zap, Settings, Cpu, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import { RadixButton } from '@repo/radix-ui/components';
import ApsOptimizationListPage from '@aips/pages/aps/optimization/ApsOptimizationListPage';

interface TabNavigationProps {
	activetab?: string;
}

const OptimizationTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'optimization'
	);
	const [isOptimizing, setIsOptimizing] = useState(false);
	const [optimizationProgress, setOptimizationProgress] = useState(0);
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aps/optimization/list')) {
			setCurrentTab('optimization');
		}
	}, [location.pathname]);

	const handleRunOptimization = () => {
		setIsOptimizing(true);
		setOptimizationProgress(0);

		// Simulate optimization progress
		const interval = setInterval(() => {
			setOptimizationProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					setIsOptimizing(false);
					return 100;
				}
				return prev + 10;
			});
		}, 500);
	};

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'optimization',
			icon: <Zap size={16} />,
			label: 'Optimization',
			to: '/aps/optimization/list',
			content: (
				<ApsOptimizationListPage
					isOptimizing={isOptimizing}
					optimizationProgress={optimizationProgress}
				/>
			),
		},
	];

	const OptimizationButtons = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixButton
					className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center gap-2"
					disabled={isOptimizing}
				>
					<Settings className="w-4 h-4" />
					Configure
				</RadixButton>
				<RadixButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					disabled={isOptimizing}
					onClick={handleRunOptimization}
				>
					{isOptimizing ? (
						<RefreshCw className="w-4 h-4 animate-spin" />
					) : (
						<Cpu className="w-4 h-4" />
					)}
					{isOptimizing ? 'Optimizing...' : 'Run AI Optimization'}
				</RadixButton>
			</div>
		);
	};

	return (
		<>
			<TabLayout
				title="APS Optimization"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<OptimizationButtons />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default OptimizationTabNavigation;
