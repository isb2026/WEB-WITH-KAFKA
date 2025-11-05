import React from 'react';
import { RadixHeading } from '@repo/radix-ui/components';

const HeadingDemoPage: React.FC = () => {
	return (
		<div className=" p-8 h-full ">
			<div className="max-w-xl mx-auto w-full flex flex-col">
				<RadixHeading as="h1">Heading Level 1</RadixHeading>
				<RadixHeading as="h2">Heading Level 2</RadixHeading>
				<RadixHeading as="h3">Heading Level 3</RadixHeading>
				<RadixHeading as="h4">Heading Level 4</RadixHeading>
				<RadixHeading as="h5">Heading Level 5</RadixHeading>
				<RadixHeading as="h6">Heading Level 6</RadixHeading>
			</div>
		</div>
	);
};

export default HeadingDemoPage;
