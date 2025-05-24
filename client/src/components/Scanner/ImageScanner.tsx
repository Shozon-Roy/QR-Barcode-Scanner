import { useRef, useState } from 'react';
// @ts-ignore
import { Html5Qrcode } from 'html5-qrcode';
import { addHistoryItem } from '@/lib/storage';
import { getIconForType } from '@/lib/qrService';

interface ImageScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (result: string) => void;
}

const ImageScanner = ({ isOpen, onClose, onScanSuccess }: ImageScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, etc).');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      scanImage(result);
    };
    reader.readAsDataURL(file);
  };

  const scanImage = (imageUrl: string) => {
    setScanning(true);
    setError(null);
    
    const html5QrCode = new Html5Qrcode("image-scanner-reader");
    
    html5QrCode.scanFile(new File([convertDataURItoBlob(imageUrl)], "image.jpg", { 
      type: "image/jpeg" 
    }), true)
      .then(decodedText => {
        // Success
        setScanning(false);
        
        // Save scan result to history
        const qrType = determineQRType(decodedText);
        addHistoryItem({
          type: qrType,
          title: qrType.charAt(0).toUpperCase() + qrType.slice(1),
          content: decodedText,
          category: 'scanned',
          isFavorite: false,
          iconType: getIconForType(qrType)
        });
        
        // Pass result to parent component
        onScanSuccess(decodedText);
      })
      .catch(err => {
        // Error
        console.error("Error scanning image:", err);
        setScanning(false);
        setError('Could not find any QR code or barcode in this image. Please try another image.');
      });
  };

  // Convert data URI to Blob
  const convertDataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  };

  // Determine QR code type based on content
  const determineQRType = (content: string): string => {
    content = content.trim().toLowerCase();
    
    if (content.startsWith('begin:vcard')) return 'contact';
    if (content.startsWith('tel:')) return 'phone';
    if (content.startsWith('mailto:')) return 'email';
    if (content.startsWith('sms:')) return 'sms';
    if (content.startsWith('wifi:')) return 'wifi';
    if (content.startsWith('begin:vevent')) return 'calendar';
    if (content.startsWith('http://') || content.startsWith('https://')) {
      if (content.includes('play.google.com')) return 'playstore';
      if (content.includes('whatsapp.com')) return 'whatsapp';
      return 'link';
    }
    
    // Try to detect if it's a valid barcode format
    if (/^\d+$/.test(content)) {
      const length = content.length;
      if (length === 8 || length === 12) return 'upc';
      if (length === 13) return 'ean13';
      return 'barcode';
    }
    
    return 'text';
  };

  const selectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`fixed inset-0 bg-white z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 flex items-center border-b">
          <button 
            className="mr-4"
            onClick={onClose}
          >
            <i className="bi bi-arrow-left text-2xl"></i>
          </button>
          <h2 className="text-xl font-bold">Scan Image</h2>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div id="image-scanner-reader" style={{ display: 'none' }}></div>
          
          {previewUrl ? (
            <div className="w-full max-w-md">
              <div className="relative rounded-xl overflow-hidden shadow-md mb-6 aspect-square">
                <img 
                  src={previewUrl} 
                  alt="Selected image" 
                  className="w-full h-full object-contain"
                />
                {scanning && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                      <p>Scanning...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button 
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl"
                  onClick={() => {
                    setPreviewUrl(null);
                    setError(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Select Another
                </button>
                <button 
                  className="flex-1 bg-[#18b08c] text-white py-3 rounded-xl"
                  onClick={() => previewUrl && scanImage(previewUrl)}
                  disabled={scanning}
                >
                  {scanning ? 'Scanning...' : 'Scan Again'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                <i className="bi bi-image text-blue-500 text-5xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Select an Image</h3>
              <p className="text-gray-600 mb-6">Choose an image containing a QR code or barcode</p>
              <button 
                className="bg-[#18b08c] text-white py-3 px-8 rounded-xl"
                onClick={selectImage}
              >
                Choose Image
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageScanner;