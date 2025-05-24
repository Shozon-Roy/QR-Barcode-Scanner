import { TabType } from '@/lib/types';
import { Scan, QrCode, History, Settings } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const BottomNavigation = ({ activeTab, setActiveTab }: BottomNavigationProps) => {
  // Highlight animation effect for active tab
  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };
  
  return (
    <nav className="bottom-nav">
      <div className="flex-1 flex flex-col items-center relative">
        {activeTab === 'scanner' && (
          <div className="absolute -top-1 w-10 h-1 rounded-full bg-primary animate-pulse"></div>
        )}
        <a 
          className={`nav-link ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('scanner');
          }}
          href="#"
          aria-label="Scanner"
        >
          <Scan size={20} className="mb-1" />
          <span className="text-xs font-medium">Scanner</span>
        </a>
      </div>
      
      <div className="flex-1 flex flex-col items-center relative">
        {activeTab === 'generate' && (
          <div className="absolute -top-1 w-10 h-1 rounded-full bg-primary animate-pulse"></div>
        )}
        <a 
          className={`nav-link ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('generate');
          }}
          href="#"
          aria-label="Generate"
        >
          <QrCode size={20} className="mb-1" />
          <span className="text-xs font-medium">Generate</span>
        </a>
      </div>
      
      <div className="flex-1 flex flex-col items-center relative">
        {activeTab === 'history' && (
          <div className="absolute -top-1 w-10 h-1 rounded-full bg-primary animate-pulse"></div>
        )}
        <a 
          className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('history');
          }}
          href="#"
          aria-label="History"
        >
          <History size={20} className="mb-1" />
          <span className="text-xs font-medium">History</span>
        </a>
      </div>
      
      <div className="flex-1 flex flex-col items-center relative">
        {activeTab === 'settings' && (
          <div className="absolute -top-1 w-10 h-1 rounded-full bg-primary animate-pulse"></div>
        )}
        <a 
          className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('settings');
          }}
          href="#"
          aria-label="Settings"
        >
          <Settings size={20} className="mb-1" />
          <span className="text-xs font-medium">Settings</span>
        </a>
      </div>
    </nav>
  );
};

export default BottomNavigation;
