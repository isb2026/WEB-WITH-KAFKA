import React, { useState, useEffect, useRef } from 'react';
import { SearchModalTest } from '../../pages/test/SearchModalTest';

interface SearchFormData {
	userName: string;
	accountId: string;
	position: string;
	startDateStart: string;
	startDateEnd: string;
	endDateStart: string;
	endDateEnd: string;
}

interface SearchModalProps {
	onSearch?: (searchData: SearchFormData) => void;
	className?: string;
	buttonText?: string;
	// Add data source and search functionality
	data?: any[]; // The list to search through
	searchFields?: string[]; // Fields to search in (e.g., ['name', 'email', 'id'])
	onSearchResults?: (results: any[]) => void; // Callback for search results
}

export const SearchModal: React.FC<SearchModalProps> = ({
	onSearch,
	className = '',
	buttonText = '검색 (F3)',
	data = [],
	searchFields = [],
	onSearchResults,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState<SearchFormData>({
		userName: '',
		accountId: '',
		position: '',
		startDateStart: '',
		startDateEnd: '',
		endDateStart: '',
		endDateEnd: '',
	});
	const buttonRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'F3') {
				e.preventDefault();
				setIsOpen(!isOpen);
			}
			if (e.key === 'F8' || e.key === 'Enter') {
				e.preventDefault();
				if (isOpen) {
					handleSearch();
				}
			}
		};

		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const handleInputChange = (field: keyof SearchFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// Search function that filters data based on form criteria
	const performSearch = (searchData: SearchFormData): any[] => {
		if (!data || data.length === 0) {
			return [];
		}

		return data.filter((item) => {
			// Check each search field
			const matchesSearchFields =
				searchFields.length === 0 ||
				searchFields.some((field) => {
					const fieldValue = item[field];
					if (!fieldValue) return false;

					// Check if any form field matches this data field
					return Object.values(searchData).some((formValue) => {
						if (!formValue) return true; // Skip empty form fields
						return fieldValue
							.toString()
							.toLowerCase()
							.includes(formValue.toLowerCase());
					});
				});

			// Check specific form fields if they exist in the data
			const matchesUserName =
				!searchData.userName ||
				(item.name &&
					item.name
						.toLowerCase()
						.includes(searchData.userName.toLowerCase())) ||
				(item.userName &&
					item.userName
						.toLowerCase()
						.includes(searchData.userName.toLowerCase()));

			const matchesAccountId =
				!searchData.accountId ||
				(item.id &&
					item.id.toString().includes(searchData.accountId)) ||
				(item.accountId &&
					item.accountId.toString().includes(searchData.accountId));

			const matchesPosition =
				!searchData.position ||
				(item.position &&
					item.position
						.toLowerCase()
						.includes(searchData.position.toLowerCase())) ||
				(item.role &&
					item.role
						.toLowerCase()
						.includes(searchData.position.toLowerCase()));

			// Date range checks (if dates exist in data)
			const matchesStartDate =
				!searchData.startDateStart ||
				!searchData.startDateEnd ||
				(item.startDate &&
					new Date(item.startDate) >=
						new Date(searchData.startDateStart) &&
					new Date(item.startDate) <=
						new Date(searchData.startDateEnd));

			const matchesEndDate =
				!searchData.endDateStart ||
				!searchData.endDateEnd ||
				(item.endDate &&
					new Date(item.endDate) >=
						new Date(searchData.endDateStart) &&
					new Date(item.endDate) <= new Date(searchData.endDateEnd));

			return (
				matchesSearchFields &&
				matchesUserName &&
				matchesAccountId &&
				matchesPosition &&
				matchesStartDate &&
				matchesEndDate
			);
		});
	};

	const handleSearch = () => {
		// Perform actual search
		const searchResults = performSearch(formData);
		onSearchResults?.(searchResults);
		onSearch?.(formData);

		setIsOpen(false);
	};

	const handleButtonClick = () => setIsOpen(!isOpen);
	const handleClose = () => setIsOpen(false);

	return (
		<div ref={buttonRef}>
			<SearchModalTest
				isOpen={isOpen}
				formData={formData}
				buttonText={buttonText}
				onButtonClick={handleButtonClick}
				onInputChange={handleInputChange}
				onSearch={handleSearch}
				onClose={handleClose}
				dropdownRef={dropdownRef}
				className={className}
			/>
		</div>
	);
};

export const SearchDialogTest: React.FC = () => {
	// Mock data example - can be replaced with real backend data
	const mockData = [
		{
			id: 1,
			name: 'John Doe',
			userName: 'johndoe',
			position: 'Developer',
			role: 'Frontend',
			startDate: '2023-01-15',
			endDate: '2024-12-31',
		},
		{
			id: 2,
			name: 'Jane Smith',
			userName: 'janesmith',
			position: 'Manager',
			role: 'Team Lead',
			startDate: '2022-06-01',
			endDate: '2024-12-31',
		},
		{
			id: 3,
			name: 'Bob Johnson',
			userName: 'bobjohnson',
			position: 'Designer',
			role: 'UI/UX',
			startDate: '2023-03-10',
			endDate: '2024-12-31',
		},
		{
			id: 4,
			name: 'Alice Brown',
			userName: 'alicebrown',
			position: 'Developer',
			role: 'Backend',
			startDate: '2022-12-01',
			endDate: '2024-12-31',
		},
		{
			id: 5,
			name: 'Charlie Wilson',
			userName: 'charliewilson',
			position: 'Analyst',
			role: 'Data Analyst',
			startDate: '2023-08-20',
			endDate: '2024-12-31',
		},
	];

	const handleSearch = (searchData: SearchFormData) => {
		console.log('Search data:', searchData);
		alert(`검색 조건:\n${JSON.stringify(searchData, null, 2)}`);
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
						searchFields={['name', 'userName', 'position', 'role']}
						onSearchResults={handleSearchResults}
					/>
				</div>

				<div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
					<h3 className="font-medium mb-2">Mock Data Available:</h3>
					<p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
						The search modal is connected to mock data with these
						fields:
					</p>
					<ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
						<li>
							name, userName, position, role, startDate, endDate
						</li>
						<li>Try searching for: "John", "Developer", "2023"</li>
					</ul>
				</div>
			</div>
		</div>
	);
};
