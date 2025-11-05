import React, { useState } from 'react';
import {
	RadixCheckboxRoot,
	RadixCheckboxIndicator,
} from '@repo/radix-ui/components';

const CheckboxDemoPage: React.FC = () => {
	const [checked, setChecked] = useState(false);
	const [checked1, setChecked1] = useState(false);
	const [checked2, setChecked2] = useState(false);
	const [checked3, setChecked3] = useState(false);

	const handleChecked = (checked: boolean | 'indeterminate') => {
		setChecked(checked === true);
	};

	const handleChecked1 = (checked: boolean | 'indeterminate') => {
		setChecked1(checked === true);
	};

	const handleChecked2 = (checked: boolean | 'indeterminate') => {
		setChecked2(checked === true);
	};

	const handleChecked3 = (checked: boolean | 'indeterminate') => {
		setChecked3(checked === true);
	};

	return (
		<>
			<div className="bg-gray-500 p-8 h-full flex items-center justify-center">
				<div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Single Checkbox Example */}
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Single Checkbox Example
						</h3>
						<form>
							<div className="flex items-center">
								<RadixCheckboxRoot
									className="flex size-[25px] appearance-none items-center justify-center rounded bg-white shadow-[0_2px_10px] shadow-black/20 outline-none hover:bg-violet-100 focus:shadow-[0_0_0_2px_black]"
									checked={checked}
									onCheckedChange={handleChecked}
									id="single-checkbox"
								>
									<RadixCheckboxIndicator className="text-violet-600">
										<span className="text-sm">✓</span>
									</RadixCheckboxIndicator>
								</RadixCheckboxRoot>
								<label
									className="pl-[15px] text-[15px] leading-none text-gray-800 cursor-pointer"
									htmlFor="single-checkbox"
								>
									Accept terms and conditions
								</label>
							</div>
							{checked && (
								<p className="mt-4 text-sm text-green-600">
									✓ Terms accepted!
								</p>
							)}
						</form>
					</div>

					{/* Multiple Choice Example */}
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Multiple Choice Example
						</h3>
						<form className="space-y-3">
							<div className="flex items-center">
								<RadixCheckboxRoot
									className="flex size-[25px] appearance-none items-center justify-center rounded bg-white shadow-[0_2px_10px] shadow-black/20 outline-none hover:bg-violet-100 focus:shadow-[0_0_0_2px_black]"
									checked={checked1}
									onCheckedChange={handleChecked1}
									id="c1"
								>
									<RadixCheckboxIndicator className="text-violet-600">
										<span className="text-sm">✓</span>
									</RadixCheckboxIndicator>
								</RadixCheckboxRoot>
								<label
									className="pl-[15px] text-[15px] leading-none text-gray-800 cursor-pointer"
									htmlFor="c1"
								>
									Subscribe to newsletter
								</label>
							</div>

							<div className="flex items-center">
								<RadixCheckboxRoot
									className="flex size-[25px] appearance-none items-center justify-center rounded bg-white shadow-[0_2px_10px] shadow-black/20 outline-none hover:bg-violet-100 focus:shadow-[0_0_0_2px_black]"
									checked={checked2}
									onCheckedChange={handleChecked2}
									id="c2"
								>
									<RadixCheckboxIndicator className="text-violet-600">
										<span className="text-sm">✓</span>
									</RadixCheckboxIndicator>
								</RadixCheckboxRoot>
								<label
									className="pl-[15px] text-[15px] leading-none text-gray-800 cursor-pointer"
									htmlFor="c2"
								>
									Enable notifications
								</label>
							</div>

							<div className="flex items-center">
								<RadixCheckboxRoot
									className="flex size-[25px] appearance-none items-center justify-center rounded bg-white shadow-[0_2px_10px] shadow-black/20 outline-none hover:bg-violet-100 focus:shadow-[0_0_0_2px_black]"
									checked={checked3}
									onCheckedChange={handleChecked3}
									id="c3"
								>
									<RadixCheckboxIndicator className="text-violet-600">
										<span className="text-sm">✓</span>
									</RadixCheckboxIndicator>
								</RadixCheckboxRoot>
								<label
									className="pl-[15px] text-[15px] leading-none text-gray-800 cursor-pointer"
									htmlFor="c3"
								>
									Share data with third parties
								</label>
							</div>

							{(checked1 || checked2 || checked3) && (
								<div className="mt-4 p-3 bg-green-50 rounded-lg">
									<p className="text-sm text-green-700">
										Selected:{' '}
										{[
											checked1 && 'Newsletter',
											checked2 && 'Notifications',
											checked3 && 'Data sharing',
										]
											.filter(Boolean)
											.join(', ')}
									</p>
								</div>
							)}
						</form>
					</div>
				</div>
			</div>
		</>
	);
};
export default CheckboxDemoPage;
