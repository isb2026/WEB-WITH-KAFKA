import React from 'react';
import { Sun, Moon, Check } from 'lucide-react';
import Flag from 'react-flagkit';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { useResponsive } from '@primes/hooks';
import { useTranslation } from '@repo/i18n';

interface SiteSettingsProps {
	currentMode: number;
	onModeChange: (mode: number) => void;
}

const SiteSettings: React.FC<SiteSettingsProps> = ({
	currentMode,
	onModeChange,
}) => {
	const { theme, toggleTheme } = useTheme();
	const { language, setLanguage } = useLanguage();
	const { isMobile, isTablet } = useResponsive();
	const { t } = useTranslation('common');

	const handleModeSelect = (mode: number) => {
		onModeChange(mode);
	};

	return (
		<div className="px-4 pb-6">
			{/* Theme Toggle */}
			<div className="mb-6">
				<h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
					{t('siteSettings.theme')}
				</h3>
				<div
					className="flex justify-between bg-gray-100 dark:bg-gray-700 rounded-full p-1"
					onClick={() => toggleTheme()}
				>
					<button
						className={`inline-flex flex-1 justify-center items-center gap-3 px-5 py-2 rounded-full text-sm font-medium transition-all ${
							theme === 'light'
								? 'bg-white text-black shadow-md'
								: 'text-gray-600 dark:text-gray-400'
						}`}
					>
						<Sun size={16} />
						{t('siteSettings.light')}
					</button>
					<button
						className={`inline-flex flex-1 justify-center items-center gap-3 px-5 py-2 rounded-full text-sm font-medium transition-all ${
							theme === 'dark'
								? 'bg-white dark:bg-gray-500 text-black dark:text-white shadow-md'
								: 'text-gray-600 dark:text-gray-400'
						}`}
					>
						<Moon size={16} />
						{t('siteSettings.dark')}
					</button>
				</div>
			</div>

			{/* Language Toggle */}
			<div className="mb-6">
				<h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
					{t('siteSettings.language')}
				</h3>
				<div className="flex justify-between bg-gray-100 dark:bg-gray-700 rounded-full p-1">
					<button
						onClick={() => setLanguage('en')}
						className={`inline-flex flex-1 justify-center items-center gap-3 px-5 py-2 rounded-full text-sm font-medium transition-all ${
							language === 'en'
								? 'bg-white dark:bg-gray-500 text-black dark:text-white shadow-md'
								: 'text-gray-600 dark:text-gray-400'
						}`}
					>
						<Flag country="US" size={20} />
						{t('siteSettings.english')}
					</button>
					<button
						onClick={() => setLanguage('ko')}
						className={`inline-flex flex-1 justify-center items-center gap-3 px-5 py-2 rounded-full text-sm font-medium transition-all ${
							language === 'ko'
								? 'bg-white dark:bg-gray-500 text-black dark:text-white shadow-md'
								: 'text-gray-600 dark:text-gray-400'
						}`}
					>
						<Flag country="KR" size={20} />
						{t('siteSettings.korean')}
					</button>
				</div>
			</div>

			{/* Sidebar Style */}
			{!isMobile && !isTablet && (
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
						{t('siteSettings.menuStyles')}
					</h3>
					{/* Style 1 Option */}
					<button
						onClick={() => handleModeSelect(1)}
						className={`w-full p-3 border rounded-lg transition-all duration-200 ${
							currentMode === 1
								? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
						}`}
					>
						<div className="flex items-center justify-between">
							<div className="w-full text-left">
								<div className="flex items-center justify-between">
									<h4 className="font-medium text-gray-900 dark:text-gray-100">
										{t('siteSettings.solutionsAsDropdown')}
									</h4>
									{currentMode === 1 && (
										<div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
											<Check size={14} color="#fff" />
										</div>
									)}
								</div>
								<p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
									{t(
										'siteSettings.solutionsAsDropdownDescription'
									)}
								</p>
							</div>
						</div>
					</button>

					{/* Style 2 Option */}
					<button
						onClick={() => handleModeSelect(2)}
						className={`w-full p-3 border rounded-lg transition-all duration-200 ${
							currentMode === 2
								? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
						}`}
					>
						<div className="flex items-center justify-between">
							<div className="w-full text-left">
								<div className="flex items-center justify-between">
									<h4 className="font-medium text-gray-900 dark:text-gray-100">
										{t('siteSettings.solutionsAsList')}
									</h4>
									{currentMode === 2 && (
										<div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
											<Check size={14} color="#fff" />
										</div>
									)}
								</div>
								<p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
									{t(
										'siteSettings.solutionsAsListDescription'
									)}
								</p>
							</div>
						</div>
					</button>
				</div>
			)}
		</div>
	);
};

export default SiteSettings;
