import html2canvas from "html2canvas";


export async function htmlToCanvas(component: HTMLElement) {
    const canvas = await html2canvas(component);
    return canvas;
}

