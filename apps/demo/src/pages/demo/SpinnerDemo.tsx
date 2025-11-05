import { RadixSpinner } from '@repo/radix-ui/components';
import React from 'react';

const SpinnerDemo: React.FC = () => (
	<div className="py-4 space-y-8">
		<div>
			<h2 className="text-xl font-semibold mb-4">Spinner</h2>
			<RadixSpinner />
		</div>

		<div>
			<h2 className="text-xl font-semibold mb-2">Size</h2>
			<p className="mb-4 text-gray-600">
				이 컴포넌트는 `size` 프로퍼티를 사용하여 크기가 다른 여러 개의
				스피너를 표시합니다.
			</p>
			<div className="flex items-center gap-4">
				{[1, 2, 3].map((_, i) => (
					<RadixSpinner
						key={i}
						size={String(i + 1) as '1' | '2' | '3'}
					/>
				))}
			</div>
		</div>
	</div>
);

export default SpinnerDemo;
