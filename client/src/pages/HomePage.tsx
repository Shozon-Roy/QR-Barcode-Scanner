import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import ScannerTab from '@/components/Scanner/ScannerTab';
import GenerateTab from '@/components/Generate/GenerateTab';
import HistoryTab from '@/components/History/HistoryTab';
import SettingsTab from '@/components/Settings/SettingsTab';
import { TabType } from '@/lib/types';
import { getSettings } from '@/lib/storage';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('scanner');
  const [isLoaded, setIsLoaded] = useState(false);

  // Set up app on initial load
  useEffect(() => {
    // Give a small delay for smoother initial appearance
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    
    // Get settings to check if vibration is enabled
    try {
      if (typeof window !== 'undefined') {
        const settings = getSettings();
        if (settings.vibration && navigator.vibrate) {
          navigator.vibrate(50); // Short vibration feedback
        }
      }
    } catch (err) {
      // Silently handle errors
    }
  };

  return (
    <div className={`min-h-screen bg-background pb-24 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/5 -z-10"></div>
      
      <Header activeTab={activeTab} />
      
      <div className="mx-auto relative">
        <ScannerTab isActive={activeTab === 'scanner'} />
        <GenerateTab isActive={activeTab === 'generate'} />
        <HistoryTab isActive={activeTab === 'history'} />
        <SettingsTab isActive={activeTab === 'settings'} />
      </div>
      
      <BottomNavigation 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
      />
    </div>
  );
};

export default HomePage;
