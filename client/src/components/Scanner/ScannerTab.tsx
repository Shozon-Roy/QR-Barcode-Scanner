import { useState, useEffect } from 'react';
import VipCard from './VipCard';
import ScannerCard from './ScannerCard';
import CameraScanner from './CameraScanner';
import ImageScanner from './ImageScanner';
import { useToast } from '@/hooks/use-toast';
import { Camera, Image as ImageIcon, ClipboardCheck, ExternalLink } from 'lucide-react';
import { addHistoryItem } from '@/lib/storage';
import { getSettings } from '@/lib/storage';

interface ScannerTabProps {
  isActive: boolean;
}

const ScannerTab = ({ isActive }: ScannerTabProps) => {
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [showImageScanner, setShowImageScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleScanSuccess = (result: string) => {
    // Save result
    setScanResult(result);
    
    // Get user settings
    const settings = getSettings();
    
    // Add to history if enabled
    if (settings.saveHistory) {
      addHistoryItem({
        type: 'qr',
        title: 'Scanned Code',
        content: result,
        isFavorite: false,
        category: 'scanned',
        iconType: 'qr'
      });
    }
    
    // Auto copy to clipboard if enabled
    if (settings.autoCopy && navigator.clipboard) {
      navigator.clipboard.writeText(result)
        .then(() => {
          setCopied(true);
        })
        .catch(() => {
          // Silently fail if clipboard access is denied
        });
    }
    
    // Show toast notification with success animation
    toast({
      title: "Scan Successful",
      description: "Code content has been saved to history",
      className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none",
    });
    
    // Auto open URL if it's a web address and setting is enabled
    if (settings.autoOpen && (result.startsWith('http://') || result.startsWith('https://'))) {
      // Show toast with option to open
      toast({
        title: "Website Link Found",
        description: "Tap the link to open",
        action: (
          <a 
            href={result} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 py-1 px-3 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ExternalLink size={14} /> Open
          </a>
        ),
      });
    }
    
    // Close scanner
    setShowCameraScanner(false);
    setShowImageScanner(false);
  };
  
  const copyToClipboard = () => {
    if (scanResult && navigator.clipboard) {
      navigator.clipboard.writeText(scanResult)
        .then(() => {
          setCopied(true);
          toast({
            title: "Copied to clipboard",
            variant: "success",
          });
        });
    }
  };

  return (
    <div className={`${isActive ? "opacity-100" : "opacity-0 hidden"} transition-opacity duration-300`} id="scanner-tab-content">
      <VipCard />
      
      <div className="grid grid-cols-2 gap-4 px-5 mt-3">
        <ScannerCard 
          type="scanner"
          title="Camera Scan"
          description="Scan using camera"
          icon="camera"
          onClick={() => setShowCameraScanner(true)}
        />
        
        <ScannerCard 
          type="scanimg"
          title="Image Scan"
          description="Scan from gallery"
          icon="image"
          onClick={() => setShowImageScanner(true)}
        />
      </div>
      
      {/* Camera Scanner Modal */}
      <CameraScanner 
        isOpen={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onScanSuccess={handleScanSuccess}
      />
      
      {/* Image Scanner Modal */}
      <ImageScanner 
        isOpen={showImageScanner}
        onClose={() => setShowImageScanner(false)}
        onScanSuccess={handleScanSuccess}
      />
      
      {/* Display last scan result if available */}
      {scanResult && (
        <div className="mt-8 mx-5 premium-card transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Last Scan Result</h3>
            <button 
              onClick={copyToClipboard} 
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Copy to clipboard"
            >
              {copied ? <ClipboardCheck size={18} /> : <ClipboardCheck size={18} />}
            </button>
          </div>
          <div className="p-4 bg-secondary/50 dark:bg-accent/10 rounded-xl overflow-hidden">
            <p className="text-foreground/90 break-all font-medium">{scanResult}</p>
          </div>
          {scanResult.startsWith('http://') || scanResult.startsWith('https://') ? (
            <a 
              href={scanResult} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-primary font-medium hover:underline"
            >
              <ExternalLink size={16} /> Open link
            </a>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ScannerTab;
