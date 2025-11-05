import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import { EditableDemo } from './demo/EditableDemo';

const EditableDemoWithCodePage: React.FC = () => {
	const codeString = `import * as React from 'react';
import {
	Editable,
	EditableArea,
	EditableCancel,
	EditableInput,
	EditablePreview,
	EditableSubmit,
	EditableToolbar,
	EditableTrigger,
} from '@repo/radix-ui/components';
import { Button } from '@repo/radix-ui/components';

export function EditableDemo() {
	return (
		<Editable
			defaultValue="Click to edit"
			placeholder="Enter your text here"
		>
			<EditableArea>
				<EditablePreview />
				<EditableInput />
			</EditableArea>
			<div>
				<EditableTrigger asChild>
					<Button size="1">Edit</Button>
				</EditableTrigger>
			</div>
			<EditableToolbar>
				<EditableSubmit asChild>
					<Button size="1">Save</Button>
				</EditableSubmit>
				<EditableCancel asChild>
					<Button variant="outline" size="1">
						Cancel
					</Button>
				</EditableCancel>
			</EditableToolbar>
		</Editable>
	);
}
`.trim();

	return (
		<div className="min-h-screen w-full bg-gray-50 px-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Editable 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					텍스트 콘텐츠를 제자리에서 편집할 수 있는 접근 가능한 인라인
					편집 가능 컴포넌트입니다.
				</p>

				<PreviewCodeTabs
					preview={<EditableDemo />}
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

export default EditableDemoWithCodePage;
