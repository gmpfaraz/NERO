import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  mode?: 'fade' | 'slide' | 'scale';
  duration?: number;
}

/**
 * PageTransition Component
 * 
 * Provides smooth page transitions between routes
 * Lightweight implementation using CSS transitions
 * No external dependencies required
 */
const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  mode = 'fade',
  duration = 300 
}) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'fadeIn' | 'fadeOut'>('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  const handleTransitionEnd = () => {
    if (transitionStage === 'fadeOut') {
      setDisplayLocation(location);
      setTransitionStage('fadeIn');
    }
  };

  const getTransitionStyles = () => {
    const baseStyles: React.CSSProperties = {
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    };

    if (mode === 'fade') {
      return {
        ...baseStyles,
        opacity: transitionStage === 'fadeIn' ? 1 : 0,
      };
    }

    if (mode === 'slide') {
      return {
        ...baseStyles,
        transform: transitionStage === 'fadeIn' 
          ? 'translateX(0)' 
          : 'translateX(-20px)',
        opacity: transitionStage === 'fadeIn' ? 1 : 0,
      };
    }

    if (mode === 'scale') {
      return {
        ...baseStyles,
        transform: transitionStage === 'fadeIn' 
          ? 'scale(1)' 
          : 'scale(0.95)',
        opacity: transitionStage === 'fadeIn' ? 1 : 0,
      };
    }

    return baseStyles;
  };

  return (
    <div
      style={getTransitionStyles()}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  );
};

export default PageTransition;

/**
 * StaggeredChildren Component
 * 
 * Staggers the entrance animation of child elements
 * Useful for grids, lists, and card layouts
 */
interface StaggeredChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggeredChildren: React.FC<StaggeredChildrenProps> = ({
  children,
  staggerDelay = 50,
  className = '',
}) => {
  const childArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <div
          key={index}
          style={{
            animation: `fadeSlideUp 0.4s ease-out ${index * staggerDelay}ms both`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

/**
 * FadeIn Component
 * 
 * Simple fade-in wrapper for any content
 * Can be used with delay for sequential animations
 */
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 400,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        animation: `fadeSlideUp ${duration}ms ease-out ${delay}ms both`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * SlideIn Component
 * 
 * Slide-in animation from specified direction
 */
interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 400,
  className = '',
}) => {
  const getAnimationName = () => {
    switch (direction) {
      case 'left': return 'slideInLeft';
      case 'right': return 'slideInRight';
      case 'down': return 'slideInDown';
      case 'up':
      default: return 'fadeSlideUp';
    }
  };

  return (
    <div
      className={className}
      style={{
        animation: `${getAnimationName()} ${duration}ms ease-out ${delay}ms both`,
      }}
    >
      {children}
    </div>
  );
};

