import html2pdf from 'html2pdf.js';

export interface PDFOptions {
  filename?: string;
  margin?: number | [number, number, number, number];
  format?: 'a4' | 'a3' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
}

/**
 * Copy computed styles from source element to target element
 */
const copyComputedStyles = (source: Element, target: Element) => {
  const computedStyle = window.getComputedStyle(source);
  const targetElement = target as HTMLElement;
  
  // Copy all computed styles
  for (let i = 0; i < computedStyle.length; i++) {
    const property = computedStyle[i];
    const value = computedStyle.getPropertyValue(property);
    targetElement.style.setProperty(property, value);
  }
  
  // Recursively copy styles for all children
  for (let i = 0; i < source.children.length; i++) {
    if (target.children[i]) {
      copyComputedStyles(source.children[i], target.children[i]);
    }
  }
};

/**
 * Alternative PDF generation using direct element capture
 */
export const generateReceiptPDFDirect = async (
  containerElement: HTMLElement,
  receiptType: 'supplier' | 'buyer',
  documentNumber: string
): Promise<void> => {
  try {
    const filename = `거래명세표_${receiptType === 'supplier' ? '공급자용' : '공급받는자용'}_${documentNumber}.pdf`;
    
    const opt = {
      margin: [0.2, 0.2, 0.2, 0.2],
      filename,
      image: { 
        type: 'jpeg', 
        quality: 1 
      },
      html2canvas: { 
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        letterRendering: true,
        logging: true, // Enable logging for debugging
        backgroundColor: '#ffffff',
        removeContainer: true,
        foreignObjectRendering: true,
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        compress: false // Disable compression for debugging
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: '.avoid-break'
      }
    };

    console.log('Generating PDF for element:', containerElement);
    console.log('Element content:', containerElement.innerHTML.substring(0, 200));
    
    await html2pdf().set(opt).from(containerElement).save();
    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Enhanced PDF generation with style copying
 */
export const generateReceiptPDFEnhanced = async (
  containerElement: HTMLElement,
  receiptType: 'supplier' | 'buyer',
  documentNumber: string
): Promise<void> => {
  // Find the specific copy to export
  const copySelector = receiptType === 'supplier' ? '[data-copy="supplier"]' : '[data-copy="buyer"]';
  const copyElement = containerElement.querySelector(copySelector) as HTMLElement;
  
  if (!copyElement) {
    throw new Error(`${receiptType} copy not found`);
  }

  // Create a temporary container
  const tempContainer = document.createElement('div');
  
  // Add all existing stylesheets to ensure styles are available
  const existingStyles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n');
      } catch (e) {
        return '';
      }
    })
    .join('\n');

  tempContainer.innerHTML = `
    <style>
      ${existingStyles}
      * {
        box-sizing: border-box;
      }
      body, html {
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      }
      .container {
        width: 900px;
        background: white;
        margin: 0;
        padding: 0;
      }
    </style>
    <div class="container">
      ${copyElement.outerHTML}
    </div>
  `;

  // Style the temp container
  tempContainer.style.cssText = `
    position: fixed;
    left: -10000px;
    top: -10000px;
    width: 900px;
    background: white;
    z-index: -1000;
  `;

  document.body.appendChild(tempContainer);

  // Wait for styles to apply
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const filename = `거래명세표_${receiptType === 'supplier' ? '공급자용' : '공급받는자용'}_${documentNumber}.pdf`;
    
    const opt = {
      margin: 0.3,
      filename,
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: 900,
        backgroundColor: '#ffffff',
        letterRendering: true,
        logging: true,
        onclone: (clonedDoc: Document) => {
          // Ensure the cloned document has proper styles
          const clonedContainer = clonedDoc.querySelector('.container') as HTMLElement;
          if (clonedContainer) {
            clonedContainer.style.width = '900px';
            clonedContainer.style.backgroundColor = 'white';
          }
        }
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait'
      }
    };

    await html2pdf().set(opt).from(tempContainer).save();
  } finally {
    document.body.removeChild(tempContainer);
  }
};
