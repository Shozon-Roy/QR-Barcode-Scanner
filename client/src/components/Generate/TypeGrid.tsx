import { 
  User, Phone, Mail, MessageCircle, Link2, Type, Wifi, Calendar, ShoppingBag,
  Barcode, ScanBarcode, Hash, QrCode
} from 'lucide-react';

interface TypeGridProps {
  type: 'qr' | 'barcode';
  onSelect: (typeName: string) => void;
}

interface TypeOption {
  icon: React.ReactNode;
  name: string;
  gradient: string;
  description?: string;
}

const TypeGrid = ({ type, onSelect }: TypeGridProps) => {
  const qrTypes: TypeOption[] = [
    { 
      icon: <User size={22} />, 
      name: 'Contact',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Contact information'
    },
    { 
      icon: <Phone size={22} />, 
      name: 'Phone',
      gradient: 'from-rose-500 to-rose-600',
      description: 'Phone number'
    },
    { 
      icon: <Mail size={22} />, 
      name: 'Email',
      gradient: 'from-amber-500 to-amber-600',
      description: 'Email address'
    },
    { 
      icon: <MessageCircle size={22} />, 
      name: 'SMS',
      gradient: 'from-sky-500 to-sky-600',
      description: 'Text message'
    },
    { 
      icon: <Link2 size={22} />, 
      name: 'Link',
      gradient: 'from-blue-400 to-blue-500',
      description: 'Website URL'
    },
    { 
      icon: <Type size={22} />, 
      name: 'Text',
      gradient: 'from-yellow-500 to-yellow-600',
      description: 'Plain text'
    },
    { 
      icon: <Wifi size={22} />, 
      name: 'WiFi',
      gradient: 'from-blue-500 to-blue-600',
      description: 'WiFi credentials'
    },
    { 
      icon: <Calendar size={22} />, 
      name: 'Calendar',
      gradient: 'from-orange-500 to-orange-600',
      description: 'Calendar event'
    },
    { 
      icon: <ShoppingBag size={22} />, 
      name: 'Play Store',
      gradient: 'from-indigo-500 to-indigo-600',
      description: 'App link'
    },
  ];

  const barcodeTypes: TypeOption[] = [
    { 
      icon: <ScanBarcode size={22} />, 
      name: 'UPC',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Universal Product Code'
    },
    { 
      icon: <Barcode size={22} />, 
      name: 'EAN-13',
      gradient: 'from-purple-500 to-purple-600',
      description: 'International standard'
    },
    { 
      icon: <Hash size={22} />, 
      name: 'CODE-39',
      gradient: 'from-teal-500 to-teal-600',
      description: 'Variable length'
    },
  ];

  const types = type === 'qr' ? qrTypes : barcodeTypes;

  return (
    <div className="grid grid-cols-3 gap-4 mb-10">
      {types.map((item, index) => (
        <button 
          key={`${type}-${index}`} 
          className="bg-card dark:bg-card/80 hover:bg-secondary/50 dark:hover:bg-accent/10
                    rounded-2xl p-3 flex flex-col items-center justify-center
                    shadow-sm hover:shadow-md transition-all duration-300
                    hover:translate-y-[-2px] active:translate-y-[1px]
                    border border-border/40"
          onClick={() => onSelect(item.name)}
        >
          <div 
            className={`flex items-center justify-center w-12 h-12 rounded-full mb-2.5 text-white
                        bg-gradient-to-br ${item.gradient} shadow-sm`}
          >
            {item.icon}
          </div>
          <span className="text-sm font-medium text-foreground">{item.name}</span>
        </button>
      ))}
    </div>
  );
};

export default TypeGrid;
