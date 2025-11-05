import React from 'react';
import { RadixButton, RadixTextInput } from '@repo/radix-ui/components';
import { SearchModal } from '../../components/common/SearchModal';

interface SearchFormData {
	userName: string;
	accountId: string;
	position: string;
	startDateStart: string;
	startDateEnd: string;
	endDateStart: string;
	endDateEnd: string;
}

interface SearchModalTemplateProps {
	isOpen: boolean;
	formData: SearchFormData;
	buttonText: string;
	onButtonClick: () => void;
	onInputChange: (field: keyof SearchFormData, value: string) => void;
	onSearch: () => void;
	onClose: () => void;
	dropdownRef: React.RefObject<HTMLDivElement>;
	className?: string;
}

export const SearchModalTest: React.FC<SearchModalTemplateProps> = ({
	isOpen,
	formData,
	buttonText,
	onButtonClick,
	onInputChange,
	onSearch,
	onClose,
	dropdownRef,
	className = '',
}) => {
	const DateRangeInput = ({
		startValue,
		endValue,
		onStartChange,
		onEndChange,
	}: {
		startValue: string;
		endValue: string;
		onStartChange: (value: string) => void;
		onEndChange: (value: string) => void;
	}) => (
		<div className="flex gap-1 w-full">
			<RadixTextInput
				type="date"
				value={startValue}
				onChange={(e) => onStartChange(e.target.value)}
				className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 font-sans"
			/>
			<span className="self-center text-gray-500">~</span>
			<RadixTextInput
				type="date"
				value={endValue}
				onChange={(e) => onEndChange(e.target.value)}
				className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 font-sans"
			/>
		</div>
	);

	return (
		<div className="relative">
			<RadixButton
				onClick={onButtonClick}
				className={`bg-Colors-Brand-600 hover:bg-Colors-Brand-700 text-white px-4 py-2 rounded-lg transition-colors ${className}`}
			>
				{buttonText}
			</RadixButton>

			{isOpen && (
				<div
					ref={dropdownRef}
					className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[800px] z-50"
				>
					<div className="flex justify-between items-center p-4 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-800 font-sans">
							검색 조건
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 transition-colors"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<div className="p-4">
						<div className="grid gap-y-4 w-full">
							<div className="grid grid-cols-[100px_1fr] items-center gap-x-1">
								<label className="text-sm text-gray-700 font-medium text-right pr-2">
									사용자명
								</label>
								<RadixTextInput
									type="text"
									placeholder="입력해주세요"
									value={formData.userName}
									onChange={(e) =>
										onInputChange(
											'userName',
											e.target.value
										)
									}
									className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 font-sans"
								/>
							</div>

							<div className="grid grid-cols-[100px_1fr] items-center gap-x-1">
								<label className="text-sm text-gray-700 font-medium text-right pr-2">
									계정 아이디
								</label>
								<RadixTextInput
									type="text"
									placeholder="입력해주세요"
									value={formData.accountId}
									onChange={(e) =>
										onInputChange(
											'accountId',
											e.target.value
										)
									}
									className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 font-sans"
								/>
							</div>

							<div className="grid grid-cols-[100px_1fr] items-center gap-x-1">
								<label className="text-sm text-gray-700 font-medium text-right pr-2">
									직책
								</label>
								<RadixTextInput
									type="text"
									placeholder="입력해주세요"
									value={formData.position}
									onChange={(e) =>
										onInputChange(
											'position',
											e.target.value
										)
									}
									className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 font-sans"
								/>
							</div>

							<div className="grid grid-cols-[100px_1fr] items-center gap-x-1">
								<label className="text-sm text-gray-700 font-medium text-right pr-2 font-sans">
									입사일
								</label>
								<DateRangeInput
									startValue={formData.startDateStart}
									endValue={formData.startDateEnd}
									onStartChange={(value) =>
										onInputChange('startDateStart', value)
									}
									onEndChange={(value) =>
										onInputChange('startDateEnd', value)
									}
								/>
							</div>

							<div className="grid grid-cols-[100px_1fr] items-center gap-x-1">
								<label className="text-sm text-gray-700 font-medium text-right pr-2 font-sans">
									퇴사일
								</label>
								<DateRangeInput
									startValue={formData.endDateStart}
									endValue={formData.endDateEnd}
									onStartChange={(value) =>
										onInputChange('endDateStart', value)
									}
									onEndChange={(value) =>
										onInputChange('endDateEnd', value)
									}
								/>
							</div>
						</div>

						<div className="flex justify-start mt-6">
							<RadixButton
								onClick={onSearch}
								className="bg-Colors-Brand-600 hover:bg-Colors-Brand-700 text-white px-6 py-2 rounded-lg transition-colors"
							>
								검색 (F8)
							</RadixButton>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const SearchModalTestPage: React.FC = () => {
	// Mock data for testing search functionality
	const mockData = [
		{
			id: 1,
			name: 'John Doe',
			userName: 'johndoe',
			position: 'Frontend Developer',
			role: 'Developer',
			startDate: '2023-01-15',
			endDate: '2024-12-31',
			department: 'Engineering',
			email: 'john.doe@company.com',
		},
		{
			id: 2,
			name: 'Jane Smith',
			userName: 'janesmith',
			position: 'Product Manager',
			role: 'Manager',
			startDate: '2022-06-01',
			endDate: '2024-12-31',
			department: 'Product',
			email: 'jane.smith@company.com',
		},
		{
			id: 3,
			name: 'Bob Johnson',
			userName: 'bobjohnson',
			position: 'UI/UX Designer',
			role: 'Designer',
			startDate: '2023-03-10',
			endDate: '2024-12-31',
			department: 'Design',
			email: 'bob.johnson@company.com',
		},
		{
			id: 4,
			name: 'Alice Brown',
			userName: 'alicebrown',
			position: 'Backend Developer',
			role: 'Developer',
			startDate: '2022-12-01',
			endDate: '2024-12-31',
			department: 'Engineering',
			email: 'alice.brown@company.com',
		},
		{
			id: 5,
			name: 'Charlie Wilson',
			userName: 'charliewilson',
			position: 'Data Analyst',
			role: 'Analyst',
			startDate: '2023-08-20',
			endDate: '2024-12-31',
			department: 'Analytics',
			email: 'charlie.wilson@company.com',
		},
		{
			id: 6,
			name: 'Diana Lee',
			userName: 'dianalee',
			position: 'Marketing Manager',
			role: 'Manager',
			startDate: '2023-05-15',
			endDate: '2024-12-31',
			department: 'Marketing',
			email: 'diana.lee@company.com',
		},
		{
			id: 7,
			name: 'Eve Garcia',
			userName: 'evegarcia',
			position: 'DevOps Engineer',
			role: 'Engineer',
			startDate: '2022-09-01',
			endDate: '2024-12-31',
			department: 'Engineering',
			email: 'eve.garcia@company.com',
		},
		{
			id: 8,
			name: 'Frank Miller',
			userName: 'frankmiller',
			position: 'Sales Representative',
			role: 'Sales',
			startDate: '2023-11-01',
			endDate: '2024-12-31',
			department: 'Sales',
			email: 'frank.miller@company.com',
		},
	];

	const handleSearch = (searchData: SearchFormData) => {
		console.log('Search data:', searchData);
		// Removed alert to avoid duplicate alerts
	};

	const handleSearchResults = (results: any[]) => {
		console.log('Search results:', results);
		alert(
			`검색 결과: ${results.length}개 항목 발견\n${JSON.stringify(results, null, 2)}`
		);
	};

	return (
		<div className="p-8 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">
				Dynamic Search Modal Test
			</h1>
			<div className="space-y-6 h-full">
				<div>
					<h2 className="text-lg font-semibold mb-4">
						Test the Search Modal
					</h2>
					<p className="text-gray-600 dark:text-gray-300 mb-4">
						Click the button below or press F3 to open the search
						modal.
					</p>
					<SearchModal
						onSearch={handleSearch}
						data={mockData}
						searchFields={[
							'name',
							'userName',
							'position',
							'role',
							'department',
							'email',
						]}
						onSearchResults={handleSearchResults}
					/>
				</div>

				<div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
					<h3 className="font-medium mb-2">
						Mock Data Available for Testing:
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
						The search modal is connected to mock data with these
						fields:
					</p>
					<ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
						<li>
							<strong>name:</strong> John Doe, Jane Smith, Bob
							Johnson, etc.
						</li>
						<li>
							<strong>userName:</strong> johndoe, janesmith,
							bobjohnson, etc.
						</li>
						<li>
							<strong>position:</strong> Frontend Developer,
							Product Manager, UI/UX Designer, etc.
						</li>
						<li>
							<strong>role:</strong> Developer, Manager, Designer,
							Analyst, Engineer, Sales
						</li>
						<li>
							<strong>department:</strong> Engineering, Product,
							Design, Analytics, Marketing, Sales
						</li>
						<li>
							<strong>email:</strong> john.doe@company.com,
							jane.smith@company.com, etc.
						</li>
					</ul>

					<div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
						<h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
							Try these search examples:
						</h4>
						<ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
							<li>
								• <strong>사용자명:</strong> "John" or "Jane"
							</li>
							<li>
								• <strong>계정 아이디:</strong> "john" or "jane"
							</li>
							<li>
								• <strong>직책:</strong> "Developer" or
								"Manager"
							</li>
							<li>
								• <strong>입사일:</strong> "2023-01-01" to
								"2023-12-31"
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SearchModalTestPage;
