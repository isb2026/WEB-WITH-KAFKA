import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import SelectDemo from './demo/SelectDemo';

const DataTableDemoWithCodePage: React.FC = () => {
	const codeString = `import {
    RadixSelect,
    RadixSelectGroup,
    RadixSelectItem,
    RadixSelectLabel,
  } from '@repo/radix-ui/components';
  import { useState } from 'react';
  
  const SelectDemo: React.FC = () => {
    // Generate dummy car data
    const sedans = Array.from({ length: 12 }, (_, i) => ({
      id: \`sedan\${i + 1}\`,
      name: \`Sedan \${i + 1}\`,
      type: 'Sedan',
    }));
  
    const suvs = Array.from({ length: 18 }, (_, i) => ({
      id: \`suv\${i + 1}\`,
      name: \`SUV \${i + 1}\`,
      type: 'SUV',
    }));
  
    const trucks = Array.from({ length: 14 }, (_, i) => ({
      id: \`truck\${i + 1}\`,
      name: \`Truck \${i + 1}\`,
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
  `.trim();

	return (
		<div className="min-h-screen w-full bg-gray-50 px-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Select 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					사용자가 선택할 수 있는 옵션 목록을 표시합니다(버튼으로
					트리거됨).
				</p>

				<PreviewCodeTabs
					preview={<SelectDemo />}
					code={
						<pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
							{codeString}
						</pre>
					}
				/>
			</div>
		</div>
	);
};

export default DataTableDemoWithCodePage;
