import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getSettings, saveSettings } from '@/lib/storage';

interface SettingsTabProps {
  isActive: boolean;
}

const SettingsTab = ({ isActive }: SettingsTabProps) => {
  const { toast } = useToast();
  const [theme, setTheme] = useState('light');
  const [saveHistory, setSaveHistory] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [sound, setSound] = useState(true);
  const [autoOpenWebsite, setAutoOpenWebsite] = useState(true);
  const [autoCopyToClipboard, setAutoCopyToClipboard] = useState(false);
  
  // Load settings from local storage
  useEffect(() => {
    if (isActive) {
      const settings = getSettings();
      setTheme(settings.theme || 'light');
      setSaveHistory(settings.saveHistory !== false);
      setVibration(settings.vibration !== false);
      setSound(settings.sound !== false);
      setAutoOpenWebsite(settings.autoOpenWebsite !== false);
      setAutoCopyToClipboard(settings.autoCopyToClipboard || false);
    }
  }, [isActive]);
  
  // Save settings when changed
  const updateSettings = (key: string, value: any) => {
    const currentSettings = getSettings();
    const newSettings = { ...currentSettings, [key]: value };
    
    // Save to local storage
    saveSettings(newSettings);
    
    // Apply changes immediately if needed
    if (key === 'theme') {
      if (value === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Show toast
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated",
      duration: 2000,
    });
  };
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    updateSettings('theme', newTheme);
  };
  
  const toggleSetting = (key: string, value: boolean) => {
    switch(key) {
      case 'saveHistory':
        setSaveHistory(value);
        break;
      case 'vibration':
        setVibration(value);
        break;
      case 'sound':
        setSound(value);
        break;
      case 'autoOpenWebsite':
        setAutoOpenWebsite(value);
        break;
      case 'autoCopyToClipboard':
        setAutoCopyToClipboard(value);
        break;
    }
    
    updateSettings(key, value);
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR & Barcode Scanner/Generator',
          text: 'Check out this amazing QR code and barcode scanner/generator app!',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support sharing. Please copy the link manually.",
        variant: "destructive",
      });
    }
  };
  
  const handleRateApp = () => {
    // In a real app, this would open the app store or a review form
    // For now, just show a toast
    toast({
      title: "Thanks for your support!",
      description: "Rating functionality would open the app store in a real app.",
    });
  };
  
  const handleFeedback = () => {
    // Open email client with pre-filled subject
    window.location.href = 'mailto:feedback@qrapp.example.com?subject=QR%20App%20Feedback';
  };

  return (
    <div className={`${isActive ? "opacity-100" : "opacity-0 hidden"} transition-opacity duration-300`} id="settings-tab-content">
      <div className="px-5 pt-2 pb-20">
        <h2 className="text-xl font-bold mb-5">Settings</h2>
        
        {/* Appearance Section */}
        <div className="premium-card mb-5">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground">Appearance</h3>
          </div>
          
          <div className="mb-2">
            <label className="block text-foreground/90 text-sm mb-3">Choose your preferred theme mode</label>
            <div className="glass-card p-1.5 flex rounded-xl">
              <button 
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  theme === 'light' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'hover:bg-secondary/50 text-foreground/90'
                }`}
                onClick={() => handleThemeChange('light')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </svg>
                <span className="font-medium">Light</span>
              </button>
              <button 
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'hover:bg-secondary/50 text-foreground/90'
                }`}
                onClick={() => handleThemeChange('dark')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </svg>
                <span className="font-medium">Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scanning Preferences */}
        <div className="premium-card mb-5">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                <rect x="7" y="7" width="10" height="10" rx="2"></rect>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground">Scanning Options</h3>
          </div>
          
          <div className="space-y-4">
            <div className="settings-item">
              <div>
                <span className="text-foreground/90 font-medium">Auto Open Website</span>
                <p className="text-xs text-muted-foreground mt-0.5">Automatically open URLs when scanned</p>
              </div>
              <button 
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                  autoOpenWebsite ? 'bg-primary' : 'bg-secondary dark:bg-muted'
                }`}
                onClick={() => toggleSetting('autoOpenWebsite', !autoOpenWebsite)}
              >
                <span 
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    autoOpenWebsite ? 'right-1' : 'left-1'
                  }`}
                ></span>
              </button>
            </div>
            
            <div className="settings-item">
              <div>
                <span className="text-foreground/90 font-medium">Auto Copy to Clipboard</span>
                <p className="text-xs text-muted-foreground mt-0.5">Copy scan results automatically</p>
              </div>
              <button 
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                  autoCopyToClipboard ? 'bg-primary' : 'bg-secondary dark:bg-muted'
                }`}
                onClick={() => toggleSetting('autoCopyToClipboard', !autoCopyToClipboard)}
              >
                <span 
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    autoCopyToClipboard ? 'right-1' : 'left-1'
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </div>
        
        {/* General Preferences */}
        <div className="premium-card mb-5">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground">General Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="settings-item">
              <div>
                <span className="text-foreground/90 font-medium">Save History</span>
                <p className="text-xs text-muted-foreground mt-0.5">Save scanned and created codes</p>
              </div>
              <button 
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                  saveHistory ? 'bg-primary' : 'bg-secondary dark:bg-muted'
                }`}
                onClick={() => toggleSetting('saveHistory', !saveHistory)}
              >
                <span 
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    saveHistory ? 'right-1' : 'left-1'
                  }`}
                ></span>
              </button>
            </div>
            
            <div className="settings-item">
              <div>
                <span className="text-foreground/90 font-medium">Vibration Feedback</span>
                <p className="text-xs text-muted-foreground mt-0.5">Haptic feedback when scanning</p>
              </div>
              <button 
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                  vibration ? 'bg-primary' : 'bg-secondary dark:bg-muted'
                }`}
                onClick={() => toggleSetting('vibration', !vibration)}
              >
                <span 
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    vibration ? 'right-1' : 'left-1'
                  }`}
                ></span>
              </button>
            </div>
            
            <div className="settings-item">
              <div>
                <span className="text-foreground/90 font-medium">Sound Effects</span>
                <p className="text-xs text-muted-foreground mt-0.5">Play sound on scan completion</p>
              </div>
              <button 
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                  sound ? 'bg-primary' : 'bg-secondary dark:bg-muted'
                }`}
                onClick={() => toggleSetting('sound', !sound)}
              >
                <span 
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    sound ? 'right-1' : 'left-1'
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </div>

        {/* Help & Feedback */}
        <div className="premium-card mb-5">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground">Help & Feedback</h3>
          </div>
          
          <div className="space-y-3">
            <button 
              className="settings-item hover:translate-x-1 rounded-xl"
              onClick={handleFeedback}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-500 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <span className="text-foreground/90 font-medium">Send Feedback</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
            
            <button 
              className="settings-item hover:translate-x-1 rounded-xl"
              onClick={handleRateApp}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-500 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <span className="text-foreground/90 font-medium">Rate This App</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
            
            <button 
              className="settings-item hover:translate-x-1 rounded-xl"
              onClick={handleShare}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-500 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </div>
                <span className="text-foreground/90 font-medium">Share with Friends</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* About */}
        <div className="premium-card mb-5">
          <div className="text-center mb-5 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10 rounded-xl"></div>
            <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <rect x="7" y="7" width="3" height="3"></rect>
                <rect x="14" y="7" width="3" height="3"></rect>
                <rect x="7" y="14" width="3" height="3"></rect>
                <rect x="14" y="14" width="3" height="3"></rect>
              </svg>
            </div>
            <h3 className="font-bold text-xl text-foreground mb-0.5">QR & Barcode Scanner</h3>
            <p className="text-muted-foreground text-sm">Version 1.0.0</p>
          </div>
          
          <div className="space-y-3">
            <button className="settings-item hover:translate-x-1 rounded-xl">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-500 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <span className="text-foreground/90 font-medium">Privacy Policy</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
            
            <button className="settings-item hover:translate-x-1 rounded-xl">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-500 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <span className="text-foreground/90 font-medium">Terms of Service</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
            
            <button className="settings-item hover:translate-x-1 rounded-xl">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center text-cyan-500 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <span className="text-foreground/90 font-medium">Open Source Licenses</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
          </div>
          
          <div className="border-t border-border/60 mt-5 pt-4">
            <p className="text-muted-foreground text-xs text-center">© 2025 QR & Barcode Scanner. All Rights Reserved.</p>
            <p className="text-muted-foreground text-xs text-center mt-1">Made with 💖 by Shozon Roy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;