import React, { useState, useEffect, useRef } from 'react';
import {
	RadixIconButton,
	RadixSelect,
	RadixSelectItem,
} from '@radix-ui/components';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import ApsSimulationListPage from '@aips/pages/aps/simulation/ApsSimulationListPage';
import { toast } from 'sonner';

interface TabNavigationProps {
	activetab?: string;
}

const SimulationTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [isSimulationRunning, setIsSimulationRunning] =
		useState<boolean>(false);
	const [simulationProgress, setSimulationProgress] = useState<number>(0);
	const [currentScenario, setCurrentScenario] =
		useState<string>('Scenario A');
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const location = useLocation();
	const { t } = useTranslation('common');
	const { t: tMenu } = useTranslation('menu');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aps/simulation/list')) {
			setCurrentTab('simulation');
		}
	}, [location.pathname]);

	// Cleanup interval on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'simulation',
			icon: <Play size={16} />,
			label: tMenu('menu.mrp_simulation'),
			to: '/aps/simulation/list',
			content: (
				<ApsSimulationListPage
					isSimulationRunning={isSimulationRunning}
					simulationProgress={simulationProgress}
					currentScenario={currentScenario}
				/>
			),
		},
	];

	const handleStartSimulation = () => {
		console.log('Starting simulation...');
		setIsSimulationRunning(true);

		// Only reset progress if starting fresh (not resuming)
		if (simulationProgress <= 1) {
			setSimulationProgress(1); // Start with 1% to show progress bar immediately
		}

		toast.success('Simulation started');

		// Clear any existing interval
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		// Simulate progress
		intervalRef.current = setInterval(() => {
			setSimulationProgress((prev) => {
				if (prev >= 100) {
					if (intervalRef.current) {
						clearInterval(intervalRef.current);
						intervalRef.current = null;
					}
					setIsSimulationRunning(false);
					toast.success('Simulation completed');
					return 100;
				}
				return prev + 10;
			});
		}, 1000);
	};

	const handlePauseSimulation = () => {
		console.log('Pausing simulation...');
		setIsSimulationRunning(false);

		// Clear the interval to stop progress
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		toast.info('Simulation paused');
	};

	const handleResetSimulation = () => {
		console.log('Resetting simulation...');
		setIsSimulationRunning(false);
		setSimulationProgress(0);

		// Clear the interval
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		toast.info('Simulation reset');
	};

	const handleSettings = () => {
		console.log('Opening settings...');
		toast.info('Settings panel (coming soon)');
	};

	const SimulationControlButtons = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2 items-center">
				<RadixSelect
					value={currentScenario}
					onValueChange={setCurrentScenario}
					placeholder="Select Scenario"
				>
					<RadixSelectItem value="Scenario A">
						Scenario A - Normal Demand
					</RadixSelectItem>
					<RadixSelectItem value="Scenario B">
						Scenario B - High Demand
					</RadixSelectItem>
					<RadixSelectItem value="Scenario C">
						Scenario C - Low Demand
					</RadixSelectItem>
				</RadixSelect>

				<RadixIconButton
					onClick={handleResetSimulation}
					className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center gap-2"
					disabled={isSimulationRunning}
				>
					<RotateCcw size={16} />
					Reset
				</RadixIconButton>

				<RadixIconButton
					onClick={handleSettings}
					className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center gap-2"
				>
					<Settings size={16} />
					Settings
				</RadixIconButton>

				<RadixIconButton
					onClick={
						isSimulationRunning
							? handlePauseSimulation
							: handleStartSimulation
					}
					className={`px-3 py-2 rounded-lg text-white text-sm flex items-center gap-2 ${
						isSimulationRunning
							? 'bg-Colors-Error-500 hover:bg-Colors-Error-600'
							: 'bg-Colors-Brand-700 hover:bg-Colors-Brand-800'
					}`}
				>
					{isSimulationRunning ? (
						<>
							<Pause size={16} />
							Pause
						</>
					) : (
						<>
							<Play size={16} />
							Start
						</>
					)}
				</RadixIconButton>
			</div>
		);
	};

	const SetActionButton = (tab: string) => {
		switch (tab) {
			case 'simulation':
				return <SimulationControlButtons />;
			default:
				return '';
		}
	};

	return (
		<>
			<TabLayout
				title={t('tabs.titles.simulationManagement')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default SimulationTabNavigation;
