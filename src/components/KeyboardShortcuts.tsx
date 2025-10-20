import React, { useEffect } from 'react';

interface Shortcut {
  keys: string[];
  description: string;
  category: 'Navigation' | 'Actions' | 'General';
}

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * KeyboardShortcuts Component
 * 
 * Shows all available keyboard shortcuts
 * Organized by category
 * Platform-specific (Cmd vs Ctrl)
 * Accessible via "?" key
 */
const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isOpen, onClose }) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const shortcuts: Shortcut[] = [
    // Navigation
    { keys: [modKey, 'K'], description: 'Open command palette', category: 'Navigation' },
    { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Navigation' },
    { keys: ['Esc'], description: 'Close modals/panels', category: 'Navigation' },
    
    // Actions
    { keys: [modKey, '/'], description: 'Add new entry (if available)', category: 'Actions' },
    { keys: [modKey, 'N'], description: 'Create new project', category: 'Actions' },
    { keys: [modKey, 'S'], description: 'Save/Submit form', category: 'Actions' },
    
    // General
    { keys: [modKey, 'T'], description: 'Toggle theme', category: 'General' },
    { keys: ['Tab'], description: 'Navigate between fields', category: 'General' },
    { keys: ['Enter'], description: 'Confirm action', category: 'General' },
  ];

  const categories = ['Navigation', 'Actions', 'General'] as const;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#252837] rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
          style={{
            animation: 'slideInDown 0.2s ease-out',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#2D3040]">
            <div>
              <h2 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB]">
                Keyboard Shortcuts
              </h2>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                Boost your productivity with these shortcuts
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#2D3040] transition-colors"
              aria-label="Close shortcuts panel"
            >
              <svg
                className="w-5 h-5 text-[#6B7280] dark:text-[#9CA3AF]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {categories.map((category) => {
              const categoryShortcuts = shortcuts.filter(s => s.category === category);
              if (categoryShortcuts.length === 0) return null;

              return (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#2D3040] transition-colors"
                      >
                        <span className="text-sm text-[#111827] dark:text-[#F9FAFB]">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIdx) => (
                            <React.Fragment key={keyIdx}>
                              <kbd className="px-2 py-1 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] bg-[#F3F4F6] dark:bg-[#2D3040] rounded border border-[#E5E7EB] dark:border-[#3D4254] min-w-[2rem] text-center">
                                {key}
                              </kbd>
                              {keyIdx < shortcut.keys.length - 1 && (
                                <span className="text-[#9CA3AF] dark:text-[#6B7280] text-xs">+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#E5E7EB] dark:border-[#2D3040] bg-[#F9FAFB] dark:bg-[#1F2235]">
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] text-center">
              Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#252837] rounded border border-[#E5E7EB] dark:border-[#2D3040] text-[#111827] dark:text-[#F9FAFB] font-semibold">Esc</kbd> to close
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeyboardShortcuts;

/**
 * Hook to manage keyboard shortcuts panel
 */
export const useKeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with "?" key (shift + /)
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        // Don't trigger if typing in input/textarea
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
};

