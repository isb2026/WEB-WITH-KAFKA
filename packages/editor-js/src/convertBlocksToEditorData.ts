import { ReportBlock } from '@esg/types/report';
import { EditorOutputData } from './types';
const EDITORJS_DEFAULT_VERSION = '2.28.2';

export const convertBlocksToEditorData = (
	blocks: ReportBlock[] | string
): EditorOutputData => {
	try {
		// If blocks is a string, parse it directly
		const parsedBlocks =
			typeof blocks === 'string' ? JSON.parse(blocks) : blocks;

		return {
			time: Date.now(),
			blocks: Array.isArray(parsedBlocks) ? parsedBlocks : [],
			version: EDITORJS_DEFAULT_VERSION,
		};
	} catch (error) {
		console.warn('Failed to parse blocks:', error);
		return {
			time: Date.now(),
			blocks: [],
			version: EDITORJS_DEFAULT_VERSION,
		};
	}
};
