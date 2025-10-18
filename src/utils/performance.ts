// ============================================
// PERFORMANCE UTILITIES
// ============================================

/**
 * Debounce function to limit rate of function execution
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to ensure function is called at most once per interval
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load component with retry logic
 */
export const lazyRetry = <T extends React.ComponentType<unknown>>(
  componentImport: () => Promise<{ default: T }>,
  name: string,
  retries = 3,
  interval = 1000
): Promise<{ default: T }> => {
  return new Promise((resolve, reject) => {
    componentImport()
      .then(resolve)
      .catch((error) => {
        if (retries === 0) {
          console.error(`Failed to load component: ${name}`, error);
          reject(error);
          return;
        }

        console.log(`Retrying to load ${name}... (${retries} attempts left)`);
        setTimeout(() => {
          lazyRetry(componentImport, name, retries - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
};

/**
 * Virtual scroll helper - calculate visible items
 */
export interface VirtualScrollProps {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  scrollTop: number;
  overscan?: number;
}

export interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  visibleItems: number;
}

export const calculateVirtualScroll = ({
  totalItems,
  itemHeight,
  containerHeight,
  scrollTop,
  overscan = 5,
}: VirtualScrollProps): VirtualScrollResult => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(totalItems, startIndex + visibleItems + overscan * 2);
  const offsetY = startIndex * itemHeight;

  return {
    startIndex,
    endIndex,
    offsetY,
    visibleItems,
  };
};

/**
 * Memoize expensive calculations
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T
): T & { cache: Map<string, ReturnType<T>> } {
  const cache = new Map<string, ReturnType<T>>();

  const memoized = ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T & { cache: Map<string, ReturnType<T>> };

  memoized.cache = cache;
  return memoized;
}

/**
 * Batch DOM updates
 */
export const batchDOMUpdates = (callback: () => void): void => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout: 1000 });
  } else {
    setTimeout(callback, 0);
  }
};

/**
 * Measure performance
 */
export const measurePerformance = (name: string, fn: () => void): void => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
};

/**
 * Check if device is low-end
 */
export const isLowEndDevice = (): boolean => {
  // Check navigator properties
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency;

  // Low-end if: < 4GB RAM or <= 2 cores
  if (memory && memory < 4) return true;
  if (cores && cores <= 2) return true;

  return false;
};

/**
 * Preload image
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Request animation frame with fallback
 */
export const raf = (callback: FrameRequestCallback): number => {
  return window.requestAnimationFrame
    ? window.requestAnimationFrame(callback)
    : (setTimeout(callback, 16) as unknown as number);
};

/**
 * Cancel animation frame with fallback
 */
export const cancelRaf = (id: number): void => {
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
};

/**
 * Intersection Observer helper
 */
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      root: null,
      rootMargin: '50px',
      threshold: 0.01,
      ...options,
    });
  }
  return null;
};

/**
 * Format bytes for display
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Get memory usage (if available)
 */
export const getMemoryUsage = (): {
  used: string;
  total: string;
  percentage: number;
} | null => {
  const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
  
  if (!memory) return null;

  const used = memory.usedJSHeapSize;
  const total = memory.totalJSHeapSize;
  const percentage = (used / total) * 100;

  return {
    used: formatBytes(used),
    total: formatBytes(total),
    percentage: Math.round(percentage),
  };
};

/**
 * Detect slow network
 */
export const isSlowNetwork = (): boolean => {
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  
  if (!connection || !connection.effectiveType) return false;

  return ['slow-2g', '2g'].includes(connection.effectiveType);
};

/**
 * Prefetch route/component
 */
export const prefetchRoute = (importFunction: () => Promise<unknown>): void => {
  // Prefetch during idle time
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFunction().catch(() => {
        // Silently fail - will load normally when needed
      });
    });
  }
};

