import { htmlToCanvas } from '@repo/html2canvas';

export async function generatePNG(component: HTMLElement) {
    const canvas = await htmlToCanvas(component);
    const png = canvas.toDataURL('application/png');
    return png;
}