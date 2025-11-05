import { generatePNG } from './png';

export async function printPNG(component: HTMLElement, title: string = 'Document') {
	try {
		const pngString = await generatePNG(component);
		const printWindow = window.open('', '_blank', 'width=800,height=600');
		
		if (printWindow) {
			// Create head content
			const head = printWindow.document.head;
			head.innerHTML = `
				<title>${title}</title>
				<style>
					body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
					img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
					@media print { body { margin: 0; padding: 0; } }
				</style>
			`;
			
			// Create and append image
			const img = printWindow.document.createElement('img');
			img.src = pngString;
			img.alt = title;
			img.style.cssText = 'max-width: 100%; height: auto; display: block; margin: 0 auto;';
			
			printWindow.document.body.appendChild(img);
			
			// Wait for load and print
			img.onload = () => {
				setTimeout(() => {
					printWindow.focus();
					printWindow.print();
				}, 100);
			};
		}
	} catch (error) {
		console.error('Error printing PNG with DOM:', error);
	}
}