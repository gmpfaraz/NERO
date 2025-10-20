export interface FilterPreset {
  id: string;
  name: string;
  entryType: 'akra' | 'ring';
  firstQuery?: string;
  secondQuery?: string;
  createdAt: string;
}

const STORAGE_KEY = 'gull-filter-presets';

export const getFilterPresets = (): FilterPreset[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading filter presets:', error);
    return [];
  }
};

export const saveFilterPreset = (preset: FilterPreset): void => {
  try {
    const presets = getFilterPresets();
    const existingIndex = presets.findIndex(p => p.id === preset.id);
    
    if (existingIndex >= 0) {
      presets[existingIndex] = preset;
    } else {
      presets.push(preset);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Error saving filter preset:', error);
  }
};

export const deleteFilterPreset = (presetId: string): void => {
  try {
    const presets = getFilterPresets();
    const filtered = presets.filter(p => p.id !== presetId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting filter preset:', error);
  }
};

export const getPresetsForType = (entryType: 'akra' | 'ring'): FilterPreset[] => {
  return getFilterPresets().filter(p => p.entryType === entryType);
};

