import { useState } from 'react';
import CreateCard from './CreateCard';
import TypeGrid from './TypeGrid';
import QRCodeDisplay from './QRCodeDisplay';
import { useToast } from '@/hooks/use-toast';

interface GenerateTabProps {
  isActive: boolean;
}

const GenerateTab = ({ isActive }: GenerateTabProps) => {
  const [activeTypeTab, setActiveTypeTab] = useState<'qr' | 'barcode'>('qr');
  const [qrContent, setQrContent] = useState('');
  const [showQRDisplay, setShowQRDisplay] = useState(false);
  const [selectedSubType, setSelectedSubType] = useState('Text');
  const { toast } = useToast();
  
  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        setQrContent(text);
      } else {
        toast({
          title: "Clipboard Error",
          description: "Clipboard access is not available in your browser",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      toast({
        title: "Clipboard Error",
        description: "Failed to read from clipboard",
        variant: "destructive"
      });
    }
  };
  
  const handleCreate = () => {
    if (!qrContent.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some content to generate a code",
        variant: "destructive"
      });
      return;
    }
    
    setShowQRDisplay(true);
  };
  
  const handleTypeSelect = (type: string) => {
    setSelectedSubType(type);
    
    // Set example placeholder text for each QR code type
    switch (type) {
      case 'Contact':
        setQrContent('BEGIN:VCARD\nVERSION:3.0\nN:Smith;John;;;\nFN:John Smith\nTEL:+1-555-123-4567\nEMAIL:john.smith@email.com\nORG:Company Inc\nTITLE:Manager\nURL:https://johnsmith.com\nEND:VCARD');
        break;
      case 'Phone':
        setQrContent('tel:+1-555-123-4567');
        break;
      case 'Email':
        setQrContent('mailto:example@email.com?subject=Hello&body=Hi there!');
        break;
      case 'SMS':
        setQrContent('sms:+1-555-123-4567?body=Hello, this is a text message!');
        break;
      case 'Link':
        setQrContent('https://www.example.com');
        break;
      case 'Text':
        setQrContent('This is a sample text message for QR code');
        break;
      case 'WiFi':
        setQrContent('WIFI:T:WPA;S:MyWiFiNetwork;P:mypassword123;H:false;;');
        break;
      case 'Calendar':
        setQrContent('BEGIN:VEVENT\nVERSION:2.0\nSUMMARY:Important Meeting\nDTSTART:20250601T140000Z\nDTEND:20250601T150000Z\nLOCATION:Conference Room A\nDESCRIPTION:Team quarterly review meeting\nEND:VEVENT');
        break;
      case 'Play Store':
        setQrContent('https://play.google.com/store/apps/details?id=com.example.myapp');
        break;
      default:
        setQrContent('');
        break;
    }
  };
  
  return (
    <div className={`${isActive ? "opacity-100" : "opacity-0 hidden"} transition-opacity duration-300`} id="generate-tab-content">
      <CreateCard 
        content={qrContent}
        setContent={setQrContent}
        onPaste={handlePaste}
        onCreate={handleCreate}
      />
      
      {/* QR / BarCode Tabs */}
      <div className="mx-5 flex mb-6 glass-card p-1 shadow-md">
        <button 
          className={`flex-1 py-3.5 text-center font-medium text-base rounded-xl transition-all duration-300 ${
            activeTypeTab === 'qr' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-secondary/50'
          }`}
          onClick={() => setActiveTypeTab('qr')}
        >
          QR Code
        </button>
        <button 
          className={`flex-1 py-3.5 text-center font-medium text-base rounded-xl transition-all duration-300 ${
            activeTypeTab === 'barcode' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-secondary/50'
          }`}
          onClick={() => setActiveTypeTab('barcode')}
        >
          Barcode
        </button>
      </div>
      
      <div className="px-5 mb-5">
        <h3 className="text-lg font-bold mb-3 text-foreground/90">Select {activeTypeTab === 'qr' ? 'QR Code' : 'Barcode'} Type</h3>
        
        <TypeGrid 
          type={activeTypeTab} 
          onSelect={handleTypeSelect}
        />
      </div>
      
      {/* QR Code Display Modal */}
      <QRCodeDisplay 
        isOpen={showQRDisplay}
        onClose={() => setShowQRDisplay(false)}
        content={qrContent}
        type={activeTypeTab}
        subType={selectedSubType}
      />
    </div>
  );
};

export default GenerateTab;
