import { generatePNG } from './png';

/**
 * Download PNG from HTML element
 */
export async function downloadPNG(component: HTMLElement, filename?: string) {
	try {
		const pngString = await generatePNG(component);
		const defaultFilename = `document-${new Date().toISOString().split('T')[0]}.png`;
		const finalFilename = filename || defaultFilename;
		
		// Create download link
		const link = document.createElement('a');
		link.href = pngString;
		link.download = finalFilename;
		
		// Append to body, click, and remove
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		
		return true;
	} catch (error) {
		console.error('Error downloading PNG:', error);
		return false;
	}
}

