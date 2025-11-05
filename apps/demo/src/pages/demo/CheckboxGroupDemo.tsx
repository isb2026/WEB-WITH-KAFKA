import React from 'react';
import { RadixCheckboxGroup } from '@repo/radix-ui/components';

const items = [
	{ value: '1', label: 'Fun' },
	{ value: '2', label: 'Serious' },
	{ value: '3', label: 'Smart' },
];

const CheckboxGroupDemo: React.FC = () => (
	<div className="py-2 space-y-8">
		{/* Default */}
		<RadixCheckboxGroup
			name="exampleDefault"
			defaultValue={['1']}
			direction="column"
			gap={'2'}
			items={items}
		/>

		{/* Size */}
		<div>
			<h2 className="text-xl font-semibold mb-2">Size</h2>
			<p className="mb-4 text-gray-600">
				<code>size</code> prop을 사용해 크기를 조절할 수 있습니다.
			</p>
			<div className="flex flex-1 gap-4 items-center">
				{(['1', '2', '3'] as const).map((size, i) => (
					<RadixCheckboxGroup
						key={size}
						name={`exampleColor${i}`}
						defaultValue={[String(i)]}
						items={[{ value: String(i), label: 'Size ' + size }]}
						size={size}
					/>
				))}
			</div>
		</div>

		{/* Variant */}
		<div>
			<h2 className="text-xl font-semibold mb-2">Variant</h2>
			<p className="mb-4 text-gray-600">
				<code>variant</code> prop을 사용해 시각적 스타일을 조절할 수
				있습니다.
			</p>

			<div className="flex items-center gap-4">
				<div className="flex flex-col gap-2">
					{(['classic', 'surface', 'soft'] as const).map(
						(variant, i) => (
							<RadixCheckboxGroup
								key={variant}
								name={`exampleColor${i}`}
								defaultValue={[String(i)]}
								items={[{ value: String(i), label: variant }]}
								variant={variant}
							/>
						)
					)}
				</div>
				<div className="flex flex-col gap-2">
					{(['classic', 'surface', 'soft'] as const).map(
						(variant, i) => (
							<RadixCheckboxGroup
								key={variant}
								name={`exampleColor${i}`}
								items={[{ value: String(i), label: variant }]}
								variant={variant}
							/>
						)
					)}
				</div>
			</div>
		</div>

		{/* Color */}
		<div>
			<h2 className="text-xl font-semibold mb-2">Color</h2>
			<p className="mb-4 text-gray-600">
				<code>color</code> prop을 사용해 특정 색상을 지정할 수 있습니다.
			</p>
			<div className="flex flex-1 gap-4 items-center">
				{(['indigo', 'cyan', 'orange', 'crimson'] as const).map(
					(color, i) => (
						<RadixCheckboxGroup
							key={color}
							name={`exampleColor${i}`}
							defaultValue={[String(i)]}
							items={[{ value: String(i), label: color }]}
							color={color}
						/>
					)
				)}
			</div>
		</div>
	</div>
);

export default CheckboxGroupDemo;
