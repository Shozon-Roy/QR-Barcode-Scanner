import { useState, useEffect } from 'react';
import { TabType } from '@/lib/types';
import { Sun, Moon, HelpCircle, Crown, X, Smartphone, Zap, Shield, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface HeaderProps {
  activeTab: TabType;
}

const Header = ({ activeTab }: HeaderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Initialize theme based on system preference or saved preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);
  
  // Toggle theme function
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <div className="flex items-center justify-between px-6 pt-9 pb-4 transition-all duration-300">
      <div className="flex items-center gap-3">
        <span className="text-[1.65rem] font-bold tracking-tight bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">QR & Barcode</span>
        <button 
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary/80 text-foreground backdrop-blur-md transition-all duration-300 hover:scale-105"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      <span>
        {activeTab === 'scanner' ? (
          <button 
            onClick={() => setShowHelp(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full glass-card text-foreground transition-all duration-300 hover:scale-105"
          >
            <HelpCircle size={20} />
          </button>
        ) : (
          <button className="vip-button flex items-center gap-2">
            <Crown size={18} />
            <span>Premium</span>
          </button>
        )}
      </span>
      
      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-md mx-auto bg-background/95 backdrop-blur-xl border border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                <Smartphone size={18} className="text-white" />
              </div>
              QR & Barcode Scanner
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            {/* App Description */}
            <div className="space-y-4">
              <p className="text-foreground/80 leading-relaxed">
                A powerful and user-friendly QR code and barcode scanner app designed for all your scanning and generating needs.
              </p>
              
              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Zap size={16} className="text-blue-500" />
                  Key Features
                </h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Scan QR codes and barcodes using camera
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Upload and scan images from gallery
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Generate custom QR codes and barcodes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    History of scanned and created codes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Dark and light theme support
                  </li>
                </ul>
              </div>
              
              {/* Security */}
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Shield size={16} className="text-green-500" />
                <span>Your data is stored locally and securely</span>
              </div>
            </div>
            
            {/* Developer Credit */}
            <div className="border-t border-border/30 pt-4">
              <div className="flex items-center justify-center gap-2 text-sm text-foreground/60">
                <span>Made with</span>
                <Heart size={14} className="text-red-500 fill-red-500" />
                <span>by</span>
                <span className="font-semibold text-blue-500">Shozon Roy</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
