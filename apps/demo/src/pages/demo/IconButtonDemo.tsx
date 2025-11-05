import React from 'react';
import { RadixIconButton } from '@repo/radix-ui/components';

const IconButtonDemoPage: React.FC = () => {
	return (
		<div className="bg-gray-500 p-8 h-full flex items-center justify-center">
			<div className="max-w-md mx-auto w-full bg-white p-6 rounded-lg shadow-md text-center">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Icon Button Example</h3>
				<div className="flex gap-4 justify-center">
					<RadixIconButton aria-label="Add" className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
					</RadixIconButton>
					<RadixIconButton aria-label="Edit" className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" />
						</svg>
					</RadixIconButton>
					<RadixIconButton aria-label="Delete" className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</RadixIconButton>
				</div>
				<div className="mt-4 text-gray-600 text-sm">Accessible, focusable icon-only buttons</div>
			</div>
		</div>
	);
};

export default IconButtonDemoPage; 