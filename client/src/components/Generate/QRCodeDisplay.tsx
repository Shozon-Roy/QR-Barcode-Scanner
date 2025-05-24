import { useState, useEffect } from 'react';
import { generateQRCode, generateBarcode } from '@/lib/qrService';
import { addHistoryItem } from '@/lib/storage';

interface QRCodeDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  type: 'qr' | 'barcode';
  subType: string;
}

const QRCodeDisplay = ({ isOpen, onClose, content, type, subType }: QRCodeDisplayProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && content) {
      generateCode();
    }
  }, [isOpen, content, type, subType]);

  const generateCode = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let dataUrl;
      
      if (type === 'qr') {
        dataUrl = await generateQRCode(content);
      } else {
        // For barcodes, select the appropriate format based on subType
        const format = getBarcodeFormat(subType);
        dataUrl = await generateBarcode(content, format);
      }
      
      setImageUrl(dataUrl);
      
      // Save to history
      addHistoryItem({
        type: type === 'qr' ? subType : `barcode-${subType.toLowerCase()}`,
        title: subType,
        content: content,
        category: 'created',
        isFavorite: false,
        iconType: type === 'qr' ? 'bi-qr-code' : 'bi-upc-scan'
      });
    } catch (err) {
      console.error('Error generating code:', err);
      setError('Failed to generate the code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBarcodeFormat = (subType: string): string => {
    switch (subType.toLowerCase()) {
      case 'upc':
        return 'UPC';
      case 'ean-13':
        return 'EAN13';
      case 'code-39':
        return 'CODE39';
      default:
        return 'CODE128';
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${type}-${subType}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!imageUrl || !navigator.share) return;
    
    try {
      // Convert data URL to blob
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], `${type}-code.png`, { type: 'image/png' });
      
      await navigator.share({
        title: 'My QR Code',
        text: 'Check out this QR code I created!',
        files: [file]
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className={`fixed inset-0 bg-white z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center">
            <button 
              className="mr-4"
              onClick={onClose}
            >
              <i className="bi bi-arrow-left text-2xl"></i>
            </button>
            <h2 className="text-xl font-bold">Your {type === 'qr' ? 'QR Code' : 'Barcode'}</h2>
          </div>
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100"
            onClick={handleShare}
            disabled={!imageUrl || !navigator.share}
          >
            <i className="bi bi-share text-lg"></i>
          </button>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18b08c] mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your code...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
              <i className="bi bi-exclamation-circle text-red-500 text-3xl mb-3"></i>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                className="bg-[#18b08c] text-white py-2 px-6 rounded-lg"
                onClick={generateCode}
              >
                Try Again
              </button>
            </div>
          ) : imageUrl ? (
            <div className="w-full max-w-md text-center">
              <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <img 
                  src={imageUrl} 
                  alt={`${type} code`} 
                  className="w-[250px] h-[250px] mx-auto object-contain"
                  width={250}
                  height={250}
                />
                <p className="mt-4 text-gray-700 break-all">{content}</p>
              </div>
              
              <button 
                className="w-full bg-[#18b08c] text-white py-3 rounded-xl mb-3"
                onClick={handleDownload}
              >
                Download
              </button>
              
              <button 
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl"
                onClick={() => {
                  generateCode();
                }}
              >
                Regenerate
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;