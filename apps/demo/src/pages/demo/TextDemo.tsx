import React from 'react';
import { RadixText } from '@repo/radix-ui/components';

const TextDemoPage: React.FC = () => {
	return (
		<div className=" p-8 h-full ">
			<div className="max-w-xl mx-auto w-full flex flex-col">
				{/* 기본 span */}
				<RadixText>This is default span text.</RadixText>

				{/* div 로 변경 */}
				<RadixText as="div">Rendered as div tag.</RadixText>

				{/* label로 변경 */}
				<RadixText as="label" htmlFor="input-field">
					Label Text:
				</RadixText>

				{/* truncate 적용 */}
				<div style={{ width: '250px' }}>
					<RadixText truncate>
						This is a very long text that will be truncated with
						ellipsis if it exceeds the container width. Lorem ipsum
						dolor sit amet.
					</RadixText>
				</div>

				{/* asChild 사용 */}
				<RadixText asChild>
					<a
						href="https://radix-ui.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						Go to Radix UI (asChild)
					</a>
				</RadixText>
			</div>
		</div>
	);
};

export default TextDemoPage;
