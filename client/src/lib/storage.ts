export interface HistoryItem {
  id: string;
  type: string;
  title: string;
  content: string;
  createdAt: number;
  isFavorite: boolean;
  category: 'scanned' | 'created';
  iconType: string;
}

// Get history items from local storage
export const getHistoryItems = (): HistoryItem[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const items = localStorage.getItem('qr-history');
      return items ? JSON.parse(items) : [];
    }
    return [];
  } catch (error) {
    console.error('Error getting history from local storage:', error);
    return [];
  }
};

// Add a new history item to local storage
export const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'createdAt'>) => {
  try {
    const items = getHistoryItems();
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    
    const updatedItems = [newItem, ...items];
    localStorage.setItem('qr-history', JSON.stringify(updatedItems));
    return newItem;
  } catch (error) {
    console.error('Error adding history item to local storage:', error);
    return null;
  }
};

// Toggle favorite status of a history item
export const toggleFavorite = (id: string) => {
  try {
    const items = getHistoryItems();
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    localStorage.setItem('qr-history', JSON.stringify(updatedItems));
    return updatedItems;
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    return null;
  }
};

// Delete a history item from local storage
export const deleteHistoryItem = (id: string) => {
  try {
    const items = getHistoryItems();
    const updatedItems = items.filter(item => item.id !== id);
    localStorage.setItem('qr-history', JSON.stringify(updatedItems));
    return updatedItems;
  } catch (error) {
    console.error('Error deleting history item:', error);
    return null;
  }
};

// Clear all history items
export const clearHistory = () => {
  try {
    localStorage.setItem('qr-history', JSON.stringify([]));
    return [];
  } catch (error) {
    console.error('Error clearing history:', error);
    return null;
  }
};

// Get user settings from local storage
export const getSettings = () => {
  const defaultSettings = {
    theme: 'light',
    saveHistory: true,
    vibration: true,
    sound: true,
    autoOpen: true,
    autoCopy: false
  };
  
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const settings = localStorage.getItem('qr-settings');
      return settings ? JSON.parse(settings) : defaultSettings;
    }
    return defaultSettings;
  } catch (error) {
    console.error('Error getting settings from local storage:', error);
    return defaultSettings;
  }
};

// Save user settings to local storage
export const saveSettings = (settings: any) => {
  try {
    localStorage.setItem('qr-settings', JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings to local storage:', error);
    return false;
  }
};