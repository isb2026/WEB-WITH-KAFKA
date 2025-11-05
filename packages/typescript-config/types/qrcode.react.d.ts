declare module 'qrcode.react' {
  import React from 'react';

  export interface QRCodeProps {
    /** The value to encode in the QR code */
    value: string;
    /** Size of the QR code in pixels (default: 256) */
    size?: number;
    /** Error correction level */
    level?: 'L' | 'M' | 'Q' | 'H';
    /** Background color (default: '#FFFFFF') */
    bgColor?: string;
    /** Foreground color (default: '#000000') */
    fgColor?: string;
    /** Whether to include a margin around the QR code (default: false) */
    includeMargin?: boolean;
    /** Rendering method - 'canvas' or 'svg' (default: 'canvas') */
    renderAs?: 'canvas' | 'svg';
    /** Image settings for logo/icon in center */
    imageSettings?: {
      /** Source URL of the image */
      src: string;
      /** Height of the image in pixels */
      height?: number;
      /** Width of the image in pixels */
      width?: number;
      /** Excavate (remove background) around the image */
      excavate?: boolean;
    };
    /** Margin size in pixels (default: 4) */
    marginSize?: number;
    /** Custom CSS class name */
    className?: string;
    /** Custom CSS style object */
    style?: React.CSSProperties;
    /** HTML id attribute */
    id?: string;
    /** Callback when QR code is rendered */
    onError?: (error: Error) => void;
    /** Callback when QR code is successfully rendered */
    onLoad?: () => void;
  }

  export interface QRCodeSVGProps extends QRCodeProps {
    /** SVG-specific properties */
    viewBox?: string;
  }

  export interface QRCodeCanvasProps extends QRCodeProps {
    /** Canvas-specific properties */
  }

  const QRCode: React.FC<QRCodeProps>;
  const QRCodeSVG: React.FC<QRCodeSVGProps>;
  const QRCodeCanvas: React.FC<QRCodeCanvasProps>;

  export default QRCode;
  export { QRCodeSVG, QRCodeCanvas };
}
