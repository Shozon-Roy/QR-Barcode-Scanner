import { Camera, Image, Scan, QrCode } from 'lucide-react';

interface ScannerCardProps {
  type: 'scanner' | 'scanimg';
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

const ScannerCard = ({ type, title, description, icon, onClick }: ScannerCardProps) => {
  const gradientClass = type === 'scanner' ? 'scanner-gradient' : 'scanimg-gradient';
  
  // Get the appropriate icon component
  const IconComponent = () => {
    if (icon === 'camera') return <Camera size={28} />;
    if (icon === 'image') return <Image size={28} />;
    if (icon === 'scan') return <Scan size={28} />;
    return <QrCode size={28} />;
  };
  
  return (
    <div 
      className={`${gradientClass} rounded-[24px] p-5 text-white transition-all duration-300 
                  cursor-pointer hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[1px]
                  relative overflow-hidden`}
      onClick={onClick}
    >
      {/* Decorative curved line in background */}
      <div className="absolute right-0 top-0 w-24 h-24 opacity-10">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 0v100H0C0 44.8 44.8 0 100 0z" fill="white"/>
        </svg>
      </div>
      
      {/* Icon with glass effect */}
      <div className="flex justify-center items-center w-16 h-16 mb-4 rounded-2xl 
                    bg-white/20 backdrop-blur-sm border border-white/10 shadow-inner
                    transition-transform duration-300 hover:scale-105">
        <IconComponent />
      </div>
      
      {/* Card content */}
      <div className="relative">
        <h3 className="text-xl font-bold mb-1.5">{title}</h3>
        <p className="text-sm text-white/85">{description}</p>
      </div>
      
      {/* Action indicator */}
      <div className="absolute bottom-3 right-4 opacity-60 hover:opacity-100 transition-opacity">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default ScannerCard;
