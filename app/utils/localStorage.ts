// Utility functions for Local Storage management

export const LocalStorageKeys = {
  CART: 'shopping-cart',
  ORDERS: 'order-history',
  USER_PREFERENCES: 'user-preferences'
} as const;

// Safe localStorage operations with error handling
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Clear all app data (useful for development/testing)
export const clearAllAppData = (): void => {
  Object.values(LocalStorageKeys).forEach(key => {
    storage.remove(key);
  });
};

// Check localStorage quota
export const getStorageInfo = () => {
  if (typeof window === 'undefined') {
    return { used: 0, remaining: 0, total: 0 };
  }

  let used = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }

  // Approximate values - browsers typically allow 5-10MB
  const total = 5 * 1024 * 1024; // 5MB approximation
  const remaining = total - used;

  return {
    used: Math.round(used / 1024), // KB
    remaining: Math.round(remaining / 1024), // KB
    total: Math.round(total / 1024) // KB
  };
};
