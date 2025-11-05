import { RadixBadge } from '@repo/radix-ui/components';
import React from 'react';

const BadgeDemo: React.FC = () => (
	<div className="py-2 space-y-8">
		<RadixBadge />
		<div>
			<h2 className="text-xl font-semibold mb-2">Color</h2>
			<p className="mb-4 text-gray-600">
				'color' prop을 사용해 특정 색상을 지정할 수 있습니다.
			</p>
			<div className="flex items-center gap-4">
				{['indigo', 'cyan', 'orange', 'crimson'].map((value, i) => (
					<RadixBadge
						key={i}
						color={
							value as 'indigo' | 'cyan' | 'orange' | 'crimson'
						}
					>
						Color {value}
					</RadixBadge>
				))}
			</div>
		</div>
		<div>
			<h2 className="text-xl font-semibold mb-2">Size</h2>
			<p className="mb-4 text-gray-600">
				`size` prop을 사용해 크기를 조절할 수 있습니다.
			</p>
			<div className="flex items-center gap-4">
				{[1, 2, 3].map((value, i) => (
					<RadixBadge key={i} size={String(value) as '1' | '2' | '3'}>
						Size {value}
					</RadixBadge>
				))}
			</div>
		</div>
		<div>
			<h2 className="text-xl font-semibold mb-2">Variant</h2>
			<p className="mb-4 text-gray-600">
				`variant` prop을 사용해 시각적 스타일을 조절할 수 있습니다.
			</p>
			<div className="flex items-center gap-4">
				{['outline', 'soft', 'solid', 'surface'].map((value, i) => (
					<RadixBadge
						key={i}
						variant={
							value as 'outline' | 'soft' | 'solid' | 'surface'
						}
					>
						Variant {value}
					</RadixBadge>
				))}
			</div>
		</div>
		<div>
			<h2 className="text-xl font-semibold mb-2">Radius</h2>
			<p className="mb-4 text-gray-600">
				`radius` prop을 사용해 특정 반경 값을 지정할 수 있습니다.
			</p>
			<div className="flex items-center gap-4">
				{['none', 'small', 'medium', 'large', 'full'].map(
					(value, i) => (
						<RadixBadge
							key={i}
							radius={
								value as
									| 'none'
									| 'small'
									| 'medium'
									| 'large'
									| 'full'
							}
						>
							Radius {value}
						</RadixBadge>
					)
				)}
			</div>
		</div>
	</div>
);

export default BadgeDemo;
