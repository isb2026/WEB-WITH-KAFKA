declare module 'react-barcode' {
  import React from 'react';

  export interface BarcodeProps {
    /** The value to encode in the barcode */
    value: string;
    /** Barcode format (default: 'CODE128') */
    format?: 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'UPC_A' | 'UPC_E' | 'EAN14' | 'ITF14' | 'MSI' | 'pharmacode' | 'codabar';
    /** Width of a single bar (default: 2) */
    width?: number;
    /** Height of the barcode (default: 100) */
    height?: number;
    /** Whether to display the value as text below the barcode (default: true) */
    displayValue?: boolean;
    /** Font size of the text (default: 20) */
    fontSize?: number;
    /** Font family of the text */
    font?: string;
    /** Text alignment ('left' | 'center' | 'right') */
    textAlign?: 'left' | 'center' | 'right';
    /** Text position ('bottom' | 'top') */
    textPosition?: 'bottom' | 'top';
    /** Text margin from barcode */
    textMargin?: number;
    /** Background color (default: '#ffffff') */
    background?: string;
    /** Line color (default: '#000000') */
    lineColor?: string;
    /** Margin around the barcode */
    margin?: number;
    /** Top margin */
    marginTop?: number;
    /** Bottom margin */
    marginBottom?: number;
    /** Left margin */
    marginLeft?: number;
    /** Right margin */
    marginRight?: number;
    /** HTML id attribute */
    id?: string;
    /** HTML class name */
    className?: string;
    /** HTML style object */
    style?: React.CSSProperties;
    /** Whether the barcode is valid */
    valid?: (valid: boolean) => void;
    /** Renderer function for custom rendering */
    renderer?: (canvas: HTMLCanvasElement) => void;
    /** Additional options passed to JsBarcode */
    options?: Record<string, any>;
  }

  const Barcode: React.FC<BarcodeProps>;
  export default Barcode;
}