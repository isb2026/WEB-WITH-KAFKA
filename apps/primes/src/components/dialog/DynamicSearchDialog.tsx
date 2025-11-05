import React, { useState } from 'react';
import { DraggableDialog } from '@repo/radix-ui/components';

interface DynamicSearchDialogProps {
	placeholder?: string;
	className?: string;
}

export const DynamicSearchDialog: React.FC<DynamicSearchDialogProps> = ({
	placeholder = 'Type something and press Enter...',
	className = '',
}) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && searchQuery.trim()) {
			event.preventDefault();
			setIsDialogOpen(true);
		}
	};

	const SearchResultsContent = () => (
		<div className="space-y-4">
			<p>
				Search results for: <strong>{searchQuery}</strong>
			</p>
			<div className="p-4 bg-gray-50 rounded">
				<p>
					Your search query "{searchQuery}" would display results
					here.
				</p>
			</div>
		</div>
	);

	return (
		<>
			<input
				type="text"
				placeholder={placeholder}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				onKeyDown={handleKeyDown}
				className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 ${className}`}
			/>
			<DraggableDialog
				title={searchQuery}
				content={<SearchResultsContent />}
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			/>
		</>
	);
};
