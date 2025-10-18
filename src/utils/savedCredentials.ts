// Saved credentials management for quick account switching
// Note: In production, use more secure methods like secure session tokens

interface SavedCredential {
  email: string;
  // In production, don't store passwords directly. Use tokens or session IDs.
  // For now, we'll use a simple encrypted approach
  token: string;
  lastUsed: string;
}

const CREDENTIALS_KEY = 'gull-saved-credentials';
const MAX_SAVED = 10;

// Simple base64 encoding (NOT secure for production)
const encode = (str: string): string => {
  try {
    return btoa(encodeURIComponent(str));
  } catch {
    return str;
  }
};

const decode = (str: string): string => {
  try {
    return decodeURIComponent(atob(str));
  } catch {
    return str;
  }
};

export const getSavedCredentials = (): SavedCredential[] => {
  try {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading saved credentials:', error);
    return [];
  }
};

export const saveCredential = (email: string, password: string) => {
  try {
    const credentials = getSavedCredentials();
    
    // Remove if already exists
    const filtered = credentials.filter(c => c.email !== email);
    
    // Add new credential
    const newCredential: SavedCredential = {
      email,
      token: encode(password),
      lastUsed: new Date().toISOString(),
    };
    
    // Keep only MAX_SAVED most recent
    const updated = [newCredential, ...filtered].slice(0, MAX_SAVED);
    
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving credential:', error);
  }
};

export const getCredential = (email: string): string | null => {
  try {
    const credentials = getSavedCredentials();
    const found = credentials.find(c => c.email === email);
    
    if (found) {
      // Update last used
      saveCredential(email, decode(found.token));
      return decode(found.token);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting credential:', error);
    return null;
  }
};

export const removeCredential = (email: string) => {
  try {
    const credentials = getSavedCredentials();
    const filtered = credentials.filter(c => c.email !== email);
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing credential:', error);
  }
};

export const clearAllCredentials = () => {
  try {
    localStorage.removeItem(CREDENTIALS_KEY);
  } catch (error) {
    console.error('Error clearing credentials:', error);
  }
};

export const hasCredential = (email: string): boolean => {
  const credentials = getSavedCredentials();
  return credentials.some(c => c.email === email);
};

