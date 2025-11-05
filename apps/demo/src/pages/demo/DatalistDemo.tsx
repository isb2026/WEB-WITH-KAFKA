import React, { useState } from 'react';
import { RadixDatalist } from '@repo/radix-ui/components';

const fruits = ['Apple', 'Banana', 'Cherry', 'Grape', 'Orange', 'Peach', 'Strawberry'];

const DatalistDemoPage: React.FC = () => {
	const [value, setValue] = useState('');

	return (
		<div className="bg-gray-500 p-8 h-full flex items-center justify-center">
			<div className="max-w-md mx-auto w-full bg-white p-6 rounded-lg shadow-md text-center">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Datalist Example</h3>
				<input
					list="fruits"
					value={value}
					onChange={e => setValue(e.target.value)}
					placeholder="Choose a fruit..."
					className="w-full border px-3 py-2 rounded mb-4"
				/>
				<RadixDatalist id="fruits">
					{fruits.map(fruit => (
						<option value={fruit} key={fruit} />
					))}
				</RadixDatalist>
				<div className="mt-2 text-gray-600 text-sm">
					Selected: <span className="font-semibold">{value}</span>
				</div>
			</div>
		</div>
	);
};

export default DatalistDemoPage; 