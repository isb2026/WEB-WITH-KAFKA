import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
	RadixSelectLabel,
} from '@repo/radix-ui/components';
import { useState } from 'react';

const SelectDemo: React.FC = () => {
	// Generate dummy car data
	const sedans = Array.from({ length: 12 }, (_, i) => ({
		id: `sedan${i + 1}`,
		name: `Sedan ${i + 1}`,
		type: 'Sedan',
	}));

	const suvs = Array.from({ length: 18 }, (_, i) => ({
		id: `suv${i + 1}`,
		name: `SUV ${i + 1}`,
		type: 'SUV',
	}));

	const trucks = Array.from({ length: 14 }, (_, i) => ({
		id: `truck${i + 1}`,
		name: `Truck ${i + 1}`,
		type: 'Truck',
	}));

	const [selectedCar, setSelectedCar] = useState('');

	return (
		<div className="py-2 space-y-8">
			<RadixSelect
				placeholder="차량을 선택하세요..."
				value={selectedCar}
				onValueChange={setSelectedCar}
				className="max-w-xs"
			>
				<RadixSelectGroup>
					<RadixSelectLabel className="px-[25px] text-xs leading-[25px] text-gray-500">
						Sedans
					</RadixSelectLabel>
					{sedans.map((car) => (
						<RadixSelectItem key={car.id} value={car.id}>
							{car.name}
						</RadixSelectItem>
					))}

					<RadixSelectLabel className="px-[25px] text-xs leading-[25px] text-gray-500 mt-2">
						SUVs
					</RadixSelectLabel>
					{suvs.map((car) => (
						<RadixSelectItem key={car.id} value={car.id}>
							{car.name}
						</RadixSelectItem>
					))}

					<RadixSelectLabel className="px-[25px] text-xs leading-[25px] text-gray-500 mt-2">
						Trucks
					</RadixSelectLabel>
					{trucks.map((car) => (
						<RadixSelectItem key={car.id} value={car.id}>
							{car.name}
						</RadixSelectItem>
					))}
				</RadixSelectGroup>
			</RadixSelect>
		</div>
	);
};

export default SelectDemo;
