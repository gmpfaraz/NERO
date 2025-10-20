import { useState, useEffect, type RefObject } from 'react';

interface UseInViewOptions {
  threshold?: number; // 0-1, percentage of element visible
  triggerOnce?: boolean; // Only trigger animation once
  rootMargin?: string; // Margin around viewport
}

/**
 * useInView Hook
 * 
 * Detects when an element enters the viewport
 * Triggers animations using IntersectionObserver
 * Performance-optimized with cleanup
 */
export const useInView = (
  ref: RefObject<Element>,
  options: UseInViewOptions = {}
): boolean => {
  const {
    threshold = 0.2, // Trigger when 20% visible
    triggerOnce = true,
    rootMargin = '0px',
  } = options;

  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: always show for browsers without support
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        
        if (inView) {
          setIsInView(true);
          
          // If triggerOnce, disconnect observer after first trigger
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          // Only update if not triggerOnce
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, triggerOnce, rootMargin]);

  return isInView;
};

/**
 * useInViewMultiple Hook
 * 
 * For observing multiple elements at once
 * Returns a Map of element IDs to their visibility state
 */
export const useInViewMultiple = (
  refs: Map<string, RefObject<Element>>,
  options: UseInViewOptions = {}
): Map<string, boolean> => {
  const {
    threshold = 0.2,
    triggerOnce = true,
    rootMargin = '0px',
  } = options;

  const [visibilityMap, setVisibilityMap] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (refs.size === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const elementId = entry.target.getAttribute('data-observe-id');
          if (!elementId) return;

          if (entry.isIntersecting) {
            setVisibilityMap((prev) => new Map(prev).set(elementId, true));
            
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setVisibilityMap((prev) => new Map(prev).set(elementId, false));
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    refs.forEach((ref, id) => {
      if (ref.current) {
        ref.current.setAttribute('data-observe-id', id);
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [refs, threshold, triggerOnce, rootMargin]);

  return visibilityMap;
};

