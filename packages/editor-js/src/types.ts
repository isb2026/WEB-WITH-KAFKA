import { OutputData as EditorJSOutputData } from '@editorjs/editorjs';

export interface EditorOutputData extends EditorJSOutputData {
	time: number; // Time required
	blocks: Array<{
		type: string;
		data: {
			text?: string;
			level?: number;
			[key: string]: any;
		};
	}>;
	version?: string;
}
