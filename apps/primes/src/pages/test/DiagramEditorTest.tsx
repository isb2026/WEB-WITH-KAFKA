import React from 'react';
import { DiagramEditor } from '@repo/react-flow';

const DiagramEditorTest: React.FC = () => {
	return (
		<div className="h-full w-full flex flex-col p-4">
			<DiagramEditor />
		</div>
	);
};

export default DiagramEditorTest;
