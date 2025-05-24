import { useEffect, useRef, useState } from 'react';
// @ts-ignore - Import the module with the proper HTML5QrCode class
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { addHistoryItem } from '@/lib/storage';
import { getIconForType } from '@/lib/qrService';
import { Camera, Flashlight, FlashlightOff, CameraOff, RefreshCw, ZoomIn, X } from 'lucide-react';

interface CameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (result: string) => void;
}

const CameraScanner = ({ isOpen, onClose, onScanSuccess }: CameraScannerProps) => {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const scannerRef = useRef<any>(null);
  const videoElemId = "qr-reader-video";
  const scannerID = "scanner-container";
  
  // Request camera permission only once when component mounts
  useEffect(() => {
    if (!isOpen) return;
    
    // If we already have permission, don't request it again
    if (permission === true) {
      cleanupScanner();
      setTimeout(setupScanner, 300);
      return;
    }
    
    // Only request permission if we haven't already
    if (permission === null) {
      // Request camera permissions - just once for any camera
      navigator.mediaDevices.getUserMedia({
        video: true
      })
      .then(() => {
        setPermission(true);
        // Wait for DOM to be ready
        setTimeout(setupScanner, 300);
      })
      .catch((err) => {
        console.error('Camera access error:', err);
        setPermission(false);
        setError('Camera access was denied. Please check your browser permissions.');
      });
    }
    
    // Cleanup on unmount
    return cleanupScanner;
  }, [isOpen]);
  
  // Separate effect to handle camera switching (but only if we already have permission)
  useEffect(() => {
    if (!isOpen || permission !== true) return;
    
    cleanupScanner();
    setTimeout(setupScanner, 300);
    
  }, [isFrontCamera]);
  
  // Clean up scanner resources
  const cleanupScanner = () => {
    if (scannerRef.current) {
      try {
        // Only try to stop if it's actually running
        if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
          scannerRef.current.stop();
        }
      } catch (error) {
        console.error('Error cleaning up scanner:', error);
      }
      scannerRef.current = null;
    }
    setScanning(false);
  };
  
  // Set up a fresh scanner instance
  const setupScanner = () => {
    try {
      // Create scanner instance
      scannerRef.current = new Html5Qrcode(scannerID);
      startScanner();
    } catch (err) {
      console.error('Error setting up scanner:', err);
      setError('Could not initialize scanner. Please try again or check your camera permissions.');
    }
  };

  const startScanner = () => {
    if (!scannerRef.current) return;
    
    setScanning(true);
    setError(null);
    
    // Configure scanner with optimal settings
    const config = { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      disableFlip: false,
      formatsToSupport: ['QR_CODE', 'CODE_128', 'EAN_13', 'UPC_A']
    };
    
    // Use simple camera configuration
    const cameraConfig = {
      facingMode: isFrontCamera ? 'user' : 'environment'
    };
    
    // Start scanning
    scannerRef.current.start(
      cameraConfig,
      config,
      handleScanSuccess,
      handleScanFailure
    ).catch((err: any) => {
      console.error('Error starting scanner:', err);
      setError('Could not access camera. Please check your device permissions or try a different browser.');
      setScanning(false);
    });
  };

  const handleScanSuccess = (decodedText: string, decodedResult: any) => {
    if (!scannerRef.current) return;
    
    // Play a success sound or vibration if needed
    // navigator.vibrate(100); // Vibrate for 100ms

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

    // Stop scanner
    scannerRef.current.stop()
      .then(() => {
        scannerRef.current = null;
        setScanning(false);
        // Pass result to parent component
        onScanSuccess(decodedText);
      })
      .catch((err: any) => console.error('Error stopping scanner after success:', err));
  };

  const handleScanFailure = (error: any) => {
    // Scanner is still looking for codes, no need to handle most errors
    console.debug('Scan error (continuing):', error);
  };

  // Toggle between front and back camera
  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
    // Camera change will trigger useEffect to restart scanner
  };

  // Toggle flashlight (torch) mode - simplified version
  const toggleFlashlight = async () => {
    if (!scannerRef.current) return;

    try {
      if (isFlashlightOn) {
        await scannerRef.current.disableTorch();
      } else {
        await scannerRef.current.enableTorch();
      }
      setIsFlashlightOn(!isFlashlightOn);
    } catch (err: any) {
      console.error('Error toggling flashlight:', err);
      setError('Flashlight is not available on this device or browser.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Apply zoom level changes to the camera
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoomLevel(newZoom);
    
    if (scannerRef.current) {
      try {
        // Try to get the video track and set constraints
        const videoElement = document.getElementById(scannerID)?.querySelector('video');
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject as MediaStream;
          const videoTracks = stream.getVideoTracks();
          
          if (videoTracks.length > 0) {
            const track = videoTracks[0];
            // Get current capabilities
            const capabilities = track.getCapabilities();
            
            // Check if zoom is supported
            if (capabilities.zoom) {
              // Apply zoom constraint
              track.applyConstraints({
                advanced: [{ zoom: newZoom }]
              }).catch(err => {
                console.log('Zoom not supported on this device/browser:', err);
              });
            }
          }
        }
      } catch (err) {
        console.log('Failed to apply zoom:', err);
      }
    }
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

  return (
    <div className={`fixed inset-0 bg-black z-50 flex flex-col ${isOpen ? 'block' : 'hidden'}`}>
      {/* Scanner viewport */}
      <div className="flex-1 relative">
        {permission === false && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-black">
            <div className="bg-white p-6 rounded-xl max-w-xs text-center">
              <CameraOff className="mx-auto w-12 h-12 text-red-500 mb-3" />
              <p className="text-gray-800">{error || 'Camera access is required to scan codes.'}</p>
              <button 
                className="mt-4 bg-[#18b08c] text-white py-2 px-4 rounded-lg"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {error && permission !== false && (
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center z-10">
            {error}
          </div>
        )}

        {permission === true && (
          <>
            {/* Scanner container - main container for the camera feed */}
            <div 
              id="scanner-container"
              className="w-full h-full flex items-center justify-center bg-gray-900"
            ></div>
            
            {/* Scan overlay with target area */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-white rounded-lg flex items-center justify-center">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#18b08c] rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-[#18b08c] rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-[#18b08c] rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#18b08c] rounded-br-lg"></div>
              </div>
            </div>

            {/* Zoom control slider (positioned at top) */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-center bg-black/50 p-2 rounded-full">
              <ZoomIn className="w-5 h-5 text-white mr-2" />
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="0.1" 
                value={zoomLevel} 
                onChange={handleZoomChange}
                className="w-full h-2 bg-gray-500 rounded-full appearance-none cursor-pointer"
              />
              <span className="text-white text-sm ml-2">{zoomLevel.toFixed(1)}x</span>
            </div>

            {/* Camera controls (positioned at sides) */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-4">
              <button 
                className={`rounded-full p-3 ${isFlashlightOn ? 'bg-yellow-500' : 'bg-gray-800'} text-white`}
                onClick={toggleFlashlight}
              >
                {isFlashlightOn ? <FlashlightOff className="w-6 h-6" /> : <Flashlight className="w-6 h-6" />}
              </button>
              
              <button 
                className="bg-gray-800 rounded-full p-3 text-white"
                onClick={toggleCamera}
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom controls */}
      <div className="bg-black p-4 flex items-center justify-center">
        <button 
          className="bg-white w-16 h-16 rounded-full flex items-center justify-center"
          onClick={onClose}
        >
          <X size={24} className="text-black" />
        </button>
      </div>

      {/* Camera status indicator */}
      {scanning && (
        <div className="absolute bottom-24 left-0 right-0 flex items-center justify-center">
          <span className="bg-black/70 text-white px-4 py-1 rounded-full text-sm flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
            {isFrontCamera ? "Front Camera" : "Back Camera"}
          </span>
        </div>
      )}
    </div>
  );
};

export default CameraScanner;