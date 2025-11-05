import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { RadixButton, RadixTextInput } from '@repo/radix-ui/components';

export interface SearchField {
	name: string;
	label: string;
	type: 'text' | 'date' | 'dateRange';
	placeholder?: string;
}

interface SearchFormData {
	[key: string]: string;
}

interface SearchSlotProps {
	data: any[]; // The data to search through
	searchFields?: string[]; // Fields to search in
	formFields?: SearchField[]; // Configurable form fields
	onSearchResults?: (results: any[]) => void; // Callback for search results
	className?: string;
}

export const SearchSlot: React.FC<SearchSlotProps> = ({
	data = [],
	searchFields = [],
	formFields = [],
	onSearchResults,
	className = '',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState<SearchFormData>({});
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

	const handleInputChange = (field: string, value: string) => {
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

			// Check each form field against the data
			const matchesFormFields = Object.entries(searchData).every(
				([formField, formValue]) => {
					if (!formValue) return true; // Skip empty form fields

					// Find the corresponding search field
					const searchField = formFields.find(
						(f) => f.name === formField
					);
					if (!searchField) return true;

					// Check if the data has a matching field
					const dataValue = item[searchField.name] || item[formField];
					if (!dataValue) return true;

					// Handle different field types
					if (searchField.type === 'dateRange') {
						// Handle date range logic
						const startDate = searchData[`${formField}Start`];
						const endDate = searchData[`${formField}End`];
						if (startDate && endDate) {
							const itemDate = new Date(dataValue);
							return (
								itemDate >= new Date(startDate) &&
								itemDate <= new Date(endDate)
							);
						}
						return true;
					}

					// Text search
					return dataValue
						.toString()
						.toLowerCase()
						.includes(formValue.toLowerCase());
				}
			);

			return matchesSearchFields && matchesFormFields;
		});
	};

	const handleSearch = () => {
		// Perform actual search
		const searchResults = performSearch(formData);
		onSearchResults?.(searchResults);

		setIsOpen(false);
	};

	const handleButtonClick = () => setIsOpen(!isOpen);
	const handleClose = () => setIsOpen(false);

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
		<div className="flex ml-auto gap-2" ref={buttonRef}>
			<div className="flex items-center w-48 h-8 pl-2 text-sm border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-Colors-Brand-500">
				<Search className="text-gray-500 mr-2 w-4" />
				<input
					type="text"
					placeholder="키워드 검색"
					className="w-full h-full px-2 text-sm border-none outline-none placeholder-gray-500 focus:ring-0"
				/>
				<RadixButton className="border-l px-2 text-gray-500">
					FC
				</RadixButton>
			</div>

			{/* F3 Search Button with Dropdown */}
			<div className="relative">
				<RadixButton
					variant="outline"
					onClick={handleButtonClick}
					className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 text-white"
				>
					<Search
						size={16}
						className="text-muted-foreground text-white"
					/>
					검색(F3)
				</RadixButton>

				{isOpen && (
					<div
						ref={dropdownRef}
						className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[800px] z-50"
					>
						<div className="flex justify-between items-center p-4 border-b border-gray-200">
							<h2 className="text-lg font-semibold text-gray-800 font-sans">
								검색 조건
							</h2>
							<button
								onClick={handleClose}
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
								{formFields.length === 0 ? (
									<div className="text-center text-gray-500 py-4">
										No search fields configured. Please
										provide formFields prop.
									</div>
								) : (
									formFields.map((field) => (
										<div
											key={field.name}
											className="grid grid-cols-[100px_1fr] items-center gap-x-1"
										>
											<label className="text-sm text-gray-700 font-medium text-right pr-2 font-sans">
												{field.label}
											</label>
											{field.type === 'dateRange' ? (
												<DateRangeInput
													startValue={
														formData[
															`${field.name}Start`
														] || ''
													}
													endValue={
														formData[
															`${field.name}End`
														] || ''
													}
													onStartChange={(value) =>
														handleInputChange(
															`${field.name}Start`,
															value
														)
													}
													onEndChange={(value) =>
														handleInputChange(
															`${field.name}End`,
															value
														)
													}
												/>
											) : (
												<RadixTextInput
													type={
														field.type === 'date'
															? 'date'
															: 'text'
													}
													placeholder={
														field.placeholder ||
														'입력해주세요'
													}
													value={
														formData[field.name] ||
														''
													}
													onChange={(e) =>
														handleInputChange(
															field.name,
															e.target.value
														)
													}
													className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 font-sans"
												/>
											)}
										</div>
									))
								)}
							</div>

							<div className="flex justify-start mt-6">
								<RadixButton
									onClick={handleSearch}
									className="bg-Colors-Brand-600 hover:bg-Colors-Brand-700 text-white px-6 py-2 rounded-lg transition-colors"
								>
									검색 (F8)
								</RadixButton>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
