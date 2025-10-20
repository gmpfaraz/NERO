import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // Animation duration in ms
  formatValue?: (value: number) => string;
  className?: string;
  style?: React.CSSProperties;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

/**
 * AnimatedCounter Component
 * 
 * Smoothly animates numbers from 0 to target value
 * Uses requestAnimationFrame for 60fps performance
 * Includes easeOutQuart easing function
 */
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  formatValue,
  className = '',
  style,
  prefix = '',
  suffix = '',
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | undefined>(undefined);
  const startValueRef = useRef<number>(0);

  // Easing function - easeOutQuart for smooth deceleration
  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  useEffect(() => {
    const startValue = displayValue;
    startValueRef.current = startValue;
    startTimeRef.current = undefined;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apply easing
      const easedProgress = easeOutQuart(progress);
      
      // Calculate current value
      const currentValue = startValue + (value - startValue) * easedProgress;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  // Format the display value
  const formattedValue = formatValue 
    ? formatValue(displayValue)
    : formatNumber(displayValue, decimals);

  return (
    <span className={className} style={style}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
};

// Format number with thousands separators and decimals
const formatNumber = (value: number, decimals: number = 0): string => {
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(value * factor) / factor;
  
  if (decimals > 0) {
    return rounded.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  
  return Math.floor(rounded).toLocaleString();
};

export default AnimatedCounter;

// Export helper function for currency formatting
export const formatCurrency = (value: number): string => {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).replace('PKR', '').trim();
};

// Export helper function for percentage formatting
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

