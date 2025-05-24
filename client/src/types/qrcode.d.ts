declare module 'qrcode' {
  interface QRCodeOptions {
    errorCorrectionLevel?: string;
    type?: string;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    width?: number;
    scale?: number;
  }

  function toDataURL(text: string, options?: QRCodeOptions): Promise<string>;
  function toCanvas(canvasElement: HTMLCanvasElement, text: string, options?: QRCodeOptions): Promise<void>;
  function toString(text: string, options?: QRCodeOptions): Promise<string>;

  export { toDataURL, toCanvas, toString };
}

declare module 'jsbarcode' {
  interface BarcodeOptions {
    format?: string;
    lineColor?: string;
    width?: number;
    height?: number;
    displayValue?: boolean;
    fontSize?: number;
    margin?: number;
    background?: string;
  }

  function JsBarcode(element: HTMLElement, text: string, options?: BarcodeOptions): void;
  
  export default JsBarcode;
}