import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { RadixPopoverComposable } from '@radix-ui/components';
import { useTranslation } from '@repo/i18n';

export interface QuickSearchField {
	key: string;
	value: string;
	active: boolean;
}

interface QuickSearchProps {
	onSearch?: (value: string) => void;
	quickSearchField?: QuickSearchField[];
	toggleQuickSearchEl?: (key: string) => void;
}

export const QuickSearch: React.FC<QuickSearchProps> = ({
	onSearch,
	quickSearchField,
	toggleQuickSearchEl,
}) => {
	const { t } = useTranslation('common');
	const [searchQuery, setSearchQuery] = useState('');

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && onSearch) {
			onSearch(searchQuery.trim());
		}
	};

	// Function to get translated value for quick search fields
	const getTranslatedValue = (field: QuickSearchField) => {
		// Try to get translation from common.json first
		const translationKey = `search.fields.${field.key}`;
		const translatedValue = t(translationKey);
		
		// If translation exists and is different from the key, use it
		if (translatedValue && translatedValue !== translationKey) {
			return translatedValue;
		}
		
		// Fallback to the original value if no translation found
		return field.value;
	};

	return (
		<div className="flex items-center w-48 h-8 pl-2 text-sm border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-Colors-Brand-500">
			<Search className="text-gray-500 mr-2 w-4" />
			<input
				type="text"
				placeholder={t('table.search.keywordSearch')}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				onKeyDown={handleKeyDown}
				className="w-full h-full px-2 text-sm border-none outline-none placeholder-gray-500 focus:ring-0"
			/>

			<RadixPopoverComposable.Root>
				<RadixPopoverComposable.Trigger asChild>
					<button className="border-l px-2 text-gray-500">FC</button>
				</RadixPopoverComposable.Trigger>
				<RadixPopoverComposable.Content
					side="bottom"
					align="end"
					className="p-2 bg-white rounded-md shadow-md border text-sm w-52"
				>
					{quickSearchField &&
						quickSearchField.map((field) => (
							<div
								key={field.key}
								className={`flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-gray-100 rounded ${
									field.active
										? 'font-semibold bg-Colors-Brand-600 text-white'
										: 'text-gray-500'
								}`}
								onClick={() => toggleQuickSearchEl?.(field.key)}
							>
								<span>{getTranslatedValue(field)}</span>
								{field.active && <span>✓</span>}
							</div>
						))}
					{!quickSearchField && (
						<div className="text-gray-500 text-sm text-center">
							{t('table.search.noAvailableItems')}
						</div>
					)}
				</RadixPopoverComposable.Content>
			</RadixPopoverComposable.Root>
		</div>
	);
};
