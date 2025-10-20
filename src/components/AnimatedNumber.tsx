import React, { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Intersection Observer to trigger animation when element is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  // Animate the number
  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = value;
    const startTime = Date.now();
    const endTime = startTime + duration;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const current = start + (end - start) * easeOutCubic;
      setCount(current);

      if (now < endTime) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, isVisible]);

  const formattedValue = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
};

export default AnimatedNumber;

