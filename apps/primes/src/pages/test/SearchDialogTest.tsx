import React from 'react';
import { DynamicSearchDialog } from './../../components/dialog/DynamicSearchDialog';

export const SearchDialogTest: React.FC = () => {
	return (
		<div className="p-8 max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">
				Dynamic Search Dialog Test
			</h1>

			<div className="space-y-6 h-full">
				<div>
					<h2 className="text-lg font-semibold mb-2">
						Test the Search Dialog
					</h2>
					<p className="text-gray-600 dark:text-gray-300 mb-4">
						Type something in the input below and press Enter to
						open the draggable dialog.
					</p>
					<DynamicSearchDialog placeholder="Type your search query and press Enter..." />
				</div>

				<div className="bg-gray-50 dark:bg-gray-300 p-4 rounded-lg">
					<h3 className="font-medium mb-2 dark:text-gray-600">
						Instructions:
					</h3>
					<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
						<li>Type any text in the search input above</li>
						<li>Press the Enter key</li>
						<li>
							A draggable dialog will appear with your search
							query
						</li>
						<li>You can drag the dialog around the screen</li>
						<li>Click the X or outside to close the dialog</li>
					</ol>
				</div>
			</div>
		</div>
	);
};
