import { useState, useEffect } from 'react';
import HistoryItem from './HistoryItem';
import { getHistoryItems, toggleFavorite, deleteHistoryItem, clearHistory, HistoryItem as HistoryItemType } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Share, Edit, Trash } from 'lucide-react';

interface HistoryTabProps {
  isActive: boolean;
}

export type HistorySubTab = 'scanned' | 'created' | 'favorites';

const HistoryTab = ({ isActive }: HistoryTabProps) => {
  const [activeSubTab, setActiveSubTab] = useState<HistorySubTab>('created');
  const [historyItems, setHistoryItems] = useState<HistoryItemType[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load history items from local storage when tab becomes active
    if (isActive) {
      loadHistoryItems();
    }
  }, [isActive, activeSubTab]);
  
  const loadHistoryItems = () => {
    const items = getHistoryItems();
    
    // Filter items based on active tab
    let filteredItems = items;
    
    if (activeSubTab === 'scanned') {
      filteredItems = items.filter(item => item.category === 'scanned');
    } else if (activeSubTab === 'created') {
      filteredItems = items.filter(item => item.category === 'created');
    } else if (activeSubTab === 'favorites') {
      filteredItems = items.filter(item => item.isFavorite);
    }
    
    setHistoryItems(filteredItems);
  };
  
  const handleMoreOptions = (item: HistoryItemType) => {
    // In a real app, this would open a dropdown or modal with options
    // For now, we'll just toggle favorite status
    const updatedItems = toggleFavorite(item.id);
    
    if (updatedItems) {
      toast({
        title: item.isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `${item.title} has been ${item.isFavorite ? 'removed from' : 'added to'} favorites`,
      });
      
      loadHistoryItems();
    }
  };
  
  const handleEditItem = (item: HistoryItemType) => {
    // This would open an edit modal in a full implementation
    // For now, we'll just show a toast notification
    toast({
      title: "Edit Item",
      description: `Editing "${item.title}" - This feature will be implemented soon`,
    });
  };

  const handleShareItem = (item: HistoryItemType) => {
    // This would open a share dialog in a full implementation
    // For now, we'll just show a toast notification
    toast({
      title: "Share Item",
      description: `Sharing "${item.title}" - This feature will be implemented soon`,
    });
  };
  
  const handleDeleteItem = (id: string) => {
    const updatedItems = deleteHistoryItem(id);
    
    if (updatedItems) {
      toast({
        title: "Item Deleted",
        description: "The item has been removed from history",
      });
      
      loadHistoryItems();
    }
  };
  
  const handleClearHistory = () => {
    clearHistory();
    loadHistoryItems();
    
    toast({
      title: "History Cleared",
      description: "All history items have been removed",
    });
  };
  
  return (
    <div className={isActive ? "block" : "hidden"} id="history-tab-content">
      {/* History Tabs */}
      <div className="flex border-b border-gray-100 mb-3">
        <button 
          className={`history-tab-btn ${activeSubTab === 'scanned' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('scanned')}
        >
          Scanned
          {activeSubTab === 'scanned' && (
            <span className="absolute bottom-0 left-[15%] right-[15%] h-[3.5px] bg-[#18b08c] rounded-t-sm"></span>
          )}
        </button>
        <button 
          className={`history-tab-btn ${activeSubTab === 'created' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('created')}
        >
          Created
          {activeSubTab === 'created' && (
            <span className="absolute bottom-0 left-[15%] right-[15%] h-[3.5px] bg-[#18b08c] rounded-t-sm"></span>
          )}
        </button>
        <button 
          className={`history-tab-btn ${activeSubTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('favorites')}
        >
          Favorites
          {activeSubTab === 'favorites' && (
            <span className="absolute bottom-0 left-[15%] right-[15%] h-[3.5px] bg-[#18b08c] rounded-t-sm"></span>
          )}
        </button>
      </div>
      
      {/* History List */}
      <div className="px-3.5">
        {historyItems.length > 0 ? (
          <>
            {historyItems.map((item, index) => (
              <HistoryItem 
                key={item.id || index}
                icon={item.iconType}
                iconBg={getIconBgColor(item.type)}
                title={item.title}
                description={getTruncatedContent(item.content)}
                onMoreClick={() => handleMoreOptions(item)}
                isFavorite={item.isFavorite}
                onEdit={() => handleEditItem(item)}
                onShare={() => handleShareItem(item)}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
            
            {/* Clear History Button */}
            <div className="mt-6 mb-8 text-center">
              <button 
                className="text-red-500 text-sm font-medium"
                onClick={handleClearHistory}
              >
                Clear History
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-clock-history text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No History Yet</h3>
            <p className="text-gray-500 mt-1">
              {activeSubTab === 'scanned' ? 'Scan QR codes or barcodes to see them here.' : 
               activeSubTab === 'created' ? 'Create QR codes or barcodes to see them here.' :
               'Add items to favorites to see them here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get background color for icon based on type
const getIconBgColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    qrcode: '#e4f3ff',
    barcode: '#e7faff',
    contact: '#e4f3ff',
    phone: '#ffe4e4',
    email: '#fff4e0',
    sms: '#e0f0ff',
    link: '#e8f8ff',
    text: '#fffbe7',
    wifi: '#e4f3ff',
    calendar: '#fff0e0',
    playstore: '#f0f8ff',
    whatsapp: '#e6fbea',
    upc: '#e7faff',
    ean13: '#e7faff',
    code39: '#e7faff'
  };
  
  return colorMap[type.toLowerCase()] || '#f5f5f5';
};

// Helper function to truncate content for display
const getTruncatedContent = (content: string): string => {
  // Truncate to 30 characters
  if (content.length <= 30) return content;
  return content.substring(0, 27) + '...';
};

export default HistoryTab;
