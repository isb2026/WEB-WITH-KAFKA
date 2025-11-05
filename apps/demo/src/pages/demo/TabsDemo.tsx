import React from 'react';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsContent,
	RadixTabsTrigger,
} from '@repo/radix-ui/components';

const TabsDemoPage: React.FC = () => {
	return (
		<div className="bg-gray-500 p-8 h-full flex items-center justify-center">
			<div className="max-w-xl mx-auto w-full">
				<RadixTabsRoot
					defaultValue="tab1"
					className="flex w-full flex-col  bg-white shadow-md"
				>
					<RadixTabsList
						className="flex border-none"
						aria-label="Demo Tabs"
					>
						{['tab1', 'tab2', 'tab3'].map((tab, index) => (
							<RadixTabsTrigger
								key={tab}
								value={tab}
								className="
										flex-1 
										text-sm 
										bg-white 
										text-black 
										rounded-none
										py-2 
										border-b-2 
										border-transparent 
										data-[state=active]:border-blue-500 
										data-[state=active]:text-blue-600 
										text-center 
										transition-all
									"
							>
								Tab {index + 1}
							</RadixTabsTrigger>
						))}
					</RadixTabsList>

					{['tab1', 'tab2', 'tab3'].map((tab, index) => (
						<RadixTabsContent
							key={tab}
							value={tab}
							className="grow p-5 outline-none"
						>
							<p className="text-gray-700 text-sm">
								This is the content for{' '}
								<strong>Tab {index + 1}</strong>.
							</p>
						</RadixTabsContent>
					))}
				</RadixTabsRoot>
			</div>
		</div>
	);
};

export default TabsDemoPage;
