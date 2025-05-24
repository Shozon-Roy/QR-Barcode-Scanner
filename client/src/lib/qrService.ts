import * as QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

// Generate QR code as data URL with fixed size of 250x250px
export const generateQRCode = async (text: string, options = {}): Promise<string> => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 1,
      width: 250, // Fixed width to 250px
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    };
    
    // Generate QR code with fixed dimensions
    const qrCodeMethod = QRCode.toDataURL || QRCode;
    const qrDataUrl = await qrCodeMethod(text, { ...defaultOptions, ...options });
    
    // To ensure the exact size, we can create a new canvas and draw the image
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 250;
        canvas.height = 250;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // Draw the QR code centered in the canvas
          ctx.drawImage(img, 0, 0, 250, 250);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve(qrDataUrl); // Fallback to original if canvas context unavailable
        }
      };
      img.onerror = () => reject(new Error('Failed to load QR code image'));
      img.src = qrDataUrl;
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Generate barcode as data URL with fixed size of 250x250px
export const generateBarcode = (text: string, format = 'CODE128', options = {}): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary canvas element
      const tempCanvas = document.createElement('canvas');
      
      const defaultOptions = {
        format: format,
        lineColor: '#000000',
        width: 2,
        height: 80, // Adjusted height for barcode itself
        displayValue: true,
        fontSize: 14,
        margin: 10,
        background: '#ffffff'
      };
      
      // Generate barcode on temporary canvas
      JsBarcode(tempCanvas, text, { ...defaultOptions, ...options });

      // Now create a fixed-size canvas
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = 250;
      finalCanvas.height = 250;
      const ctx = finalCanvas.getContext('2d');
      
      if (ctx) {
        // Fill with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        
        // Center the barcode on the 250x250 canvas
        const tempWidth = tempCanvas.width;
        const tempHeight = tempCanvas.height;
        
        // Calculate position to center the barcode
        const x = (250 - tempWidth) / 2;
        const y = (250 - tempHeight) / 2;
        
        // Draw barcode centered
        ctx.drawImage(tempCanvas, x, y);
        
        // Get the fixed-size data URL
        const dataUrl = finalCanvas.toDataURL('image/png');
        resolve(dataUrl);
      } else {
        // Fallback to original if canvas context is unavailable
        const dataUrl = tempCanvas.toDataURL('image/png');
        resolve(dataUrl);
      }
    } catch (error) {
      console.error('Error generating barcode:', error);
      reject(error);
    }
  });
};

// Format for different QR code types
export const formatQRContent = (
  type: string, 
  data: Record<string, string>
): string => {
  switch (type.toLowerCase()) {
    case 'contact':
      return `BEGIN:VCARD
VERSION:3.0
N:${data.lastName || ''};${data.firstName || ''}
TEL:${data.phone || ''}
EMAIL:${data.email || ''}
END:VCARD`;

    case 'phone':
      return `tel:${data.phone || ''}`;

    case 'email':
      return `mailto:${data.email || ''}${data.subject ? `?subject=${data.subject}` : ''}${
        data.body ? `${data.subject ? '&' : '?'}body=${data.body}` : ''
      }`;

    case 'sms':
      return `sms:${data.phone || ''}${data.message ? `?body=${data.message}` : ''}`;

    case 'wifi':
      return `WIFI:T:${data.encryptionType || 'WPA'};S:${data.ssid || ''};P:${data.password || ''};;`;

    case 'calendar':
      return `BEGIN:VEVENT
SUMMARY:${data.title || ''}
DTSTART:${data.start || ''}
DTEND:${data.end || ''}
LOCATION:${data.location || ''}
DESCRIPTION:${data.description || ''}
END:VEVENT`;

    case 'link':
    case 'playstore':
      return data.url || '';

    case 'text':
    default:
      return data.text || '';
  }
};

// Get icon for history item based on type
export const getIconForType = (type: string): string => {
  const iconMap: Record<string, string> = {
    contact: 'bi-person',
    phone: 'bi-telephone',
    email: 'bi-envelope',
    sms: 'bi-chat-dots',
    link: 'bi-link-45deg',
    text: 'bi-fonts',
    wifi: 'bi-wifi',
    calendar: 'bi-calendar-event',
    playstore: 'bi-google-play',
    whatsapp: 'bi-whatsapp',
    barcode: 'bi-upc-scan',
    qrcode: 'bi-qr-code',
    // Barcode specific
    upc: 'bi-upc',
    ean13: 'bi-upc',
    code39: 'bi-123',
    code128: 'bi-123',
    itf: 'bi-upc-scan'
  };
  
  return iconMap[type.toLowerCase()] || 'bi-qr-code';
};